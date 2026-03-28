import { api } from 'boot/axios';

const baseUrl = 'commission';

export const getComissionsService = (
  filters: IFilterCommission,
): Promise<{
  status: number;
  data: {
    commissions: ICommissionPeriod[];
  };
}> => api.post(`${baseUrl}/`, filters);

export const getComissionsBySaleService = (
  saleID: number,
): Promise<{
  status: number;
  data: {
    commissions: ICommission[];
  };
}> => api.get(`${baseUrl}/${saleID}`);
