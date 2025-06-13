export interface Supplier {
  id: number;
  name: string;
  email: string | null;
  cpf: number | null;
  cnpj: number | null;
  state_registration: string | null;
  municipal_registration: string | null;
  phone: string | null;
  site: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  cep: number | null;
  neighborhood: string | null;
  address: string | null;
  number: number | null;
  active: number;
  categore_supplier_id: number | null;
  enterprise_id: number | null;
  description: string | null;
  created_at: string;
}

export interface FilterSupplier {
  name: string;
  email: string;
  cpf: string | null;
  cnpj: string | null;
  active: number | null;
  category: number | null;
  country: string;
  state: string;
  city: string;
}
