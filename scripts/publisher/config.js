const path = require('path');
require('dotenv').config();

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isDoctor = args.includes('--doctor');

let episodeInput = args.find(arg => !arg.startsWith('--') && !arg.startsWith('-'));

const episodeIndex = args.findIndex(arg => arg === '--episode' || arg === '-e');
if (episodeIndex !== -1 && args[episodeIndex + 1]) {
  episodeInput = args[episodeIndex + 1];
}

if (!episodeInput) {
  console.error('Error: Episode directory or number is missing.');
  console.error('Usage:');
  console.error('  node scripts/publisher/index.js -e 89 [--dry-run] [--doctor]');
  console.error('  node scripts/publisher/index.js 89 [--dry-run] [--doctor]');
  process.exit(1);
}

const episodeDir = /^\d+$/.test(episodeInput) 
  ? path.join('episodes', episodeInput.padStart(4, '0')) 
  : episodeInput;

module.exports = {
  isDryRun,
  isDoctor,
  episodeDir,
  credentials: {
    CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
    CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
    REFRESH_TOKEN: process.env.YOUTUBE_REFRESH_TOKEN
  }
};
