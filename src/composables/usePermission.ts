import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

export function usePermission() {
  const { user } = storeToRefs(useAuthStore());

  const hasPermission = (slug: string): boolean =>
    user.value?.role?.permissions?.some((p) => p.slug === slug) ?? false;

  const can = (slug: string) => computed(() => hasPermission(slug));

  return { hasPermission, can };
}
