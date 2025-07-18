import {
  createCategoryProductService,
  deleteCategoryProductService,
  getCategoriesProductService,
  updateCategoryProductService,
} from 'src/services/category-product-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useCategoryProductStore = defineStore('categoryProduct', {
  state: () => ({
    loadingCategoryProduct: false as boolean,
    listCategoryProduct: [] as ICategoryProduct[],
  }),
  actions: {
    clearListCategoryProduct() {
      this.listCategoryProduct.splice(0, this.listCategoryProduct.length);
    },
    setLoading(loading: boolean) {
      this.loadingCategoryProduct = loading;
    },
    setListCategoryProduct(categories: ICategoryProduct[]) {
      categories.map((item) => this.listCategoryProduct.push(item));
    },
    async getCategoriesProduct() {
      try {
        this.setLoading(true);
        const response = await getCategoriesProductService();
        if (response.status === 200) {
          this.clearListCategoryProduct();
          this.setListCategoryProduct(response.data.categories);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createCategoryProduct(name: string) {
      this.setLoading(true);
      try {
        const response = await createCategoryProductService(name);
        if (response.status === 201) {
          this.clearListCategoryProduct();
          this.setListCategoryProduct(response.data.categories);
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
    async updateCategoryProduct(id: number, name: string) {
      this.setLoading(true);
      try {
        const response = await updateCategoryProductService(id, name);
        if (response.status === 200) {
          this.clearListCategoryProduct();
          this.setListCategoryProduct(response.data.categories);
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
    async deleteCategoryProduct(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteCategoryProductService(id);
        if (response.status === 200) {
          this.clearListCategoryProduct();
          this.setListCategoryProduct(response.data.categories);
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
