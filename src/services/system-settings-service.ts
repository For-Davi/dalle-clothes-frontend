import { api } from 'boot/axios';

const baseUrl = 'setting/system';

export const updateSystemSettingService = (
  data: ISettingSystem,
): Promise<{
  status: number;
  data: {
    message: string;
    system: ISystem;
  };
}> => {
  return api.put(`${baseUrl}/`, data);
};

export const getSystemSettingService = (): Promise<{
  status: number;
  data: {
    system: ISystem;
  };
}> => {
  return api.get(`${baseUrl}/`);
};
