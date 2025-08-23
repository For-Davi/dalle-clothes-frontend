import { api } from 'boot/axios'
import { createError } from 'src/composables/CreateNotify';

const baseUrl = 'export'

export const exportDataService = async (
   date: string,
  entry: boolean,
  out: boolean,
  categoryId: number | null
) => {
  try {
    const response = await api.post(
      `${baseUrl}/excel/${date}?entry=${entry}&out=${out}&category=${categoryId}`,
      null, 
      {
        responseType: 'blob',
      }
    );

    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '');

    const url2 = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url2;
    link.setAttribute('download', `movimentacoes_${timestamp}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    createError(error);
  }
};
