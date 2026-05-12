export interface DataSellerRegistration {
  name: string;
  phone: string;
  email: string;
  cpf: string;
  password: string;
  description: string | null;
}

export interface Seller {
  id?: number;
  name: string;
  email: string;
  phone: string;
  code: string;
  commission: number;
  cpf: string;
}
