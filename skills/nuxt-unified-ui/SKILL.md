---
name: nuxt-unified-ui
description: >-
  Builds and edits Nuxt apps and layers that use nuxt-unified-ui: un-form /
  useForm schema forms, un-card, un-table, launchFormPickerDialog /
  launchChoicePickerDialog / launchDialog, toast helpers, radXxx radashi
  auto-imports, and the companion unified stack (ufetch, useUFetch,
  resource-manager, createUnifiedResourceController). Use when package.json
  depends on nuxt-unified-ui, nuxt.config extends it, or code uses these
  APIs. Whenever implementation work is finished, run `/nuxt-unified-ui
  apply`, which applies the skill file by file to uncommitted files (staged,
  unstaged, or untracked). `/nuxt-unified-ui apply branch` targets files
  directly changed by commits that landed on the current branch since its
  base. `/nuxt-unified-ui
  apply all` targets every eligible file on the current branch. Users can
  also invoke these directly.
---

# nuxt-unified-ui

The main agent decides what code exists, where it lives, and which APIs it calls. When the work is done, the apply pipeline runs one orchestrator per file. The orchestrator does not edit. It gives the file three passes, each to its own subagent: place and split, then radashi and VueUse, then code style. Code style is the only place formatting rules apply. The main agent does not load `references/code-style.md`.

## Finishing work: `/nuxt-unified-ui apply`

Whenever you finish implementing work that added or edited a `.vue`, `.js`, or `.ts` file, run `/nuxt-unified-ui apply` before your final reply: follow [references/apply.md](references/apply.md). Use `apply branch` when the user asks for the files commits on the current branch changed, and `apply all` when they ask for every file on the branch. Invoked without an argument, the skill only loads its guidance for the task at hand.

`/nuxt-unified-ui apply` processes uncommitted `.vue`, `.js`, and `.ts` files (staged, unstaged, or untracked). `/nuxt-unified-ui apply branch` processes eligible files directly changed by commits that landed on the current branch since its base. `/nuxt-unified-ui apply all` processes every eligible file on the current branch. One orchestrator per file, launched using a cheap fast model, spawns the three pass agents. The main agent carries out the follow-ups those passes could not finish.

## APIs

**Layer** APIs come from this layer and are auto-imported across the app and every layer. **Companion** APIs come from the companion unified layers, which real projects always include next to this one. When an API is not listed here, check the source before using it.

| API | Use it to | From | Reference |
|---|---|---|---|
| `un-form` / `useForm` | Render a schema-driven form; `useForm` returns `{ form, formTag }` | layer | [forms.md](references/forms.md) |
| `registerFormExtraElement` | Add a custom form element `identifier` (call from a Nuxt plugin) | layer | [forms.md](references/forms.md) |
| `useFormExtraElements` | Read the registered custom elements (add them with `registerFormExtraElement`) | layer | [forms.md](references/forms.md) |
| `un-card` | Card with icon / title / subtitle header, body, and action rows | layer | [toast-and-ui.md](references/toast-and-ui.md) |
| `un-typography` | Icon + title + subtitle + text block | layer | [toast-and-ui.md](references/toast-and-ui.md) |
| `un-spinner` | Show a loading spinner | layer | [toast-and-ui.md](references/toast-and-ui.md) |
| `un-table` | Show one page of rows with row actions and a pagination footer | layer | [tables.md](references/tables.md) |
| `launchFormPickerDialog` | Ask for form input in a modal; submit logic goes in `submitButton.onClick` | layer | [dialogs.md](references/dialogs.md) |
| `launchChoicePickerDialog` | Confirm or choose in a modal; logic goes in each button's `onClick` | layer | [dialogs.md](references/dialogs.md) |
| `launchDialog` | Open any dialog component; resolves with its `close` payload | layer | [dialogs.md](references/dialogs.md) |
| `toast`, `toastSuccess`, `toastError`, `toastWarning`, `toastInfo` | Show a toast (typed helpers set icon and color) | layer | [toast-and-ui.md](references/toast-and-ui.md) |
| `smartMatch` | Test a function, mongo-style filter, or truthy value against an object | layer | [forms.md](references/forms.md) |
| `unSet` | Set a nested path on an object, creating missing levels (mutates) | layer | — |
| `formatDate` / `parseDate` | Format and parse dates (`@formkit/tempo`); defaults come from `app.config` `dateFormat` | layer | [layer-setup.md](references/layer-setup.md#date-defaults) |
| `isSlotFilled` | Check whether a slot has content | layer | — |
| `pathRelativeToBase` | Resolve a path against a file URL; also exported from the package for `nuxt.config` | layer | [layer-setup.md](references/layer-setup.md) |
| `makeConfetti` | Fire confetti: `template` picks a built-in effect (`parade`, `on-top` / `on-left` / `on-right` / `on-bottom`, `on-frame`, `split-on-top`, `on-curtain`), `amount` sets particles per burst, other args go to `canvas-confetti` | layer | — |
| `radXxx` | Any radashi function (`radGet`, `radPick`, …), in app and server | layer | [radashi.md](references/radashi.md) |
| `ufetch` | Make a one-off API request (submit, delete, click) | companion | [data-fetching.md](references/data-fetching.md) |
| `useUFetch` | Load reactive page data (`data`, `pending`, `refresh`) | companion | [data-fetching.md](references/data-fetching.md) |
| `parseSchema` | Compile a resource schema DSL into `{ schema, type, inferred }` | companion | [resources.md](references/resources.md) |
| `createUnifiedResourceController` / `UnifiedResourceController` | Create the typed Mongo controller (`dbo`) for a resource | companion | [resources.md](references/resources.md) |
| `createUnifiedSingletonController` / `UnifiedSingletonController` | Create the typed controller for one fixed singleton row (`schema`, `retrieve`, `update`) | companion | [resources.md](references/resources.md) |
| `app` / `UnifiedAppRegistry` | Global typed registry of resources (`app.users.dbo`) | companion | [resources.md](references/resources.md) |
| `handleResourceSchema`, `handleResourceList`, `handleResourceCreate`, `handleResourceCount`, `handleResourceRetrieve`, `handleResourceUpdate`, `handleResourceDelete` | Implement the standard REST routes of a resource | companion | [resources.md](references/resources.md) |
| `handleSingletonSchema`, `handleSingletonRetrieve`, `handleSingletonUpdate` | Implement the singleton routes: schema, retrieve, and update of the one row | companion | [resources.md](references/resources.md) |
| `useResourceName` | Derive a resource's API path and display titles from its name | companion | [resources.md](references/resources.md) |
| `useResourceMeta` | Map a resource schema to form fields and table columns | companion | [resources.md](references/resources.md) |
| `<resource-manager>` | Full CRUD dashboard card for a resource; exposes `refreshResources()` | companion | [resources.md](references/resources.md) |
| `<singleton-manager>` | Form card for one singleton row; exposes `refreshSingleton()` | companion | [resources.md](references/resources.md) |
| `<resource-explorer-table>` | Filter bar + sortable headers + `un-table` for a resource | companion | [tables.md](references/tables.md) |
| `assertBody` | Validate a request body against a schema in a server route | companion | — |
| `assertRateLimit` | Rate-limit a server route | companion | — |
| `createUnauthenticatedError` | Throw a 401 from a server route | companion | — |
| `generateUuid` | Generate a UUID | companion | — |
| `useToken` | Read or set the auth token | companion | — |
| `is-authenticated` middleware; `dashboard` / `empty` layouts | Protect pages; dashboard and full-bleed page layouts | companion | [pages.md](references/pages.md) |
| `useJsonld` | Emit JSON-LD on public pages, only when `nuxt-jsonld` is installed | `nuxt-jsonld` | [pages.md](references/pages.md) |

## File structure

The main agent decides where a file lives and which one job it has, and does it while implementing. The apply place-and-split pass moves or splits a file that breaks these rules.

Each `.vue`, `.js`, and `.ts` file has one responsibility. When a file has two independent jobs, split it into two files. A component and the script that exists to render it are one job. Do not split a template from its script.

Nuxt auto-imports `app/components/`, `app/composables/`, and `app/utils/` across every layer. A file used only inside its own layer does not go there: a Vue file goes to `app/atoms/`, and a function, composable, or helper goes to `app/libs/`.

| Role | Directory | Visibility |
|---|---|---|
| Private Vue component | `app/atoms/` | This layer only |
| Private function, composable, or helper | `app/libs/` | This layer only |
| Public Vue component | `app/components/` | Whole app, auto-imported |
| Public util or composable | `app/utils/` | Whole app, auto-imported |

Generate private first. New components start in `app/atoms/`. New functions, composables, and similar helpers start in `app/libs/`. Promote a file to `app/components/` or `app/utils/` only when another layer needs it. Do not put a file in `app/composables/`. After a move, a promote, or a split, update every caller in the same change. A promote also removes the relative import; public modules are auto-imported.

Pages, layouts, middleware, plugins, server routes, modules, `nuxt.config`, `app.vue`, and `error.vue` stay where Nuxt requires them.

Import `atoms` and `libs` with relative paths only (`../atoms/foo.vue`, `../libs/bar`). Never use `~/`, `@/`, `#layers/`, or another alias. Never import another layer's `atoms` or `libs`; promote that file first, then use the public auto-import.

Do not register `atoms` or `libs` with Nuxt `components` or `imports` config.

## Before writing

Read the reference that matches the task before creating or editing files. The details stay in that reference.

| Task | Read first |
|---|---|
| Layer installation and required CSS | [references/layer-setup.md](references/layer-setup.md) |
| Forms, field schema, built-in and custom elements | [references/forms.md](references/forms.md) |
| Dialogs | [references/dialogs.md](references/dialogs.md) |
| Toasts, `un-*` UI, button / badge / icon conventions | [references/toast-and-ui.md](references/toast-and-ui.md) |
| Tables | [references/tables.md](references/tables.md) |
| Pages and routing | [references/pages.md](references/pages.md) |
| `ufetch` / `useUFetch` | [references/data-fetching.md](references/data-fetching.md) |
| Unified resources | [references/resources.md](references/resources.md) |
| Radashi `radXxx` exports | [references/radashi.md](references/radashi.md) |

## Decisions the main agent owns

Make these choices while implementing. The apply pipeline re-checks file placement, one responsibility, radashi and VueUse use, and code style. It does not re-check the other decisions in this list.

- Prefer the APIs above over hand-rolled equivalents (raw `$fetch`, hand-built `u-modal` flows, direct `radashi` imports).
- A new resource includes its server plugin, the full REST route set, and a dashboard nav entry or a custom `<resource-manager>` page.
- Use `ufetch` for a one-off request. Use `useUFetch` for reactive page data.
- Every page has an explicit `definePageMeta.name` and sets SEO with `useHead` (title) and `useSeoMeta` (description).
- Buttons, badges, and icons follow the component conventions in [references/toast-and-ui.md](references/toast-and-ui.md#component-conventions). Read them before writing any button.
- Installing the layer includes the required host `assets/css/main.css` and the `pathRelativeToBase` CSS entry in `nuxt.config`.

## i18n

**i18n is optional. Conform to the project's current state.**

- If the project does not translate its own strings (literal text, no `$t`, no locale files of its own), keep writing literal strings. Do not introduce `$t`, locale files, or i18n config unless the user decides to integrate i18n.
- If the project already uses i18n in another layout, follow that layout.
- The rules below apply once the project has decided to integrate i18n, or already follows them. This layer's own `$t` usage does not count as a decision for the project.
- Examples in the references often use English literals for brevity. In an i18n project those strings are `$t('...')` keys.

**When i18n is integrated**

- Every user-facing string goes through `$t`, in templates and in script. `$t` is available in both without calling `useI18n()`.
- This layer already sets `strategy: 'no_prefix'` and `defaultLocale: 'en'` on `i18n`. Nuxt merges that config into every app that extends the layer, including an app that sets its own `i18n` options, so those two keys stay unset in the app and in every other layer. Set one only when that app needs a different value.
- The full `locales` list (codes, names, languages) goes in the `nuxt.config.ts` of the **aarde layer**: the project's base app layer that extends `nuxt-unified-ui` (for example `layers/100-aarde/`). If the project has no aarde layer, use the layer that extends `nuxt-unified-ui`.
- Every other layer (feature) keeps its own locale files in its own `i18n/locales/<code>.json`. In its own `nuxt.config.ts` it declares only those files — `i18n: { locales: [{ code, file }] }` — and no other i18n settings. `@nuxtjs/i18n` loads a layer's locale files only when that layer lists them, then merges the same locale from every layer into one message tree.
- The layer that owns a file is the nearest directory above it with a `nuxt.config`. Its strings go in that layer's locale files only — never in another layer's or the host's.
- Each layer's locale file has **exactly one top-level key**: the layer's namespace, such as `patients` or `billing`. Every key nests under it (`$t('patients.single.title')`), so merged trees never clash.
- Add every new key to each locale that layer declares.
- This layer owns two top-level keys: `un` for its components and `common` for shared labels (`common.submit`, `common.cancel`, `common.close`, …). Reuse `common.*` instead of duplicating those labels, but never add keys to `un` or `common` from another layer.

Aarde layer `nuxt.config.ts` (fragment):

```ts
i18n: {
  locales: [
    {
      code: 'en',
      name: 'English',
      file: 'en.json',
    },
    {
      code: 'de',
      name: 'Deutsch',
      file: 'de.json',
    },
  ],
},
```

Feature layer `nuxt.config.ts` (fragment) and its `i18n/locales/en.json`:

```ts
i18n: {
  locales: [
    {
      code: 'en',
      file: 'en.json',
    },
    {
      code: 'de',
      file: 'de.json',
    },
  ],
},
```

```json
{
  "patients": {
    "single": {
      "title": "Patient"
    }
  }
}
```
