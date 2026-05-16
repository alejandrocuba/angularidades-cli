#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const p = require('@clack/prompts');
const { colors } = require('../scripts/publisher/logger');

async function main() {
  const args = process.argv.slice(2);
  let command = args[0];
  let remainingArgs = args.slice(1);

  // If no command or help is requested, show the interactive menu and help
  if (!command || command === '--help' || command === '-h') {
    p.intro(`${colors.cyan}${colors.bold}Angularidades CLI${colors.reset}`);

    p.note(
      `${colors.bold}Available Flags:${colors.reset}\n` +
      `  --episode, -e  Specify the episode number\n` +
      `  --dry-run      Run in dry-run mode (preview changes)\n` +
      `  --doctor       Run in doctor mode (diagnostics)`,
      'Global Options'
    );

    if (!command) {
      const selected = await p.select({
        message: 'What would you like to do?',
        options: [
          { value: 'publish', label: '🚀 Publish Episode', hint: 'Update YouTube metadata and captions' },
          { value: 'dry-run', label: '🔍 Dry Run', hint: 'Preview changes without uploading' },
          { value: 'doctor', label: '⛑️ Doctor Check', hint: 'Verify files and credentials' },
          { value: 'new', label: '➕ Create New Episode', hint: 'Scaffold directories and initial files' },
        ]
      });

      if (p.isCancel(selected)) {
        p.cancel('Operation cancelled.');
        process.exit(0);
      }
      command = selected;
    } else {
      p.outro(`Usage: ${colors.cyan}angularidades <command> [options]${colors.reset}`);
      process.exit(0);
    }
  }

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
    case 'new':
    case 'scaffold':
      await require('../scripts/publisher/scaffold').scaffoldEpisode();
      return;
    default:
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
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
