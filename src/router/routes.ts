import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('src/pages/Index.vue'),
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('src/pages/Auth.vue'),
  },
  {
    path: '/admin',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'dashboard' },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('src/pages/Dashboard.vue'),
      },
      {
        path: 'command-order',
        name: 'command-order',
        component: () => import('src/pages/CommandOrder.vue'),
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('src/pages/Order.vue'),
      },
      {
        path: 'launch',
        name: 'launch',
        component: () => import('src/pages/Launch.vue'),
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('src/pages/Category.vue'),
      },
      {
        path: 'product',
        name: 'product',
        component: () => import('src/pages/Product.vue'),
      },
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('src/pages/Coupon.vue'),
      },
      {
        path: 'offer',
        name: 'offer',
        component: () => import('src/pages/Offer.vue'),
      },
      {
        path: 'workspace',
        name: 'workspace',
        component: () => import('src/pages/Workspace.vue'),
      },
      {
        path: 'stock',
        name: 'stock',
        component: () => import('src/pages/Stock.vue'),
      },
      {
        path: 'payment',
        name: 'payment',
        component: () => import('src/pages/Payment.vue'),
      },
      {
        path: 'motorcyclist',
        name: 'motorcyclist',
        component: () => import('src/pages/Motorcyclist.vue'),
      },
      {
        path: 'supplier',
        name: 'supplier',
        component: () => import('src/pages/Supplier.vue'),
      },
      {
        path: 'diary',
        name: 'diary',
        component: () => import('src/pages/Diary.vue'),
      },
      {
        path: 'fidelity',
        name: 'fidelity',
        component: () => import('src/pages/Fidelity.vue'),
      },
      {
        path: 'subscription',
        name: 'subscription',
        component: () => import('src/pages/Subscription.vue'),
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('src/pages/Account.vue'),
      },
      {
        path: 'movement',
        name: 'movement',
        component: () => import('src/pages/Movement.vue'),
      },
      {
        path: 'schedule',
        name: 'schedule',
        component: () => import('src/pages/Schedule.vue'),
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('src/pages/User.vue'),
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('src/pages/Department.vue'),
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('src/pages/Setting.vue'),
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('src/pages/Help.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

export default routes;
