const { google } = require('googleapis');
const p = require('@clack/prompts');
const { colors } = require('./publisher/logger');
require('dotenv').config();

async function main() {
  p.intro(`${colors.cyan}${colors.bold}Angularidades: YouTube Auth Helper${colors.reset}`);

  const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
  const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    p.log.error(`Please provide ${colors.bold}YOUTUBE_CLIENT_ID${colors.reset} and ${colors.bold}YOUTUBE_CLIENT_SECRET${colors.reset} in your .env file first.`);
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

  p.note(
    `1. Visit this URL in your browser to authorize the app:\n\n` +
    `${colors.cyan}${authUrl}${colors.reset}\n\n` +
    `2. Log in with the Google account that manages the YouTube channel.\n` +
    `3. You will be redirected to a page that fails to load (localhost).\n` +
    `4. Copy the "code" query parameter value from the browser's address bar.`,
    'Authorization Instructions'
  );

  const code = await p.text({
    message: 'Enter the code from the URL query string "code" after login:',
    placeholder: 'e.g. 4/0AeoWu...',
    validate(value) {
      if (!value || !value.trim()) return 'Authorization code is required.';
    }
  });

  if (p.isCancel(code)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  const s = p.spinner();
  s.start('Exchanging code for tokens...');

  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    s.stop('Tokens retrieved successfully!');

    p.note(
      `${colors.green}${colors.bold}${tokens.refresh_token}${colors.reset}`,
      'YOUR REFRESH TOKEN'
    );

    p.outro(
      `Add this to your ${colors.bold}.env${colors.reset} file and GitHub Secrets as ${colors.bold}YOUTUBE_REFRESH_TOKEN${colors.reset}`
    );
  } catch (error) {
    s.stop('Failed to retrieve token.');
    p.log.error(`Error exchanging code: ${error.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  p.log.error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
