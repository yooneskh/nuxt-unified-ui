# Layer setup

## Required host setup

Consumers must:

1. Create `assets/css/main.css` in the host app with:

```css
@import 'tailwindcss';
@import '@nuxt/ui';
@import 'nuxt-unified-ui/nuxt-ui-fixes.css';
```

2. Extend the layer and register that CSS file:

```js

/* responsibility */

// Configures the host app
// on top of nuxt-unified-ui.


import { pathRelativeToBase } from 'nuxt-unified-ui';


export default defineNuxtConfig({
  css: [
    pathRelativeToBase(import.meta.url, './assets/css/main.css'),
  ],
  extends: [
    'nuxt-unified-ui',
  ],
});
```

Both are required:

- `css: [pathRelativeToBase(import.meta.url, './assets/css/main.css')]`
- `@import 'nuxt-unified-ui/nuxt-ui-fixes.css'` inside that host CSS file

`pathRelativeToBase(base, path)` resolves a path relative to a file URL / base (re-exported from package root; implemented in `app/utils/path-relative.ts`).

## Peer / stack

- Peer dependency: `nuxt >= 4.6.1` (required)
- Bundled deps (layer): `@nuxt/ui`, `@nuxtjs/i18n`, `@vueuse/nuxt`, `@vueuse/core`, `radashi`, `unified-mongo-filter`, `@formkit/tempo`, `canvas-confetti`, `@types/canvas-confetti`, Lucide iconify JSON, `@nuxt/kit`

## Modules

Configured in layer `nuxt.config.ts`:

```ts
modules: [
  '@vueuse/nuxt',
  '@nuxt/ui',
  '@nuxtjs/i18n',
]
```

Additionally, Nuxt auto-loads `modules/radashi.ts`, which registers every radashi export as `rad` + PascalCase name (`get` → `radGet`, `pick` → `radPick`, `camel` → `radCamel`, …) in both the Vue app (`addImports`) and Nitro server (`addServerImports`). Full catalog: [radashi.md](radashi.md).

## UI defaults

```ts
ui: {
  colorMode: false,
  theme: {
    defaultVariants: {
      color: 'neutral',
    },
  },
}
```

`app/app.config.js` tightens Nuxt UI card/table slots. Host may override via its own `app.config` (e.g. `ui.colors.primary` / `neutral`).

## Date defaults

`app/app.config.js` also holds the defaults `formatDate` / `parseDate` fall back to:

```js
dateFormat: {
  format: 'YYYY/MM/DD HH:mm',
  locale: 'en-US',
},
```

The host overrides them in its own `app.config` — one key at a time is enough, the layer default fills the rest:

```js
export default defineAppConfig({
  dateFormat: {
    locale: 'de-DE',
  },
});
```

`formatDate(timestamp)` and `parseDate(date, format)` use those defaults; an explicit `format` / `locale` argument still wins. The values are read from the app config, so they work in the app and in Nitro, and a runtime `updateAppConfig()` still re-renders them.

## i18n

```ts
i18n: {
  strategy: 'no_prefix',
  defaultLocale: 'en',
  locales: [
    { code: 'en', file: 'en.json' },
    { code: 'de', file: 'de.json' },
  ],
}
```

Locale files live in `i18n/locales/`. Series dialogs and common buttons use keys under `common.*` and `un.series.*`.

Because this layer registers `@nuxtjs/i18n`, Nuxt UI reads the active i18n locale on its own: `u-app` needs no `:locale` prop, and the host must not pass one or import `@nuxt/ui/locale`. Only the locale files matching `i18n.locales` are bundled, and the locale's `dir` is applied globally, so a right-to-left entry turns the whole app RTL on its own.

## App shell

The host's `app.vue` wraps its tree in `u-app`:

```vue
<template>
  <u-app>
    <NuxtLayout />
  </u-app>
</template>
```

`u-app` mounts the toaster that `toast*` needs and provides the locale, tooltip, and overlay contexts every layer component reads. Never re-wrap a subtree in a second `u-app`.

## Layer CSS export

`nuxt-unified-ui/nuxt-ui-fixes.css` declares the `tablet` and `desktop` breakpoints and the `rtl` / `ltr` direction utilities (`app/assets/css/nuxt-ui-fixes.css`). Import it from the host `main.css` as shown above.
