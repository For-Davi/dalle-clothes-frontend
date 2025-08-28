import { api } from 'boot/axios';

const baseUrl = 'notification';

export const getNotificationsService = (
): Promise<{
  status: number;
  data: {
    notifications: INotification[];
  };
}> => api.get(`${baseUrl}/`);
