import { defineNuxtModule, addImports } from '@nuxt/kit';
import * as radashi from 'radashi';


export default defineNuxtModule({
  meta: {
    name: 'nuxt-radashi',
  },
  setup() {
    for (const name of Object.keys(radashi)) {

      const prefix = 'rad';
      const as = `${prefix}${radashi.pascal(name)}`;

      addImports({
        name,
        as,
        from: 'radashi',
      });

    }
  },
});
