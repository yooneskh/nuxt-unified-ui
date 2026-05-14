

declare module 'nuxt-unified-ui' {
  export function pathRelativeToBase(base: string, path: string): string;
}

declare module 'unified-mongo-filter' {
  export function matches(filter: object, target: any): boolean;
}
