

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
    locales: [
      {
        code: 'en',
        file: 'en.json',
      },
      {
        code: 'de',
        file: 'de.json',
      },
    ],
  },

});
