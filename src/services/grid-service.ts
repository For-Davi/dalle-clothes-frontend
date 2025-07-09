import { api } from 'boot/axios';

const baseUrl = 'grid';

export const getGridsService = (): Promise<{
  status: number;
  data: {
    grids: IGrid[];
  };
}> => api.get(`${baseUrl}`);

export const createGridService = (
  grid: ICreateGrid,
): Promise<{
  status: number;
  data: {
    grids: IGrid[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, grid);

export const updateGridService = (
  grid: IUpdateGrid,
): Promise<{
  status: number;
  data: {
    grids: IGrid[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, grid);

export const deleteGridService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    grids: IGrid[];
  };
}> => api.delete(`${baseUrl}/${id}`);
