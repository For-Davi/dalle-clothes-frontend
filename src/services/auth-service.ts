import { api } from 'src/boot/axios';

const baseUrl = 'user';

export const doLoginService = (
  email: string,
  password: string,
): Promise<{
  status: number;
  data: {
    user: IUser;
    enterprise_name: string;
    token: string;
  };
}> => api.post('/login', { email, password });

export const doResetService = (
  email: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post('/reset', { email });
export const doVerifyService = (
  code: string,
  email: string,
): Promise<{
  status: number;
  data: {
    message: string;
    valid: false;
  };
}> => api.post('/verify', { code, email });
export const setNewPasswordService = (
  password: string,
  token: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> => api.post('/newPassword', { password, token });

export const doRegisterService = (
  name: string,
  email: string,
  password: string,
  nameEnterprise: string,
): Promise<{
  status: number;
  data: {
    user: IUser;
    token: string;
    message: string;
  };
}> =>
  api.post('/register', {
    name,
    email,
    password,
    nameEnterprise,
  });

export const updateUserDataService = (
  name: string,
  email: string,
  photoAdd: IMediaItem | null,
  photoDelete: number | null,
): Promise<{
  status: number;
  data: {
    user: IUser;
    message: string;
  };
}> => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);

  if (photoDelete !== null) {
    formData.append('photoDelete', String(photoDelete));
  }

  if (photoAdd) {
    formData.append('photoAdd', photoAdd as File);
  }

  return api.post(`${baseUrl}/update-data`, formData);
};

export const updateUserPasswordService = (
  actualPassword: string,
  newPassword: string,
): Promise<{
  status: number;
  data: {
    message: string;
  };
}> =>
  api.put(`${baseUrl}/update-password`, {
    currentPassword: actualPassword,
    newPassword: newPassword,
  });
