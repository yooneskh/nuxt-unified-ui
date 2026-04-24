

export default defineNuxtPlugin((nuxtApp) => {
  registerFormExtraElement({
    identifier: 'test',
    component: defineAsyncComponent(() => import('../elements/form-element-test.vue')),
  });
});
