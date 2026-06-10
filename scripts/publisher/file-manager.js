import fs from 'fs';
import path from 'path';
import * as p from '@clack/prompts';

export function extractVideoId(input) {
  if (!input) return null;
  const trimmed = input.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  const id = match && match[2].length === 11 ? match[2] : trimmed;
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
}

export async function getEpisodeData(episodeDir, logDoctor, isDoctor) {
  const metadataPath = path.join(episodeDir, 'metadata.json');

  if (!fs.existsSync(metadataPath)) {
    if (isDoctor) logDoctor(false, `metadata.json found in ${episodeDir}`);
    else console.error(`Error: metadata.json not found in ${episodeDir}`);
    process.exit(1);
  }
  if (isDoctor) logDoctor(true, `metadata.json found in ${episodeDir}`);

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let videoId = extractVideoId(metadata.videoId);

  if (!videoId) {
    if (isDoctor) logDoctor(false, `videoId found in metadata`);

    const input = await p.text({
      message: 'Enter the YouTube Video ID (or URL):',
      placeholder: 'e.g. wIaThYaieUA',
      validate(value) {
        if (!value || !value.trim()) return 'Video ID is required.';
        if (!extractVideoId(value)) return 'Invalid YouTube Video ID or URL.';
      }
    });

    if (p.isCancel(input) || !input || !input.trim()) {
      if (!isDoctor) {
        console.error(`Error: videoId not found in ${metadataPath}.`);
      }
      process.exit(1);
    }

    videoId = extractVideoId(input);
    metadata.videoId = videoId;
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + '\n');

    if (isDoctor) {
      logDoctor(true, `videoId found in metadata: ${videoId}`);
    }
  } else {
    if (metadata.videoId !== videoId) {
      metadata.videoId = videoId;
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + '\n');
    }
    if (isDoctor) logDoctor(true, `videoId in metadata: ${videoId}`);
  }

  let titleEs = '';
  const titlePathEs = path.join(episodeDir, '2_publisher', 'youtube_title_es.txt');
  if (fs.existsSync(titlePathEs)) titleEs = fs.readFileSync(titlePathEs, 'utf8').trim();

  let titleEn = '';
  const titlePathEn = path.join(episodeDir, '2_publisher', 'youtube_title_en.txt');
  if (fs.existsSync(titlePathEn)) titleEn = fs.readFileSync(titlePathEn, 'utf8').trim();

  let descriptionEs = '';
  const descriptionPathEs = path.join(episodeDir, '2_publisher', 'youtube_description_es.md');
  if (fs.existsSync(descriptionPathEs)) descriptionEs = fs.readFileSync(descriptionPathEs, 'utf8');
  else if (!isDoctor)
    console.warn(`Warning: youtube_description_es.md not found in ${episodeDir}/2_publisher/`);

  let descriptionEn = '';
  const descriptionPathEn = path.join(episodeDir, '2_publisher', 'youtube_description_en.md');
  if (fs.existsSync(descriptionPathEn)) descriptionEn = fs.readFileSync(descriptionPathEn, 'utf8');
  else if (!isDoctor)
    console.warn(`Warning: youtube_description_en.md not found in ${episodeDir}/2_publisher/`);

  let tags = [];
  const tagsPath = path.join(episodeDir, '2_publisher', 'youtube_tags.txt');
  if (fs.existsSync(tagsPath)) {
    const tagsContent = fs.readFileSync(tagsPath, 'utf8');
    tags = tagsContent
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  } else if (metadata.tags && Array.isArray(metadata.tags)) {
    tags = metadata.tags;
  }

  return { metadata, videoId, titleEs, titleEn, descriptionEs, descriptionEn, tags };
}

export function getLocalTranscripts(episodeDir) {
  const langFiles = [
    { code: 'es', file: 'youtube_captions_es.sbv', name: 'Spanish' },
    { code: 'en', file: 'youtube_captions_en.sbv', name: 'English' }
  ];
  return langFiles.map((lang) => ({
    ...lang,
    path: path.join(episodeDir, '2_publisher', lang.file),
    exists: fs.existsSync(path.join(episodeDir, '2_publisher', lang.file))
  }));
}

export function saveCaptions(episodeDir, data) {
  const recordingDir = path.join(episodeDir, '1_recording');
  if (!fs.existsSync(recordingDir)) {
    fs.mkdirSync(recordingDir, { recursive: true });
  }
  fs.writeFileSync(path.join(recordingDir, 'youtube_captions.sbv'), data);
}
