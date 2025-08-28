import { createError } from 'src/composables/CreateNotify';
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

export const exportMovementService = async (filter: IExportMovement) => {
  try {
    const response = await api.post(`${baseUrl}/export`, filter, {
      responseType: 'blob',
    });

    const ext = filter.format === 'excel' ? 'xlsx' : 'pdf';

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `movimentacoes_${timestamp}.${ext}`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    createError(error);
  }
};

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
}> => api.delete(`${baseUrl}/delete/${id}`);
