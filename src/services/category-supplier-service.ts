import { api } from 'boot/axios';

const baseUrl = 'supplier/category';

export const getCategoriesSupplierService = (): Promise<{
  status: number;
  data: {
    categories: ICategorySupplier[];
  };
}> => api.get(`${baseUrl}`);

export const createCategorySupplierService = (
  name: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post(`${baseUrl}/`, { name });

export const updateCategorySupplierService = (
  id: number,
  name: string,
): Promise<{
  status: number;
  data: {
    message: string;
    categories: ICategorySupplier[];
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
  });

export const deleteCategorySupplierService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    categories: ICategorySupplier[];
  };
}> => api.delete(`${baseUrl}/${id}`);
