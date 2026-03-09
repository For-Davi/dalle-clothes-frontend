import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import {
  getExchangesService,
  createExchangePaymentService,
  createDifferencePaymentService,
  showExchangeService,
} from 'src/services/exchange-service';

export const useExchangeStore = defineStore('exchange', {
  state: () => ({
    loadingExchanges: false as boolean,
    loadingExchange: false as boolean,
    listExchanges: [] as IExchanges[],
    Exchange: {} as IExchange,
  }),
  actions: {
    clearListExchange() {
      this.listExchanges.splice(0, this.listExchanges.length);
    },
    clearExchange() {
      this.Exchange = {} as IExchange;
    },
    setLoading(loading: boolean) {
      this.loadingExchange = loading;
    },
    setExchangesLoading(loading: boolean) {
      this.loadingExchanges = loading;
    },
    setListExchange(data: IExchanges[]) {
      data.map((item) => this.listExchanges.push(item));
    },
    setExchange(data: IExchange) {
      this.Exchange = data;
    },
    async getExchanges(saleID: number) {
      try {
        this.setExchangesLoading(true);
        const response = await getExchangesService(saleID);

        if (response.status === 200) {
          this.clearListExchange();
          this.setListExchange(response.data.exchanges);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setExchangesLoading(false);
      }
    },
    async showExchange(exchangeID: number) {
      try {
        this.setLoading(true);
        const response = await showExchangeService(exchangeID);

        if (response.status === 200) {
          this.clearExchange();
          this.setExchange(response.data.exchange);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createExchangePayment(data: IExchangePaymentData) {
      try {
        this.setLoading(true);
        const response = await createExchangePaymentService(data);

        if (response.status === 201) {
          this.clearListExchange();
          this.setListExchange(response.data.exchanges);
          createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createDifferencePayment(data: IDifferencePaymentData) {
      try {
        this.setLoading(true);
        const response = await createDifferencePaymentService(data);

        if (response.status === 201) {
          this.clearListExchange();
          this.setListExchange(response.data.exchanges);
          createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
