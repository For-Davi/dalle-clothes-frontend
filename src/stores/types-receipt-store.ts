import {
  getTypesReceiptService,
  createTypesReceiptService,
  updateTypesReceiptService,
  deleteTypesReceiptService,
} from 'src/services/types-receipt-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useTypesReceiptStore = defineStore('typesReceipt', {
  state: () => ({
    loadingTypesReceipt: false as boolean,
    listTypesReceipt: [] as ITypesReceipt[],
  }),
  actions: {
    clearListTypesReceipt() {
      this.listTypesReceipt.splice(0, this.listTypesReceipt.length);
    },
    setLoading(loading: boolean) {
      this.loadingTypesReceipt = loading;
    },
    setListTypesReceipt(types: ITypesReceipt[]) {
      types.map((item) => this.listTypesReceipt.push(item));
    },
    async getTypesReceipt() {
      try {
        this.setLoading(true);
        const response = await getTypesReceiptService();
        if (response.status === 200) {
          this.clearListTypesReceipt();
          this.setListTypesReceipt(response.data.types);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createTypesReceipt(name: string) {
      this.setLoading(true);
      try {
        const response = await createTypesReceiptService(name);
        if (response.status === 201) {
          this.clearListTypesReceipt();
          this.setListTypesReceipt(response.data.types);
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
    async updateTypesReceipt(id: number, name: string) {
      this.setLoading(true);
      try {
        const response = await updateTypesReceiptService(id, name);
        if (response.status === 200) {
          this.clearListTypesReceipt();
          this.setListTypesReceipt(response.data.types);
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
    async deleteTypesReceipt(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteTypesReceiptService(id);
        if (response.status === 200) {
          this.clearListTypesReceipt();
          this.setListTypesReceipt(response.data.types);
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
