import { api } from 'src/boot/axios';
import { apiSeller } from 'src/boot/sellerApi';

const baseUrl = 'dalle-manage/seller';

export const createSellerRegistrationService = (
  data: IDataSellerRegistration,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post('seller-registration/', data);

export const doLoginService = (
  cpf: string | null,
  password: string | null,
  token: string | null,
): Promise<{
  status: number;
  data: {
    seller: ISeller;
    token: string;
  };
}> => api.post(`${baseUrl}/login`, { cpf, password, token });

export const getDashboardService = (
  filter: ISellerFilterDashboard | null = null,
): Promise<{
  status: number;
  data: {
    dashboard: ISellerDashboard[];
  };
}> => apiSeller.post(`${baseUrl}/dashboard`, filter);

export const updateSellerDataService = (
  name: string,
  email: string,
): Promise<{
  status: number;
  data: {
    seller: ISeller;
    message: string;
  };
}> => apiSeller.put(`${baseUrl}/update-data`, { name, email });

export const updateSellerPasswordService = (
  actualPassword: string,
  newPassword: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> =>
  apiSeller.put(`${baseUrl}/update-password`, {
    currentPassword: actualPassword,
    newPassword: newPassword,
  });

export const doResetService = (
  email: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => apiSeller.post(`${baseUrl}/reset`, { email });

export const setNewPasswordService = (
  password: string,
  token: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => apiSeller.post(`${baseUrl}/newPassword`, { password, token });
