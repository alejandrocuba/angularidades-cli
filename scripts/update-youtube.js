const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load environment variables if running locally
require('dotenv').config();

// OAuth2 credentials
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;

// Expecting episode path as the first argument, e.g. "episodes/001"
const args = process.argv.slice(2);
const episodeDir = args.find(arg => !arg.startsWith('--'));
const isDryRun = args.includes('--dry-run');

if (!episodeDir) {
  console.error('Error: Episode directory argument is missing. Usage: node update-youtube.js <episode_dir> [--dry-run]');
  process.exit(1);
}

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

  // Read Description
  let description = '';
  if (fs.existsSync(descriptionPath)) {
    description = fs.readFileSync(descriptionPath, 'utf8');
  } else {
    console.warn(`Warning: 01_description.md not found in ${episodeDir}/2_publisher/`);
  }

  // Read Chapters and append to description
  if (fs.existsSync(chaptersPath)) {
    const chapters = fs.readFileSync(chaptersPath, 'utf8');
    description += '\n\n' + chapters;
  }

  // Handle Offline Dry Run
  const hasFullAuth = CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN;

  if (!hasFullAuth) {
    if (isDryRun) {
      console.warn('Warning: Running offline dry-run because OAuth credentials are missing.');
      console.log('\n--- DRY RUN PAYLOAD (Offline) ---');
      console.log('Video ID:', videoId);
      console.log('Tags:', metadata.tags);
      console.log('Recording Date:', metadata.recordingDate);
      console.log('Description:\n', description);
      console.log('---------------------------------\n');
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
      part: 'snippet,status,recordingDetails',
      id: videoId
    });

    if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
      console.error(`Error: Video with ID ${videoId} not found.`);
      process.exit(1);
    }

    const video = videoResponse.data.items[0];
    const snippet = video.snippet;

    // Update snippet
    snippet.description = description;
    if (metadata.tags && Array.isArray(metadata.tags)) {
      snippet.tags = metadata.tags;
    }

    const updatePayload = {
      id: videoId,
      snippet: snippet,
    };

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
      return;
    }

    console.log(`Updating YouTube Video: ${snippet.title}`);

    // Perform the update
    const response = await youtube.videos.update({
      part: 'snippet,recordingDetails',
      requestBody: updatePayload
    });

    console.log(`Success! Video description and tags updated for video ID: ${videoId}`);
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

updateYouTubeVideo();
