export interface User {
  id: number;
  name: string;
  email: string;
  active: number;
  role_id: string;
  enterprise_id: string;
}

export interface UserSystem {
  id: number;
  name: string;
  email: string;
  active: number;
  department_name: string;
  role_name: string;
}
