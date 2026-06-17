import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';

export interface ResourceLimit {
  limit: number | 'unlimited';
  hideButtonAndShowBanner?: boolean;
}

export type PlanConfig = Record<IPlans, ResourceLimit>;

export const PLAN_LIMITS: Record<string, PlanConfig> = {
  clients: {
    free: { limit: 5 },
    basic: { limit: 10 },
    premium: { limit: 'unlimited' },
  },
  users: {
    free: { limit: 1 },
    basic: { limit: 5 },
    premium: { limit: 'unlimited' },
  },
  employees: {
    free: { limit: 1 },
    basic: { limit: 10 },
    premium: { limit: 'unlimited' },
  },
  suppliers: {
    free: { limit: 1 },
    basic: { limit: 10 },
    premium: { limit: 'unlimited' },
  },
  supplier_orders: {
    free: { limit: 0, hideButtonAndShowBanner: true },
    basic: { limit: 0, hideButtonAndShowBanner: true },
    premium: { limit: 'unlimited' },
  },
  receipts: {
    free: { limit: 2, hideButtonAndShowBanner: true },
    basic: { limit: 'unlimited' },
    premium: { limit: 'unlimited' },
  },
  movements_schedules: {
    free: { limit: 5 },
    basic: { limit: 20 },
    premium: { limit: 'unlimited' },
  },
  departments: {
    free: { limit: 1 },
    basic: { limit: 10 },
    premium: { limit: 'unlimited' },
  },
  roles: {
    free: { limit: 1 },
    basic: { limit: 5 },
    premium: { limit: 'unlimited' },
  },
  grids: {
    free: { limit: 1 },
    basic: { limit: 2 },
    premium: { limit: 'unlimited' },
  },
  colors: {
    free: { limit: 5 },
    basic: { limit: 10 },
    premium: { limit: 'unlimited' },
  },
  tags: {
    free: { limit: 5 },
    basic: { limit: 10 },
    premium: { limit: 'unlimited' },
  },
  products: {
    free: { limit: 5 },
    basic: { limit: 100 },
    premium: { limit: 10000 },
  },
  sales: {
    free: { limit: 50 },
    basic: { limit: 'unlimited' },
    premium: { limit: 'unlimited' },
  },
};

export const checkRegisterLimit = (resourceKey: string, currentCount: number) => {
  const { user } = storeToRefs(useAuthStore());

  const userPlan = user.value?.enterprise.subscription.name as keyof PlanConfig;

  const resourceConfig = PLAN_LIMITS[resourceKey];
  if (!resourceConfig || !userPlan || !resourceConfig[userPlan]) {
    return { canAdd: true, showUpgradeBanner: false };
  }

  const config = resourceConfig[userPlan];

  if (config.hideButtonAndShowBanner) {
    return { canAdd: false, showUpgradeBanner: true };
  }

  if (config.limit === 'unlimited') {
    return { canAdd: true, showUpgradeBanner: false };
  }

  const reachedLimit = currentCount >= config.limit;

  return {
    canAdd: !reachedLimit,
    showUpgradeBanner: reachedLimit,
  };
};
