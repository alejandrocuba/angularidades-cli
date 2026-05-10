const fs = require('fs');
const path = require('path');
const p = require('@clack/prompts');
const { colors } = require('./logger');

async function scaffoldEpisode() {
  p.intro(`${colors.cyan}${colors.bold}Create New Episode Scaffolding${colors.reset}`);

  const episodesDir = path.join(__dirname, '../../episodes');
  const folders = fs.readdirSync(episodesDir)
    .filter(f => fs.lstatSync(path.join(episodesDir, f)).isDirectory() && /^\d+$/.test(f))
    .map(f => parseInt(f))
    .sort((a, b) => a - b);

  const lastEpisode = folders.length > 0 ? folders[folders.length - 1] : 0;
  const nextEpisodeProposed = (lastEpisode + 1).toString().padStart(4, '0');

  const episodeNumberInput = await p.text({
    message: 'Enter the episode number:',
    placeholder: nextEpisodeProposed.replace(/^0+/, ''),
    initialValue: nextEpisodeProposed.replace(/^0+/, ''),
    validate(value) {
      if (!/^\d+$/.test(value)) return 'Please enter a valid number.';
      const num = parseInt(value);
      const paddedValue = value.toString().padStart(4, '0');
      if (folders.includes(num)) return `Episode ${paddedValue} already exists.`;
      if (num <= lastEpisode) return `Episode ${paddedValue} is lower than the latest episode (${lastEpisode.toString().padStart(4, '0')}). Going back is not allowed.`;
    }
  });

  if (p.isCancel(episodeNumberInput)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  // Normalize and pad
  const num = parseInt(episodeNumberInput);
  const episodeNumber = num.toString().padStart(4, '0');

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

  const title = await p.text({
    message: 'Enter the episode title (Working title):',
    placeholder: 'Despliegue de Angular SSR...',
    validate(value) {
      if (value.length < 5) return 'Title is too short.';
    }
  });

  if (p.isCancel(title)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const youtubeUrl = await p.text({
    message: 'Enter the YouTube Video URL:',
    placeholder: 'https://www.youtube.com/watch?v=...',
    validate(value) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = value.match(regExp);
      if (!match || match[2].length !== 11) return 'Invalid YouTube URL.';
    }
  });

  if (p.isCancel(youtubeUrl)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const videoId = youtubeUrl.match(regExp)[2];
  const today = new Date().toISOString().split('T')[0];

  const confirm = await p.confirm({
    message: `Create scaffolding for Episode ${episodeNumber}?`,
  });

  if (!confirm || p.isCancel(confirm)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const s = p.spinner();
  s.start('Generating directories and files...');

  const newEpisodeDir = path.join(episodesDir, episodeNumber);
  const subDirs = ['0_planner', '1_recording', '2_publisher'];

  fs.mkdirSync(newEpisodeDir, { recursive: true });
  subDirs.forEach(dir => fs.mkdirSync(path.join(newEpisodeDir, dir), { recursive: true }));

  // Create metadata.json
  const metadata = {
    videoId: videoId,
    recordingDate: today
  };
  fs.writeFileSync(path.join(newEpisodeDir, 'metadata.json'), JSON.stringify(metadata, null, 2));

  // Create working title file
  fs.writeFileSync(path.join(newEpisodeDir, '2_publisher', 'youtube_title_es.txt'), title);

  s.stop(`Scaffolding created at episodes/${episodeNumber}`);

  p.note(
    `Next steps:\n` +
    `1. ${colors.bold}Planning${colors.reset}: Run the Planner Agent using scripts/planner/.\n` +
    `2. ${colors.bold}Diagnostics${colors.reset}: Run 'angularidades doctor ${episodeNumber}' to check everything.\n` +
    `3. ${colors.bold}Publishing${colors.reset}: Once the recording is done, run 'angularidades publish ${episodeNumber}'.`,
    'Scaffolding Ready'
  );

  p.outro(`${colors.green}Happy recording!${colors.reset}`);
}

module.exports = { scaffoldEpisode };
