# Toast and UI components

## Toast helpers — `app/utils/launch-toast.ts`

```ts
type IToast = Parameters<ReturnType<typeof useToast>['add']>['0']
type ITypedToast = Omit<IToast, 'icon' | 'color'>

toast(options: IToast)
toastSuccess(options: ITypedToast) // icon lucide:check, color success
toastError(options: ITypedToast)   // icon lucide:circle-alert, color error
```

Implementation uses `useNuxtApp().$toaster` from `app/plugins/use-toaster.ts`:

```ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      toaster: useToast(),
    },
  }
})
```

Pass any Nuxt UI toast fields (`title`, `description`, `color`, …). Success/error helpers omit `icon`/`color` from the options type; call `toast` directly for full control.

## `un-typography` — `app/components/un-typography.vue`

Props: `icon`, `title`, `subtitle`, `text`, plus `*Classes` variants.

Slots: `title`, `subtitle`, `append`.

Renders nothing when all of icon/title/subtitle/text/append are empty (`isSlotFilled` aware).

## `un-card` — `app/components/un-card.vue`

Composes `u-card` + `un-typography`.

Notable props:

| Prop | Role |
|------|------|
| `icon`, `title`, `subtitle`, `text` | Header / body copy |
| `fluidBody` | Drop body padding when true |
| `actions` | Footer buttons; items may set `actionType: 'spacer' \| 'button'`, `tooltip` |
| `verticalActions` | Stack actions; buttons `block` |
| `subtitleActions` | Buttons in subtitle area |
| `appendActions` | Buttons in typography append |

Slots: `title`, `subtitle`, `append`, `append-prepend`, default body, `actions`, `actions-prepend`, `actions-append`.

Action buttons: `loading-auto`, props via `radOmit` excluding `actionType` / `tooltip`.

## `un-spinner` — `app/components/un-spinner.vue`

```vue
<u-icon name="lucide:loader-circle" class="animate-spin" />
```

No props.
