import { pathRelativeToBase } from 'nuxt-unified-ui';


export default defineNuxtConfig({

  css: [
    pathRelativeToBase(import.meta.url, './assets/css/main.css'),
  ],

  extends: [
    'nuxt-unified-ui',
  ],

  hooks: {
    'vite:extendConfig'(config) {
      config.plugins.push({
        name: 'playground-vite-client-timers',
        enforce: 'post',
        transform(code, id) {
          if (!id.split('?')[0].endsWith('/vite/dist/client/client.mjs')) {
            return;
          }
          else {
            return code.replace(/^import\s*\{[^}]*\}\s*from\s*["'][^"']*compat\/(?:interval|idle-callback)[^"']*["'];?\s*/gm, '');
          }
        },
      });
    },
  },

});
