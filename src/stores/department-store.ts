import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import {
  createDepartmentService,
  deleteDepartmentService,
  getDepartmentsService,
  updateDepartmentService,
} from 'src/services/department-service';

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    filledData: true as boolean,
    loadingDepartment: false as boolean,
    listDepartment: [] as IDepartment[],
  }),
  getters: {
    treeDepartment: (state) => {
      function transformToTree(departments: IDepartment[]): IDepartmentNode[] {
        const map = new Map<string, IDepartmentNode>();

        for (const department of departments) {
          map.set(department.id.toString(), {
            id: department.id,
            label: department.name,
            children: [],
            icon: '',
          });
        }

        const tree: IDepartmentNode[] = [];

        for (const department of departments) {
          const node = map.get(department.id.toString());
          const parent = department.parent_id
            ? map.get(department.parent_id.toString())
            : undefined;

          if (node) {
            if (parent) {
              parent.children.push(node);
            } else {
              tree.push(node);
            }
          }
        }

        function sortNodes(nodes: IDepartmentNode[]): IDepartmentNode[] {
          return nodes
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((node) => ({
              ...node,
              children: sortNodes(node.children),
            }));
        }

        return sortNodes(tree);
      }

      return transformToTree(state.listDepartment as IDepartment[]);
    },
  },
  actions: {
    clearListDepartment() {
      this.listDepartment.splice(0, this.listDepartment.length);
    },
    setLoading(loading: boolean) {
      this.loadingDepartment = loading;
    },
    setListDepartment(departments: IDepartment[]) {
      departments.map((item) => this.listDepartment.push(item));
    },
    async getDepartments() {
      this.setLoading(true);
      try {
        const response = await getDepartmentsService();
        if (response.status === 200) {
          this.clearListDepartment();
          this.setListDepartment(response.data.departments);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createDepartment(name: string, parentId: number | null) {
      this.setLoading(true);
      try {
        const response = await createDepartmentService(name, parentId);
        if (response.status === 201) {
          this.clearListDepartment();
          this.setListDepartment(response.data.departments)
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
    async updateDepartment(id: number, name: string, parentId: number | null) {
      this.setLoading(true);
      try {
        const response = await updateDepartmentService(id, name, parentId);
        if (response.status === 200) {
           this.clearListDepartment();
          this.setListDepartment(response.data.departments)
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
    async deleteDepartment(departmentId: number) {
      this.setLoading(true);
      try {
        const response = await deleteDepartmentService(departmentId);
        if (response.status === 200) {
          this.clearListDepartment();
          this.setListDepartment(response.data.departments);
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
