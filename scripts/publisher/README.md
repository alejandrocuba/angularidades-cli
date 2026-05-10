# YouTube Publisher Automation

This directory contains the modular implementation of the YouTube publishing pipeline. It is designed to be maintainable, testable, and robust.

## Architecture

The script is split into cohesive modules following Node.js best practices:

- **`index.js`**: The main entry point and orchestrator. It coordinates the flow between data loading, API calls, and UI output.
- **`config.js`**: Handles CLI argument parsing (`--doctor`, `--dry-run`, `-e`), environment variable loading, and episode directory resolution.
- **`youtube-api.js`**: Encapsulates all interactions with the Google YouTube Data API v3 (Authentication, Video updates, and Caption management).
- **`file-manager.js`**: Manages all file system operations, including reading episode metadata, local publisher assets (titles, descriptions, tags), and saving downloaded captions.
- **`logger.js`**: Provides a consistent UI/UX for the terminal, including ANSI colors, status symbols, and the "Doctor" diagnostic layout.

## Usage

### Commands

| Command | Description |
|---------|-------------|
| `npm run youtube:publish -- <episode>` | Publishes all metadata and transcripts to YouTube (Requires full Auth). |
| `npm run youtube:dry-run -- <episode>` | Simulates the publishing process and prints the payload. |
| `npm run youtube:doctor -- <episode>` | Runs a diagnostic check of all requirements and API connectivity. |

### Parameters

- `<episode>`: The episode number (e.g., `89`) or the full path to the episode directory.
- `--doctor`: Runs diagnostics with a visual checklist of successes/warnings/failures.
- `--dry-run`: Performs a simulation. If credentials are missing, it performs an **Offline Dry Run**. If credentials are present, it performs an **Authenticated Dry Run** (checking video existence on YouTube).

## Dynamic Captions

The pipeline now automatically attempts to download the existing YouTube captions (giving priority to Spanish ASR or manual tracks) and saves them to `1_recording/youtube_captions.sbv`. This serves as a source of truth for the Publisher Agent, eliminating the need for manual copy-pasting.
