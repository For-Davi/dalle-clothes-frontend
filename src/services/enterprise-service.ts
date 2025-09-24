import { api } from 'boot/axios';

const baseUrl = 'enterprise';

export const showEnterpriseService = (): Promise<{
  status: number;
  data: {
    enterprise: IEnterprise;
    message: string;
  };
}> => api.get(`${baseUrl}/`);

export const updateEnterpriseService = (
  enterprise: IDataEnterprise,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.put(`${baseUrl}/`, enterprise);

export const deleteEnterpriseService = (): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.delete(`${baseUrl}/`);
