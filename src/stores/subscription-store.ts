import {
  getSubscriptionsService,
  generateQrCodeService,
  sendCreditCardData,
  activeSubscriptionFreeService,
} from 'src/services/subscription-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import { useAuthStore } from './auth-store';

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    loadingSubscription: false as boolean,
    listSubscription: [] as ISubscriptions[],
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingSubscription = loading;
    },
    clearListSubscription() {
      this.listSubscription.splice(0, this.listSubscription.length);
    },
    setListSubscription(subscriptions: ISubscriptions[]) {
      subscriptions.map((item) => this.listSubscription.push(item));
    },
    async getSubscriptions() {
      this.setLoading(true);
      try {
        const response = await getSubscriptionsService();
        if (response.status === 200) {
          this.clearListSubscription();
          this.setListSubscription(response.data.subscriptions);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async generateQrCode(subscriptionID: number) {
      this.setLoading(true);
      try {
        const response = await generateQrCodeService(subscriptionID);
        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async sendCreditCardData(paymentCreditCard: IPaymentSubscriptionCreditCard) {
      this.setLoading(true);
      try {
        const response = await sendCreditCardData(paymentCreditCard);
        if (response.status === 200) {
          return response;
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async activeSubscriptionFree() {
      this.setLoading(true);
      try {
        const response = await activeSubscriptionFreeService();
        if (response.status === 200) {
          useAuthStore().setUser(response.data.user);
          createSuccess(response.data.message);
          return response;
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
