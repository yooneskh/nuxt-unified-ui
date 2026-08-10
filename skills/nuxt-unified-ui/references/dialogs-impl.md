# Dialog implementation notes

## `launchDialog`

```ts
export async function launchDialog(options: { component: any, props: any }) {
  const modal = useOverlay().create(options.component, {
    destroyOnClose: true,
  })
  return await modal.open(options.props).result
}
```

Dialog components should emit `close` (with optional payload). Both pickers also listen to `u-modal` `@update:open` and emit `close` when open becomes false.

## Action handling

Standard pattern: put side effects and async work in button **`onClick`** (choice picker) or **`submitButton.onClick`** (form picker). The helpers await that callback before emitting `close`.

`value` on choice buttons is optional. Built-in defaults use `value: true` / `value: false`, but custom buttons should omit `value` unless the caller needs the promise result to branch. Prefer `onClick` over reading the resolved value.

## Form picker layout

Renders `u-modal` → `un-card` → `<form-tag />` from internal `useForm`.

Default action row:

1. Submit (merged `submitButton`, label default `$t('common.submit')`)
2. Spacer
3. Cancel (`variant: 'ghost'` only here — `$t('common.cancel')`)

`handleSubmit`:

1. `await submitButton?.onClick?.(form.value)`
2. `emit('close', form.value)`

`initialForm` is `JSON.parse(JSON.stringify(...))` when provided; otherwise `useForm` starts from `{}`.

## Choice picker layout

Same `u-modal` + `un-card` shell without a form body (unless you only pass typography props).

Defaults:

```ts
startButtons || [{ label: $t('common.submit'), value: true }]
endButtons ?? [{ variant: 'ghost', label: $t('common.cancel'), value: false }]
```

`handleButtonClick`:

1. `await button.onClick?.(button.value)`
2. `emit('close', button.value)`

## Typing notes

Launch helpers import `ButtonProps` and `ModalProps` from `@nuxt/ui`. Field arrays are typed loosely (`any[]`) in source — follow `un-form` conventions at runtime.
