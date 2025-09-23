export interface Enterprise {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  subscription_id: number;
  cpf: string | null;
  cnpj: string | null;
  cep: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  number_address: string | null;
  complement: string | null;
}

export interface DataEnterprise {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  cnpj: string | null;
  cep: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  numberAddress: string | null;
  complement: string | null;
}
