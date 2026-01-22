export interface Color {
  id: number;
  name: string;
  active: number;
  enterprise_id: string;
  hex_color_code: string;
}

export interface ColorMountVariant {
  id: number;
  name: string;
  hex: string;
  min_alert: number;
  stock: number;
}
