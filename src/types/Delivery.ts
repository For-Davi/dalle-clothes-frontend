export type ActionsDelivery = 'export' | 'delivery_guy';

export interface Delivery {
  sale_id: number;
  freight_value: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  address: string;
  number_address: string;
  complement: string;
  recipient_name: string;
  recipient_phone: string;
  observation: string;
  return_id: number | null;
  status: string;
  scheduled_date: string | null;
  created_at: string;
  updated_at: string;
  updated_by_name: string | null;
  updated_by_email: string | null;
  delivery_guy_name: string | null;
  delivery_guy_phone: string | null;
}

export interface DeliveryGuy {
  id?: number;
  name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  vehicle: string;
}

export interface ScheduleDeliveryData {
  schedule: string;
  deliveryGuyID: number | null;
}

export interface DashboardDelivery {
  pending: number;
  scheduled: number;
  delivered: number;
}

export interface DeliveredProducts {
  productVariantID: number;
  quantitySaled: number;
  quantityDelivered: number;
}
