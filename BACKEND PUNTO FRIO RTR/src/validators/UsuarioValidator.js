export const validarCamposVacios = (req, res) => {
  if (Object.values(req.body).includes('')) {
    return res.status(400).json({ msg: 'Lo sentimos, debes llenar todos los campos' });
  }
  return true;
};

export const validarEmail = (req, res) => {
  const { correo } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) {
    return res.status(400).json({ msg: 'Por favor, proporciona un correo electrónico válido' });
  }
  return true;
};

export const validarCedula = (req, res) => {
  const { cedula } = req.body;
  if (cedula.length !== 10) {
    return res.status(400).json({ msg: 'La cédula debe tener 10 caracteres' });
  }
  return true;
};

export const validarContrasenia = (req, res) => {
  const { contrasenia } = req.body;

  // Verificar longitud mínima
  if (contrasenia.length < 8) {
    return res.status(400).json({ msg: 'La contraseña debe tener al menos 8 caracteres' });
    stop
  }

  // Validar que contenga al menos una letra mayúscula
  const tieneMayuscula = /[A-Z]/.test(contrasenia);
  if (!tieneMayuscula) {
    return res.status(400).json({ msg: 'La contraseña debe contener al menos una letra mayúscula' });
  }

  // Validar que contenga al menos una letra minúscula
  const tieneMinuscula = /[a-z]/.test(contrasenia);
  if (!tieneMinuscula) {
    return res.status(400).json({ msg: 'La contraseña debe contener al menos una letra minúscula' });
  }

  // Validar que contenga al menos un carácter especial
  const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(contrasenia);
  if (!tieneCaracterEspecial) {
    return res.status(400).json({ msg: 'La contraseña debe contener al menos un carácter especial' });
  }
  return true;
};

export const validarNombre = (req, res) => {
  const { nombre } = req.body;
  if (nombre.length < 2) {
    return res.status(400).json({ msg: 'El nombre debe tener al menos 2 caracteres' });
  }
  return true;
};

export const validarApellido = (req, res) => {
  const { apellido } = req.body;
  if (apellido.length < 2) {
    return res.status(400).json({ msg: 'El apellido debe tener al menos 2 caracteres' });
  }
  return true;
};

export const validarRol = (req, res) => {
  const { rol } = req.body;
  const rolesPermitidos = ['administrador', 'cajero'];
  if (!rolesPermitidos.includes(rol)) {
    return res.status(400).json({ msg: 'El rol debe ser "administrador" o "cajero"' });
  }
  return true;
};
