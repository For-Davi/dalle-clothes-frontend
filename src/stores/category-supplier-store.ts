import {
  createCategorySupplierService,
  deleteCategorySupplierService,
  getCategoriesSupplierService,
  updateCategorySupplierService,
} from 'src/services/category-supplier-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useCategorySupplierStore = defineStore('categorySupplier', {
  state: () => ({
    loadingCategorySupplier: false as boolean,
    listCategorySupplier: [] as ICategorySupplier[],
  }),
  actions: {
    clearListCategorySupplier() {
      this.listCategorySupplier.splice(0, this.listCategorySupplier.length);
    },
    setLoading(loading: boolean) {
      this.loadingCategorySupplier = loading;
    },
    setListCategorySupplier(categories: ICategorySupplier[]) {
      categories.map((item) => this.listCategorySupplier.push(item));
    },
    async getCategoriesSupplier() {
      this.setLoading(true);
      try {
        const response = await getCategoriesSupplierService();
        if (response.status === 200) {
          this.clearListCategorySupplier();
          this.setListCategorySupplier(response.data.categories);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createCategorySupplier(name: string) {
      this.setLoading(true);
      try {
        const response = await createCategorySupplierService(name);
        if (response.status === 201) {
          this.clearListCategorySupplier();
          this.setListCategorySupplier(response.data.categories);
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
    async updateCategorySupplier(id: number, name: string) {
      this.setLoading(true);
      try {
        const response = await updateCategorySupplierService(id, name);
        if (response.status === 200) {
          this.clearListCategorySupplier();
          this.setListCategorySupplier(response.data.categories);
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
    async deleteCategorySupplier(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteCategorySupplierService(id);
        if (response.status === 200) {
          this.clearListCategorySupplier();
          this.setListCategorySupplier(response.data.categories);
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
