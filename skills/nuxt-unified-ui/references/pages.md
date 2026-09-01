# Pages and routing

Page shape conventions for Nuxt apps using this stack. Always combine with [code-style.md](code-style.md).

## Page script skeleton

```vue
<script setup>

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

A page with no dynamic params and no fetched SEO fields puts `/* seo */` directly under `/* page */`.

## Script ordering (pages)

1. `/* page */` — only `definePageMeta`
2. `/* params */` — only when the page has dynamic `route.params` (see Page params)
3. Domain sections the SEO block needs (`useUFetch`, derived data, …)
4. `/* seo */` — required on every page (see Page SEO)
5. Remaining domain sections (forms, sessions, UI state, …)
6. Watchers / lifecycle
7. Handlers (`handleXxx`)

Do **not** put `useHead` / `useSeoMeta` / `useJsonld` inside `/* page */`. Those belong in `/* seo */`.

## Page params

If a page has a dynamic param (`route.params`), add a `/* params */` block **immediately under** `/* page */`.

1. Declare `const route = useRoute();`
2. Two blank lines
3. One `computed` per param — keep it reactive; do not snapshot into a bare `const`

```ts
/* params */

const route = useRoute();


const flashCardSlug = computed(() => {
  return route.params.flashCardSlug;
});
```

Consecutive param computeds: **one** blank line between them. `route.query` values the page reads go in the same block, as extra computeds after the `route.params` computeds:

```ts
/* params */

const route = useRoute();


const flashCardSlug = computed(() => {
  return route.params.flashCardSlug;
});

const journeySlug = computed(() => {
  return route.query.journey;
});
```

- Files: `[patientUid].vue`, `[flashCardSlug]/index.vue`
- Params: **camelCase** in brackets and when reading `route.params`
- Omit `/* params */` entirely on pages with no dynamic route params — do not create an empty block, and do not call `useRoute()` only to leave it unused (call it later in a domain section if something else needs `route`)

## Page SEO

Every page **must** have a `/* seo */` block.

**Placement**

1. Default: directly under `/* page */`
2. If the page has `/* params */`: under `/* params */`
3. If `/* seo */` needs data from any other block: under **that** block (after the fetch / derived computeds), not above it

Blocks that SEO does not read (sessions, local UI state, handlers) stay **below** `/* seo */`.

**Contents (in this order, one blank line between calls)**

1. `useHead({ title })` — required
2. `useSeoMeta({ description })` — required
3. `useJsonld(() => …)` — only when the project has `nuxt-jsonld` set up (`package.json` / `nuxt.config` modules), and only on public indexable pages. Skip it on `noindex` / dashboard / auth pages.

Static strings when the copy is fixed; getters when the value comes from fetched data (`() => flashCardData.value?.name`). Optional chaining is fine on title/description getters.

```ts
/* seo */

useHead({
  title: 'Flash Cards',
});

useSeoMeta({
  description: 'Browse free flash card decks for practice and study.',
});
```

```ts
/* seo */

useHead({
  title: () => flashCardData.value?.name,
});

useSeoMeta({
  description: () => flashCardData.value?.description,
});
```

**`useJsonld` data guard**

When JSON-LD is included, inline the schema in the page (no shared `makeXxxJsonld` helpers). Guard absent data with a ternary — return `null` so no tag is emitted; do **not** replace this guard with optional chaining inside the object:

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

Keep `useJsonld(() => !data ? null : {` on **one line**. Object properties follow the usual multi-line literal rules. `data` is the fetched document or list the schema reads.

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
