/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { boot } from 'quasar/wrappers';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { useSellerStore } from 'src/stores/DalleAdm/seller-store';
import { storeToRefs } from 'pinia';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const apiSeller = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost/api',
});

export default boot(({ app, router }) => {
  const { token: tokenValue } = storeToRefs(useSellerStore());

  const logout = async () => {
    useSellerStore().setToken(null);
    useSellerStore().setSeller(null);
    await router.push({ name: 'home' });
  };

  apiSeller.interceptors.request.use(
    (config) => {
      const token = tokenValue.value;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error || 'Erro desconhecido'),
  );

  apiSeller.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && error.response.data?.message === 'Unauthenticated.') {
        await logout();
      }
      return Promise.reject(error || 'Erro desconhecido');
    },
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = apiSeller;
});

export { apiSeller };
