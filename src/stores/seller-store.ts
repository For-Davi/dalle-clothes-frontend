import { createSellerRegistrationService } from 'src/services/seller-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useSellerStore = defineStore('seller', {
  state: () => ({
    loadingSeller: false as boolean,
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingSeller = loading;
    },
    async createSellerRegistration(data: IDataSellerRegistration) {
      this.setLoading(true);
      try {
        const response = await createSellerRegistrationService(data);
        if (response.status === 201) {
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
