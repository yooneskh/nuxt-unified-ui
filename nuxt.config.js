

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
  ],

  ui: {
    colorMode: false,
    theme: {
      defaultVariants: {
        color: 'neutral',
      },
    },
  },

});
