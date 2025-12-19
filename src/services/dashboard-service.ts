import { api } from 'boot/axios';

const baseUrl = 'dashboard';

export const getDashboardInfoService = (): Promise<{
  status: number;
  data: {
    info: IDashboardData;
  };
}> => api.get(`${baseUrl}`);

export const getDashboardFilterInfoService = (
  filter: IFilterDashboard,
): Promise<{
  status: number;
  data: {
    info: IDashboardData;
  };
}> => api.post(`${baseUrl}/filter`, filter);
