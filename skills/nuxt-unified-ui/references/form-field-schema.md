# Field schema reference

Source of truth: `app/components/un-form.vue`, `app/composables/use-form.ts`, `app/utils/smart-match.ts`, `app/utils/unified-set.ts`.

## Layout

`un-form` renders a `grid grid-cols-12 gap-3`. Each field’s wrapper gets `col-span-{width}` for `width` 1–12; missing/`12` → full width.

## Value binding

```ts
radGet(target, field.key)          // read
unSet(target, field.key, value)    // write (mutates target)
```

`unSet` creates intermediate objects/arrays for dotted and `[index]` paths.

## `useForm`

```ts
interface IOptions {
  target?: MaybeRefOrGetter<any>
  fields: MaybeRefOrGetter<any[]>
}

function useForm(options: IOptions): {
  form: Ref<any>
  formTag: Component  // renders un-form with target + fields
}
```

`form` is `toRef(options.target || {})`. If you pass a plain object as `target`, that object is mutated as the user edits.

## Shared form-field chrome

Most elements pick `label`, `hint`, `help`, `description` onto `u-form-field`, then omit those plus `key` / `identifier` when binding the control.

Checkbox is special: form-field uses `fieldLabel` (and omits `fieldLabel`); remaining props including `label` go to `u-checkbox`.

## `if` evaluation order

Implemented only in `un-form`’s `filteredFields`. Hidden fields are not rendered; values already on `target` remain unless you clear them yourself.

## Select items

Use string arrays or `{ value, label }` objects. The select element sets `value-key="value"` on `u-select-menu`.

## Form picker overlap

`launchFormPickerDialog` uses the same field schema. Handle submission in `submitButton.onClick`. `submitButton.disabled` is evaluated with `smartMatch(disabled, form)` so it accepts boolean, function, or mongo-style object (see [dialogs.md](dialogs.md)).
