import { api } from 'boot/axios';

const baseUrl = 'notification';

export const getNotificationsService = (): Promise<{
  status: number;
  data: {
    notifications: INotification[];
  };
}> => api.get(`${baseUrl}/`);

export const updateReadService = (
  notificationID: number | null,
): Promise<{
  status: number;
  data: {
    notification: INotification[];
  };
}> => api.put(`${baseUrl}/${notificationID}`);

export const deleteReadService = (
  notificationID: number | null,
): Promise<{
  status: number;
  data: {
    notifications: INotification[];
    message: string;
  };
}> => api.delete(`${baseUrl}/delete/${notificationID}`);
