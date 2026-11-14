# Unified resources

How a CRUD resource is declared and consumed. Use this when adding or customizing a resource end to end.

A resource is one Mongo collection, a typed schema, and optional field meta. It is registered on the global `app` registry, exposed through a fixed REST file set, and managed in the dashboard with `<resource-manager>`.

| Layer | Role |
|-------|------|
| Nitro plugin (`*-resource.ts`) | `parseSchema` → augment `UnifiedAppRegistry` → `app.foo = { dbo: createUnifiedResourceController(...) }` |
| REST under `server/api/{kebab-plural}/` | Thin handlers calling `handleResource*` |
| Dashboard | Generic `[resourceName]` page, or a dedicated page that wraps `<resource-manager>` with extra actions |

| Context | Shape | Example |
|---------|-------|---------|
| Registry / `dbo` / `handleResource*` `resource` | camelCase plural | `flashCards`, `authorizationRoles`, `users` |
| API folder and URL path | kebab-case plural | `flash-cards`, `authorization-roles`, `users` |
| Dashboard `resourceName` param | same as the API path | `flash-cards` |
| Permissions, when used | `admin.{kebab-plural}.{action}` | `admin.users.list`, `admin.flash-cards.create` |

`useResourceName` derives `resource` (Pascal singular, internal), `resourcePath` (kebab plural, the API path), and `title` / `titlePlural` (display strings).

Pass camelCase or kebab-case to `<resource-manager resource="...">`. Path and title conversion is handled for you. Prefer the name that matches the surrounding context. Dashboard nav uses kebab. A dedicated page often passes camelCase, such as `users`.

## 1. Declare in a server plugin

File: `server/plugins/{name}-resource.ts`.

`parseSchema({ ... })` returns `{ schema, type, inferred }`. `declare global { interface UnifiedAppRegistry { ... } }` types `app.resourceName`. `defineNitroPlugin` assigns `app.resourceName = { dbo: createUnifiedResourceController({ resource, schema, type, meta? }) }`.

```ts

/* responsibility */

// Registers the users resource
// on the unified app registry.


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

Relations and UI meta:

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

Extra non-dbo fields on the registry entry are allowed (for example `app.media.directory` next to `dbo`).

### Schema DSL (`parseSchema`)

Keys are field names. An optional field uses a trailing `?` on the key (`'tags?'`, `'permissions?'`).

| Value | Meaning |
|-------|---------|
| `'string'`, `'number'`, `'boolean'` | Scalars |
| `'string[]'` | String array (tags UI) |
| `'Record<string, string>'` | String map |
| `[{ ...fields }, '[]']` | Array of nested objects (series UI) |

`createUnifiedResourceController` validates create and update with the compiled ArkType `type`, auto-adds `_id`, `createdAt`, and nested `_id`s, and uses `resource` as the Mongo collection name.

### Field `meta`

Drives the schema API, forms, and the table. `GET .../schema` returns schema properties merged with this meta. The client maps that into form fields and columns with `useResourceMeta`.

| Meta | Effect |
|------|--------|
| `resource: 'otherResource'` | Relation: populate, and a form `identifier` of `resource` (or `media` when the target is `media`) |
| `hidden: true` | Omit from form fields |
| `hideInTable: true` | Omit from table columns. Still in forms unless `hidden` |
| `longText: true` | Textarea |
| `enum: [{ label, value }]` | Select |
| `labelFormat: '...'` | Date field |
| `width` | Form field width hint |
| `children: { ... }` | Nested meta for object-array item fields |

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

/* responsibility */

// Lists flash cards
// for admins.


export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'flashCards',
    event,
    permission: 'admin.flash-cards.list',
  });
});
```

- `resource` is the camelCase registry key, not the folder name.
- `permission` is optional. Omit it when the route is open to any caller that already passed other gates, or when auth is handled elsewhere. Prefer a consistent `admin.{kebab}.{action}` when protecting admin CRUD.
- Do not reimplement list, create, or update in the route file. When default CRUD is not enough, add a custom endpoint next to the resource (for example `/api/authentication/onboard-user`).
- List query helpers, handled inside `handleResourceList` and its siblings: `filter`, `select`, `sort`, `skip`, `limit`, `populate`, and `single=true` for a single `find`.

## Singleton

A singleton owns one row of a collection. It finds that row, or creates it through the resource controller and then uses the `_id` on the created document. Callers cannot address another document. The public type is only `schema`, `retrieve`, and `update`. List, count, create, and delete are not on the type and have no routes.

It is one global row. A row per user or tenant stays on a normal resource controller.

Register it like a resource. `dbo` is a `UnifiedSingletonController`. `defaults` must satisfy the schema. They are validated when the controller is created. The first retrieve creates the row from `defaults` when the collection is empty. That `_id` is cached for later retrieve and update calls.

```ts
const { schema, type, inferred } = parseSchema({
  'title': 'string',
});


declare global {
  interface UnifiedAppRegistry {
    site: {
      dbo: UnifiedSingletonController<typeof inferred>
    };
  }
};


export default defineNitroPlugin(() => {
  app.site = {
    dbo: createUnifiedSingletonController({
      resource: 'site',
      schema,
      type,
      defaults: {
        title: 'Khoshghadam',
      },
    }),
  };
});
```

Routes under `server/api/{kebab}/`, with no `[id]` segment:

| File | Handler | Typical permission suffix |
|------|---------|---------------------------|
| `schema.get.ts` | `handleSingletonSchema` | `.schema` |
| `index.get.ts` | `handleSingletonRetrieve` | `.retrieve` |
| `index.patch.ts` | `handleSingletonUpdate` | `.update` |

`GET` returns the row, creating it from `defaults` when it is absent. `PATCH` sends a partial document. `select` and `populate` work on retrieve. A singleton is not a relation target.

`<singleton-manager resource="site" />` loads that `GET`, edits it with the schema form, and `PATCH`es it back. It exposes `refreshSingleton()`.

## 3. Dashboard: standard declaration

One generic page for every standard resource, `pages/dashboard/resources/[resourceName].vue`:

```vue
<script setup>

/* responsibility */

// Manages any standard resource
// named by the route.


/* page */

definePageMeta({
  name: 'dashboard.resources.single',
  layout: 'dashboard',
  middleware: [
    'is-authenticated',
  ],
});


/* params */

const route = useRoute();


const resourceName = computed(() => {
  return route.params.resourceName;
});


/* seo */

useHead({
  title: () => radTitle(resourceName.value),
});

useSeoMeta({
  description: 'Manage resources.',
});

</script>


<template>
  <resource-manager :resource="resourceName" />
</template>
```

Nav links pass the kebab API segment:

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

`<resource-manager>` provides Create and Refresh toolbar actions, the table via `<resource-explorer-table>`, and per-row Edit and Delete dialogs wired to `/api/{resourcePath}`.

## 4. Dashboard: customize

When the default Create or Edit is wrong for the domain, do not overload the generic `[resourceName]` page. Add a dedicated page that still uses `<resource-manager>` and supplies extra actions. Point nav at that named route, not at `dashboard.resources.single`.

Example: `pages/resources/users.vue`, route name `dashboard.resources.users`, `layout: 'dashboard'`, middleware `is-authenticated`. `resource="users"`.

| Prop | Placement | Merge order |
|------|-----------|-------------|
| `actions` | Card toolbar | After the default Create, before Refresh |
| `resourceActions` | Per-row table actions | Before the default Edit and Delete |
| `ref` → `refreshResources()` | After a custom mutation | Call it so the table reloads |

```vue
<script setup>

/* responsibility */

// Manages users with onboarding
// and password reset actions.


/* page */

definePageMeta({
  name: 'dashboard.resources.users',
  layout: 'dashboard',
  middleware: [
    'is-authenticated',
  ],
});


/* seo */

useHead({
  title: 'Users',
});

useSeoMeta({
  description: 'Manage users.',
});


/* users */

const resourceManagerEl = useTemplateRef('resourceManager');


async function handleOnboardUser() {
  await launchFormPickerDialog({
    icon: 'lucide:user-plus',
    title: 'Onboard User',
    fields: [
      {
        key: 'name',
        identifier: 'input',
        label: 'Name',
      },
    ],
    submitButton: {
      label: 'Onboard',
      onClick: async form => {

        await ufetch('/api/authentication/onboard-user', {
          method: 'post',
          body: form,
        });


        await resourceManagerEl.value?.refreshResources();

        toastSuccess({
          title: 'User onboarded',
        });

      },
    },
  });
}

async function handleResetPassword(user) {
  await launchChoicePickerDialog({
    icon: 'lucide:key-round',
    title: 'Reset Password',
    text: `Send a password reset to ${user.name}?`,
    startButtons: [
      {
        icon: 'lucide:check',
        label: 'Reset',
        onClick: async () => {

          await ufetch(`/api/users/${user._id}/reset-password`, {
            method: 'post',
          });


          toastSuccess({
            title: 'Password reset sent',
          });

        },
      },
    ],
  });
}

</script>


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

A custom handler:

1. Opens `launchFormPickerDialog` or `launchChoicePickerDialog` with explicit `fields`.
2. Calls `ufetch` on a domain endpoint, not necessarily the generic resource CRUD.
3. `await resourceManagerEl.value?.refreshResources()`.
4. Shows `toastSuccess` or `toastError`.

Keep the standard REST routes even when the UI is customized. Other tools, and the generic schema and list, still depend on them.

Nav:

```ts
to: {
  name: 'dashboard.resources.users',
},
```

## Checklist: new resource

- [ ] `server/plugins/{name}-resource.ts` — schema, registry, `createUnifiedResourceController`, meta for relations and UI
- [ ] Full `server/api/{kebab-plural}/` route set, with a camelCase `resource` and permissions when the API is admin
- [ ] Dashboard nav to `dashboard.resources.single` with a kebab `resourceName`, or a dedicated page with `actions` / `resource-actions`

## Checklist: new singleton

- [ ] `server/plugins/{name}-resource.ts` — schema, registry, `createUnifiedSingletonController`, `defaults`
- [ ] `schema.get.ts`, `index.get.ts`, and `index.patch.ts` under `server/api/{kebab}/`
- [ ] A page wrapping `<singleton-manager resource="..." />` when it needs a screen
