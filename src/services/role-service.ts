import { api } from 'boot/axios';

const baseUrl = 'role';
const permissionUrl = 'permission';

export const getRolesSelectService = (): Promise<{
  status: number;
  data: { roles: IRoleSelect[] };
}> => api.get(`${baseUrl}/list-select`);

export const getRolesService = (): Promise<{
  status: number;
  data: { roles: IRole[] };
}> => api.get(baseUrl);

export const showRoleService = (
  id: number,
): Promise<{
  status: number;
  data: { role: IRole };
}> => api.get(`${baseUrl}/${id}`);

export const createRoleService = (
  data: IDataRole,
): Promise<{
  status: number;
  data: { roles: IRole[]; message: string };
}> => api.post(baseUrl, data);

export const updateRoleService = (
  data: IDataRole,
): Promise<{
  status: number;
  data: { roles: IRole[]; message: string };
}> => api.put(`${baseUrl}/`, data);

export const deleteRoleService = (
  id: number,
): Promise<{
  status: number;
  data: { roles: IRole[]; message: string };
}> => api.delete(`${baseUrl}/${id}`);

export const getPermissionsService = (): Promise<{
  status: number;
  data: { permissions: IPermission[] };
}> => api.get(permissionUrl);
