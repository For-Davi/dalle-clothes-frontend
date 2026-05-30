const routePermissionMap: { name: string; permission: string }[] = [
  { name: 'dashboard', permission: 'dashboard.view' },
  { name: 'sale', permission: 'sale.view' },
  { name: 'stock', permission: 'product.view' },
  { name: 'employee', permission: 'employee.view' },
  { name: 'client', permission: 'client.view' },
  { name: 'supplier', permission: 'supplier.view' },
  { name: 'results', permission: 'commission.view' },
  { name: 'payment', permission: 'sale.create' },
  { name: 'transaction', permission: 'transaction.view' },
  { name: 'receipt', permission: 'receipt.view' },
  { name: 'delivery', permission: 'delivery.view' },
  { name: 'user', permission: 'user.view' },
  { name: 'role', permission: 'role.view' },
  { name: 'subscription', permission: 'subscription.payment' },
  { name: 'setting', permission: 'config.view' },
  { name: 'help', permission: 'help.view' },
];

export function getFirstAllowedRoute(user: IUser): string {
  const userPermissions = user.role?.permissions?.map((p) => p.slug) ?? [];

  const firstAllowed = routePermissionMap.find((r) => userPermissions.includes(r.permission));

  return firstAllowed?.name ?? 'auth';
}
