import { api } from 'boot/axios';

const baseUrl = 'account/type';

export const getTypesAccountService = (): Promise<{
  status: number;
  data: {
    types: ITypesAccount[];
  };
}> => api.get(`${baseUrl}`);

export const createTypesAccountService = (
  name: string,
): Promise<{
  status: number;
  data: {
    message: string;
    types: ITypesAccount[];
  };
}> => api.post(`${baseUrl}/`, { name });

export const updateTypesAccountService = (
  id: number,
  name: string,
): Promise<{
  status: number;
  data: {
    message: string;
    types: ITypesAccount[];
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
  });

export const deleteTypesAccountService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    types: ITypesAccount[];
  };
}> => api.delete(`${baseUrl}/${id}`);
