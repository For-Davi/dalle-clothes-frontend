import { defineStore } from 'pinia';
import { createError } from 'src/composables/CreateNotify';
import { createSaleService } from 'src/services/sale-service';

export const useSaleStore = defineStore('sale', {
  state: () => ({
    loadingSale: false as boolean,
    listSale: [] as IReceipt[],
  }),
  actions: {
    clearListSale() {
      this.listSale.splice(0, this.listSale.length);
    },
    setLoading(loading: boolean) {
      this.loadingSale = loading;
    },
    setListSale(sale: IReceipt[]) {
      sale.map((item) => this.listSale.push(item));
    },
    async createSale(data: IDataSale) {
      this.setLoading(true);
      try {
        const response = await createSaleService(data);

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
