import { api } from 'boot/axios';

const baseUrl = 'supplier';

export const getSuppliersService = (): Promise<{
  status: number;
  data: {
    suppliers: ISupplier[];
  };
}> => api.get(`${baseUrl}`);

export const createSupplierService = (
  name: string,
  email: string | null,
  phone: string | null,
  cpf: number | null,
  cnpj: number | null,
  stateRegistration: string | null,
  municipalRegistration: string | null,
  site: string | null,
  country: string | null,
  state: string | null,
  city: string | null,
  cep: number | null,
  neighborhood: string | null,
  address: string | null,
  number: number | null,
  complement: string | null,
  description: string | null,
  categorySupplierId: number | null,
): Promise<{
  status: number;
  data: {
    suppliers: ISupplier[];
    message: string;
  };
}> =>
  api.post(`${baseUrl}/`, {
    name,
    email,
    phone,
    cpf,
    cnpj,
    stateRegistration,
    municipalRegistration,
    site,
    country,
    state,
    city,
    cep,
    neighborhood,
    address,
    number,
    complement,
    description,
    categorySupplierId,
  });

export const updateSupplierService = (
  id: number,
  name: string,
  email: string | null,
  phone: string | null,
  cpf: number | null,
  cnpj: number | null,
  stateRegistration: string | null,
  municipalRegistration: string | null,
  site: string | null,
  country: string | null,
  state: string | null,
  city: string | null,
  cep: string | null,
  neighborhood: string | null,
  address: string | null,
  number: string | null,
  complement: string | null,
  description: string | null,
  categorySupplierId: number | null,
): Promise<{
  status: number;
  data: {
    suppliers: ISupplier[];
    message: string;
  };
}> =>
  api.put(`${baseUrl}/`, {
    id,
    name,
    email,
    phone,
    cpf,
    cnpj,
    stateRegistration,
    municipalRegistration,
    site,
    country,
    state,
    city,
    cep,
    neighborhood,
    address,
    number,
    complement,
    description,
    categorySupplierId,
  });

export const deleteSupplierService = (
  id: number,
): Promise<{
  status: number;
  data: {
    message: string;
    suppliers: ISupplier[];
  };
}> => api.delete(`${baseUrl}/${id}`);
