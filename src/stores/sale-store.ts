import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import {
  createSaleService,
  showSaleCouponDataService,
  showSaleService,
  sendCouponToEmailService,
  getSalesService,
  getSaleItensService,
  createSaleCancellationService,
  getSaleCancellationService,
  deleteSaleService,
  getSalesServiceFilterService,
} from 'src/services/sale-service';

export const useSaleStore = defineStore('sale', {
  state: () => ({
    loadingSale: false as boolean,
    loadingListSale: false as boolean,
    loadingListSaleProducts: false as boolean,
    loadingCancellation: false as boolean,
    Sale: {} as ISale,
    listSale: [] as ISales[],
    listSaleProducts: [] as ISaleItens[],
    saleCancellation: {} as ISaleCancellation,
  }),
  actions: {
    clearListSale() {
      this.listSale.splice(0, this.listSale.length);
    },
    clearListSaleProducts() {
      this.listSaleProducts.splice(0, this.listSaleProducts.length);
    },
    clearSale() {
      this.Sale = {} as ISale;
    },
    clearCancellation() {
      this.saleCancellation = {} as ISaleCancellation;
    },
    setLoading(loading: boolean) {
      this.loadingSale = loading;
    },
    setLoadingList(loading: boolean) {
      this.loadingListSale = loading;
    },
    setLoadingListProduct(loading: boolean) {
      this.loadingListSaleProducts = loading;
    },
    setLoadingCancellation(loading: boolean) {
      this.loadingCancellation = loading;
    },
    setListSale(sales: ISales[]) {
      sales.map((item) => this.listSale.push(item));
    },
    setSale(sale: ISale) {
      this.Sale = sale;
    },
    setSaleProduct(saleProduct: ISaleItens[]) {
      saleProduct.map((item) => this.listSaleProducts.push(item));
    },
    setCancellation(cancellation: ISaleCancellation) {
      this.saleCancellation = cancellation;
    },
    async getSales(filter: IFilterSale | null = null) {
      try {
        this.setLoadingList(true);
        let response = null;

        if (filter) {
          response = await getSalesServiceFilterService(filter);
        } else {
          response = await getSalesService();
        }

        if (response.status === 200) {
          this.clearListSale();
          this.setListSale(response.data.sales);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoadingList(false);
      }
    },
    async showSale(saleID: number) {
      try {
        this.setLoading(true);
        const response = await showSaleService(saleID);
        if (response.status === 200) {
          this.clearSale();
          this.setSale(response.data.sale);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getSaleItens(saleID: number, notDelivered: number | null = null) {
      try {
        this.setLoadingListProduct(true);
        const response = await getSaleItensService(saleID, notDelivered);
        if (response.status === 200) {
          this.clearListSaleProducts();
          this.setSaleProduct(response.data.saleItens);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoadingListProduct(false);
      }
    },
    async getSaleCancellation(saleID: number) {
      try {
        this.setLoadingCancellation(true);
        const response = await getSaleCancellationService(saleID);
        if (response.status === 200) {
          this.clearCancellation();
          this.setCancellation(response.data.cancellation);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoadingCancellation(false);
      }
    },
    async showSaleCouponData(saleID: number) {
      try {
        this.setLoading(true);
        return await showSaleCouponDataService(saleID);
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
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
    async createSaleCancellation(data: IDataSaleCancellation) {
      this.setLoadingCancellation(true);
      try {
        const response = await createSaleCancellationService(data);

        if (response.status === 200) {
          createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoadingCancellation(false);
      }
    },
    async sendCouponToEmail(saleID: number, email: string) {
      this.setLoading(true);
      try {
        return await sendCouponToEmailService(saleID, email);
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async deleteSale(saleID: number) {
      this.setLoadingList(true);
      try {
        const response = await deleteSaleService(saleID);
        if (response.status === 200) {
          this.clearListSale();
          this.setListSale(response.data.sales);
          createSuccess(response.data.message);
        }
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoadingList(false);
      }
    },
  },
});
