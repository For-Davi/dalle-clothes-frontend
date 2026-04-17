import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import {
  createDeliveryGuyService,
  getDeliveryGuysService,
  showDeliveryGuyService,
  deleteDeliveryGuyService,
  updateDeliveryGuyService,
} from 'src/services/delivery-guy-service';

export const useDeliveryGuyStore = defineStore('deliveryGuy', {
  state: () => ({
    loadingDeliveryGuy: false as boolean,
    deliveryGuy: {} as IDeliveryGuy,
    listDeliveryGuy: [] as IDeliveryGuy[],
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingDeliveryGuy = loading;
    },
    clearListDeliveryGuy() {
      this.listDeliveryGuy.splice(0, this.listDeliveryGuy.length);
    },
    clearDeliveryGuy() {
      this.deliveryGuy = {} as IDeliveryGuy;
    },
    setDeliveryGuy(deliveryGuy: IDeliveryGuy) {
      this.deliveryGuy = deliveryGuy;
    },
    setListDeliveryGuy(deliveryGuy: IDeliveryGuy[]) {
      deliveryGuy.map((item) => this.listDeliveryGuy.push(item));
    },
    async getDeliveryGuys() {
      this.setLoading(true);
      try {
        const response = await getDeliveryGuysService();
        if (response.status === 200) {
          this.clearListDeliveryGuy();
          this.setListDeliveryGuy(response.data.deliveriesGuys);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async showDeliveryGuy(deliveryGuyID: number) {
      this.setLoading(true);
      try {
        return await showDeliveryGuyService(deliveryGuyID);
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createDeliveryGuy(data: IDeliveryGuy) {
      this.setLoading(true);
      try {
        const response = await createDeliveryGuyService(data);
        if (response.status === 201) {
          this.clearListDeliveryGuy();
          this.setListDeliveryGuy(response.data.deliveryGuys);
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
    async updateDeliveryGuy(deliveryGuyID: number, data: IDeliveryGuy) {
      this.setLoading(true);
      try {
        const response = await updateDeliveryGuyService(
          deliveryGuyID,
          data.name,
          data.email,
          data.cpf,
          data.phone,
          data.vehicle,
        );
        if (response.status === 200) {
          this.clearListDeliveryGuy();
          this.setListDeliveryGuy(response.data.deliveriesGuys);
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
    async deleteDeliveryGuy(deliveryGuyID: number) {
      this.setLoading(true);
      try {
        const response = await deleteDeliveryGuyService(deliveryGuyID);
        if (response.status === 201) {
          this.clearListDeliveryGuy();
          this.setListDeliveryGuy(response.data.deliveriesGuys);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
