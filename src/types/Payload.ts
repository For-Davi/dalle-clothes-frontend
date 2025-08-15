export interface CreateGrid {
  gridName: string;
  items: {
    size: string;
    order: number;
  }[];
}

export interface UpdateGrid {
  id: number;
  gridName: string;
  active: number;
  items: {
    size: string;
    order: number;
    active: number;
  }[];
}

