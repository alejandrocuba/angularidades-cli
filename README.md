# Angularidades Content-Ops

Official repository for the automated generation of summaries, chapters, and posts for the Angularidades podcast.

## Links
- [YouTube](https://www.youtube.com/@angularidades)
- [Spotify](creators.spotify.com/pod/show/angularidades)

## Project Structure
- `.agents/`: Contains the agents' core, organized into specialized subdirectories for different phases:
  - `planner/`: Pre-recording agent for interview strategy and questions.
  - `publisher/`: Post-recording agent for all publishing tasks (descriptions, posts, chapters, and transcript translation/correction).
  - `skills/`: Official shared Angular context.
- `episodes/`: Work directory. Each episode has its own subfolder organized by phases (`0_planner/`, `1_recording/`, `2_publisher/`).

## Workflow

### 1. Planning Phase (Pre-recording)
1. Determine the upcoming episode's Topic or Guest Profile.
2. Run the Planner agent pointing to `.agents/planner/system_prompt.md`.
3. Save the output to `episodes/<episode-number>/0_planner/script.md`.
4. Use the generated `script.md` to conduct the interview via teleprompter.

### 2. Publishing Phase (Post-recording)
1. **Diagnostics:** Run the Doctor check to ensure all metadata and credentials are ready:
   ```bash
   pnpm run youtube:doctor <episode-number>
   ```
2. **Recording Input:** The script automatically fetches the recorded transcripts and captions from YouTube and places them inside the `episodes/<episode-number>/1_recording/` folder for the agent.
3. **Generation:** Run the Publisher agent pointing to `.agents/publisher/system_prompt.md`. The agent reads from `0_planner/` and `1_recording/` and places all generated files (titles, descriptions, LinkedIn posts, and corrected transcripts) into the `2_publisher/` folder.
4. **Verification:** Run a dry-run to verify the payload that will be sent to YouTube:
   ```bash
   pnpm run youtube:dry-run <episode-number>
   ```
5. **Publishing:** Push the metadata and transcripts to the YouTube API:
   ```bash
   pnpm run youtube:publish <episode-number>
   ```

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