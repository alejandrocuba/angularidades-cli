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
- **Caption Translation Protocols**:
  - **Strict 1-to-1 Chunk Alignment**: Every chunk file `trans-X-Y.json` MUST contain exactly `(Y - X + 1)` items matching the source block indices 1-to-1. Never merge, split, or drop blocks across chunk boundaries.
  - **Pre-Build Validation**: Always run `node scripts/publisher/translate-helper.js validate [episode]` to verify chunk coverage and 100% element count alignment before running `build`.
  - **Professional Translation Quality**: Ensure English captions are fluent, expert-level translations with precise technical terms (Signals, Template-Driven Forms, GolemUI, RxJS, MCP, etc.) and zero residual untranslated Spanish text.
- **Modularity**: Expose core workflow routines from `scripts/publisher/` and invoke them inside `bin/cli.js` rather than repeating argument handling or spawning Node child processes.
- **Verification & Publishing**: Do not automatically run `angularidades doctor` or `angularidades publish` after minor text edits or formatting changes. Only execute them when explicitly asked by the user or upon completing a major workflow milestone.
