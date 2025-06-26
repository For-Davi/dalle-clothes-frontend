import { api } from 'boot/axios';

const baseUrl = 'employee';

export const getEmployeesService = (): Promise<{
  status: number;
  data: {
    employees: IEmployeeTable[];
  };
}> => api.get(`${baseUrl}`);

export const getEmployeesFilterService = (
  filter: IFilterEmployee,
): Promise<{
  status: number;
  data: {
    employees: IEmployeeTable[];
  };
}> => api.post(`${baseUrl}/filter`, filter);

export const showEmployeeService = (
  employeeId: number,
): Promise<{
  status: number;
  data: {
    employee: IEmployee;
  };
}> => api.get(`${baseUrl}/${employeeId}`);

export const createEmployeeService = (
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
  hasLoginAccess: number,
  password: string | null,
  roleId: number | null,
): Promise<{
  status: number;
  data: {
    employees: IEmployeeTable[];
    message: string;
  };
}> =>
  api.post(`${baseUrl}/`, {
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
    departmentId,
    hasLoginAccess,
    password,
    roleId,
  });

export const updateEmployeeService = (
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
  hasLoginAccess: number,
): Promise<{
  status: number;
  data: {
    employees: IEmployeeTable[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
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
    departmentId,
    hasLoginAccess,
  });

export const deleteEmployeeService = (
  id: number,
): Promise<{
  status: number;
  data: {
    employees: IEmployeeTable[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
