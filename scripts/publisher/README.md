# YouTube Publisher Automation

This directory contains the modular implementation of the YouTube publishing pipeline. It is designed to be maintainable, testable, and robust.

## Architecture

The CLI is split into cohesive modules following Node.js best practices:

- **`index.js`**: The main entry point and orchestrator.
- **`config.js`**: Handles CLI argument parsing, interactive menus, and environment resolution.
- **`youtube-api.js`**: Encapsulates all interactions with the Google YouTube Data API v3.
- **`file-manager.js`**: Manages all file system operations.
- **`logger.js`**: Provides a consistent UI/UX with ANSI colors and status symbols.

## Usage

While you can use `pnpm run`, the recommended way is using the global CLI.

### Commands

| Command | Description |
|---------|-------------|
| `angularidades new`     | Creates the scaffolding for a new episode (dirs & metadata). |
| `angularidades publish` | Publishes all metadata and transcripts to YouTube (Requires full Auth). |
| `angularidades dry-run` | Simulates the publishing process and prints the payload. |
| `angularidades doctor`  | Runs a diagnostic check of all requirements and API connectivity. |


### Parameters

- `<episode>`: The episode number (e.g., `89`) or the full path to the episode directory.
- `--doctor`: Runs diagnostics with a visual checklist of successes/warnings/failures.
- `--dry-run`: Performs a simulation. If credentials are missing, it performs an **Offline Dry Run**. If credentials are present, it performs an **Authenticated Dry Run** (checking video existence on YouTube).

## Dynamic Captions

The pipeline now automatically attempts to download the existing YouTube captions (giving priority to Spanish ASR or manual tracks) and saves them to `1_recording/youtube_captions.sbv`. This serves as a source of truth for the Publisher Agent, eliminating the need for manual copy-pasting.
