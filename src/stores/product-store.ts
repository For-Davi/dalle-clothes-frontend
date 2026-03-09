import {
  createMovementVariantService,
  createProductService,
  deleteProductService,
  deleteProductVariantService,
  getProductsFilterService,
  getProductsService,
  getProductVariantService,
  searchProductService,
  showProductService,
  updateProductAdvancedService,
  updateProductBasicService,
  updateProductMediaService,
  updateProductTagService,
  updateVariantService,
  createStockReentryMovementService,
} from 'src/services/product-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useProductStore = defineStore('product', {
  state: () => ({
    loadingProduct: false as boolean,
    listProduct: [] as IProduct[],
  }),
  actions: {
    clearListProduct() {
      this.listProduct.splice(0, this.listProduct.length);
    },
    setLoading(loading: boolean) {
      this.loadingProduct = loading;
    },
    setListProduct(products: IProduct[]) {
      products.map((item) => this.listProduct.push(item));
    },
    async getProducts(filter: IFilterProduct | null = null) {
      try {
        this.setLoading(true);
        let response = null;
        if (filter) {
          response = await getProductsFilterService(filter);
        } else {
          response = await getProductsService();
        }

        if (response.status === 200) {
          this.clearListProduct();
          this.setListProduct(response.data.products);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getProductVariant(id: number) {
      this.setLoading(true);
      try {
        return await getProductVariantService(id);
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async searchProduct(value: string) {
      this.setLoading(true);
      try {
        return await searchProductService(value);
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async showProduct(productID: number) {
      try {
        this.setLoading(true);
        return await showProductService(productID);
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createProduct(data: IDataCreateProduct) {
      this.setLoading(true);
      try {
        const response = await createProductService(data);
        if (response.status === 201) {
          this.clearListProduct();
          this.setListProduct(response.data.products);
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
    async createMovementVariant(data: IDataMovementProductRegister) {
      this.setLoading(true);
      try {
        const response = await createMovementVariantService(data);
        if (response.status === 200) {
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
    async createMovementStockReentry(data: IDataMovementProductRegister) {
      this.setLoading(true);
      try {
        const response = await createStockReentryMovementService(data);
        if (response.status === 200) {
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
    async updateVariant(data: IDataUpdateVariant) {
      this.setLoading(true);
      try {
        const response = await updateVariantService(data);
        if (response.status === 200) {
          this.clearListProduct();
          this.setListProduct(response.data.products);
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
    async updateProductBasic(data: IDataProductBasic) {
      try {
        this.setLoading(true);
        const response = await updateProductBasicService(data);
        if (response.status === 200) {
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
    async updateProductMedia(
      productID: number,
      newImages: IMediaItem[],
      imagesToDelete: { id: number }[],
    ) {
      try {
        this.setLoading(true);
        const response = await updateProductMediaService(productID, newImages, imagesToDelete);
        if (response.status === 200) {
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
    async updateProductTag(productID: number, data: { id: number }[]) {
      try {
        this.setLoading(true);
        const response = await updateProductTagService(productID, data);
        if (response.status === 200) {
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
    async updateProductAdvanced(data: IDataProductAdvanced) {
      try {
        this.setLoading(true);
        const response = await updateProductAdvancedService(data);
        if (response.status === 200) {
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
    async deleteProduct(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteProductService(id);
        if (response.status === 200) {
          this.clearListProduct();
          this.setListProduct(response.data.products);
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
    async deleteVariant(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteProductVariantService(id);
        if (response.status === 200) {
          this.clearListProduct();
          this.setListProduct(response.data.products);
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
