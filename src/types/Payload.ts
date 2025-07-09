export interface CreateGrid {
  grid: {
    size: string;
    order: number;
  }[];
}

export interface UpdateGrid {
  id: number;
  grid: {
    size: string;
    order: number;
  }[];
}
