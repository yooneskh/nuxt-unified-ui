# `un-table`

`app/components/un-table.vue` wraps Nuxt UI `u-table` with an optional actions column and a pagination footer. It is a **presentational page of rows**. The parent owns fetching, sorting, filtering, and which slice of data is passed in.

Follow [code-style.md](code-style.md) for all generated table code. i18n: `$t` in both script and template (do not call `useI18n()`). Keys: `un.table.actions`, `un.table.itemsPerPage`.

## Mental model

| Belongs on `un-table` | Belongs on the parent |
|-----------------------|-----------------------|
| Columns, current page of `data`, loading flag | `useUFetch` / `ufetch`, query params |
| Footer page / page-size models | `skip` / `limit` (or client slice) from those models |
| Row `actions` / `extraActions` | Sort cycle, filter chips, toolbar |
| Slot forwarding | `{accessorKey}-header` / `-cell` contents |

Do **not** add sort, filter, or selection props to `un-table`. Resource dashboards put that above the table (`resource-explorer-table` pattern): filter bar + header slots, then `<un-table>`.

## Props

| Prop / model | Role |
|--------------|------|
| `columns` | TanStack / Nuxt UI column defs |
| `loading` | Passed to `u-table` (OR of list + count pending) |
| `data` | **Current page** of row objects, not the full collection |
| `hidePagination` | Drop the footer (dialogs, already-sliced lists) |
| `totalItems` | Count for `u-pagination` (server `/count` or `array.length`) |
| `actions` | Visible row buttons; adds the trailing `actions` column |
| `extraActions` | Overflow `u-dropdown-menu` (ellipsis); also creates the column |
| `stickyActions` | Pin the `actions` column to the right |
| `ui` | Merged into `u-table` `:ui` after the expanded-row `tr` class |
| `meta` | Passed through to `u-table` |
| `v-model:itemsPerPage` | Page size (default `'25'`; choices 5 / 10 / 25 / 50 / 100) |
| `v-model:currentPage` | Page number (default `'1'`) |

The actions column is added when **either** `actions` or `extraActions` has length. `#actions-cell` is then owned by the wrapper — do not override it.

`to` / `href` / `disabled` on an action may be a value or `(row) => …`. `vIf(row)` hides the item. `onClick(row)` receives the original row. Buttons use `loading-auto`.

## Attribute order on `<un-table>`

Omit unused props. When present, write them in this order:

1. `:columns`
2. `class` / `:ui` (presentation only)
3. `:loading`
4. `:data`
5. `hide-pagination`
6. `:total-items`
7. `v-model:items-per-page`
8. `v-model:current-page`
9. `sticky-actions`
10. `:actions`
11. `:extra-actions`
12. `:meta`

Models are always **page size, then page**. Closing `>` sits on the same line as the last attribute.

### Paged table

```vue
<un-table
  :columns="columns"
  :loading="isItemsLoading || isItemsCountLoading"
  :data="itemsData"
  :total-items="itemsCountData"
  v-model:items-per-page="itemsPerPage"
  v-model:current-page="currentPage"
  :actions="itemActions"
  :extra-actions="itemExtraActions">

  <template #status-cell="{ row }">
    ...
  </template>

</un-table>
```

### Compact / dialog table

No footer, no page models, no `total-items`:

```vue
<un-card
  :icon="icon"
  :title="title"
  fluid-body>
  <un-table
    :columns="columns"
    :data="rows"
    hide-pagination
    :actions="tableActions"
  />
</un-card>
```

`class` / `:ui` stay immediately after `:columns` when a product theme overrides the table chrome. Do not invent extra layout props on `un-table` — put search / filter toolbars in the parent, above the table.

## Column defs

One object per column, **`accessorKey` then `header`**. Use `id` instead of `accessorKey` only when the cell is computed and there is no row field (duration, size, …).

```js
const columns = [
  {
    accessorKey: 'name',
    header: $t('people.columnName'),
  },
  {
    accessorKey: 'status',
    header: $t('people.columnStatus'),
  },
  {
    id: 'duration',
    header: $t('people.columnDuration'),
  },
];
```

Keep column lists in the template when they are short and static. Move them to a script const / computed when they are reused or built from schema (`useResourceMeta` maps `key` → `accessorKey`, `radTitle(key)` → `header`).

## Slots

All `u-table` slots are forwarded.

| Slot | Use |
|------|-----|
| `{accessorKey}-cell` | Custom cell. Bind `{ row }` and read **`row.original`** |
| `{accessorKey}-header` | Custom header (sort button + filter popover) |
| `empty` | Empty state (`u-empty` or copy) |
| `actions-cell` | **Do not set** when `actions` / `extraActions` are passed |

```vue
<template #status-cell="{ row }">
  <u-badge
    variant="subtle"
    :color="row.original.status === 'active' ? 'success' : undefined"
    :label="radTitle(row.original.status)"
  />
</template>

<template v-for="column in columns" :key="column.accessorKey" #[column.accessorKey+'-cell']="{ row }">
  <resource-explorer-cell
    :column="column"
    :row="row.original"
    :data="row.original[column.accessorKey]"
  />
</template>
```

Status / role / type cells use `u-badge` (`variant="subtle"`, omit neutral `color`). Dates use `formatDate`. Several visual states → explicit `<template v-if>` / `v-else` badge variants, not nested ternaries.

## Row actions

Two channels:

| Prop | UI | Typical fields |
|------|----|----------------|
| `actions` | Inline icon (or labeled) buttons | `icon` + `tooltip`, or `label` |
| `extraActions` | Overflow menu | `icon` + `label` (menu items need text) |

Use `actions` for the one or two primary row operations (view, edit, delete). Use `extraActions` for the rest (assign, revoke, copy, archive). A vertical separator is inserted between the two groups automatically.

Field order on **every** action object (omit unused):

`vIf` → `actionType` → `color` → `icon` → `label` → `tooltip` → `disabled` → `to` → `href` → `onClick`

```js
const itemActions = computed(() => {
  return [
    {
      icon: 'lucide:eye',
      tooltip: 'View',
      onClick: handleItemView,
    },
    {
      icon: 'lucide:pencil',
      tooltip: 'Edit',
      onClick: handleItemUpdate,
    },
    {
      actionType: 'separator',
    },
    {
      vIf: it => it.status !== 'archived',
      color: 'error',
      icon: 'lucide:trash',
      tooltip: 'Delete',
      disabled: it => it.role === 'admin',
      onClick: handleItemDelete,
    },
  ];
});

const itemExtraActions = computed(() => {
  return [
    {
      icon: 'lucide:copy',
      label: 'Copy email',
      onClick: handleItemCopyEmail,
    },
    {
      vIf: it => it.status !== 'archived',
      icon: 'lucide:archive',
      label: 'Archive',
      onClick: handleItemArchive,
    },
  ];
});
```

Rules:

- Pass **handler references** (`onClick: handleItemUpdate`) unless the row must be adapted.
- Icon-only buttons: `icon` + `tooltip`, no `label`.
- Menu / text buttons: `label` (and `icon` when it helps).
- Destructive: `color: 'error'` before `icon`.
- Emphasized extra action: `color: 'primary'` before `icon`.
- `{ actionType: 'separator' }` is a lone-key object between visual groups in `actions`.
- Omit `variant: 'subtle'` — that is the button default.
- `vIf` / `disabled` / `to` / `href` take `(row) => …` when they depend on the row.
- Do not put toolbar Create / Refresh on the row. Those belong on the parent `un-card` (`:actions` / `:append-actions`).

Resource managers prepend custom row actions, then default Edit / Delete:

```js
const resourceActions = computed(() => {
  return [
    ...(props.resourceActions || []),
    {
      icon: 'lucide:pencil',
      tooltip: 'Edit',
      onClick: handleResourceUpdate,
    },
    {
      color: 'error',
      icon: 'lucide:trash',
      tooltip: 'Delete',
      onClick: handleResourceDelete,
    },
  ];
});
```

## Pagination

Parent state:

```js
const itemsPerPage = ref(20);
const currentPage = ref(1);
```

- Layer default page size is `25` if the parent does not bind the model. Host pages often use `10` or `20` — set the ref explicitly.
- Server lists: `skip = (currentPage - 1) * itemsPerPage`, `limit = itemsPerPage`, `total-items` from the `/count` endpoint.
- Client lists: pass `data` already sliced; `total-items` is the uncut length.
- Reset `currentPage` to `1` when page size, filters, or the resource path change.
- After deletes, clamp `currentPage` if it is past the last page.
- `loading` should cover **both** the page request and the count request.
- `hide-pagination` still accepts `data` as the full in-memory list. Do not bind the page models just to hide them.

## Layout

Prefer an `un-card` with `fluid-body` so the table and footer are edge-to-edge:

```vue
<un-card
  :title="`Manage ${titlePlural}`"
  fluid-body
  :append-actions="toolbarActions">
  <un-table
    :columns="columns"
    :loading="isItemsLoading"
    :data="itemsData"
    :total-items="itemsCountData"
    v-model:items-per-page="itemsPerPage"
    v-model:current-page="currentPage"
    :actions="itemActions"
  />
</un-card>
```

Search / filter chrome sits **inside** the card, **above** `<un-table>`, not on the table. `resource-explorer-table` is the reusable version of that stack (filter chips + sort headers + `<un-table>`).

`sticky-actions` is for wide column sets that scroll horizontally. Most pages do not need it.

## Do / don’t

**Do**

- Keep `<un-table>` dumb: current page of rows in, actions and slots out
- Follow the attribute order and action-field order above
- Use `$t` for user-facing strings; `$t` is legal in script computeds
- Forward cell work through `{key}-cell` and `row.original`
- Put Create / Refresh on the card, Edit / Delete on the row

**Don’t**

- Pass the full unpaged array while the footer is visible
- Override `#actions-cell`
- Implement sort / filter as `un-table` props
- Call `useI18n()` for `$t`
- Restate `variant: 'subtle'` on row actions
- Use `ghost` on row actions (Cancel-only rule still applies)
