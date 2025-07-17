import {
  createTagService,
  deleteTagService,
  getTagsService,
  updateTagService,
} from 'src/services/tag-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useTagStore = defineStore('tag', {
  state: () => ({
    loadingTag: false as boolean,
    listTag: [] as ITag[],
  }),
  actions: {
    clearListTag() {
      this.listTag.splice(0, this.listTag.length);
    },
    setLoading(loading: boolean) {
      this.loadingTag = loading;
    },
    setListTag(tags: ITag[]) {
      tags.map((item) => this.listTag.push(item));
    },
    async getTags() {
      try {
        this.setLoading(true);
        const response = await getTagsService();
        if (response.status === 200) {
          this.clearListTag();
          this.setListTag(response.data.tags);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createTag(name: string) {
      this.setLoading(true);
      try {
        const response = await createTagService(name);
        if (response.status === 201) {
          this.clearListTag();
          this.setListTag(response.data.tags);
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
    async updateTag(id: number, name: string, active: number) {
      this.setLoading(true);
      try {
        const response = await updateTagService(id, name, active);
        if (response.status === 200) {
          this.clearListTag();
          this.setListTag(response.data.tags);
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
    async deleteTag(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteTagService(id);
        if (response.status === 200) {
          this.clearListTag();
          this.setListTag(response.data.tags);
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
