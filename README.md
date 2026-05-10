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
- `episodes/`: Work directory. Each episode has its own subfolder with its `inputs/` and `outputs/`.

## Workflow

### 1. Planning Phase (Pre-recording)
1. Determine the upcoming episode's Topic or Guest Profile.
2. Run the Planner agent pointing to `.agents/planner/system_prompt.md`.
3. Use the generated questions and technical strategy to conduct the interview.

### 2. Publishing Phase (Post-recording)
1. Create the episode folder (e.g., `episodes/ep_XXX/inputs/`).
2. Place the recorded transcripts (`transcript.txt`, `youtube.srt`, etc.) inside the `inputs/` folder.
3. **Publishing:** Run the Publisher agent pointing to `.agents/publisher/system_prompt.md` to generate the description, LinkedIn post, chapters, and translated/corrected transcripts in one step.