import { api } from 'boot/axios';

const baseUrl = 'product';

export const getProductVariantService = (
  id: number,
): Promise<{
  status: number;
  data: {
    variant: IVariant;
  };
}> => api.get(`${baseUrl}/variant/${id}`);

export const getProductsService = (): Promise<{
  status: number;
  data: {
    products: IProduct[];
  };
}> => api.get(`${baseUrl}`);

export const showProductService = (
  productID: number,
): Promise<{
  status: number;
  data: {
    product: IShowProdut;
  };
}> => api.get(`${baseUrl}/${productID}}`);

export const getProductsFilterService = (
  filter: IFilterProduct,
): Promise<{
  status: number;
  data: {
    products: IProduct[];
  };
}> => api.post(`${baseUrl}/filter`, filter);

export const createProductService = (
  data: IDataCreateProduct,
): Promise<{
  status: number;
  data: {
    products: IProduct[];
    message: string;
  };
}> => {
  const formData = new FormData();

  formData.append('basic[name]', data.basic.name);
  formData.append('basic[description]', data.basic.description || '');
  formData.append('basic[type]', data.basic.type);
  formData.append('basic[categoryID]', String(data.basic.categoryID || ''));

  data.variants.forEach((variant) => {
    formData.append('variants[]', JSON.stringify(variant));
  });

  data.images.forEach((image) => {
    if (image instanceof File) {
      formData.append(`images[]`, image);
    }
  });

  data.tags.forEach((tag) => {
    formData.append('tags[]', JSON.stringify(tag));
  });

  formData.append('advanced[active]', String(data.advanced.active));
  formData.append('advanced[allowCoupon]', String(data.advanced.allowCoupon));
  formData.append('advanced[allowDiscount]', String(data.advanced.allowDiscount));
  formData.append('advanced[discountMaxPercentage]', String(data.advanced.discountMaxPercentage));
  formData.append('advanced[hasCommission]', String(data.advanced.hasCommission));
  formData.append('advanced[commissionPercentage]', String(data.advanced.commissionPercentage));

  return api.post(`${baseUrl}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

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

export const updateVariantService = (
  data: IDataUpdateVariant,
): Promise<{
  status: number;
  data: {
    products: IProduct[];
    message: string;
  };
}> => api.put(`${baseUrl}/variant/`, data);

export const deleteProductService = (
  id: number,
): Promise<{
  status: number;
  data: {
    products: IProduct[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);

export const deleteProductVariantService = (
  id: number,
): Promise<{
  status: number;
  data: {
    products: IProduct[];
    message: string;
  };
}> => api.delete(`${baseUrl}/variant/${id}`);
