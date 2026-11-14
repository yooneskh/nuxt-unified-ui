# Data fetching (`ufetch` / `useUFetch`)

`ufetch` and `useUFetch` come from the companion unified layers. Use them instead of raw `useFetch` / `useAsyncData` / `$fetch` for app API calls. Pass relative paths (`/api/...`). The API plugin adds the base URL. Do not prepend `baseApiUrl`.

## `ufetch` (imperative)

One-off requests (submit, delete, button click):

```ts
const response = await ufetch(`/api/resources/${id}`, {
  silent: true,
  method: 'post',
  body: {
    field: value,
  },
});
```

Options beyond the usual `method` / `body` / `query`:

- `silent: true` — suppress the automatic error toast when you handle errors locally
- `responseType: 'blob'` — file downloads

Inline `body` / `query` objects in the options. Extract them only when they are large or reused.

### After a mutation

```ts
const response = await ufetch(url, {
  method: 'post',
  body: {
    field: value,
  },
});


await refresh();

toastSuccess({
  title: 'Created successfully.',
});

formValue.value = '';
```

Call `refresh()` before resetting local form UI state. When the mutation is launched from a picker, put the side effects in the dialog button `onClick` (see [dialogs.md](dialogs.md)).

### Response guards

Fail fast after `ufetch`:

1. Special non-success statuses first, when they matter
2. Invalid success → early `return toastError({ ... })`
3. Success path, without a deep `else`

Prefer direct access on `response` (`response.status`) over optional chaining when the call is expected to return a body.

## `useUFetch` (reactive)

For route, param, and reactive list or detail loads. Returns `data`, `pending`, and `refresh`:

```ts
const { data: ordersData, pending: isOrdersPending, refresh: refreshOrders } = useUFetch(
  computed(() => `/api/patients/${patientUid.value}/orders`),
  {
    query: {
      page: computed(() => currentPage.value - 1),
      limit: itemsPerPage,
      search: searchTerm,
    },
  },
);
```

- The URL may be a string or a `computed`. A computed URL refetches when it changes.
- Refs and computeds inside `query` refetch on change.
- A list page usually pairs the list call with a `/count` call for pagination (see [tables.md](tables.md)).

### Conditional fetching

When the request must wait on a prop or id, prefer a reactive gate (a reactive `method` or `enabled`) over a one-shot `immediate` value captured at mount:

```ts
const { data: itemsData, pending: isItemsPending, refresh: refreshItems } = useUFetch(
  computed(() => `/api/groups/${props.groupUid}/items`),
  {
    method: computed(() => props.groupUid ? 'get' : ''),
  },
);
```

Do not use `{ immediate: !!props.groupUid }` when the dependency can appear later.
