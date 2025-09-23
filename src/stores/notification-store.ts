import {
  getNotificationsService,
  updateReadService,
  deleteReadService,
} from 'src/services/notification-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    loadingNotification: false as boolean,
    listNotification: [] as INotification[],
  }),
  actions: {
    clearListNotification() {
      this.listNotification.splice(0, this.listNotification.length);
    },
    setLoading(loading: boolean) {
      this.loadingNotification = loading;
    },
    setListNotification(notifications: INotification[]) {
      notifications.map((item) => this.listNotification.push(item));
    },
    async getNotifications() {
      try {
        this.setLoading(true);
        const response = await getNotificationsService();
        if (response.status === 200) {
          this.clearListNotification();
          this.setListNotification(response.data.notifications);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async updateRead(notificationID: number | null) {
      this.setLoading(true);
      try {
        const response = await updateReadService(notificationID);
        if (response.status === 200) {
          this.listNotification = this.listNotification.map((item) => {
            if (item.id === notificationID) {
              return { ...item, read: 1 };
            }
            return item;
          });
        }
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async deleteNotification(notificationID: number) {
      this.setLoading(true);
      try {
        const response = await deleteReadService(notificationID);
        if (response.status === 200) {
          this.clearListNotification();
          this.setListNotification(response.data.notifications);
          createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
