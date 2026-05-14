import { api } from 'src/boot/axios';

const baseUrl = 'cache';

export const clearCacheService = (): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post(`${baseUrl}/clear`);
