import {
  createScheduleService,
  deleteScheduleService,
  getSchedulePeriodService,
  getSchedulesFilterService,
  getSchedulesService,
  showScheduleService,
  updateScheduleService,
} from 'src/services/schedule-service';
import { defineStore } from 'pinia';
import { createError, createSuccess } from 'src/composables/CreateNotify';

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    loadingSchedule: false as boolean,
    listSchedule: [] as ISchedule[],
    listSchedulePeriod: [] as string[],
  }),
  actions: {
    clearListSchedule() {
      this.listSchedule.splice(0, this.listSchedule.length);
    },
    clearListSchedulePeriod() {
      this.listSchedulePeriod.splice(0, this.listSchedulePeriod.length);
    },
    setLoading(loading: boolean) {
      this.loadingSchedule = loading;
    },
    setListSchedule(schedules: ISchedule[]) {
      schedules.map((item) => this.listSchedule.push(item));
    },
    setListSchedulePeriod(schedules: string[]) {
      schedules.map((item) => this.listSchedulePeriod.push(item));
    },
    async getSchedules(filter: IFilterSchedule | null = null) {
      try {
        this.setLoading(true);
        let response = null;
        if (filter) {
          response = await getSchedulesFilterService(filter);
        } else {
          response = await getSchedulesService();
        }

        if (response.status === 200) {
          this.clearListSchedule();
          this.setListSchedule(response.data.schedules);
        }
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async getSchedulePeriod() {
      this.setLoading(true);
      try {
        const response = await getSchedulePeriodService();
        if (response.status === 200) {
          this.clearListSchedulePeriod();
          this.setListSchedulePeriod(response.data.periods);
        }
      } catch (error) {
        createError(error);
        return undefined;
      } finally {
        this.setLoading(false);
      }
    },
    async showSchedule(scheduleID: number) {
      try {
        this.setLoading(true);
        return await showScheduleService(scheduleID);
      } catch (error) {
        createError(error);
      } finally {
        this.setLoading(false);
      }
    },
    async createSchedule(data: IDataSchedule) {
      this.setLoading(true);
      try {
        const response = await createScheduleService(data);
        if (response.status === 201) {
          this.clearListSchedule();
          this.setListSchedule(response.data.schedules);
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
    async updateSchedule(data: IDataSchedule) {
      this.setLoading(true);
      try {
        const response = await updateScheduleService(data);
        if (response.status === 200) {
          this.clearListSchedule();
          this.setListSchedule(response.data.schedules);
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
    async deleteSchedule(id: number) {
      this.setLoading(true);
      try {
        const response = await deleteScheduleService(id);
        if (response.status === 200) {
          this.clearListSchedule();
          this.setListSchedule(response.data.schedules);
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
