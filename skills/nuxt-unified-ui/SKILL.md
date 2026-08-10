---
name: nuxt-unified-ui
description: >-
  Single skill for the nuxt-unified-ui Nuxt layer and mandatory Nuxt code style:
  install/extend the layer, required CSS, modules/config, radashi radXxx
  auto-imports, un-form / useForm, launchFormPickerDialog /
  launchChoicePickerDialog, toast helpers, un-card / un-typography, pages /
  definePageMeta, ufetch / useUFetch wrapping, attribute order/defaults, and
  whitespace/formatting conventions for all Nuxt-generated code. Use when
  working in or consuming nuxt-unified-ui, or whenever generating Vue/Nuxt code
  that must match unified code style.
---

# nuxt-unified-ui

Reusable **Nuxt layer** (Nuxt UI + helpers) **plus** the mandatory **code style** for Nuxt projects using this stack.

Peer dependency: **Nuxt `>=4.5.2`**.

This is the **only** installable skill in this repo. Deep topics live under `references/`.

## When to use

- Installing / extending `nuxt-unified-ui` as a Nuxt layer
- Using `un-form`, dialogs, toasts, `un-card`, radashi `radXxx`, etc.
- **Whenever generating or editing Nuxt/Vue/server code** that must follow the unified look (whitespace, wrapping, template shape, sectioning)

## References (read as needed)

| Topic | File |
|-------|------|
| **Code style (mandatory)** | [references/code-style.md](references/code-style.md) |
| Pages / routing | [references/pages.md](references/pages.md) |
| Data fetching (`ufetch` / `useUFetch`) | [references/data-fetching.md](references/data-fetching.md) |
| Layer install + required CSS | [references/layer-setup.md](references/layer-setup.md) |
| Public surface inventory | [references/public-surface.md](references/public-surface.md) |
| Forms (`useForm` / `un-form`) | [references/forms.md](references/forms.md) |
| Form field schema | [references/form-field-schema.md](references/form-field-schema.md) |
| Form elements | [references/form-elements.md](references/form-elements.md) |
| Dialogs / toasts / UI | [references/dialogs.md](references/dialogs.md) |
| Dialog implementation | [references/dialogs-impl.md](references/dialogs-impl.md) |
| Toast + `un-*` details | [references/toast-and-ui.md](references/toast-and-ui.md) |
| Radashi `radXxx` catalog | [references/radashi.md](references/radashi.md) |

---

## Code style (read [code-style.md](references/code-style.md) before writing code)

**Always apply** to Vue SFCs and app/server `.ts` files. Higher-level idea: code should **scan vertically** — double blanks between major sections, multi-line literals, predictable template wrapping, section comments as a map.

Absolute highlights:

- `<script setup>` only — **never** `lang="ts"`; no TS annotations in Vue (runtime prop types)
- 2-space indent; single quotes; semicolons; trailing commas in multi-line literals
- Double blank lines between major sections; blank line before `</script>`; **two** blanks before `<template>`
- Non-trivial async/functions: blank line after `{`, double blank between major steps, blank before `}`
- `else` / `catch` on their own line after `}`
- Script object literals always multi-line (even one property)
- Kebab-case tags (`u-button`, `un-card`)
- `v-if` / `v-for` on `<template>` wrappers — not on rendered nodes
- **2+ attributes → one per line** except **`u-modal`** (keep all `u-modal` attrs on one line); attribute order + default omissions (`variant="subtle"`, **Cancel only → `ghost`**, omit neutral `color`, `loading-auto`); non-self-closing `>` on same line as last attr; multi-line self-closing `/>` on its own line
- `{{ ... }}` on its own line (static + dynamic text may mix)
- `/* section */` comments; imports co-located under the section that uses them
- Light naming: `handleXxx` handlers, `it` in short callbacks, descriptive `for...of`, computeds use block + `return`
- Pages: explicit `definePageMeta.name`, reactive route params, named `navigateTo` / `nuxt-link` → [pages.md](references/pages.md)
- Fetching: `ufetch(url, {` one line; `useUFetch` with URL on next line + `data*Data` / `is*Loading` / `refresh*` → [data-fetching.md](references/data-fetching.md)

---

## Quick start (host app)

1. Install the package.
2. Create host `assets/css/main.css`:

```css
@import 'tailwindcss';
@import '@nuxt/ui';
@import 'nuxt-unified-ui/nuxt-ui-fixes.css';
```

3. Extend the layer (CSS wiring is **required**):

```js
import { pathRelativeToBase } from 'nuxt-unified-ui';

export default defineNuxtConfig({
  css: [
    pathRelativeToBase(import.meta.url, './assets/css/main.css'),
  ],
  extends: [
    'nuxt-unified-ui',
  ],
});
```

4. Wrap the app with `u-app`.
5. Prefer layer helpers (`useForm`, `launchFormPickerDialog`, `toastSuccess`) over reinventing them.
6. Generate all new code using [code-style.md](references/code-style.md).

Details: [layer-setup.md](references/layer-setup.md).

## Package surface

| Export | Path |
|--------|------|
| `nuxt-unified-ui` | `./nuxt.config.ts` (also re-exports `pathRelativeToBase`) |
| `nuxt-unified-ui/app` | `./app` |
| `nuxt-unified-ui/nuxt-ui-fixes.css` | `./app/assets/css/nuxt-ui-fixes.css` |

Published: `nuxt.config.ts`, `index.d.ts`, `app/`, `i18n/`, `modules/`.

## Mental model (`app/`)

| Path | Role |
|------|------|
| `app/components/` | `un-form`, `un-card`, `un-typography`, `un-spinner` |
| `app/composables/` | `useForm`, `useFormExtraElements` |
| `app/elements/` | Built-in form field renderers |
| `app/dialogs/` | Form / choice picker modal UIs |
| `app/utils/` | `launchDialog*`, `toast*`, `smartMatch`, `unSet`, dates, … |
| `app/plugins/` | `$toaster` via `useToast()` |
| `modules/radashi.ts` | Auto-imports radashi as `rad*` |
| `i18n/locales/` | `en.json`, `de.json` |

## Layer config (inherited)

From `nuxt.config.ts`: `@vueuse/nuxt`, `@nuxt/ui`, `@nuxtjs/i18n`; `ui.colorMode: false`; default variant `neutral`; i18n `no_prefix` with `en`/`de`; `experimental.typedPages: true`.

## Common tasks

| Task | Prefer |
|------|--------|
| Schema form | `useForm` + `<form-tag />` / `<un-form>` → [forms.md](references/forms.md) |
| Modal form | `launchFormPickerDialog` + `submitButton.onClick` → [dialogs.md](references/dialogs.md) |
| Confirm / choice | `launchChoicePickerDialog` + button `onClick` (avoid `value`) |
| Feedback | `toastSuccess` / `toastError` / `toast` |
| Page chrome | `un-typography` + `un-card` |
| Custom field | `registerFormExtraElement` in a plugin |
| Utilities | `radXxx` → [radashi.md](references/radashi.md) |
| New page / route | [pages.md](references/pages.md) |
| List/detail fetch or mutation | [data-fetching.md](references/data-fetching.md) |
| Formatting any of the above | [code-style.md](references/code-style.md) |

## Do / don’t

**Do**

- Extend via `extends: ['nuxt-unified-ui']`
- Keep required host `main.css` + `pathRelativeToBase` CSS entry + `nuxt-ui-fixes.css`
- Use field `identifier` for element kind; `type` only for HTML input types
- Handle dialog actions in `onClick`
- Follow code style for every generated file

**Don’t**

- Invent APIs not in source
- Reference any local playground as consumer docs
- Use PascalCase component tags in templates
- Set choice-button `value` unless the await result must distinguish buttons
- Assume color mode is enabled (layer disables it)
