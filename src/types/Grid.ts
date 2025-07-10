export interface Grid {
  id: number;
  name: string;
  active: number;
  enterprise_id: number;
  items: GridItem[];
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

export interface GridItemUpdate {
  order: number;
  size: string;
  active: number;
}
