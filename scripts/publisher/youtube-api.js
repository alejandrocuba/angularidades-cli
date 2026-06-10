import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { logDoctor, colors } from './logger.js';
import { saveCaptions } from './file-manager.js';

function initYouTube(credentials) {
  const oauth2Client = new google.auth.OAuth2(credentials.CLIENT_ID, credentials.CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: credentials.REFRESH_TOKEN });
  return google.youtube({ version: 'v3', auth: oauth2Client });
}

async function fetchVideoDetails(youtube, videoId, isDoctor) {
  const videoResponse = await youtube.videos.list({
    part: 'snippet,status,recordingDetails,localizations',
    id: videoId
  });

  if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
    if (isDoctor) logDoctor(false, `Video with ID ${videoId} found on YouTube`);
    else console.error(`Error: Video with ID ${videoId} not found.`);
    process.exit(1);
  }
  if (isDoctor) logDoctor(true, `Video with ID ${videoId} found on YouTube`);

  return videoResponse.data.items[0];
}

async function updateVideo(youtube, videoId, updatePayload) {
  console.log(`\n${colors.cyan}${colors.bold}--- PUBLISHING ---${colors.reset}`);
  console.log(
    `${colors.cyan}↳${colors.reset} Updating YouTube Video: ${updatePayload.snippet.title}`
  );

  await youtube.videos.update({
    part: 'snippet,recordingDetails,localizations',
    requestBody: updatePayload
  });

  console.log(
    `${colors.green}✔${colors.reset} Success! Video description and tags updated for video ID: ${videoId}`
  );
}

async function downloadExistingCaptions(youtube, videoId, episodeDir, isDoctor, isDryRun) {
  const recordingDir = path.join(episodeDir, '1_recording');

  // Only proceed if NO transcript/caption files exist in either recording or publisher folders
  const publisherDir = path.join(episodeDir, '2_publisher');

  const hasLocalFiles =
    (fs.existsSync(recordingDir) &&
      fs.readdirSync(recordingDir).some((f) => f.startsWith('original_') || f.endsWith('.sbv'))) ||
    (fs.existsSync(publisherDir) &&
      fs
        .readdirSync(publisherDir)
        .some((f) => f.startsWith('youtube_transcript_') || f.startsWith('youtube_captions_')));

  if (hasLocalFiles) {
    if (isDoctor)
      logDoctor(
        true,
        'Local transcript/caption files found. Skipping download from YouTube to protect local edits.'
      );
    return;
  }

  try {
    const response = await youtube.captions.list({
      part: 'snippet',
      videoId: videoId
    });
    const captions = response.data.items;

    if (isDoctor || isDryRun) {
      if (captions && captions.length > 0) {
        logDoctor(true, `Found ${captions.length} caption track(s) on YouTube`);
        captions.forEach((c) => {
          console.log(
            `    ${colors.cyan}↳${colors.reset} [${c.snippet.language}] ${c.snippet.name || c.snippet.trackKind}`
          );
        });
        if (isDryRun && !isDoctor) {
          console.log(
            `${colors.cyan}↳${colors.reset} [DRY RUN] Would download YouTube captions to ${episodeDir}/1_recording/`
          );
        }
      } else {
        logDoctor(false, 'Found existing caption tracks on YouTube', true);
      }
      return;
    }

    if (!captions || captions.length === 0) return;

    let track =
      captions.find((c) => c.snippet.trackKind === 'ASR' && c.snippet.language === 'es') ||
      captions.find((c) => c.snippet.language === 'es') ||
      captions[0];

    if (track) {
      if (isDoctor)
        console.log(
          `Downloading YouTube captions (${track.snippet.language} - ${track.snippet.trackKind})...`
        );
      const downloadRes = await youtube.captions.download({
        id: track.id,
        tfmt: 'sbv'
      });

      let data = downloadRes.data;
      // Handle Blob response if necessary (common in some Node environments/versions)
      if (typeof data.arrayBuffer === 'function') {
        data = Buffer.from(await data.arrayBuffer());
      }

      saveCaptions(episodeDir, data);
      if (isDoctor) console.log(`Successfully downloaded youtube_captions.sbv`);
    }
  } catch (error) {
    if (isDoctor) logDoctor(false, `Failed to fetch captions list: ${error.message}`);
    else console.warn(`Warning: Could not fetch existing captions - ${error.message}`);
  }
}

async function uploadCaptions(youtube, videoId, transcripts) {
  let existingCaptions = [];
  try {
    const response = await youtube.captions.list({
      part: 'snippet',
      videoId: videoId
    });
    existingCaptions = response.data.items || [];
  } catch (error) {
    console.warn(
      `  ${colors.yellow}⚠${colors.reset} Could not fetch existing captions for overriding. Proceeding with insert. (${error.message})`
    );
  }

  for (const lang of transcripts) {
    if (lang.exists) {
      console.log(`${colors.cyan}↳${colors.reset} Uploading transcript for ${lang.name}...`);
      const transcript = fs.readFileSync(lang.path, 'utf8');
      const isSyncRequired = lang.path.endsWith('.md');

      const existingTrack =
        existingCaptions.find(
          (c) => c.snippet.language === lang.code && c.snippet.name === lang.name
        ) ||
        existingCaptions.find(
          (c) =>
            c.snippet.language === lang.code && c.snippet.trackKind?.toLowerCase() === 'standard'
        );

      try {
        if (existingTrack) {
          console.log(
            `  ${colors.cyan}↳${colors.reset} Overriding existing track: ${existingTrack.id} (${existingTrack.snippet.name || 'no name'})`
          );
          await youtube.captions.update({
            part: 'snippet',
            sync: isSyncRequired,
            requestBody: {
              id: existingTrack.id,
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
          console.log(
            `  ${colors.green}✔${colors.reset} Successfully overridden ${lang.name} transcript.`
          );
        } else {
          await youtube.captions.insert({
            part: 'snippet',
            sync: isSyncRequired,
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
          console.log(
            `  ${colors.green}✔${colors.reset} Successfully uploaded ${lang.name} transcript.`
          );
        }
      } catch (error) {
        if (error.message.includes('duplicate')) {
          console.warn(
            `  ${colors.yellow}⚠${colors.reset} A ${lang.name} caption track already exists. Skipping.`
          );
        } else {
          console.error(
            `  ${colors.red}✘${colors.reset} Error uploading ${lang.name}:`,
            error.message
          );
        }
      }
    }
  }
}

export { initYouTube, fetchVideoDetails, updateVideo, downloadExistingCaptions, uploadCaptions };
