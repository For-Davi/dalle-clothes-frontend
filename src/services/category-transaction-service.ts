import { api } from 'boot/axios';

const baseUrl = 'transaction/category';

export const getCategoriesTransactionService = (): Promise<{
  status: number;
  data: {
    categories: ICategoryTransaction[];
  };
}> => api.get(`${baseUrl}`);

export const createCategoryTransactionService = (
  name: string,
): Promise<{
  status: number;
  data: {
    message: string;
    categories: ICategoryTransaction[];
  };
}> => api.post(`${baseUrl}/`, { name });

export const updateCategoryTransactionService = (
  id: number,
  name: string,
): Promise<{
  status: number;
  data: {
    message: string;
    categories: ICategoryTransaction[];
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
  });

export const deleteCategoryTransactionService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    categories: ICategoryTransaction[];
  };
}> => api.delete(`${baseUrl}/${id}`);
