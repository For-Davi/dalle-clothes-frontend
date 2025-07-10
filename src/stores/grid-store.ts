import {
  createGridService,
  deleteGridService,
  getGridsService,
  updateGridService,
} from 'src/services/grid-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useGridStore = defineStore('grid', {
  state: () => ({
    loadingGrid: false as boolean,
    listGrid: [] as IGrid[],
  }),
  actions: {
    clearListGrid() {
      this.listGrid.splice(0, this.listGrid.length);
    },
    setLoading(loading: boolean) {
      this.loadingGrid = loading;
    },
    setListGrid(grids: IGrid[]) {
      grids.map((item) => this.listGrid.push(item));
    },
    async getGrids() {
      try {
        this.setLoading(true);
        const response = await getGridsService();
        if (response.status === 200) {
          this.clearListGrid();
          this.setListGrid(response.data.grids);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createGrid(grid: ICreateGrid) {
      this.setLoading(true);
      try {
        const response = await createGridService(grid);
        if (response.status === 201) {
          this.clearListGrid();
          this.setListGrid(response.data.grids);
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
    async updateGrid(grid: IUpdateGrid) {
      this.setLoading(true);
      try {
        const response = await updateGridService(grid);
        if (response.status === 200) {
          this.clearListGrid();
          this.setListGrid(response.data.grids);
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
    async deleteGrid(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteGridService(id);
        if (response.status === 200) {
          this.clearListGrid();
          this.setListGrid(response.data.grids);
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
