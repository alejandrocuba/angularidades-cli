import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Check for pnpm
try {
  execSync('command -v pnpm', { stdio: 'ignore' });
} catch {
  console.error('Error: pnpm is not installed. Please install it first (e.g., brew install pnpm).');
  process.exit(1);
}

// Install dependencies if not already present
if (!fs.existsSync('node_modules') || !fs.existsSync('node_modules/@clack/prompts')) {
  console.log('Installing project dependencies...');
  try {
    execSync('pnpm install --silent', { stdio: 'inherit' });
  } catch {
    console.error('Error: Failed to install dependencies.');
    process.exit(1);
  }
}

// Dynamically import dependencies for the interactive Clack prompts
const p = await import('@clack/prompts');
const { colors } = await import('./publisher/logger.js');

async function main() {
  p.intro(`${colors.cyan}${colors.bold}Angularidades: Project Initializer${colors.reset}`);

  // Check if angularidades command is already set up
  let alreadySetup = false;
  try {
    execSync('command -v angularidades', { stdio: 'ignore', shell: '/bin/zsh' });
    alreadySetup = true;
  } catch {
    try {
      execSync('command -v angularidades', { stdio: 'ignore', shell: '/bin/bash' });
      alreadySetup = true;
    } catch {
      // Not setup in bash either
    }
  }

  if (alreadySetup) {
    p.log.warn('Skipping link process: the command "angularidades" is already available.');
  } else {
    const s = p.spinner();
    s.start('Linking CLI command "angularidades" globally...');
    try {
      // Find global bin directory for pnpm
      let pnpmBinDir = '';
      try {
        pnpmBinDir = execSync('pnpm config get global-bin-dir', { encoding: 'utf8' }).trim();
      } catch {
        pnpmBinDir = '';
      }

      if (!pnpmBinDir || pnpmBinDir === 'undefined') {
        pnpmBinDir = path.join(os.homedir(), 'Library/pnpm/bin');
      }

      fs.mkdirSync(pnpmBinDir, { recursive: true });

      // Run pnpm add -g .
      execSync('pnpm add -g . --silent', { stdio: 'ignore' });
      s.stop('CLI command linked successfully');
    } catch (error) {
      s.stop('Failed to link CLI command');
      p.log.error(`Error linking CLI command: ${error.message}`);
      p.log.info('Tip: Try running "pnpm setup" and then "source ~/.zshrc"');
      process.exit(1);
    }
  }

  // Shell autocompletion setup
  const shell = process.env.SHELL || '';
  if (shell.endsWith('zsh')) {
    const zshrc = path.join(os.homedir(), '.zshrc');
    if (fs.existsSync(zshrc)) {
      const zshrcContent = fs.readFileSync(zshrc, 'utf8');
      if (!zshrcContent.includes('angularidades completion')) {
        const confirmCompletion = await p.confirm({
          message: 'Would you like to enable shell autocompletion for "angularidades"?',
          initialValue: true
        });

        if (!p.isCancel(confirmCompletion) && confirmCompletion) {
          fs.appendFileSync(
            zshrc,
            '\n# Load angularidades autocompletions\nsource <(angularidades completion)\n'
          );
          p.log.success(`Added autocompletion hook to ${colors.bold}~/.zshrc${colors.reset}`);
        }
      }
    }
  }

  // Verification
  p.outro(`${colors.green}${colors.bold}✨ Setup complete!${colors.reset}`);

  p.note(
    `Next steps:\n` +
      `1. Run: ${colors.bold}source ~/.zshrc${colors.reset} (to load autocompletion and paths in this session)\n` +
      `2. Try: ${colors.bold}angularidades doctor${colors.reset} to verify credential setups`,
    'Onboarding Guide'
  );
}

main().catch((err) => {
  console.error('Initialization error:', err);
  process.exit(1);
});
