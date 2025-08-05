import {
  createCategoryTransactionService,
  deleteCategoryTransactionService,
  getCategoriesTransactionService,
  updateCategoryTransactionService,
} from 'src/services/category-transaction-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useCategoryTransactionStore = defineStore('categoryTransaction', {
  state: () => ({
    loadingCategoryTransaction: false as boolean,
    listCategoryTransaction: [] as ICategoryTransaction[],
  }),
  actions: {
    clearListCategoryTransaction() {
      this.listCategoryTransaction.splice(0, this.listCategoryTransaction.length);
    },
    setLoading(loading: boolean) {
      this.loadingCategoryTransaction = loading;
    },
    setListCategoryTransaction(categories: ICategoryTransaction[]) {
      categories.map((item) => this.listCategoryTransaction.push(item));
    },
    async getCategoriesTransaction() {
      try {
        this.setLoading(true);
        const response = await getCategoriesTransactionService();
        if (response.status === 200) {
          this.clearListCategoryTransaction();
          this.setListCategoryTransaction(response.data.categories);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createCategoryTransaction(name: string) {
      this.setLoading(true);
      try {
        const response = await createCategoryTransactionService(name);
        if (response.status === 201) {
          this.clearListCategoryTransaction();
          this.setListCategoryTransaction(response.data.categories);
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
    async updateCategoryTransaction(id: number, name: string) {
      this.setLoading(true);
      try {
        const response = await updateCategoryTransactionService(id, name);
        if (response.status === 200) {
          this.clearListCategoryTransaction();
          this.setListCategoryTransaction(response.data.categories);
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
    async deleteCategoryTransaction(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteCategoryTransactionService(id);
        if (response.status === 200) {
          this.clearListCategoryTransaction();
          this.setListCategoryTransaction(response.data.categories);
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
