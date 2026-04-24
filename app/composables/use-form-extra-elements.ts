

export function useFormExtraElements() {
  return useState(
    '--nuxt-unified-ui-form-extra-elements--',
    () => [] as { identifier: string; component: any }[],
  );
}
