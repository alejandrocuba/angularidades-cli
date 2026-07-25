export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  orange: '\x1b[38;5;208m'
};

export const logLevel = {
  verbose: false,
  silent: false
};

const originalLog = console.log;
const originalWarn = console.warn;

export function setLogLevel(levels) {
  if (levels.verbose !== undefined) logLevel.verbose = levels.verbose;
  if (levels.silent !== undefined) {
    logLevel.silent = levels.silent;
    if (logLevel.silent) {
      console.log = () => {};
      console.warn = () => {};
    } else {
      console.log = originalLog;
      console.warn = originalWarn;
    }
  }
}

export function logDoctor(success, message, isWarning = false) {
  if (logLevel.silent) return;
  if (success) {
    console.log(`${colors.green}✔${colors.reset} ${message}`);
  } else if (isWarning) {
    console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
  } else {
    console.log(`${colors.red}✘${colors.reset} ${message}`);
  }
}

export function printHeader(title) {
  if (logLevel.silent) return;
  console.log(
    `\n${colors.blue}${colors.bold}╔════════════════════════════════════════════════════╗`
  );
  const padding = Math.max(0, Math.floor((52 - title.length) / 2));
  const extraPadding = (52 - title.length) % 2;
  console.log(`║${' '.repeat(padding)}${title}${' '.repeat(padding + extraPadding)}║`);
  console.log(`╚════════════════════════════════════════════════════╝${colors.reset}\n`);
}

export function isOAuthError(error) {
  if (!error) return false;
  const msg = typeof error === 'string' ? error : error.message || String(error);
  const lower = msg.toLowerCase();
  return (
    lower.includes('deleted_client') ||
    lower.includes('invalid_grant') ||
    lower.includes('invalid_client') ||
    lower.includes('unauthorized') ||
    lower.includes('oauth')
  );
}

export function logAuthHelpNote(prompts = null) {
  if (logLevel.silent) return;
  const noteTitle = 'YouTube OAuth Credentials Troubleshooting';
  const noteBody = [
    'To resolve OAuth credential errors (deleted_client, invalid_grant, invalid_client):',
    '',
    `1. ${colors.bold}Google Cloud Console Setup${colors.reset}:`,
    '   • Ensure YouTube Data API v3 is enabled in your Google Cloud project.',
    '   • Under OAuth consent screen, add your account email to "Test users".',
    '   • Go to Credentials > Create Credentials > OAuth client ID > Desktop App.',
    '',
    `2. ${colors.bold}Update local .env file${colors.reset}:`,
    '   • Set YOUTUBE_CLIENT_ID="<your-client-id>"',
    '   • Set YOUTUBE_CLIENT_SECRET="<your-client-secret>"',
    '',
    `3. ${colors.bold}Obtain a new Refresh Token${colors.reset}:`,
    `   • Run: ${colors.cyan}node scripts/auth-helper.js${colors.reset}`,
    '   • Follow the login flow and copy your new YOUTUBE_REFRESH_TOKEN into .env.'
  ].join('\n');

  if (prompts && typeof prompts.note === 'function') {
    prompts.note(noteBody, noteTitle);
  } else {
    console.log(
      `\n${colors.cyan}${colors.bold}── ${noteTitle} ──────────────────────────────────────────${colors.reset}`
    );
    console.log(noteBody);
    console.log(
      `${colors.cyan}${colors.bold}───────────────────────────────────────────────────────────────────────────${colors.reset}\n`
    );
  }
}
