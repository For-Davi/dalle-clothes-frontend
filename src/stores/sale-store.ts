import { defineStore } from 'pinia';
import { createError } from 'src/composables/CreateNotify';
import {
  createSaleService,
  showSaleCouponDataService,
  showSaleService,
  sendCouponToEmailService,
  getSalesService,
  getSaleItensService,
} from 'src/services/sale-service';

export const useSaleStore = defineStore('sale', {
  state: () => ({
    loadingSale: false as boolean,
    loadingListSale: false as boolean,
    loadingListSaleProducts: false as boolean,
    Sale: {} as ISale,
    listSale: [] as ISales[],
    listSaleProducts: [] as ISaleItens[],
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
    setLoading(loading: boolean) {
      this.loadingSale = loading;
    },
    setLoadingList(loading: boolean) {
      this.loadingListSale = loading;
    },
    setLoadingListProduct(loading: boolean) {
      this.loadingListSaleProducts = loading;
    },
    setListSale(sales: ISales[]) {
      this.listSale = sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    setSale(sale: ISale) {
      this.Sale = sale;
    },
    setSaleProduct(saleProduct: ISaleItens[]) {
      saleProduct.map((item) => this.listSaleProducts.push(item));
    },
    async getSales() {
      try {
        this.setLoadingList(true);
        const response = await getSalesService();

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
    async getSaleItens(saleID: number) {
      try {
        this.setLoadingListProduct(true);
        const response = await getSaleItensService(saleID);
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
  },
});
