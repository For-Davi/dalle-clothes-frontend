export const columnsMotocyclist: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'phone',
    label: 'Telefone',
    field: 'phone',
    align: 'left',
  },
  {
    name: 'delivery',
    label: 'Entregas do mês',
    field: 'delivery',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsUser: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
  },
  {
    name: 'role_name',
    label: 'Permissão',
    field: 'role_name',
    align: 'left',
  },
  {
    name: 'department_name',
    label: 'Departamento',
    field: 'department_name',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsCategorySupplier: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsSupplier: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
  },
  {
    name: 'phone',
    label: 'Telefone',
    field: 'phone',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsClient: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
  },
  {
    name: 'phone',
    label: 'Telefone',
    field: 'phone',
    align: 'left',
  },
  {
    name: 'date_birthday',
    label: 'Aniversário',
    field: 'date_birthday',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsEmployee: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
  },
  {
    name: 'department_name',
    label: 'Departamento',
    field: 'department_name',
    align: 'left',
  },
  {
    name: 'has_login_access',
    label: 'Acesso ao sistema',
    field: 'has_login_access',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsColor: IQuasarTable[] = [
  {
    name: 'hex_color_code',
    label: 'Prévia',
    field: 'hex_color_code',
    align: 'left',
  },
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsTag: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsCategoryProduct: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsMountGrid: IQuasarTable[] = [
  {
    name: 'order',
    label: 'Ordem',
    field: 'order',
    align: 'left',
  },
  {
    name: 'size',
    label: 'Tamanho',
    field: 'size',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsProductVariant: IQuasarTable[] = [
  {
    name: 'size',
    label: 'Tamanho',
    field: (row) => row.gridItem?.size || '',
    align: 'left',
  },
  {
    name: 'colors',
    label: 'Cores',
    field: 'colors',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsMountGridUpdate: IQuasarTable[] = [
  {
    name: 'order',
    label: 'Ordem',
    field: 'order',
    align: 'left',
  },
  {
    name: 'size',
    label: 'Tamanho',
    field: 'size',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsCarouselGrid: IQuasarTable[] = [
  {
    name: 'order',
    label: 'Ordem',
    field: 'order',
    align: 'left',
  },
  {
    name: 'size',
    label: 'Tamanho',
    field: 'size',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
  },
];

export const columnsMedia: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'size',
    label: 'Tamanho',
    field: 'size',
    align: 'left',
  },
  {
    name: 'image',
    label: 'Imagem',
    field: 'image',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsProduct: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'sku',
    label: 'SKU',
    field: 'sku',
    align: 'left',
  },
  {
    name: 'price',
    label: 'Preço',
    field: 'price',
    align: 'left',
  },
  {
    name: 'stock_quantity',
    label: 'Estoque',
    field: 'stock_quantity',
    align: 'left',
  },
  {
    name: 'color',
    label: 'Cor',
    field: 'color',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
];

export const columnsProductLog: IQuasarTable[] = [
  {
    name: 'date',
    label: 'Data',
    field: 'date',
    align: 'left',
  },
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
  },
  {
    name: 'axecution',
    label: 'Execução',
    field: 'axecution',
    align: 'left',
  },
  {
    name: 'target',
    label: 'Alvo',
    field: 'target',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: '',
    align: 'right',
  },
];

export const columnsCategoryTransaction: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'left',
  },
];
