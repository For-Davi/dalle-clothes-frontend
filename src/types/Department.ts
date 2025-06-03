export interface DataDepartment {
  name: string;
  parent: number | null;
  parentName: string | null;
}

export interface Department {
  id: number;
  name: string;
  enterprise_id: number;
  parent_id: number;
}

export interface TransformedDepartment {
  id: number;
  label: string;
  icon: string;
  children: TransformedDepartment[];
}

export interface DepartmentNode {
  id: number;
  label: string;
  icon: string;
  children: TransformedDepartment[];
}

export interface DepartmentRoot {
  id: number;
  name: string;
}
