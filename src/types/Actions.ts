export type ActionStock =
  | 'export'
  | 'history'
  | 'grid'
  | 'color'
  | 'transaction'
  | 'tag'
  | 'settings'
  | 'category';

export type ActionsMovement = 'history' | 'category' | 'export';

export type ActionsSupplier = 'order' | 'category';

export type ActionsUser = 'role' | 'department';
