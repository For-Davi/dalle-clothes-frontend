export interface RoleSelect {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  slug: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions: Permission[];
}

export interface DataRole {
  id?: number;
  name: string;
  description: string | null;
  permissions: number[];
}
