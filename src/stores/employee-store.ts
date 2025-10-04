import {
  createAccessLoginService,
  createEmployeeService,
  deleteEmployeeService,
  getEmployeesFilterService,
  getEmployeesService,
  removeAccessLoginService,
  showEmployeeService,
  updateEmployeeService,
} from 'src/services/employee-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    loadingEmployee: false as boolean,
    listEmployee: [] as IEmployeeTable[],
  }),
  actions: {
    clearListEmployee() {
      this.listEmployee.splice(0, this.listEmployee.length);
    },
    setLoading(loading: boolean) {
      this.loadingEmployee = loading;
    },
    setListEmployee(employees: IEmployeeTable[]) {
      employees.map((item) => this.listEmployee.push(item));
    },
    async getEmployees(filter: IFilterEmployee | null = null) {
      try {
        this.setLoading(true);
        let response = null;
        if (filter) {
          response = await getEmployeesFilterService(filter);
        } else {
          response = await getEmployeesService();
        }

        if (response.status === 200) {
          this.clearListEmployee();
          this.setListEmployee(response.data.employees);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async showEmployee(employeeId: number) {
      try {
        this.setLoading(true);
        return await showEmployeeService(employeeId);
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async removeAccessLogin(employeeId: number) {
      try {
        this.setLoading(true);
        const response = await removeAccessLoginService(employeeId);
        if (response.status === 200) {
          this.clearListEmployee();
          this.setListEmployee(response.data.employees);
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
    async createAccessLogin(employeeId: number, password: string, roleID: number | null) {
      try {
        this.setLoading(true);
        const response = await createAccessLoginService(employeeId, password, roleID);
        if (response.status === 201) {
          this.clearListEmployee();
          this.setListEmployee(response.data.employees);
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
    async createEmployee(
      name: string,
      email: string | null,
      dateBirthday: string | null,
      sex: string | null,
      phone: string | null,
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
      departmentId: number | null,
      hasAccessLogin: number,
      password: string | null,
      roleId: number | null,
    ) {
      this.setLoading(true);
      try {
        const response = await createEmployeeService(
          name,
          email,
          dateBirthday,
          sex,
          phone,
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
          departmentId,
          hasAccessLogin,
          password,
          roleId,
        );
        if (response.status === 201) {
          this.clearListEmployee();
          this.setListEmployee(response.data.employees);
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
    async updateEmployee(
      id: number,
      name: string,
      email: string | null,
      dateBirthday: string | null,
      sex: string | null,
      phone: string | null,
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
      departmentId: number | null,
      active: number,
    ) {
      this.setLoading(true);
      try {
        const response = await updateEmployeeService(
          id,
          name,
          email,
          dateBirthday,
          sex,
          phone,
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
          departmentId,
          active,
        );
        if (response.status === 200) {
          this.clearListEmployee();
          this.setListEmployee(response.data.employees);
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
    async deleteEmployee(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteEmployeeService(id);
        if (response.status === 200) {
          this.clearListEmployee();
          this.setListEmployee(response.data.employees);
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
