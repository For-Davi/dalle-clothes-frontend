import { boot } from 'quasar/wrappers';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({ baseURL: process.env.VITE_API_BASE_URL || 'http://localhost/api' });

export default boot(({ app, router }) => {
  const { token: tokenValue } = storeToRefs(useAuthStore());

  const logout = async () => {
    useAuthStore().setToken(null);
    useAuthStore().setUser(null);
    await router.push('/');
  };

  api.interceptors.request.use(
    (config) => {
      const token = tokenValue.value;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(new Error(error.message || 'Erro desconhecido'))
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (
        error.response?.status === 401 &&
        error.response.data?.message === 'Unauthenticated.'
      ) {
        await logout();
      }
      return Promise.reject(new Error(error.message || 'Erro desconhecido'))
    }
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
