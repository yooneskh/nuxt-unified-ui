import { pathRelativeToBase } from 'nuxt-unified-ui';


export default defineNuxtConfig({

  css: [
    pathRelativeToBase(import.meta.url, './assets/css/main.css'),
  ],

  extends: [
    'nuxt-unified-ui',
  ],

});
