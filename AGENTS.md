# Agentic Engineering Protocols

> [!IMPORTANT]
> Inherits [AGENTS.core.md](AGENTS.core.md).

## Project-Specific Rules

- **CLI Usage**: Perform workflow tasks using the unified CLI:
  - `angularidades scaffold [episode]` (aliases: `new`, `create`) to generate structure.
  - `angularidades doctor [episode]` (aliases: `check`, `validate`) to run checks.
  - `angularidades publish [episode]` (alias: `sync`) to upload (use `-d` / `--dry-run` for preview).
  - Use the keyword `latest` to target the newest episode automatically (e.g. `angularidades doctor latest`).
- **Caption Pipeline**: Keep the caption processing utilities private/internal. Do not expose them on the public CLI namespace. Run manually:
  - `node scripts/publisher/translate-helper.js <dump|build|validate> [episode]`
- **Caption Processing & Correction Protocols (Spanish-Only)**:
  - **Native LLM Processing & Technical Review**: Raw YouTube auto-generated captions (`captions.sbv` / `youtube_captions.sbv` / `chunk-*.json`) contain severe ASR phonetic errors, grammatical/semantic glitches, and misspellings of technical concepts. The agent—leveraging deep Frontend and Angular domain expertise from the `angular-developer` skill—MUST directly review and correct all source chunks in Spanish using its own LLM capabilities during generation. **Do NOT write or execute static regex scripts/dictionaries.** Subtitles in English and other languages are deferred to YouTube's automated translation engine.
  - **Correction Scope**:
    1. **Grammar & Semantics**: Fix grammatical, semantic, and phonetic transcription mistakes from YouTube ASR.
    2. **People & Names**: Correct any inconsistencies with people's names (hosts, guests, and community references).
    3. **Angular Technical Terms**: Standardize and fix technical terms using official Angular documentation (`angular.dev`) and the `angular-developer` skill (e.g. `Signals`, `@angular/core`, `SSRF`, `XSS`, `hydration`, `compiler diagnostics`).
    4. **Line Breaks**: Strictly preserve internal line breaks (`\n`) within each block to maintain subtitle line structure and pacing.
  - **Strict 1-to-1 Chunk Alignment**: Every chunk file `es-chunk-X-Y.json` MUST contain exactly `(Y - X + 1)` items matching the source block indices 1-to-1. Never merge, split, or drop blocks across chunk boundaries.
    > [!IMPORTANT]
    > **Do NOT use automated scripts to pad or duplicate array elements to force alignment.** You must natively review and correct the lines 1-to-1 during generation, maintaining the exact pacing of the Spanish subtitles regardless of auto-transcriber errors. If array lengths mismatch, you must manually correct the missing/merged items.
  - **Pre-Build Validation**: Always run `node scripts/publisher/translate-helper.js validate [episode]` to verify chunk coverage and 100% element count alignment before running `build`.
  - **Post-Build Cleanup**: After successfully running the `build` command and verifying `youtube_captions_es.sbv` is complete, immediately delete all temporary chunk files (`blocks.json`, `chunk-*.json`, `es-chunk-*.json`) to keep the workspace clean.
- **Episode Planning Protocol**: When asked to plan, draft, outline, or generate questions/scripts for an episode (`0_planner/script.md`), the agent MUST read and strictly adhere to `.agents/planner/system_prompt.md` (Mode A for monologues, Mode B for guest dialogues with `💡` cue notes).
- **Episode Publishing & Post-Production Protocol**: When asked to generate episode summaries, titles, social posts, or publish metadata (`2_publisher/*`), the agent MUST read and strictly adhere to `.agents/publisher/system_prompt.md` and `.agents/publisher/output_schema.md`. In particular, YouTube chapter titles must strictly follow brevity best practices: concise, punchy titles of 2–5 words (< 40 characters), beginning at `00:00:00 Intro`, without colon-separated explanatory subtitles that truncate in YouTube's scrubber interface.
- **Modularity**: Expose core workflow routines from `scripts/publisher/` and invoke them inside `bin/cli.js` rather than repeating argument handling or spawning Node child processes.
- **Verification & Publishing**: Do not automatically run `angularidades doctor` or `angularidades publish` after minor text edits or formatting changes. Only execute them when explicitly asked by the user or upon completing a major workflow milestone.
