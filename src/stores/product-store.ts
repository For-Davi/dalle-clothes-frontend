import {
  createProductService,
  deleteProductService,
  deleteProductVariantService,
  getProductsFilterService,
  getProductsService,
  getProductVariantService,
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
    // async showEmployee(employeeId: number) {
    //   try {
    //     this.setLoading(true);
    //     return await showEmployeeService(employeeId);
    //   } catch (error) {
    //     createError(error);
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
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
    // async updateEmployee(
    //   id: number,
    //   name: string,
    //   email: string | null,
    //   dateBirthday: string | null,
    //   sex: string | null,
    //   phone: string | null,
    //   cpf: number | null,
    //   cnpj: number | null,
    //   stateRegistration: string | null,
    //   municipalRegistration: string | null,
    //   country: string | null,
    //   state: string | null,
    //   city: string | null,
    //   cep: number | null,
    //   neighborhood: string | null,
    //   address: string | null,
    //   number: number | null,
    //   complement: string | null,
    //   description: string | null,
    //   departmentId: number | null,
    //   active: number,
    // ) {
    //   this.setLoading(true);
    //   try {
    //     const response = await updateEmployeeService(
    //       id,
    //       name,
    //       email,
    //       dateBirthday,
    //       sex,
    //       phone,
    //       cpf,
    //       cnpj,
    //       stateRegistration,
    //       municipalRegistration,
    //       country,
    //       state,
    //       city,
    //       cep,
    //       neighborhood,
    //       address,
    //       number,
    //       complement,
    //       description,
    //       departmentId,
    //       active,
    //     );
    //     if (response.status === 200) {
    //       this.clearListEmployee();
    //       this.setListEmployee(response.data.employees);
    //       createSuccess(response.data.message);
    //     }

    //     return response;
    //   } catch (error) {
    //     createError(error);
    //     return undefined;
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
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
