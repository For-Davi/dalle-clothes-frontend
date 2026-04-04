import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import {
  getDeliveriesService,
  showDeliveryService,
  scheduleDeliveryService,
  getDeliveryDashboardService,
  createPartialDeliveredDeliveryService,
} from 'src/services/delivery-service';

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    loadingDeliveries: false as boolean,
    loadingDelivery: false as boolean,
    listDelivery: [] as IDelivery[],
    Delivery: {} as IDelivery,
    Dashboard: {} as IDashboardDelivery,
  }),
  actions: {
    setLoadingDeliveries(loading: boolean) {
      this.loadingDeliveries = loading;
    },
    setLoading(loading: boolean) {
      this.loadingDelivery = loading;
    },
    clearListDelivery() {
      this.listDelivery.splice(0, this.listDelivery.length);
    },
    clearDelivery() {
      this.Delivery = {} as IDelivery;
    },
    clearDashboard() {
      this.Dashboard = {} as IDashboardDelivery;
    },
    setListDelivery(delivery: IDelivery[]) {
      delivery.map((item) => this.listDelivery.push(item));
    },
    setDelivery(delivery: IDelivery) {
      this.Delivery = delivery;
    },
    setDashboard(dashboard: IDashboardDelivery) {
      this.Dashboard = dashboard;
    },
    async getDeliveries(status: string) {
      this.setLoadingDeliveries(true);
      try {
        const response = await getDeliveriesService(status);
        if (response.status === 200) {
          this.clearListDelivery();
          this.setListDelivery(response.data.deliveries);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoadingDeliveries(false);
      }
    },
    async getDashboardDelivery() {
      this.setLoadingDeliveries(true);
      try {
        const response = await getDeliveryDashboardService();
        if (response.status === 200) {
          this.clearDashboard();
          this.setDashboard(response.data.dashboard);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoadingDeliveries(false);
      }
    },
    async showDelivery(deliveryID: number) {
      this.setLoading(true);
      try {
        const response = await showDeliveryService(deliveryID);
        if (response.status === 200) {
          this.clearDelivery();
          this.setDelivery(response.data.delivery);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async scheduleDelivery(
      deliveryID: number,
      schedule: string,
      deliveryGuyID: number | null,
      status: string,
    ) {
      this.setLoading(true);
      try {
        const response = await scheduleDeliveryService(deliveryID, schedule, deliveryGuyID, status);
        if (response.status === 200) {
          this.clearListDelivery();
          this.setListDelivery(response.data.deliveries);
        }
        return response;
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async createPartialDeliveredDelivery(
      deliveryID: number,
      deliveredProducts: IDeliveredProducts[],
      status: string,
    ) {
      this.setLoading(true);
      try {
        const response = await createPartialDeliveredDeliveryService(
          deliveryID,
          deliveredProducts,
          status,
        );
        if (response.status === 200) {
          this.clearListDelivery();
          this.setListDelivery(response.data.deliveries);
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
