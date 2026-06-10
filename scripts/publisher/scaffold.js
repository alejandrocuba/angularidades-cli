import fs from 'fs';
import path from 'path';
import * as p from '@clack/prompts';
import { colors, printHeader } from './logger.js';
import { resolveConfig } from './config.js';
import { initYouTube, downloadExistingCaptions } from './youtube-api.js';

// Fix Clack symbols for consistency: solid green for completed, outline green for active
const green = (s) => `${colors.green}${s}${colors.reset}`;
const blue = (s) => `${colors.blue}${s}${colors.reset}`;

const symbols = {
  S_STEP_ACTIVE: green('◇'),
  S_STEP_SUBMIT: green('◆'),
  S_SUCCESS: green('◆'),
  S_INFO: blue('●'),
  S_BAR: green('│'),
  S_BAR_START: green('┌'),
  S_BAR_END: green('└')
};

async function scaffoldEpisode(predefinedEpisodeNumber) {
  printHeader('Angularidades: Create New Episode Scaffolding');

  const episodesDir = path.join(import.meta.dirname, '../../episodes');
  const folders = fs
    .readdirSync(episodesDir)
    .filter((f) => fs.lstatSync(path.join(episodesDir, f)).isDirectory() && /^\d+$/.test(f))
    .map((f) => parseInt(f))
    .sort((a, b) => a - b);

  const lastEpisode = folders.length > 0 ? folders[folders.length - 1] : 0;
  const nextEpisodeProposed = (lastEpisode + 1).toString().padStart(4, '0');

  let episodeNumber;

  if (predefinedEpisodeNumber) {
    episodeNumber = predefinedEpisodeNumber.toString().padStart(4, '0');
  } else {
    const episodeNumberInput = await p.text({
      message: 'Enter the episode number:',
      placeholder: nextEpisodeProposed.replace(/^0+/, ''),
      initialValue: nextEpisodeProposed.replace(/^0+/, ''),
      validate(value) {
        if (!/^\d+$/.test(value)) return 'Please enter a valid number.';
        const num = parseInt(value);
        const paddedValue = value.toString().padStart(4, '0');
        if (folders.includes(num)) return `Episode ${paddedValue} already exists.`;
        if (num <= lastEpisode)
          return `Episode ${paddedValue} is lower than the latest episode (${lastEpisode.toString().padStart(4, '0')}). Going back is not allowed.`;
      }
    });

    if (p.isCancel(episodeNumberInput)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    const num = parseInt(episodeNumberInput);
    episodeNumber = num.toString().padStart(4, '0');

    // Gap validation
    if (num > lastEpisode + 1) {
      const confirmGap = await p.confirm({
        message: `${colors.yellow}⚠ Warning: Episode ${num} creates a gap (Last episode was ${lastEpisode}). Is this intentional?${colors.reset}`,
        initialValue: false
      });

      if (!confirmGap || p.isCancel(confirmGap)) {
        p.cancel('Operation cancelled. Please use the next sequential number.');
        process.exit(0);
      }
    }
  }

  const titleTopic = await p.text({
    message: 'Enter the episode topic (for the title):',
    placeholder: 'Episode topic',
    validate(value) {
      if (value.length < 5) return 'Topic is too short.';
    }
  });

  if (p.isCancel(titleTopic)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  // Guest Collection Loop
  const guests = [];
  let currentGuest = await p.text({
    message: 'Enter the first guest name:',
    placeholder: 'Guest name',
    validate(value) {
      if (value.length < 2) return 'Guest name is too short.';
    }
  });

  if (p.isCancel(currentGuest)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }
  guests.push(currentGuest);

  while (true) {
    let nextGuest = await p.text({
      message: 'Enter another guest name (or press Enter to finish):',
      placeholder: 'Next guest...'
    });

    if (p.isCancel(nextGuest)) break;
    if (!nextGuest || nextGuest.trim() === '') break;
    guests.push(nextGuest);
  }

  const isVideoUploaded = await p.confirm({
    message: 'Is the YouTube video already uploaded/recorded?',
    initialValue: true
  });

  if (p.isCancel(isVideoUploaded)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  let videoId = null;

  if (isVideoUploaded) {
    const youtubeUrl = await p.text({
      message: 'Enter the YouTube Video URL:',
      placeholder: 'https://www.youtube.com/watch?v=...',
      validate(value) {
        if (!value) return 'URL is required.';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = value.match(regExp);
        if (!match || !match[2] || match[2].length !== 11) return 'Invalid YouTube URL.';
      }
    });

    if (p.isCancel(youtubeUrl)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    videoId = youtubeUrl.match(regExp)[2];
  }

  const today = new Date().toISOString().split('T')[0];
  const recordingDate = await p.text({
    message: 'Enter the recording date:',
    placeholder: today,
    initialValue: today,
    validate(value) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Please enter a date in YYYY-MM-DD format.';
    }
  });

  if (p.isCancel(recordingDate)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const s = p.spinner();
  s.start('Generating directories and files...');

  const newEpisodeDir = path.join(episodesDir, episodeNumber);
  const subDirs = ['0_planner', '1_recording', '2_publisher'];

  fs.mkdirSync(newEpisodeDir, { recursive: true });
  subDirs.forEach((dir) => fs.mkdirSync(path.join(newEpisodeDir, dir), { recursive: true }));
  s.stop('Directories and metadata ready', symbols.S_SUCCESS);

  // Format titles
  const guestList = guests.join(', ');
  const displayNum = parseInt(episodeNumber);
  const titleEs = `${titleTopic} con ${guestList} - Angularidades #${displayNum}`;

  // Create metadata.json
  const metadata = {
    recordingDate: recordingDate
  };
  if (videoId) {
    metadata.videoId = videoId;
  }
  fs.writeFileSync(path.join(newEpisodeDir, 'metadata.json'), JSON.stringify(metadata, null, 2));

  // Create working title file
  fs.writeFileSync(path.join(newEpisodeDir, '2_publisher', 'youtube_title_es.txt'), titleEs);

  console.log(''); // Visual spacing

  if (isVideoUploaded) {
    s.start(`${colors.cyan}Connecting to YouTube to fetch recording data...${colors.reset}`);

    try {
      const config = await resolveConfig();
      const hasFullAuth =
        config.credentials.CLIENT_ID &&
        config.credentials.CLIENT_SECRET &&
        config.credentials.REFRESH_TOKEN;

      if (hasFullAuth) {
        const youtube = initYouTube(config.credentials);
        s.message('Downloading captions from YouTube...');
        await downloadExistingCaptions(youtube, videoId, newEpisodeDir, false, false);
        s.stop('YouTube download finished', symbols.S_SUCCESS);
        p.log.success('Scaffolding created and YouTube captions downloaded.');
      } else {
        s.stop('YouTube skipped');
        p.log.warn(
          'Scaffolding created, but YouTube captions skipped (Missing OAuth credentials).'
        );
      }
    } catch (error) {
      s.stop('YouTube error');
      p.log.error(`Scaffolding created, but failed to fetch captions: ${error.message}`);
    }
  } else {
    p.log.success('Scaffolding created for planning phase.');
  }

  console.log(''); // Visual spacing

  if (isVideoUploaded) {
    p.log.info(`${colors.bold}Ready for Processing${colors.reset}`);
    p.note(
      `Next steps:\n` +
        `1. ${colors.bold}AI Processing${colors.reset}: Instruct the @publisher AI Agent to process the episode.\n` +
        `2. ${colors.bold}Diagnostics${colors.reset}: Run 'angularidades doctor ${episodeNumber}' to check everything.\n` +
        `3. ${colors.bold}Dry Run${colors.reset}: Run 'angularidades dry-run ${episodeNumber}' to preview the payload.\n` +
        `4. ${colors.bold}Publishing${colors.reset}: Run 'angularidades publish ${episodeNumber}' to publish.`,
      ''
    );
  } else {
    p.log.info(`${colors.bold}Ready for Planning${colors.reset}`);
    p.note(
      `Next steps:\n` +
        `1. ${colors.bold}Planning${colors.reset}: Instruct the @planner AI Agent to help you plan the episode questions and structure.\n` +
        `2. ${colors.bold}Recording${colors.reset}: Record the episode following the plan.\n` +
        `3. ${colors.bold}Uploading${colors.reset}: Upload the episode to YouTube.\n` +
        `4. ${colors.bold}Update metadata${colors.reset}: Re-run tooling later or manually update metadata.json with the 'videoId'.`,
      ''
    );
  }

  p.outro(`${colors.green}Disfruta el proceso!${colors.reset}`);
}

export { scaffoldEpisode };
