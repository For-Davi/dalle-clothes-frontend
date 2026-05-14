import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import router from 'src/router';
import {
  doLoginService,
  getDashboardService,
  updateSellerDataService,
  updateSellerPasswordService,
  doResetService,
  createSellerRegistrationService,
  setNewPasswordService,
} from 'src/services/DalleAdm/seller-service';

export const useSellerStore = defineStore('seller', {
  state: () => ({
    loadingSeller: false as boolean,
    loadingDashboard: false as boolean,
    seller: useStorage('dalle_manage_seller', {} as ISeller | null),
    token: useStorage('dalle_manage_seller_token', null as string | null),
    dashboard: [] as ISellerDashboard[],
  }),
  actions: {
    setSeller(seller: ISeller | null) {
      this.seller = seller;
    },
    setToken(token: string | null) {
      this.token = token;
    },
    setDashboard(dashboard: ISellerDashboard[]) {
      this.dashboard = dashboard;
    },
    setLoading(loading: boolean) {
      this.loadingSeller = loading;
    },
    setDashboardLoading(loading: boolean) {
      this.loadingDashboard = loading;
    },
    async createSellerRegistration(data: IDataSellerRegistration) {
      this.setLoading(true);
      try {
        const response = await createSellerRegistrationService(data);
        if (response.status === 201) {
          createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async doLogin(cpf: string | null, password: string | null, token: string | null = null) {
      try {
        this.setLoading(true);
        const response = await doLoginService(cpf, password, token);
        if (response.status === 200) {
          this.setSeller(response.data.seller);
          this.setToken(response.data.token);

          await router.push({ name: 'dashboard-seller' });
        }
        return response;
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateSellerData(name: string, email: string) {
      try {
        this.setLoading(true);
        const response = await updateSellerDataService(name, email);
        if (response.status === 200) {
          this.setSeller(response.data.seller);
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
    async updateSellerPassword(passwordActual: string, passwordNew: string) {
      try {
        this.setLoading(true);
        const response = await updateSellerPasswordService(passwordActual, passwordNew);
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
    async setNewPassword(password: string, token: string) {
      try {
        this.setLoading(true);
        const response = await setNewPasswordService(password, token);
        if (response.status === 200) {
          createSuccess(response.data.message);
          await router.push({ name: 'home' });
        }

        return response;
      } catch (error) {
        createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },
    async getDashboard(filter: ISellerFilterDashboard | null = null) {
      try {
        this.setDashboardLoading(true);
        const response = await getDashboardService(filter);
        if (response.status === 200) {
          this.setDashboard(response.data.dashboard);
        }
        return response;
      } catch (error) {
        createError(error);
      } finally {
        this.setDashboardLoading(false);
      }
    },
  },
});
