# Toasts, UI components, and conventions

Toast helpers, the `un-*` layout components, and the button / badge / icon conventions every page follows. Dialogs are in [dialogs.md](dialogs.md); tables in [tables.md](tables.md).

## Component conventions

This is the only place these rules are stated.

- **Icons** are always Lucide: `lucide:*`.
- **Bottom-of-card action buttons use the default variant — set no `variant`**: `un-card` `actions` (also with `verticalActions`), form picker `submitButton`, and choice picker `startButtons` / `endButtons`.
- **All other buttons set `variant: 'subtle'` (`variant="subtle"`) explicitly**: top-of-card buttons — `un-card` `appendActions` / `subtitleActions` / `subActions`, `<resource-manager>` `actions` (rendered as its card's `appendActions`) — and standalone `u-button`s. Nuxt UI's default variant is `solid`, so leaving `variant` out is not the same.
- **`un-table` row actions** (`actions` / `extraActions`, and `<resource-manager>` `resource-actions`, which feed them) omit `variant`, because `un-table` already renders them subtle.
- **Cancel / dismiss** actions use `variant: 'ghost'`, including in a bottom action row. Never use `ghost` on primary, submit, row, or any other non-Cancel action.
- **Async buttons** use `loading-auto` instead of a hand-rolled `isLoading` flag, unless something else depends on that flag.
- **Badges** (`u-badge`) are always `variant="subtle"` with `icon` + `:label` (no default-slot text), no `size`, and no `color` for neutral states.

## Toasts

```ts
toastSuccess({
  title: 'Saved',
  description: 'Profile updated.',
});

toastError({
  title: 'Failed',
  description: 'Try again.',
});

toast({
  title: 'Custom',
  icon: 'lucide:info',
  color: 'neutral',
});
```

| Helper | Icon | Color |
|--------|------|-------|
| `toast(options)` | from options | from options |
| `toastSuccess(options)` | `lucide:check` | `success` |
| `toastError(options)` | `lucide:circle-alert` | `error` |
| `toastWarning(options)` | `lucide:triangle-alert` | `warning` |
| `toastInfo(options)` | `lucide:info` | `info` |

`options` are any Nuxt UI toast fields (`title`, `description`, …). The typed helpers omit `icon` / `color` from the options type; call `toast` directly for full control. All return `void`.

The app tree must be wrapped in `u-app` so Nuxt UI's toaster is mounted. Do not call `toast*` outside that setup. `u-app` also follows the `@nuxtjs/i18n` locale, so it takes no `:locale` prop and `@nuxt/ui/locale` is never imported.

## UI components

| Component | Use for |
|-----------|---------|
| `un-typography` | Icon + title + subtitle + text + `#append` |
| `un-card` | Typography header, body slot / `text`, action rows |
| `un-spinner` | Spinning loader icon; no props |
| `un-table` | Page of rows with row actions and pagination — see [tables.md](tables.md) |

### `un-typography`

Props: `icon`, `title`, `subtitle`, `text`, `headerLevel` (1–6, default `2`), and `ui`.

Title renders as `h{headerLevel}`; subtitle renders as the next heading level (capped at `h6`).

`ui` merges classes onto the elements below. A string merges (a conflicting utility wins). A function replaces that slot. The same keys can be set for every typography block from `app.config.ts` under `ui.unTypography`.

| `ui` key | Element | Default |
|----------|---------|---------|
| `root` | Outer block | none |
| `wrapper` | Icon, title, and append row | `flex items-start` |
| `content` | Title column | `w-0 grow` |
| `heading` | Icon and title row | `flex items-center gap-[0.5em]` |
| `icon` | Icon | `size-[1.3em] shrink-0 grow-0` |
| `titleWrapper` | Title size box | `text-[1.3em]` |
| `title` | Title | `font-medium` |
| `subtitleWrapper` | Subtitle size box | `text-[0.9em]`, plus `ms-[2em]` when `icon` is set |
| `subtitle` | Subtitle | `font-light` |
| `append` | Append row | `ms-auto flex items-center gap-1` |
| `text` | Text | `mt-2` when a title or subtitle is set |

Slots: `title`, `subtitle`, `append`.

Renders nothing when all of icon/title/subtitle/text/append are empty.

### `un-card`

Composes `u-card` + `un-typography`.

| Prop | Role |
|------|------|
| `icon`, `title`, `subtitle`, `text` | Header / body copy |
| `headerLevel` | Passed to `un-typography` (1–6, default `2`) |
| `fluidBody` | Drop body padding when true |
| `actions` | Footer buttons |
| `verticalActions` | Stack actions; buttons `block` |
| `subtitleActions` | Buttons in subtitle area |
| `appendActions` | Buttons in typography append |
| `subActions` | Buttons in the row between the header and the body |
| `ui` | Classes merged onto the card regions below. A string merges (a conflicting utility wins, so `p-6` replaces `p-3`). A function replaces that slot: `body: (defaults) => 'p-0'` |

| `ui` key | Region | Default |
|----------|--------|---------|
| `root` | Passed through to `u-card` `ui.root` | `u-card` theme |
| `base` | Divided stack (`u-card` body) | `p-0 sm:p-0 divide-y divide-default` |
| `header` | Typography header | `p-3` |
| `body` | Content region | `p-3`, or `p-0` when `fluidBody` |
| `subActions` | Row between header and body | `flex flex-wrap items-center gap-1 p-3` |
| `footer` | Action row | `flex flex-wrap items-center gap-1 p-2`, plus `flex-col` when `verticalActions` |
| `wrapper`, `content`, `heading`, `icon`, `titleWrapper`, `title`, `subtitleWrapper`, `subtitle`, `append`, `text` | Passed through to `un-typography` | typography defaults; `text` also styles the card's body copy |

```vue
<un-card
  title="Invoice"
  :ui="{
    header: 'bg-elevated',
    body: 'p-6',
    footer: 'justify-end',
  }"
/>
```

`fluidBody` and `verticalActions` still apply, and `ui` merges on top of them.

The same slot keys can be set for every card from `app.config.ts`, under `ui.unCard`. A `:ui` prop on one card still overrides that.

```ts
export default defineAppConfig({
  ui: {
    unCard: {
      slots: {
        header: 'p-4',
        body: 'p-6',
        footer: 'justify-end',
      },
    },
  },
})
```

Slots: `title`, `subtitle`, `append`, `append-prepend`, `sub-actions`, default body, `actions`, `actions-prepend`, `actions-append`.

`sub-actions` sits between the header and the body. The card's divided stack draws a divider above it and below it when the row is present. Padding matches the header and body (`p-3`). The slot fills that row. When the slot is omitted, `subActions` renders its buttons there, the same way `actions` fills the footer. Entries take `actionType: 'spacer'` and `tooltip`, like `actions`. Set `variant: 'subtle'` on these buttons.

Action entries are Nuxt UI button props plus:

- `actionType: 'spacer'` — flex-grow gap; `'button'` (or omitted) — a button
- `tooltip` — wraps the button in `u-tooltip` and names it for assistive tech; an entry with a `label` keeps the label instead

Action buttons have `loading-auto`, so an async `onClick` shows a spinner without extra state.
