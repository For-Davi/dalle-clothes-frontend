import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import {
  showEnterpriseService,
  updateEnterpriseService,
  deleteEnterpriseService,
} from 'src/services/enterprise-service';

export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    loadingEnterprise: false as boolean,
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingEnterprise = loading;
    },
    async showEnterprise() {
      try {
        this.setLoading(true);
        const response = await showEnterpriseService();

        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateEnterprise(data: IDataEnterprise) {
      this.setLoading(true);
      try {
        const response = await updateEnterpriseService(data);
        if (response.status === 200) {
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
    async deleteEnterprise() {
      this.setLoading(true);
      try {
        const response = await deleteEnterpriseService();
        if (response.status === 200) {
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
  },
});
