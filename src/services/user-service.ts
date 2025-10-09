import { api } from 'boot/axios';

const baseUrl = 'user';

export const getUsersService = (): Promise<{
  status: number;
  data: {
    users: IUserSystem[];
  };
}> => api.get(`${baseUrl}`);

export const getUsersFilterService = (
  filter: IFilterUser,
): Promise<{
  status: number;
  data: {
    users: IUserSystem[];
  };
}> => api.post(`${baseUrl}/filter`, filter);

export const showUserService = (
  userId: number,
): Promise<{
  status: number;
  data: {
    user: IUser;
  };
}> => api.get(`${baseUrl}/${userId}`);

export const createUserService = (
  name: string,
  password: string,
  email: string,
  roleId: number,
  departmentId: number | null,
  createEmployee: boolean,
): Promise<{
  status: number;
  data: {
    users: IUserSystem[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, { name, password, email, roleId, departmentId, createEmployee });

export const updateUserService = (
  id: number,
  name: string,
  email: string,
  roleId: number,
  departmentId: number | null,
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
  deleteEmployee: number,
): Promise<{
  status: number;
  data: {
    users: IUserSystem[];
    message: string;
  };
}> =>
  api.delete(`${baseUrl}/${id}`, {
    data: { deleteEmployee },
  });
