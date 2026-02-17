import {
  getTypesReceiptService,
  getTypesReceiptFilterService,
  getTypesReceiptWithoutCreditService,
} from 'src/services/types-receipt-service';
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
    async getTypesReceipt(
      filter: IFilterReceipt | null = null,
      type: 'withoutCredit' | null = null,
    ) {
      try {
        this.setLoading(true);
        let response = null;
        if (filter) {
          response = await getTypesReceiptFilterService(filter);
        }
        if (!filter && type === 'withoutCredit') {
          response = await getTypesReceiptWithoutCreditService();
        }
        if (!filter && !type) {
          response = await getTypesReceiptService();
        }
        if (response?.status === 200) {
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
