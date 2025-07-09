export interface Grid {
  id: number;
  name: string;
  active: number;
  enterprise_id: number;
  itens: GridItem[];
}
export interface GridGroup {
  id: number;
  name: string;
  active: number;
  enterprise_id: number;
}

export interface GridItem {
  id: number;
  size: string;
  order: number;
  active: number;
  grid_group_id: number;
  enterprise_id: number;
}

export interface GridItemCreate {
  order: number;
  size: string;
}
