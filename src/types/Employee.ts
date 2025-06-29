export interface EmployeeTable {
  id: number;
  name: string;
  department_name: number | null;
  email: string | null;
  has_login_access: number;
}

export interface Employee {
  id: number;
  name: string;
  department_id: number | null;
  email: string | null;
  has_login_access: number;
  sex: string | null;
  phone: string | null;
  cpf: number | null;
  cnpj: number | null;
  active: number;
  state_registration: string | null;
  municipal_registration: string | null;
  date_birthday: string | null;
  cep: number | null;
  country: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  number: number | null;
  complement: string | null;
  enterprise_id: number | null;
  description: string | null;
  created_at: string;
}

export interface FilterEmployee {
  name: string | null;
  email: string | null;
  cpf: string | null;
  cnpj: string | null;
  sex: string | null;
  active: number | null;
  department: number | null;
  hasLoginAccess: number | null;
}
