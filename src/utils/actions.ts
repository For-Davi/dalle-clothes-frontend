export const actionsStock: { label: string; icon: string; type: IActionStock }[] = [
  {
    label: 'Configurações',
    icon: 'settings',
    type: 'settings',
  },
  {
    label: 'Exportar',
    icon: 'download',
    type: 'export',
  },
  {
    label: 'Histórico',
    icon: 'history',
    type: 'history',
  },
  {
    label: 'Grade',
    icon: 'pin',
    type: 'grid',
  },
  {
    label: 'Cores',
    icon: 'colorize',
    type: 'color',
  },
  {
    label: 'Tags',
    icon: 'tag',
    type: 'tag',
  },
  {
    label: 'Categorias',
    icon: 'category',
    type: 'category',
  },
  {
    label: 'Entrada/Saída',
    icon: 'repeat',
    type: 'transaction',
  },
];

export const actionsMovement: { label: string; icon: string; type: IActionMovement }[] = [
  {
    label: 'Exportar',
    icon: 'download',
    type: 'export',
  },
  {
    label: 'Histórico',
    icon: 'history',
    type: 'history',
  },
  {
    label: 'Categorias',
    icon: 'category',
    type: 'category',
  },
];

export const actionsSupplier: { label: string; icon: string; type: IActionsSupplier }[] = [
  {
    label: 'Categorias',
    icon: 'category',
    type: 'category',
  },
  {
    label: 'Pedidos',
    icon: 'paid',
    type: 'order',
  },
];

export const actionsUser: { label: string; icon: string; type: IActionsUser }[] = [
  {
    label: 'Permissões',
    icon: 'category',
    type: 'role',
  },
  {
    label: 'Departamentos',
    icon: 'group_work',
    type: 'department',
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
