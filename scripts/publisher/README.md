# YouTube Publisher Automation

This directory contains the modular implementation of the YouTube publishing pipeline. It is designed to be maintainable, testable, and robust.

## Architecture

The CLI is split into cohesive modules following Node.js best practices:

- **`scaffold.js`**: Handles new episode directory creation and YouTube caption fetching.
- **`index.js`**: The main publisher orchestrator for YouTube API sync.
- **`config.js`**: Handles CLI argument parsing, interactive menus, and environment resolution.
- **`youtube-api.js`**: Encapsulates all interactions with the Google YouTube Data API v3.
- **`file-manager.js`**: Manages all file system operations.
- **`logger.js`**: Provides a consistent UI/UX with ANSI colors and status symbols.

## Usage

While you can use `pnpm run`, the recommended way is using the global CLI.

### Commands

| Command | Description |
|---------|-------------|
| `angularidades new`     | Creates the scaffolding AND fetches initial captions from YouTube. |
| `angularidades publish` | Publishes all metadata and transcripts to YouTube (Requires full Auth). |
| `angularidades dry-run` | Simulates the publishing process and prints the payload. |
| `angularidades doctor`  | Runs a diagnostic check of all requirements and API connectivity. |


### Parameters

- `<episode>`: The episode number (e.g., `89`) or the full path to the episode directory.
- `--doctor`: Runs diagnostics with a visual checklist of successes/warnings/failures.
- `--dry-run`: Performs a simulation. If credentials are missing, it performs an **Offline Dry Run**. If credentials are present, it performs an **Authenticated Dry Run** (checking video existence on YouTube).

## Dynamic Captions & Translation Workflow

The pipeline automatically attempts to download the existing YouTube captions (giving priority to Spanish ASR or manual tracks) and saves them to `1_recording/captions.sbv`. This serves as a source of truth for the Publisher Agent, eliminating the need for manual copy-pasting.

To translate captions to English block-by-block while maximizing token efficiency and ensuring perfect synchronization, use the `translate-helper.js` script:

### 1. Dump Spanish captions to plain JSON chunks
```bash
node scripts/publisher/translate-helper.js dump <episode>
```
Splits the captions into `1_recording/blocks.json` and clean text arrays of 100 blocks each (e.g. `1_recording/chunk-0-99.json`, `chunk-100-199.json`, etc.) without timestamps. This minimizes token consumption during translation.

### 2. Translate JSON chunks
Translate the JSON text arrays to English using the AI agent, saving each chunk as `2_publisher/trans-X-Y.json` (e.g., `2_publisher/trans-0-99.json`).

### 3. Compile final English captions
```bash
node scripts/publisher/translate-helper.js build <episode>
```
Stitches the translated English JSON chunks back together using the original timestamps, performing strict block count validation.

### 4. Validate alignment (if mismatch occurs)
```bash
node scripts/publisher/translate-helper.js validate <episode>
```
Displays a side-by-side diagnostic report of Spanish source text and English translations to pinpoint alignment issues.
