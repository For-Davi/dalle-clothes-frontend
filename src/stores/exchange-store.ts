import { defineStore } from 'pinia';
import { createError } from 'src/composables/CreateNotify';
import { getExchangesService } from 'src/services/exchange-service';

export const useExchangeStore = defineStore('exchange', {
  state: () => ({
    loadingExchange: false as boolean,
    listExchanges: [] as IExchanges[],
  }),
  actions: {
    clearListExchange() {
      this.listExchanges.splice(0, this.listExchanges.length);
    },
    setLoading(loading: boolean) {
      this.loadingExchange = loading;
    },
    setListExchange(data: IExchanges[]) {
      data.map((item) => this.listExchanges.push(item));
    },
    async getExchanges(saleID: number) {
      try {
        this.setLoading(true);
        const response = await getExchangesService(saleID);

        if (response.status === 200) {
          this.clearListExchange();
          this.setListExchange(response.data.exchanges);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    // async getReturnItems(returnID: number) {
    //   try {
    //     this.setLoading(true);
    //     const response = await getReturnItemsService(returnID);

    //     if (response.status === 200) {
    //       this.clearListReturnItems();
    //       this.setListReturnItems(response.data.products);
    //     }
    //   } catch (error) {
    //     createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
  },
});
