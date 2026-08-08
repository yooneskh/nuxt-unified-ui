# Prompts

Copy-paste prompts for coding agents working on this repository.

---

## 1. Refresh Agent Skills from the repository

```text
Recheck this repository and update the single Agent Skill under `skills/nuxt-unified-ui/` so it stays accurate and installable via `npx skills`.

### Goal
Audit the public surface of `nuxt-unified-ui` against the current source, then update `skills/nuxt-unified-ui/**` (and the brief Agent Skills mention in `README.md` if needed). Keep **one** installable skill only — nest deep topics as `references/*.md`. Do not invent APIs. Prefer updating skills, not refactoring app code.

### Hard constraints (`npx skills` / Agent Skills)
1. Source of truth: `skills/nuxt-unified-ui/SKILL.md` (not only `.cursor/skills/` or `.agents/skills/`).
2. Directory name MUST equal YAML `name`: `nuxt-unified-ui`.
3. `SKILL.md` MUST have YAML frontmatter with:
   - `name`: `nuxt-unified-ui` (lowercase `a-z0-9-`, matches folder)
   - `description`: 1–1024 chars, third person, WHAT + WHEN + triggers (`nuxt-unified-ui`, Nuxt layer, `un-form`, `launchFormPickerDialog`, `registerFormExtraElement`, `toast`, code style, whitespace, etc.)
4. Keep `SKILL.md` concise (< ~500 lines / < ~5000 tokens). Progressive disclosure via `references/*.md`, linked one level deep.
5. Document only what exists in source (`app/`, `modules/`, `i18n/`, `nuxt.config.ts`, `package.json`, `index.d.ts`).
6. Do not commit secrets. Do not modify application source except skill/docs files for this task.
7. After edits, verify:
   ```bash
   npx skills add . --list
   ```
   Exactly **one** skill (`nuxt-unified-ui`) must appear. Fix invalid frontmatter.

### Conventions that MUST be preserved
1. **Single installable skill.** Do not reintroduce separate `nuxt-unified-ui-forms` / `nuxt-unified-ui-dialogs` / `nuxt-unified-code-style` packages. Nest under `skills/nuxt-unified-ui/references/`.
2. **No playground references.** Never mention `.playground` as consumer documentation.
3. **Kebab-case component names** in skills (`un-form`, `un-card`, `u-app`, …).
4. **Required host CSS** (not optional):
   - Host `assets/css/main.css`:
     ```css
     @import 'tailwindcss';
     @import '@nuxt/ui';
     @import 'nuxt-unified-ui/nuxt-ui-fixes.css';
     ```
   - Host `nuxt.config`:
     ```js
     import { pathRelativeToBase } from 'nuxt-unified-ui'

     export default defineNuxtConfig({
       css: [
         pathRelativeToBase(import.meta.url, './assets/css/main.css'),
       ],
       extends: ['nuxt-unified-ui'],
     })
     ```
5. **Radashi catalog:** Keep/regenerate `references/radashi.md` with every runtime export as `radXxx`, short description, and typing from installed radashi types.
6. **Dialogs:** actions in button / `submitButton` `onClick`; avoid choice-button `value` unless needed for the await result.
7. **Code style:** Keep `references/code-style.md` complete and mandatory for all Nuxt-generated code. Preserve higher-level reasoning first, then absolute rules covering:
   - whitespace / blank-line rhythm (including non-trivial function breathing room vs tiny tight helpers)
   - indentation, quotes, semicolons, trailing commas
   - object/array/call wrapping
   - `<script setup>` without `lang="ts"`; no TS annotations in Vue
   - kebab-case tags; structural directives on `<template>` wrappers
   - attribute wrapping hard rule (2+ attrs → one per line); `>` / `/>` placement; attribute order
   - `{{ }}` on own line; section comments; import co-location; script ordering
   - light naming (`handleXxx`, `it`, descriptive loops, computed block + `return`)
   - applies to Vue SFCs and app/server `.ts` alike
8. Peer dependency: Nuxt `>=4.5.2`.
9. Repository-relative paths; agent-oriented examples; no marketing tone.

### Expected layout
```
skills/nuxt-unified-ui/
  SKILL.md
  references/
    code-style.md
    layer-setup.md
    public-surface.md
    forms.md
    form-field-schema.md
    form-elements.md
    dialogs.md
    dialogs-impl.md
    toast-and-ui.md
    radashi.md
```

### Workflow
1. Explore: `package.json`, `nuxt.config.ts`, `index.d.ts`, `README.md`, `app/`, `modules/`, `i18n/`, current `skills/nuxt-unified-ui/`.
2. Inventory public surface; diff against skill + references.
3. Update SKILL.md and references for API/behavior/config drift. Regenerate radashi catalog if needed. Refresh code-style only when conventions truly change — do not invent style rules.
4. Enforce conventions above.
5. Run `npx skills add . --list` — expect one skill.
6. Optionally `npx skills use . --skill nuxt-unified-ui` for prompt smoke-check.
7. Stop when the skill accurately introduces the layer, APIs, and code style.

### Deliverable
Commit-ready updates under `skills/nuxt-unified-ui/` (and README blurb if useful), listable as a single skill via `npx skills`.
```
