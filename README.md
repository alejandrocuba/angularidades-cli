# Angularidades CLI

[![CI](https://github.com/alejandrocuba/angularidades-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/alejandrocuba/angularidades-cli/actions/workflows/ci.yml)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Commander.js](https://img.shields.io/badge/Commander.js-v15-black)](https://github.com/tj/commander.js)
[![Vitest](https://img.shields.io/badge/Vitest-v4-839a03?logo=vitest&logoColor=white)](https://vitest.dev)
[![ESLint](https://img.shields.io/badge/ESLint-v10-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-v3-F7B93E?logo=prettier&logoColor=black)](https://prettier.io/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D26.0.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

The CLI supporting the planning, post-production and publishing workflow of the **Angularidades** podcast.

## Podcast Channels

[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://www.youtube.com/@angularidades)
[![Spotify](https://img.shields.io/badge/Spotify-%231ED760.svg?style=for-the-badge&logo=Spotify&logoColor=white)](https://creators.spotify.com/pod/show/angularidades)

### Latest Episodes

<!-- YOUTUBE:START -->

<a href="https://www.youtube.com/watch?v=XMMzoqvEvOE" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/XMMzoqvEvOE/mqdefault.jpg" alt="Angularidades Episode"></a>&nbsp;&nbsp;
<a href="https://www.youtube.com/watch?v=bE6Ip5NNbck" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/bE6Ip5NNbck/mqdefault.jpg" alt="Angularidades Episode"></a>&nbsp;&nbsp;
<a href="https://www.youtube.com/watch?v=wIaThYaieUA" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/wIaThYaieUA/mqdefault.jpg" alt="Angularidades Episode"></a>&nbsp;&nbsp;
<a href="https://www.youtube.com/watch?v=RNloEbj6BDU" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/RNloEbj6BDU/mqdefault.jpg" alt="Angularidades Episode"></a>&nbsp;&nbsp;
<a href="https://www.youtube.com/watch?v=YrY3tgbkJkY" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/YrY3tgbkJkY/mqdefault.jpg" alt="Angularidades Episode"></a>&nbsp;&nbsp;
<a href="https://www.youtube.com/watch?v=Dt5rw1UCh5Q" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/Dt5rw1UCh5Q/mqdefault.jpg" alt="Angularidades Episode"></a>&nbsp;&nbsp;
<a href="https://www.youtube.com/watch?v=3AD-vIqvCgs" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/3AD-vIqvCgs/mqdefault.jpg" alt="Angularidades Episode"></a>&nbsp;&nbsp;
<a href="https://www.youtube.com/watch?v=ub69Np2ya-c" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/ub69Np2ya-c/mqdefault.jpg" alt="Angularidades Episode"></a>&nbsp;&nbsp;
<a href="https://www.youtube.com/watch?v=GoPtZ9-RKCY" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/GoPtZ9-RKCY/mqdefault.jpg" alt="Angularidades Episode"></a>&nbsp;&nbsp;
<a href="https://www.youtube.com/watch?v=doi_5ZEGwHI" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/doi_5ZEGwHI/mqdefault.jpg" alt="Angularidades Episode"></a>&nbsp;&nbsp;
<a href="https://www.youtube.com/watch?v=Lm39W_8HLvA" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/Lm39W_8HLvA/mqdefault.jpg" alt="Angularidades Episode"></a>&nbsp;&nbsp;
<a href="https://www.youtube.com/watch?v=ZTSfCWwYymo" target="_blank" rel="noopener noreferrer"><img width="180" src="https://i.ytimg.com/vi/ZTSfCWwYymo/mqdefault.jpg" alt="Angularidades Episode"></a>

<!-- YOUTUBE:END -->

<a href="https://www.youtube.com/@angularidades" target="_blank" rel="noopener noreferrer">See more Angularidades episodes on YouTube »</a>

## Features

- **Interactive Fallback Menu:** Running `angularidades` without arguments opens an elegant dashboard guide.
- **Scaffolding:** Create folder structures and fetch initial captions (`angularidades scaffold [episode]`, aliases: `new`, `create`).
- **Publishing:** Sync metadata and transcripts to YouTube (`angularidades publish [episode]`, alias: `sync`).
- **Dry Run:** Safely test configuration and preview YouTube payloads (`angularidades publish [episode] --dry-run` or `-d`).
- **Diagnostics:** Run connectivity, credentials, and alignment checks (`angularidades doctor [episode]`, aliases: `check`, `validate`).
- **Latest Resolver:** Use `latest` as the episode parameter (e.g. `latest` resolves to the most recently created episode folder automatically).

## Project Structure

- `.agents/`: Specialized AI agents for planning and publishing.
- `bin/`: CLI entry points.
- `episodes/`: Work directory organized by episode number.
- `scripts/`: Internal logic and YouTube API integrations.

## Installation & Setup

To get started with the Angularidades CLI pipeline, simply install the dependencies:

```bash
pnpm install
```

The setup script will automatically run post-installation to link the `angularidades` CLI tool globally on your system and set up shell autocompletion. (If you ever need to re-run the setup manually, you can use `pnpm run setup`).

## Shell Autocompletion (Zsh)

To enable tab-completion for commands and episode directories, add the autocompletion script to your shell configuration (e.g. `~/.zshrc`):

```bash
# Load angularidades autocompletions
source <(angularidades completion)
```

Then reload your shell session (`source ~/.zshrc`). Now, typing `angularidades publish [TAB]` will dynamically suggest commands, aliases, episode directories, and the `latest` keyword!

## Workflow

The project provides a unified CLI tool: `angularidades`. If you haven't linked it yet, you can also use `pnpm run youtube:<command>` (e.g., `pnpm run youtube:publish --dry-run`).

### 1. Planning Phase (Pre-recording)

1. Determine the upcoming episode's Topic or Guest Profile.
2. Run the Planner agent pointing to `.agents/planner/system_prompt.md`.
3. Save the output to `episodes/<episode-number>/0_planner/script.md`.
4. Use the generated `script.md` to conduct the interview via teleprompter.

### 2. Publishing Phase (Post-recording)

1. **Scaffolding:** Create the episode structure and metadata. It will automatically fetch captions from YouTube:
   ```bash
   angularidades scaffold <episode>          # e.g., angularidades scaffold 89 (aliases: new, create)
   ```
2. **Diagnostics:** Run the Doctor check to ensure all metadata and credentials are ready:
   ```bash
   angularidades doctor <episode>            # e.g., angularidades doctor latest (aliases: check, validate)
   ```
3. **AI Processing:** Instruct the `@publisher` AI Agent (your AI Assistant) to process the episode using the planner script and YouTube captions as inputs. The agent will place all generated files (titles, descriptions, LinkedIn posts, and corrected transcripts) into the `2_publisher/` folder.
4. **Verification:** Run a dry-run to verify the payload that will be sent to YouTube:
   ```bash
   angularidades publish <episode> --dry-run  # e.g., angularidades publish latest -d
   ```
5. **Publishing:** Push the metadata and transcripts to the YouTube API:
   ```bash
   angularidades publish <episode>            # e.g., angularidades publish latest (alias: sync)
   ```
   _Note: If no episode is provided, the CLI will prompt you to select one. Running the CLI without a command at all (`angularidades`) will launch the visual overview selection guide._

## Running Tests

To verify local changes and prevent regressions, you can run the test suites:

### Run All Tests (Unit + E2E)

```bash
# Run all tests once
pnpm test

# Run tests in interactive watch mode
pnpm run test:watch
```

### Run E2E Integration Tests Only

To run only the E2E CLI integration test suite:

```bash
pnpm run test:e2e
```

## Caption Translation & Alignment Workflow (Internal)

The pipeline automatically attempts to download the existing YouTube captions (giving priority to Spanish ASR or manual tracks) and saves them to `1_recording/captions.sbv`. This serves as a source of truth for the Publisher Agent, eliminating manual copy-pasting.

To translate captions to English block-by-block while maximizing token efficiency and ensuring perfect synchronization, use the internal `translate-helper.js` script:

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

## YouTube Authentication Setup

> **Note for Contributors:** If you are a standard contributor you **do not** need to continue with this section. You can use the `pnpm run youtube:dry-run` command to test your changes locally. This full OAuth setup is exclusively for core maintainers of the Angularidades project who have explicit "Editor" or "Manager" permissions on the Angularidades YouTube channel and need to update the CI/CD secrets or publish locally.

To run the automated `pnpm run youtube:publish` script, you must configure Google Cloud OAuth2 credentials. The project utilizes a "Desktop App" OAuth flow to securely generate a Refresh Token.

**1. Create Google Cloud Credentials:**

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **YouTube Data API v3** in your project.
3. Configure the **OAuth consent screen** (External). Your email should be added under the **Test users** section to avoid `Error 403: access_denied`.
4. Go to **Credentials** > **Create Credentials** > **OAuth client ID**.
5. Select **Application type: Desktop App** (This avoids `redirect_uri` mismatch errors).
6. Copy the generated **Client ID** and **Client Secret**.

**2. Generate the Refresh Token:**

1. Copy `.env.example` to `.env` and paste your Client ID and Secret.
2. Run the included authentication helper script:
   ```bash
   node scripts/auth-helper.js
   ```
3. Click the provided URL, authorize the app, and copy the `code` from the browser's address bar.
4. Paste the code back into your terminal to receive your **Refresh Token**.
5. Save all three values in your `.env` file for local use, and upload them to **GitHub Secrets** for CI/CD automation.
