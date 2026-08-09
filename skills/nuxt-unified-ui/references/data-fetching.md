# Data fetching (`ufetch` / `useUFetch`)

Prefer host-app unified API helpers (`ufetch`, `useUFetch`) over raw `useFetch` / `useAsyncData` / `$fetch` for app API calls. Formatting rules below are mandatory; wire paths to whatever your app’s API plugin expects (relative paths — do not manually prepend `baseApiUrl`).

Combine with [code-style.md](code-style.md).

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

Rules:

- Name the result `response` (not `result`), unless a more specific name is clearer (`loginResponse`)
- Inline `body` / `query` objects in the options — extract only when large/reused
- `silent: true` — suppress automatic error toast when handling errors locally
- `responseType: 'blob'` — file downloads

### Options order

- Mutations: behavior flags (`silent`, `responseType`) → `method` → `body` → `query` / other
- Reads without `method`/`body`: behavior flags before `query`

### Call wrapping (critical)

Keep `ufetch(url, {` on **one line**. Do not break the URL onto its own line above `{`:

```ts
// ✅
const response = await ufetch(`/api/items/${item.uid}/documents`, {
  silent: true,
});

// ❌
const response = await ufetch(
  `/api/items/${item.uid}/documents`,
  {
    silent: true,
  },
);
```

### After mutation

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

Fail-fast after `ufetch`:

1. Special non-success statuses first when relevant
2. Invalid success → early `return toastError({ ... })`
3. Success path without deep `else` nesting

Prefer direct access on `response` (`response.status`) over optional chaining when the call is expected to return a body.

---

## `useUFetch` (reactive)

For route/param/reactive-driven lists and detail loads:

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

### Wrapping style (critical)

Always format as:

1. `const { ... } = useUFetch(` on the first line
2. URL argument on the next line (string **or** `computed(() => ...)`)
3. Optional options object as a multi-line second argument
4. Closing `);` on its own line

```ts
// ✅ string URL + options
const { data: mediaData, pending: isMediaPending, refresh: refreshMedia } = useUFetch(
  '/api/media',
  {
    query: {
      'sort': '_id:-1',
      'limit': itemsPerPage,
    },
  },
);

// ✅ computed URL only
const { data: patientData, pending: isPatientPending, refresh: refreshPatient } = useUFetch(
  computed(() => `/api/patients/${patientUid.value}`),
);

// ❌ crammed one-liner or URL broken like ufetch's wrong form without the useUFetch indent pattern
```

### Destructuring names

| Key | Convention | Example |
|-----|------------|---------|
| `data` | suffix `Data` | `ordersData`, `flashCardsData` |
| `pending` | `is` + name + `Pending` | `isOrdersPending` |
| `refresh` | prefix `refresh` | `refreshOrders` |

### Spacing between consecutive calls

When several `useUFetch` calls sit in the same section, use **one** blank line between them (not two):

```ts
const { data: mediaData, pending: isMediaPending, refresh: refreshMedia } = useUFetch(
  '/api/media',
  {
    query: {
      'limit': itemsPerPage,
    },
  },
);

const { data: mediaCountData, refresh: refreshMediaCount } = useUFetch(
  '/api/media/count',
);
```

Major section boundaries elsewhere still use double blanks.

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

### Query values

- Refs and computeds are fine inside `query`
- Keep query object multi-line with trailing commas
- Quoted keys are fine when matching API conventions (`'filter'`, `'sort'`)

---

## Do / don’t

**Do**

- Use `ufetch` / `useUFetch` for app API traffic
- Keep `ufetch(url, {` on one line; wrap `useUFetch` with URL on the next line
- Refresh lists before clearing local form state after mutations

**Don’t**

- Reach for raw `$fetch` / `useFetch` for the same app API
- Manually prepend `baseApiUrl`
- Break `useUFetch` destructuring into ad-hoc formatting that hides the URL argument
