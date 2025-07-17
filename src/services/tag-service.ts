import { api } from 'boot/axios';

const baseUrl = 'tag';

export const getTagsService = (): Promise<{
  status: number;
  data: {
    tags: ITag[];
  };
}> => api.get(`${baseUrl}`);

export const createTagService = (
  name: string,
): Promise<{
  status: number;
  data: {
    tags: ITag[];
    message: string;
  };
}> => api.post(`${baseUrl}/`, { name });

export const updateTagService = (
  id: number,
  name: string,
  active: number,
): Promise<{
  status: number;
  data: {
    tags: ITag[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
    active,
  });

export const deleteTagService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    tags: ITag[];
  };
}> => api.delete(`${baseUrl}/${id}`);
