import { getNotificationsService } from 'src/services/notification-service';
import { defineStore } from 'pinia';
import { createError } from 'src/composables/CreateNotify';

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
    // async createCategoryTransaction(name: string) {
    //   this.setLoading(true);
    //   try {
    //     const response = await createCategoryTransactionService(name);
    //     if (response.status === 201) {
    //       this.clearListCategoryTransaction();
    //       this.setListCategoryTransaction(response.data.categories);
    //       createSuccess(response.data.message);
    //     }

    //     return response;
    //   } catch (error) {
    //     createError(error);
    //     return undefined;
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    // async updateCategoryTransaction(id: number, name: string) {
    //   this.setLoading(true);
    //   try {
    //     const response = await updateCategoryTransactionService(id, name);
    //     if (response.status === 200) {
    //       this.clearListCategoryTransaction();
    //       this.setListCategoryTransaction(response.data.categories);
    //       createSuccess(response.data.message);
    //     }

    //     return response;
    //   } catch (error) {
    //     createError(error);
    //     return undefined;
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
    // async deleteCategoryTransaction(id: number) {
    //   this.setLoading(true);
    //   try {
    //     const response = await deleteCategoryTransactionService(id);
    //     if (response.status === 200) {
    //       this.clearListCategoryTransaction();
    //       this.setListCategoryTransaction(response.data.categories);
    //       createSuccess(response.data.message);
    //     }
    //     return response;
    //   } catch (error) {
    //     createError(error);
    //     return undefined;
    //   } finally {
    //     this.setLoading(false);
    //   }
    // },
  },
});
