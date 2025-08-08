import { createTypesAccountService, getTypesAccountService, updateTypesAccountService, deleteTypesAccountService } from 'src/services/types-account-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useTypesAccountStore = defineStore('typesAccount', {
  state: () => ({
    loadingTypesAccount: false as boolean,
    listTypesAccount: [] as ITypesAccount[],
  }),
  actions: {
    clearListTypesAccount() {
      this.listTypesAccount.splice(0, this.listTypesAccount.length);
    },
    setLoading(loading: boolean) {
      this.loadingTypesAccount = loading;
    },
    setListTypesAccount(types: ITypesAccount[]) {
      types.map((item) => this.listTypesAccount.push(item));
    },
    async getTypesAccount() {
      try {
        this.setLoading(true);
        const response = await getTypesAccountService();
        if (response.status === 200) {
          this.clearListTypesAccount();
          this.setListTypesAccount(response.data.types);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createTypesAccount(name: string) {
      this.setLoading(true);
      try {
        const response = await createTypesAccountService(name);
        if (response.status === 201) {
          this.clearListTypesAccount();
          this.setListTypesAccount(response.data.types);
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
    async updateTypesAccount(id: number, name: string) {
      this.setLoading(true);
      try {
        const response = await updateTypesAccountService(id, name);
        if (response.status === 200) {
          this.clearListTypesAccount();
          this.setListTypesAccount(response.data.types);
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
    async deleteTypesAccount(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteTypesAccountService(id);
        if (response.status === 200) {
          this.clearListTypesAccount();
          this.setListTypesAccount(response.data.types);
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
