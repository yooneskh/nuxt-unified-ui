# Toasts, UI components, and conventions

Toast helpers, the `un-*` layout components, and the button / badge / icon conventions every page follows. Dialogs are in [dialogs.md](dialogs.md); tables in [tables.md](tables.md).

## Component conventions

This is the only place these rules are stated.

- **Icons** are always Lucide: `lucide:*`.
- **Bottom-of-card action buttons use the default variant — set no `variant`**: `un-card` `actions` (also with `verticalActions`), form picker `submitButton`, and choice picker `startButtons` / `endButtons`.
- **All other buttons set `variant: 'subtle'` (`variant="subtle"`) explicitly**: top-of-card buttons — `un-card` `appendActions` / `subtitleActions`, `<resource-manager>` `actions` (rendered as its card's `appendActions`) — and standalone `u-button`s. Nuxt UI's default variant is `solid`, so leaving `variant` out is not the same.
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

The app tree must be wrapped in `u-app` so Nuxt UI's toaster is mounted. Do not call `toast*` outside that setup.

## UI components

| Component | Use for |
|-----------|---------|
| `un-typography` | Icon + title + subtitle + text + `#append` |
| `un-card` | Typography header, body slot / `text`, action rows |
| `un-spinner` | Spinning loader icon; no props |
| `un-table` | Page of rows with row actions and pagination — see [tables.md](tables.md) |

### `un-typography`

Props: `icon`, `title`, `subtitle`, `text`, plus `*Classes` variants, and `headerLevel` (1–6, default `2`).

Title renders as `h{headerLevel}`; subtitle renders as the next heading level (capped at `h6`).

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

Slots: `title`, `subtitle`, `append`, `append-prepend`, default body, `actions`, `actions-prepend`, `actions-append`.

Action entries are Nuxt UI button props plus:

- `actionType: 'spacer'` — flex-grow gap; `'button'` (or omitted) — a button
- `tooltip` — wraps the button in `u-tooltip`

Action buttons have `loading-auto`, so an async `onClick` shows a spinner without extra state.
