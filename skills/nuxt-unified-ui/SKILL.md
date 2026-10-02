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
  apply`, which applies the skill file by file to the whole project (on dev,
  main, or master) or to the current branch's changed files; users can also
  invoke it directly.
---

# nuxt-unified-ui

The main agent decides what code exists, where it lives, and which APIs it calls. When the work is done, the apply pipeline runs one subagent per file to check the skill's rules and apply the code style; it is the only place formatting rules apply. The main agent does not load `references/code-style.md`.

## Finishing work: `/nuxt-unified-ui apply`

Whenever you finish implementing work that added or edited a `.vue`, `.js`, or `.ts` file, run `/nuxt-unified-ui apply` before your final reply: follow [references/apply.md](references/apply.md). Do the same when the skill is invoked with the argument `apply`, or the user asks to apply nuxt-unified-ui across the project or the current branch. Invoked without an argument, the skill only loads its guidance for the task at hand.

On `dev`, `main`, or `master` it processes every `.vue`, `.js`, and `.ts` file; on any other branch, only the files that branch added or changed relative to its base branch. One subagent per file applies the logical, structural, and code-style rules, then the main agent carries out the cross-file follow-ups.

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
| `formatDate` / `parseDate` | Format and parse dates (`@formkit/tempo`) | layer | — |
| `isSlotFilled` | Check whether a slot has content | layer | — |
| `pathRelativeToBase` | Resolve a path against a file URL; also exported from the package for `nuxt.config` | layer | [layer-setup.md](references/layer-setup.md) |
| `makeConfetti` | Fire confetti: `template` picks a built-in effect (`parade`, `on-top` / `on-left` / `on-right` / `on-bottom`, `on-frame`, `split-on-top`, `on-curtain`), `amount` sets particles per burst, other args go to `canvas-confetti` | layer | — |
| `radXxx` | Any radashi function (`radGet`, `radPick`, …), in app and server | layer | [radashi.md](references/radashi.md) |
| `ufetch` | Make a one-off API request (submit, delete, click) | companion | [data-fetching.md](references/data-fetching.md) |
| `useUFetch` | Load reactive page data (`data`, `pending`, `refresh`) | companion | [data-fetching.md](references/data-fetching.md) |
| `parseSchema` | Compile a resource schema DSL into `{ schema, type, inferred }` | companion | [resources.md](references/resources.md) |
| `createUnifiedResourceController` / `UnifiedResourceController` | Create the typed Mongo controller (`dbo`) for a resource | companion | [resources.md](references/resources.md) |
| `app` / `UnifiedAppRegistry` | Global typed registry of resources (`app.users.dbo`) | companion | [resources.md](references/resources.md) |
| `handleResourceSchema`, `handleResourceList`, `handleResourceCreate`, `handleResourceCount`, `handleResourceRetrieve`, `handleResourceUpdate`, `handleResourceDelete` | Implement the standard REST routes of a resource | companion | [resources.md](references/resources.md) |
| `useResourceName` | Derive a resource's API path and display titles from its name | companion | [resources.md](references/resources.md) |
| `useResourceMeta` | Map a resource schema to form fields and table columns | companion | [resources.md](references/resources.md) |
| `<resource-manager>` | Full CRUD dashboard card for a resource; exposes `refreshResources()` | companion | [resources.md](references/resources.md) |
| `<resource-explorer-table>` | Filter bar + sortable headers + `un-table` for a resource | companion | [tables.md](references/tables.md) |
| `assertBody` | Validate a request body against a schema in a server route | companion | — |
| `assertRateLimit` | Rate-limit a server route | companion | — |
| `createUnauthenticatedError` | Throw a 401 from a server route | companion | — |
| `generateUuid` | Generate a UUID | companion | — |
| `useToken` | Read or set the auth token | companion | — |
| `is-authenticated` middleware; `dashboard` / `empty` layouts | Protect pages; dashboard and full-bleed page layouts | companion | [pages.md](references/pages.md) |
| `useJsonld` | Emit JSON-LD on public pages, only when `nuxt-jsonld` is installed | `nuxt-jsonld` | [pages.md](references/pages.md) |

## File structure

The main agent decides where a file lives and which one job it has, and does it while implementing. Apply subagents only report misplaced files; they never move files or update callers.

Each `.vue`, `.js`, and `.ts` file has one responsibility. When a file would have two independent jobs, create two files.

Nuxt auto-imports `app/components/` and `app/utils/` across every layer. `app/composables/` is public in the same way. A file that must stay inside one layer does not go in those directories.

| Role | Directory | Visibility |
|---|---|---|
| Private Vue component | `app/atoms/` | This layer only |
| Private function, composable, or helper | `app/libs/` | This layer only |
| Public Vue component | `app/components/` | Whole app, auto-imported |
| Public util | `app/utils/` | Whole app, auto-imported |

Generate private first. New components start in `app/atoms/`. New functions and similar helpers start in `app/libs/`. Promote a file to `app/components/` or `app/utils/` only when another layer needs it. After a promote, update every caller and remove the relative import; public modules are auto-imported.

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

Make these choices while implementing. The apply pipeline checks them again afterward.

- Prefer the APIs above over hand-rolled equivalents (raw `$fetch`, hand-built `u-modal` flows, direct `radashi` imports).
- A new resource includes its server plugin, the full REST route set, and a dashboard nav entry or a custom `<resource-manager>` page.
- Use `ufetch` for a one-off request. Use `useUFetch` for reactive page data.
- Every page has an explicit `definePageMeta.name` and sets SEO with `useHead` (title) and `useSeoMeta` (description).
- Buttons, badges, and icons follow the component conventions in [references/toast-and-ui.md](references/toast-and-ui.md#component-conventions). Read them before writing any button.
- When splitting or promoting a file, update its callers in the same task.
- Installing the layer includes the required host `assets/css/main.css` and the `pathRelativeToBase` CSS entry in `nuxt.config`.

## i18n

- Every user-facing string goes through `$t`, in templates and in script. `$t` is available in both without calling `useI18n()`.
- Add each new key to every locale file the project has (the layer ships `en.json` and `de.json` in `i18n/locales/`).
- `un.*` keys belong to this layer. `common.*` holds shared labels such as submit and cancel. App keys go under a feature namespace (`patients.single.title`).
- Examples in the references often use English literals for brevity. In real code those strings are `$t('...')` keys.
