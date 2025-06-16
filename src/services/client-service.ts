import { api } from 'boot/axios';

const baseUrl = 'client';

export const getClientsService = (): Promise<{
  status: number;
  data: {
    clients: IClient[];
  };
}> => api.get(`${baseUrl}`);

export const getClientsFilterService = (
  filter: IFilterClient,
): Promise<{
  status: number;
  data: {
    clients: IClient[];
  };
}> => api.post(`${baseUrl}/filter`, filter);

export const showClientService = (
  clientId: number,
): Promise<{
  status: number;
  data: {
    client: IClient;
  };
}> => api.get(`${baseUrl}/${clientId}`);

export const createClientService = (
  name: string,
  email: string | null,
  phone: string | null,
  dateBirthday: string | null,
  cpf: number | null,
  cnpj: number | null,
  stateRegistration: string | null,
  municipalRegistration: string | null,
  country: string | null,
  state: string | null,
  city: string | null,
  cep: number | null,
  neighborhood: string | null,
  address: string | null,
  number: number | null,
  complement: string | null,
  description: string | null,
  sex: string,
): Promise<{
  status: number;
  data: {
    clients: IClient[];
    message: string;
  };
}> =>
  api.post(`${baseUrl}/`, {
    name,
    email,
    phone,
    dateBirthday,
    cpf,
    cnpj,
    stateRegistration,
    municipalRegistration,
    country,
    state,
    city,
    cep,
    neighborhood,
    address,
    number,
    complement,
    description,
    sex,
  });

export const updateClientService = (
  id: number,
  name: string,
  email: string | null,
  phone: string | null,
  dateBirthday: string | null,
  cpf: number | null,
  cnpj: number | null,
  stateRegistration: string | null,
  municipalRegistration: string | null,
  country: string | null,
  state: string | null,
  city: string | null,
  cep: number | null,
  neighborhood: string | null,
  address: string | null,
  number: number | null,
  complement: string | null,
  description: string | null,
  sex: string,
): Promise<{
  status: number;
  data: {
    clients: IClient[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
    email,
    phone,
    dateBirthday,
    cpf,
    cnpj,
    stateRegistration,
    municipalRegistration,
    country,
    state,
    city,
    cep,
    neighborhood,
    address,
    number,
    complement,
    description,
    sex,
  });

export const deleteClientService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    clients: IClient[];
  };
}> => api.delete(`${baseUrl}/${id}`);
