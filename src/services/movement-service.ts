import { api } from 'boot/axios';

const baseUrl = 'movement';

export const getMovementsService = (): Promise<{
  status: number;
  data: {
    movements: IMovement[];
  };
}> => api.get(`${baseUrl}`);

export const getMovementPeriodService = (): Promise<{
  status: number;
  data: {
    periods: string[];
  };
}> => api.get(`${baseUrl}/periods`);

export const getMovementsFilterService = (
  filter: IFilterMovement,
): Promise<{
  status: number;
  data: {
    movements: IMovement[];
  };
}> => api.post(`${baseUrl}/filter`, filter);

export const showMovementService = (
  movementID: number,
): Promise<{
  status: number;
  data: {
    movement: IMovement;
  };
}> => api.get(`${baseUrl}/${movementID}`);

export const createMovementService = (
  data: IDataMovement,
): Promise<{
  status: number;
  data: {
    movements: IMovement[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateMovementService = (
  data: IDataMovement,
): Promise<{
  status: number;
  data: {
    movements: IMovement[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, data);

export const deleteMovementService = (
  id: number,
): Promise<{
  status: number;
  data: {
    movements: IMovement[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
