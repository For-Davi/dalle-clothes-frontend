import { api } from 'boot/axios';

const baseUrl = 'delivery';

export const getDeliveriesService = (
  status: string,
): Promise<{
  status: number;
  data: {
    deliveries: IDelivery[];
  };
}> => api.post(`${baseUrl}/`, { status });

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
