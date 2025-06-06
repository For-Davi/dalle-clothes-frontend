import { getRolesSelectService } from 'src/services/role-service';
import { defineStore } from 'pinia';
import { createError } from 'src/composables/CreateNotify';

export const useRoleStore = defineStore('role', {
  state: () => ({
    loadingRole: false as boolean,
    listRoleSelect: [] as IRoleSelect[],
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
  },
});
