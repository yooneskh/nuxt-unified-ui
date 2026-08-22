import { addImports, addServerImports, defineNuxtModule } from '@nuxt/kit';
import * as radashi from 'radashi';


export default defineNuxtModule({
  meta: {
    name: 'nuxt-radashi',
  },
  setup() {
    for (const name of Object.keys(radashi)) {

      const spec = {
        name,
        as: `rad${radashi.pascal(name)}`,
        from: 'radashi',
      };

      addImports(spec);
      addServerImports(spec);

    }
  },
});
