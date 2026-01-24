import { defineStore } from 'pinia';
import { createError } from 'src/composables/CreateNotify';
import { getReturnItemsService } from 'src/services/return-service';

export const useReturnStore = defineStore('return', {
  state: () => ({
    loadingReturn: false as boolean,
    listReturnItems: [] as IDataReturnItens[],
  }),
  actions: {
    clearListReturnItems() {
      this.listReturnItems.splice(0, this.listReturnItems.length);
    },
    setLoading(loading: boolean) {
      this.loadingReturn = loading;
    },
    setListReturnItems(data: IDataReturnItens[]) {
      data.map((item) => this.listReturnItems.push(item));
    },
    async getReturnItems(returnID: number) {
      try {
        this.setLoading(true);
        const response = await getReturnItemsService(returnID);

        if (response.status === 200) {
          this.clearListReturnItems();
          this.setListReturnItems(response.data.products);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
