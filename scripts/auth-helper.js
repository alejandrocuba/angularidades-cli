const { google } = require('googleapis');
const readline = require('readline');

// Instructions:
// 1. Create a .env file with YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET
// 2. Run: node scripts/auth-helper.js
require('dotenv').config();

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: Please provide YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in your .env file first.');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'http://localhost' // Use a dummy redirect for desktop apps
);

const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent' // Forces receiving a refresh token
});

console.log('1. Authorize this app by visiting this url:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('2. Enter the code from that page here: ', (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    console.log('\n--- YOUR REFRESH TOKEN ---');
    console.log(token.refresh_token);
    console.log('---------------------------\n');
    console.log('Add this to your .env and GitHub Secrets as YOUTUBE_REFRESH_TOKEN');
  });
});
