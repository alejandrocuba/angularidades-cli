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
- **Modularity**: Expose core workflow routines from `scripts/publisher/` and invoke them inside `bin/cli.js` rather than repeating argument handling or spawning Node child processes.
