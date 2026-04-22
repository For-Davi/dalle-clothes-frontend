import {
  checkCodesAndSkusService,
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
  getProductMovementService,
  showProductMovementService,
} from 'src/services/product-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useProductStore = defineStore('product', {
  state: () => ({
    loadingProduct: false as boolean,
    loadingProductMovement: false as boolean,
    listProduct: [] as IProduct[],
    listProductMovement: [] as IProductMovement[],
    productMovement: {} as IProductMovement,
  }),
  actions: {
    clearListProduct() {
      this.listProduct.splice(0, this.listProduct.length);
    },
    clearListProductMovement() {
      this.listProductMovement.splice(0, this.listProductMovement.length);
    },
    clearProductMovement() {
      this.productMovement = {} as IProductMovement;
    },
    setLoading(loading: boolean) {
      this.loadingProduct = loading;
    },
    setLoadingProductMovement(loading: boolean) {
      this.loadingProductMovement = loading;
    },
    setListProduct(products: IProduct[]) {
      products.map((item) => this.listProduct.push(item));
    },
    setListProductMovement(products: IProductMovement[]) {
      products.map((item) => this.listProductMovement.push(item));
    },
    setProductMovement(movement: IProductMovement) {
      this.productMovement = movement;
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
    async getProductMovement(productVariantID: number) {
      this.setLoadingProductMovement(true);
      try {
        const response = await getProductMovementService(productVariantID);
        if (response.status === 200) {
          this.clearListProductMovement();
          this.setListProductMovement(response.data.movements);
        }
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoadingProductMovement(false);
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
    async showProductMovement(productMovementID: number) {
      try {
        this.setLoadingProductMovement(true);
        const response = await showProductMovementService(productMovementID);
        if (response.status === 200) {
          this.clearProductMovement();
          this.setProductMovement(response.data.movement);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoadingProductMovement(false);
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
    async checkCodesAndSkus(data: IDataCheckCodeAndSku) {
      try {
        this.setLoading(true);
        const response = await checkCodesAndSkusService(data);

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
