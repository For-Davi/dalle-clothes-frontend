import { api } from 'boot/axios';

const baseUrl = 'user';

export const getUsersService = (): Promise<{
  status: number;
  data: {
    users: IUserSystem[];
  };
}> => api.get(`${baseUrl}`);

export const createUserService = (
  name: string,
  password: string,
  email: string,
  roleId: string,
  departmentId: string | null,
): Promise<{
  status: number;
  data: {
    users: IUserSystem[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, { name, password, email, roleId, departmentId });

export const updateUserService = (
  id: string,
  name: string,
  email: string,
  roleId: string,
  departmentId: string | null,
  active: number,
): Promise<{
  status: number;
  data: {
    users: IUserSystem[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
    email,
    roleId,
    departmentId,
    active,
  });

export const deleteUserService = (
  id: number,
): Promise<{
  status: number;
  data: {
    users: IUserSystem[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
