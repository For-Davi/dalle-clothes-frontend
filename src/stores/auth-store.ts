import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import {
  doLoginService,
  doRegisterService,
  doResetService,
  doVerifyService,
  setNewPasswordService,
  // updateUserDataService,
  // updateUserPasswordService,
} from 'src/services/auth-service';
import type { User } from 'src/ts/User';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loadingAuth: false as boolean,
    user: useStorage('themplus_user', {} as User | null),
    token: useStorage('themplus_token', null as string | null),
    enterpriseCreated: useStorage('enterprise_created', null as string | null),
    enterprisePosition: useStorage('enterprise_position', 'client' as string),
    enterpriseName: useStorage('enterprise_name', null as string | null),
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    setToken(token: string | null) {
      this.token = token;
    },
    setLoading(loading: boolean) {
      this.loadingAuth = loading;
    },
    async doLogin(email: string, password: string) {
      try {
        this.setLoading(true);
        const response = await doLoginService(email, password);
        if (response.status === 200) {
          this.setUser(response.data.user);
          this.setToken(response.data.token);
          this.enterpriseName = response.data.enterprise_name;
          await this.router.push({ name: 'dashboard' });
        }
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
    async setNewPassword(code: string, email: string) {
      try {
        this.setLoading(true);
        const response = await setNewPasswordService(code, email);
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
    async doRegister(name: string, email: string, password: string, nameEnterprise: string) {
      this.setLoading(true);
      try {
        this.setLoading(true);
        const response = await doRegisterService(name, email, password, nameEnterprise);
        if (response.status === 201) {
          this.setUser(response.data.user);
          this.setToken(response.data.token);
          createSuccess(response.data.message);
          await this.router.push({ name: 'dashboard' });
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    // async updateUserData(
    //   name: string,
    //   email: string,
    //   phone: string | null,
    //   department: string | null
    // ) {
    //   try {
    //     this.setLoading(true);
    //     const response = await updateUserDataService(
    //       name,
    //       email,
    //       phone,
    //       department
    //     );
    //     if (response.status === 200) {
    //       this.setUser(response.data.user);

    //       createSuccess(response.data.message)
    //     }
    //   } catch (error) {
    //     createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    // async updateUserPassword(passwordActual: string, passwordNew: string) {
    //   try {
    //     this.setLoading(true);
    //     const response = await updateUserPasswordService(
    //       passwordActual,
    //       passwordNew
    //     );
    //     if (response.status === 200) {
    //       createSuccess(response.data.message)
    //     }
    //   } catch (error) {
    //     createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
  },
});
