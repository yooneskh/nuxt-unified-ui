# Dialogs

Overlay dialogs built on Nuxt UI `useOverlay`. Button variants follow [toast-and-ui.md](toast-and-ui.md#component-conventions).

## Action handling

Put business logic in the button `onClick` (choice buttons, or form `submitButton.onClick`). Do not post-process the resolved promise for the primary action.

The launcher awaits `onClick` before closing, so the dialog stays open, with a loading button, until the work finishes.

`value` on a choice-picker button is optional. Omit it. Rely on `onClick` for side effects. Set `value` only when a caller needs the promise result to distinguish buttons.

Prefer `launchFormPickerDialog` / `launchChoicePickerDialog` over a hand-rolled `u-modal` for these flows. Field lists use `identifier`, not `type`, for the element kind (see [forms.md](forms.md)).

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

### Any dialog component

```ts
const result = await launchDialog({
  component: ConfirmDeleteDialog,
  props: {
    itemName: item.name,
  },
});
```

The component receives `props` and emits `close` with an optional payload. That payload is the resolved `result`. Write the component with `u-modal` and emit `close` from its `@update:open` when it is dismissed, as the built-in pickers do.

## API map

| Helper | Resolves to |
|--------|-------------|
| `launchDialog({ component, props })` | the component's `close` payload |
| `launchFormPickerDialog(options)` | submitted form object, or `undefined` on dismiss |
| `launchChoicePickerDialog(options)` | clicked button's `value`, or `undefined` on dismiss / no `value` |

`launchDialog` uses `useOverlay().create(component, { destroyOnClose: true })`. Both pickers render `u-modal` → `un-card`, so their buttons are `un-card` actions (`actionType: 'spacer'` and `tooltip` work).

## Form picker options

- `icon`, `title`, `subtitle`, `text`
- `modalOptions?: ModalProps`
- `fields: any[]` — `un-form` schema (see [forms.md](forms.md))
- `initialForm?` — deep-cloned with `JSON.parse(JSON.stringify(...))` before editing, so `Date`, `File`, and other non-JSON values do not survive. Otherwise the form starts from `{}`
- `submitButton?` — Nuxt UI `ButtonProps` plus:
  - `onClick?.(form)` — where submit logic goes. It is awaited, then the dialog closes with the form
  - `disabled` may be a boolean, `(form) => boolean`, or a mongo-style object (`smartMatch`)
  - label defaults to `$t('common.submit')`
- `cancelButton?` — merged into the default Cancel (`variant: 'ghost'`, `$t('common.cancel')`). It always closes without a payload. Its own `onClick` is ignored

Action row: Submit, spacer, Cancel.

## Choice picker options

- `icon`, `title`, `subtitle`, `text`, `modalOptions`
- `startButtons?` — falls back with `||` to one Submit button (`$t('common.submit')`, `value: true`)
- `endButtons?` — falls back with `??` to one ghost Cancel (`$t('common.cancel')`, `value: false`). Pass `[]` to hide it
- Each button: `ButtonProps & { value?: string }` plus `onClick?.(value)`. It is awaited, then the dialog closes with `value`
