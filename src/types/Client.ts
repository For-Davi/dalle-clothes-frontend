export interface Client {
  id: number;
  name: string;
  email: string | null;
  date_birthday: string | null;
  cpf: number | null;
  cnpj: number | null;
  state_registration: string | null;
  municipal_registration: string | null;
  phone: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  cep: number | null;
  neighborhood: string | null;
  address: string | null;
  number: number | null;
  complement: string | null;
  enterprise_id: number | null;
  description: string | null;
  sex: string;
  created_at?: string;
}

export interface VModelClient {
  id: number | null;
  name: string;
  email: string | null;
  dateBirthday: string | null;
  cpf: string | null;
  cnpj: string | null;
  stateRegistration: string | null;
  municipalRegistration: string | null;
  phone: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  cep: string | null;
  neighborhood: string | null;
  address: string | null;
  number: string | null;
  complement: string | null;
  description: string | null;
  sex: string;
}

export interface FilterClient {
  name: string;
  email: string;
  cpf: string | null;
  cnpj: string | null;
  country: string;
  state: string;
  city: string;
}
