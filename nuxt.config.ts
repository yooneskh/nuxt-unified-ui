

export {
  pathRelativeToBase,
} from './app/utils/path-relative';


export default defineNuxtConfig({

  compatibilityDate: 'latest',
  devtools: { enabled: false },

  experimental: {
    typedPages: true,
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  ui: {
    colorMode: false,
    theme: {
      defaultVariants: {
        color: 'neutral',
      },
    },
  },

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
  },

});
