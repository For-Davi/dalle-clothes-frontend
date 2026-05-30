export const actionsStock: {
  label: string;
  icon: string;
  type: IActionStock;
  permission: string | null;
}[] = [
  {
    label: 'Configurações',
    icon: 'settings',
    type: 'settings',
    permission: null,
  },
  {
    label: 'Exportar',
    icon: 'download',
    type: 'export',
    permission: null,
  },
  {
    label: 'Histórico',
    icon: 'history',
    type: 'history',
    permission: null,
  },
  {
    label: 'Grade',
    icon: 'pin',
    type: 'grid',
    permission: 'grid.view',
  },
  {
    label: 'Cores',
    icon: 'colorize',
    type: 'color',
    permission: 'product-color.view',
  },
  {
    label: 'Tags',
    icon: 'tag',
    type: 'tag',
    permission: 'product-tag.view',
  },
  {
    label: 'Categorias',
    icon: 'category',
    type: 'category',
    permission: 'product-category.view',
  },
  {
    label: 'Entrada/Saída',
    icon: 'repeat',
    type: 'transaction',
    permission: 'product.movement',
  },
];

export const actionsMovement: {
  label: string;
  icon: string;
  type: IActionMovement;
  permission: string | null;
}[] = [
  {
    label: 'Exportar',
    icon: 'download',
    type: 'export',
    permission: null,
  },
  {
    label: 'Histórico',
    icon: 'history',
    type: 'history',
    permission: null,
  },
  {
    label: 'Categorias',
    icon: 'category',
    type: 'category',
    permission: 'transaction-category.view',
  },
];

export const actionsSupplier: {
  label: string;
  icon: string;
  type: IActionsSupplier;
  permission: string | null;
}[] = [
  {
    label: 'Categorias',
    icon: 'category',
    type: 'category',
    permission: 'supplier-category.view',
  },
  {
    label: 'Pedidos',
    icon: 'paid',
    type: 'order',
    permission: 'supplier-order.view',
  },
];

export const actionsUser: {
  label: string;
  icon: string;
  type: IActionsUser;
  permission: string | null;
}[] = [
  {
    label: 'Permissões',
    icon: 'category',
    type: 'role',
    permission: 'role.view',
  },
  {
    label: 'Departamentos',
    icon: 'group_work',
    type: 'department',
    permission: 'department.view',
  },
];

export const actionsDelivery: { label: string; icon: string; type: IActionDelivery }[] = [
  {
    label: 'Exportar',
    icon: 'download',
    type: 'export',
  },
  {
    label: 'Entregadores',
    icon: 'local_shipping',
    type: 'delivery_guy',
  },
];
