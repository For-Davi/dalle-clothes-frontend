import { api } from 'boot/axios';
import { createError } from 'src/composables/CreateNotify';

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

export const exportSchedulesService = async (filter: IExportSchedule) => {
  try {
    const response = await api.post(`${baseUrl}/export`, filter, {
      responseType: 'blob',
    });

    const ext = filter.format === 'excel' ? 'xlsx' : 'pdf';

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `agendamentos_${timestamp}.${ext}`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    createError(error);
  }
};

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
