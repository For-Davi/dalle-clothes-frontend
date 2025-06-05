import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import {
  createUserService,
  deleteUserService,
  getUsersService,
  updateUserService,
} from 'src/services/user-service';

export const useUserStore = defineStore('user', {
  state: () => ({
    loadingUser: false as boolean,
    listUserSystem: [] as IUserSystem[],
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingUser = loading;
    },
    clearListUserSystem() {
      this.listUserSystem.splice(0, this.listUserSystem.length);
    },
    setListUserSystem(users: IUserSystem[]) {
      users.map((item) => this.listUserSystem.push(item));
    },
    async getUsers() {
      try {
        this.setLoading(true);
        const response = await getUsersService();
        if (response.status === 200) {
          this.clearListUserSystem();
          this.setListUserSystem(response.data.users);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createUser(
      name: string,
      password: string,
      email: string,
      roleId: string,
      departmentId: string | null,
    ) {
      this.setLoading(true);
      try {
        const response = await createUserService(name, password, email, roleId, departmentId);
        if (response.status === 201) {
          this.clearListUserSystem();
          this.setListUserSystem(response.data.users);
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
    async updateUser(
      id: string,
      name: string,
      email: string,
      roleId: string,
      departmentId: string | null,
      active: number,
    ) {
      this.setLoading(true);
      try {
        const response = await updateUserService(id, name, email, roleId, departmentId, active);
        if (response.status === 200) {
          this.clearListUserSystem();
          this.setListUserSystem(response.data.users);
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
    async deleteUser(userId: number) {
      this.setLoading(true);
      try {
        const response = await deleteUserService(userId);
        if (response.status === 200) {
          this.clearListUserSystem();
          this.setListUserSystem(response.data.users);
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
