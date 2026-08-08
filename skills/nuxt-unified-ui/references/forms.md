# Forms (`useForm` / `un-form`)

Schema-driven forms via `useForm` / `un-form`. Field type is selected with **`identifier`** (not `type`).

Deep refs:
- [form-field-schema.md](form-field-schema.md)
- [form-elements.md](form-elements.md)

Follow [code-style.md](code-style.md) for all generated form code.

## Quick start

```vue
<script setup>

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

Or bind directly:

```vue
<un-form
  :target="form"
  :fields="fields"
/>
```

`useForm` options (`app/composables/use-form.ts`):

- `target?`: `MaybeRefOrGetter<any>` — existing object to mutate (default `{}`)
- `fields`: `MaybeRefOrGetter<any[]>` — field schema
- returns `{ form, formTag }` where `formTag` is a renderless wrapper around `un-form`

## Field schema (essentials)

| Prop | Required | Meaning |
|------|----------|---------|
| `key` | yes | Path into `target` (`radGet` / `unSet`; supports `a.b` and `arr[0].x`) |
| `identifier` | yes | Element kind: `input` \| `textarea` \| `select` \| `series` \| `date` \| `checkbox` \| custom |
| `width` | no | 1–12 grid columns (default 12) |
| `if` | no | Show when `smartMatch(if, target)` is truthy |
| `label` / `hint` / `help` / `description` | no | Passed to `u-form-field` (checkbox uses `fieldLabel` for the form-field label) |

Extra props are forwarded to the underlying Nuxt UI control after omitting form meta keys. See [form-elements.md](form-elements.md).

## Built-in identifiers

| `identifier` | Control | Notable field props |
|--------------|---------|---------------------|
| `input` | `u-input` | `type` (`email`, `password`, `file`, …), `multiple` + `accept` for files |
| `textarea` | `u-textarea` | standard textarea props |
| `select` | `u-select-menu` | `items`; `value-key="value"` fixed |
| `date` | popover + `u-calendar` | stores timestamp via `parseDate` / `formatDate` |
| `checkbox` | `u-checkbox` | use `fieldLabel` for outer label; `label` goes to checkbox |
| `series` | nested `un-form` list | `itemFields`, `itemBase`, `seriesColumns` (1–6) |

## Conditional fields (`if` + `smartMatch`)

`un-form` filters fields with:

```ts
!('if' in field) || smartMatch(field.if, target)
```

`smartMatch` (`app/utils/smart-match.ts`):

1. If `filter` is a **function** → `filter(target)`
2. Else if **object** → `matches(filter, target)` from `unified-mongo-filter`
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

## Extending with custom elements

```ts
export default defineNuxtPlugin(() => {
  registerFormExtraElement({
    identifier: 'test',
    component: defineAsyncComponent(() => import('../elements/form-element-test.vue')),
  });
});
```

Custom component contract:

- props: `field` (object)
- `defineModel()` for the value
- `registerFormExtraElement` wraps the component with `markRaw`

State lives in `useFormExtraElements()` (`useState('--nuxt-unified-ui-form-extra-elements--')`).

## Series fields

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

UI supports add / duplicate / reorder / delete. Duplicate clears `_id` on the copy.

## Do / don’t

**Do**

- Use `identifier` for element selection; reserve `type` for HTML input types
- Register extras once in a Nuxt plugin
- Reference the form component as `un-form` in templates

**Don’t**

- Use `type: 'select'` instead of `identifier: 'select'`
- Expect checkbox outer label from `label` — use `fieldLabel`
- Mutate `useFormExtraElements` without `registerFormExtraElement`
