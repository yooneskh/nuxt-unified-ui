

export default defineNuxtPlugin(() => {
  return {
    provide: {
      $toaster: useToast(),
    },
  };
});
