

export function registerFormExtraElement(args: { identifier: string; component: any }) {
  useFormExtraElements().value.push({
    identifier: args.identifier,
    component: markRaw(args.component),
  });
}
