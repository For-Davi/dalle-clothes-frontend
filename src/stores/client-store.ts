import { deleteClientService, updateClientService } from './../services/client-service';
import {
  createClientService,
  getClientsFilterService,
  getClientsService,
  showClientService,
} from 'src/services/client-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useClientStore = defineStore('client', {
  state: () => ({
    loadingClient: false as boolean,
    listClient: [] as IClient[],
  }),
  actions: {
    clearListClient() {
      this.listClient.splice(0, this.listClient.length);
    },
    setLoading(loading: boolean) {
      this.loadingClient = loading;
    },
    setListClient(categories: IClient[]) {
      categories.map((item) => this.listClient.push(item));
    },
    async getClients(filter: IFilterClient | null = null) {
      try {
        this.setLoading(true);
        let response = null;
        if (filter) {
          response = await getClientsFilterService(filter);
        } else {
          response = await getClientsService();
        }

        if (response.status === 200) {
          this.clearListClient();
          this.setListClient(response.data.clients);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async showClient(clientId: number) {
      try {
        this.setLoading(true);
        return await showClientService(clientId);
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createClient(
      name: string,
      email: string | null,
      phone: string | null,
      dateBirthday: string | null,
      cpf: number | null,
      cnpj: number | null,
      stateRegistration: string | null,
      municipalRegistration: string | null,
      country: string | null,
      state: string | null,
      city: string | null,
      cep: number | null,
      neighborhood: string | null,
      address: string | null,
      number: number | null,
      complement: string | null,
      description: string | null,
      sex: string,
    ) {
      this.setLoading(true);
      try {
        const response = await createClientService(
          name,
          email,
          phone,
          dateBirthday,
          cpf,
          cnpj,
          stateRegistration,
          municipalRegistration,
          country,
          state,
          city,
          cep,
          neighborhood,
          address,
          number,
          complement,
          description,
          sex,
        );
        if (response.status === 201) {
          this.clearListClient();
          this.setListClient(response.data.clients);
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
    async updateClient(
      id: number,
      name: string,
      email: string | null,
      phone: string | null,
      dateBirthday: string | null,
      cpf: number | null,
      cnpj: number | null,
      stateRegistration: string | null,
      municipalRegistration: string | null,
      country: string | null,
      state: string | null,
      city: string | null,
      cep: number | null,
      neighborhood: string | null,
      address: string | null,
      number: number | null,
      complement: string | null,
      description: string | null,
      sex: string,
    ) {
      this.setLoading(true);
      try {
        const response = await updateClientService(
          id,
          name,
          email,
          phone,
          dateBirthday,
          cpf,
          cnpj,
          stateRegistration,
          municipalRegistration,
          country,
          state,
          city,
          cep,
          neighborhood,
          address,
          number,
          complement,
          description,
          sex,
        );
        if (response.status === 200) {
          this.clearListClient();
          this.setListClient(response.data.clients);
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
    async deleteClient(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteClientService(id);
        if (response.status === 200) {
          this.clearListClient();
          this.setListClient(response.data.clients);
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
