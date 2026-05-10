const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load environment variables if running locally
require('dotenv').config();

// OAuth2 credentials
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;

// Expecting episode path as the first argument or via --episode/-e flag
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

let episodeInput = args.find(arg => !arg.startsWith('--') && !arg.startsWith('-'));

// Check for --episode or -e flag
const episodeIndex = args.findIndex(arg => arg === '--episode' || arg === '-e');
if (episodeIndex !== -1 && args[episodeIndex + 1]) {
  episodeInput = args[episodeIndex + 1];
}

if (!episodeInput) {
  console.error('Error: Episode directory or number is missing.');
  console.error('Usage:');
  console.error('  node update-youtube.js -e 89 [--dry-run]');
  console.error('  node update-youtube.js 89 [--dry-run]');
  process.exit(1);
}

// Resolution logic: if it's just a number, pad to 4 digits and prepend 'episodes/'
const episodeDir = /^\d+$/.test(episodeInput) 
  ? path.join('episodes', episodeInput.padStart(4, '0')) 
  : episodeInput;


const metadataPath = path.join(episodeDir, 'metadata.json');
const descriptionPath = path.join(episodeDir, '2_publisher', '01_description.md');
const chaptersPath = path.join(episodeDir, '2_publisher', '03_chapters.txt');

async function updateYouTubeVideo() {
  if (!fs.existsSync(metadataPath)) {
    console.error(`Error: metadata.json not found in ${episodeDir}`);
    process.exit(1);
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const videoId = metadata.videoId;

  if (!videoId) {
    console.error(`Error: videoId not found in ${metadataPath}.`);
    process.exit(1);
  }

  // Read ES Title
  let titleEs = '';
  const titlePathEs = path.join(episodeDir, '2_publisher', 'youtube_title_es.txt');
  if (fs.existsSync(titlePathEs)) {
    titleEs = fs.readFileSync(titlePathEs, 'utf8').trim();
  }

  // Read EN Title
  let titleEn = '';
  const titlePathEn = path.join(episodeDir, '2_publisher', 'youtube_title_en.txt');
  if (fs.existsSync(titlePathEn)) {
    titleEn = fs.readFileSync(titlePathEn, 'utf8').trim();
  }

  // Read ES Description
  let descriptionEs = '';
  const descriptionPathEs = path.join(episodeDir, '2_publisher', 'youtube_description_es.md');
  if (fs.existsSync(descriptionPathEs)) {
    descriptionEs = fs.readFileSync(descriptionPathEs, 'utf8');
  } else {
    console.warn(`Warning: youtube_description_es.md not found in ${episodeDir}/2_publisher/`);
  }

  // Read ES Chapters
  const chaptersPathEs = path.join(episodeDir, '2_publisher', 'youtube_chapters_es.txt');
  if (fs.existsSync(chaptersPathEs)) {
    descriptionEs += '\n\n' + fs.readFileSync(chaptersPathEs, 'utf8');
  }

  // Read EN Description
  let descriptionEn = '';
  const descriptionPathEn = path.join(episodeDir, '2_publisher', 'youtube_description_en.md');
  if (fs.existsSync(descriptionPathEn)) {
    descriptionEn = fs.readFileSync(descriptionPathEn, 'utf8');
  } else {
    console.warn(`Warning: youtube_description_en.md not found in ${episodeDir}/2_publisher/`);
  }

  // Read EN Chapters
  const chaptersPathEn = path.join(episodeDir, '2_publisher', 'youtube_chapters_en.txt');
  if (fs.existsSync(chaptersPathEn)) {
    descriptionEn += '\n\n' + fs.readFileSync(chaptersPathEn, 'utf8');
  }

  // Read Tags from youtube_tags.txt
  let tags = [];
  const tagsPath = path.join(episodeDir, '2_publisher', 'youtube_tags.txt');
  if (fs.existsSync(tagsPath)) {
    const tagsContent = fs.readFileSync(tagsPath, 'utf8');
    tags = tagsContent.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  } else if (metadata.tags && Array.isArray(metadata.tags)) {
    tags = metadata.tags;
  }
  const hasFullAuth = CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN;

  if (!hasFullAuth) {
    if (isDryRun) {
      console.warn('Warning: Running offline dry-run because OAuth credentials are missing.');
      console.log('\n--- DRY RUN PAYLOAD (Offline) ---');
      console.log('Video ID:', videoId);
      console.log('Tags:', tags);
      console.log('Recording Date:', metadata.recordingDate);
      console.log('Description (ES):\n', descriptionEs);
      console.log('Description (EN):\n', descriptionEn);
      console.log('---------------------------------\n');
      
      // Simulate Caption Upload Dry Run
      const langFiles = [
        { code: 'es', file: 'youtube_transcript_es.md' },
        { code: 'en', file: 'youtube_transcript_en.md' }
      ];
      langFiles.forEach(lang => {
        if (fs.existsSync(path.join(episodeDir, '2_publisher', lang.file))) {
          console.log(`[DRY RUN] Would upload transcript: ${lang.file} for language: ${lang.code}`);
        }
      });
      return;
    } else {
      console.error('Error: Missing YouTube OAuth2 credentials in environment variables.');
      console.error('YouTube Data API v3 requires full OAuth2 User Consent (Client ID, Secret, and Refresh Token) to update videos.');
      process.exit(1);
    }
  }

  // Set up OAuth2 client
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });

  try {
    // 1. Fetch current video details to preserve existing data (like title and categoryId)
    const videoResponse = await youtube.videos.list({
      part: 'snippet,status,recordingDetails,localizations',
      id: videoId
    });

    if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
      console.error(`Error: Video with ID ${videoId} not found.`);
      process.exit(1);
    }

    const video = videoResponse.data.items[0];
    const snippet = video.snippet;

    // Update snippet (Spanish is default)
    snippet.defaultLanguage = snippet.defaultLanguage || 'es';
    snippet.title = titleEs || snippet.title;
    snippet.description = descriptionEs;

    // Use pre-read Tags
    snippet.tags = tags;

    const updatePayload = {
      id: videoId,
      snippet: snippet,
      localizations: video.localizations || {}
    };

    if (descriptionEn || titleEn) {
      updatePayload.localizations['en'] = {
        title: titleEn || updatePayload.localizations['en']?.title || snippet.title,
        description: descriptionEn || updatePayload.localizations['en']?.description || snippet.description
      };
    }

    if (metadata.recordingDate) {
      updatePayload.recordingDetails = {
        recordingDate: new Date(metadata.recordingDate).toISOString()
      };
    }

    if (isDryRun) {
      console.log('\n--- DRY RUN PAYLOAD (Authenticated) ---');
      console.log(JSON.stringify(updatePayload, null, 2));
      console.log('---------------------------------------\n');
      console.log('Dry run complete. No changes were pushed to YouTube.');
      
      // Simulate Caption Upload Dry Run
      const langFiles = [
        { code: 'es', file: 'youtube_transcript_es.md' },
        { code: 'en', file: 'youtube_transcript_en.md' }
      ];
      langFiles.forEach(lang => {
        if (fs.existsSync(path.join(episodeDir, '2_publisher', lang.file))) {
          console.log(`[DRY RUN] Would upload transcript: ${lang.file} for language: ${lang.code}`);
        }
      });
      return;
    }

    console.log(`Updating YouTube Video: ${snippet.title}`);

    // Perform the update
    const response = await youtube.videos.update({
      part: 'snippet,recordingDetails,localizations',
      requestBody: updatePayload
    });

    console.log(`Success! Video description and tags updated for video ID: ${videoId}`);

    // Upload Captions/Transcripts
    await uploadCaptions(youtube, videoId, episodeDir);

  } catch (error) {
    console.error('Error updating YouTube video:');
    if (error.response && error.response.data && error.response.data.error) {
      console.error(error.response.data.error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

async function uploadCaptions(youtube, videoId, episodeDir) {
  const languages = [
    { code: 'es', file: 'youtube_transcript_es.md', name: 'Spanish (Transcribed)' },
    { code: 'en', file: 'youtube_transcript_en.md', name: 'English (Translated)' }
  ];

  for (const lang of languages) {
    const filePath = path.join(episodeDir, '2_publisher', lang.file);
    if (fs.existsSync(filePath)) {
      console.log(`Uploading transcript for ${lang.name}...`);
      const transcript = fs.readFileSync(filePath, 'utf8');
      
      try {
        await youtube.captions.insert({
          part: 'snippet',
          requestBody: {
            snippet: {
              videoId: videoId,
              language: lang.code,
              name: lang.name,
              isDraft: false
            }
          },
          media: {
            mimeType: 'text/plain',
            body: transcript
          }
        });
        console.log(`Successfully uploaded ${lang.name} transcript.`);
      } catch (error) {
        // If a track already exists, we might need to list and update, but for now we log the error
        if (error.message.includes('duplicate')) {
          console.warn(`Warning: A ${lang.name} caption track already exists for this video. Skipping upload.`);
        } else {
          console.error(`Error uploading ${lang.name} transcript:`, error.message);
        }
      }
    }
  }
}

updateYouTubeVideo();
