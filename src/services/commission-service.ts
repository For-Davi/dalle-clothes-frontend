import { createError } from 'src/composables/CreateNotify';
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

export const exportCommissionDetailsBySellerAndPeriodService = async (
  filter: IExportCommissionDetailsSellerAndPeriod,
) => {
  try {
    const response = await api.post(`${baseUrl}/export`, filter, {
      responseType: 'blob',
    });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `comissao_detalhes_${timestamp}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    createError(error);
  }
};
