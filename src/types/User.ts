export interface User {
  id: string;
  name: string;
  email: string;
  role_id: string;
  enterprise_id: string;
}

export interface UserSystem {
  id: string;
  name: string;
  email: string;
  active: number;
  department_name: string;
  role_name: string;
}
