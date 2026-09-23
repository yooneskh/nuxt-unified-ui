# Nuxt unified code style

**Mandatory** whenever generating or editing code in a Nuxt project that uses this stack. Applies to **all** Nuxt project files: Vue SFCs and `.ts`/`.js` under `app/` (including `atoms/` and `libs/`), `server/`, composables, utils, plugins, middleware, etc.

This document is about the **look and shape** of code — whitespace, wrapping, braces, template structure, sectioning, file placement for layer-private vs public modules, and light naming that affects scanning — not business logic.

---

## Higher-level reasoning

Write code so a reader can **scan vertically** and see structure before details.

1. **Sections contain declaration-kind groups.**
   Start each logical `<script setup>` domain with a `/* section name */` comment and a blank line. Within that section, group imports, refs, computeds, watchers, functions, and other declarations by kind. Double blank lines separate groups; refs stay tightly stacked; consecutive members of other groups have one blank line between them.

2. **Function body spacing follows the work.**
   A non-trivial workflow function is a mini-document: blank line after `{`, full-block guards, double blanks between major steps, and a blank before `}`. A function whose body is one control block — or one connected `if` / `else` / `else if` or `try` / `catch` / `finally` chain — stays flush: no blanks between the function braces and that block. Small helpers and functions whose whole job is choosing a return value stay compact.

3. **One idea per line in structured data.**
   Object/array literals in script are multi-line with trailing commas — even single-property objects passed to helpers (`toastSuccess`, `ufetch` options, etc.). The exception is an **empty** literal, which stays compact on one line (`{}`, `[]`). A multiline assignment (the usual home of those literals) is isolated with one blank line before and after so the block scans as its own unit.

4. **Templates stay single-line unless a multiline attribute — or a childless multi-attribute tag — forces a split.**
   A tag with children keeps all attributes on the same single line as the opening tag — no wrapping for length or attribute count. Only a multiline attribute (an array, object, or function literal bound to an attribute that spans multiple lines) forces such a tag to split: then the opening tag goes on its own line, every other attribute gets its own line, and the multiline value is formatted like a JS literal. Childless tags follow their own exception (self-closing; split when they carry more than one attribute or a multiline attribute). Closing `>` / `/>` placement is consistent; interpolations sit on their own line (static + dynamic text may share one `{{ ... }}` or surrounding text).

5. **Blank lines in templates count children, not size.**
   A tag with exactly one child hugs it: no blank lines inside the tag. A tag with two or more children breathes: one blank line after the opening tag, between each pair of children, and before the closing tag. Branching (`v-if` / `v-else-if` / `v-else`) counts per branch. This makes sibling count — the thing that decides whether you must read further — visible at a glance, and it is never a judgement call about how "big" the children look.

6. **Section comments are the map.**
   `/* section */` labels define logical domains, while declaration-kind spacing exposes the structure inside each domain. Imports sit in the section that needs them, not in a hoisted pile at the top.

7. **Names that match role.**
   Handlers read as actions (`handleLogin`), short callbacks use `it`, loops use real nouns. Shape and naming reinforce each other so you rarely need narrating comments.

8. **Vue scripts stay runtime-shaped.**
   `<script setup>` without `lang="ts"` and without type annotations keeps SFC style uniform and matches the dominant Nuxt UI / unified-ui codebase. Server/util `.ts` files may use TypeScript where the file already does; still follow the same whitespace and literal formatting.

When editing an existing file, **absolute rules below always win**. For choices not covered here (rare quote/semicolon drift), match the nearest sibling file.

---

## Absolute baseline

| Rule | Value |
|------|--------|
| Indentation | 2 spaces |
| New code quotes | single quotes `'` |
| Semicolons | use them |
| Trailing commas | always in multi-line literals |
| Vue script tag | `<script setup>` only — **never** `lang="ts"` |
| Vue script types | **no** TypeScript annotations; use runtime prop types (`String`, `Object`, `Array`, `Boolean`, `Number`, `Function`) |
| Component tags | lowercase kebab-case (`u-button`, `un-card`) — never PascalCase |
| Braces | always for `if` / `else` / `for` / `while` — no brace-less single-liners |
| `else` / `catch` | on their **own line** after `}` |
| `.js` / `.ts` file start | **two** blank lines at the top, **unless** the file starts with imports — then **no** blank lines before the first `import` |
| **Single-line principle (JS/TS only)** | **Do not wrap JS/TS code solely because it has grown long**; keep every statement on a single line unless the explicit JS/TS wrapping rules below dictate otherwise. The default is single-statement-per-line; only break across lines when a specific rule permits or requires it. Template sections have their own rule (single-line attributes unless a multiline attribute forces a split) — see Template rules. |
| **Empty object / array literals** | `{}` and `[]` — always a single line, never split across lines — see [Empty literals](#empty-literals). |
| **Multiline assignment isolation** | A JS/TS assignment that spans more than one line gets **exactly one** blank line before it and **exactly one** after it — see [Multiline assignment isolation](#multiline-assignment-isolation). |
| **Template child spacing** | Single child → no blank lines inside the tag. Two or more children → exactly one blank line after the opening tag, between each pair of children, and before the closing tag — see [Child spacing](#child-spacing-hard-rule). |

---

## Vertical whitespace (script / TS)

### File start (`.js` / `.ts` only)

Start of every `.js` and `.ts` file must have **two blank lines**, except if it has imports at the start of the file — then put **no** blank lines before the first import.

```ts
// ✅ no imports — exactly two blank lines, then code


export default defineEventHandler(async event => {
  ...
});
```

```ts
// ✅ imports at start — import on line 1, no leading blanks
import { join } from 'node:path';


const { schema, type, inferred } = parseSchema({
  ...
});
```

```ts
// ❌ missing leading blanks when there are no imports
export default defineEventHandler(async event => {
  ...
});
```

```ts
// ❌ blank lines before the first import
import { join } from 'node:path';
```

Vue SFCs are unchanged: `<script setup>` begins immediately inside the script block (no artificial leading blanks at the top of the `.vue` file).

### Section rhythm

- Start every logical `<script setup>` domain with `/* section name */`, followed by a blank line.
- Within each section, group declarations by kind: imports, props/models, refs, computeds, watchers/lifecycle, functions, and outlets.
- Use **two blank lines between different declaration groups** within a section.
- Keep consecutive **single-line** refs together with **no blank lines**.
- Use **one blank line between consecutive declarations** in other same-kind groups, including computeds, watchers, and functions.
- A **multiline assignment** is isolated with one blank line before and after it, even among refs — see [Multiline assignment isolation](#multiline-assignment-isolation).
- Keep a blank line before each section comment; the preceding group's double-boundary spacing still applies.
- Blank line before `</script>`.
- **Two** blank lines between `</script>` and `<template>`.

Declaration-group spacing is independent from spacing inside a function body. Do not add a new section comment merely because the declaration kind changes.

### Non-trivial workflow functions

Applies to async handlers, multi-step loaders, and non-trivial callbacks:

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
- Double blank between guard/setup and main work / between major steps
- Blank line before closing `}`
- **Not** when the body is a single (connected) control block — that stays flush; see below

### Tiny blocks stay tight

Do **not** add decorative blanks when the body is a single delegation or a one-line reset:

```ts
async function refreshResources() {
  await resourceExplorerTableEl.value?.refreshResources();
}

async function handleSubmitSelection(items) {
  await props.onSelected?.(items);
  emit('close', items);
}
```

Same for a `finally` that only flips one flag.

### Single-block functions stay flush

When a function body is **only** one control block (`for`, `while`, `if`, or similar) or **only** one connected chain (`if` / `else if` / `else`, or `try` / `catch` / `finally`), do **not** put blank lines before or after that block. The declaration line connects to the block (next line after `{` is the block), and the function’s closing `}` connects to the end of the block (no blank above it).

`if` / `else` / `else if` and `try` / `catch` / `finally` already stay adjacent — no blank lines between their parts — so the whole chain counts as one block.

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

function abortIfServer() {
  if (import.meta.server) {
    return Promise.resolve();
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

If the function has **any other statement** besides that one block (a guard plus a loop, setup then a `for`, two separate `if`s, …), use the non-trivial workflow spacing instead. Interior spacing *inside* the block still follows the other rules, including [multiline assignment isolation](#multiline-assignment-isolation).

### Return-only decision functions

When a function's whole job is to choose and return a value from multiple criteria, express the complete decision as one compact `if` / `else if` / `else` chain:

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

Use this pattern only when value selection is essentially the function's entire body. Keep the chain flush with the function braces (single-block rule). Functions that perform broader work may use guard clauses and early returns when those make the workflow clearer; do not force their logic into an exhaustive chain.

### Multiline assignment isolation

A **multiline assignment** is any `const` / `let` / `var` / `export const` declaration, or any `=` reassignment, whose **statement spans more than one line**. That almost always means the RHS is a multi-line object, array, call, or destructure (`useUFetch`, `computed(() => { … })`, `defineProps({ … })`, …).

Isolate it with **exactly one** blank line immediately before the statement and **exactly one** blank line immediately after it.

This is about the **statement**, not about calls or returns. `await navigateTo({ … })`, `toastSuccess({ … })`, and `return { … }` are not assignments — they do not get this padding from this rule (function-body / group spacing still applies to them).

```ts
const itemsPerPage = ref(20);
const currentPage = ref(1);

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

const sortDirection = ref('desc');
```

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

```ts
// ❌ flush against neighbors
const itemsPerPage = ref(20);
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

How this combines with other spacing rules:

| Situation | What to keep |
|-----------|----------------|
| Two multiline assignments in a row | **One** blank line between them (the after of the first *is* the before of the second) |
| Next to a single-line statement (including consecutive refs) | Isolation **wins**: one blank before and after the multiline assignment |
| First statement after a function `{` that already wants a blank, or last statement before a `}` that already wants a blank | **Share** that one blank — do not add a second |
| Declaration-group boundary or major-step boundary (already **two** blanks) | Keep the **two** — do not squeeze them down to one |
| Blank line already required after `/* section */` | That blank **is** the before-blank — do not add another |
| Single-line assignment, including empty `{}` / `[]` | Not multiline — no isolation from this rule |
| Tiny / single-block function whose **only** statement is the assignment | Stay **flush** with the function braces (those functions never pad around their one statement) |

Do not put extra blank lines **inside** the assigned literal; one entry per line, no blanks between properties / elements.

### `else` / `catch`

```ts
if (condition) {
  ...
}
else {
  ...
}

try {
  await doSomething();
}
catch {
  toastError({
    title: 'Failed',
  });
}
```

---

## Object / array / call formatting

### Script literals — multi-line unless empty

In script and `.ts` files, object and array literals use one property / element per line and a trailing comma — **including single-property / single-element literals** in call args:

```ts
toastSuccess({
  title: 'Saved',
});

await navigateTo({
  name: 'authentication.login',
});

await ufetch('/api/authentication/login', {
  method: 'post',
  body: {
    username: loginForm.value.username,
    password: loginForm.value.password,
  },
});
```

A multiline assignment of one of these literals is isolated with a blank line before and after — see [Multiline assignment isolation](#multiline-assignment-isolation).

### Empty literals

An object or array with **no** properties / elements is always written on **one line**: `{}` or `[]`. No newline inside, no trailing comma, no spaces between the brackets.

This is the only exception to “literals are multi-line”. A single key or a single element is **not** empty and still splits.

```ts
const form = {};
const selectedIds = [];

await ufetch('/api/items', {
  method: 'post',
  query: {},
  body: {
    ids: [],
  },
});
```

```ts
// ❌ empty literal split across lines
const form = {
};

const selectedIds = [
];

await ufetch('/api/items', {
  method: 'post',
  body: {
  },
});
```

`defineEmits([])` and similar empty-array / empty-object arguments stay `[]` / `{}` on one line. One or more entries still use the multi-line form.

### Call wrapping

Prefer `fn(arg, {` on one line; put options on following lines. Do not break the call so the URL/first arg sits alone on a line above `{` unless the expression is structurally huge.

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

### Template bindings — compactness

- A bound array, object, or function literal that spans multiple lines is a **multiline attribute** and forces the tag to split (see Attribute wrapping). A single-pair object with scalar values stays inline and does **not** trigger a split: `:ui="{ content: 'max-w-7xl' }"`
- Multi-key or nested template object/array bindings are multiline attributes: split the tag and format the value like a JS literal
- Simple scalars and simple ternaries stay inline; break only when a branch becomes a multiline object/array or nested structure
- When one condition changes several attributes, labels/icons, or an object-shaped binding such as `to`, use sibling `<template v-if>` / `v-else-if` / `v-else` branches with explicit component variants. Prefer small markup duplication over nested ternaries and overly dynamic attributes.

Each branch is a child of the surrounding tag, so the branches are separated by blank lines ([Child spacing](#child-spacing-hard-rule)):

```vue
<div class="flex items-center gap-1">

  <template v-if="state === 'complete'">
    <u-badge
      variant="subtle"
      color="success"
      icon="lucide:circle-check"
      label="Completed"
    />
  </template>

  <template v-else-if="state === 'in-progress'">
    <u-badge
      variant="subtle"
      color="warning"
      icon="lucide:clock"
      label="In Progress"
    />
  </template>

  <template v-else>
    <u-badge
      variant="subtle"
      icon="lucide:circle"
      label="Not Started"
    />
  </template>

</div>
```

---

## Vue SFC shape

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
- `defineModel` uses `{ type, default? }` (required by Vue) — that object still follows multi-line literal rules

### Section comments

Group with `/* name */`:

| Common section | Contents |
|----------------|----------|
| `/* interface */` | props, emits, models |
| `/* page */` | `definePageMeta` only |
| `/* params */` | `useRoute` + reactive computeds for `route.params` and `route.query` |
| `/* seo */` | `useHead` + `useSeoMeta` (and `useJsonld` when the project has it) |
| domain names | `/* login */`, `/* resource */`, `/* captcha */`, … |
| `/* outlets */` | `defineExpose` |

The comment names a logical domain, not a declaration kind. Follow it with a blank line, then organize that domain into declaration-kind groups. Avoid comments that only restate obvious option names.

```ts
/* resource */

import ResourceExplorerCell from '../atoms/resource-explorer-cell.vue';


const itemsPerPage = ref(20);
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

### Script ordering

**Components / dialogs**

1. `/* interface */` section
2. Domain sections in reading order
3. Within each section: imports, refs, computeds, watchers/lifecycle, functions
4. `/* outlets */` / `defineExpose` section if needed

**Pages**

1. `/* page */` — `definePageMeta` only
2. `/* params */` — only when the page reads `route.params` or `route.query`
3. Domain sections SEO needs (fetches / derived data)
4. `/* seo */` — required; under the last block it reads
5. Remaining domain sections
6. Watchers / lifecycle
7. Handlers

### Import co-location

Place non-auto-imported imports **inside the section that uses them**, not hoisted at the top of the file:

```ts
/* charts */

import { VisXYContainer, VisLine } from '@unovis/vue';
```

### Layer-private `atoms` / `libs` vs public `components` / `utils`

Nuxt auto-imports `app/components/` and `app/utils/` across the **entire** app (every layer). Files that must stay inside one layer do not belong there.

Any component or util in a layer which is not supposed to be used from another layer should be put in (`atoms` for components) and (`libs` for functions and ...), and if we notice that one of these is needed in another layer, we move it to `components` or `utils` folder. A generated component or util starts in these private folders, then moves into public ones if needed. These should be imported with relative path in their callsites.

| Role | Directory | Visibility |
|------|-----------|------------|
| Private Vue component | `app/atoms/` | This layer only |
| Private function / helper / similar | `app/libs/` | This layer only |
| Public Vue component | `app/components/` | Whole app (auto-imported) |
| Public util | `app/utils/` | Whole app (auto-imported) |

`app/composables/` is public like `utils/`. Private composables and other non-component helpers go in `app/libs/`.

**Generate private first.** New components go in `app/atoms/`. New functions and similar go in `app/libs/`. Promote (move the file, update call sites) to `app/components/` or `app/utils/` only when another layer needs them. After a promote, drop the relative import — public modules are auto-imported.

**Import `atoms` / `libs` with relative paths only** (`../atoms/foo.vue`, `../libs/bar`). Never `~/`, `@/`, `#layers/`, or other aliases. Never import another layer's `atoms` or `libs`; promote first, then use the public auto-import.

Do not register `atoms` or `libs` with Nuxt `components` / `imports` config.

```ts
// ✅ same layer
import ResourceExplorerCell from '../atoms/resource-explorer-cell.vue';
import { formatColumn } from '../libs/format-column';
```

```ts
// ❌ aliases / other layers
import ResourceExplorerCell from '~/atoms/resource-explorer-cell.vue';
import { formatColumn } from '#layers/other-layer/libs/format-column';
```

### Watcher formatting

- Prefer `watchImmediate` over `watch(..., { immediate: true })`
- Pass function **references** directly — no `() => { fn(); }` wrappers
- One argument per line when registering:

```ts
watchImmediate(
  () => props.document?.uid,
  loadPreview,
);
```

Put guards **inside** the handler function so the reference stays clean.

---

## Template rules

### Structural directives on `<template>` (critical)

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

Each branch of a `v-if` / `v-else-if` / `v-else` chain is a separate child of the surrounding tag, so branches are separated by blank lines like any other siblings — see [Child spacing](#child-spacing-hard-rule).

### Child spacing (hard rule)

Blank lines **inside** a tag are decided by **how many direct children it has** — never by how tall, dense, or important the children look.

- **Exactly one child:** no blank lines. The child begins on the line directly after the opening tag, and the closing tag comes directly after the child.
- **Two or more children:** **exactly one** blank line after the opening tag, **exactly one** blank line between each pair of consecutive children, and **exactly one** blank line before the closing tag. Never two, never zero.
- **No children:** nothing to space — the tag is self-closing (see Attribute wrapping).

This rule governs blank lines only. Indentation and the shape of the tags themselves (single-line attributes, multiline-attribute splits, `>` / `/>` placement, attribute order) follow their own rules and are unaffected. When a multiline attribute split puts `>` at the end of the last attribute line, that line **is** the opening tag for spacing purposes — the blank line goes right below it.

```vue
<!-- ✅ single child — parent hugs it -->
<u-tooltip :text="action.tooltip">
  <u-button
    loading-auto
    v-bind="radOmit(action, [ 'tooltip' ])"
  />
</u-tooltip>

<!-- ✅ single text / interpolation child — same thing -->
<span class="text-sm">
  {{ $t('un.table.itemsPerPage') }}
</span>

<!-- ✅ multiple children — one blank after the opener, between children, before the closer -->
<div class="flex items-center gap-2 p-3 border-t border-default">

  <u-pagination
    active-color="neutral"
    :total="props.totalItems"
    @update:page="currentPage = $event"
  />

  <div class="grow" />

  <u-select
    :items="pageSizeItems"
    v-model="itemsPerPage"
  />

</div>
```

```vue
<!-- ❌ decorative blanks around a lone child -->
<u-tooltip :text="action.tooltip">

  <u-button
    loading-auto
    v-bind="radOmit(action, [ 'tooltip' ])"
  />

</u-tooltip>

<!-- ❌ siblings packed together -->
<div class="flex items-center gap-2 p-3">
  <u-pagination :total="props.totalItems" />
  <div class="grow" />
</div>

<!-- ❌ double blank lines between siblings -->
<div class="space-y-3">

  <un-card :title="title">
    ...
  </un-card>


  <un-card :title="otherTitle">
    ...
  </un-card>

</div>
```

#### What counts as a child

Every direct child **node** counts, whatever its kind:

| Child node | Counts as |
|------------|-----------|
| Element / component tag (`<div>…</div>`, `<u-button />`) | one child |
| `<template>` wrapper (`v-if`, `v-for`, named slot, scoped slot) | one child |
| `<slot />` or `<slot>…</slot>` | one child |
| A run of text / interpolation (`Login`, `Welcome, {{ user.name }}!`) | one child |
| Each branch of a `v-if` / `v-else-if` / `v-else` chain | **one child per branch** |
| An HTML comment (`<!-- … -->`) | part of the child below it — no blank line between the comment and that child; the blank line goes above the comment |

A `v-if` / `v-else-if` / `v-else` chain is **not** a single unit: two branches mean two children, so the parent breathes and the branches are separated by a blank line. A lone `v-if` with no `v-else` is a single child and stays flush.

```vue
<!-- ✅ two branches = two children -->
<template v-for="(action, index) of props.actions" :key="index">

  <template v-if="!action.actionType || action.actionType === 'button'">
    <u-tooltip :text="action.tooltip">
      <u-button
        loading-auto
        v-bind="radOmit(action, [ 'actionType', 'tooltip' ])"
      />
    </u-tooltip>
  </template>

  <template v-else-if="action.actionType === 'spacer'">
    <div class="grow" />
  </template>

</template>

<!-- ✅ lone v-if = single child -->
<un-card :icon="icon" :title="title">
  <template v-if="isResourceLoading">
    <un-spinner />
  </template>
</un-card>

<!-- ✅ a text run next to an element child is itself a child -->
<p class="text-sm">

  Signed in as {{ userData.name }}

  <u-button
    variant="subtle"
    icon="lucide:log-out"
    @click="handleLogout"
  />

</p>

<!-- ❌ branches glued together -->
<div class="flex flex-col">
  <template v-if="state === 'complete'">
    ...
  </template>
  <template v-else>
    ...
  </template>
</div>
```

#### Applied per tag, at every depth

Each tag looks **only at its own direct children**. Nesting never propagates spacing: a single-child parent stays flush even when that child is a multi-child tag, and a multi-child parent breathes even when every child is a one-liner.

```vue
<template>
  <u-card :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">

    <un-typography :title="props.title" class="p-3">

      <template v-if="isSlotFilled(slots.title)" #title>
        <slot name="title" />
      </template>

      <template v-if="props.closable" #append>
        <u-button
          variant="ghost"
          icon="lucide:x"
          @click="emit('close')"
        />
      </template>

    </un-typography>

    <div
      v-if="props.text || isSlotFilled(slots.default)"
      :class="{
        'p-3': !props.fluidBody,
      }">

      <template v-if="props.text">
        <p :class="props.textClasses">
          {{ props.text }}
        </p>
      </template>

      <slot />

    </div>

  </u-card>
</template>
```

Reading that from the outside in: `u-card` has two children (spaced), `un-typography` has two slot children (spaced), each slot `<template>` has one child (flush), the split `div` has two children (spaced), and the inner `<p>` has one text child (flush). The SFC root `<template>` has one root node, so it is flush too.

### Attribute wrapping (hard rule)

- **Childless tags must be self-closing:** a tag with no children is written `<tag ... />` — never an empty open/close pair (`<tag ...></tag>`).
- **Tags with children — single line unless multiline:** all attributes stay on the **same single line** as the opening tag, regardless of attribute count or line length. Never wrap only because the line got long or because there are 2+ attributes. This applies equally to rendered elements, components, `u-modal`, and structural `<template>` wrappers.
- **Only trigger for tags with children — multiline attribute:** such a tag splits only when one of its attributes is a **multiline attribute**: an array, object, or function literal bound to the attribute that spans multiple lines (e.g. `:class="{\n … \n}"`, `:items="[\n … \n]"`). References, calls, and scalar expressions (`:field="field"`, `v-bind="radOmit(action, [...])"`, `:is="elementsMap[x]"`, `@click="handleSave"`) are **not** multiline attributes, even when their runtime value is an object. A single-pair object with scalar values (`:ui="{ content: 'max-w-5xl' }"`) stays inline and does **not** trigger a split.
- **Childless exception:** a childless (self-closing) tag with a single single-line attribute stays on one line with the tag (`<u-icon name="lucide:check" />`). When it has more than one attribute **or** at least one multiline attribute, the tag and its attributes each go on their own line: the opening tag on its own line (`<tag`), one attribute per line in attribute order, and `/>` on its own line.
- **Split shape (tags with children):** when a multiline attribute triggers the split, the opening tag goes on its **own line** (`<tag`), every other attribute gets **its own line** in attribute order, and the multiline attribute's value is formatted **like a JS value** (one entry per line, trailing commas). Closing `>` / `/>` placement follows [`>` and `/>` placement](#-and--placement).

```vue
<!-- ✅ tag with children, no multiline attribute — one line, however many attributes -->
<u-modal :ui="{ content: 'max-w-5xl' }" scrollable @update:open="!$event && emit('close')">
  ...
</u-modal>

<!-- ✅ structural template wrappers follow the same rule -->
<template v-for="column in columns" :key="column.accessorKey" #[column.accessorKey+'-cell']="{ row }">
  ...
</template>

<!-- ✅ tag with children + multiline attribute — splits, value styled like JS -->
<div
  v-if="show"
  :class="{
    'p-3': !fluidBody,
  }">
  ...
</div>

<!-- ✅ childless, single single-line attribute — one line -->
<u-icon name="lucide:check" />

<!-- ✅ childless, more than one attribute — tag and attributes each on their own line -->
<u-button
  variant="subtle"
  icon="lucide:refresh-ccw"
  @click="refresh"
/>

<!-- ✅ childless with a multiline attribute — same split shape -->
<component
  :is="elementsMap[field.identifier]"
  :field="field"
  :class="{
    'p-2': true,
  }"
/>

<!-- ❌ childless multi-attribute tag on one line -->
<u-button variant="subtle" icon="lucide:refresh-ccw" @click="refresh" />

<!-- ❌ empty open/close pair — self-close instead -->
<div class="grow"></div>

<!-- ❌ splitting a tag with children that has no multiline attribute -->
<un-card
  icon="lucide:key"
  :title="title"
  fluid-body>
  ...
</un-card>
```

### Attribute order

When a multiline attribute forces a split, order attributes as:

1. Refs / identity: `ref`, `id`, `name`
2. Component visual props: `variant`, `color`, `size`, `icon`, static `label`
3. Static presentation: `class`, `style`
4. Data bindings: `:items`, `:data`, `:placeholder`, `:value`, dynamic `:label`, …
5. `v-model` / `:model-value` / `v-model:*`
6. Navigation / state: `to`, `href`, `block`, `disabled`, `loading`, `loading-auto`, `fluid-body`, `scrollable`, …
7. Events last: `@click`, `@update:*`, …

Practical shortcuts:

- `u-button`: `variant` → `color` → `size` → `icon` → label/value → `block` → `disabled` → `loading-auto` → events
- `u-input` / `u-select*`: user-facing props (`:placeholder`, `:label`) → transient state (`:loading`, `:disabled`) → data source (`:items`) → `class` → `v-model` → events
- Action objects (`:actions`, `:append-actions`, table row actions): `vIf` → `actionType` → `color` → `icon` → `label` → `tooltip` → `warning` → `disabled` → `to` → `href` → `onClick` → `items`
- `un-table`: `:columns` → `class` / `:ui` → `:loading` → `:data` → `hide-pagination` → `:total-items` → `:items-per-page-items` → `:row-to` → `v-model:items-per-page` → `v-model:current-page` → `sticky-actions` → `:actions` → `:extra-actions` → `:meta` (omit unused). Full table rules → [tables.md](tables.md)
- Tab / select item objects: `value` → `icon` → `label`

### Default attribute values (omit noise)

Prefer defaults by **omitting** props rather than restating them:

| Component / context | Default convention |
|---------------------|--------------------|
| `u-button` | Prefer `variant="subtle"` (or omit) for normal actions |
| Cancel buttons only | Use `variant="ghost"` / `variant: 'ghost'` — **only** for Cancel dismiss actions; do not use `ghost` on other buttons |
| Async `u-button` clicks | Prefer `loading-auto` over hand-rolled `isLoading` when nothing else depends on that flag |
| `u-badge` | Always `variant="subtle"`; use `icon` + `:label` (no default slot text); **do not** set `size`; **omit** `color` for neutral (use `undefined` in ternaries, never `color="neutral"`) |
| `u-tooltip` | Do not set `:delay-duration` — use the default delay |
| Action objects where subtle is the local default | Omit `variant: 'subtle'` unless overriding; Cancel actions set `variant: 'ghost'` |
| Icons | Always `lucide:*` prefix |

```vue
<!-- ✅ omit neutral color; subtle badge -->
<u-badge
  variant="subtle"
  :label="item.name"
/>

<!-- ✅ ternary falls back with undefined -->
<u-badge
  variant="subtle"
  :color="item.digital ? 'info' : undefined"
  :label="item.digital ? 'Digital' : 'Physical'"
/>

<!-- ❌ restating neutral / wrong variant -->
<u-badge
  variant="outline"
  color="neutral"
  :label="item.name"
/>
```

```vue
<!-- ✅ async button -->
<u-button
  variant="subtle"
  icon="lucide:trash"
  loading-auto
  @click="handleDelete()"
/>
```
### `>` and `/>` placement

Single-line tags keep their closer on the same line (`<u-icon name="lucide:check" />`, `<div class="space-y-3">`).

**Split (multiline-attribute) non-self-closing:** `>` on the **same line** as the last attribute:

```vue
<div
  v-if="show"
  :class="{
    'p-3': !fluidBody,
  }">
  ...
</div>
```

**Split self-closing (childless multi-attribute or multiline attribute):** `/>` on its **own line**; always a space before `/>`:

```vue
<component
  :is="elementsMap[field.identifier]"
  :field="field"
  :class="{
    'p-2': true,
  }"
/>
```

Closing tags for block components (`</un-card>`, `</u-modal>`, …) always on their own line.

### Text interpolation

Put `{{ ... }}` on its own line (not glued onto the opening/closing tag). **Static + dynamic text may mix** in the same interpolation or around it — do not force template literals / split words solely to isolate dynamics:

```vue
<h1 class="text-2xl font-semibold">
  Login
</h1>

<!-- ✅ static + dynamic together -->
<h1 class="text-2xl font-semibold">
  Welcome, {{ user.name }}!
</h1>

<h2 class="mt-1">
  {{ flashCardData?.category?.name }} - by {{ flashCardData?.owner?.name }}
</h2>

<!-- ❌ glued to tags -->
<h1 class="text-2xl font-semibold">{{ user.name }}</h1>
```

### Root structure

- One root node when possible
- If multiple sibling sections are needed, wrap in a single root (`div` etc.)
- Sibling cards/sections often use `class="space-y-3"` on the root wrapper
- The root wrapper follows [Child spacing](#child-spacing-hard-rule) like any other tag: blank lines after the opener / between sections / before the closer when it holds several sections, flush when it holds exactly one

```vue
<template>
  <div class="space-y-3">

    <un-card ...>
      ...
    </un-card>

    <un-card ...>
      ...
    </un-card>

  </div>
</template>
```

### Refs in templates

Refs unwrap automatically — do not write `.value` in template expressions or in object literals bound from the template.

---

## Pages, routing, and data fetching

These are part of the same “shape” conventions when generating app code:

- Pages / named routes / `/* params */` / `/* seo */` → [pages.md](pages.md)
- `ufetch` / `useUFetch` wrapping, naming, options order → [data-fetching.md](data-fetching.md)

### `useUFetch` wrapping (summary)

```ts
const { data: ordersData, pending: isOrdersLoading, refresh: refreshOrders } = useUFetch(
  computed(() => `/api/patients/${patientUid.value}/orders`),
  {
    query: {
      limit: itemsPerPage,
    },
  },
);
```

- First line: destructure + `= useUFetch(`
- Next line: URL (string or `computed`)
- Optional multi-line options object
- Closing `);` alone on the last line
- Consecutive `useUFetch` calls: **one** blank line between them

### `ufetch` wrapping (summary)

Keep `ufetch(url, {` on one line — do not break the URL above `{`.

---

## Light naming (reading shape)

| Context | Convention |
|---------|------------|
| Async / UI action handlers | `handleXxx` (`handleLogin`, `handleResourceDelete`) |
| Short sync helpers | no `handle` prefix (`refresh`, `formatDate`) |
| Short `.map` / `.filter` / `.find` (≤ ~3 lines) | parameter name `it`; omit parens: `it =>` |
| `for...of` / `v-for` | descriptive names — not `u`, `fo`, `doc` abbreviations |
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

for (const resource of resources) {
  ...
}
```

Pass handler **references** into action objects / watchers when possible (`onClick: handleResourceCreate`), instead of unnecessary `() => handleResourceCreate()` wrappers — unless arguments must be adapted.

---

## Server / plain TS files

Same whitespace, brace, literal, and call-formatting rules as script blocks. Honor the **file-start** rule (two leading blanks, or imports flush at line 1). Prefer `async event =>` style consistent with siblings:

```ts


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


  return resources.authenticationTokens.dbo.create({
    document: {
      user: user._id,
      token: generateUuid(),
      isActive: true,
    },
  });

});
```

---

## Anti-patterns (quick)

| Don’t | Do |
|-------|-----|
| `<script setup lang="ts">` | `<script setup>` |
| `UButton` / `UnCard` | `u-button` / `un-card` |
| `<div v-if="x">` | `<template v-if="x"><div>` |
| `if (!x) return;` | braced block |
| `} else {` | `}\nelse {` |
| `toastSuccess({ title: 'x' })` one-liner object | multi-line object + trailing comma |
| Empty object/array split (`{\n}`, `[\n]`) | `{}` / `[]` on one line |
| Multiline assignment flush against neighbors | one blank line before and after |
| Two blank lines around a multiline assignment (when not a group/major-step boundary) | exactly one |
| Splitting a tag with children that has no multiline attribute (wrapping for count/length) | keep all attributes on one line with the opening tag |
| Childless multi-attribute tag on one line | split: opening tag on its own line, one attribute per line, `/>` on its own line |
| Empty open/close pair (`<div ...></div>`) | self-close (`<div ... />`) |
| Keeping a tag single-line when it has a multiline attribute | split: opening tag on its own line, one attribute per line, value like JS |
| Blank lines around a tag's only child | Single child hugs the parent — no blank lines inside the tag |
| Children of a multi-child tag packed with no blank lines | One blank line after the opener, between each pair of children, and before the closer |
| Two blank lines between children | Exactly one |
| Gluing `v-if` / `v-else-if` / `v-else` branches together | Each branch is its own child — blank line between branches |
| `>` on its own line after attrs | `>` after last attr |
| `{{ x }}` glued to tags | interpolation on its own line (static + dynamic mix OK) |
| `ghost` on non-Cancel buttons | `ghost` only for Cancel |
| Hoisted import block | imports co-located under section |
| `computed(() => [ ... ])` | `computed(() => { return [ ... ]; })` |
| Early-return ladder in a return-only decision function | Compact exhaustive `if` / `else if` / `else` |
| Multiple nested ternaries across component attributes | Explicit component variants in `<template v-if>` / `v-else` branches |
| `color="neutral"` on badge | omit `color` / use `undefined` |
| `ufetch(\n  url,\n  {` | `ufetch(url, {` on one line |
| One-line `useUFetch(...)` | URL on next line; options multi-line |
| `.ts`/`.js` with no leading blanks (and no imports) | two blank lines at file start |
| Blank lines before first `import` | `import` on line 1 |
| Blank lines around a function that is only one `for` / `if` / `try` chain | Function `{` / `}` flush against that block |
| Layer-private component in `components/` | `app/atoms/` |
| Layer-private util in `utils/` or `composables/` | `app/libs/` |
| `~/atoms/...` / `#layers/.../atoms` / `#layers/.../libs` | Relative `../atoms/...` / `../libs/...` |
| Import another layer's `atoms` or `libs` | Promote to `components/` / `utils/`, then auto-import |

---

## Checklist before finishing an edit

- [ ] `<script setup>` without `lang="ts"`; no TS annotations in Vue
- [ ] 2-space indent; single quotes; semicolons; trailing commas in multi-line literals
- [ ] `.js`/`.ts`: two leading blank lines, or imports flush at line 1 (no blanks before first import)
- [ ] Every `<script setup>` section starts with `/* section name */`, followed by a blank line
- [ ] Declarations are grouped by kind inside each section: two blanks between groups; no blanks between consecutive single-line refs; one blank between other same-kind declarations; multiline assignments isolated with one blank before and after
- [ ] Non-trivial workflow functions: blank after `{`, double blanks between major steps, blank before `}`
- [ ] Single-block functions (one `for` / `while` / `if`, or one connected `if` / `else` / `try` / `catch` chain) stay flush with the function braces
- [ ] Tiny helpers stay tight
- [ ] Return-only multi-criteria functions use a compact exhaustive `if` / `else if` / `else`; broader functions may use early returns
- [ ] `else` / `catch` on new line
- [ ] Script objects/arrays multi-line with trailing commas, **except** empty `{}` / `[]` which stay one line; multiline assignments have one blank line before and after (the JS/TS single-line principle does not cover templates); template tags stay single-line unless a multiline attribute (multi-line array/object/function binding) forces a split; single-pair scalar objects (e.g. `:ui="{ content: '...' }"`) stay inline
- [ ] Kebab-case component tags
- [ ] Child spacing: every tag with one child is flush; every tag with 2+ children has exactly one blank line after the opener, between each pair of children, and before the closer (each `v-if` / `v-else-if` / `v-else` branch counts as a child)
- [ ] `v-if` / `v-for` on `<template>` wrappers
- [ ] Conditional states that change several attributes use explicit `<template v-if>` component variants, not nested ternaries
- [ ] Tags with children keep all attributes on one line with the opening tag unless a multiline attribute forces a split (opening tag on its own line, one attribute per line, value like JS); childless tags are self-closing — single single-line attribute stays inline, otherwise tag and attributes each go on their own line with `/>` on its own line; closing `>` / `/>` placement is correct
- [ ] Attribute order + default-value omissions respected (`subtle`, **Cancel → `ghost` only**, no neutral color noise, `loading-auto`)
- [ ] `{{ }}` on own line (static + dynamic mix OK)
- [ ] Every section is named; imports are co-located with the section that uses them
- [ ] `handleXxx` for action handlers; `it` for short callbacks; descriptive loop names
- [ ] Computeds that return structures use block + `return`
- [ ] Pages: explicit `definePageMeta.name`, `/* params */` + `/* seo */` placement, named navigation ([pages.md](pages.md))
- [ ] Fetching: `ufetch` / `useUFetch` wrap styles and destructure names ([data-fetching.md](data-fetching.md))
- [ ] New layer components/utils start in `app/atoms/` or `app/libs/`; `atoms`/`libs` imported with relative paths only; promote to `components/` / `utils/` only when another layer needs them
