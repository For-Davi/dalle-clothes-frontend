import { createFeedbackService } from 'src/services/feedback-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    loadingFeedback: false as boolean,
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loadingFeedback = loading;
    },
    async createFeedback(text: string, images: IMediaItem[]) {
      this.setLoading(true);
      try {
        const response = await createFeedbackService(text, images);
        if (response.status === 201) {
          createSuccess(response.data.message);
        }

        return response;
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
