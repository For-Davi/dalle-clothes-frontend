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
  data: IClientCartProduct,
): { status: boolean; message?: string } => {
  if (data.stock_quantity < data.quantity) {
    return { status: false, message: 'A quantidade informada excede a quantidade em estoque' };
  }
  if (data.quantity === 0) {
    return { status: false, message: 'A quantidade informada é inválida' };
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

export const checkSupplierOrderReceived = (
  items: any[],
  dateReceived: string,
): { status: boolean; message?: string } => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  console.log('dateReceived', dateReceived);

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
    if (hasPix.value.trim() === '0.00') {
      return { status: false, message: 'O valor do pagamento via PIX não pode ser zero.' };
    }
  }

  //VALIDAÇÃO DE DINHEIRO
  const hasMoney = data.payment.find((p) => p.paymentType === 'MONEY');
  if (hasMoney) {
    if (hasMoney.value.trim() === '') {
      return { status: false, message: 'Informe o valor para o pagamento em dinheiro.' };
    }
    if (hasMoney.value.trim() === '0.00') {
      return { status: false, message: 'O valor do pagamento em dinheiro não pode ser zero.' };
    }
  }

  //VALIDAÇÃO DE CARTÃO DE DÉBITO
  const hasDebitCard = data.payment.find((p) => p.paymentType === 'DEBIT_CARD');
  if (hasDebitCard) {
    if (hasDebitCard.value.trim() === '') {
      return { status: false, message: 'Informe o valor para o pagamento com cartão de débito.' };
    }
    if (hasDebitCard.value.trim() === '0.00') {
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
    if (hasCreditCard.value.trim() === '0.00' && !hasCreditCard.installment) {
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
  const notHaveReceipt = data.payment.find((p) => p.receiptID === null);
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

export const checkSaleProductsData = (
  data: IClientCartProduct[],
): { status: boolean; message?: string } => {
  if (data.length === 0) {
    return { status: false, message: 'O carrinho do cliente está vazio' };
  }

  return { status: true };
};
