import { api } from 'boot/axios';

const baseUrl = 'schedule';

export const getSchedulesService = (): Promise<{
  status: number;
  data: {
    schedules: ISchedule[];
  };
}> => api.get(`${baseUrl}`);

export const getSchedulePeriodService = (): Promise<{
  status: number;
  data: {
    periods: string[];
  };
}> => api.get(`${baseUrl}/periods`);

export const getSchedulesFilterService = (
  filter: IFilterMovement,
): Promise<{
  status: number;
  data: {
    schedules: ISchedule[];
  };
}> => api.post(`${baseUrl}/filter`, filter);

export const showScheduleService = (
  scheduleID: number,
): Promise<{
  status: number;
  data: {
    schedule: ISchedule;
  };
}> => api.get(`${baseUrl}/${scheduleID}`);

export const finishScheduleService = (
  data: IDataScheduleFinish,
): Promise<{
  status: number;
  data: {
    message: string;
    schedules: ISchedule[];
  };
}> => api.post(`${baseUrl}/finish`, data);

export const createScheduleService = (
  data: IDataMovement,
): Promise<{
  status: number;
  data: {
    schedules: ISchedule[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, data);

export const updateScheduleService = (
  data: IDataMovement,
): Promise<{
  status: number;
  data: {
    schedules: ISchedule[];
    message: string;
  };
}> => api.put(`${baseUrl}/`, data);

export const deleteScheduleService = (
  id: number,
): Promise<{
  status: number;
  data: {
    schedules: ISchedule[];
    message: string;
  };
}> => api.delete(`${baseUrl}/${id}`);
