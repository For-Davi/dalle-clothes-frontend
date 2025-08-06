import { defineStore } from 'pinia';
import {
  updateAppearanceSettingsService,
  getAppearanceSettingService,
} from 'src/services/appearance-settings-service';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import { useStorage } from '@vueuse/core';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    loadingSetting: false as boolean,
    appearanceSetting: useStorage('dalle_manage_appearance_setting', {} as IAppearance),
  }),
  actions: {
    setAppearance(appearance: IAppearance) {
      this.appearanceSetting = appearance;
    },
    setLoading(value: boolean) {
      this.loadingSetting = value;
    },
    async updateAppearanceSetting(data: ISettingAppearance) {
      try {
        this.setLoading(true);
        const response = await updateAppearanceSettingsService(data);
        if (response.status === 200) {
          this.setAppearance(response.data.appearance);
          createSuccess(response.data.message);
        }
        return response;
      } catch (error) {
        createError(error);
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async getAppearanceSetting() {
      try {
        this.setLoading(true);
        const response = await getAppearanceSettingService();
        if (response.status === 200) {
          this.setAppearance(response.data.appearance);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
