# Core Agentic Engineering Protocols

> [!NOTE]
>
> - Synced from `alejandrocuba/dynamic-scaffolding` GitHub repository. Do not edit directly; changes will be overwritten on updates.
> - Project overrides (frameworks, workflows) belong in `AGENTS.md` and inherit these rules.
> - Design, accessibility, and markup standards are defined in [DESIGN-SYSTEM.core.md](DESIGN-SYSTEM.core.md) and project `DESIGN-SYSTEM.md`.

## 1. Determinism

- **Predictability**: Use pure functions, immutable data, and framework-native reactivity. Avoid mutable shared states.
- **Error Handling**: Never swallow exceptions silently. Log with diagnostic context or bubble to explicit boundaries.

## 2. Architecture

- **SRP/DRY**: Single responsibility per module. Abstract repeated logic/styles into shared utilities.
- **Async Safety**: Prevent state updates or mutations on unmounted/destroyed components.

## 3. Documentation

- **Flag Surprises**: Comment and flag non-obvious, legacy, or confusing logic.

## 4. Dependencies

- **Tooling**: Use `pnpm` exclusively. Human approval required for `package.json`/lockfile changes.

## 5. Security

- **Environment**: Stay sandboxed. No `sudo` or out-of-workspace edits.
- **XSS**: Prefer `textContent`. Sanitize `innerHTML` via DOMPurify/Trusted Types.
- **Supply Chain**: CDN links require `integrity` hashes, `crossorigin="anonymous"`, and HTTPS.
- **Source Maps**: Exclude `sourcesContent` in production (`hidden` or none).

## 6. Runtime & Memory Safety

- **SSR/SSG**: Guard browser globals (`window`, `document`) via lifecycle hooks or platform checks.
- **Leaks & Cleanup**: Prevent memory leaks. Clear timeouts, remove event listeners, dispose of subscriptions, and manage lifecycle cleanup.
- **Performance (INP)**: Avoid long, synchronous tasks that block the main thread. Yield frequently during heavy data processing to ensure a responsive Interaction to Next Paint.
- **Modern APIs**: Use `fetch`, abandon deprecated APIs (`document.write`, sync XHR).

## 7. CSS-First

- **Prefer Native CSS**: Prioritize native CSS (e.g., `@keyframes`, transitions, Scroll-Driven Animations) over JavaScript for motion, reveals, hovers, and focus states.
- **Progressive Enhancement**: Provide readable fallback/default states for modern CSS features (e.g., `animation-timeline`) using `@supports` to ensure compatibility and prevent broken layouts.
- **Compositor Optimization**: Run animations on the GPU (compositor thread) instead of CPU to prevent frame drops and minimize JS weight.

## 8. Type Safety (TypeScript)

- **Strict Mode**: No `any`. Use `unknown` with type guards. Prefer implicit inference.
- **Overrides**: Justify and document `@ts-ignore` or lint disables.
- **Object Safety**: Prevent prototype pollution. Use `structuredClone` for deep copies, `Object.create(null)` for maps.

## 9. Testing

- **Coverage**: Mandate tests (`.spec.ts`) to prevent regressions.
- **Mocks**: Simulate and assert user interactivity accurately.

## 10. I/O Token Efficiency

- **Minimization**: Favor concise instructions over verbose prose.
- **Identifiers**: Use short, deterministic IDs for inter-agent communication instead of descriptive text.
- **Payloads**: Strip superfluous metadata from API payloads or tool inputs/outputs.
