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

export const columnsProductVariantEdit: IQuasarTable[] = [
  {
    name: 'size',
    label: 'Tamanho',
    field: (row) => row.grid_item?.size || '',
    align: 'left',
  },
  {
    name: 'sku',
    label: 'SKU',
    field: 'sku',
    align: 'left',
  },
  {
    name: 'color',
    label: 'Ativo',
    field: (row) => row.color || '',
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
    name: 'code',
    label: 'Código',
    field: 'code',
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
    name: 'created_at',
    label: 'Data',
    field: 'created_at',
    align: 'left',
    style: 'max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  },
  {
    name: 'execution',
    label: 'Execução',
    field: 'axecution',
    align: 'left',
    style: 'max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
    style: 'max-width: 100px;  text-overflow: ellipsis; white-space: wrap;',
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
    align: 'right',
  },
];

export const columnsMovement: IQuasarTable[] = [
  {
    name: 'date',
    label: 'Data',
    field: 'date',
    align: 'left',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
  },
  {
    name: 'value',
    label: 'Valor',
    field: 'value',
    align: 'left',
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'right',
  },
];

export const columnsTypesAccount: IQuasarTable[] = [
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
    align: 'right',
  },
];

export const columnsReceipts: IQuasarTable[] = [
  {
    name: 'identifier',
    label: 'Nome (Identificador)',
    field: 'identifier',
    align: 'left',
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'right',
  },
];

export const columnsSchedule: IQuasarTable[] = [
  {
    name: 'date',
    label: 'Data',
    field: 'date',
    align: 'left',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'left',
  },
  {
    name: 'value',
    label: 'Valor',
    field: 'value',
    align: 'left',
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'right',
  },
];

export const columnsLinkedProducts: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Produto',
    field: 'name',
    align: 'left',
  },
  {
    name: 'price',
    label: 'Preço',
    field: 'price',
    align: 'left',
  },
  {
    name: 'sku',
    label: 'SKU',
    field: 'sku',
    align: 'left',
  },
  {
    name: 'color',
    label: 'Cor',
    field: 'color',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'right',
  },
];

export const columnsSupplierLinkedProducts: IQuasarTable[] = [
  {
    name: 'name',
    label: 'Fornecedor',
    field: 'name',
    align: 'left',
  },
  {
    name: 'price',
    label: 'Preço',
    field: 'price',
    align: 'left',
  },
  {
    name: 'sku',
    label: 'SKU',
    field: 'sku',
    align: 'left',
  },
  {
    name: 'color',
    label: 'Cor',
    field: 'color',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'right',
  },
];
