import { pathRelativeToBase } from './app/utils/path-relative';


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

  css: [
    pathRelativeToBase(import.meta.url, './app/assets/css/main.css'),
  ],

  ui: {
    colorMode: false,
  },

  extends: [
    './layers/unified-toast',
    './layers/unified-dialog',
    './layers/unified-form',
  ],

});
