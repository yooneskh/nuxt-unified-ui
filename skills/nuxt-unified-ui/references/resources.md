# Unified resources

How CRUD **resources** are declared and consumed in apps built on this stack. Use this whenever adding or customizing a resource end-to-end.

## Mental model

A resource is one Mongo collection + typed schema + optional field meta, registered on a global `app` registry, exposed through a fixed REST file set, and managed in the dashboard via `<resource-manager>`.

| Layer | Role |
|-------|------|
| Nitro plugin (`*-resource.ts`) | `parseSchema` → augment `UnifiedAppRegistry` → `app.foo = { dbo: createUnifiedResourceController(...) }` |
| REST under `server/api/{kebab-plural}/` | Thin handlers calling `handleResource*` |
| Dashboard | Generic `[resourceName]` page, or a dedicated page wrapping `<resource-manager>` with extra actions |

Naming:

| Context | Shape | Example |
|---------|-------|---------|
| Registry / `dbo` / `handleResource*` `resource` | camelCase plural | `flashCards`, `authorizationRoles`, `users` |
| API folder + URL path | kebab-case plural | `flash-cards`, `authorization-roles`, `users` |
| Dashboard `resourceName` param | same as API path | `flash-cards` |
| Permissions (when used) | `admin.{kebab-plural}.{action}` | `admin.users.list`, `admin.flash-cards.create` |

Client helpers (`useResourceName`) derive:

- `resource` → Pascal singular (internal)
- `resourcePath` → kebab plural (API)
- `title` / `titlePlural` → display strings

Pass either camelCase or kebab-case into `<resource-manager resource="...">`; path/title conversion is handled for you. Prefer the name that matches the surrounding context (dashboard nav uses kebab; dedicated pages often pass camel like `users`).

---

## 1. Declare in a server plugin

File: `server/plugins/{name}-resource.ts`

Pattern:

1. Two leading blank lines (no imports) **or** imports flush at line 1 — see [code-style.md](code-style.md).
2. `parseSchema({ ... })` → `{ schema, type, inferred }`.
3. `declare global { interface UnifiedAppRegistry { ... } }` so `app.resourceName` is typed.
4. `defineNitroPlugin` assigns `app.resourceName = { dbo: createUnifiedResourceController({ resource, schema, type, meta? }) }`.

Minimal example:

```ts


const { schema, type, inferred } = parseSchema({
  'name': 'string',
  'username': 'string',
});


declare global {
  interface UnifiedAppRegistry {
    users: {
      dbo: UnifiedResourceController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.users = {
    dbo: createUnifiedResourceController({
      resource: 'users',
      schema,
      type,
    }),
  };
});
```

With relations and UI meta:

```ts
createUnifiedResourceController({
  resource: 'flashCards',
  schema,
  type,
  meta: {
    owner: {
      resource: 'users',
    },
    category: {
      resource: 'flashCardCategories',
    },
    description: {
      hideInTable: true,
    },
    cards: {
      children: {
        backText: {
          longText: true,
        },
      },
    },
  },
});
```

Extra non-dbo fields on the registry entry are allowed (e.g. `app.media.directory` alongside `dbo`).

### Schema DSL (`parseSchema`)

Keys are field names; optional fields use a trailing `?` in the key (`'tags?'`, `'permissions?'`).

Common value shapes:

| Value | Meaning |
|-------|---------|
| `'string'`, `'number'`, `'boolean'` | Scalars |
| `'string[]'` | String array (tags UI) |
| `'Record<string, string>'` | String map |
| `[{ ...fields }, '[]']` | Array of nested objects (series UI) |

`createUnifiedResourceController` validates create/update with the compiled ArkType `type`, auto-adds `_id` / `createdAt` / nested `_id`s, and uses `resource` as the Mongo collection name.

### Field `meta` (drives schema API + forms + table)

| Meta | Effect |
|------|--------|
| `resource: 'otherResource'` | Relation: populate + form `identifier: 'resource'` (or `media` when target is `media`) |
| `hidden: true` | Omit from form fields |
| `hideInTable: true` | Omit from table columns (still in forms unless `hidden`) |
| `longText: true` | Textarea |
| `enum: [{ label, value }]` | Select |
| `labelFormat: '...'` | Date field |
| `width` | Form field width hint |
| `children: { ... }` | Nested meta for object-array item fields |

`GET .../schema` returns schema properties merged with this meta; the client maps that into form fields and columns via `useResourceMeta`.

---

## 2. Standard REST routes

For each resource, add the full set under `server/api/{kebab-plural}/`:

| File | Handler | Typical permission suffix |
|------|---------|---------------------------|
| `schema.get.ts` | `handleResourceSchema` | `.schema` |
| `index.get.ts` | `handleResourceList` | `.list` |
| `index.post.ts` | `handleResourceCreate` | `.create` |
| `count.get.ts` | `handleResourceCount` | `.count` |
| `[resourceId].get.ts` | `handleResourceRetrieve` | `.retrieve` |
| `[resourceId].patch.ts` | `handleResourceUpdate` | `.update` |
| `[resourceId].delete.ts` | `handleResourceDelete` | `.delete` |

Every file is a thin wrapper:

```ts


export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'flashCards',
    event,
    permission: 'admin.flash-cards.list',
  });
});
```

Rules:

- `resource` is always the **camelCase registry key**, not the folder name.
- `permission` is optional; omit when the route is open to any caller that already passed other gates, or when auth is handled elsewhere. Prefer consistent `admin.{kebab}.{action}` when protecting admin CRUD.
- Do not reimplement list/create/update logic in route files — extend via custom endpoints next to the resource (e.g. `/api/authentication/onboard-user`) when the default CRUD is not enough.

List query helpers (handled inside `handleResourceList` / siblings): `filter`, `select`, `sort`, `skip`, `limit`, `populate`, and `single=xtruex` for a single `find`.

---

## 3. Dashboard: standard declaration

Generic page (one page for all standard resources):

```vue
<!-- pages/dashboard/resources/[resourceName].vue -->
definePageMeta({
  name: 'dashboard.resources.single',
  layout: 'dashboard',
  middleware: ['is-authenticated'],
});

// template
<resource-manager :resource="resourceName" />
```

Nav links pass the **kebab API segment**:

```ts
{
  label: 'Flash Cards',
  to: {
    name: 'dashboard.resources.single',
    params: {
      resourceName: 'flash-cards',
    },
  },
},
```

`<resource-manager>` provides Create / Refresh toolbar actions, table via `<resource-explorer-table>`, and per-row Edit / Delete dialogs wired to `/api/{resourcePath}`.

---

## 4. Dashboard: customize (users pattern)

When default Create/Edit is wrong for the domain, **do not** overload the generic `[resourceName]` page. Add a dedicated page that still uses `<resource-manager>` but supplies extra actions.

Example: `pages/resources/users.vue` (named route, not necessarily under `dashboard/resources/`):

```vue
definePageMeta({
  name: 'dashboard.resources.users',
  layout: 'dashboard',
  middleware: ['is-authenticated'],
});


const resourceManagerEl = useTemplateRef('resourceManager');


// custom handlers → domain APIs (onboard, reset-password, …)


<template>
  <resource-manager
    ref="resourceManager"
    resource="users"
    :actions="[
      {
        variant: 'subtle',
        icon: 'lucide:user-plus',
        label: 'Onboard User',
        onClick: handleOnboardUser,
      },
    ]"
    :resource-actions="[
      {
        icon: 'lucide:key-round',
        tooltip: 'Reset Password',
        onClick: handleResetPassword,
      },
    ]"
  />
</template>
```

Customization knobs on `<resource-manager>`:

| Prop | Placement | Merge order |
|------|-----------|-------------|
| `actions` | Card toolbar | After default **Create**, before **Refresh** |
| `resourceActions` | Per-row table actions | Before default **Edit** / **Delete** |
| `ref` → `refreshResources()` | After custom mutations | Call so the table reloads |

Point nav at the custom named route instead of `dashboard.resources.single`:

```ts
to: {
  name: 'dashboard.resources.users',
},
```

Custom handlers typically:

1. `launchFormPickerDialog` / `launchChoicePickerDialog` with explicit `fields`
2. `ufetch` to a **domain** endpoint (not necessarily the generic resource CRUD)
3. `await resourceManagerEl.value?.refreshResources()`
4. `toastSuccess` / `toastError`

Keep the standard REST resource routes even when the UI is customized — other tools and the generic schema/list still depend on them.

---

## Checklist: new resource

- [ ] `server/plugins/{name}-resource.ts` — schema, registry, `createUnifiedResourceController`, meta for relations/UI
- [ ] Full `server/api/{kebab-plural}/` route set with camelCase `resource` (+ permissions if admin)
- [ ] Dashboard: nav → `dashboard.resources.single` + kebab `resourceName`, **or** dedicated page + `actions` / `resource-actions`
- [ ] Follow [code-style.md](code-style.md) (including file-start blank lines)
