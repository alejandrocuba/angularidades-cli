import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import p from '@clack/prompts';
import { scaffoldEpisode } from '../scripts/publisher/scaffold.js';
import { publishEpisode } from '../scripts/publisher/index.js';
import { main } from './cli.js';

vi.mock('googleapis', () => ({
  google: {
    youtube: vi.fn(),
    auth: {
      OAuth2: vi.fn()
    }
  }
}));

vi.mock('@clack/prompts', () => {
  const intro = vi.fn();
  const note = vi.fn();
  const text = vi.fn();
  const spinner = vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    message: vi.fn()
  }));
  const outro = vi.fn();
  const log = {
    warn: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn()
  };
  const select = vi.fn();
  const confirm = vi.fn();
  const cancel = vi.fn();
  const isCancel = vi.fn((val) => val === '__CANCEL__');
  return {
    intro,
    note,
    text,
    spinner,
    outro,
    log,
    select,
    confirm,
    cancel,
    isCancel,
    default: {
      intro,
      note,
      text,
      spinner,
      outro,
      log,
      select,
      confirm,
      cancel,
      isCancel
    }
  };
});

vi.mock('../scripts/publisher/scaffold.js', () => ({
  scaffoldEpisode: vi.fn()
}));

vi.mock('../scripts/publisher/index.js', () => ({
  publishEpisode: vi.fn()
}));

describe('cli', () => {
  let originalArgv;
  let originalExit;

  beforeEach(() => {
    originalArgv = process.argv;
    originalExit = process.exit;
    process.exit = vi.fn();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exit = originalExit;
  });

  test('should trigger interactive menu when run with no arguments', async () => {
    process.argv = ['node', 'cli.js'];
    p.select.mockResolvedValue('scaffold');

    await main();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(p.intro).toHaveBeenCalled();
    expect(p.select).toHaveBeenCalled();
    expect(scaffoldEpisode).toHaveBeenCalledWith(null);
  });

  test('should execute publish subcommand when publish command is run', async () => {
    process.argv = ['node', 'cli.js', 'publish', '89'];

    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    await main();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(publishEpisode).toHaveBeenCalledWith({
      episode: '0089',
      dryRun: false,
      doctor: undefined
    });
  });

  test('should trigger scaffold confirmation if publish target episode does not exist', async () => {
    process.argv = ['node', 'cli.js', 'publish', '89'];

    vi.spyOn(fs, 'existsSync').mockReturnValue(false); // Episode folder does not exist
    p.confirm.mockResolvedValue(true); // Accept scaffolding prompt

    await main();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(p.confirm).toHaveBeenCalled();
    expect(scaffoldEpisode).toHaveBeenCalledWith('0089');
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  test('should execute doctor subcommand when check command is run', async () => {
    process.argv = ['node', 'cli.js', 'check', 'latest'];

    await main();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(publishEpisode).toHaveBeenCalledWith({
      episode: 'latest',
      doctor: true
    });
  });
});
