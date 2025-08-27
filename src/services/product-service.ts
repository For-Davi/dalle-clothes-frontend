import { api } from 'boot/axios';
import { createError } from 'src/composables/CreateNotify';

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

export const exportProductsService = async (filter: IExportProduct) => {
  try {
    const response = await api.post(`${baseUrl}/export`, filter, {
      responseType: 'blob',
    });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `produtos_${timestamp}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    createError(error);
  }
};

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

export const updateProductMediaService = (
  productID: number,
  newImages: IMediaItem[],
  imagesToDelete: { id: number }[],
): Promise<{
  status: number;
  data: {
    images: IImage[];
    logs: ILog[];
    message: string;
  };
}> => {
  const formData = new FormData();

  formData.append('productID', productID.toString());

  newImages.forEach((image) => {
    if (image instanceof File) {
      formData.append('newImages[]', image);
    }
  });

  formData.append('imagesToDelete', JSON.stringify(imagesToDelete));

  return api.post(`${baseUrl}/update-media`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProductBasicService = (
  data: IDataProductBasic,
): Promise<{
  status: number;
  data: {
    basic: IProductBasic;
    logs: ILog[];
    message: string;
  };
}> => api.put(`${baseUrl}/basic/`, data);

export const updateProductAdvancedService = (
  data: IDataProductAdvanced,
): Promise<{
  status: number;
  data: {
    advanced: IReturnProductAdvanced;
    logs: ILog[];
    message: string;
  };
}> => api.put(`${baseUrl}/advanced/`, data);

export const updateProductTagService = (
  productID: number,
  data: { id: number }[],
): Promise<{
  status: number;
  data: {
    tags: ITag[];
    logs: ILog[];
    message: string;
  };
}> => api.put(`${baseUrl}/tag/`, { productID: productID, tags: data });

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
