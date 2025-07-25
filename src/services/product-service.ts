import { api } from 'boot/axios';

const baseUrl = 'product';

export const getProductsService = (): Promise<{
  status: number;
  data: {
    products: unknown[];
  };
}> => api.get(`${baseUrl}`);

export const createProductService = (
  data: IDataCreateProduct,
): Promise<{
  status: number;
  data: {
    products: unknown[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

// export const updateColorService = (
//   id: number,
//   name: string,
//   active: number,
//   hexColorCode: string | null,
// ): Promise<{
//   status: number;
//   data: {
//     colors: IColor[];
//     message: string;
//   };
// }> =>
//   api.put(`${baseUrl}/`, {
//     id,
//     name,
//     active,
//     hexColorCode,
//   });

export const deleteColorService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    colors: IColor[];
  };
}> => api.delete(`${baseUrl}/${id}`);
