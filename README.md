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
3. Save the output to `episodes/XXXX/0_planner/script.md`.
4. Use the generated `script.md` to conduct the interview via teleprompter.

### 2. Publishing Phase (Post-recording)
1. Place the recorded transcripts (`transcript.txt`, `youtube.srt`, etc.) inside the `episodes/XXXX/1_recording/` folder.
2. **Publishing:** Run the Publisher agent pointing to `.agents/publisher/system_prompt.md`. The agent reads from `0_planner/` and `1_recording/` and places all generated files (descriptions, LinkedIn post, chapters, and translated transcripts) into the `2_publisher/` folder.