import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import {
  getReturnItemsService,
  getReturnService,
  createReturnService,
  showReturnService,
  updateReturnService,
  getStockReentryReturnItemsService,
  deleteReturnService,
  sendCouponToEmailService,
} from 'src/services/return-service';

export const useReturnStore = defineStore('return', {
  state: () => ({
    loadingReturn: false as boolean,
    loadingReturns: false as boolean,
    listReturnItems: [] as IDataReturnItens[],
    listReturns: [] as IReturns[],
    Return: {} as IReturn,
  }),
  actions: {
    clearListReturnItems() {
      this.listReturnItems.splice(0, this.listReturnItems.length);
    },
    clearListReturn() {
      this.listReturns = [];
    },
    clearReturn() {
      this.Return = {} as IReturn;
    },
    setLoading(loading: boolean) {
      this.loadingReturn = loading;
    },
    setReturnsLoading(loading: boolean) {
      this.loadingReturns = loading;
    },
    setListReturnItems(data: IDataReturnItens[]) {
      data.map((item) => this.listReturnItems.push(item));
    },
    setListReturns(data: IReturns[]) {
      data.map((item) => this.listReturns.push(item));
    },
    setReturn(data: IReturn) {
      this.Return = data;
    },
    async getReturns(saleID: number) {
      try {
        this.setReturnsLoading(true);
        const response = await getReturnService(saleID);

        if (response.status === 200) {
          this.clearListReturn();
          this.setListReturns(response.data.returns);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setReturnsLoading(false);
      }
    },
    async showReturn(returnID: number) {
      try {
        this.setLoading(true);
        const response = await showReturnService(returnID);

        if (response.status === 200) {
          this.clearReturn();
          this.setReturn(response.data.return);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getReturnItems(returnID: number, notDelivered: number | null = null) {
      try {
        this.setLoading(true);
        const response = await getReturnItemsService(returnID, notDelivered);

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
    async getStockReentryReturnItems() {
      try {
        this.setLoading(true);
        return await getStockReentryReturnItemsService();
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createReturn(data: IDataCreateReturn) {
      try {
        this.setLoading(true);
        const response = await createReturnService(data);

        if (response.status === 201) {
          this.clearListReturn();
          this.setListReturns(response.data.returns);
          createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateReturn(id: number, saleID: number, status: string) {
      try {
        this.setLoading(true);
        const response = await updateReturnService(id, saleID, status);

        if (response.status === 200) {
          this.clearListReturn();
          this.setListReturns(response.data.returns);
          createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteReturn(saleID: number, returnID: number) {
      this.setReturnsLoading(true);
      try {
        const response = await deleteReturnService(saleID, returnID);

        if (response.status === 200) {
          this.clearListReturn();
          this.setListReturns(response.data.returns);
          createSuccess(response.data.message);
        }
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setReturnsLoading(false);
      }
    },
    async sendCouponToEmail(returnID: number, email: string) {
      this.setLoading(true);
      try {
        return await sendCouponToEmailService(returnID, email);
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
