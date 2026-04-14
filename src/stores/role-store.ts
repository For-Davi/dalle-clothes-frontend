import {
  createRoleService,
  deleteRoleService,
  getPermissionsService,
  getRolesSelectService,
  getRolesService,
  showRoleService,
  updateRoleService,
} from 'src/services/role-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useRoleStore = defineStore('role', {
  state: () => ({
    loadingRole: false as boolean,
    listRoleSelect: [] as IRoleSelect[],
    listRole: [] as IRole[],
    listPermission: [] as IPermission[],
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingRole = loading;
    },
    clearListRoleSelect() {
      this.listRoleSelect.splice(0, this.listRoleSelect.length);
    },
    setListRoleSelect(roles: IRoleSelect[]) {
      roles.map((item) => this.listRoleSelect.push(item));
    },
    clearListRole() {
      this.listRole.splice(0, this.listRole.length);
    },
    setListRole(roles: IRole[]) {
      roles.map((item) => this.listRole.push(item));
    },
    clearListPermission() {
      this.listPermission.splice(0, this.listPermission.length);
    },
    setListPermission(permissions: IPermission[]) {
      permissions.map((item) => this.listPermission.push(item));
    },
    async getRolesSelect() {
      this.setLoading(true);
      try {
        const response = await getRolesSelectService();
        if (response.status === 200) {
          this.clearListRoleSelect();
          this.setListRoleSelect(response.data.roles);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getRoles() {
      this.setLoading(true);
      try {
        const response = await getRolesService();
        if (response.status === 200) {
          this.clearListRole();
          this.setListRole(response.data.roles);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async showRole(id: number) {
      this.setLoading(true);
      try {
        return await showRoleService(id);
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createRole(data: IDataRole) {
      this.setLoading(true);
      try {
        const response = await createRoleService(data);
        if (response.status === 201) {
          this.clearListRole();
          this.setListRole(response.data.roles);
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
    async updateRole(data: IDataRole) {
      this.setLoading(true);
      try {
        const response = await updateRoleService(data);
        if (response.status === 200) {
          this.clearListRole();
          this.setListRole(response.data.roles);
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
    async deleteRole(id: number, newId: number) {
      this.setLoading(true);
      try {
        const response = await deleteRoleService(id, newId);
        if (response.status === 200) {
          this.clearListRole();
          this.setListRole(response.data.roles);
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
    async getPermissions() {
      this.setLoading(true);
      try {
        const response = await getPermissionsService();
        if (response.status === 200) {
          this.clearListPermission();
          this.setListPermission(response.data.permissions);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
