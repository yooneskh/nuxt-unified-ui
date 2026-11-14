# Forms (`useForm` / `un-form`)

Schema-driven forms. The element kind is `identifier`, not `type`. Reserve `type` for the HTML input type (`email`, `password`, `file`).

## Quick start

```vue
<script setup>

/* responsibility */

// Collects the applicant's
// personal details.


/* form */

const { form, formTag } = useForm({
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
    {
      key: 'gender',
      identifier: 'select',
      label: 'Gender',
      items: [
        {
          value: 'male',
          label: 'Male',
        },
        {
          value: 'female',
          label: 'Female',
        },
      ],
    },
    {
      key: 'email',
      identifier: 'input',
      label: 'Email',
      type: 'email',
    },
    {
      key: 'dateOfBirth',
      identifier: 'date',
      label: 'Date of Birth',
    },
  ],
});

</script>


<template>
  <form-tag />
</template>
```

Or bind `un-form` directly: `<un-form :target="form" :fields="fields" />`.

## `useForm`

- `target?`: `MaybeRefOrGetter<any>` — object to edit (default `{}`). A plain object passed here is mutated as the user edits.
- `fields`: `MaybeRefOrGetter<any[]>` — field schema
- Returns `{ form, formTag }`. `form` is `toRef(target || {})`. `formTag` renders `un-form` bound to `form` and `fields`.

## Field schema

`un-form` renders a 12-column grid (`grid grid-cols-12 gap-3`).

| Prop | Required | Meaning |
|------|----------|---------|
| `key` | yes | Path into `target`. Supports `a.b` and `arr[0].x`. Read with `radGet`. Written with `unSet`, which creates missing objects and arrays |
| `identifier` | yes | Element kind: a built-in below, or a custom one |
| `width` | no | 1–12 grid columns (default 12) |
| `if` | no | Show only when `smartMatch(if, target)` is truthy |
| `label` / `hint` / `help` / `description` | no | Rendered by `u-form-field`. Checkbox: see below |

Any other prop is forwarded to the underlying Nuxt UI control.

## Built-in elements

Built-ins are internal. Select them by `identifier`. Never import them.

| `identifier` | Control | Notes |
|--------------|---------|-------|
| `input` | `u-input` | `type` (`email`, `password`, `file`, …). `type: 'file'` stores a `File`, or a `FileList` when `multiple`. Use `accept` to filter |
| `textarea` | `u-textarea` | standard textarea props |
| `select` | `u-select-menu` | `items` as strings or `{ value, label }`. `value-key="value"` is fixed |
| `date` | read-only input + `u-calendar` popover | stores a timestamp. Month and year dropdowns |
| `checkbox` | `u-checkbox` | `fieldLabel` is the form-field label. `label` is the checkbox text. The outer label does not come from `label` |
| `series` | list of nested `un-form`s | see [Series fields](#series-fields) |

## Conditional fields (`if` + `smartMatch`)

`smartMatch(filter, target)`:

1. `filter` is a function → `filter(target)`
2. Else `filter` is an object → mongo-style match via `unified-mongo-filter`
3. Else → truthiness of `filter`

```js
{
  key: 'companyName',
  identifier: 'input',
  label: 'Company',
  if: {
    type: 'business',
  },
}
```

A hidden field is not rendered. A value already on `target` stays until you clear it.

## Series fields

| Field prop | Role |
|------------|------|
| `label` | Header label |
| `itemFields` | Field schema for each item |
| `itemBase` | Clone source for new items (default `{}`) |
| `seriesColumns` | 1–6 columns (default 1) |

```js
{
  key: 'addresses',
  identifier: 'series',
  label: 'Addresses',
  seriesColumns: 2,
  itemBase: {
    city: '',
    street: '',
  },
  itemFields: [
    {
      key: 'city',
      identifier: 'input',
      label: 'City',
      width: 6,
    },
    {
      key: 'street',
      identifier: 'input',
      label: 'Street',
      width: 6,
    },
  ],
}
```

Items can be added, duplicated (the copy loses `_id`), reordered, and deleted. Each item is collapsible. Items already present start collapsed. A newly added or duplicated item starts open. Those actions sit on the `Item N` header. i18n keys: `common.*`, `un.series.*`.

## Custom elements

A custom element is a layer-private component in `app/atoms/`. It receives the `field` prop and binds its value with `defineModel()`:

```vue
<script setup>

/* responsibility */

// Renders a text input
// for a custom form field.


/* interface */

const props = defineProps({
  field: Object,
});

const modelValue = defineModel();

</script>


<template>
  <u-input
    :placeholder="props.field.placeholder"
    v-model="modelValue"
  />
</template>
```

Register it once from a Nuxt plugin. The identifier must be unique among built-ins and extras. Do not push into `useFormExtraElements()` directly. `registerFormExtraElement` is the only writer. `useFormExtraElements()` reads the list.

```ts

/* responsibility */

// Registers the custom text
// form element.


export default defineNuxtPlugin(() => {
  registerFormExtraElement({
    identifier: 'custom-text',
    component: defineAsyncComponent(() => import('../atoms/form-element-custom-text.vue')),
  });
});
```

`launchFormPickerDialog` takes the same `fields` schema. See [dialogs.md](dialogs.md).
