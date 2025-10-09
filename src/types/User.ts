export interface User {
  id: number;
  name: string;
  email: string;
  active: number;
  role_id: number;
  enterprise_id: number;
  department_id: number;
  image_id: number | null;
  image: IImage | null;
}

export interface UserSystem {
  id: number;
  name: string;
  email: string;
  active: number;
  department_name: string;
  role_name: string;
}

export interface FilterUser {
  name: string;
  email: string;
  role: number | null;
  department: number | null;
  active: number | null;
}
