import { defineStore } from 'pinia';
import {
  updateAppearanceSettingsService,
  getAppearanceSettingService,
} from 'src/services/appearance-settings-service';
import {
  updateSystemSettingService,
  getSystemSettingService,
} from 'src/services/system-settings-service';
import { clearCacheService } from 'src/services/cache-service';
import { createError, createSuccess } from 'src/composables/CreateNotify';
import { useStorage } from '@vueuse/core';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    loadingSetting: false as boolean,
    appearanceSetting: useStorage('dalle_manage_appearance_setting', {} as IAppearance),
    systemSetting: useStorage('dalle_manage_notification_setting', {} as ISystem),
  }),
  actions: {
    setAppearance(appearance: IAppearance) {
      this.appearanceSetting = appearance;
    },
    setSystem(system: ISystem) {
      this.systemSetting = system;
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

    async updateSystemSetting(data: ISettingSystem) {
      try {
        this.setLoading(true);
        const response = await updateSystemSettingService(data);

        if (response.status === 200) {
          this.setSystem(response.data.system);
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
    async getSettingSystem() {
      try {
        this.setLoading(true);
        const response = await getSystemSettingService();
        if (response.status === 200) {
          this.setSystem(response.data.system);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async clearCache() {
      try {
        this.setLoading(true);
        const response = await clearCacheService();
        if (response.status === 200) {
          createSuccess(response.data.message);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
