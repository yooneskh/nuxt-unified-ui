# Pages and routing

What every page in this stack contains and how it navigates.

## Page skeleton

```vue
<script setup>

/* responsibility */

// Shows one patient
// and the actions for that record.

/* page */

definePageMeta({
  name: 'dashboard.patients.single',
});


/* params */

const route = useRoute();


const patientUid = computed(() => {
  return route.params.patientUid;
});


/* data */

const { data: patientData, pending: isPatientPending, refresh: refreshPatient } = useUFetch(
  computed(() => `/api/patients/${patientUid.value}`),
);


/* seo */

useHead({
  title: () => patientData.value?.name,
});

useSeoMeta({
  description: () => patientData.value?.description,
});


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

## Page params

- Files: `[patientUid].vue`, `[flashCardSlug]/index.vue`
- Params: **camelCase** in brackets and when reading `route.params`
- Query keys stay as they appear on the URL; the variable name is camelCase (`returnUrl` for `returnUrl`)
- Read every param and query value through its own `computed` so it stays reactive; do not snapshot `route.params.x` into a bare `const`

## Page SEO

Every page **must** set SEO:

1. `useHead({ title })` — required
2. `useSeoMeta({ description })` — required
3. `useJsonld(() => …)` — only when the project has `nuxt-jsonld` set up (`package.json` / `nuxt.config` modules), and only on public indexable pages. Skip it on `noindex` / dashboard / auth pages.

Use static strings when the copy is fixed and getters when the value comes from fetched data (`() => flashCardData.value?.name`). Optional chaining is fine on title/description getters.

```ts
useHead({
  title: 'Flash Cards',
});

useSeoMeta({
  description: 'Browse free flash card decks for practice and study.',
});
```

**`useJsonld` data guard**

When JSON-LD is included, inline the schema in the page (no shared `makeXxxJsonld` helpers). Guard absent data with a ternary that returns `null` so no tag is emitted; do **not** replace this guard with optional chaining inside the object:

```ts
useJsonld(() => !flashCardData.value ? null : {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LearningResource',
      'name': flashCardData.value.name,
      'url': `https://khoshghadam.com/flash-cards/${flashCardData.value.slug}`,
    },
  ],
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
  variant: 'subtle',
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
- Subtitle / secondary line: a smaller size, `text-sm` or `text-xs`, rather than another heading weight
