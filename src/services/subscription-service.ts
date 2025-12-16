import { api } from 'boot/axios';

const baseUrl = 'subscription';

export const getSubscriptionsService = (): Promise<{
  status: number;
  data: {
    subscriptions: ISubscriptions[];
  };
}> => api.get(`${baseUrl}/`);

export const generateQrCodeService = (
  subscriptionID: number,
): Promise<{
  status: number;
  data: {
    pix: IQrCode;
  };
}> => api.post(`${baseUrl}/payment/pix/`, { subscriptionID });

export const sendCreditCardData = (
  paymentCreditCard: IPaymentSubscriptionCreditCard,
): Promise<{
  status: number;
  data: {
    result: boolean;
  };
}> => api.post(`${baseUrl}/payment/credit-card/`, paymentCreditCard);
