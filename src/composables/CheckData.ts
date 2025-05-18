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
