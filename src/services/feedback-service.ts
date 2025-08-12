import { api } from 'boot/axios';

const baseUrl = 'feedback';

export const createFeedbackService = (text: string, images: IMediaItem[]) => {
  const formData = new FormData();
  formData.append('text', text);

  images.forEach((image, index) => {
    formData.append(`images[${index}]`, image as File);
  });

  return api.post(`${baseUrl}/`, formData);
};
