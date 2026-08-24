# Public surface inventory

Auto-imported unless noted. Paths are repository-relative under `app/`.

## Components (`app/components/`)

Reference components in **kebab-case** in templates.

| Component | File | Notes |
|-----------|------|--------|
| `un-form` | `un-form.vue` | Schema form; props `target`, `fields` |
| `un-card` | `un-card.vue` | Card + typography + action rows |
| `un-typography` | `un-typography.vue` | Icon / title / subtitle / text / append |
| `un-spinner` | `un-spinner.vue` | Spinning Lucide loader icon |

## Composables

| Name | File | Returns / behavior |
|------|------|--------------------|
| `useForm` | `composables/use-form.ts` | `{ form, formTag }` |
| `useFormExtraElements` | `composables/use-form-extra-elements.ts` | Shared state array of `{ identifier, component }` |

## Dialogs & launchers

| Util | Dialog component | Purpose |
|------|------------------|---------|
| `launchDialog` | any | Generic `useOverlay().create` + `open().result` |
| `launchFormPickerDialog` | `dialogs/form-picker-dialog.vue` | Modal form; handle submit in `submitButton.onClick` |
| `launchChoicePickerDialog` | `dialogs/choice-picker-dialog.vue` | Modal choice; handle actions in button `onClick` |

## Toast

| Util | File | Notes |
|------|------|--------|
| `toast` | `utils/launch-toast.ts` | Uses `$toaster` from plugin |
| `toastSuccess` | same | `icon: lucide:check`, `color: success` |
| `toastError` | same | `icon: lucide:circle-alert`, `color: error` |
| `toastWarning` | same | `icon: lucide:triangle-alert`, `color: warning` |
| `toastInfo` | same | `icon: lucide:info`, `color: info` |

Plugin: `plugins/use-toaster.ts` → `provide.toaster = useToast()`.

## Form extras

| Util | File |
|------|------|
| `registerFormExtraElement` | `utils/register-form-extra-element.ts` |

## Other utils

| Util | File | Purpose |
|------|------|---------|
| `smartMatch` | `utils/smart-match.ts` | Function / mongo filter / truthy |
| `unSet` | `utils/unified-set.ts` | Nested path set (mutates) |
| `formatDate` / `parseDate` | `utils/format-date.ts` | `@formkit/tempo` helpers |
| `isSlotFilled` | `utils/is-slot-filled.ts` | Slot emptiness check |
| `pathRelativeToBase` | `utils/path-relative.ts` | Also exported from package entry |
| `makeConfetti` | `utils/make-confetti.ts` | `canvas-confetti` helper; `template` runs a built-in effect (`parade`, `on-top` / `on-left` / `on-right` / `on-bottom`, `on-frame`, `split-on-top`, `on-curtain`), `amount` overrides particles per burst, otherwise args go to `confetti()` |

## Built-in form element identifiers

Mapped in `un-form`: `input`, `textarea`, `select`, `series`, `date`, `checkbox` → `app/elements/form-element-*.vue`.

## Radashi

All radashi runtime exports are auto-imported as `radXxx` in both `app/` and `server/`. See [radashi.md](radashi.md).

## Package entry types (`index.d.ts`)

```ts
declare module 'nuxt-unified-ui' {
  export function pathRelativeToBase(base: string, path: string): string;
}
```

Also ambient-declares `unified-mongo-filter`’s `matches`.
