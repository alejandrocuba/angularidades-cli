import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import p from '@clack/prompts';
import { resolveConfig } from './config.js';

vi.mock('@clack/prompts', () => {
  const select = vi.fn();
  const confirm = vi.fn();
  const cancel = vi.fn();
  const isCancel = vi.fn((val) => val === '__CANCEL__');
  const log = {
    error: vi.fn(),
    warn: vi.fn()
  };
  return {
    select,
    confirm,
    cancel,
    isCancel,
    log,
    default: {
      select,
      confirm,
      cancel,
      isCancel,
      log
    }
  };
});

describe('config', () => {
  let originalArgv;
  let originalExit;
  let originalEnv;

  beforeEach(() => {
    originalArgv = process.argv;
    originalExit = process.exit;
    originalEnv = { ...process.env };
    process.exit = vi.fn();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exit = originalExit;
    process.env = originalEnv;
  });

  test('should resolve configuration with explicit options override (no interactive prompts)', async () => {
    const mockEpisodesDir = path.join(import.meta.dirname, '../../episodes');

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => p.startsWith(mockEpisodesDir));
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['0088', '0089']);
    vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true });

    const config = await resolveConfig({
      episode: '89',
      dryRun: true,
      doctor: false,
      prompts: p
    });

    expect(config.isDryRun).toBe(true);
    expect(config.isDoctor).toBe(false);
    expect(config.episodeDir).toContain('0089');
    expect(process.exit).not.toHaveBeenCalled();
  });

  test('should resolve "latest" to the highest numbered directory', async () => {
    const mockEpisodesDir = path.join(import.meta.dirname, '../../episodes');

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => p.startsWith(mockEpisodesDir));
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['0088', '0090', '0089']);
    vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true });

    const config = await resolveConfig({
      episode: 'latest',
      dryRun: false,
      doctor: true,
      prompts: p
    });

    expect(config.isDoctor).toBe(true);
    expect(config.episodeDir).toContain('0090');
    expect(process.exit).not.toHaveBeenCalled();
  });

  test('should prompt with select menu if episode is not provided', async () => {
    const mockEpisodesDir = path.join(import.meta.dirname, '../../episodes');

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => p.startsWith(mockEpisodesDir));
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['0089']);
    vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true });

    p.select.mockResolvedValue('89');

    const config = await resolveConfig({
      dryRun: true,
      doctor: false,
      prompts: p
    });

    expect(p.select).toHaveBeenCalled();
    expect(config.episodeDir).toContain('0089');
    expect(process.exit).not.toHaveBeenCalled();
  });

  test('should exit if select menu is cancelled', async () => {
    const mockEpisodesDir = path.join(import.meta.dirname, '../../episodes');

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => p.startsWith(mockEpisodesDir));
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['0089']);
    vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true });

    p.select.mockResolvedValue('__CANCEL__');

    await resolveConfig({
      dryRun: true,
      doctor: false,
      prompts: p
    });

    expect(p.cancel).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  test('should warn and prompt if modifying an older episode (not dryRun, not doctor)', async () => {
    const mockEpisodesDir = path.join(import.meta.dirname, '../../episodes');

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => p.startsWith(mockEpisodesDir));
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['0090', '0089']);
    vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true });

    p.confirm.mockResolvedValue(true);

    const config = await resolveConfig({
      episode: '89',
      dryRun: false,
      doctor: false,
      prompts: p
    });

    expect(p.confirm).toHaveBeenCalled();
    expect(config.episodeDir).toContain('0089');
    expect(process.exit).not.toHaveBeenCalled();
  });

  test('should abort and exit if older episode warning prompt is rejected', async () => {
    const mockEpisodesDir = path.join(import.meta.dirname, '../../episodes');

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => p.startsWith(mockEpisodesDir));
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['0090', '0089']);
    vi.spyOn(fs, 'lstatSync').mockReturnValue({ isDirectory: () => true });

    p.confirm.mockResolvedValue(false);

    await resolveConfig({
      episode: '89',
      dryRun: false,
      doctor: false,
      prompts: p
    });

    expect(p.confirm).toHaveBeenCalled();
    expect(p.cancel).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(0);
  });
});
