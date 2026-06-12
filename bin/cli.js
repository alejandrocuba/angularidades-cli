import { fileURLToPath } from 'url';
import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import * as p from '@clack/prompts';
import { colors, setLogLevel } from '../scripts/publisher/logger.js';
import { scaffoldEpisode } from '../scripts/publisher/scaffold.js';
import { publishEpisode } from '../scripts/publisher/index.js';

async function ensureEpisodeExists(episode) {
  if (!episode) return null;
  if (episode === 'latest') return 'latest';

  const episodesDir =
    process.env.ANGULARIDADES_EPISODES_DIR || path.join(import.meta.dirname, '../episodes');
  const episodeNumber = episode.toString().padStart(4, '0');
  const episodeDir = path.join(episodesDir, episodeNumber);

  if (!fs.existsSync(episodeDir)) {
    p.intro(`${colors.cyan}${colors.bold}Angularidades CLI${colors.reset}`);
    p.log.warn(`Episode ${episodeNumber} does not exist.`);
    const confirmCreate = await p.confirm({
      message: `Would you like to start the creation flow for Episode ${episodeNumber}?`,
      initialValue: true
    });

    if (p.isCancel(confirmCreate) || !confirmCreate) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    await scaffoldEpisode(episodeNumber);
    process.exit(0);
  }
  return episodeNumber;
}

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

async function runScaffold(episode) {
  await scaffoldEpisode(episode);
}

async function runPublish(episode, options) {
  const resolvedEpisode = await ensureEpisodeExists(episode);
  await publishEpisode({
    episode: resolvedEpisode,
    dryRun: options.dryRun,
    doctor: options.doctor
  });
}

async function runDoctor(episode) {
  const resolvedEpisode = await ensureEpisodeExists(episode);
  await publishEpisode({
    episode: resolvedEpisode,
    doctor: true
  });
}

async function runInteractiveMenu(program) {
  p.intro(`${colors.cyan}${colors.bold}Angularidades CLI${colors.reset}`);

  console.log(program.helpInformation());

  const selected = await p.select({
    message: 'What would you like to do?',
    options: [
      { value: 'scaffold', label: 'Create New Episode' },
      { value: 'dry-run', label: 'Dry Run Publish' },
      { value: 'publish', label: 'Publish Episode' },
      { value: 'doctor', label: 'Doctor Check' }
    ]
  });

  if (p.isCancel(selected)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  if (selected === 'scaffold') {
    await runScaffold(null);
  } else if (selected === 'doctor') {
    await runDoctor(null);
  } else if (selected === 'publish') {
    await runPublish(null, { dryRun: false });
  } else if (selected === 'dry-run') {
    await runPublish(null, { dryRun: true });
  }
}

async function main() {
  const program = new Command();

  program
    .name('angularidades')
    .description('CLI for the Angularidades podcast operations')
    .version('1.0.0')
    .usage('[command] [options]')
    .option('-v, --verbose', 'enable verbose logging')
    .option('-s, --silent', 'suppress all normal output');

  program.configureHelp({
    styleTitle: (str) => colors.bold + str + colors.reset,
    styleCommandText: (str) => colors.bold + colors.orange + str + colors.reset,
    styleSubcommandText: (str) => colors.orange + str + colors.reset,
    styleOptionText: (str) => colors.green + str + colors.reset,
    styleArgumentText: (str) => colors.blue + str + colors.reset,
    styleDescriptionText: (str) => colors.reset + str
  });

  program.hook('preAction', (_thisCommand, _actionCommand) => {
    const globalOpts = program.opts();
    setLogLevel({
      verbose: !!globalOpts.verbose,
      silent: !!globalOpts.silent
    });
  });

  program.on('command:*', (operands) => {
    const unknownCmd = operands[0];
    const availableCommands = ['scaffold', 'publish', 'doctor', 'completion'];

    let closestCmd = null;
    let minDistance = Infinity;

    for (const cmd of availableCommands) {
      const dist = levenshtein(unknownCmd, cmd);
      if (dist < minDistance) {
        minDistance = dist;
        closestCmd = cmd;
      }
    }

    console.error(`\n${colors.red}error: unknown command '${unknownCmd}'${colors.reset}`);
    if (minDistance <= 2 && closestCmd) {
      console.error(
        `       Did you mean: ${colors.cyan}${colors.bold}${closestCmd}${colors.reset}?\n`
      );
    } else {
      console.error(`       See: ${colors.cyan}angularidades --help${colors.reset}\n`);
    }
    process.exit(1);
  });

  // Options and subcommands will be parsed and executed below

  program
    .command('scaffold [episode]')
    .description('Create new episode scaffolding directory structure and fetch initial captions')
    .action(async (episode) => {
      await runScaffold(episode);
    });

  program
    .command('publish [episode]')
    .description('Sync and upload episode description, tags, metadata, and transcripts to YouTube')
    .option('-d, --dry-run', 'Preview payload and simulate publication offline or online')
    .action(async (episode, options) => {
      await runPublish(episode, { dryRun: !!options.dryRun });
    });

  program
    .command('doctor [episode]')
    .description('Run visual diagnostic checks on files, metadata, and YouTube API connectivity')
    .action(async (episode) => {
      await runDoctor(episode);
    });

  program
    .command('completion')
    .description('Generate shell autocompletion script for zsh')
    .action(() => {
      const script = `
#compdef _angularidades angularidades

_angularidades() {
  local -a commands
  commands=(
    'scaffold:Create new episode structure'
    'publish:Sync and upload episode to YouTube'
    'doctor:Run diagnostic check'
    'completion:Generate shell autocompletion script'
  )
  _arguments '1: :->command' '2: :->args'
  case $state in
    command)
      _describe -t commands 'angularidades commands' commands
      ;;
    args)
      case $line[1] in
        publish|doctor)
          local -a episodes
          episodes=($(ls -d episodes/* 2>/dev/null | awk -F/ '{print $NF}'))
          episodes+=('latest')
          _describe -t episodes 'episode' episodes
          ;;
      esac
      ;;
  esac
}
`;
      console.log(script.trim());
    });

  // Check if we should fall back to interactive menu
  const args = process.argv;
  if (args.length === 2) {
    await runInteractiveMenu(program);
    return;
  }

  await program.parseAsync(args);
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
  main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
}

export { main };
