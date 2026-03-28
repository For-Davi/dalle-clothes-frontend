import { getComissionsBySaleService, getComissionsService } from 'src/services/commission-service';
import { defineStore } from 'pinia';
import { createError } from 'src/composables/CreateNotify';

export const useCommissionStore = defineStore('commission', {
  state: () => ({
    loadingCommission: false as boolean,
    listCommission: [] as ICommission[],
    listCommissionPeriod: [] as ICommissionPeriod[],
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingCommission = loading;
    },
    clearListCommission() {
      this.listCommission.splice(0, this.listCommission.length);
    },
    setListCommission(comission: ICommission[]) {
      comission.map((item) => this.listCommission.push(item));
    },
    clearListCommissionPeriod() {
      this.listCommissionPeriod.splice(0, this.listCommissionPeriod.length);
    },
    setListCommissionPeriod(comission: ICommissionPeriod[]) {
      comission.map((item) => this.listCommissionPeriod.push(item));
    },
    async getComissionsBySale(saleID: number) {
      this.setLoading(true);
      try {
        const response = await getComissionsBySaleService(saleID);
        if (response.status === 200) {
          this.clearListCommission();
          this.setListCommission(response.data.commissions);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getComissions(filters: IFilterCommission) {
      this.setLoading(true);
      try {
        const response = await getComissionsService(filters);
        if (response.status === 200) {
          this.clearListCommissionPeriod();
          this.setListCommissionPeriod(response.data.commissions);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
