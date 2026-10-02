---
name: nuxt-unified-ui
description: >-
  Guides work with the nuxt-unified-ui Nuxt layer, including installation,
  forms, dialogs, tables, resources, data fetching, and where files live
  (app/atoms, app/libs, layer-private vs public components and utils). Use
  when working in or consuming nuxt-unified-ui. After editing each .vue, .js,
  or .ts file, the main agent must launch one style subagent for that file.
  Formatting stays in that subagent.
---

# nuxt-unified-ui

The main agent places files and uses the layer. A style subagent formats each file afterward. Do not load `references/code-style.md` or `references/style-todos.md` in the main agent.

## File structure

The main agent decides where a file lives and which one job it has. Do this before the style handoff. The style subagent cannot move a file or update its callers.

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

Read the reference that matches the task before creating or editing files. The details stay in that reference. Do not load `references/code-style.md` or `references/style-todos.md`.

| Task | Read first |
|---|---|
| Layer installation and required CSS | [references/layer-setup.md](references/layer-setup.md) |
| Whether an API exists | [references/public-surface.md](references/public-surface.md), or the source |
| Forms / `useForm` / `un-form` | [references/forms.md](references/forms.md) |
| Form schema and elements | [references/form-field-schema.md](references/form-field-schema.md), [references/form-elements.md](references/form-elements.md) |
| Dialogs | [references/dialogs.md](references/dialogs.md) |
| Dialog implementation | [references/dialogs-impl.md](references/dialogs-impl.md) |
| Toasts and `un-*` UI | [references/toast-and-ui.md](references/toast-and-ui.md) |
| Tables | [references/tables.md](references/tables.md) |
| Pages and routing | [references/pages.md](references/pages.md) |
| `ufetch` / `useUFetch` | [references/data-fetching.md](references/data-fetching.md) |
| Unified resources | [references/resources.md](references/resources.md) |
| Radashi `radXxx` exports | [references/radashi.md](references/radashi.md) |

## Decisions the main agent owns

These choices change which files exist and what they call. The style subagent does not make them.

- Use only APIs listed in [references/public-surface.md](references/public-surface.md) or present in the source. Do not invent helpers.
- A new resource includes its server plugin, the full REST route set, and a dashboard nav entry or a custom `<resource-manager>` page.
- Use `ufetch` for a one-off request. Use `useUFetch` for reactive page data.
- Every page has an explicit `definePageMeta.name` and a `/* seo */` block with `useHead` and `useSeoMeta`.
- When splitting or promoting a file, update its callers in the same task. Then run the style handoff for every `.vue`, `.js`, or `.ts` file that changed.
- Installing the layer includes the required host `assets/css/main.css` and the `pathRelativeToBase` CSS entry in `nuxt.config`.

## Mandatory handoff

The main agent owns implementation and file placement. A style subagent owns formatting.

After implementation settles:

1. Track only `.vue`, `.js`, and `.ts` files the main agent added or edited during this task. Do not include unrelated pre-existing working-tree changes.
2. Launch exactly one subagent per tracked file. Files may be processed in parallel; never give one subagent multiple files.
3. Give each subagent the absolute target path and absolute paths to `references/style-todos.md` and `references/code-style.md`.
4. If the main agent edits a processed file again, rerun its style subagent.
5. If a subagent reports `split required`, split the file in the main agent, place each result with the file-structure rules, update its callers, then launch one new style subagent for each resulting file and each caller this task edited.
6. Do not finish until every tracked file has a successful style result.

Use this prompt:

```text
Apply nuxt-unified-ui style to this file only:
<absolute target path>

Read and follow the complete files:
<absolute skill path>/references/style-todos.md
<absolute skill path>/references/code-style.md

Edit only the target file. Preserve behavior. Return either:
- styled: <path>
- split required: <responsibilities and suggested paths>
```

The file-structure rules and the decisions above stay in the main agent. Formatting rules do not: the style subagent loads their full text.
