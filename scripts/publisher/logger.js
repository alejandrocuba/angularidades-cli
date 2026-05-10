const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function logDoctor(success, message, isWarning = false) {
  if (success) {
    console.log(`${colors.green}✔${colors.reset} ${message}`);
  } else if (isWarning) {
    console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
  } else {
    console.log(`${colors.red}✘${colors.reset} ${message}`);
  }
}

function printHeader(title) {
  console.log(`\n${colors.blue}${colors.bold}╔════════════════════════════════════════════╗`);
  const padding = Math.max(0, Math.floor((44 - title.length) / 2));
  const extraPadding = (44 - title.length) % 2;
  console.log(`║${' '.repeat(padding)}${title}${' '.repeat(padding + extraPadding)}║`);
  console.log(`╚════════════════════════════════════════════╝${colors.reset}\n`);
}

module.exports = { colors, logDoctor, printHeader };
