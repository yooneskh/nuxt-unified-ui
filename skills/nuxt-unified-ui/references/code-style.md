# Nuxt unified code style

Apply this in the style pass ([apply.md](apply.md#style-pass)), to the one `.vue`, `.js`, or `.ts` file you were given. It covers look and shape: whitespace, wrapping, braces, template structure, sectioning, ordering, and naming that affects scanning. It never changes behavior.

When editing an existing file, these rules win. For a choice this document does not cover, match the nearest sibling file.

## Absolute baseline

| Rule | Value |
|------|--------|
| Indentation | 2 spaces |
| Quotes | single quotes `'` |
| Semicolons | use them |
| Trailing commas | always in multi-line literals |
| Vue script tag | `<script setup>` only — never `lang="ts"` |
| Vue script types | no TypeScript annotations; runtime prop types (`String`, `Object`, `Array`, `Boolean`, `Number`, `Function`) |
| Server / util `.ts` | may use TypeScript where the file already does; every other rule still applies |
| Component tags | lowercase kebab-case (`u-button`, `un-card`) — never PascalCase |
| Braces | always for `if` / `else` / `for` / `while` — no brace-less single-liners |
| `else` / `catch` | on their own line after `}` — never `} else {` |
| File start | [One responsibility](#one-responsibility) header on every `.vue`, `.js`, and `.ts` file |
| JS/TS line length | Never wrap a statement only because it is long. Break only where a rule below requires it. Templates follow [Attribute wrapping](#attribute-wrapping-hard-rule) |

## One responsibility

Every `.vue`, `.js`, and `.ts` file does one job. Write that job at the top, before imports and before every other section.

The job is the one reason the file exists. If saying it takes two independent jobs, the place-and-split pass should already have split the file ([apply.md](apply.md#place-and-split-pass)). Write the header for the file's current main job, report that it still needs a split, and do not split or move the file.

Shape, in this order:

1. One blank line
2. The line `/* responsibility */`
3. One blank line
4. The job, as short `//` comments. Several short lines. Not one long line, and not a second `/* */` block
5. Two blank lines
6. The rest of the file

Those two blank lines are the whole gap before the next section comment, import, or statement. Never one, never three.

`.js` / `.ts`: this block is the start of the file. Nothing comes before the leading blank line. Imports, when the file has them, start after step 5.

`.vue`: line 1 is `<script setup>`. The same block is the first thing inside the script. No `/* */` or `//` above `<script setup>`.

The `//` lines name the job. They do not narrate steps, list options, or repeat the file name.

```ts

/* responsibility */

// Issues a session token
// after checking the login payload.


import { join } from 'node:path';
```

```vue
<script setup>

/* responsibility */

// Renders the login form
// and submits credentials.


/* login */
```

## Comments

Do not comment code. Remove every comment that is not one of these:

1. The `/* responsibility */` header and the `//` lines under it that state the file's job. See [One responsibility](#one-responsibility).
2. A `/* section name */` comment that separates logical parts of a `.vue`, `.js`, or `.ts` file. It names a domain, not a declaration kind. See [Sections and declaration groups](#sections-and-declaration-groups).
3. A `//` comment that records a business decision. Keep it only when that decision is not stated anywhere else in the codebase, the docs, or the backend. Search before keeping it. If the comment restates the code, the docs, or the backend, remove it.

Remove HTML comments, JSDoc, TODOs, commented-out code, and any other comment. Then apply the spacing rules to what remains.

## Script layout

### Sections and declaration groups

- Start every logical part of a `.vue`, `.js`, or `.ts` file with `/* section name */`, then one blank line. In a `<script setup>` this is each domain. The comment names a domain (`/* login */`, `/* resource */`), not a declaration kind. Do not add a section only because the declaration kind changes.
- Within a section, group by kind, in order: imports, props / emits / models, refs, computeds, watchers / lifecycle, functions, outlets.
- Two blank lines between different declaration groups.
- Consecutive single-line refs stay together with no blank lines.
- One blank line between consecutive declarations in every other same-kind group (computeds, watchers, functions, consecutive calls such as `useHead` / `useSeoMeta`).
- A multiline statement has one blank line before and after — see [Statement spacing](#statement-spacing).
- Two blank lines between sections.
- One blank line before `</script>`. Two blank lines between `</script>` and `<template>`.

| Common section | Contents |
|----------------|----------|
| `/* interface */` | props, emits, models |
| `/* page */` | `definePageMeta` only |
| `/* params */` | `useRoute` + one computed per `route.params` / `route.query` value |
| `/* seo */` | `useHead` + `useSeoMeta` (+ `useJsonld` when present) |
| domain names | `/* login */`, `/* resource */`, `/* captcha */`, … |
| `/* outlets */` | `defineExpose` |

```ts
/* resource */

import ResourceExplorerCell from '../atoms/resource-explorer-cell.vue';


const itemsPerPage = ref(25);
const currentPage = ref(1);
const sortedColumn = ref('createdAt');
const sortDirection = ref('desc');


const sort = computed(() => {
  return `${sortedColumn.value}:${sortDirection.value}`;
});

const hasResources = computed(() => {
  return !!resourcesData.value?.length;
});


watchImmediate(resourcePath, refreshResources);


function getSortIcon(column) {
  return sortedColumn.value === column ? 'lucide:arrow-down' : 'lucide:arrow-up-down';
}

function refreshAll() {
  refreshResources();
}
```

### Import co-location

Place non-auto-imported imports inside the section that uses them, not in a block at the top of the file:

```ts
/* charts */

import { VisXYContainer, VisLine } from '@unovis/vue';
```

### `atoms` / `libs` imports

Import `atoms` and `libs` with relative paths only (`../atoms/foo.vue`, `../libs/bar`). Rewrite `~/`, `@/`, `#layers/`, or any other alias in this file to the relative path. Never move the file.

### Props / emits / models

```ts
const props = defineProps({
  resource: String,
  items: Array,
  multiple: Boolean,
});

const emit = defineEmits([
  'close',
]);

const captchaId = defineModel('id', {
  type: String,
});
```

- Always assign `defineProps` / `defineEmits` / `defineModel` to a variable.
- `defineProps`: shorthand `name: Type` only — never `{ type: Type, required: true }`.
- `defineEmits`: array of strings, always multi-line (even one event). Empty stays `defineEmits([])`.
- `defineModel` uses `{ type, default? }` (Vue requires the object). That object still follows the multi-line literal rule.

### Script ordering

The `/* responsibility */` header comes first. It is not a domain section.

**Components / dialogs:** `/* interface */`, then domain sections in reading order, then `/* outlets */` (`defineExpose`) if needed.

**Pages:**

1. `/* page */` — `definePageMeta` only
2. `/* params */` — only when the page reads `route.params` or `route.query`
3. Domain sections the SEO block reads (fetches / derived data)
4. `/* seo */`
5. Remaining domain sections
6. Watchers / lifecycle
7. Handlers (`handleXxx`)

**`/* params */`:** `const route = useRoute();`, two blank lines, then one computed per value — `route.params` first, then `route.query` — with one blank line between computeds. Never leave an empty `/* params */` block. If another section needs `route` for something else (for example `route.fullPath`), call `useRoute()` in that section.

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

**`/* seo */`:** directly under the last block it reads — under `/* params */` or a data section when it uses them, otherwise directly under `/* page */`. Never put `useHead` / `useSeoMeta` / `useJsonld` inside `/* page */`. Order: `useHead`, `useSeoMeta`, `useJsonld`, one blank line between calls. Keep `useJsonld(() => !data ? null : {` on one line; the object follows the literal rules.

### Watchers

- Prefer `watchImmediate` over `watch(..., { immediate: true })`.
- Pass function references. No `() => { fn(); }` wrappers.
- Two plain references stay on one line: `watchImmediate(resourcePath, refreshResources);`. When the source is a getter, one argument per line:

```ts
watchImmediate(
  () => props.document?.uid,
  loadPreview,
);
```

Guards go inside the handler so the reference stays clean.

## Statement spacing

In `.js` and `.ts`, including a Vue `<script>`. Templates do not use this section.

A statement is multiline when a wrapping rule splits it across lines (an object or array literal, `useUFetch`, `fn(arg, {`, and the same kind of wrap), or when it is a code block (`if`, `for`, `while`, `try`, a function body, or an arrow body). An object or array literal is not a code block. A connected chain (`if` / `else if` / `else`, or `try` / `catch` / `finally`) is one statement. Its parts stay adjacent. No blank line between them.

A multiline statement has one blank line before it and one after it. Do not pad it when it is the only statement in its parent block. It stays flush with that block's braces.

Inside a `{ ... }` that holds statements:

- One statement: no blank line after `{` or before `}`.
- Several statements, all single-line: no blank line after `{` or before `}`.
- Several statements, and at least one is multiline: one blank line after `{` and one before `}`.

That edge blank is the before-blank of a multiline first statement and the after-blank of a multiline last statement. Do not add a second. A `finally` that only flips one flag is one statement and stays flush.

```ts
const ready = ref(true);

if (ready.value) {
  return;
}

const done = ref(false);
```

```ts
if (ready.value) {

  await save();

  toastSuccess({
    title: 'Saved',
  });

}
```

No blank lines inside a literal. The padding sits around the statement.

```ts
const itemsPerPage = ref(25);
const currentPage = ref(1);

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
];

const sortDirection = ref('desc');
```

| Situation | What to keep |
|-----------|----------------|
| Two multiline statements in a row | One blank line between them |
| Next to a single-line statement | One blank before and after the multiline statement |
| The only statement in a block | Flush, even when that statement is multiline |
| Several statements, all single-line | Flush with the braces |
| Several statements, one of them multiline | One blank after `{` and before `}` |
| Declaration-group boundary, `/* params */` gap, or major-step boundary (already two blanks) | Keep the two |
| First statement after the responsibility header | Keep the header's two |
| Blank already required after `/* section */` | That blank is the before-blank |
| Inside an object or array literal | No blank lines, except a `defineNuxtConfig` object under [Nuxt config](#nuxt-config) |

### Nuxt config

In a `nuxt.config.ts` file, this applies to the object passed to `defineNuxtConfig` and to no other object. A value is an object when it is written as `{ ... }`, including on one line. An array is not an object.

When that object has more than one top-level property, and at least one of those values is an object:

- one blank line after `{`
- one blank line before `}`
- one blank line between each top-level property

Nested objects stay packed. One top-level property stays packed. Several top-level properties whose values are all non-objects stay packed.

```ts
export default defineNuxtConfig({

  compatibilityDate: 'latest',

  devtools: {
    enabled: false,
  },

  modules: [
    '@nuxt/ui',
  ],

});
```

## Function bodies

### Major steps

In an async handler, a multi-step loader, or a non-trivial callback, put two blank lines between the guard or setup and the main work, and between major steps. Keep those two where [Statement spacing](#statement-spacing) only asks for one. Guards are full blocks. The blank after `{` and before `}` comes from statement spacing, not from this section.

```ts
async function handleLogin() {

  if (!loginForm.value.username) {
    return;
  }


  const response = await ufetch('/api/authentication/login', {
    method: 'post',
    body: {
      username: loginForm.value.username,
      password: loginForm.value.password,
    },
  });


  useToken().value = response.token;

  await navigateTo({
    name: 'authentication.account',
  });

}
```

### One statement, or only single-line statements

These stay flush with their braces. A single delegation, a one-line reset, and several single-line statements are the same case.

```ts
async function refreshResources() {
  await resourceExplorerTableEl.value?.refreshResources();
}

async function handleSubmitSelection(items) {
  await props.onSelected?.(items);
  emit('close', items);
}
```

### A chain or a loop that is the whole body

When the body is only one control block (`for`, `while`, `if`, …) or only one connected chain, that is one statement, so the body stays flush. Spacing inside the inner block still follows [Statement spacing](#statement-spacing). When the parent has another statement and one of them is multiline, the parent gets the edge blanks, and a major step still keeps two.

```ts
function fireBumps(bumps) {
  for (const bump of bumps) {
    confetti({
      particleCount: 20,
      origin: {
        x: bump.x,
        y: bump.y,
      },
    });
  }
}

async function saveOrToast() {
  try {
    await save();
  }
  catch {
    toastError({
      title: 'Failed',
    });
  }
}
```

### Return-only decision functions

When the whole job is to choose and return a value from multiple criteria, write one compact `if` / `else if` / `else` chain, flush with the function braces. Use this only when value selection is essentially the whole body. Broader work may use guard clauses and early returns.

```ts
function getSortLabel(column) {
  if (sortedColumn.value !== column) {
    return `Sort ${column} descending`;
  }
  else if (sortDirection.value === 'desc') {
    return `Sort ${column} ascending`;
  }
  else {
    return `Clear ${column} sorting`;
  }
}
```

### `else` / `catch`

`else` and `catch` each start on their own line after `}`.

```ts
if (condition) {
  ...
}
else {
  ...
}
```

## Literals and calls

### Script literals — multi-line unless empty

In script and `.ts` files, object and array literals use one property or element per line and a trailing comma, including a single-property or single-element literal in call args. No blank lines inside a literal, except the `defineNuxtConfig` object in [Nuxt config](#nuxt-config).

```ts
toastSuccess({
  title: 'Saved',
});

await ufetch('/api/authentication/login', {
  method: 'post',
  body: {
    username: loginForm.value.username,
    password: loginForm.value.password,
  },
});
```

### Empty literals

An object or array with no entries is `{}` or `[]` on one line: no newline inside, no trailing comma, no inner spaces. A single entry is not empty and still splits. `defineEmits([])` and similar stay compact.

```ts
const form = {};
const selectedIds = [];
```

### Parameter type literals

The multi-line rule covers object values, not types. An object type written inline as a function parameter type stays on one line, however many members it has:

```ts
export async function launchDialog(options: { component: any, props: any }) {
  ...
}
```

### Call wrapping

Keep `fn(arg, {` on one line and put the options on the following lines. Do not move the first argument onto its own line above `{`.

```ts
const response = await ufetch(`/api/${resourcePath.value}`, {
  method: 'post',
  body: form,
});
```

### Fetch calls

`ufetch` options order: behavior flags (`silent`, `responseType`) → `method` → `body` → `query` / others. For a read without `method` / `body`, behavior flags come before `query`.

`useUFetch` is always this shape:

1. `const { ... } = useUFetch(` on the first line
2. URL argument (string or `computed(() => ...)`) on the next line
3. Optional options object as a multi-line second argument
4. Closing `);` on its own line

Never a one-liner. Consecutive `useUFetch` calls in one section have one blank line between them. Query objects are multi-line. Quoted keys are fine when they match API conventions (`'filter'`, `'sort'`).

```ts
const { data: mediaData, pending: isMediaPending, refresh: refreshMedia } = useUFetch(
  '/api/media',
  {
    query: {
      'sort': '_id:-1',
      'limit': itemsPerPage,
    },
  },
);

const { data: patientData, pending: isPatientPending, refresh: refreshPatient } = useUFetch(
  computed(() => `/api/patients/${patientUid.value}`),
);
```

## Naming

Rename only identifiers declared in this file, and update every use in the file.

| Context | Convention |
|---------|------------|
| Async / UI action handlers | `handleXxx` (`handleLogin`, `handleResourceDelete`) |
| Short sync helpers | no `handle` prefix (`refresh`, `formatDate`) |
| Short `.map` / `.filter` / `.find` (about 3 lines or fewer) | parameter `it`, no parens: `it =>` |
| `for...of` / `v-for` | descriptive names — not `u`, `fo`, `doc` |
| `ufetch` result | `response`, or `xxxResponse` (`loginResponse`) — not `result` |
| `useUFetch` destructure | `data: xxxData`, `pending: isXxxPending`, `refresh: refreshXxx` |
| `computed` returning an array or object | block body and explicit `return` — not `() => [...]` |

```ts
const actions = computed(() => {
  return [
    {
      variant: 'subtle',
      icon: 'lucide:plus',
      label: `Create a ${title.value}`,
      onClick: handleResourceCreate,
    },
  ];
});

items.value.find(it => it.id === selectedId.value);
```

Pass handler references into action objects and watchers (`onClick: handleResourceCreate`). Do not wrap them in `() => handleResourceCreate()` unless the wrapper adapts arguments.

## Object property order

Omit unused properties. Keep the rest in this order:

| Object | Order |
|--------|-------|
| Action objects (`:actions`, `:append-actions`, table row actions) | `vIf` → `actionType` → `variant` → `color` → `icon` → `label` → `trailingIcon` → `tooltip` → `warning` → `disabled` → `to` → `href` → `onClick` → `items` |
| Table column defs | `accessorKey` (or `id`) → `header` → others |
| Tab / select / menu item objects | `value` → `icon` → `label` → others |
| `ufetch` options | see [Fetch calls](#fetch-calls) |

## Template rules

### Structural directives on `<template>`

Put `v-if` / `v-else-if` / `v-else` / `v-for` on a `<template>` wrapper, never on the rendered element.

```vue
<template v-if="captcha">
  <img
    :src="`data:image/png;base64,${captcha.image}`"
    alt="Captcha"
    class="h-14 rounded-md border border-default"
  />
</template>

<template v-for="item in items" :key="item.id">
  <u-badge
    variant="subtle"
    :label="item.name"
  />
</template>
```

### Child spacing (hard rule)

Blank lines inside a tag depend only on how many direct children it has, never on how tall they look.

- Exactly one child: no blank lines. The child starts on the line after the opening tag. The closing tag comes right after the child.
- Two or more children: exactly one blank line after the opening tag, between each pair of children, and before the closing tag. Never two, never zero.
- No children: the tag is self-closing (see [Attribute wrapping](#attribute-wrapping-hard-rule)).

When a split puts `>` at the end of the last attribute line, that line is the opening tag. The blank line goes right below it.

| Child node | Counts as |
|------------|-----------|
| Element / component tag | one child |
| `<template>` wrapper (`v-if`, `v-for`, named or scoped slot) | one child |
| `<slot />` | one child |
| A run of text / interpolation (`Welcome, {{ user.name }}!`) | one child |
| Each branch of a `v-if` / `v-else-if` / `v-else` chain | one child per branch |

A lone `v-if` with no `v-else` is one child and stays flush. Each tag looks only at its own direct children. A single-child parent stays flush even when that child has many children.

```vue
<u-tooltip :text="action.tooltip">
  <u-button
    loading-auto
    v-bind="radOmit(action, [ 'tooltip' ])"
  />
</u-tooltip>

<div class="flex items-center gap-1">

  <template v-if="state === 'complete'">
    <u-badge
      variant="subtle"
      color="success"
      label="Completed"
    />
  </template>

  <template v-else>
    <u-badge
      variant="subtle"
      label="Not Started"
    />
  </template>

  <div class="grow" />

</div>

<p class="text-sm">

  Signed in as {{ userData.name }}

  <u-button
    variant="subtle"
    icon="lucide:log-out"
    @click="handleLogout()"
  />

</p>
```

### Attribute wrapping (hard rule)

- Childless tags are self-closing: `<tag ... />`, never an empty open/close pair (`<div class="grow"></div>`).
- Childless, one single-line attribute: one line (`<u-icon name="lucide:check" />`).
- Childless, more than one attribute, or any multiline attribute: `<tag` on its own line, one attribute per line, `/>` on its own line. Never one line.
- Tags with children: every attribute stays on the same line as the opening tag, whatever the count or length. This includes `u-modal` and structural `<template>` wrappers. Do not split them without a multiline attribute.
- The only split trigger for a tag with children is a multiline attribute: an array, object, or function literal bound to an attribute and spanning lines. Then `<tag` goes on its own line, every attribute gets its own line, and the value is formatted like a JS literal. Do not leave that value on the opening line.
- A reference, call, or scalar (`:field="field"`, `v-bind="radOmit(action, [...])"`, `@click="handleSave()"`) is not a multiline attribute. A single-pair object of scalars (`:ui="{ content: 'max-w-5xl' }"`) stays inline. A multi-key or nested object or array binding is a multiline attribute.

```vue
<u-modal :ui="{ content: 'max-w-5xl' }" scrollable @update:open="!$event && emit('close')">
  ...
</u-modal>

<div
  v-if="show"
  :class="{
    'p-3': !fluidBody,
  }">
  ...
</div>

<u-button
  variant="subtle"
  icon="lucide:refresh-ccw"
  @click="refresh()"
/>
```

### `>` and `/>` placement

- A single-line tag keeps the closer on that line.
- A split tag with children: `>` on the same line as the last attribute, never on its own line.
- A split self-closing tag: `/>` on its own line.
- Always a space before `/>` on a single-line self-closing tag.
- The closing tag of a block component (`</un-card>`, `</u-modal>`) is always on its own line.

### Attribute order

When attributes are on separate lines:

1. Refs / identity: `ref`, `id`, `name`
2. Component visual props: `variant`, `color`, `size`, `icon`, static `label`
3. Static presentation: `class`, `style`
4. Data bindings: `:items`, `:data`, `:placeholder`, `:value`, dynamic `:label`, …
5. `v-model` / `:model-value` / `v-model:*`
6. Navigation / state: `to`, `href`, `block`, `disabled`, `loading`, `loading-auto`, `fluid-body`, `scrollable`, …
7. Events last: `@click`, `@update:*`, …

Shortcuts:

- `img`: `src` / `:src` is always the first attribute, before `ref` and `id`. The rest follow the order above.
- `u-button`: `variant` → `color` → `size` → `icon` → label/value → `trailing-icon` → `block` → `disabled` → `loading-auto` → events
- `u-input` / `u-select*`: `:placeholder`, `:label` → `:loading`, `:disabled` → `:items` → `class` → `v-model` → events
- `un-table`: `:columns` → `class` / `:ui` → `:loading` → `:data` → `hide-pagination` → `:total-items` → `:items-per-page-items` → `:row-to` → `v-model:items-per-page` → `v-model:current-page` → `sticky-actions` → `:actions` → `:extra-actions` → `:meta`. The page-size model always comes before the page model.

### Template bindings

Simple scalars and simple ternaries stay inline. When one condition changes several attributes, labels, icons, or an object binding such as `to`, use sibling `<template v-if>` / `v-else-if` / `v-else` branches with explicit component variants instead of nested ternaries.

### Event handlers

A function bound with `@event` is called explicitly, with its arguments written out. Never pass a bare reference.

| The function receives | Write |
|-----------------------|-------|
| No argument | `@event="handleSave()"` |
| The event's one argument | `@event="handleSelect($event)"` |
| Several event arguments | `@event="(value, index) => handleMove(value, index)"` |

Name arrow parameters after what the event passes.

When converting a bare reference (`@click="handleSave"`), keep what Vue passed. If the function declares parameters, pass the event's arguments (`$event` for one, an arrow for several). If it declares none, call it with `()`. If a component event's argument count is unclear, check its `emits` or docs. If it is still unclear, pass `$event`.

An inline statement that is not a single function call (`@update:page="currentPage = $event"`, `@update:open="!$event && emit('close')"`) stays as it is. This rule covers `@` bindings only. `onClick` in action objects and watcher callbacks still take references (see [Naming](#naming)).

### Default attribute values

Omit a prop that restates a default:

| Component / context | Convention |
|---------------------|------------|
| `un-table` `actions` / `extraActions` objects | omit `variant: 'subtle'` — `un-table` already sets it. Do not add or remove `variant` on any other button or action object. Which variant it uses is a design choice, not formatting |
| `u-badge` | omit `color` for neutral (`undefined` in a ternary, never `color="neutral"`); no `size` |
| `u-tooltip` | do not set `:delay-duration` |

```vue
<u-badge
  variant="subtle"
  :color="item.digital ? 'info' : undefined"
  :label="item.digital ? 'Digital' : 'Physical'"
/>
```

### Text interpolation

Put text and `{{ ... }}` on their own line, never glued to the tags. Static and dynamic text may share a line.

```vue
<h1 class="text-2xl font-semibold">
  Welcome, {{ user.name }}!
</h1>
```

### Root structure

One root node when possible. When several sibling sections are needed, wrap them in one root (`<div class="space-y-3">`). That wrapper follows child spacing like any other tag.

### Refs in templates

Refs unwrap automatically. No `.value` in a template expression or in an object literal bound from the template.

## Server / plain TS files

Same whitespace, brace, literal, and call rules as script blocks, starting with the responsibility header. Prefer `async event =>`, consistent with siblings.

```ts

/* responsibility */

// Creates an authentication token
// after checking the login body.


export default defineEventHandler(async event => {

  await assertRateLimit({
    event,
    limit: 5,
  });


  const body = await assertBody({
    event,
    schema: {
      'username': 'string',
      'password': 'string',
    },
  });


  if (!user) {
    throw createUnauthenticatedError();
  }


  return app.authenticationTokens.dbo.create({
    document: {
      user: user._id,
      token: generateUuid(),
      isActive: true,
    },
  });

});
```

## Checklist before finishing an edit

- [ ] Responsibility header: blank line, `/* responsibility */`, blank line, short `//` lines, two blank lines; in Vue inside `<script setup>`; nothing above it
- [ ] No other comments. Remove HTML comments, JSDoc, TODOs, commented-out code, and any comment that restates the code, the docs, or the backend. Keep a `//` business-decision comment only when a search shows that decision exists nowhere else
- [ ] `<script setup>` without `lang="ts"`; no TS annotations in Vue
- [ ] 2-space indent; single quotes; semicolons; trailing commas in multi-line literals
- [ ] Every domain section starts with `/* section name */` and a blank line; two blank lines between sections; imports co-located
- [ ] Declaration groups: two blanks between groups; single-line refs stacked; one blank between other same-kind declarations
- [ ] Multiline statements (a wrapped statement or a code block) have one blank before and after, unless they are the only statement in their block. Share a required blank. Declaration groups, `/* params */`, and major steps keep two blanks. One statement, or only single-line statements, stays flush. Several statements with a multiline one have one blank after `{` and before `}`
- [ ] Major steps keep two blanks. A return-only decision stays one `if` / `else if` / `else` chain
- [ ] Braces everywhere; `else` / `catch` on their own line
- [ ] Script literals multi-line, except `{}` / `[]`; inline object types of function parameters on one line; no statement wrapped only for length; `fn(arg, {` on one line. A `defineNuxtConfig` with more than one top-level property and at least one object value has one blank after `{`, before `}`, and between each top-level property
- [ ] Page scripts: section order, `/* params */` shape, `/* seo */` placement and call order
- [ ] `useUFetch` shape; `ufetch` options order; destructure names `xxxData` / `isXxxPending` / `refreshXxx`; `response` for `ufetch` results
- [ ] `handleXxx` handlers; `it` for short callbacks; descriptive loop names; structure-returning computeds use a block and `return`; handler references, not wrappers
- [ ] Action / column / item object property order
- [ ] Kebab-case component tags; `v-if` / `v-for` on `<template>` wrappers
- [ ] Child spacing: one child flush; two or more children with exactly one blank after the opener, between children, and before the closer (each branch counts)
- [ ] Attribute wrapping: tags with children stay one line unless a multiline attribute forces a split; childless tags self-close and split when they have more than one attribute; `>` / `/>` placement
- [ ] Attribute order; redundant defaults omitted (`un-table` action `variant`, neutral `u-badge` color, `u-tooltip` delay)
- [ ] `@event` bindings call their function: `fn()`, `fn($event)`, or `(a, b) => fn(a, b)`; no bare references; non-call inline statements stay
- [ ] Text / `{{ }}` on its own line; template refs have no `.value`
- [ ] `atoms` / `libs` imports relative; file not moved
- [ ] No behavior change
