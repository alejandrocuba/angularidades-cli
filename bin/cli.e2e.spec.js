import { describe, test, expect } from 'vitest';
import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const CLI_PATH = path.resolve(import.meta.dirname, './cli.js');

describe('CLI E2E Tests', () => {
  // Helper to run CLI command synchronously
  const runCLI = (tempDir, args, options = {}) => {
    try {
      const stdout = execFileSync('node', [CLI_PATH, ...args], {
        env: {
          ...process.env,
          ANGULARIDADES_EPISODES_DIR: tempDir,
          YOUTUBE_CLIENT_ID: '',
          YOUTUBE_CLIENT_SECRET: '',
          YOUTUBE_REFRESH_TOKEN: '',
          ...options.env
        },
        encoding: 'utf8'
      });
      return { stdout, exitCode: 0 };
    } catch (error) {
      return { stdout: error.stdout || '', stderr: error.stderr || '', exitCode: error.status };
    }
  };

  test('should display help menu', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'angularidades-e2e-'));
    try {
      const { stdout, exitCode } = runCLI(tempDir, ['--help']);
      expect(exitCode).toBe(0);
      expect(stdout).toContain('Usage: angularidades');
      expect(stdout).toContain('scaffold');
      expect(stdout).toContain('publish');
      expect(stdout).toContain('doctor');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should display version', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'angularidades-e2e-'));
    try {
      const { stdout, exitCode } = runCLI(tempDir, ['--version']);
      expect(exitCode).toBe(0);
      expect(stdout).toMatch(/1\.0\.0/);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should suggest nearest command on typo', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'angularidades-e2e-'));
    try {
      const { stderr, exitCode } = runCLI(tempDir, ['doctro']);
      expect(exitCode).toBe(1);
      expect(stderr).toContain("unknown command 'doctro'");
      expect(stderr).toContain('Did you mean');
      expect(stderr).toContain('doctor');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should generate completion script', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'angularidades-e2e-'));
    try {
      const { stdout, exitCode } = runCLI(tempDir, ['completion']);
      expect(exitCode).toBe(0);
      expect(stdout).toContain('#compdef _angularidades');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should fail/cancel doctor check if target episode does not exist', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'angularidades-e2e-'));
    try {
      const { stdout, exitCode } = runCLI(tempDir, ['doctor', '9999']);
      expect(exitCode).toBe(0);
      expect(stdout).toContain('Episode 9999 does not exist');
      expect(stdout).toContain('Would you like to start the creation flow');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should run doctor check on scaffolded episode', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'angularidades-e2e-'));
    try {
      const episodeDir = path.join(tempDir, '8999');
      fs.mkdirSync(path.join(episodeDir, '2_publisher'), { recursive: true });
      fs.writeFileSync(
        path.join(episodeDir, '2_publisher', 'youtube_description_es.md'),
        'Spanish description'
      );
      fs.writeFileSync(path.join(episodeDir, '2_publisher', 'youtube_tags.txt'), 'angular, tests');

      fs.writeFileSync(
        path.join(episodeDir, 'metadata.json'),
        JSON.stringify(
          {
            recordingDate: '2026-06-10',
            videoId: 'abcdefghijk'
          },
          null,
          2
        )
      );

      const { stdout, exitCode } = runCLI(tempDir, ['doctor', '8999']);
      expect(exitCode).toBe(0);
      expect(stdout).toContain('Doctor');
      expect(stdout).toContain('metadata.json found');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should perform offline dry-run publish on scaffolded episode', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'angularidades-e2e-'));
    try {
      const episodeDir = path.join(tempDir, '8999');
      fs.mkdirSync(path.join(episodeDir, '2_publisher'), { recursive: true });
      fs.writeFileSync(
        path.join(episodeDir, '2_publisher', 'youtube_description_es.md'),
        'Spanish description'
      );
      fs.writeFileSync(path.join(episodeDir, '2_publisher', 'youtube_tags.txt'), 'angular, tests');

      fs.writeFileSync(
        path.join(episodeDir, 'metadata.json'),
        JSON.stringify(
          {
            recordingDate: '2026-06-10',
            videoId: 'abcdefghijk'
          },
          null,
          2
        )
      );

      const { stdout, exitCode } = runCLI(tempDir, ['publish', '8999', '--dry-run']);
      expect(exitCode).toBe(0);
      expect(stdout).toContain('DRY RUN PAYLOAD');
      expect(stdout).toContain('Video ID: abcdefghijk');
      expect(stdout).toContain('Description (ES):\n Spanish description');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
