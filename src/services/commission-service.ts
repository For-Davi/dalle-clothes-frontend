import { api } from 'boot/axios';

const baseUrl = 'commission';

export const getComissionSelectService = (
  saleID: number,
): Promise<{
  status: number;
  data: {
    commissions: ICommission[];
  };
}> => api.get(`${baseUrl}/${saleID}`);
