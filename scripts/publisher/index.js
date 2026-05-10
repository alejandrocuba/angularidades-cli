#!/usr/bin/env node

const { resolveConfig } = require('./config');
const { colors, logDoctor, printHeader } = require('./logger');
const { getEpisodeData, getLocalTranscripts } = require('./file-manager');
const { initYouTube, fetchVideoDetails, updateVideo, downloadExistingCaptions, uploadCaptions } = require('./youtube-api');

async function main() {
  const args = process.argv.slice(2);
  const isDoctor = args.includes('--doctor');
  const isDryRun = args.includes('--dry-run');

  let modeTitle = 'Angularidades: YouTube Publisher';
  if (isDoctor) modeTitle += ' Doctor';
  else if (isDryRun) modeTitle += ' Dry Run';
  
  printHeader(modeTitle);

  const config = await resolveConfig();
  const { episodeDir, credentials } = config;

  const { metadata, videoId, titleEs, titleEn, descriptionEs, descriptionEn, tags } = getEpisodeData(episodeDir, logDoctor, isDoctor);

  const hasFullAuth = credentials.CLIENT_ID && credentials.CLIENT_SECRET && credentials.REFRESH_TOKEN;

  if (isDoctor) {
    logDoctor(hasFullAuth, 'YouTube OAuth2 credentials found in environment');
    logDoctor(!!titleEs, 'youtube_title_es.txt found', true);
    logDoctor(!!descriptionEs, 'youtube_description_es.md found', true);
    logDoctor(tags.length > 0, 'youtube_tags.txt or metadata tags found', true);
  }

  const transcripts = getLocalTranscripts(episodeDir);

  if (!hasFullAuth) {
    if (isDryRun || isDoctor) {
      if (!isDoctor) console.warn('Warning: Running offline dry-run because OAuth credentials are missing.');
      if (isDryRun && !isDoctor) {
        console.log(`${colors.cyan}${colors.bold}--- DRY RUN PAYLOAD (Offline) ---${colors.reset}`);
        console.log('Video ID:', videoId);
        console.log('Tags:', tags);
        console.log('Recording Date:', metadata.recordingDate);
        console.log('Description (ES):\n', descriptionEs);
        console.log('Description (EN):\n', descriptionEn);
        console.log(`${colors.cyan}${colors.bold}---------------------------------${colors.reset}\n`);

        transcripts.forEach(lang => {
          if (lang.exists) {
            console.log(`${colors.cyan}↳${colors.reset} [DRY RUN] Would upload transcript: ${lang.file} for language: ${lang.code}`);
          }
        });
        console.log(`\n${colors.bold}✨ Offline dry run complete.${colors.reset}\n`);
      }
      return;
    } else {
      console.error('Error: Missing YouTube OAuth2 credentials in environment variables.');
      process.exit(1);
    }
  }

  const youtube = initYouTube(credentials);

  try {
    const video = await fetchVideoDetails(youtube, videoId, isDoctor);
    const snippet = video.snippet;

    await downloadExistingCaptions(youtube, videoId, episodeDir, isDoctor, isDryRun);

    if (isDoctor) {
      console.log(`\n${colors.bold}✨ Doctor check complete.${colors.reset}\n`);
      return;
    }

    snippet.defaultLanguage = snippet.defaultLanguage || 'es';
    snippet.title = titleEs || snippet.title;
    snippet.description = descriptionEs || snippet.description;
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
      console.log(`${colors.cyan}${colors.bold}--- DRY RUN PAYLOAD (Authenticated) ---${colors.reset}`);
      console.log(JSON.stringify(updatePayload, null, 2));
      console.log(`${colors.cyan}${colors.bold}---------------------------------------${colors.reset}\n`);
      console.log(`${colors.green}✔${colors.reset} Dry run complete. No changes were pushed to YouTube.`);
      
      transcripts.forEach(lang => {
        if (lang.exists) {
          console.log(`${colors.cyan}↳${colors.reset} [DRY RUN] Would upload transcript: ${lang.file} for language: ${lang.code}`);
        }
      });
      console.log(`\n${colors.bold}✨ Dry run complete.${colors.reset}\n`);
      return;
    }

    await updateVideo(youtube, videoId, updatePayload);
    await uploadCaptions(youtube, videoId, transcripts);
    
    console.log(`\n${colors.bold}✨ Publishing complete.${colors.reset}\n`);

  } catch (error) {
    if (isDoctor) logDoctor(false, `YouTube API check failed: ${error.message}`);
    else console.error('Error updating YouTube video:', error.message);
    process.exit(1);
  }
}

main();
