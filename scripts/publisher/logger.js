export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
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
