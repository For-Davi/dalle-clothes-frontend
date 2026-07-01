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
    path: '/reset-password/:token(.*)',
    name: 'resetPassword',
    component: () => import('src/pages/ResetPassword.vue'),
    props: true,
  },
  {
    path: '/seller/reset-password/:token(.*)',
    name: 'sellerResetPassword',
    component: () => import('src/pages/Seller/ResetPassword.vue'),
    props: true,
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
        meta: { permission: 'dashboard.view' },
      },
      {
        path: 'delivery',
        name: 'delivery',
        component: () => import('src/pages/Delivery.vue'),
        meta: { permission: 'delivery.view' },
      },
      // {
      //   path: 'store',
      //   name: 'store',
      //   component: () => import('src/pages/Store.vue'),
      // },
      // {
      //   path: 'coupon',
      //   name: 'coupon',
      //   component: () => import('src/pages/Coupon.vue'),
      // },
      {
        path: 'stock',
        name: 'stock',
        component: () => import('src/pages/Stock.vue'),
        meta: { permission: 'product.view' },
      },
      {
        path: 'sale',
        name: 'sale',
        component: () => import('src/pages/Sale.vue'),
        meta: { permission: 'sale.view' },
      },
      {
        path: 'employee',
        name: 'employee',
        component: () => import('src/pages/Employee.vue'),
        meta: { permission: 'employee.view' },
      },
      {
        path: 'payment',
        name: 'payment',
        component: () => import('src/pages/Payment.vue'),
        meta: { permission: 'sale.create' },
      },
      {
        path: 'client',
        name: 'client',
        component: () => import('src/pages/Client.vue'),
        meta: { permission: 'client.view' },
      },
      {
        path: 'results',
        name: 'results',
        component: () => import('src/pages/Result.vue'),
        meta: { permission: 'commission.view' },
      },
      {
        path: 'supplier',
        name: 'supplier',
        component: () => import('src/pages/Supplier.vue'),
        meta: { permission: 'supplier.view' },
      },
      // {
      //   path: 'diary',
      //   name: 'diary',
      //   component: () => import('src/pages/Diary.vue'),
      // },
      // {
      //   path: 'fidelity',
      //   name: 'fidelity',
      //   component: () => import('src/pages/Fidelity.vue'),
      // },
      {
        path: 'subscription',
        name: 'subscription',
        component: () => import('src/pages/Subscription.vue'),
        meta: { permission: 'subscription.payment' },
      },
      {
        path: 'receipt',
        name: 'receipt',
        component: () => import('src/pages/Receipts.vue'),
        meta: { permission: 'receipt.view' },
      },
      {
        path: 'transaction',
        name: 'transaction',
        component: () => import('src/pages/Transaction.vue'),
        meta: { permission: 'transaction.view' },
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('src/pages/User.vue'),
        meta: { permission: 'user.view' },
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('src/pages/Role.vue'),
        meta: { permission: 'role.view' },
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('src/pages/Setting.vue'),
        meta: { permission: 'config.view' },
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('src/pages/Help.vue'),
      },
    ],
  },
  {
    path: '/seller',
    component: () => import('src/layouts/SellerLayout.vue'),
    meta: { requiresAuth: true, roles: 'seller' },
    children: [
      {
        path: '',
        redirect: { name: 'dashboard-seller' },
      },
      {
        path: 'dashboard',
        name: 'dashboard-seller',
        component: () => import('src/pages/Seller/Dashboard.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

export default routes;
