import { api } from 'boot/axios';

const baseUrl = 'role';

export const getRolesSelectService = (): Promise<{
  status: number;
  data: {
    roles: IRoleSelect[];
  };
}> => api.get(`${baseUrl}/list-select`);
