import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import {
  doLoginService,
  doRegisterService,
  doResetService,
  doVerifyService,
  setNewPasswordService,
  updateUserDataService,
  updateUserPasswordService,
} from 'src/services/auth-service';
import router from 'src/router';
import { useSettingsStore } from './setting-store';
import { getFirstAllowedRoute } from 'src/router/helper';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loadingAuth: false as boolean,
    user: useStorage('dalle_manage_user', {} as IUser | null),
    token: useStorage('dalle_manage_token', null as string | null),
    enterpriseCreated: useStorage('enterprise_created', null as string | null),
    enterprisePosition: useStorage('enterprise_position', 'client' as string),
    enterpriseName: useStorage('enterprise_name', null as string | null),
  }),
  actions: {
    setUser(user: IUser | null) {
      this.user = user;
    },
    setToken(token: string | null) {
      this.token = token;
    },
    setLoading(loading: boolean) {
      this.loadingAuth = loading;
    },
    async doLogin(email: string | null, password: string | null, token: string | null = null) {
      try {
        this.setLoading(true);
        const response = await doLoginService(email, password, token);
        if (response.status === 200) {
          this.setUser(response.data.user);
          this.setToken(response.data.token);
          this.enterpriseName = response.data.enterprise_name;

          const firstRoute = getFirstAllowedRoute(response.data.user);
          await router.push({ name: firstRoute });
          await useSettingsStore().getAppearanceSetting();
        }
        return response;
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async doReset(email: string) {
      try {
        this.setLoading(true);
        const response = await doResetService(email);
        if (response.status === 200) {
          createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async doVerify(code: string, email: string) {
      try {
        this.setLoading(true);
        const response = await doVerifyService(code, email);
        if (response.status === 200) {
          if (response.data.valid) {
            createSuccess(response.data.message);
          } else {
            createError('Código inválido');
          }
        }

        return response;
      } catch (error) {
        createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async setNewPassword(password: string, token: string) {
      try {
        this.setLoading(true);
        const response = await setNewPasswordService(password, token);
        if (response.status === 200) {
          createSuccess(response.data.message);
          await router.push({ name: 'auth' });
        }

        return response;
      } catch (error) {
        createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async doRegister(
      name: string,
      email: string,
      password: string,
      nameEnterprise: string,
      sellerCode: string | null,
    ) {
      this.setLoading(true);
      try {
        this.setLoading(true);
        const response = await doRegisterService(name, email, password, nameEnterprise, sellerCode);
        if (response.status === 201) {
          this.setUser(response.data.user);
          this.setToken(response.data.token);
          createSuccess(response.data.message);

          await router.push({ name: 'dashboard' });
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateUserData(
      name: string,
      email: string,
      photoAdd: IMediaItem | null,
      photoDelete: number | null,
    ) {
      try {
        this.setLoading(true);
        const response = await updateUserDataService(name, email, photoAdd, photoDelete);
        if (response.status === 200) {
          this.setUser(response.data.user);
          createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        createError(error);
        console.error('ERRO', error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async updateUserPassword(passwordActual: string, passwordNew: string) {
      try {
        this.setLoading(true);
        const response = await updateUserPasswordService(passwordActual, passwordNew);
        if (response.status === 200) {
          createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
