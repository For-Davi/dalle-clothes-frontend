import { getComissionSelectService } from 'src/services/commission-service';
import { defineStore } from 'pinia';
import { createError } from 'src/composables/CreateNotify';

export const useCommissionStore = defineStore('commission', {
  state: () => ({
    loadingCommission: false as boolean,
    listCommission: [] as ICommission[],
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
    async getComissionsSelect(saleID: number) {
      this.setLoading(true);
      try {
        const response = await getComissionSelectService(saleID);
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
  },
});
