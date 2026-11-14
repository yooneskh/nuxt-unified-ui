# Pages and routing

What every page in this stack contains, and how it navigates.

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

- Always set an explicit `name`.
- Dot notation: `dashboard.home`, `flash-cards.single`, `authentication.login`.
- `layout: 'empty'` for login and other full-bleed auth pages only.
- Never use `layout: false`.

```ts
definePageMeta({
  name: 'authentication.login',
  layout: 'empty',
});
```

## Page params

- Files: `[patientUid].vue`, `[flashCardSlug]/index.vue`.
- Params are camelCase in the brackets and when reading `route.params`.
- Query keys stay as they appear on the URL. The variable name is camelCase (`returnUrl` for `returnUrl`).
- Read every param and query value through its own `computed`. Do not snapshot `route.params.x` into a bare `const`.

## Page SEO

Every page sets SEO:

1. `useHead({ title })` — required
2. `useSeoMeta({ description })` — required
3. `useJsonld(() => …)` — only when the project has `nuxt-jsonld` (`package.json` or `nuxt.config` modules), and only on public indexable pages. Skip it on `noindex`, dashboard, and auth pages.

Use a static string when the copy is fixed. Use a getter when the value comes from fetched data (`() => flashCardData.value?.name`). Optional chaining is fine on title and description getters.

```ts
useHead({
  title: 'Flash Cards',
});

useSeoMeta({
  description: 'Browse free flash card decks for practice and study.',
});
```

When JSON-LD is included, inline the schema in the page. No shared `makeXxxJsonld` helper. Guard absent data with a ternary that returns `null`, so no tag is emitted. Do not replace that guard with optional chaining inside the object:

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

Prefer named routes:

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

When an action only navigates, use `to`. Do not use `onClick: () => navigateTo(...)`.

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

- Primary title: `h1` with `class="text-2xl font-semibold"`. Match local siblings when they consistently differ.
- A subtitle or secondary line uses a smaller size, `text-sm` or `text-xs`, rather than another heading weight.
