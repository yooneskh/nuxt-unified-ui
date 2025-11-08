import { defineNuxtModule, addImports } from "@nuxt/kit";
import * as radash from "radash";


export default defineNuxtModule({
  meta: {
    name: "nuxt-radash",
  },
  setup() {
    for (const name of Object.keys(radash)) {

      const prefix = 'rad';
      const as = `${prefix}${radash.pascal(name)}`;

      addImports({
        name,
        as,
        from: "radash",
      });

    }
  },
});
