import { api } from 'boot/axios';
import type { Department } from '@/types/Department';

const baseUrl = 'department';

export const getDepartmentsService = (): Promise<{
  status: number;
  data: {
    departments: Department[];
  };
}> => api.get(`${baseUrl}`);

export const createDepartmentService = (
  name: string,
  parentId: string | null,
): Promise<{
  status: number;
  data: {
    departments: Department[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, { name, parentId });

export const updateDepartmentService = (
  id: string,
  name: string,
  parentId: string | null,
): Promise<{
  status: number;
  data: {
    departments: Department[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
    parentId,
  });

export const deleteDepartmentService = (
  id: string,
): Promise<{
  status: number;
  data: {
    message: string;
    departments: Department[];
  };
}> => api.delete(`${baseUrl}/${id}`);
