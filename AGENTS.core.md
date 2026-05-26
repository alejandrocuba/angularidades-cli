# Core Agentic Engineering Protocols

This document defines the global engineering rules, security guidelines, and development protocols that apply to all repositories. 

> [!NOTE]
> Project-specific guidelines (such as framework implementations or local patterns) are defined in the repository's root `AGENTS.md` and inherit these rules.

## Rule 1: Deterministic Operations
Agents must produce deterministic, predictable outputs. When generating components, services, or functions:
* Avoid mutable shared state.
* Rely on pure functions, immutable data patterns, and native reactive structures (e.g., signals, observables, or hooks depending on the framework).
* Ensure side effects are isolated and well-documented.

## Rule 2: Package Management
* Always use pnpm (or the repository's specified package manager).
* Do not mutate `package.json` or lockfiles without explicit human authorization.
* Any dependency upgrade or addition requires an isolated PR and must be verified for compatibility.

## Rule 3: Platform & Runtime Compatibility
* Respect Server-Side Rendering (SSR) or Static Site Generation (SSG) constraints if applicable.
* Never invoke direct browser-only global objects (such as `window`, `document`, `localStorage`) in component constructor or initialization phases.
* Always guard browser/runtime APIs using framework-native hooks or checking platform injection tokens.
* **API Constraints**: Do not use deprecated APIs (e.g., `document.write`, synchronous XHR). Use modern features like `fetch` or dynamic script elements.
* **Event Listeners & Performance**: Touch, wheel, and scroll event listeners must be passive (`{ passive: true }`) unless calling `preventDefault()` is explicitly required.
* **Memory Management**: Always clean up resize, scroll, or orientation event listeners when components unmount. Use `AbortController` signals to manage listener lifetimes cleanly.

## Rule 4: Language & Type Safety (TypeScript)
* Enforce strict type checking at all times.
* Prefer type inference where the type is obvious; otherwise, provide explicit typing.
* Avoid the `any` type completely. Use `unknown` for unsafe input and narrow it with type guards before property access.
* Keep compiler and linter rules clean; do not use `@ts-ignore` or lint suppressions unless absolutely unavoidable and explicitly commented.
* **Prototype Pollution Prevention**: When merging, cloning, or extending untrusted dynamic objects, do not use naive recursive merges that mutate `Object.prototype` (via `__proto__` or `constructor`). Use `structuredClone` for deep copies, or use `Object.create(null)` to handle safe key-value dictionary bags.

## Rule 5: Software Design Principles (SRP & DRY)
* **Single Responsibility Principle (SRP)**: Each component, module, or service must have one, and only one, reason to change. Split large components into focused, smaller sub-components.
* **Don't Repeat Yourself (DRY)**: Abstract common visual styles, utilities, hooks, or business logic into reusable and modular services or libraries rather than copying them.

## Rule 6: Accessibility (A11y)
* All UI layouts must meet **WCAG 2.2 AA** accessibility minimums.
* Proper semantic HTML5 tags must be used (e.g., `<main>`, `<article>`, `<nav>`, `<header>`).
* Interactive elements must support proper focus management, keyboard navigation (tab index, Esc closures), and aria attributes for screen readers.
* **HTML Validation**: Enforce valid HTML structure. Do not use duplicate IDs on a single page, avoid invalid child elements (e.g., non-list items directly inside `<ul>`), and do not nest interactive controls (e.g., a `<button>` inside an `<a>`).

## Rule 7: Testing
* Protect your changes with automated unit, integration, or end-to-end tests where appropriate.
* When modifying existing features, update corresponding test files (`.spec.ts`, `.test.ts`) to ensure zero regression.
* For interactive UI components, mock user events (clicks, keypresses) and assert correct DOM state updates.

## Rule 8: Sandbox Boundaries
* Run commands strictly within the designated workspace sandbox.
* Never invoke elevated permissions (`sudo`) or attempt to access system files outside the workspace directory.
* If a package installation fails due to network constraints, check local configurations and prompt the user rather than looping.

## Rule 9: Design System Adherence
* Agents must strictly read and adhere to the guidelines defined in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) before executing UI edits.
* Do not introduce ad-hoc styles, colors, or fonts. Use defined design tokens (CSS variables or utility classes).
* If a visual change deviates from the design system, explicitly ask the user for confirmation first.

## Rule 10: Security Protocols & DOM-XSS Defenses
* **Input Sanitization**: Never assign unescaped, untrusted input strings to `innerHTML`. Use `textContent` for text nodes. If HTML rendering is required, sanitize it via a library like `DOMPurify` and adhere to Trusted Types policies.
* **Subresource Integrity (SRI)**: Any external third-party script or stylesheet loaded from a CDN must include the `integrity` (SHA-384/512 hash) and `crossorigin="anonymous"` attributes to prevent supply-chain injection attacks.
* **HSTS & HTTPS**: Enforce HTTPS on all resource URLs. Avoid protocol-relative URLs (`//example.com`).
* **Source Maps**: Do not compile or expose sourcemaps with embedded source code (`sourcesContent`) in production environments. Configure bundlers to emit `hidden` or no source maps.

## Rule 11: Technical Design Partner Communication
The primary contributor or reviewer of this project may be a visual designer, product owner, or stakeholder. You must act as a **Technical Design Partner**:
* **The Jargon Bridge**: Avoid purely raw technical explanations. Explain how technical changes map back to user experience, performance, or designer assets (e.g., "optimized the component rendering to ensure animations run at 60fps" instead of "memoized the state calculation callback").
* **Designer-Friendly Analogies**: Reference standard design concepts (e.g., comparing code components to Figma main components, variables to color styles/tokens, and state management to prototype flow transitions).
* **Visual-First Context**: Prioritize explaining visual, layout, and interaction consequences of your edits before describing internal technical optimizations.
