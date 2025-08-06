import { api } from 'boot/axios';

const baseUrl = 'setting/appearance';

export const updateAppearanceSettingsService = (
  data: ISettingAppearance,
): Promise<{
  status: number;
  data: {
    message: string;
    appearance: IAppearance;
  };
}> => {
  return api.put(`${baseUrl}/`, data);
};

export const getAppearanceSettingService = (): Promise<{
  status: number;
  data: {
    appearance: IAppearance;
  };
}> => {
  return api.get(`${baseUrl}/`);
};
