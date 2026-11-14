# Layer setup

## Required host setup

Consumers must:

1. Create `assets/css/main.css` in the host app with:

```css
@import 'tailwindcss';
@import '@nuxt/ui';
@import 'nuxt-unified-ui/nuxt-ui-fixes.css';
```

`nuxt-unified-ui/nuxt-ui-fixes.css` (`app/assets/css/nuxt-ui-fixes.css`) declares the `tablet` and `desktop` breakpoints and the `rtl` / `ltr` direction utilities.

2. Extend the layer and register that CSS file. `pathRelativeToBase(base, path)` resolves a path relative to a file URL. It is re-exported from the package root and implemented in `app/utils/path-relative.ts`.

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

Both are required: `css: [pathRelativeToBase(import.meta.url, './assets/css/main.css')]`, and `@import 'nuxt-unified-ui/nuxt-ui-fixes.css'` inside that host CSS file.

## Peer / stack

- Peer dependency: `nuxt >= 4.6.1` (required)
- Bundled deps (layer): `@nuxt/ui`, `@nuxtjs/i18n`, `@vueuse/nuxt`, `@vueuse/core`, `radashi`, `unified-mongo-filter`, `@formkit/tempo`, `canvas-confetti`, `@types/canvas-confetti`, Lucide iconify JSON, `@nuxt/kit`

## Modules

Configured in the layer `nuxt.config.ts`:

```ts
modules: [
  '@vueuse/nuxt',
  '@nuxt/ui',
  '@nuxtjs/i18n',
]
```

Nuxt also auto-loads `modules/radashi.ts`, which registers every radashi export as `rad` + PascalCase (`get` → `radGet`, `pick` → `radPick`, `camel` → `radCamel`, …) in the Vue app (`addImports`) and on the Nitro server (`addServerImports`). Catalog: [radashi.md](radashi.md).

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

`app/app.config.js` tightens Nuxt UI card and table slots. The host may override them in its own `app.config` (for example `ui.colors.primary` / `neutral`).

## Date defaults

`app/app.config.js` also holds the defaults `formatDate` / `parseDate` fall back to:

```js
dateFormat: {
  format: 'YYYY/MM/DD HH:mm',
  locale: 'en-US',
},
```

The host overrides them in its own `app.config`. One key at a time is enough; the layer default fills the rest:

```js
export default defineAppConfig({
  dateFormat: {
    locale: 'de-DE',
  },
});
```

`formatDate(timestamp)` and `parseDate(date, format)` use those defaults. An explicit `format` or `locale` argument still wins. The values are read from the app config, so they work in the app and in Nitro, and a runtime `updateAppConfig()` still re-renders them.

## i18n

```ts
i18n: {
  strategy: 'no_prefix',
  defaultLocale: 'en',
  locales: [
    {
      code: 'en',
      language: 'en-US',
      file: 'en.json',
    },
    {
      code: 'de',
      language: 'de-DE',
      file: 'de.json',
    },
    {
      code: 'fa',
      language: 'fa-IR',
      dir: 'rtl',
      file: 'fa.json',
    },
  ],
}
```

`strategy` and `defaultLocale` are this layer's config. Nuxt merges them into an app that extends the layer. Locale ownership, and leaving those two keys unset in the app, is in `SKILL.md`.

Locale files live in `i18n/locales/`. Series dialogs and common buttons use keys under `common.*` and `un.series.*`.

Because this layer registers `@nuxtjs/i18n`, Nuxt UI reads the active locale on its own. `u-app` needs no `:locale` prop. The host must not pass one or import `@nuxt/ui/locale`. Only the locale files matching `i18n.locales` are bundled. The locale's `dir` is applied globally, so a right-to-left entry turns the whole app RTL on its own.

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
