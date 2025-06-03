import type { Router } from 'vue-router';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
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

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.token) {
      next({ name: 'auth' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
