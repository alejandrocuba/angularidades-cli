# Angularidades Ops CLI 🚀

The official Command Line Interface for automating the post-production and publishing workflow of the **Angularidades** podcast.

## Links
- [YouTube](https://www.youtube.com/@angularidades)
- [Spotify](creators.spotify.com/pod/show/angularidades)

## Features
- 🛠️ **Diagnostics:** Use `angularidades doctor` to check metadata and credentials.
- 📦 **Publishing:** Sync transcripts, descriptions, and tags to YouTube via `angularidades publish`.
- 🔍 **Dry Run:** Preview exactly what will be sent to YouTube before making changes.
- 💬 **Interactive Menu:** Select episodes from an elegant, state-of-the-art terminal UI.

## Project Structure
- `.agents/`: Specialized AI agents for planning and publishing.
- `bin/`: CLI entry points.
- `episodes/`: Work directory organized by episode number.
- `scripts/`: Internal logic and YouTube API integrations.

## Installation & Setup

To get started with the Angularidades Ops pipeline, run the initialization script:

```bash
./init.sh
```

This script will install dependencies and link the `angularidades` CLI tool globally on your system.

## Workflow

The project provides a unified CLI tool: `angularidades`. If you haven't linked it yet, you can also use `pnpm run youtube:<command>`.

### 1. Planning Phase (Pre-recording)
1. Determine the upcoming episode's Topic or Guest Profile.
2. Run the Planner agent pointing to `.agents/planner/system_prompt.md`.
3. Save the output to `episodes/<episode-number>/0_planner/script.md`.
4. Use the generated `script.md` to conduct the interview via teleprompter.

### 2. Publishing Phase (Post-recording)
1. **Diagnostics:** Run the Doctor check to ensure all metadata and credentials are ready:
   ```bash
   angularidades doctor
   ```
2. **Recording Input:** The script automatically fetches the recorded transcripts and captions from YouTube and places them inside the `episodes/<episode-number>/1_recording/` folder for the agent.
3. **Generation:** Run the Publisher agent pointing to `.agents/publisher/system_prompt.md`. The agent reads from `0_planner/` and `1_recording/` and places all generated files (titles, descriptions, LinkedIn posts, and corrected transcripts) into the `2_publisher/` folder.
4. **Verification:** Run a dry-run to verify the payload that will be sent to YouTube:
   ```bash
   angularidades dry-run
   ```
5. **Publishing:** Push the metadata and transcripts to the YouTube API:
   ```bash
   angularidades publish
   ```
   *Note: If no episode is provided, the CLI will present an interactive selection menu.*


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