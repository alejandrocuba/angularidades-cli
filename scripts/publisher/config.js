const path = require('path');
const fs = require('fs');
const p = require('@clack/prompts');
const { colors } = require('./logger');
require('dotenv').config();

async function resolveConfig() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isDoctor = args.includes('--doctor');

  let episodeInput = args.find(arg => !arg.startsWith('--') && !arg.startsWith('-'));

  const episodeIndex = args.findIndex(arg => arg === '--episode' || arg === '-e');
  if (episodeIndex !== -1 && args[episodeIndex + 1]) {
    episodeInput = args[episodeIndex + 1];
  }

  // If no episode provided, show a state-of-the-art selection menu
  if (!episodeInput) {
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
