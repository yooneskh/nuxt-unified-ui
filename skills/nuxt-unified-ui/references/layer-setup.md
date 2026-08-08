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
import { pathRelativeToBase } from 'nuxt-unified-ui'

export default defineNuxtConfig({
  css: [
    pathRelativeToBase(import.meta.url, './assets/css/main.css'),
  ],
  extends: [
    'nuxt-unified-ui',
  ],
})
```

Both are required:

- `css: [pathRelativeToBase(import.meta.url, './assets/css/main.css')]`
- `@import 'nuxt-unified-ui/nuxt-ui-fixes.css'` inside that host CSS file

`pathRelativeToBase(base, path)` resolves a path relative to a file URL / base (re-exported from package root; implemented in `app/utils/path-relative.ts`).

## Peer / stack

- Peer dependency: `nuxt >= 4.5.2` (required)
- Bundled deps (layer): `@nuxt/ui`, `@nuxtjs/i18n`, `@vueuse/nuxt`, `@vueuse/core`, `radashi`, `unified-mongo-filter`, `@formkit/tempo`, Lucide iconify JSON, `@nuxt/kit`

## Modules

Configured in layer `nuxt.config.ts`:

```ts
modules: [
  '@vueuse/nuxt',
  '@nuxt/ui',
  '@nuxtjs/i18n',
]
```

Additionally, Nuxt auto-loads `modules/radashi.ts`, which registers every radashi export as `rad` + PascalCase name (`get` → `radGet`, `pick` → `radPick`, `camel` → `radCamel`, …). Full catalog: [radashi.md](radashi.md).

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

## Layer CSS export

`nuxt-unified-ui/nuxt-ui-fixes.css` provides theme breakpoints, `rtl`/`ltr` utilities, and small layout/table fixes (`app/assets/css/nuxt-ui-fixes.css`). Import it from the host `main.css` as shown above.
