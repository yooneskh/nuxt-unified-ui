# Nuxt unified code style

**Mandatory** whenever generating or editing code in a Nuxt project that uses this stack. Applies to **all** Nuxt project files: Vue SFCs and `.ts`/`.js` under `app/`, `server/`, composables, utils, plugins, middleware, etc.

This document is about the **look and shape** of code — whitespace, wrapping, braces, template structure, sectioning, and light naming that affects scanning — not business logic or architecture.

---

## Higher-level reasoning

Write code so a reader can **scan vertically** and see structure before details.

1. **Sections contain declaration-kind groups.**
   Start each logical `<script setup>` domain with a `/* section name */` comment and a blank line. Within that section, group imports, refs, computeds, watchers, functions, and other declarations by kind. Double blank lines separate groups; refs stay tightly stacked; consecutive members of other groups have one blank line between them.

2. **Function body spacing follows the work.**
   A non-trivial workflow function is a mini-document: blank line after `{`, full-block guards, double blanks between major steps, and a blank before `}`. A function whose body is one control block — or one connected `if` / `else` / `else if` or `try` / `catch` / `finally` chain — stays flush: no blanks between the function braces and that block. Small helpers and functions whose whole job is choosing a return value stay compact.

3. **One idea per line in structured data.**
   Object/array literals in script are multi-line with trailing commas — even single-property objects passed to helpers (`toastSuccess`, `ufetch` options, etc.). Compact one-liners hide diffs and force horizontal reading.

4. **Templates are layout, not mini-scripts.**
   Structural directives live on one-line `<template>` wrappers so the rendered node stays a clean component/element. Rendered component attributes wrap predictably (`u-modal` stays one line); closing `>` / `/>` placement is consistent; interpolations sit on their own line (static + dynamic text may share one `{{ ... }}` or surrounding text).

5. **Section comments are the map.**
   `/* section */` labels define logical domains, while declaration-kind spacing exposes the structure inside each domain. Imports sit in the section that needs them, not in a hoisted pile at the top.

6. **Names that match role.**
   Handlers read as actions (`handleLogin`), short callbacks use `it`, loops use real nouns. Shape and naming reinforce each other so you rarely need narrating comments.

7. **Vue scripts stay runtime-shaped.**
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
- Keep consecutive refs together with **no blank lines**.
- Use **one blank line between consecutive declarations** in other same-kind groups, including computeds, watchers, and functions.
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

If the function has **any other statement** besides that one block (a guard plus a loop, setup then a `for`, two separate `if`s, …), use the non-trivial workflow spacing instead. Interior spacing *inside* the block still follows the other rules.

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

### Script literals — always multi-line

In script and `.ts` files, object literals use one property per line and a trailing comma — **including single-property objects** in call args:

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

- Single-key object binding may stay inline: `:ui="{ content: 'max-w-7xl' }"`
- Multi-key template object/array bindings are multi-line
- Simple scalars and simple ternaries stay inline; break only when branches become objects/arrays or nested structure
- When one condition changes several attributes, labels/icons, or an object-shaped binding such as `to`, use adjacent `<template v-if>` / `v-else-if` / `v-else` branches with explicit component variants. Prefer small markup duplication over nested ternaries and overly dynamic attributes.

```vue
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
- `defineEmits`: array of strings, **always multi-line** (even one event)
- `defineModel` uses `{ type, default? }` (required by Vue) — that object still follows multi-line literal rules

### Section comments

Group with `/* name */`:

| Common section | Contents |
|----------------|----------|
| `/* interface */` | props, emits, models |
| `/* page */` | `definePageMeta`, `useHead` |
| domain names | `/* login */`, `/* resource */`, `/* captcha */`, … |
| `/* outlets */` | `defineExpose` |

The comment names a logical domain, not a declaration kind. Follow it with a blank line, then organize that domain into declaration-kind groups. Avoid comments that only restate obvious option names.

```ts
/* resource */

import ResourceExplorerCell from '~/atoms/resource-explorer-cell.vue';


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

1. `/* page */`
2. Route/params
3. Data / forms / domain sections
4. Watchers / lifecycle
5. Handlers

### Import co-location

Place non-auto-imported imports **inside the section that uses them**, not hoisted at the top of the file:

```ts
/* charts */

import { VisXYContainer, VisLine } from '@unovis/vue';
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

Keep tight `v-if` / `v-else` chains adjacent (no blank line between matching branches inside small slots). Blank lines are OK between large top-level page/card state branches.

### Attribute wrapping (hard rule)

- **0–1 attributes:** may stay on one line with the tag
- **Structural `<template>` wrappers:** keep the opening tag on one line, even with several directives, keys, or dynamic slot bindings
- **2+ attributes on rendered elements/components:** one attribute per line — **except `u-modal`**
- **`u-modal` only:** keep **all** attributes on the **same single line** as the tag (do not wrap), even when there are many

```vue
<!-- ✅ 0–1 attributes — inline OK -->
<div class="space-y-3">
<u-form-field label="Captcha">
  ...
</u-form-field>
<u-icon name="lucide:check" />

<!-- ✅ structural template wrappers stay on one line -->
<template v-for="column in columns" :key="column.accessorKey" #[column.accessorKey+'-cell']="{ row }">
  ...
</template>

<!-- ✅ u-modal — always one line (exception) -->
<u-modal :ui="{ content: 'max-w-5xl' }" scrollable @update:open="!$event && emit('close')">
  ...
</u-modal>

<!-- ✅ other components — 2+ attributes, one per line -->
<u-button
  variant="subtle"
  icon="lucide:refresh-ccw"
  @click="refresh"
/>
```

### Attribute order

When wrapping, order attributes as:

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
- Action objects (`:actions`, `:append-actions`, table row actions): `vIf` → `color` → `icon` → `label` → `tooltip` → `disabled` → `to` → `onClick`
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

**Non-self-closing**, multi-attribute: `>` on the **same line** as the last attribute:

```vue
<un-card
  icon="lucide:key"
  :title="title"
  fluid-body>
  ...
</un-card>
```

**Self-closing**, multi-attribute: `/>` on its **own line**; always a space before `/>`:

```vue
<u-button
  variant="subtle"
  icon="lucide:refresh-ccw"
  @click="refresh"
/>

<u-icon name="lucide:check" />
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
- Prefer a blank line after the root opener and before the root closer when the body is multi-block

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

- Pages / named routes / reactive params → [pages.md](pages.md)
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
| 3 attrs on one line (rendered element/component other than `u-modal`) | one attr per line |
| Multi-line `u-modal` attrs | keep `u-modal` attrs on one line |
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

---

## Checklist before finishing an edit

- [ ] `<script setup>` without `lang="ts"`; no TS annotations in Vue
- [ ] 2-space indent; single quotes; semicolons; trailing commas in multi-line literals
- [ ] `.js`/`.ts`: two leading blank lines, or imports flush at line 1 (no blanks before first import)
- [ ] Every `<script setup>` section starts with `/* section name */`, followed by a blank line
- [ ] Declarations are grouped by kind inside each section: two blanks between groups; no blanks between refs; one blank between other same-kind declarations
- [ ] Non-trivial workflow functions: blank after `{`, double blanks between major steps, blank before `}`
- [ ] Single-block functions (one `for` / `while` / `if`, or one connected `if` / `else` / `try` / `catch` chain) stay flush with the function braces
- [ ] Tiny helpers stay tight
- [ ] Return-only multi-criteria functions use a compact exhaustive `if` / `else if` / `else`; broader functions may use early returns
- [ ] `else` / `catch` on new line
- [ ] Script objects multi-line; template single-key objects may be inline
- [ ] Kebab-case component tags
- [ ] `v-if` / `v-for` on `<template>` wrappers
- [ ] Conditional states that change several attributes use explicit `<template v-if>` component variants, not nested ternaries
- [ ] Structural `<template>` wrappers stay on one line; rendered elements/components with 2+ attributes wrap one per line (**`u-modal` stays on one line**); closing `>` / `/>` placement is correct
- [ ] Attribute order + default-value omissions respected (`subtle`, **Cancel → `ghost` only**, no neutral color noise, `loading-auto`)
- [ ] `{{ }}` on own line (static + dynamic mix OK)
- [ ] Every section is named; imports are co-located with the section that uses them
- [ ] `handleXxx` for action handlers; `it` for short callbacks; descriptive loop names
- [ ] Computeds that return structures use block + `return`
- [ ] Pages: explicit `definePageMeta.name`, reactive route params, named navigation ([pages.md](pages.md))
- [ ] Fetching: `ufetch` / `useUFetch` wrap styles and destructure names ([data-fetching.md](data-fetching.md))
