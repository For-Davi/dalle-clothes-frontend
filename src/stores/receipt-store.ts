import {
    getReceiptsService,
    createReceiptService,
    updateReceiptService,
    deleteReceiptService,
    showReceiptService
} from 'src/services/receipt-service'
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useReceiptstore = defineStore('receipt', {
  state: () => ({
    loadingReceipt: false as boolean,
    listReceipt: [] as IReceipt[],
  }),
  actions: {
    clearListReceipt() {
      this.listReceipt.splice(0, this.listReceipt.length);
    },
    setLoading(loading: boolean) {
      this.loadingReceipt = loading;
    },
    setListReceipt(receipt: IReceipt[]) {
      receipt.map((item) => this.listReceipt.push(item));
    },
    async getReceipt() {
      try {
        this.setLoading(true);
        const response = await getReceiptsService();
        if (response.status === 200) {
          this.clearListReceipt();
          this.setListReceipt(response.data.receipts);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
       async showReceipt(receiptID: number) {
          try {
            this.setLoading(true);
            return await showReceiptService(receiptID);
          } catch (error) {
            createError(error);
          } finally {
            this.setLoading(false);
          }
        },
    async createReceipt(data: IDataReceipt) {
      this.setLoading(true);
      try {
        const response = await createReceiptService(data);
        if (response.status === 201) {
          this.clearListReceipt();
          this.setListReceipt(response.data.receipts);
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
    async updateReceipt(
        id: number,
      identifier: string,
      typesID: number | null,
      active: number,
      description: string | null
    ) {
      this.setLoading(true);
      try {
        const response = await updateReceiptService(id, identifier, typesID, active, description);
        if (response.status === 200) {
          this.clearListReceipt();
          this.setListReceipt(response.data.receipts);
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
    async deleteReceipt(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteReceiptService(id);
        if (response.status === 200) {
          this.clearListReceipt();
          this.setListReceipt(response.data.receipts);
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
