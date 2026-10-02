# `un-table`

`app/components/un-table.vue` wraps Nuxt UI `u-table` with an optional actions column and a pagination footer. It is a **presentational page of rows**. The parent owns fetching, sorting, filtering, and which slice of data is passed in.

i18n keys used by the table: `un.table.actions`, `un.table.itemsPerPage`.

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
| `rowTo` | `(row) => location`. Selecting a row calls `navigateTo` with that location and adds `cursor-pointer`. Return a falsy value to skip. Clicks on buttons and links stay on the action |
| `ui` | Merged into `u-table` `:ui`. Default `tr` classes (`data-[expanded=true]:bg-elevated!`, plus `cursor-pointer` when `rowTo` is set) are prepended to `ui.tr` |
| `meta` | Passed through to `u-table` |
| `v-model:itemsPerPage` | Page size (default `'25'`; choices 5 / 10 / 25 / 50 / 100) |
| `itemsPerPageItems` | Overrides the page-size select options |
| `v-model:currentPage` | Page number (default `'1'`) |

The actions column is added when **either** `actions` or `extraActions` has length. `#actions-cell` is then owned by the wrapper — do not override it.

`to` / `href` / `disabled` / `label` / `tooltip` / `warning` on an action may be a value or `(row) => …`. `vIf(row)` hides the item. `onClick(row)` receives the original row. Action clicks use `@click.stop` so they do not select the row. Buttons use `loading-auto`.

### Paged table

```vue
<un-table :columns="columns" :loading="isItemsPending || isItemsCountPending" :data="itemsData" :total-items="itemsCountData" v-model:items-per-page="itemsPerPage" v-model:current-page="currentPage" :actions="itemActions" :extra-actions="itemExtraActions">
  <template #status-cell="{ row }">
    ...
  </template>
</un-table>
```

### Compact / dialog table

No footer, no page models, no `total-items`:

```vue
<un-card :icon="icon" :title="title" fluid-body>
  <un-table
    :columns="columns"
    :data="rows"
    hide-pagination
    :actions="tableActions"
  />
</un-card>
```

Do not invent extra layout props on `un-table` — put search / filter toolbars in the parent, above the table. Use `class` / `:ui` only when a product theme overrides the table chrome.

## Column defs

One object per column. Use `id` instead of `accessorKey` only when the cell is computed and there is no row field (duration, size, …).

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

Status / role / type cells use `u-badge`. Dates use `formatDate`. Several visual states → explicit `<template v-if>` / `v-else` badge variants, not nested ternaries.

## Row actions

Two channels:

| Prop | UI | Typical fields |
|------|----|----------------|
| `actions` | Inline icon (or labeled) buttons | `icon` + `tooltip`, or `label` |
| `extraActions` | Overflow menu | `icon` + `label` (menu items need text) |

Use `actions` for the one or two primary row operations (view, edit, delete). Use `extraActions` for the rest (assign, revoke, copy, archive). A vertical separator is inserted between the two groups automatically.

`actionType` values on `actions`:

| `actionType` | UI |
|--------------|----|
| omitted / `'button'` | Inline `u-button` |
| `'split'` | Primary button plus a chevron `u-dropdown-menu` |
| `'separator'` | Vertical rule between button groups |

`warning` is a string or `(row) => string | undefined` rendered under the button (triangle + text). Split `items` may be an array or `(row) => array`. Each item uses `label` (value or `(row) => …`) and `onSelect(row)` — do not put `onClick` on split items.

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
      actionType: 'split',
      icon: 'lucide:download',
      tooltip: 'Download',
      onClick: handleItemDownloadFile,
      items: [
        {
          icon: 'lucide:file-text',
          label: 'Download file',
          onSelect: handleItemDownloadFile,
        },
        {
          icon: 'lucide:file-archive',
          label: 'Download archive',
          onSelect: handleItemDownloadArchive,
        },
      ],
    },
    {
      vIf: it => it.status !== 'archived',
      color: 'error',
      icon: 'lucide:trash',
      tooltip: it => it.role === 'admin' ? 'Admins cannot be deleted' : 'Delete',
      warning: it => it.role === 'admin' ? 'Admins cannot be deleted' : undefined,
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

- Icon-only buttons: `icon` + `tooltip`, no `label`.
- Menu / text buttons: `label` (and `icon` when it helps).
- Destructive: `color: 'error'`.
- Emphasized extra action: `color: 'primary'`.
- `{ actionType: 'separator' }` is a lone-key object between visual groups in `actions`.
- `{ actionType: 'split', items, onClick }` is a default click plus overflow choices; item handlers are `onSelect`.
- `vIf` / `disabled` / `to` / `href` / `label` / `tooltip` / `warning` take `(row) => …` when they depend on the row.
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
const itemsPerPage = ref(25);
const currentPage = ref(1);
```

- Layer default page size is `25` if the parent does not bind the model. Set the ref explicitly; its value must be one of the page-size choices.
- Page-size choices default to `5 / 10 / 25 / 50 / 100`. Pass `:items-per-page-items` to replace that list.
- Server lists: `skip = (currentPage - 1) * itemsPerPage`, `limit = itemsPerPage`, `total-items` from the `/count` endpoint.
- Client lists: pass `data` already sliced; `total-items` is the uncut length.
- Reset `currentPage` to `1` when page size, filters, or the resource path change.
- After deletes, clamp `currentPage` if it is past the last page.
- `loading` should cover **both** the page request and the count request.
- `hide-pagination` still accepts `data` as the full in-memory list. Do not bind the page models just to hide them.

## Layout

Prefer an `un-card` with `fluid-body` so the table and footer are edge-to-edge:

```vue
<un-card :title="`Manage ${titlePlural}`" fluid-body :append-actions="toolbarActions">
  <un-table
    :columns="columns"
    :loading="isItemsPending"
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
- Forward cell work through `{key}-cell` and `row.original`
- Put Create / Refresh on the card, Edit / Delete on the row

**Don’t**

- Pass the full unpaged array while the footer is visible
- Override `#actions-cell`
- Implement sort / filter as `un-table` props
