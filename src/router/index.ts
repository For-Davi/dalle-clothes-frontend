import type { Router } from 'vue-router';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { useSellerStore } from 'src/stores/DalleAdm/seller-store';
import routes from './routes';

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

const router: Router = createRouter({
  history: createHistory(process.env.VUE_ROUTER_BASE),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const sellerStore = useSellerStore();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!requiresAuth) {
    return next();
  }

  const isSellerRoute = to.matched.some((record) => record.meta.roles === 'seller');

  if (isSellerRoute) {
    if (!sellerStore.token) {
      return next({ name: 'home' });
    }
  } else {
    if (!authStore.token) {
      return next({ name: 'auth' });
    }
  }

  next();
});

export default router;
