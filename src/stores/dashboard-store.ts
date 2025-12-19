import {
  getDashboardInfoService,
  getDashboardFilterInfoService,
} from 'src/services/dashboard-service';
import { defineStore } from 'pinia';
import { createError } from 'src/composables/CreateNotify';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loadingDashboard: false as boolean,
    dashboardInfo: {} as IDashboardData,
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingDashboard = loading;
    },
    setDashboardInfo(dashboard: IDashboardData) {
      this.dashboardInfo = dashboard;
    },
    async getDashboardInfo(filter: IFilterDashboard | null = null) {
      try {
        this.setLoading(true);
        let response = null;
        if (filter) {
          response = await getDashboardFilterInfoService(filter);
        } else {
          response = await getDashboardInfoService();
        }

        if (response.status === 200) {
          this.setDashboardInfo(response.data.info);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
