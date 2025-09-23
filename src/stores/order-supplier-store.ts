import {
  createSupplierOrderService,
  deleteSupplierOrderService,
  getSupplierOrdersService,
  showSupplierOrderService,
  updateSupplierOrderService,
} from 'src/services/order-supplier-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useSupplierOrderStore = defineStore('supplierOrder', {
  state: () => ({
    loadingSupplierOrder: false as boolean,
    listSupplierOrder: [] as ISupplierOrder[],
  }),
  actions: {
    clearListSupplierOrder() {
      this.listSupplierOrder.splice(0, this.listSupplierOrder.length);
    },
    setLoading(loading: boolean) {
      this.loadingSupplierOrder = loading;
    },
    setListSupplieOrderr(orders: ISupplierOrder[]) {
      orders.map((item) => this.listSupplierOrder.push(item));
    },
    async getSupplierOrders() {
      try {
        this.setLoading(true);
        const response = await getSupplierOrdersService();
        if (response.status === 200) {
          this.clearListSupplierOrder();
          this.setListSupplieOrderr(response.data.orders);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async showOrderSupplier(orderID: number) {
      try {
        this.setLoading(true);
        return await showSupplierOrderService(orderID);
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createSupplierOrder(data: IDataSupplierOrder) {
      this.setLoading(true);
      try {
        const response = await createSupplierOrderService(data);
        if (response.status === 201) {
          this.clearListSupplierOrder();
          this.setListSupplieOrderr(response.data.orders);
          createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async updateSupplierOrder(data: IDataSupplierOrder) {
      this.setLoading(true);
      try {
        const response = await updateSupplierOrderService(data);
        if (response.status === 200) {
          this.clearListSupplierOrder();
          this.setListSupplieOrderr(response.data.orders);
          createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async deleteSupplierOrder(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteSupplierOrderService(id);
        if (response.status === 200) {
          this.clearListSupplierOrder();
          this.setListSupplieOrderr(response.data.orders);
          createSuccess(response.data.message);
        }
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
