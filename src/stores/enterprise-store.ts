import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import {
  getEnterpriseService,
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
    async getUSerEnterprise() {
      try {
        this.setLoading(true);
        const response = await getEnterpriseService();

        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateEnterpriseData(data: IDataEnterprise) {
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
    async deleteEnterpriseData(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteEnterpriseService(id);
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
