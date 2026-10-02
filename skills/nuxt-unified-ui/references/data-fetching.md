# Data fetching (`ufetch` / `useUFetch`)

`ufetch` and `useUFetch` come from the companion unified layers. Use them instead of raw `useFetch` / `useAsyncData` / `$fetch` for app API calls. Pass relative paths (`/api/...`) — the API plugin adds the base URL; do not prepend `baseApiUrl` yourself.

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

Inline `body` / `query` objects in the options; extract them only when large or reused.

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

Call `refresh()` **before** resetting local form UI state. Put side effects in dialog button `onClick` when the mutation is launched from a picker (see [dialogs.md](dialogs.md)).

### Response guards

Fail fast after `ufetch`:

1. Special non-success statuses first when relevant
2. Invalid success → early `return toastError({ ... })`
3. Success path without deep `else` nesting

Prefer direct access on `response` (`response.status`) over optional chaining when the call is expected to return a body.

---

## `useUFetch` (reactive)

For route/param/reactive-driven lists and detail loads. Returns `data`, `pending`, and `refresh`:

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

- The URL may be a string or a `computed`; a computed URL refetches when it changes.
- Refs and computeds are fine inside `query`; changes refetch.
- A list page usually pairs the list call with a `/count` call for pagination (see [tables.md](tables.md)).

### Conditional fetching

When the request must wait on a prop/id, prefer a reactive gate (e.g. reactive `method` or `enabled`) over one-shot `immediate: !!prop` evaluated only at mount:

```ts
const { data: itemsData, pending: isItemsPending, refresh: refreshItems } = useUFetch(
  computed(() => `/api/groups/${props.groupUid}/items`),
  {
    method: computed(() => props.groupUid ? 'get' : ''),
  },
);
```

Do **not** use `{ immediate: !!props.groupUid }` when the dependency can appear later.

---

## Do / don’t

**Do**

- Use `ufetch` / `useUFetch` for app API traffic
- Refresh lists before clearing local form state after mutations

**Don’t**

- Reach for raw `$fetch` / `useFetch` for the same app API
- Manually prepend `baseApiUrl`
