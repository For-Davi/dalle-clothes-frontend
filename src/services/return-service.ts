import { api } from 'boot/axios';

const baseUrl = 'return';

export const getReturnItemsService = (
  returnID: number,
): Promise<{
  status: number;
  data: {
    products: IDataReturnItens[];
  };
}> => api.get(`${baseUrl}/${returnID}`);
