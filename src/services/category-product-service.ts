import { api } from 'boot/axios';

const baseUrl = 'product/category';

export const getCategoriesProductService = (): Promise<{
  status: number;
  data: {
    categories: ICategoryProduct[];
  };
}> => api.get(`${baseUrl}`);

export const createCategoryProductService = (
  name: string,
): Promise<{
  status: number;
  data: {
    message: string;
    categories: ICategoryProduct[];
  };
}> => api.post(`${baseUrl}/`, { name });

export const updateCategoryProductService = (
  id: number,
  name: string,
): Promise<{
  status: number;
  data: {
    message: string;
    categories: ICategoryProduct[];
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
  });

export const deleteCategoryProductService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    categories: ICategoryProduct[];
  };
}> => api.delete(`${baseUrl}/${id}`);
