import generarJWT from '../helpers/crearJWT.js'
import UsuarioModel from '../models/Usuario.js'

export const registro = async (req, res) => {
  const { correo, contrasenia, nombre, apellido, cedula, rol } = req.body

  // Validación de campos vacíos
  if (Object.values(req.body).includes('')) {
    return res
      .status(400)
      .json({ msg: 'Lo sentimos, debes llenar todos los campos' })
  }

  // Validación del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(correo)) {
    return res
      .status(400)
      .json({ msg: 'Por favor, proporciona un correo electrónico válido' })
  }

  // Validación de la cédula
  if (cedula.length !== 10) {
    // Corregido aquí
    return res.status(400).json({ msg: 'La cédula debe tener 10 caracteres' })
  }

  // Validación de la contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/ // Nueva regex
  if (!passwordRegex.test(contrasenia)) {
    return res.status(400).json({
      msg: 'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula y un carácter especial.',
    })
  }

  // Validación del nombre
  if (nombre.length < 2) {
    return res
      .status(400)
      .json({ msg: 'El nombre debe tener al menos 2 caracteres' })
  }

  // Validación del apellido
  if (apellido.length < 2) {
    return res
      .status(400)
      .json({ msg: 'El apellido debe tener al menos 2 caracteres' })
  }

  // Verificar si el email ya está registrado
  const verificarEmailBDD = await UsuarioModel.findOne({ correo }) // Corregido aquí
  if (verificarEmailBDD) {
    return res
      .status(400)
      .json({ msg: 'Lo sentimos, el email ya se encuentra registrado' })
  }

  // Validación del rol
  const rolesPermitidos = ['administrador', 'cajero']
  if (!rolesPermitidos.includes(rol)) {
    return res
      .status(400)
      .json({ msg: 'El rol debe ser "administrador" o "cajero"' })
  }

  // Crear nuevo usuario
  const nuevoUsuario = new UsuarioModel(req.body)
  nuevoUsuario.contrasenia = await nuevoUsuario.encryptPassword(contrasenia)
  await nuevoUsuario.save()

  res.status(201).json({ usuario: nuevoUsuario })
}

export const login = async (req, res) => {
  const { correo, contrasenia } = req.body

  // Verificar que no haya campos vacíos
  if (Object.values(req.body).includes('')) {
    return res
      .status(400)
      .json({ msg: 'Lo sentimos, debes llenar todos los campos' })
  }

  // Verificar si el usuario existe
  const usuario = await UsuarioModel.findOne({ correo })
  if (!usuario) {
    return res
      .status(404)
      .json({ msg: 'Usuario no encontrado. Por favor, verifica tu correo.' })
  }

  const verificarPassword = await usuario.matchPassword(contrasenia)
  if (!verificarPassword) {
    return res.status(401).json({
      msg: 'Contraseña incorrecta. Por favor, verifica tu contraseña.',
    })
  }

  const token = generarJWT(usuario._id, usuario.rol)
  usuario.fechaUltimoAcceso = new Date()
  await usuario.save()

  res.status(200).json({
    token,
    usuario,
  })
}

export const obtenerUsuarios = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10

  const skip = (pagina - 1) * limite

  const usuarios = await UsuarioModel.find({ activo: true })
    .skip(skip)
    .limit(limite)
  if (!usuarios || usuarios.length === 0) {
    return res.status(404).json({ msg: 'No se encontraron usuarios activos' })
  }

  

  res.status(200).json(usuarios)
}

export const obtenerUsuario = async (req, res) => {
  const { id } = req.params
  const usuario = await UsuarioModel.findById(id)
  if (!usuario)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el usuario ${id}` })
  res.status(200).json(usuario)
}

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params
  const { cedula, nombre, apellido, telefono, correo } = req.body
  const usuario = UsuarioModel.findById(id)
  if (!usuario)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el usuario ${id}` })

  // Validación de la cédula
  if (cedula.length !== 10) {
    return res.status(400).json({ msg: 'La cédula debe tener 10 caracteres' })
  }

  // Validación del nombre
  if (nombre.length < 2) {
    return res
      .status(400)
      .json({ msg: 'El nombre debe tener al menos 2 caracteres' })
  }

  // Validación del apellido
  if (apellido.length < 2) {
    return res
      .status(400)
      .json({ msg: 'El apellido debe tener al menos 2 caracteres' })
  }

  // Validación del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(correo)) {
    return res
      .status(400)
      .json({ msg: 'Por favor, proporciona un correo electrónico válido' })
  }

  // Verificar si el email ya está registrado
  const verificarEmailBDD = await UsuarioModel.findOne({ correo })
  if (verificarEmailBDD) {
    return res
      .status(400)
      .json({ msg: 'Lo sentimos, el email ya se encuentra registrado' })
  }

  // Validación del teléfono
  if (telefono && telefono.length !== 10) {
    return res.status(400).json({ msg: 'El teléfono debe tener 10 caracteres' })
  }

  // Actualizar usuario
  const usuarioActualizado = await UsuarioModel.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
    },
  )

  res.status(200).json(usuarioActualizado)
}

export const recuperarPassword = (req, res) => {
  res.send('enviar mail')
}

export const verificarToken = (req, res) => {
  res.send('verificar token')
}

export const nuevoPassword = (req, res) => {
  res.send('crear password')
}

export const perfil = (req, res) => {
  res.send('perfil')
}

export const actualizarPassword = (req, res) => {
  res.send('actualizar password')
}

export const cambiarRole = (req, res) => {
  res.send('cambiar role')
}

export const desactivarUsuario = (req, res) => {
  res.send('desactivar usuario')
}
