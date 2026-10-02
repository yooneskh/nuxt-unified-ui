# Nuxt unified code style

You apply this document in the style pass of the per-file subagent ([apply.md](apply.md#per-file-subagent)), to the one `.vue`, `.js`, or `.ts` file you were given. It covers the **look and shape** of code — whitespace, wrapping, braces, template structure, sectioning, ordering, and naming that affects scanning. It never changes behavior.

When editing an existing file, the rules here always win. For choices not covered (rare quote/semicolon drift), match the nearest sibling file.

---

## Principles

Write code so a reader can **scan vertically** and see structure before details.

1. **Sections contain declaration-kind groups** — see [Sections and declaration groups](#sections-and-declaration-groups).
2. **Function body spacing follows the work** — see [Function bodies](#function-bodies).
3. **One idea per line in structured data** — see [Literals and calls](#literals-and-calls).
4. **Templates stay single-line unless a multiline attribute — or a childless multi-attribute tag — forces a split** — see [Attribute wrapping](#attribute-wrapping-hard-rule).
5. **Blank lines in templates count children, not size** — see [Child spacing](#child-spacing-hard-rule).
6. **Section comments are the map**; imports sit in the section that needs them.
7. **Names match role** — see [Naming](#naming).
8. **Vue scripts stay runtime-shaped**: `<script setup>` without TypeScript, matching the Nuxt UI / unified-ui codebase.
9. **One file, one responsibility** — see [One responsibility](#one-responsibility).

---

## Absolute baseline

| Rule | Value |
|------|--------|
| Indentation | 2 spaces |
| Quotes | single quotes `'` |
| Semicolons | use them |
| Trailing commas | always in multi-line literals |
| Vue script tag | `<script setup>` only — **never** `lang="ts"` |
| Vue script types | **no** TypeScript annotations; use runtime prop types (`String`, `Object`, `Array`, `Boolean`, `Number`, `Function`) |
| Server / util `.ts` | may use TypeScript where the file already does; all other rules still apply |
| Component tags | lowercase kebab-case (`u-button`, `un-card`) — never PascalCase |
| Braces | always for `if` / `else` / `for` / `while` — no brace-less single-liners |
| `else` / `catch` | on their **own line** after `}` |
| File start | [One responsibility](#one-responsibility) header on every `.vue`, `.js`, and `.ts` file |
| JS/TS line length | **Never wrap a statement only because it is long.** Break lines only where a rule below requires it. Templates follow [Attribute wrapping](#attribute-wrapping-hard-rule) |

---

## One responsibility

Every `.vue`, `.js`, and `.ts` file does **one** job. Write that job at the top, before imports and before every other section.

The job is the one reason the file exists. If saying it takes two independent jobs, the file is two files: report a `split` follow-up (see [apply.md](apply.md#per-file-subagent)) and write the header for the file's current main job.

Shape, in this order:

1. One blank line
2. The line `/* responsibility */`
3. One blank line
4. The job, as short `//` comments. Use several short lines. Do not write one long line, and do not put the job in a second `/* */` block
5. **Two** blank lines
6. The rest of the file

Those two blank lines are the whole gap between the header and what follows — whether that is a section comment, an import, or the first statement. Never one, never three.

`.js` / `.ts`: this block is the start of the file. Nothing comes before the leading blank line. Imports, when the file has them, start after step 5.

`.vue`: line 1 is `<script setup>`. The same block is the first thing inside the script. Do not put `/* */` or `//` above `<script setup>`.

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

```ts
// ❌ imports above the header, or no header
import { join } from 'node:path';
```

```vue
<!-- ❌ comments above the script tag -->

/* responsibility */

<script setup>
```

```ts
// ❌ only one blank line under the // lines

/* responsibility */

// Issues a session token
// after checking the login payload.

import { join } from 'node:path';
```

The `//` lines name the job. They do not narrate steps, list options, or repeat the file name.

---

## Script layout

### Sections and declaration groups

- Start every logical `<script setup>` domain with `/* section name */`, followed by one blank line. The comment names a logical domain (`/* login */`, `/* resource */`), not a declaration kind. Do not add a section only because the declaration kind changes.
- Within a section, group declarations by kind, in this order: imports, props / emits / models, refs, computeds, watchers / lifecycle, functions, outlets.
- **Two blank lines** between different declaration groups.
- Consecutive **single-line** refs stay together with **no blank lines**.
- **One blank line** between consecutive declarations in every other same-kind group (computeds, watchers, functions, consecutive calls such as `useHead` / `useSeoMeta`).
- A multiline assignment is isolated with one blank line before and after — see [Multiline assignment isolation](#multiline-assignment-isolation).
- Sections are separated by two blank lines.
- Blank line before `</script>`; **two** blank lines between `</script>` and `<template>`.

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

Place non-auto-imported imports **inside the section that uses them**, not hoisted in a block at the top of the file:

```ts
/* charts */

import { VisXYContainer, VisLine } from '@unovis/vue';
```

### `atoms` / `libs` imports

Import `atoms` and `libs` with relative paths only (`../atoms/foo.vue`, `../libs/bar`). Rewrite `~/`, `@/`, `#layers/`, or other aliases in this file to the relative path. Never move the file.

```ts
// ✅
import ResourceExplorerCell from '../atoms/resource-explorer-cell.vue';
import { formatColumn } from '../libs/format-column';

// ❌
import ResourceExplorerCell from '~/atoms/resource-explorer-cell.vue';
```

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

- Always assign `defineProps` / `defineEmits` / `defineModel` to a variable
- `defineProps`: shorthand `name: Type` only — never `{ type: Type, required: true }`
- `defineEmits`: array of strings, **always multi-line** (even one event); empty stays `defineEmits([])`
- `defineModel` uses `{ type, default? }` (required by Vue) — that object still follows the multi-line literal rule

### Script ordering

The `/* responsibility */` header comes first in both lists. It is not a domain section.

**Components / dialogs**

1. `/* interface */`
2. Domain sections in reading order
3. `/* outlets */` (`defineExpose`) if needed

**Pages**

1. `/* page */` — `definePageMeta` only
2. `/* params */` — only when the page reads `route.params` or `route.query`
3. Domain sections the SEO block reads (fetches / derived data)
4. `/* seo */`
5. Remaining domain sections
6. Watchers / lifecycle
7. Handlers (`handleXxx`)

**`/* params */` block**: `const route = useRoute();`, two blank lines, then one computed per value — `route.params` first, then `route.query` — with one blank line between computeds. Never leave an empty `/* params */` block; if another section needs `route` for something else (e.g. `route.fullPath`), call `useRoute()` in that section.

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

**`/* seo */` block**: sits directly under the last block it reads — under `/* params */` or a data section when it uses them, otherwise directly under `/* page */`. Never put `useHead` / `useSeoMeta` / `useJsonld` inside `/* page */`. Order: `useHead`, `useSeoMeta`, `useJsonld`, one blank line between calls. Keep `useJsonld(() => !data ? null : {` on **one line**; the object follows the literal rules.

### Watchers

- Prefer `watchImmediate` over `watch(..., { immediate: true })`
- Pass function **references** directly — no `() => { fn(); }` wrappers
- Two plain references stay on one line (`watchImmediate(resourcePath, refreshResources);`). When the source is a getter function, put one argument per line:

```ts
watchImmediate(
  () => props.document?.uid,
  loadPreview,
);
```

Guards go **inside** the handler function so the reference stays clean.

---

## Function bodies

### Non-trivial workflow functions

Async handlers, multi-step loaders, and non-trivial callbacks:

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

- Blank line after opening `{`
- Guards as full blocks
- Double blank between guard/setup and main work, and between major steps
- Blank line before closing `}`

### Tiny functions stay tight

No decorative blanks when the body is a single delegation or a one-line reset. Same for a `finally` that only flips one flag.

```ts
async function refreshResources() {
  await resourceExplorerTableEl.value?.refreshResources();
}

async function handleSubmitSelection(items) {
  await props.onSelected?.(items);
  emit('close', items);
}
```

### Single-block functions stay flush

When a function body is **only** one control block (`for`, `while`, `if`, …) or **only** one connected chain (`if` / `else if` / `else`, or `try` / `catch` / `finally`), put no blank lines before or after that block. The parts of a connected chain are always adjacent, so the whole chain counts as one block.

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

```ts
// ❌ breathing-room blanks around a lone block
function fireBumps(bumps) {

  for (const bump of bumps) {
    ...
  }

}
```

If the function has **any other statement** besides that one block (a guard plus a loop, setup then a `for`, two separate `if`s, …), use workflow spacing instead. Spacing *inside* the block still follows the other rules.

### Return-only decision functions

When a function's whole job is to choose and return a value from multiple criteria, write the decision as one compact `if` / `else if` / `else` chain, flush with the function braces:

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

Use this only when value selection is essentially the whole body. Functions that do broader work may use guard clauses and early returns.

### `else` / `catch`

```ts
if (condition) {
  ...
}
else {
  ...
}
```

```ts
// ❌
if (condition) {
  ...
} else {
  ...
}
```

---

## Literals and calls

### Script literals — multi-line unless empty

In script and `.ts` files, object and array literals use one property / element per line and a trailing comma — **including single-property / single-element literals** in call args:

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

```ts
// ❌
toastSuccess({ title: 'Saved' });
```

No blank lines **inside** a literal.

### Empty literals

An object or array with **no** entries is always `{}` or `[]` on one line — no newline inside, no trailing comma, no inner spaces. A single entry is not empty and still splits. `defineEmits([])` and similar stay compact.

```ts
const form = {};
const selectedIds = [];

// ❌
const form = {
};
```

### Multiline assignment isolation

A **multiline assignment** is any `const` / `let` / `var` / `export const` declaration, or any `=` reassignment, whose statement spans more than one line (usually a multi-line object, array, call, or destructure: `useUFetch`, `computed(() => { … })`, `defineProps({ … })`, …).

Isolate it with **exactly one** blank line before and **exactly one** after. Calls and returns that span lines (`await navigateTo({ … })`, `toastSuccess({ … })`, `return { … }`) are not assignments and get no padding from this rule.

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

```ts
// ❌ flush against neighbors
const currentPage = ref(1);
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
];
const sortDirection = ref('desc');

// ❌ two blank lines just because the assignment is multiline
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
];


const sortDirection = ref('desc');
```

How this combines with other spacing:

| Situation | What to keep |
|-----------|----------------|
| Two multiline assignments in a row | **One** blank line between them |
| Next to a single-line statement (including consecutive refs) | Isolation **wins**: one blank before and after |
| First statement after a function `{` that already wants a blank, or last before a `}` that wants one | **Share** that blank — do not add a second |
| Declaration-group or major-step boundary (already **two** blanks) | Keep the **two** |
| First statement right after the responsibility header | Keep the header's **two** |
| Blank already required after `/* section */` | That blank **is** the before-blank |
| Single-line assignment, including `{}` / `[]` | Not multiline — no isolation |
| Tiny / single-block function whose only statement is the assignment | Stay **flush** with the braces |

### Call wrapping

Keep `fn(arg, {` on one line and put the options on the following lines. Do not move the first argument onto its own line above `{`.

```ts
// ✅
const response = await ufetch(`/api/${resourcePath.value}`, {
  method: 'post',
  body: form,
});

// ❌
const response = await ufetch(
  `/api/${resourcePath.value}`,
  {
    method: 'post',
    body: form,
  },
);
```

### Fetch calls

**`ufetch` options order**: behavior flags (`silent`, `responseType`) → `method` → `body` → `query` / others. For reads without `method` / `body`, behavior flags come before `query`.

**`useUFetch` shape** — always:

1. `const { ... } = useUFetch(` on the first line
2. URL argument (string or `computed(() => ...)`) on the next line
3. Optional options object as a multi-line second argument
4. Closing `);` on its own line

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

```ts
// ❌ one-liner
const { data: patientData } = useUFetch(`/api/patients/${patientUid.value}`);
```

Consecutive `useUFetch` calls in one section have **one** blank line between them. Query objects are multi-line; quoted keys are fine when they match API conventions (`'filter'`, `'sort'`).

---

## Naming

Rename only identifiers declared in this file, and update every use in the file.

| Context | Convention |
|---------|------------|
| Async / UI action handlers | `handleXxx` (`handleLogin`, `handleResourceDelete`) |
| Short sync helpers | no `handle` prefix (`refresh`, `formatDate`) |
| Short `.map` / `.filter` / `.find` (≤ ~3 lines) | parameter `it`, no parens: `it =>` |
| `for...of` / `v-for` | descriptive names — not `u`, `fo`, `doc` abbreviations |
| `ufetch` result | `response`, or a more specific `xxxResponse` (`loginResponse`) — not `result` |
| `useUFetch` destructure | `data: xxxData`, `pending: isXxxPending`, `refresh: refreshXxx` |
| `computed` returning array/object | block body + explicit `return` — not concise `() => [...]` |

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

Pass handler **references** into action objects and watchers (`onClick: handleResourceCreate`) instead of `() => handleResourceCreate()` wrappers — unless the wrapper adapts arguments.

---

## Object property order

Omit unused properties; keep the rest in this order:

| Object | Order |
|--------|-------|
| Action objects (`:actions`, `:append-actions`, table row actions) | `vIf` → `actionType` → `variant` → `color` → `icon` → `label` → `tooltip` → `warning` → `disabled` → `to` → `href` → `onClick` → `items` |
| Table column defs | `accessorKey` (or `id`) → `header` → others |
| Tab / select / menu item objects | `value` → `icon` → `label` → others |
| `ufetch` options | see [Fetch calls](#fetch-calls) |

---

## Template rules

### Structural directives on `<template>`

Always put `v-if` / `v-else-if` / `v-else` / `v-for` on `<template>` wrappers — never on the rendered element:

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

```vue
<!-- ❌ -->
<div v-if="captcha">
```

### Child spacing (hard rule)

Blank lines **inside** a tag depend only on **how many direct children it has** — never on how tall or important they look.

- **Exactly one child:** no blank lines. The child starts on the line after the opening tag; the closing tag comes right after the child.
- **Two or more children:** **exactly one** blank line after the opening tag, between each pair of children, and before the closing tag. Never two, never zero.
- **No children:** the tag is self-closing (see [Attribute wrapping](#attribute-wrapping-hard-rule)).

When a split puts `>` at the end of the last attribute line, that line **is** the opening tag — the blank line goes right below it.

What counts as one child:

| Child node | Counts as |
|------------|-----------|
| Element / component tag | one child |
| `<template>` wrapper (`v-if`, `v-for`, named or scoped slot) | one child |
| `<slot />` | one child |
| A run of text / interpolation (`Welcome, {{ user.name }}!`) | one child |
| Each branch of a `v-if` / `v-else-if` / `v-else` chain | **one child per branch** |
| An HTML comment | part of the child below it — the blank line goes above the comment |

A lone `v-if` with no `v-else` is one child and stays flush. Each tag looks only at its own direct children: a single-child parent stays flush even when its child has many children.

```vue
<!-- ✅ single child — parent hugs it -->
<u-tooltip :text="action.tooltip">
  <u-button
    loading-auto
    v-bind="radOmit(action, [ 'tooltip' ])"
  />
</u-tooltip>

<!-- ✅ multiple children, including v-if branches -->
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

<!-- ✅ a text run next to an element is its own child -->
<p class="text-sm">

  Signed in as {{ userData.name }}

  <u-button
    variant="subtle"
    icon="lucide:log-out"
    @click="handleLogout"
  />

</p>
```

```vue
<!-- ❌ blanks around a lone child -->
<u-tooltip :text="action.tooltip">

  <u-button variant="subtle" />

</u-tooltip>

<!-- ❌ siblings or branches packed together -->
<div class="flex flex-col">
  <template v-if="state === 'complete'">
    ...
  </template>
  <template v-else>
    ...
  </template>
</div>

<!-- ❌ two blank lines between children -->
<div class="space-y-3">

  <un-card :title="title" />


  <un-card :title="otherTitle" />

</div>
```

### Attribute wrapping (hard rule)

- **Childless tags are self-closing:** `<tag ... />`, never an empty open/close pair.
- **Childless, one single-line attribute:** one line (`<u-icon name="lucide:check" />`).
- **Childless, more than one attribute or any multiline attribute:** opening `<tag` on its own line, one attribute per line, `/>` on its own line.
- **Tags with children:** all attributes stay on the **same line** as the opening tag, regardless of count or length. This applies to every tag, including `u-modal` and structural `<template>` wrappers.
- **The only split trigger for tags with children is a multiline attribute**: an array, object, or function literal bound to an attribute that spans multiple lines. Then the opening `<tag` goes on its own line, every attribute gets its own line, and the multiline value is formatted like a JS literal.
- References, calls, and scalar expressions (`:field="field"`, `v-bind="radOmit(action, [...])"`, `@click="handleSave"`) are **not** multiline attributes. A single-pair object with scalar values (`:ui="{ content: 'max-w-5xl' }"`) stays inline. Multi-key or nested object / array bindings are multiline attributes.

```vue
<!-- ✅ children, no multiline attribute — one line -->
<u-modal :ui="{ content: 'max-w-5xl' }" scrollable @update:open="!$event && emit('close')">
  ...
</u-modal>

<!-- ✅ children + multiline attribute — split -->
<div
  v-if="show"
  :class="{
    'p-3': !fluidBody,
  }">
  ...
</div>

<!-- ✅ childless, several attributes -->
<u-button
  variant="subtle"
  icon="lucide:refresh-ccw"
  @click="refresh"
/>
```

```vue
<!-- ❌ childless multi-attribute tag on one line -->
<u-button variant="subtle" icon="lucide:refresh-ccw" @click="refresh" />

<!-- ❌ empty open/close pair -->
<div class="grow"></div>

<!-- ❌ tag with children split without a multiline attribute -->
<un-card
  icon="lucide:key"
  :title="title"
  fluid-body>
  ...
</un-card>

<!-- ❌ multiline attribute kept on the opening line -->
<div v-if="show" :class="{
  'p-3': !fluidBody,
}">
```

### `>` and `/>` placement

- Single-line tags keep the closer on the same line.
- Split tags with children: `>` on the **same line** as the last attribute.
- Split self-closing tags: `/>` on its **own line**.
- Always a space before `/>` on single-line self-closing tags.
- Closing tags of block components (`</un-card>`, `</u-modal>`) are always on their own line.

```vue
<!-- ❌ > on its own line -->
<div
  :class="{
    'p-3': !fluidBody,
  }"
>
```

### Attribute order

Applies whenever attributes are on separate lines:

1. Refs / identity: `ref`, `id`, `name`
2. Component visual props: `variant`, `color`, `size`, `icon`, static `label`
3. Static presentation: `class`, `style`
4. Data bindings: `:items`, `:data`, `:placeholder`, `:value`, dynamic `:label`, …
5. `v-model` / `:model-value` / `v-model:*`
6. Navigation / state: `to`, `href`, `block`, `disabled`, `loading`, `loading-auto`, `fluid-body`, `scrollable`, …
7. Events last: `@click`, `@update:*`, …

Shortcuts:

- `u-button`: `variant` → `color` → `size` → `icon` → label/value → `block` → `disabled` → `loading-auto` → events
- `u-input` / `u-select*`: `:placeholder`, `:label` → `:loading`, `:disabled` → `:items` → `class` → `v-model` → events
- `un-table`: `:columns` → `class` / `:ui` → `:loading` → `:data` → `hide-pagination` → `:total-items` → `:items-per-page-items` → `:row-to` → `v-model:items-per-page` → `v-model:current-page` → `sticky-actions` → `:actions` → `:extra-actions` → `:meta` (page size model always before page model)

### Template bindings

- Simple scalars and simple ternaries stay inline.
- When one condition changes several attributes, labels / icons, or an object binding such as `to`, use sibling `<template v-if>` / `v-else-if` / `v-else` branches with explicit component variants instead of nested ternaries.

### Default attribute values

Omit props that restate a default:

| Component / context | Convention |
|---------------------|------------|
| `un-table` `actions` / `extraActions` objects | omit `variant: 'subtle'` — `un-table` already sets it. Keep `variant` on every other button and action object; it is not a default there |
| `u-badge` | omit `color` for neutral (`undefined` in ternaries, never `color="neutral"`); no `size` |
| `u-tooltip` | do not set `:delay-duration` |

```vue
<!-- ✅ -->
<u-badge
  variant="subtle"
  :color="item.digital ? 'info' : undefined"
  :label="item.digital ? 'Digital' : 'Physical'"
/>

<!-- ❌ -->
<u-badge
  variant="subtle"
  color="neutral"
  :label="item.name"
/>
```

### Text interpolation

Put text and `{{ ... }}` on their own line, never glued to the tags. Static and dynamic text may share a line.

```vue
<h1 class="text-2xl font-semibold">
  Welcome, {{ user.name }}!
</h1>

<!-- ❌ -->
<h1 class="text-2xl font-semibold">{{ user.name }}</h1>
```

### Root structure

One root node when possible. If several sibling sections are needed, wrap them in one root (`<div class="space-y-3">`), which follows child spacing like any other tag.

### Refs in templates

Refs unwrap automatically — no `.value` in template expressions or in object literals bound from the template.

---

## Server / plain TS files

Same whitespace, brace, literal, and call rules as script blocks, starting with the responsibility header. Prefer `async event =>` consistent with siblings:

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

---

## Checklist before finishing an edit

- [ ] Responsibility header: blank line, `/* responsibility */`, blank line, short `//` lines, two blank lines; in Vue inside `<script setup>`; nothing above it
- [ ] `<script setup>` without `lang="ts"`; no TS annotations in Vue
- [ ] 2-space indent; single quotes; semicolons; trailing commas in multi-line literals
- [ ] Every domain section starts with `/* section name */` + blank line; sections separated by two blank lines; imports co-located
- [ ] Declaration groups: two blanks between groups; single-line refs stacked; one blank between other same-kind declarations
- [ ] Multiline assignments have exactly one blank line before and after (shared with required blanks; group boundaries keep two)
- [ ] Workflow functions: blank after `{`, double blanks between major steps, blank before `}`; tiny helpers tight; single-block functions flush; return-only decisions as one `if` / `else if` / `else` chain
- [ ] Braces everywhere; `else` / `catch` on their own line
- [ ] Script literals multi-line, except `{}` / `[]`; no statement wrapped only for length; `fn(arg, {` on one line
- [ ] Page scripts: section order, `/* params */` shape, `/* seo */` placement and call order
- [ ] `useUFetch` shape; `ufetch` options order; destructure names `xxxData` / `isXxxPending` / `refreshXxx`; `response` for `ufetch` results
- [ ] `handleXxx` handlers; `it` for short callbacks; descriptive loop names; structure-returning computeds use block + `return`; handler references, not wrappers
- [ ] Action / column / item object property order
- [ ] Kebab-case component tags; `v-if` / `v-for` on `<template>` wrappers
- [ ] Child spacing: one child flush; 2+ children with exactly one blank after the opener, between children, and before the closer (each branch counts)
- [ ] Attribute wrapping: tags with children single-line unless a multiline attribute forces a split; childless tags self-closing, split when more than one attribute; `>` / `/>` placement
- [ ] Attribute order; redundant defaults omitted
- [ ] Text / `{{ }}` on its own line
- [ ] `atoms` / `libs` imports relative; file not moved
- [ ] No behavior change
