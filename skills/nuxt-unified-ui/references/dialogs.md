# Dialogs, toasts, and UI helpers

Overlay dialogs (Nuxt UI `useOverlay`), toast helpers, and layout primitives.

Deep refs:
- [dialogs-impl.md](dialogs-impl.md)
- [toast-and-ui.md](toast-and-ui.md)

Follow [code-style.md](code-style.md) for all generated dialog/UI code.

## Action handling rule

For launched dialogs, put business logic in the button **`onClick`** handlers (choice buttons or form `submitButton.onClick`). That is the standard pattern — not post-processing the resolved promise for the primary action.

`value` on choice-picker buttons is **optional**. Prefer omitting it; rely on `onClick` for side effects. Only set `value` when a caller truly needs the promise result to distinguish buttons.

## Quick start

### Choice / confirm dialog

```ts
await launchChoicePickerDialog({
  icon: 'lucide:package',
  title: 'Do you want to submit?',
  subtitle: 'Admission Process',
  text: 'Are you sure you want to submit your application?',
  startButtons: [
    {
      icon: 'lucide:check',
      label: 'Submit',
      onClick: async () => {

        await submitApplication();

        toastSuccess({
          title: 'Submission Completed',
        });

      },
    },
  ],
});
```

### Form picker dialog

```ts
await launchFormPickerDialog({
  icon: 'lucide:text',
  title: 'Admission Form',
  fields: [
    {
      key: 'firstName',
      identifier: 'input',
      label: 'First Name',
      width: 6,
    },
    {
      key: 'lastName',
      identifier: 'input',
      label: 'Last Name',
      width: 6,
    },
  ],
  initialForm: {
    firstName: 'John',
  },
  submitButton: {
    icon: 'lucide:send',
    label: 'Submit',
    onClick: async form => {

      await saveApplication(form);

      toastSuccess({
        title: 'Form Submitted',
      });

    },
  },
});
```

### Toasts

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

Requires app tree under `u-app` (toaster from Nuxt UI + layer plugin `plugins/use-toaster.ts`).

## API map

| Helper | Resolves to | Source |
|--------|-------------|--------|
| `launchDialog({ component, props })` | `modal.open(props).result` | `app/utils/launch-dialog.ts` |
| `launchFormPickerDialog(options)` | submitted form object (or dismiss) | `app/utils/launch-form-picker-dialog.ts` |
| `launchChoicePickerDialog(options)` | button `value` if set (or dismiss) | `app/utils/launch-choice-picker-dialog.ts` |
| `toast` / `toastSuccess` / `toastError` | void | `app/utils/launch-toast.ts` |

```ts
await launchDialog({
  component: MyDialog,
  props: {
    /* passed to component; emit close with payload */
  },
});
```

`launchDialog` uses `useOverlay().create(component, { destroyOnClose: true })`.

## Form picker options

- `icon`, `title`, `subtitle`, `text`
- `modalOptions?: ModalProps`
- `fields: any[]` (`un-form` schema — see [forms.md](forms.md))
- `initialForm?` — deep-cloned into `useForm` target
- `submitButton?` — Nuxt UI `ButtonProps` plus:
  - **`onClick?.(form)`** — standard place for submit logic (runs before close)
  - `disabled` may be boolean | `(form) => boolean` | mongo-style object (`smartMatch`)
- `cancelButton?` — closes without payload

## Choice picker options

- `icon`, `title`, `subtitle`, `text`, `modalOptions`
- `startButtons?` — default one Submit (`value: true` only on the built-in default)
- `endButtons?` — default Cancel (`value: false` only on the built-in default); `??` so `[]` hides defaults
- Each button: `ButtonProps & { value?: string }` plus **`onClick?.(value)`**

Avoid setting `value` on custom buttons unless the await result must distinguish which button was pressed.

## UI primitives

| Component | Use for |
|-----------|---------|
| `un-typography` | Icon + title + subtitle + text + `#append` |
| `un-card` | Typography header, body slot/`text`, `actions` / `subtitleActions` / `appendActions` |
| `un-spinner` | `lucide:loader-circle` spinning icon |

Action entries support `actionType: 'spacer'` (flex grow) and optional `tooltip`. Buttons use `loading-auto`.

## Do / don’t

**Do**

- Prefer `launchFormPickerDialog` / `launchChoicePickerDialog` over hand-rolled `u-modal` for these flows
- Handle actions in button / submit `onClick`
- Keep field lists consistent with `un-form` (`identifier`, not `type`, for element kind)

**Don’t**

- Call `toast*` without `u-app` / toaster setup
- Set `value` on choice buttons by default — omit it unless needed
- Put primary dialog logic only after `await` when `onClick` should own it
