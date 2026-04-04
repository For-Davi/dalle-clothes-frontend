export const checkDataLogin = (data: {
  email: string;
  password: string;
}): { status: boolean; message?: string } => {
  if (data.email.trim() === '') {
    return { status: false, message: 'Deve ser informado o e-mail' };
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
    return { status: false, message: 'Informe um e-mail válido' };
  }
  if (data.password.trim() === '') {
    return { status: false, message: 'Deve ser informado uma senha' };
  }
  return { status: true };
};

export const checkDataRegister = (data: {
  name: string;
  email: string;
  nameEnterprise: string;
  password: string;
  confirmPassword: string;
}): { status: boolean; message?: string } => {
  if (data.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome de usuário' };
  }
  if (data.name.trim().length < 3) {
    return {
      status: false,
      message: 'O nome de usuário deve conter pelo menos 3 caracteres',
    };
  }
  if (data.email.trim() === '') {
    return { status: false, message: 'Deve ser informado o e-mail' };
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
    return { status: false, message: 'Informe um e-mail válido' };
  }
  if (data.nameEnterprise.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome de sua organização',
    };
  }
  if (data.nameEnterprise.trim().length < 3) {
    return {
      status: false,
      message: 'O nome da organização deve conter pelo menos 3 caracteres',
    };
  }
  if (data.password.trim() === '') {
    return { status: false, message: 'Deve ser informado uma senha' };
  }
  if (data.password.trim().length < 8) {
    return {
      status: false,
      message: 'A senha deve conter pelo menos 8 caracteres',
    };
  }
  if (data.confirmPassword.trim() !== data.password.trim()) {
    return { status: false, message: 'As senhas devem ser iguais' };
  }
  return { status: true };
};

export const checkPassword = (data: {
  password: string;
  passwordConfirm: string;
}): { status: boolean; message?: string } => {
  if (data.password.trim() === '') {
    return { status: false, message: 'Deve ser informado uma senha' };
  }
  if (data.password.trim().length < 8) {
    return {
      status: false,
      message: 'A senha deve conter pelo menos 8 caracteres',
    };
  }
  if (data.password.trim() !== data.passwordConfirm.trim()) {
    return { status: false, message: 'As senhas devem ser iguais' };
  }
  return { status: true };
};

export const checkDataReset = (data: { email: string }): { status: boolean; message?: string } => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (data.email.trim() === '') {
    return { status: false, message: 'Campo de e-mail não pode ser vazio' };
  }
  if (!emailRegex.test(data.email)) {
    return { status: false, message: 'O e-mail não é válido' };
  }
  return { status: true };
};

export const checkDataDepartment = (data: {
  name: string | undefined;
}): { status: boolean; message?: string } => {
  if (data.name?.trim() === '' || !data.name) {
    return {
      status: false,
      message: 'Deve ser informado o nome do departamento',
    };
  }
  return { status: true };
};

export const checkDataCategorySupplier = (data: {
  name: string;
}): { status: boolean; message?: string } => {
  if (data.name?.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome da categoria',
    };
  }
  return { status: true };
};

export const checkDataUserSystem = (
  data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  },
  mode: 'create' | 'update',
): { status: boolean; message?: string } => {
  if (data.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome do usuário' };
  }
  if (data.name.trim().length < 2) {
    return {
      status: false,
      message: 'Nome de usuário deve ter mais de 2 caracteres',
    };
  }
  if (data.email.trim() === '') {
    return { status: false, message: 'Deve ser informado o e-mail do usuário' };
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
    return { status: false, message: 'Informe um e-mail válido' };
  }
  if (mode === 'create') {
    if (data.password.trim() === '') {
      return {
        status: false,
        message: 'Deve ser informado a senha do usuário',
      };
    }
    if (data.password.trim().length < 7) {
      return {
        status: false,
        message: 'A senha deve conter mais de 7 caracteres',
      };
    }
    if (data.password.trim() !== (data.confirmPassword && data.confirmPassword.trim())) {
      return { status: false, message: 'As senhas não coincidem' };
    }
  }
  return { status: true };
};

export const checkDataPassword = (data: {
  newPassword: string;
  confirmPassword: string;
}): { status: boolean; message?: string } => {
  if (data.newPassword.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado a senha do usuário',
    };
  }
  if (data.newPassword.trim().length < 7) {
    return {
      status: false,
      message: 'A senha deve conter mais de 7 caracteres',
    };
  }
  if (data.newPassword.trim() !== (data.confirmPassword && data.confirmPassword.trim())) {
    return { status: false, message: 'As senhas não coincidem' };
  }
  return { status: true };
};

export const checkDataSupplier = (data: {
  name: string;
  email: string;
}): { status: boolean; message?: string } => {
  if (data.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome do fornecedor' };
  }
  if (data.name.trim().length < 2) {
    return {
      status: false,
      message: 'Nome de fornecedor deve ter mais de 2 caracteres',
    };
  }
  if (data.email.trim() !== '') {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
      return { status: false, message: 'Informe um e-mail válido' };
    }
  }

  return { status: true };
};

export const checkDataClient = (data: {
  name: string;
  email: string;
  dateBirthday: string;
}): { status: boolean; message?: string } => {
  if (data.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome do fornecedor' };
  }
  if (data.name.trim().length < 2) {
    return {
      status: false,
      message: 'Nome de fornecedor deve ter mais de 2 caracteres',
    };
  }
  if (data.email.trim() !== '') {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
      return { status: false, message: 'Informe um e-mail válido' };
    }
  }
  if (data.dateBirthday.trim() !== '') {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[0-2])[/](19|20)\d\d$/;
    if (!dateRegex.test(data.dateBirthday.trim())) {
      return { status: false, message: 'Informe uma data válida no formato dd/mm/yyyy' };
    }
  }

  return { status: true };
};

export const checkDataAccessLogin = (data: {
  password: string;
  confirmPassword: string;
}): { status: boolean; message?: string } => {
  if (data.password.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado a senha do usuário',
    };
  }
  if (data.password.trim().length < 7) {
    return {
      status: false,
      message: 'A senha deve conter mais de 7 caracteres',
    };
  }
  if (data.password.trim() !== (data.confirmPassword && data.confirmPassword.trim())) {
    return { status: false, message: 'As senhas não coincidem' };
  }

  return { status: true };
};

export const checkDataColor = (data: {
  name: string;
  hexColorCode: string;
}): { status: boolean; message?: string } => {
  if (data.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome da cor' };
  }
  if (data.name.trim().length < 2) {
    return {
      status: false,
      message: 'Nome da cor deve ter mais de 1 caractére',
    };
  }
  if (data.hexColorCode.trim() !== '') {
    if (data.hexColorCode.trim().length !== 7) {
      return {
        status: false,
        message: 'O código hexadecimal deve ter 7 caractéres',
      };
    }
  }

  return { status: true };
};

export const checkDataTag = (data: { name: string }): { status: boolean; message?: string } => {
  if (data.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome da tag' };
  }

  return { status: true };
};

export const checkDataCategoryProduct = (data: {
  name: string;
}): { status: boolean; message?: string } => {
  if (data.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome da categoria' };
  }

  return { status: true };
};

export const checkDataProduct = (basic: {
  name: string;
  description: string;
}): { status: boolean; message?: string } => {
  // Dados básicos
  if (basic.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome do produto' };
  }
  if (basic.name.trim().length > 100) {
    return { status: false, message: 'O nome do produto não pode ultrapassar 100 caractéres' };
  }
  if (basic.description.trim() !== '') {
    if (basic.description.trim().length > 500)
      return { status: false, message: 'A descrição do produto deve ter no máximo 500 caractéres' };
  }

  return { status: true };
};

export const checkDataGrid = (
  data: {
    gridName: string;
    itemsCreate: IGridItemCreate[];
    itemsUpdate: IGridItemUpdate[];
  },
  mode: 'create' | 'update',
): { status: boolean; message?: string } => {
  if (data.gridName.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome da grade' };
  }
  if (data.gridName.trim().length < 2) {
    return {
      status: false,
      message: 'Nome da grade deve ter mais de 1 caractére',
    };
  }
  if (data.gridName.trim().length > 15) {
    return {
      status: false,
      message: 'Nome da grade não deve ter mais de 15 caractéres',
    };
  }
  if (mode === 'create') {
    if (data.itemsCreate.length < 1) {
      return {
        status: false,
        message: 'Deve conter tamanhos dentro da grade',
      };
    }
  }
  if (mode === 'update') {
    if (data.itemsUpdate.length < 1) {
      return {
        status: false,
        message: 'Deve conter tamanhos dentro da grade',
      };
    }
  }

  return { status: true };
};

export const checkDataEmployee = (
  data: {
    name: string;
    email: string;
    dateBirthday: string;
    password: string | null;
    confirmPassword: string | null;
  },
  hasAccessLogin: boolean,
): { status: boolean; message?: string } => {
  if (data.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome do funcionário' };
  }
  if (data.name.trim().length < 2) {
    return {
      status: false,
      message: 'Nome do funcionário deve ter mais de 2 caracteres',
    };
  }
  if (data.email.trim() !== '') {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
      return { status: false, message: 'Informe um e-mail válido' };
    }
  }
  if (data.dateBirthday.trim() !== '') {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[0-2])[/](19|20)\d\d$/;
    if (!dateRegex.test(data.dateBirthday.trim())) {
      return { status: false, message: 'Informe uma data válida no formato dd/mm/yyyy' };
    }
  }
  if (hasAccessLogin) {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
      return { status: false, message: 'Informe um e-mail válido' };
    }
    if (data.dateBirthday.trim() !== '') {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[0-2])[/](19|20)\d\d$/;
      if (!dateRegex.test(data.dateBirthday.trim())) {
        return { status: false, message: 'Informe uma data válida no formato dd/mm/yyyy' };
      }
    }
    if (data.password?.trim() === '') {
      return {
        status: false,
        message: 'Deve ser informado a senha do usuário',
      };
    }
    if (data.password !== null) {
      if (data.password.trim().length < 7) {
        return {
          status: false,
          message: 'A senha deve conter mais de 7 caracteres',
        };
      }
    }
    if (data.password?.trim() !== (data.confirmPassword && data.confirmPassword.trim())) {
      return { status: false, message: 'As senhas não coincidem' };
    }
  }

  return { status: true };
};

export const checkDataCategoryTransaction = (data: {
  name: string;
}): { status: boolean; message?: string } => {
  if (data.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome da categoria',
    };
  }

  return { status: true };
};

export const checkDataAppearance = (data: {
  titlePageColorDefault: number;
  navbarColorDefault: number;
  navbarIconColorDefault: number;
  sideMenuColorDefaultNotSelectedItem: number;
  sideMenuColorDefaultSelectedItem: number;
  sideMenuColorDefaultNotSelectedIcon: number;
  sideMenuColorDefaultSelectedIcon: number;
  titlePageColorCode: string;
  navbarColorCode: string;
  navbarIconColorCode: string;
  sideMenuColorCodeNotSelectedItem: string;
  sideMenuColorCodeSelectedItem: string;
  sideMenuColorCodeNotSelectedIcon: string;
  sideMenuColorCodeSelectedIcon: string;
}): { status: boolean; message?: string } => {
  if (data.titlePageColorCode.trim().length > 0 && data.titlePageColorCode.trim().length !== 7) {
    return {
      status: false,
      message: 'O código hexadecimal deve ter 7 caractéres em título',
    };
  }
  if (data.navbarColorCode.trim().length > 0 && data.navbarColorCode.trim().length !== 7) {
    return {
      status: false,
      message: 'O código hexadecimal deve ter 7 caractéres em fundo de navbar',
    };
  }
  if (data.navbarIconColorCode.trim().length > 0 && data.navbarIconColorCode.trim().length !== 7) {
    return {
      status: false,
      message: 'O código hexadecimal deve ter 7 caractéres em ícone de navbar',
    };
  }
  if (
    data.sideMenuColorCodeSelectedItem.trim().length > 0 &&
    data.sideMenuColorCodeSelectedItem.trim().length !== 7
  ) {
    return {
      status: false,
      message:
        'O código hexadecimal deve ter 7 caractéres em fundo de item no menu lateral selecionado',
    };
  }
  if (
    data.sideMenuColorCodeSelectedIcon.trim().length > 0 &&
    data.sideMenuColorCodeSelectedIcon.trim().length !== 7
  ) {
    return {
      status: false,
      message:
        'O código hexadecimal deve ter 7 caractéres em ícone de item no menu lateral selecionado',
    };
  }
  if (
    data.sideMenuColorCodeNotSelectedItem.trim().length > 0 &&
    data.sideMenuColorCodeNotSelectedItem.trim().length !== 7
  ) {
    return {
      status: false,
      message:
        'O código hexadecimal deve ter 7 caractéres em fundo de item no menu lateral não selecionado',
    };
  }
  if (
    data.sideMenuColorCodeNotSelectedIcon.trim().length > 0 &&
    data.sideMenuColorCodeNotSelectedIcon.trim().length !== 7
  ) {
    return {
      status: false,
      message:
        'O código hexadecimal deve ter 7 caractéres em ícone de item no menu lateral não selecionado',
    };
  }

  return { status: true };
};

export const checkDataUpdateProfile = (data: {
  name: string;
  email: string;
}): { status: boolean; message?: string } => {
  if (data.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome do usuário' };
  }
  if (data.name.trim().length < 2) {
    return { status: false, message: 'O nome de usuário deve conter pelo menos 3 caracteres' };
  }
  if (data.email.trim() === '') {
    return { status: false, message: 'Deve ser informado o email do usuário' };
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
    return { status: false, message: 'Informe um e-mail válido' };
  }
  return { status: true };
};

export const checkPasswordUpdateProfile = (data: {
  actualPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): { status: boolean; message?: string } => {
  if (data.actualPassword.trim() === '') {
    return { status: false, message: 'Deve ser informado a senha atual' };
  }
  if (data.actualPassword.trim().length < 8) {
    return { status: false, message: 'A senha atual deve conter pelo menos 8 caracteres' };
  }
  if (data.newPassword.trim() === '') {
    return { status: false, message: 'Deve ser informado a nova senha' };
  }
  if (data.newPassword.trim().length < 8) {
    return { status: false, message: 'A nova senha deve conter pelo menos 8 caracteres' };
  }
  if (data.confirmNewPassword.trim() !== data.newPassword.trim()) {
    return { status: false, message: 'As novas senhas não coincidem' };
  }
  return { status: true };
};

export const checkDataMovement = (data: {
  date: string;
  description: string;
  value: string;
}): { status: boolean; message?: string } => {
  if (data.description.trim().length > 500) {
    return { status: false, message: 'A descrição tem limite de 500 caracteres' };
  }

  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!dateRegex.test(data.date)) {
    return { status: false, message: 'A data deve estar no formato dd/mm/yyyy' };
  }

  const numericValue = parseFloat(data.value.replace(',', '.'));
  if (isNaN(numericValue)) {
    return { status: false, message: 'O valor deve ser um número válido' };
  }
  if (numericValue < 0.01) {
    return { status: false, message: 'O valor mínimo permitido é 0.01' };
  }

  return { status: true };
};

export const checkDataSchedule = (data: {
  date: string;
  description: string;
  value: string;
}): { status: boolean; message?: string } => {
  if (data.description.trim().length > 500) {
    return { status: false, message: 'A descrição tem limite de 500 caracteres' };
  }

  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!dateRegex.test(data.date)) {
    return { status: false, message: 'A data deve estar no formato dd/mm/yyyy' };
  }

  const numericValue = parseFloat(data.value.replace(',', '.'));
  if (isNaN(numericValue)) {
    return { status: false, message: 'O valor deve ser um número válido' };
  }
  if (numericValue < 0.01) {
    return { status: false, message: 'O valor mínimo permitido é 0.01' };
  }

  return { status: true };
};

export const checkFeedbackData = (data: {
  text: string;
  images: File[];
}): { status: boolean; message?: string } => {
  if (data.text.trim() === '') {
    return { status: false, message: 'Deve ser informado o campo da sugestão' };
  }
  if (data.text.trim().length > 10000) {
    return { status: false, message: 'O campo da sugestão deve conter apenas 10000 caracteres' };
  }
  if (data.images.length > 1) {
    return { status: false, message: 'Só é permitido o envio de uma imagem' };
  }
  return { status: true };
};

export const checkReceiptData = (data: {
  identifier: string;
  description: string;
}): { status: boolean; message?: string } => {
  if (data.identifier.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome do recebimento' };
  }
  if (data.identifier.trim().length > 500) {
    return { status: false, message: 'O campo da descrição deve conter apenas 500 caracteres' };
  }

  return { status: true };
};

export const checkExportData = (data: {
  data: IMovement[];
}): { status: boolean; message?: string } => {
  if (data.data.length === 0) {
    return { status: false, message: 'Você não possui nenhum dado para exportar' };
  }

  return { status: true };
};

export const checkEnterpriseData = (data: {
  name: string | null;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  cnpj: string | null;
}): { status: boolean; message?: string } => {
  const name = data.name?.trim() || '';
  const email = data.email?.trim() || '';
  const cpf = data.cpf?.trim() || '';
  const cnpj = data.cnpj?.trim() || '';

  if (name === '') {
    return { status: false, message: 'Deve ser informado o nome da empresa' };
  }
  if (email !== '') {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return { status: false, message: 'Informe um e-mail válido' };
    }
  }
  if (cpf !== '') {
    if (cpf.length !== 11) {
      return { status: false, message: 'Informe um CPF válido' };
    }
  }
  if (cnpj !== '') {
    if (cnpj.length !== 14) {
      return { status: false, message: 'Informe um CNPJ válido' };
    }
  }

  return { status: true };
};

export const checkProductClientData = (
  data: IListProduct,
): { status: boolean; message?: string } => {
  if (data.stock_quantity < data.quantity) {
    return { status: false, message: 'A quantidade informada excede a quantidade em estoque' };
  }
  if (data.quantity === 0) {
    return { status: false, message: 'A quantidade informada é inválida' };
  }

  return { status: true };
};

export const checkSaleProductsData = (
  data: IClientCartProduct[],
): { status: boolean; message?: string } => {
  if (data.length === 0) {
    return { status: false, message: 'O carrinho do cliente está vazio' };
  }

  return { status: true };
};

export const checkDataSupplierOrder = (
  data: {
    dateIssue: string;
    dateDeliveryExpected: string;
    items: ISupplierCartProduct[];
  },
  selectedSupplier: number | null,
): { status: boolean; message?: string } => {
  if (selectedSupplier === null) {
    return { status: false, message: 'Informe um fornecedor' };
  }
  if (data.dateIssue.trim() !== '') {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[0-2])[/](19|20)\d\d$/;
    if (!dateRegex.test(data.dateIssue.trim())) {
      return { status: false, message: 'Informe uma data válida no formato dd/mm/yyyy' };
    }
  }
  if (data.dateDeliveryExpected.trim() !== '') {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[0-2])[/](19|20)\d\d$/;
    if (!dateRegex.test(data.dateDeliveryExpected.trim())) {
      return { status: false, message: 'Informe uma data válida no formato dd/mm/yyyy' };
    }
  }
  if (data.items.length === 0) {
    return { status: false, message: 'Deve conter ao menos 1 item no pedido' };
  }
  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const itemNumber = i + 1;

    if (item.newPrice === undefined || item.newPrice === null) {
      return { status: false, message: `Item ${itemNumber}: Preço é obrigatório` };
    }

    if (typeof item.newPrice !== 'number' || isNaN(item.newPrice)) {
      return { status: false, message: `Item ${itemNumber}: Preço deve ser um número válido` };
    }

    if (item.newPrice <= 0) {
      return { status: false, message: `Item ${itemNumber}: Preço deve ser maior que 0` };
    }

    if (item.newQuantity === undefined || item.newQuantity === null) {
      return { status: false, message: `Item ${itemNumber}: Quantidade é obrigatória` };
    }

    if (typeof item.newQuantity !== 'number' || isNaN(item.newQuantity)) {
      return { status: false, message: `Item ${itemNumber}: Quantidade deve ser um número válido` };
    }

    if (item.newQuantity <= 0) {
      return { status: false, message: `Item ${itemNumber}: Quantidade deve ser maior que 0` };
    }
  }

  return { status: true };
};
export const checkPaymentData = (
  data: IVModelSalePayment,
  missingAmount: number,
): { status: boolean; message?: string } => {
  //VALIDAÇÃO DA ENTREGA
  if (data.freight) {
    if (
      data.city?.trim() === '' &&
      data.state?.trim() === '' &&
      data.neighborhood?.trim() === '' &&
      data.numberAddress?.trim() === ''
    ) {
      return { status: false, message: 'Com o frete ativado você deve preencher os campos' };
    }
    if (data.freightValue === null) {
      return { status: false, message: 'Preencha o campo do valor do frete' };
    }
    if (data.city?.trim() === '') {
      return { status: false, message: 'Preencha o campo de cidade' };
    }
    if (data.state?.trim() === '') {
      return { status: false, message: 'Preencha o campo de UF' };
    }
    if (data.neighborhood?.trim() === '') {
      return { status: false, message: 'Preencha o campo de bairro' };
    }
    if (data.numberAddress?.trim() === '') {
      return { status: false, message: 'Preencha o campo de número' };
    }
  }

  // VALIDAÇÃO GERAL
  if (data.payment.length === 0) {
    return { status: false, message: 'Insira algum pagamento' };
  }
  if (data.payment.some((p) => p.paymentType === null)) {
    return { status: false, message: 'Deve ser informado a forma de pagamento' };
  }

  //VALIDAÇÃO DE PIX
  const hasPix = data.payment.find((p) => p.paymentType === 'PIX');
  if (hasPix) {
    if (hasPix.value.trim() === '') {
      return { status: false, message: 'Informe o valor para o pagamento via PIX.' };
    }
    if (hasPix.value.trim() === '0.00' && missingAmount > 0) {
      return { status: false, message: 'O valor do pagamento via PIX não pode ser zero.' };
    }
  }

  //VALIDAÇÃO DE DINHEIRO
  const hasMoney = data.payment.find((p) => p.paymentType === 'MONEY');
  if (hasMoney) {
    if (hasMoney.value.trim() === '') {
      return { status: false, message: 'Informe o valor para o pagamento em dinheiro.' };
    }
    if (hasMoney.value.trim() === '0.00' && missingAmount > 0) {
      return { status: false, message: 'O valor do pagamento em dinheiro não pode ser zero.' };
    }
  }

  //VALIDAÇÃO DE CARTÃO DE DÉBITO
  const hasDebitCard = data.payment.find((p) => p.paymentType === 'DEBIT_CARD');
  if (hasDebitCard) {
    if (hasDebitCard.value.trim() === '') {
      return { status: false, message: 'Informe o valor para o pagamento com cartão de débito.' };
    }
    if (hasDebitCard.value.trim() === '0.00' && missingAmount > 0) {
      return {
        status: false,
        message: 'O valor do pagamento com cartão de débito não pode ser zero.',
      };
    }
  }

  //VALIDAÇÃO DE CARTÃO DE CRÉDITO
  const hasCreditCard = data.payment.find((p) => p.paymentType === 'CREDIT_CARD');
  if (hasCreditCard) {
    if (
      hasCreditCard.value.trim() === '' &&
      hasCreditCard.installment.value === null &&
      hasCreditCard.installment.amount?.trim() === null
    ) {
      return {
        status: false,
        message: 'Informe o valor para o pagamento com cartão de crédito sem parcelamento.',
      };
    }
    if (hasCreditCard.value.trim() === '0.00' && !hasCreditCard.installment && missingAmount > 0) {
      return {
        status: false,
        message: 'O valor do pagamento com cartão de crédito sem parcelamento não pode ser zero.',
      };
    }
    if (
      hasCreditCard.installment.value !== null &&
      hasCreditCard.installment.value > 0 &&
      hasCreditCard.installment.amount?.trim() === null
    ) {
      return {
        status: false,
        message: 'Deve ser informado o valor da parcela caso a parcela seja maior do que 0.',
      };
    }
    if (
      hasCreditCard.installment.amount?.trim() !== null &&
      Number(hasCreditCard.installment.amount?.trim()) > 0 &&
      hasCreditCard.installment.value === null
    ) {
      return {
        status: false,
        message:
          'Deve ser informado a quantidade da parcela caso o valor da parcela seja maior que 0.00.',
      };
    }
  }

  //VALIDAÇÃO DE RECEBIMENTO
  const notHaveReceipt = data.payment.find((p) => {
    if (p.paymentType !== 'CREDIT') {
      return p.receiptID === null;
    }
  });
  if (notHaveReceipt) {
    return { status: false, message: 'Há pagamentos que não estão vinculados a recebimentos.' };
  }

  if (missingAmount > 0) {
    return {
      status: false,
      message: `Ainda faltam R$ ${missingAmount.toFixed(2)} para finalizar a venda`,
    };
  }

  return { status: true };
};

export const checkEmail = (email: string): { status: boolean; message?: string } => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (email.trim() === '') {
    return { status: false, message: 'Campo de e-mail não pode ser vazio' };
  }
  if (!emailRegex.test(email)) {
    return { status: false, message: 'O e-mail não é válido' };
  }
  return { status: true };
};

export const checkPaymentCreditCardData = (
  paymentData: IVMPaymentSubscriptionCreditCard,
): { status: boolean; message?: string } => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (
    paymentData.creditCard.holderName.trim() === '' &&
    paymentData.creditCard.number.trim() === '' &&
    paymentData.creditCard.expiryMonth.trim() === '' &&
    paymentData.creditCard.expiryYear.trim() === '' &&
    paymentData.creditCard.ccv.trim() === '' &&
    paymentData.creditCardHolderInfo.name.trim() === '' &&
    paymentData.creditCardHolderInfo.email.trim() === '' &&
    paymentData.creditCardHolderInfo.cpfCnpj.trim() === '' &&
    paymentData.creditCardHolderInfo.postalCode.trim() === '' &&
    paymentData.creditCardHolderInfo.addressNumber.trim() === '' &&
    paymentData.creditCardHolderInfo.addressComplement?.trim() === '' &&
    paymentData.creditCardHolderInfo.phone.trim() === ''
  ) {
    return { status: false, message: 'Preencha o formulário' };
  }
  if (!paymentData.subscriptionID) {
    return { status: false, message: 'Deve ser informado o ID da assinatura' };
  }
  if (paymentData.creditCard.holderName.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome impresso no cartão de crédito' };
  }
  if (paymentData.creditCard.holderName.trim().length < 3) {
    return { status: false, message: 'O nome impresso no cartão deve ser válido' };
  }
  if (paymentData.creditCard.holderName.trim().length > 30) {
    return {
      status: false,
      message: 'O nome impresso no cartão não pode ultrapassar 30 caracteres',
    };
  }
  if (paymentData.creditCard.number.trim() === '') {
    return { status: false, message: 'Deve ser informado o número do cartão de crédito' };
  }
  if (paymentData.creditCard.number.trim().length < 16) {
    return { status: false, message: 'Informe um número de cartão válido' };
  }
  if (paymentData.creditCard.number.trim().length > 16) {
    return { status: false, message: 'O número do cartão não pode ultrapassar 16 caracteres' };
  }
  if (paymentData.creditCard.expiryMonth.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o mês de vencimento do cartão de crédito',
    };
  }
  if (paymentData.creditCard.expiryMonth.trim().length < 2) {
    return { status: false, message: 'O mês de vencimento do cartão deve conter 2 dígitos' };
  }
  if (paymentData.creditCard.expiryMonth.trim().length > 2) {
    return {
      status: false,
      message: 'O mês de vencimento do cartão não pode ultrapassar 2 dígitos',
    };
  }
  if (
    Number(paymentData.creditCard.expiryMonth.trim()) < 1 ||
    Number(paymentData.creditCard.expiryMonth.trim()) > 12
  ) {
    return { status: false, message: 'O mês de vencimento do cartão não é válido' };
  }
  if (paymentData.creditCard.expiryYear.trim().length < 4) {
    return { status: false, message: 'O ano de vencimento do cartão deve conter 4 dígitos' };
  }
  if (paymentData.creditCard.expiryYear.trim().length > 4) {
    return {
      status: false,
      message: 'O ano de vencimento do cartão não pode ultrapassar 4 dígitos',
    };
  }
  if (Number(paymentData.creditCard.expiryYear.trim()) < currentYear) {
    return { status: false, message: 'O ano de vencimento não pode ser menor que o ano atual' };
  }
  if (
    Number(paymentData.creditCard.expiryYear.trim()) === currentYear &&
    (Number(paymentData.creditCard.expiryMonth.trim()) === currentMonth ||
      Number(paymentData.creditCard.expiryYear.trim()) < currentMonth)
  ) {
    return { status: false, message: 'O cartão informado está vencido' };
  }
  if (paymentData.creditCard.ccv.trim() === '') {
    return { status: false, message: 'Deve ser informado o CCV/CVC do cartão' };
  }
  if (
    paymentData.creditCard.ccv.trim().length < 3 ||
    paymentData.creditCard.ccv.trim().length > 3
  ) {
    return { status: false, message: 'Informado um CCV/CVC válido' };
  }
  if (paymentData.creditCardHolderInfo.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome do titular do cartão' };
  }
  if (paymentData.creditCardHolderInfo.name.trim().length < 3) {
    return { status: false, message: 'Informe um nome válido' };
  }
  if (paymentData.creditCardHolderInfo.name.trim().length > 100) {
    return {
      status: false,
      message: 'O nome do titular do cartão não pode ultrapassar 100 caracteres',
    };
  }
  if (paymentData.creditCardHolderInfo.email.trim() === '') {
    return { status: false, message: 'Deve ser informado o email do titular do cartão' };
  }
  if (!emailRegex.test(paymentData.creditCardHolderInfo.email.trim())) {
    return { status: false, message: 'O e-mail não é válido' };
  }
  if (paymentData.creditCardHolderInfo.email.trim().length > 100) {
    return {
      status: false,
      message: 'O email impresso no cartão não pode ultrapassar 100 caracteres',
    };
  }
  if (
    (paymentData.creditCardHolderInfo.cpfCnpj.trim().length < 14 &&
      paymentData.creditCardHolderInfo.cpfCnpj.trim().length < 11) ||
    paymentData.creditCardHolderInfo.cpfCnpj.trim().length === 12 ||
    paymentData.creditCardHolderInfo.cpfCnpj.trim().length === 13 ||
    paymentData.creditCardHolderInfo.cpfCnpj.trim().length > 14
  ) {
    return { status: false, message: 'Digite um CPF ou CNPJ válido' };
  }
  if (paymentData.creditCardHolderInfo.postalCode.trim() === '') {
    return { status: false, message: 'Deve ser informado o cep' };
  }
  if (paymentData.creditCardHolderInfo.postalCode.trim().length < 8) {
    return { status: false, message: 'O cep informado não pode ter menos de 8 caracteres' };
  }
  if (paymentData.creditCardHolderInfo.postalCode.trim().length > 8) {
    return { status: false, message: 'O cep informado não pode ter mais de 8 caracteres' };
  }
  if (paymentData.creditCardHolderInfo.addressNumber.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o número de endereço do titular do cartão',
    };
  }
  if (paymentData.creditCardHolderInfo.addressNumber.trim().length > 16) {
    return {
      status: false,
      message: 'O número de endereço informado não pode ultrapassar 16 caracteres',
    };
  }
  if ((paymentData.creditCardHolderInfo.addressComplement?.trim() ?? '').length > 100) {
    return {
      status: false,
      message: 'O complemento informado não pode ultrapassar 100 caracteres',
    };
  }
  if (paymentData.creditCardHolderInfo.phone.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o número de telefone do titular do cartão',
    };
  }
  if (paymentData.creditCardHolderInfo.phone.trim().length < 11) {
    return { status: false, message: 'Insira um número de telefone válido' };
  }

  return { status: true };
};

export const checkSupplierOrderReceived = (
  items: ISupplierOrderItem[],
  dateReceived: string,
): { status: boolean; message?: string } => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

  if (!regex.test(dateReceived)) {
    return {
      status: false,
      message: 'Data inválida de recebimento. Use o formato dd/mm/yyyy.',
    };
  }

  const [day, month, year] = dateReceived.split('/').map(Number);
  const checkDate = new Date(year, month - 1, day);

  const isValidDate =
    checkDate.getFullYear() === year &&
    checkDate.getMonth() === month - 1 &&
    checkDate.getDate() === day;

  if (!isValidDate) {
    return { status: false, message: 'A data informada não é válida.' };
  }

  const hasReceived = items.some((item) => {
    const received = Number(item?.received ?? 0);
    return received > 0;
  });

  if (!hasReceived) {
    return {
      status: false,
      message: 'É necessário que ao menos um item tenha quantidade recebida.',
    };
  }

  return { status: true };
};

export const checkDashboardFilter = (
  data: IFilterDashboard,
): { status: boolean; message?: string } => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

  if (data.startDate !== '' && !regex.test(data.startDate)) {
    return { status: false, message: 'Data inválida. Use o formato dd/mm/yyyy' };
  }
  if (data.endDate !== '' && !regex.test(data.endDate)) {
    return { status: false, message: 'Data inválida. Use o formato dd/mm/yyyy' };
  }
  if (data.startDate !== '') {
    const [day, month, year] = data.startDate.split('/').map(Number);
    const checkDate = new Date(year, month - 1, day);

    const isValidDate =
      checkDate.getFullYear() === year &&
      checkDate.getMonth() === month - 1 &&
      checkDate.getDate() === day;

    if (!isValidDate) {
      return { status: false, message: 'A data informada não é válida.' };
    }
  }
  if (data.endDate !== '') {
    const [day, month, year] = data.endDate.split('/').map(Number);
    const checkDate = new Date(year, month - 1, day);

    const isValidDate =
      checkDate.getFullYear() === year &&
      checkDate.getMonth() === month - 1 &&
      checkDate.getDate() === day;

    if (!isValidDate) {
      return { status: false, message: 'A data informada não é válida.' };
    }
  }

  return { status: true };
};

export const checkDataToAddReturnProducts = (
  data: IDataReturnItens,
): { status: boolean; message?: string } => {
  if (data.quantity < data.returnQuantity) {
    return {
      status: false,
      message:
        'A quantidade adicionada para devolução não pode ser maior que a quantidade comprada',
    };
  }
  if (data.returnQuantity < 0) {
    return {
      status: false,
      message: 'A quantidade adicionada para devolução não pode ser menor que 0',
    };
  }
  if (data.returnQuantity === 0) {
    return { status: false, message: 'Informe a quantidade que foi devolvida' };
  }

  return { status: true };
};

export const checkDataCreateReturn = (
  data: IDataCreateReturn,
  missingAmount: number | null,
  missingAmountFreight: number | null,
): { status: boolean; message?: string } => {
  const allReturnData = data.returnData.map((item) => item);
  const allReturnDataProducts = data.returnData.flatMap((returnItem) => returnItem.products);
  const allExchangeDataProducts = data.exchangeProducts.flatMap((exchangeItem) => exchangeItem);
  const invalidReason = data.returnData.find((r) => r.reason === null || r.reason === '');
  const exceedsReturnQuantity = allReturnDataProducts.find(
    (product) => product.quantity < product.returnQuantity,
  );
  const exceedsExchangeQuantity = allExchangeDataProducts.find(
    (product) => product.stock_quantity < product.quantity,
  );

  if (!data.saleID) {
    return {
      status: false,
      message: 'Deve ser informado o id da venda',
    };
  }
  if (allReturnData.length === 0) {
    return {
      status: false,
      message: 'Preencha com os dados necessários',
    };
  }
  if (allReturnDataProducts.length === 0) {
    return {
      status: false,
      message: 'Informe os produtos que o cliente devolveu',
    };
  }
  if (isNaN(data.exchangeData.exchangeValue)) {
    return { status: false, message: 'Informe um valor válido para ser estornado' };
  }
  if (data.exchangeData.exchangeValue < 0) {
    return { status: false, message: 'O valor de estorno não pode ser abaixo de 0' };
  }
  if (data.exchangeData.exchangeValue === 0 && data.exchangeData.generatesCredit) {
    return {
      status: false,
      message: 'Para gerar crédito ao cliente o valor do estorno não pode ser 0',
    };
  }
  if (exceedsReturnQuantity) {
    return {
      status: false,
      message: `A quantidade estornada do produto ${exceedsReturnQuantity.product_name} excede sua quantidade comprada`,
    };
  }
  if (invalidReason) {
    return { status: false, message: 'Informe um motivo para a devolução do produto' };
  }
  if (exceedsExchangeQuantity) {
    return {
      status: false,
      message: `A quantidade para troca do produto ${exceedsExchangeQuantity.product_name} excede sua quantidade em estoque`,
    };
  }

  if (data.paymentData.deliveryData.freight) {
    if (
      data.paymentData.deliveryData.city?.trim() === '' &&
      data.paymentData.deliveryData.state?.trim() === '' &&
      data.paymentData.deliveryData.neighborhood?.trim() === '' &&
      data.paymentData.deliveryData.numberAddress?.trim() === ''
    ) {
      return { status: false, message: 'Com o frete ativado você deve preencher os campos' };
    }
    if (data.paymentData.deliveryData.freightValue === null) {
      return { status: false, message: 'Preencha o campo do valor do frete' };
    }
    if (data.paymentData.deliveryData.city?.trim() === '') {
      return { status: false, message: 'Preencha o campo de cidade' };
    }
    if (data.paymentData.deliveryData.state?.trim() === '') {
      return { status: false, message: 'Preencha o campo de UF' };
    }
    if (data.paymentData.deliveryData.neighborhood?.trim() === '') {
      return { status: false, message: 'Preencha o campo de bairro' };
    }
    if (data.paymentData.deliveryData.numberAddress?.trim() === '') {
      return { status: false, message: 'Preencha o campo de número' };
    }
  }

  if (data.exchangeData.differenceValue > 0 || data.exchangeData.exchangeValue > 0) {
    if (
      data.paymentData.paymentExchangeOrDifferenceData.change.trim() === '' ||
      isNaN(Number(data.paymentData.paymentExchangeOrDifferenceData.change.trim()))
    ) {
      return { status: false, message: 'O troco  do pagamento deve ser um número' };
    }
    if (
      data.paymentData.paymentExchangeOrDifferenceData.fees?.trim() === '' ||
      isNaN(Number(data.paymentData.paymentExchangeOrDifferenceData.fees?.trim()))
    ) {
      return { status: false, message: 'A fatura do pagamento deve ser um número' };
    }
    if (data.paymentData.paymentExchangeOrDifferenceData.payment.length === 0) {
      return { status: false, message: 'Insira algum pagamento' };
    }
    if (
      data.paymentData.paymentExchangeOrDifferenceData.payment.some((p) => p.paymentType === null)
    ) {
      return { status: false, message: 'Deve ser informado a forma de pagamento' };
    }

    //VALIDAÇÃO DE PIX
    const hasPix = data.paymentData.paymentExchangeOrDifferenceData.payment.find(
      (p) => p.paymentType === 'PIX',
    );
    if (hasPix) {
      if (hasPix.value.trim() === '') {
        return { status: false, message: 'Informe o valor para o pagamento via PIX.' };
      }
      if (hasPix.value.trim() === '0.00' && missingAmount && missingAmount > 0) {
        return { status: false, message: 'O valor do pagamento via PIX não pode ser zero.' };
      }
    }

    //VALIDAÇÃO DE DINHEIRO
    const hasMoney = data.paymentData.paymentExchangeOrDifferenceData.payment.find(
      (p) => p.paymentType === 'MONEY',
    );
    if (hasMoney) {
      if (hasMoney.value.trim() === '') {
        return { status: false, message: 'Informe o valor para o pagamento em dinheiro.' };
      }
      if (hasMoney.value.trim() === '0.00' && missingAmount && missingAmount > 0) {
        return { status: false, message: 'O valor do pagamento em dinheiro não pode ser zero.' };
      }
    }

    //VALIDAÇÃO DE CARTÃO DE DÉBITO
    const hasDebitCard = data.paymentData.paymentExchangeOrDifferenceData.payment.find(
      (p) => p.paymentType === 'DEBIT_CARD',
    );
    if (hasDebitCard) {
      if (hasDebitCard.value.trim() === '') {
        return { status: false, message: 'Informe o valor para o pagamento com cartão de débito.' };
      }
      if (hasDebitCard.value.trim() === '0.00' && missingAmount && missingAmount > 0) {
        return {
          status: false,
          message: 'O valor do pagamento com cartão de débito não pode ser zero.',
        };
      }
    }

    //VALIDAÇÃO DE CARTÃO DE CRÉDITO
    const hasCreditCard = data.paymentData.paymentExchangeOrDifferenceData.payment.find(
      (p) => p.paymentType === 'CREDIT_CARD',
    );
    if (hasCreditCard) {
      if (
        hasCreditCard.value.trim() === '' &&
        hasCreditCard.installment.value === null &&
        hasCreditCard.installment.amount?.trim() === null
      ) {
        return {
          status: false,
          message: 'Informe o valor para o pagamento com cartão de crédito sem parcelamento.',
        };
      }
      if (
        hasCreditCard.value.trim() === '0.00' &&
        !hasCreditCard.installment &&
        missingAmount &&
        missingAmount > 0
      ) {
        return {
          status: false,
          message: 'O valor do pagamento com cartão de crédito sem parcelamento não pode ser zero.',
        };
      }
      if (
        hasCreditCard.installment.value !== null &&
        hasCreditCard.installment.value > 0 &&
        hasCreditCard.installment.amount?.trim() === null
      ) {
        return {
          status: false,
          message: 'Deve ser informado o valor da parcela caso a parcela seja maior do que 0.',
        };
      }
      if (
        hasCreditCard.installment.amount?.trim() !== null &&
        Number(hasCreditCard.installment.amount?.trim()) > 0 &&
        hasCreditCard.installment.value === null
      ) {
        return {
          status: false,
          message:
            'Deve ser informado a quantidade da parcela caso o valor da parcela seja maior que 0.00.',
        };
      }
    }

    //VALIDAÇÃO DE RECEBIMENTO
    const notHaveReceipt = data.paymentData.paymentExchangeOrDifferenceData.payment.find(
      (p) => p.receiptID === null && p.paymentType !== 'CREDIT',
    );
    if (notHaveReceipt) {
      return { status: false, message: 'Há pagamentos que não estão vinculados a recebimentos.' };
    }

    if (missingAmount && missingAmount > 0) {
      return {
        status: false,
        message: `Ainda faltam R$ ${missingAmount.toFixed(2)} para finalizar o pagamento`,
      };
    }
  }

  if (
    data.paymentData.deliveryData.freight &&
    Number(data.paymentData.deliveryData.freightValue) > 0
  ) {
    if (
      data.paymentData.freightPaymentData.change.trim() === '' ||
      isNaN(Number(data.paymentData.freightPaymentData.change.trim()))
    ) {
      return { status: false, message: 'O troco do pagamento do frete deve ser um número' };
    }
    if (
      data.paymentData.freightPaymentData.fees?.trim() === '' ||
      isNaN(Number(data.paymentData.freightPaymentData.fees?.trim()))
    ) {
      return { status: false, message: 'A fatura do pagamento do frete deve ser um número' };
    }
    if (data.paymentData.freightPaymentData.payment.length === 0) {
      return { status: false, message: 'Insira algum pagamento do frete' };
    }
    if (data.paymentData.freightPaymentData.payment.some((p) => p.paymentType === null)) {
      return { status: false, message: 'Deve ser informado a forma de pagamento do frete' };
    }

    //VALIDAÇÃO DE PIX DO FRETE
    const hasPix = data.paymentData.freightPaymentData.payment.find((p) => p.paymentType === 'PIX');
    if (hasPix) {
      if (hasPix.value.trim() === '') {
        return { status: false, message: 'Informe o valor para o pagamento via PIX do frete.' };
      }
      if (hasPix.value.trim() === '0.00' && missingAmount && missingAmount > 0) {
        return {
          status: false,
          message: 'O valor do pagamento via PIX do frete não pode ser zero.',
        };
      }
    }

    //VALIDAÇÃO DE DINHEIRO DO FRETE
    const hasMoney = data.paymentData.freightPaymentData.payment.find(
      (p) => p.paymentType === 'MONEY',
    );
    if (hasMoney) {
      if (hasMoney.value.trim() === '') {
        return { status: false, message: 'Informe o valor para o pagamento em dinheiro do frete.' };
      }
      if (hasMoney.value.trim() === '0.00' && missingAmount && missingAmount > 0) {
        return {
          status: false,
          message: 'O valor do pagamento em dinheiro do frete não pode ser zero.',
        };
      }
    }

    //VALIDAÇÃO DE CARTÃO DE DÉBITO DO FRETE
    const hasDebitCard = data.paymentData.freightPaymentData.payment.find(
      (p) => p.paymentType === 'DEBIT_CARD',
    );
    if (hasDebitCard) {
      if (hasDebitCard.value.trim() === '') {
        return {
          status: false,
          message: 'Informe o valor para o pagamento com cartão de débito do frete.',
        };
      }
      if (hasDebitCard.value.trim() === '0.00' && missingAmount && missingAmount > 0) {
        return {
          status: false,
          message: 'O valor do pagamento com cartão de débito do frete não pode ser zero.',
        };
      }
    }

    //VALIDAÇÃO DE CARTÃO DE CRÉDITO DO FRETE
    const hasCreditCard = data.paymentData.freightPaymentData.payment.find(
      (p) => p.paymentType === 'CREDIT_CARD',
    );
    if (hasCreditCard) {
      if (
        hasCreditCard.value.trim() === '' &&
        hasCreditCard.installment.value === null &&
        hasCreditCard.installment.amount?.trim() === null
      ) {
        return {
          status: false,
          message:
            'Informe o valor para o pagamento com cartão de crédito sem parcelamento do frete.',
        };
      }
      if (
        hasCreditCard.value.trim() === '0.00' &&
        !hasCreditCard.installment &&
        missingAmount &&
        missingAmount > 0
      ) {
        return {
          status: false,
          message:
            'O valor do pagamento com cartão de crédito sem parcelamento do frete não pode ser zero.',
        };
      }
      if (
        hasCreditCard.installment.value !== null &&
        hasCreditCard.installment.value > 0 &&
        hasCreditCard.installment.amount?.trim() === null
      ) {
        return {
          status: false,
          message:
            'Deve ser informado o valor da parcela do frete caso a parcela seja maior do que 0.',
        };
      }
      if (
        hasCreditCard.installment.amount?.trim() !== null &&
        Number(hasCreditCard.installment.amount?.trim()) > 0 &&
        hasCreditCard.installment.value === null
      ) {
        return {
          status: false,
          message:
            'Deve ser informado a quantidade da parcela do frete caso o valor da parcela seja maior que 0.00.',
        };
      }
    }

    //VALIDAÇÃO DE RECEBIMENTO DO FRETE
    const notHaveReceipt = data.paymentData.freightPaymentData.payment.find(
      (p) => p.receiptID === null && p.paymentType !== 'CREDIT',
    );
    if (notHaveReceipt) {
      return {
        status: false,
        message: 'Há pagamentos do frete que não estão vinculados a recebimentos.',
      };
    }

    if (missingAmountFreight && missingAmountFreight > 0) {
      return {
        status: false,
        message: `Ainda faltam R$ ${missingAmountFreight.toFixed(2)} para finalizar o pagamento do frete`,
      };
    }
  }

  return { status: true };
};

export const checkDataReturnEditStatus = (data: {
  status: string;
}): { status: boolean; message?: string } => {
  if (data.status.trim() === '' || !data.status.trim()) {
    return { status: false, message: 'Deve ser informado o status da devolução' };
  }

  return { status: true };
};

export const checkDataExchangePayment = (
  data: IExchangePaymentData,
  missingAmount: number,
): { status: boolean; message?: string } => {
  if (data.exchangePaymentData.length === 0) {
    return { status: false, message: 'Insira algum pagamento' };
  }
  if (data.exchangePaymentData.some((p) => p.paymentType === null)) {
    return { status: false, message: 'Deve ser informado a forma de pagamento' };
  }

  //VALIDAÇÃO DE PIX
  const hasPix = data.exchangePaymentData.find((p) => p.paymentType === 'PIX');
  if (hasPix) {
    if (hasPix.value.trim() === '') {
      return { status: false, message: 'Informe o valor para o pagamento via PIX.' };
    }
    if (hasPix.value.trim() === '0.00' && missingAmount > 0) {
      return { status: false, message: 'O valor do pagamento via PIX não pode ser zero.' };
    }
  }

  //VALIDAÇÃO DE DINHEIRO
  const hasMoney = data.exchangePaymentData.find((p) => p.paymentType === 'MONEY');
  if (hasMoney) {
    if (hasMoney.value.trim() === '') {
      return { status: false, message: 'Informe o valor para o pagamento em dinheiro.' };
    }
    if (hasMoney.value.trim() === '0.00' && missingAmount > 0) {
      return { status: false, message: 'O valor do pagamento em dinheiro não pode ser zero.' };
    }
  }

  //VALIDAÇÃO DE CARTÃO DE DÉBITO
  const hasDebitCard = data.exchangePaymentData.find((p) => p.paymentType === 'DEBIT_CARD');
  if (hasDebitCard) {
    if (hasDebitCard.value.trim() === '') {
      return { status: false, message: 'Informe o valor para o pagamento com cartão de débito.' };
    }
    if (hasDebitCard.value.trim() === '0.00' && missingAmount > 0) {
      return {
        status: false,
        message: 'O valor do pagamento com cartão de débito não pode ser zero.',
      };
    }
  }

  //VALIDAÇÃO DE RECEBIMENTO
  const notHaveReceipt = data.exchangePaymentData.find((p) => p.receiptID === null);
  if (notHaveReceipt) {
    return { status: false, message: 'Há pagamentos que não estão vinculados a recebimentos.' };
  }

  if (missingAmount > 0) {
    return {
      status: false,
      message: `Ainda faltam R$ ${missingAmount.toFixed(2)} para finalizar o pagamento`,
    };
  }

  return { status: true };
};

export const checkDataDifferencePayment = (
  data: IDifferencePaymentData,
  missingAmount: number,
): { status: boolean; message?: string } => {
  if (data.differenceDeliveryData.freight) {
    if (
      data.differenceDeliveryData.city?.trim() === '' &&
      data.differenceDeliveryData.state?.trim() === '' &&
      data.differenceDeliveryData.neighborhood?.trim() === '' &&
      data.differenceDeliveryData.numberAddress?.trim() === ''
    ) {
      return { status: false, message: 'Com o frete ativado você deve preencher os campos' };
    }
    if (data.differenceDeliveryData.freightValue === null) {
      return { status: false, message: 'Preencha o campo do valor do frete' };
    }
    if (data.differenceDeliveryData.city?.trim() === '') {
      return { status: false, message: 'Preencha o campo de cidade' };
    }
    if (data.differenceDeliveryData.state?.trim() === '') {
      return { status: false, message: 'Preencha o campo de UF' };
    }
    if (data.differenceDeliveryData.neighborhood?.trim() === '') {
      return { status: false, message: 'Preencha o campo de bairro' };
    }
    if (data.differenceDeliveryData.numberAddress?.trim() === '') {
      return { status: false, message: 'Preencha o campo de número' };
    }
  }

  if (!data.additionalDifferencePaymentData.saleID) {
    return { status: false, message: 'O ID da venda deve ser informado' };
  }
  if (!data.additionalDifferencePaymentData.returnID) {
    return { status: false, message: 'O ID da devolução deve ser informado' };
  }
  if (!data.additionalDifferencePaymentData.exchangeID) {
    return { status: false, message: 'O ID do estorno/diferença deve ser informado' };
  }

  if (isNaN(data.additionalDifferencePaymentData.change)) {
    return { status: false, message: 'O troco  do pagamento deve ser um número' };
  }
  if (isNaN(data.additionalDifferencePaymentData.fees)) {
    return { status: false, message: 'A fatura do pagamento deve ser um número' };
  }
  if (data.differencePaymentData.length === 0) {
    return { status: false, message: 'Insira algum pagamento' };
  }
  if (data.differencePaymentData.some((p) => p.paymentType === null)) {
    return { status: false, message: 'Deve ser informado a forma de pagamento' };
  }

  //VALIDAÇÃO DE PIX
  const hasPix = data.differencePaymentData.find((p) => p.paymentType === 'PIX');
  if (hasPix) {
    if (hasPix.value.trim() === '') {
      return { status: false, message: 'Informe o valor para o pagamento via PIX.' };
    }
    if (hasPix.value.trim() === '0.00' && missingAmount > 0) {
      return { status: false, message: 'O valor do pagamento via PIX não pode ser zero.' };
    }
  }

  //VALIDAÇÃO DE DINHEIRO
  const hasMoney = data.differencePaymentData.find((p) => p.paymentType === 'MONEY');
  if (hasMoney) {
    if (hasMoney.value.trim() === '') {
      return { status: false, message: 'Informe o valor para o pagamento em dinheiro.' };
    }
    if (hasMoney.value.trim() === '0.00' && missingAmount > 0) {
      return { status: false, message: 'O valor do pagamento em dinheiro não pode ser zero.' };
    }
  }

  //VALIDAÇÃO DE CARTÃO DE DÉBITO
  const hasDebitCard = data.differencePaymentData.find((p) => p.paymentType === 'DEBIT_CARD');
  if (hasDebitCard) {
    if (hasDebitCard.value.trim() === '') {
      return { status: false, message: 'Informe o valor para o pagamento com cartão de débito.' };
    }
    if (hasDebitCard.value.trim() === '0.00' && missingAmount > 0) {
      return {
        status: false,
        message: 'O valor do pagamento com cartão de débito não pode ser zero.',
      };
    }
  }

  //VALIDAÇÃO DE CARTÃO DE CRÉDITO
  const hasCreditCard = data.differencePaymentData.find((p) => p.paymentType === 'CREDIT_CARD');
  if (hasCreditCard) {
    if (
      hasCreditCard.value.trim() === '' &&
      hasCreditCard.installment.value === null &&
      hasCreditCard.installment.amount?.trim() === null
    ) {
      return {
        status: false,
        message: 'Informe o valor para o pagamento com cartão de crédito sem parcelamento.',
      };
    }
    if (hasCreditCard.value.trim() === '0.00' && !hasCreditCard.installment && missingAmount > 0) {
      return {
        status: false,
        message: 'O valor do pagamento com cartão de crédito sem parcelamento não pode ser zero.',
      };
    }
    if (
      hasCreditCard.installment.value !== null &&
      hasCreditCard.installment.value > 0 &&
      hasCreditCard.installment.amount?.trim() === null
    ) {
      return {
        status: false,
        message: 'Deve ser informado o valor da parcela caso a parcela seja maior do que 0.',
      };
    }
    if (
      hasCreditCard.installment.amount?.trim() !== null &&
      Number(hasCreditCard.installment.amount?.trim()) > 0 &&
      hasCreditCard.installment.value === null
    ) {
      return {
        status: false,
        message:
          'Deve ser informado a quantidade da parcela caso o valor da parcela seja maior que 0.00.',
      };
    }
  }

  //VALIDAÇÃO DE RECEBIMENTO
  const notHaveReceipt = data.differencePaymentData.find(
    (p) => p.receiptID === null && p.paymentType !== 'CREDIT',
  );
  if (notHaveReceipt) {
    return { status: false, message: 'Há pagamentos que não estão vinculados a recebimentos.' };
  }

  if (missingAmount > 0) {
    return {
      status: false,
      message: `Ainda faltam R$ ${missingAmount.toFixed(2)} para finalizar o pagamento`,
    };
  }

  return { status: true };
};

export const checkDataSaleCancellation = (
  data: IDataSaleCancellation,
): { status: boolean; message?: string } => {
  if (!data.reason?.trim()) {
    return { status: false, message: 'O motivo do cancelamento é obrigatório' };
  }
  if (data.description.trim().length > 5000) {
    return { status: false, message: 'A descrição não pode exceder 5000 caracteres' };
  }

  return { status: true };
};

export const checkDataSellerRegistration = (data: {
  name: string;
  phone: string;
  email: string;
  description: string;
}): { status: boolean; message?: string } => {
  if (data.name === '') {
    return { status: false, message: 'Deve ser informado o nome do associado' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (data.email.trim() === '') {
    return { status: false, message: 'Campo de e-mail não pode ser vazio' };
  }
  if (!emailRegex.test(data.email)) {
    return { status: false, message: 'O e-mail não é válido' };
  }
  if (data.phone.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o número de telefone do associado',
    };
  }
  if (data.phone.trim().length < 11) {
    return { status: false, message: 'Insira um número de telefone válido' };
  }
  if (data.description.trim().length > 500) {
    return { status: false, message: 'A descrição não pode exceder 500 caracteres' };
  }

  return { status: true };
};

export const checkDataDeliveryGuy = (data: IDeliveryGuy): { status: boolean; message?: string } => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (data.name.trim() === '' || !data.name) {
    return { status: false, message: 'Deve ser informado o nome do entregador' };
  }
  if (data.vehicle.trim() === '' || !data.vehicle) {
    return { status: false, message: 'Deve ser informado os detalhes do veículo do entregador' };
  }
  if (data.cpf?.trim() !== '' && data.cpf?.trim() !== null && data.cpf?.length !== 11) {
    return { status: false, message: 'Deve ser informado um cpf válido' };
  }
  if (data.email && data.email?.trim() !== '' && !emailRegex.test(data.email)) {
    return { status: false, message: 'Deve ser informado um email válido' };
  }
  return { status: true };
};

export const checkDataScheduleDelivery = (
  data: IScheduleDeliveryData,
): { status: boolean; message?: string } => {
  if (!data.schedule || data.schedule.trim() === '') {
    return { status: false, message: 'Deve ser informado a data para o agendamento' };
  }

  const parts = data.schedule.split('/');
  if (parts.length !== 3) {
    return { status: false, message: 'Formato de data inválido. Use DD/MM/AAAA' };
  }

  const [day, month, year] = parts.map(Number);
  const selectedDate = new Date(year, month - 1, day);

  const isInvalidDate =
    isNaN(selectedDate.getTime()) ||
    selectedDate.getFullYear() !== year ||
    selectedDate.getMonth() !== month - 1 ||
    selectedDate.getDate() !== day;

  if (isInvalidDate) {
    return { status: false, message: 'A data informada não é uma data válida' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return {
      status: false,
      message: 'A data agendada não pode ser menor que hoje',
    };
  }

  if (data.deliveryGuyID === null) {
    return { status: false, message: 'Deve ser informado o entregador' };
  }

  return { status: true };
};

export const checkDataPartialDelivered = (
  data: IDeliveredProducts[],
): { status: boolean; message?: string } => {
  if (!data || data.length === 0) {
    return { status: false, message: 'A lista de produtos não pode estar vazia.' };
  }

  const invalidItem = data.find((item) => !item.productVariantID);
  const invalidQuantityDelivered = data.find(
    (item) =>
      !item.quantityDelivered || item.quantityDelivered <= 0 || isNaN(item.quantityDelivered),
  );
  const invalidQuantitySaled = data.find(
    (item) => !item.quantitySaled || item.quantitySaled <= 0 || isNaN(item.quantitySaled),
  );
  const invalidQuantity = data.find((item) => item.quantityDelivered > item.quantitySaled);

  if (invalidItem) {
    return { status: false, message: 'Deve ser informado o nome do ID da variante' };
  }
  if (invalidQuantityDelivered) {
    return { status: false, message: 'Insira uma quantidade devolvida válida' };
  }
  if (invalidQuantitySaled) {
    return { status: false, message: 'A quantidade vendida deve ser uma quantidade válida' };
  }
  if (invalidQuantity) {
    return { status: false, message: 'A quantidade entregue é maior que a quantidade vendida' };
  }

  return { status: true };
};
