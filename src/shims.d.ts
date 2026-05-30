import type { ComputedRef } from 'vue';

declare module 'vue' {
  interface ComponentCustomProperties {
    can: (slug: string) => ComputedRef<boolean>;
    hasPermission: (slug: string) => boolean;
  }
}
