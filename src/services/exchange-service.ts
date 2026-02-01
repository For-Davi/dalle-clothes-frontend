import { api } from 'boot/axios';

const baseUrl = 'exchange';

export const getExchangesService = (
  saleID: number,
): Promise<{
  status: number;
  data: {
    exchanges: IExchanges[];
  };
}> => api.get(`${baseUrl}/${saleID}`);

// export const getReturnItemsService = (
//   returnID: number,
// ): Promise<{
//   status: number;
//   data: {
//     products: IDataReturnItens[];
//   };
// }> => api.get(`${baseUrl}/linked/${returnID}`);
