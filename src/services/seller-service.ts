import { api } from 'boot/axios';

export const createSellerRegistrationService = (
  data: IDataSellerRegistration,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post('seller-registration/', data);
