import { api } from 'boot/axios';

const baseUrl = 'supplier/catalog';

export const getCatalogSupplierService = (
  id: number | null,
): Promise<{
  status: number;
  data: {
    catalog: ILinkedProducts[];
  };
}> => api.get(`${baseUrl}/${id}`);

export const createCatalogSupplierService = (
  supplierID: number | null,
  productVariantID: number,
  price: string,
  description: string | null,
): Promise<{
  status: number;
  data: {
    message: string;
    catalog: ILinkedProducts[];
  };
}> => api.post(`${baseUrl}/`, { price, description, supplierID, productVariantID });

export const updateCatalogSupplierService = (
  supplierID: number | null,
  productVariantID: number,
  price: string,
  description: string | null,
): Promise<{
  status: number;
  data: {
    message: string;
    catalog: ILinkedProducts[];
  };
}> => api.put(`${baseUrl}/`, { supplierID, productVariantID, price, description });

export const getAllSuppliersByVariantService = (
  variantID: number | null
): Promise<{
  status: number;
  data: {
    catalog: ILinkedProducts[];
  };
}> => api.get(`${baseUrl}/variant/${variantID}`);

export const deleteCatalogSupplierService = (
  supplierID: number,
  variantProductID: number,
): Promise<{
  status: number;
  data: {
    message: string;
    catalog: ILinkedProducts[];
  };
}> => api.delete(`${baseUrl}/${supplierID}/${variantProductID}`);
