import { api } from 'boot/axios';

const baseUrl = 'color';

export const getColorsService = (): Promise<{
  status: number;
  data: {
    colors: IColor[];
  };
}> => api.get(`${baseUrl}`);

export const createColorService = (
  name: string,
  hexColorCode: string | null,
): Promise<{
  status: number;
  data: {
    colors: IColor[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, { name, hexColorCode });

export const updateColorService = (
  id: number,
  name: string,
  active: number,
  hexColorCode: string | null,
): Promise<{
  status: number;
  data: {
    colors: IColor[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
    active,
    hexColorCode,
  });

export const deleteColorService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    colors: IColor[];
  };
}> => api.delete(`${baseUrl}/${id}`);
