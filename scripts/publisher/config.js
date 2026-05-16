const path = require('path');
const fs = require('fs');
const p = require('@clack/prompts');
const { colors } = require('./logger');
require('dotenv').config({ quiet: true });

async function resolveConfig() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isDoctor = args.includes('--doctor');

  const episodesDir = path.join(__dirname, '../../episodes');
  
  if (!fs.existsSync(episodesDir)) {
    p.log.error('Episodes directory not found.');
    process.exit(1);
  }

  const episodeFolders = fs.readdirSync(episodesDir)
    .filter(f => fs.lstatSync(path.join(episodesDir, f)).isDirectory() && /^\d+$/.test(f))
    .sort((a, b) => parseInt(b) - parseInt(a)); // Newest first

  if (episodeFolders.length === 0) {
    p.log.error('No episodes found in the episodes directory.');
    process.exit(1);
  }

  const latestEpisode = episodeFolders[0];
  let episodeInput = args.find(arg => !arg.startsWith('--') && !arg.startsWith('-'));

  const episodeIndex = args.findIndex(arg => arg === '--episode' || arg === '-e');
  if (episodeIndex !== -1 && args[episodeIndex + 1]) {
    episodeInput = args[episodeIndex + 1];
  }

  // If no episode provided, show a state-of-the-art selection menu
  if (!episodeInput) {
    const selected = await p.select({
      message: 'Select an episode to publish:',
      options: episodeFolders.map(folder => {
        const isReady = fs.existsSync(path.join(episodesDir, folder, 'metadata.json'));
        const icon = isReady ? `${colors.green}✔${colors.reset}` : `${colors.red}✘${colors.reset}`;
        return {
          value: folder,
          label: `Episode ${folder} ${icon}`,
          hint: isReady ? 'ready' : 'missing files'
        };
      }),
    });

    if (p.isCancel(selected)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    episodeInput = selected;
  }

  const episodeNumber = episodeInput.toString().padStart(4, '0');
  const episodeDir = path.join(__dirname, '../../episodes', episodeNumber);

  // Protection layer for previous episodes
  if (parseInt(episodeNumber) < parseInt(latestEpisode) && !isDryRun && !isDoctor) {
    p.log.warn(`${colors.yellow}Warning: You are about to modify an older episode.${colors.reset}`);
    const confirm = await p.confirm({
      message: `Episode ${episodeNumber} is NOT the latest one (Latest is ${latestEpisode}). Continue?`,
      initialValue: false
    });

    if (p.isCancel(confirm) || !confirm) {
      p.cancel('Operation aborted to protect previous episode.');
      process.exit(0);
    }
  }

  return {
    isDryRun,
    isDoctor,
    episodeDir,
    credentials: {
      CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
      CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
      REFRESH_TOKEN: process.env.YOUTUBE_REFRESH_TOKEN
    }
  };
}

module.exports = { resolveConfig };
