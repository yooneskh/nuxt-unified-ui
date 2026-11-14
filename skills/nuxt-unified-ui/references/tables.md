# `un-table`

`app/components/un-table.vue` wraps Nuxt UI `u-table` with an optional actions column and a pagination footer. It is a presentational page of rows. The parent owns fetching, sorting, filtering, and which slice of data is passed in.

i18n keys: `un.table.actions`, `un.table.itemsPerPage`.

## Mental model

| Belongs on `un-table` | Belongs on the parent |
|-----------------------|-----------------------|
| Columns, current page of `data`, loading flag | `useUFetch` / `ufetch`, query params |
| Footer page / page-size models | `skip` / `limit` (or a client slice) from those models |
| Row `actions` / `extraActions` | Sort cycle, filter chips, toolbar |
| Slot forwarding | `{accessorKey}-header` / `-cell` contents |

Do not add sort, filter, or selection props to `un-table`. A resource dashboard puts that above the table. `<resource-explorer-table>` is that stack: filter chips, sort headers, then `<un-table>`. Search and filter chrome sits inside the card, above `<un-table>`, not on the table. Use `class` / `:ui` only when a product theme overrides the table chrome. Do not invent layout props for that chrome.

## Props

| Prop / model | Role |
|--------------|------|
| `columns` | TanStack / Nuxt UI column defs |
| `loading` | Passed to `u-table`. OR of the list pending flag and the count pending flag |
| `data` | The current page of row objects, not the full collection. While the footer is visible, do not pass the unpaged array |
| `hidePagination` | Drop the footer (dialogs, already-sliced lists). `data` may then be the full in-memory list. Do not bind the page models just to hide them |
| `totalItems` | Count for `u-pagination` (server `/count`, or `array.length`) |
| `actions` | Visible row buttons. Adds the trailing `actions` column |
| `extraActions` | Overflow `u-dropdown-menu` (ellipsis). Also creates the column |
| `stickyActions` | Pin the `actions` column to the right. For wide column sets that scroll horizontally. Most pages do not need it |
| `rowTo` | `(row) => location`. Selecting a row calls `navigateTo` with that location and adds `cursor-pointer`. Return a falsy value to skip. Clicks on buttons and links stay on the action |
| `ui` | Merged into `u-table` `:ui`. Default `tr` classes (`data-[expanded=true]:bg-elevated!`, plus `cursor-pointer` when `rowTo` is set) are prepended to `ui.tr` |
| `meta` | Passed through to `u-table` |
| `v-model:itemsPerPage` | Page size. Default `25`. Choices: 5 / 10 / 25 / 50 / 100. Bind a number |
| `itemsPerPageItems` | Replaces the page-size select options |
| `v-model:currentPage` | Page number. Default `1`. Bind a number |

The actions column is added when either `actions` or `extraActions` has length. `#actions-cell` is then owned by the wrapper. Do not override it.

A `rowTo` row is focusable and activates on Enter as well as on click, so a linked table needs no extra key handling. The focus ring sits inside the row. Do not add one.

`to` / `href` / `disabled` / `label` / `tooltip` / `warning` on an action may be a value or `(row) => …`. `vIf(row)` hides the item. `onClick(row)` receives the original row. Action clicks use `@click.stop`, so they do not select the row. Buttons use `loading-auto`. An icon-only action takes its accessible name from `tooltip`. Once it also has a `label`, the label wins and the tooltip is dropped, so the visible text stays inside the accessible name.

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

## Column defs

One object per column. Use `id` instead of `accessorKey` only when the cell is computed and there is no row field (duration, size).

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

Keep a column list in the template when it is short and static. Move it to a script const or computed when it is reused or built from a schema. `useResourceMeta` maps `key` → `accessorKey` and `radTitle(key)` → `header`.

## Slots

All `u-table` slots are forwarded.

| Slot | Use |
|------|-----|
| `{accessorKey}-cell` | Custom cell. Bind `{ row }` and read `row.original` |
| `{accessorKey}-header` | Custom header (sort button and filter popover) |
| `empty` | Empty state (`u-empty` or copy) |
| `actions-cell` | Do not set this when `actions` or `extraActions` are passed |

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

Status, role, and type cells use `u-badge`. Dates use `formatDate`. Several visual states use explicit `<template v-if>` / `v-else` badge variants, not nested ternaries.

## Row actions

| Prop | UI | Typical fields |
|------|----|----------------|
| `actions` | Inline icon or labeled buttons | `icon` + `tooltip`, or `label` |
| `extraActions` | Overflow menu | `icon` + `label` (menu items need text) |

Use `actions` for the one or two primary row operations (view, edit, delete). Use `extraActions` for the rest (assign, revoke, copy, archive). A vertical separator is inserted between the two groups automatically.

`actionType` on `actions`:

| `actionType` | UI |
|--------------|----|
| omitted / `'button'` | Inline `u-button` |
| `'split'` | Primary button plus a chevron `u-dropdown-menu` |
| `'separator'` | Vertical rule between button groups |

`warning` is a string or `(row) => string | undefined`, rendered under the button (triangle and text). Split `items` may be an array or `(row) => array`. Each item uses `label` (a value or `(row) => …`) and `onSelect(row)`. Do not put `onClick` on a split item.

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

- Icon-only buttons: `icon` + `tooltip`, no `label`. The tooltip is the accessible name, so never leave it off.
- Menu and text buttons: `label`, and `icon` when it helps.
- Destructive: `color: 'error'`. Emphasized extra action: `color: 'primary'`.
- `{ actionType: 'separator' }` is a lone-key object between visual groups in `actions`.
- `{ actionType: 'split', items, onClick }` is a default click plus overflow choices. Item handlers are `onSelect`.
- `vIf`, `disabled`, `to`, `href`, `label`, `tooltip`, and `warning` take `(row) => …` when they depend on the row.
- Do not put toolbar Create / Refresh on the row. Those belong on the parent `un-card` (`:actions` / `:append-actions`).

`<resource-manager>` prepends custom row actions, then the default Edit and Delete:

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

```js
const itemsPerPage = ref(25);
const currentPage = ref(1);
```

- The default page size is `25` and the default page is `1` when the parent does not bind the models. Bind numbers: `ref(25)` and `ref(1)`. The page-size value must be one of the choices.
- Page-size choices default to 5 / 10 / 25 / 50 / 100. Pass `:items-per-page-items` to replace that list.
- Server lists: `skip = (currentPage - 1) * itemsPerPage`, `limit = itemsPerPage`, `total-items` from the `/count` endpoint.
- Client lists: pass `data` already sliced. `total-items` is the uncut length.
- Reset `currentPage` to `1` when the page size, the filters, or the resource path change.
- After deletes, clamp `currentPage` if it is past the last page.
- `loading` covers both the page request and the count request.

## Layout

Prefer an `un-card` with `fluid-body` so the table and footer are edge to edge:

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

Put Create / Refresh on the card. Put Edit / Delete on the row. Keep `<un-table>` dumb: the current page of rows goes in, and actions and slots come out. Forward cell work through `{key}-cell` and `row.original`.
