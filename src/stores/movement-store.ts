import {
  createMovementService,
  deleteMovementService,
  getMovementsFilterService,
  getMovementsService,
  showMovementService,
  updateMovementService,
} from 'src/services/movement-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useMovementStore = defineStore('movement', {
  state: () => ({
    loadingMovement: false as boolean,
    listMovement: [] as IMovement[],
  }),
  actions: {
    clearListMovement() {
      this.listMovement.splice(0, this.listMovement.length);
    },
    setLoading(loading: boolean) {
      this.loadingMovement = loading;
    },
    setListMovement(movements: IMovement[]) {
      movements.map((item) => this.listMovement.push(item));
    },
    async getMovements(filter: IFilterMovement | null = null) {
      try {
        this.setLoading(true);
        let response = null;
        if (filter) {
          response = await getMovementsFilterService(filter);
        } else {
          response = await getMovementsService();
        }

        if (response.status === 200) {
          this.clearListMovement();
          this.setListMovement(response.data.movements);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async showMovement(movementID: number) {
      try {
        this.setLoading(true);
        return await showMovementService(movementID);
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createMovement(data: IDataMovement) {
      this.setLoading(true);
      try {
        const response = await createMovementService(data);
        if (response.status === 201) {
          this.clearListMovement();
          this.setListMovement(response.data.movements);
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
    async updateMovement(data: IDataMovement) {
      this.setLoading(true);
      try {
        const response = await updateMovementService(data);
        if (response.status === 200) {
          this.clearListMovement();
          this.setListMovement(response.data.movements);
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
    async deleteMovement(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteMovementService(id);
        if (response.status === 200) {
          this.clearListMovement();
          this.setListMovement(response.data.movements);
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
