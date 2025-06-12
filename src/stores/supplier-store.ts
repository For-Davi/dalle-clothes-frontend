import {
  createSupplierService,
  deleteSupplierService,
  getSuppliersService,
  updateSupplierService,
} from 'src/services/supplier-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    loadingSupplier: false as boolean,
    listSupplier: [] as ISupplier[],
  }),
  actions: {
    clearListSupplier() {
      this.listSupplier.splice(0, this.listSupplier.length);
    },
    setLoading(loading: boolean) {
      this.loadingSupplier = loading;
    },
    setListSupplier(categories: ISupplier[]) {
      categories.map((item) => this.listSupplier.push(item));
    },
    async getSuppliers() {
      this.setLoading(true);
      try {
        const response = await getSuppliersService();
        if (response.status === 200) {
          this.clearListSupplier();
          this.setListSupplier(response.data.suppliers);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createSupplier(
      name: string,
      email: string | null,
      phone: string | null,
      cpf: string | null,
      cnpj: string | null,
      stateRegistration: string | null,
      municipalRegistration: string | null,
      site: string | null,
      country: string | null,
      state: string | null,
      city: string | null,
      cep: number | null,
      neighborhood: string | null,
      address: string | null,
      number: number | null,
      complement: string | null,
      description: string | null,
    ) {
      this.setLoading(true);
      try {
        const response = await createSupplierService(
          name,
          email,
          phone,
          cpf,
          cnpj,
          stateRegistration,
          municipalRegistration,
          site,
          country,
          state,
          city,
          cep,
          neighborhood,
          address,
          number,
          complement,
          description,
        );
        if (response.status === 201) {
          this.clearListSupplier();
          this.setListSupplier(response.data.suppliers);
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
    async updateSupplier(
      id: number,
      name: string,
      email: string | null,
      phone: string | null,
      cpf: string | null,
      cnpj: string | null,
      stateRegistration: string | null,
      municipalRegistration: string | null,
      site: string | null,
      country: string | null,
      state: string | null,
      city: string | null,
      cep: string | null,
      neighborhood: string | null,
      address: string | null,
      number: string | null,
      complement: string | null,
      description: string | null,
    ) {
      this.setLoading(true);
      try {
        const response = await updateSupplierService(
          id,
          name,
          email,
          phone,
          cpf,
          cnpj,
          stateRegistration,
          municipalRegistration,
          site,
          country,
          state,
          city,
          cep,
          neighborhood,
          address,
          number,
          complement,
          description,
        );
        if (response.status === 200) {
          this.clearListSupplier();
          this.setListSupplier(response.data.suppliers);
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
    async deleteSupplier(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteSupplierService(id);
        if (response.status === 200) {
          this.clearListSupplier();
          this.setListSupplier(response.data.suppliers);
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
