import {
  createColorService,
  deleteColorService,
  getColorsService,
  updateColorService,
} from 'src/services/color-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useColorStore = defineStore('color', {
  state: () => ({
    loadingColor: false as boolean,
    listColor: [] as IColor[],
  }),
  actions: {
    clearListColor() {
      this.listColor.splice(0, this.listColor.length);
    },
    setLoading(loading: boolean) {
      this.loadingColor = loading;
    },
    setListColor(colors: IColor[]) {
      colors.map((item) => this.listColor.push(item));
    },
    async getColors() {
      try {
        this.setLoading(true);
        const response = await getColorsService();
        if (response.status === 200) {
          this.clearListColor();
          this.setListColor(response.data.colors);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createColor(name: string, hexColorCode: string | null) {
      this.setLoading(true);
      try {
        const response = await createColorService(name, hexColorCode);
        if (response.status === 201) {
          this.clearListColor();
          this.setListColor(response.data.colors);
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
    async updateColor(id: number, name: string, active: number, hexColorCode: string | null) {
      this.setLoading(true);
      try {
        const response = await updateColorService(id, name, active, hexColorCode);
        if (response.status === 200) {
          this.clearListColor();
          this.setListColor(response.data.colors);
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
    async deleteColor(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteColorService(id);
        if (response.status === 200) {
          this.clearListColor();
          this.setListColor(response.data.colors);
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
