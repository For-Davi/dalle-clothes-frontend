import { getTypesReceiptService } from 'src/services/types-receipt-service';
import { defineStore } from 'pinia';
import { createError } from 'src/composables/CreateNotify';

export const useTypesReceiptStore = defineStore('typesReceipt', {
  state: () => ({
    loadingTypesReceipt: false as boolean,
    listTypesReceipt: [] as ITypesReceipt[],
  }),
  actions: {
    clearListTypesReceipt() {
      this.listTypesReceipt.splice(0, this.listTypesReceipt.length);
    },
    setLoading(loading: boolean) {
      this.loadingTypesReceipt = loading;
    },
    setListTypesReceipt(types: ITypesReceipt[]) {
      types.map((item) => this.listTypesReceipt.push(item));
    },
    async getTypesReceipt() {
      try {
        this.setLoading(true);
        const response = await getTypesReceiptService();
        if (response.status === 200) {
          this.clearListTypesReceipt();
          this.setListTypesReceipt(response.data.types);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
