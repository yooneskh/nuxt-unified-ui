# Pages and routing

Page shape conventions for Nuxt apps using this stack. Always combine with [code-style.md](code-style.md).

## Page script skeleton

```vue
<script setup>

/* page */

definePageMeta({
  name: 'dashboard.patients.single',
});

useHead({
  title: $t('patients.single.pageTitle'),
});


const route = useRoute();

const patientUid = computed(() => {
  return route.params.patientUid;
});


/* data */

const { data: patientData, pending: isPatientLoading, refresh: refreshPatient } = useUFetch(
  computed(() => `/api/patients/${patientUid.value}`),
);


/* handlers */

async function handleAction() {

  ...

}

</script>


<template>
  <div>

    <h1 class="text-2xl font-semibold">
      {{ $t('patients.single.title') }}
    </h1>

    <!-- content -->

  </div>
</template>
```

## Script ordering (pages)

1. `/* page */` — `definePageMeta`, then `useHead` (head may move below data when title depends on fetched data)
2. Route / params (`useRoute`, reactive param computeds)
3. Domain sections (`/* data */`, forms, etc.) including `useUFetch`
4. Watchers / lifecycle
5. Handlers (`handleXxx`)

## `definePageMeta`

- **Always** set an explicit `name`
- Dot notation: `dashboard.home`, `flash-cards.single`, `authentication.login`
- `layout: 'empty'` for login / full-bleed auth-style pages only
- Never use `layout: false`

```ts
definePageMeta({
  name: 'authentication.login',
  layout: 'empty',
});
```

## Dynamic routes

- Files: `[patientUid].vue`, `[flashCardSlug]/index.vue`
- Params: **camelCase** in brackets and when reading `route.params`
- Keep params **reactive** for async workflows — do not snapshot once into a bare `const`:

```ts
const route = useRoute();

const flashCardSlug = computed(() => {
  return route.params.flashCardSlug;
});
```

## Navigation

Always prefer **named routes**:

```ts
await navigateTo({
  name: 'authentication.account',
});
```

```vue
<nuxt-link
  :to="{
    name: 'flash-cards.single',
    params: {
      flashCardSlug,
    },
  }">
  ...
</nuxt-link>
```

### Navigation in action objects

When an action only navigates, use `to` — not `onClick: () => navigateTo(...)`:

```ts
{
  icon: 'lucide:arrow-left',
  label: 'Back',
  to: {
    name: 'orders.single',
    params: {
      orderUid,
    },
  },
}
```

## Page headings

- Primary title: `h1` with `class="text-2xl font-semibold"` (match local siblings if they consistently differ)
- Subtitle / secondary line: size-based hierarchy (`text-sm` / `text-xs`) — see text-hierarchy rules in [code-style.md](code-style.md)

## Item / tab object property order

For objects in `:items` arrays (tabs, selects, menus):

`value` → `icon` → `label` → other props

```ts
{
  value: 'preview',
  icon: 'lucide:eye',
  label: $t('section.preview'),
}
```
