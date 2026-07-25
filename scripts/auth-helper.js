import { google } from 'googleapis';
import * as p from '@clack/prompts';
import { colors, logAuthHelpNote } from './publisher/logger.js';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config({ quiet: true });

async function runAuthHelper(prompts = p) {
  prompts.intro(`${colors.cyan}${colors.bold}Angularidades: YouTube Auth Helper${colors.reset}`);

  const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
  const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    prompts.log.error(
      `Please provide ${colors.bold}YOUTUBE_CLIENT_ID${colors.reset} and ${colors.bold}YOUTUBE_CLIENT_SECRET${colors.reset} in your .env file first.`
    );
    logAuthHelpNote(prompts);
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
    response_type: 'code',
    scope: SCOPES,
    prompt: 'consent' // Forces receiving a refresh token
  });

  console.log(
    `\n${colors.bold}── Authorization Instructions ──────────────────────────────────────────────${colors.reset}`
  );
  console.log(`\n1. Open the following URL in your browser (copy the full line):\n`);
  console.log(`${colors.cyan}${authUrl}${colors.reset}\n`);
  console.log(`2. Log in with the Google account that manages the YouTube channel.`);
  console.log(`3. You will be redirected to a page that fails to load (localhost).`);
  console.log(`4. Copy the "code" query parameter value from the browser's address bar.\n`);
  console.log(
    `${colors.bold}───────────────────────────────────────────────────────────────────────────${colors.reset}\n`
  );

  const code = await prompts.text({
    message: 'Enter the code from the URL query string "code" after login:',
    placeholder: 'e.g. 4/0AeoWu...',
    validate(value) {
      if (!value || !value.trim()) return 'Authorization code is required.';
    }
  });

  if (prompts.isCancel(code)) {
    prompts.cancel('Operation cancelled.');
    process.exit(0);
  }

  const s = prompts.spinner();
  s.start('Exchanging code for tokens...');

  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    s.stop('Tokens retrieved successfully!');

    prompts.note(tokens.refresh_token || 'No refresh token returned.', 'Your Refresh Token');

    prompts.outro(
      `Add this to your ${colors.bold}.env${colors.reset} file and GitHub Secrets as ${colors.bold}YOUTUBE_REFRESH_TOKEN${colors.reset}`
    );
  } catch (error) {
    s.stop('Failed to retrieve token.');
    prompts.log.error(`Error exchanging code: ${error.message}`);
    logAuthHelpNote(prompts);
    process.exit(1);
  }
}

const isMain = () => {
  if (!process.argv[1]) return false;
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
};

if (isMain()) {
  runAuthHelper().catch((err) => {
    p.log.error(`Unexpected error: ${err.message}`);
    process.exit(1);
  });
}

export { runAuthHelper };
