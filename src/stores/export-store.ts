import {
  exportDataService,
} from 'src/services/export-service';
import { defineStore } from 'pinia';
import { createError } from 'src/composables/CreateNotify';

export const useExportStore = defineStore('export', {
  state: () => ({
    loadingExportExcel: false as boolean,
    loadingExportPDF: false as boolean
  }),
  actions: {
    setLoadingExcel(loading: boolean) {
      this.loadingExportExcel = loading;
    },
    setLoadingPDF(loading: boolean) {
        this.loadingExportPDF = loading;
    },
    async exportMovementsExcel(date: string,out: boolean, entry: boolean, categoryId: number | null  ) {
      this.setLoadingExcel(true)
      try {
        const response = await exportDataService(date, out, entry, categoryId);

        return response;
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoadingExcel(false)
      }
    },
  },
});
