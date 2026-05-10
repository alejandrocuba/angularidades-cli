#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];
const remainingArgs = args.slice(1);

const scriptPath = path.join(__dirname, '../scripts/publisher/index.js');

let finalArgs = [];

switch (command) {
  case 'doctor':
    finalArgs = ['--doctor', ...remainingArgs];
    break;
  case 'publish':
    finalArgs = [...remainingArgs];
    break;
  case 'dry-run':
    finalArgs = ['--dry-run', ...remainingArgs];
    break;
  default:
    // If no command matched, assume it's a direct call to publish or show help
    if (command && !command.startsWith('-')) {
      finalArgs = [command, ...remainingArgs];
    } else {
      finalArgs = [...args];
    }
}

const child = spawn('node', [scriptPath, ...finalArgs], {
  stdio: 'inherit',
  env: process.env
});

child.on('close', (code) => {
  process.exit(code);
});
