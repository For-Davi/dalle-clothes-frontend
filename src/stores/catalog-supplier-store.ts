import {
  createCatalogSupplierService,
  deleteCatalogSupplierService,
  getCatalogSupplierService,
  updateCatalogSupplierService,
} from 'src/services/catalog-supplier-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useCatalogSupplierStore = defineStore('catalogSupplier', {
  state: () => ({
    loadingLinkedProducts: false as boolean,
    listLinkedProducts: [] as ILinkedProducts[],
  }),
  actions: {
    clearListLinkedProducts() {
      this.listLinkedProducts.splice(0, this.listLinkedProducts.length);
    },
    setLoading(loading: boolean) {
      this.loadingLinkedProducts = loading;
    },
    setListLinkedProducts(linkeds: ILinkedProducts[]) {
      linkeds.map((item) => this.listLinkedProducts.push(item));
    },
    async getLinkedProducts(id: number | null) {
      this.setLoading(true);
      try {
        const response = await getCatalogSupplierService(id);
        if (response.status === 200) {
          this.clearListLinkedProducts();
          this.setListLinkedProducts(response.data.catalog);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createLinkedProductSupplier(
      supplierId: number | null,
      productVariantId: number,
      price: string,
      description: string | null,
    ) {
      this.setLoading(true);
      try {
        const response = await createCatalogSupplierService(
          supplierId,
          productVariantId,
          price,
          description,
        );
        if (response.status === 201) {
          this.clearListLinkedProducts();
          this.setListLinkedProducts(response.data.catalog);
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
    async updateLinkedProductSupplier(
      supplierID: number,
      productVariantId: number,
      price: string,
      description: string | null,
    ) {
      this.setLoading(true);

      try {
        const response = await updateCatalogSupplierService(
          supplierID,
          productVariantId,
          price,
          description,
        );

        if (response?.status === 200) {
          this.clearListLinkedProducts();
          this.setListLinkedProducts(response.data.catalog);
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

    async deleteLinkedProductSupplier(supplierID: number, productVariantID: number) {
      this.setLoading(true);
      try {
        const response = await deleteCatalogSupplierService(supplierID, productVariantID);
        if (response.status === 200) {
          this.clearListLinkedProducts();
          this.setListLinkedProducts(response.data.catalog);
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
