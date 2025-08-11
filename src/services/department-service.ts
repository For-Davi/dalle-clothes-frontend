import { api } from 'boot/axios';

const baseUrl = 'department';

export const getDepartmentsService = (): Promise<{
  status: number;
  data: {
    departments: IDepartment[];
  };
}> => api.get(`${baseUrl}`);

export const createDepartmentService = (
  name: string,
  parentId: number | null,
): Promise<{
  status: number;
  data: {
    message: string;
     departments: IDepartment[]
  };
}> => api.post(`${baseUrl}/`, { name, parentId });

export const updateDepartmentService = (
  id: number,
  name: string,
  parentId: number | null,
): Promise<{
  status: number;
  data: {
    message: string;
    departments: IDepartment[]
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
    parentId,
  });

export const deleteDepartmentService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    departments: IDepartment[];
  };
}> => api.delete(`${baseUrl}/${id}`);
