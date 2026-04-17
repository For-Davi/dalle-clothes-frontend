import { api } from 'boot/axios';
import { createError } from 'src/composables/CreateNotify';

const baseUrl = 'delivery';

export const getDeliveriesService = (
  status: string,
): Promise<{
  status: number;
  data: {
    deliveries: IDelivery[];
  };
}> => api.post(`${baseUrl}/`, { status });

export const getDeliveriesFilterService = (
  status: string,
  filter: IFilterDelivery,
): Promise<{
  status: number;
  data: {
    deliveries: IDelivery[];
  };
}> => api.post(`${baseUrl}/filter`, { status, filter });

export const getDeliveryDashboardService = (): Promise<{
  status: number;
  data: {
    dashboard: IDashboardDelivery;
  };
}> => api.get(`${baseUrl}/dashboard`);

export const showDeliveryService = (
  deliveryID: number,
): Promise<{
  status: number;
  data: {
    delivery: IDelivery;
  };
}> => api.get(`${baseUrl}/${deliveryID}`);

export const scheduleDeliveryService = (
  deliveryID: number,
  schedule: string,
  deliveryGuyID: number | null,
  status: string,
): Promise<{
  status: number;
  data: {
    deliveries: IDelivery[];
  };
}> => api.post(`${baseUrl}/schedule`, { deliveryID, schedule, deliveryGuyID, status });

export const createPartialDeliveredDeliveryService = (
  deliveryID: number,
  deliveredProducts: IDeliveredProducts[],
  status: string,
): Promise<{
  status: number;
  data: {
    message: string;
    deliveries: IDelivery[];
  };
}> => api.post(`${baseUrl}/partial-delivered`, { deliveryID, deliveredProducts, status });

export const updateDeliveryStatusService = (
  deliveryID: number,
  deliveryStatus: string,
  status: string,
  deliveryGuyID: number | null,
): Promise<{
  status: number;
  data: {
    message: string;
    deliveries: IDelivery[];
  };
}> => api.put(`${baseUrl}/`, { deliveryID, deliveryStatus, status, deliveryGuyID });

export const exportDeliveryService = async (filter: IExportDelivery) => {
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
    link.setAttribute('download', `entregas_${timestamp}.${ext}`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    createError(error);
  }
};
