# Agentic Engineering Protocols

> [!IMPORTANT]
> Inherits [AGENTS.core.md](AGENTS.core.md).

## Project-Specific Rules

- **CLI Usage**: Perform workflow tasks using the unified CLI:
  - `angularidades scaffold [episode]` (aliases: `new`, `create`) to generate structure.
  - `angularidades doctor [episode]` (aliases: `check`, `validate`) to run checks.
  - `angularidades publish [episode]` (alias: `sync`) to upload (use `-d` / `--dry-run` for preview).
  - Use the keyword `latest` to target the newest episode automatically (e.g. `angularidades doctor latest`).
- **Translation Pipeline**: Keep the caption translation utilities private/internal. Do not expose them on the public CLI namespace. Run manually:
  - `node scripts/publisher/translate-helper.js <dump|build|validate> [episode]`
- **Caption Processing & Translation Protocols**:
  - **Native LLM Processing**: Raw YouTube auto-generated captions (`captions.sbv` / `chunk-*.json`) contain severe ASR phonetic errors and misspellings of technical concepts. The agent—leveraging deep Frontend and Angular domain expertise from the `angular-developer` skill—MUST directly translate and process all source chunks using its own LLM capabilities during generation. **Do NOT write or execute static regex scripts/dictionaries.**
  - **Strict 1-to-1 Chunk Alignment**: Every chunk file `trans-X-Y.json` or `es-chunk-X-Y.json` MUST contain exactly `(Y - X + 1)` items matching the source block indices 1-to-1. Never merge, split, or drop blocks across chunk boundaries.
    > [!IMPORTANT]
    > **Do NOT use automated scripts to pad or duplicate array elements to force alignment.** You must natively translate and correct the lines 1-to-1 during generation, maintaining the exact pacing of the Spanish subtitles regardless of auto-transcriber errors. If array lengths mismatch, you must manually correct the missing/merged translations.
  - **Pre-Build Validation**: Always run `node scripts/publisher/translate-helper.js validate [episode]` to verify chunk coverage and 100% element count alignment before running `build`.
  - **Professional Quality Output & Filler Removal**: Ensure both Spanish and English captions are fluent, expert-level translations with precise technical syntax and zero residual untranslated or phonetically corrupted text. Deduplicate repeated stutter words and remove conversational filler words natively during LLM processing.
  - **Post-Build Cleanup**: After successfully running the `build` command and verifying the `.sbv` captions are complete, immediately delete all temporary chunk files (`chunk-*.json`, `trans-*.json`, `es-chunk-*.json`) to keep the workspace clean.
- **Modularity**: Expose core workflow routines from `scripts/publisher/` and invoke them inside `bin/cli.js` rather than repeating argument handling or spawning Node child processes.
- **Verification & Publishing**: Do not automatically run `angularidades doctor` or `angularidades publish` after minor text edits or formatting changes. Only execute them when explicitly asked by the user or upon completing a major workflow milestone.
