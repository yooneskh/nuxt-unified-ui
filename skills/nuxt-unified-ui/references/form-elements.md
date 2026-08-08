# Built-in form elements

All under `app/elements/`. Props: `field`, `v-model` via `defineModel()`.

## `input` — `form-element-input.vue`

- Wraps `u-form-field` + `u-input`
- Forwards field props except `key`, `identifier`, `label`, `hint`, `help`, `description`
- `type: 'file'`: display value forced empty; `@change` sets `File` or `FileList` when `multiple`

## `textarea` — `form-element-textarea.vue`

- `u-form-field` + `u-textarea`
- Same omit list as input

## `select` — `form-element-select.vue`

- `u-form-field` + `u-select-menu`
- Fixed `value-key="value"`
- Pass `items` (and other SelectMenu props) on the field

## `date` — `form-element-date.vue`

- Readonly `u-input` opening a `u-popover` with `u-calendar`
- Model stored as timestamp (`parseDate` / `formatDate` with `YYYY-MM-DD`)
- Month/year dropdowns in calendar heading

## `checkbox` — `form-element-checkbox.vue`

- Form field label key: **`fieldLabel`**
- `u-checkbox` receives remaining props (including `label` for the checkbox text)

## `series` — `form-element-series.vue`

| Field prop | Role |
|------------|------|
| `label` | Header label |
| `itemFields` | Nested `un-form` fields per item |
| `itemBase` | Clone source for new items (default `{}`) |
| `seriesColumns` | 1–6 CSS columns (default 1) |

Actions: new item, duplicate (strips `_id`), move, delete. i18n keys: `common.*`, `un.series.*`.

## Custom elements

Minimum viable custom element:

```vue
<script setup>
const props = defineProps({ field: Object })
const modelValue = defineModel()
</script>

<template>
  <!-- read props.field; bind modelValue -->
</template>
```

Register with `registerFormExtraElement({ identifier, component })`. Identifier must be unique among built-ins and extras.
