# Nuxt unified code style

**Mandatory** whenever generating or editing code in a Nuxt project that uses this stack. Applies to **all** Nuxt project files: Vue SFCs and `.ts`/`.js` under `app/`, `server/`, composables, utils, plugins, middleware, etc.

This document is about the **look and shape** of code — whitespace, wrapping, braces, template structure, sectioning, and light naming that affects scanning — not business logic or architecture.

---

## Higher-level reasoning

Write code so a reader can **scan vertically** and see structure before details.

1. **Paragraphs of logic, not walls of text.**
   Double blank lines mark major boundaries (sections, handlers, big steps). Single blank lines separate related statements inside a section. Tiny one-liner helpers stay tight — do not decorate them with empty lines.

2. **Breathing room inside non-trivial blocks.**
   A non-trivial function/computed is a mini-document: blank line after `{`, full-block guards, double blank between guard/setup and the main sequence, blank line before `}`. That rhythm makes async flows readable without comments.

3. **One idea per line in structured data.**
   Object/array literals in script are multi-line with trailing commas — even single-property objects passed to helpers (`toastSuccess`, `ufetch` options, etc.). Compact one-liners hide diffs and force horizontal reading.

4. **Templates are layout, not mini-scripts.**
   Structural directives live on `<template>` wrappers so the rendered node stays a clean component/element. Attributes wrap predictably (`u-modal` stays one line); closing `>` / `/>` placement is consistent; interpolations sit on their own line (static + dynamic text may share one `{{ ... }}` or surrounding text).

5. **Section comments are the map.**
   `/* section */` labels replace scavenger hunts through long `<script setup>` blocks. Imports sit next to the section that needs them, not in a hoisted pile at the top.

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

---

## Vertical whitespace (script / TS)

### Section rhythm

- **Double blank line** between major boundaries: after `defineProps`/`defineEmits` blocks, between `/* section */` domains, before handler functions, between major async steps.
- **Single blank line** within a section (related consts, consecutive small helpers).
- Blank line **before and after** each `/* section */` comment.
- Blank line before `</script>`.
- **Two** blank lines between `</script>` and `<template>`.

### Non-trivial functions and computeds

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

Blank line before and after the comment. Avoid comments that only restate obvious option names.

### Script ordering

**Components / dialogs**

1. `/* interface */`
2. State refs
3. Computeds
4. Watchers / lifecycle
5. Handlers / async functions
6. `/* outlets */` / `defineExpose` if needed

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
- **2+ attributes:** one attribute per line — **except `u-modal`**
- **`u-modal` only:** keep **all** attributes on the **same single line** as the tag (do not wrap), even when there are many

```vue
<!-- ✅ 0–1 attributes — inline OK -->
<div class="space-y-3">
<u-form-field label="Captcha">
  ...
</u-form-field>
<u-icon name="lucide:check" />

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

Same whitespace, brace, literal, and call-formatting rules as script blocks:

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

Leading blank line at top of file is fine when the local tree uses it. Prefer `async event =>` style consistent with siblings.

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
| 3 attrs on one line (non-`u-modal`) | one attr per line |
| Multi-line `u-modal` attrs | keep `u-modal` attrs on one line |
| `>` on its own line after attrs | `>` after last attr |
| `{{ x }}` glued to tags | interpolation on its own line (static + dynamic mix OK) |
| `ghost` on non-Cancel buttons | `ghost` only for Cancel |
| Hoisted import block | imports co-located under section |
| `computed(() => [ ... ])` | `computed(() => { return [ ... ]; })` |
| `color="neutral"` on badge | omit `color` / use `undefined` |
| `ufetch(\n  url,\n  {` | `ufetch(url, {` on one line |
| One-line `useUFetch(...)` | URL on next line; options multi-line |

---

## Checklist before finishing an edit

- [ ] `<script setup>` without `lang="ts"`; no TS annotations in Vue
- [ ] 2-space indent; single quotes; semicolons; trailing commas in multi-line literals
- [ ] Double blanks between major sections; blank line before `</script>`; two blanks before `<template>`
- [ ] Non-trivial functions: blank after `{`, double blank between major steps, blank before `}`
- [ ] Tiny helpers stay tight
- [ ] `else` / `catch` on new line
- [ ] Script objects multi-line; template single-key objects may be inline
- [ ] Kebab-case component tags
- [ ] `v-if` / `v-for` on `<template>` wrappers
- [ ] 2+ attributes → one per line (**`u-modal` attrs stay on one line**); `>` same line as last attr; multi-line self-closing `/>` on own line
- [ ] Attribute order + default-value omissions respected (`subtle`, **Cancel → `ghost` only**, no neutral color noise, `loading-auto`)
- [ ] `{{ }}` on own line (static + dynamic mix OK)
- [ ] Section comments + import co-location where the file has sections
- [ ] `handleXxx` for action handlers; `it` for short callbacks; descriptive loop names
- [ ] Computeds that return structures use block + `return`
- [ ] Pages: explicit `definePageMeta.name`, reactive route params, named navigation ([pages.md](pages.md))
- [ ] Fetching: `ufetch` / `useUFetch` wrap styles and destructure names ([data-fetching.md](data-fetching.md))
