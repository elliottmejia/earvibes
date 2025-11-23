# AI Agents & Tools

This project is designed to be friendly for AI coding assistants and agents. The structure is modular, typed, and follows clear patterns that make it easy for LLMs to understand and modify.

## Recommended Tools

Users can employ various AI tools to extend or modify this application:

*   **Google Gemini**: Excellent for logic generation, refactoring, and explaining complex music theory concepts within the app's context.
*   **GitHub Copilot**: Great for inline code completion and boilerplate reduction.
*   **Cursor / Windsurf**: Ideal for full-project context-aware editing.

## Guidelines for AI Agents

If you are using an AI agent to modify this codebase, please adhere to the following patterns:

1.  **Context is Key**: Always read `types.ts` and `constants.ts` first. These files define the domain model (Levels, Chords, GameState).
2.  **Type Safety**: Ensure generated code adheres to the TypeScript definitions. Do not use `any`.
3.  **Localization**: 
    *   **Never hardcode UI text.** 
    *   Always add new strings to `i18n/locales/en.ts` first.
    *   If possible, add translations for `es.ts`, `pt.ts`, and `ja.ts`.
    *   Use the `useTranslation` hook to access strings.
4.  **Audio Engine**: 
    *   Modifications to `audioService.ts` must respect the Tone.js lifecycle.
    *   Audio context must only resume/start after a user interaction event (click/keydown).
5.  **State Management**: 
    *   The app uses a centralized `GameState` object in `App.tsx`.
    *   Avoid creating parallel state trees unless necessary for a specific isolated component.
6.  **Context7 Integration**: Always use Context7 when you need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.
7.  **Development Server Management**: Always check if the development server is already running before starting it. If it's running, just access the website instead of starting a new server. Use `curl -s http://localhost:5173` or similar to check if server is responsive.
8.  **Tailwind CSS Best Practices**: 
    *   **Never use `!important`** in Tailwind classes. The project uses `tailwind-merge` which automatically handles class conflicts and precedence.
    *   Use the `cn()` utility from `lib/utils.ts` for combining classes, especially when dealing with conditional styling.
    *   Prefer semantic Tailwind classes over arbitrary values when possible.

## Coding Task Completion Criteria

A coding task is considered **complete** only when **both** of the following pass:

1. **Lint Check**: `pnpm run lint` must pass with **zero errors** (warnings are acceptable)
2. **Format Check**: `pnpm run format` must pass without any changes needed
3. **Build Check**: `pnpm run build` must complete successfully without TypeScript errors

**Declaration of Completion**: Only declare a coding task "done" or "completed" after verifying all three checks above pass. Do not declare completion based on visual inspection or partial fixes.

## Biome Configuration for False Positives

The following Biome rules may generate false positives and can be safely ignored in specific contexts:

### Cognitive Complexity Rules
- `complexity/noExcessiveCognitiveComplexity`: Some functions naturally have higher complexity and warnings are acceptable:
  - Keyboard event handlers (multiple key combinations)
  - Feedback generation functions (multiple conditional branches)
  - Progression generation (complex switch statements)
  These warnings are acceptable if the function is well-structured and readable.

### Accessibility Rules  
- `a11y/useAnchorContent`: Links with proper `aria-label` and `title` attributes that contain SVG icons are already accessible. This rule may flag false positives when accessible content is provided via ARIA attributes.

### Type Safety Rules
- `complexity/useLiteralKeys`: When working with dynamic object keys that come from string variables, bracket notation may be necessary even for literal-like access patterns.

### Acceptable Warnings
The following warnings are considered **acceptable** and don't need to be fixed:
- Cognitive complexity warnings for the specific function types mentioned above
- `useLiteralKeys` warnings when dynamic object access is required
- `useAnchorContent` warnings when proper ARIA attributes are present

## Prompt Engineering Tips

When asking an AI to generate new levels, use this structure:

> "Create a new Level 13 based on the 'Phrygian Mode'. 
> 1. Update `types.ts` LevelType enum.
> 2. Update `constants.ts` with the level configuration (available chords).
> 3. Update `services/theoryService.ts` with the chord maps and generation logic.
> 4. Update `i18n/locales/*.ts` with the level title, description, lesson content, and chord descriptions."
