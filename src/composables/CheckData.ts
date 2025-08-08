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
    password: string;
    confirmPassword: string;
  },
  hasAccessLogin: boolean,
): { status: boolean; message?: string } => {
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
  navbarColorDefault: number;
  navbarIconColorDefault: number;
  sideMenuColorDefaultNotSelectedItem: number;
  sideMenuColorDefaultSelectedItem: number;
  sideMenuColorDefaultNotSelectedIcon: number;
  sideMenuColorDefaultSelectedIcon: number;
  navbarColorCode: string;
  navbarIconColorCode: string;
  sideMenuColorCodeNotSelectedItem: string;
  sideMenuColorCodeSelectedItem: string;
  sideMenuColorCodeNotSelectedIcon: string;
  sideMenuColorCodeSelectedIcon: string;
}): { status: boolean; message?: string } => {
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
