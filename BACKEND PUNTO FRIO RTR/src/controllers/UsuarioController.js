import sendMailToUser from '../config/nodemailer.js'
import generarJWT from '../helpers/crearJWT.js'
import UsuarioSchema from '../models/Usuario.js'
import {
  validarActivado,
  validarCamposVacios,
  validarContrasenia,
  validarCorreoElectronico,
  validarCorreoExistente,
  validarCorreoNoExistente,
  validarDesactivado,
  validarLongitudNumero,
  validarLongitudPalabra,
  validarObjectId,
  validarRol,
  validarSiExisten,
} from '../validators/ComunValidators.js'

export const registro = async (req, res) => {
  const camposVaciosError = validarCamposVacios(req.body)
  if (camposVaciosError)
    return res.status(400).json({ msg: camposVaciosError.message })

  const correoError = validarCorreoElectronico(req.body.correo)
  if (correoError) return res.status(400).json({ msg: correoError.message })

  const cedulaError = validarLongitudNumero(req.body.cedula, 10, 'cedula')
  if (cedulaError) return res.status(400).json({ msg: cedulaError.message })

  const telefonoError = validarLongitudNumero(req.body.telefono, 10, 'telefono')
  if (telefonoError) return res.status(400).json({ msg: telefonoError.message })

  const contraseniaError = validarContrasenia(req.body.contrasenia)
  if (contraseniaError)
    return res.status(400).json({ msg: contraseniaError.message })

  const nombreError = validarLongitudPalabra(req.body.nombre, 2, 'nombre')
  if (nombreError) return res.status(400).json({ msg: nombreError.message })

  const apellidoError = validarLongitudPalabra(req.body.apellido, 2, 'apellido')
  if (apellidoError) return res.status(400).json({ msg: apellidoError.message })

  const correoUnicoError = await validarCorreoExistente(req.body.correo)
  if (correoUnicoError)
    return res.status(400).json({ msg: correoUnicoError.message })

  const rolError = validarRol(req.body.rol)
  if (rolError) return res.status(400).json({ msg: rolError.message })

  const nuevoUsuario = new UsuarioSchema(req.body)

  nuevoUsuario.contrasenia = await nuevoUsuario.encryptPassword(
    req.body.contrasenia,
  )

  await nuevoUsuario.save()

  res.status(201).json({ nuevoUsuario })
}

export const login = async (req, res) => {
  const { correo, contrasenia } = req.body

  const camposVaciosError = validarCamposVacios(req.body)
  if (camposVaciosError)
    return res.status(400).json({ msg: camposVaciosError.message })

  const correoError = validarCorreoElectronico(correo)
  if (correoError) return res.status(400).json({ msg: correoError.message })

  const correoNoExistenteError = await validarCorreoNoExistente(correo)
  if (correoNoExistenteError)
    return res.status(404).json({ msg: correoNoExistenteError.message })

  const usuario = await UsuarioSchema.findOne({ correo, activo: true })

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

  const usuarios = await UsuarioSchema.find({ activo: true })
    .skip(skip)
    .limit(limite)

  const ExistenciaError = validarSiExisten(usuarios, 'usuarios')
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  res.status(200).json(usuarios)
}

export const obtenerUsuario = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const usuario = await UsuarioSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(usuario, 'usuario')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró el usuario con ese ID: ${req.params.id}` })

  res.status(200).json(usuario)
}

export const actualizarUsuario = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const usuario = await UsuarioSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(usuario, 'usuario')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró un usuario con el ID: ${req.params.id}` })

  const camposVaciosError = validarCamposVacios(req.body)
  if (camposVaciosError)
    return res.status(400).json({ msg: camposVaciosError.message })

  const correoError = validarCorreoElectronico(req.body.correo)
  if (correoError) return res.status(400).json({ msg: correoError.message })

  const cedulaError = validarLongitudNumero(req.body.cedula, 10, 'cédula')
  if (cedulaError) return res.status(400).json({ msg: cedulaError.message })

  const nombreError = validarLongitudPalabra(req.body.nombre, 2, 'nombre')
  if (nombreError) return res.status(400).json({ msg: nombreError.message })

  const apellidoError = validarLongitudPalabra(req.body.apellido, 2, 'apellido')
  if (apellidoError) return res.status(400).json({ msg: apellidoError.message })

  const correoExistenteError = await validarCorreoExistente(req.body.correo)
  if (correoExistenteError)
    return res.status(400).json({ msg: correoExistenteError.message })

  const telefonoError = validarLongitudNumero(req.body.telefono, 10, 'teléfono')
  if (telefonoError) return res.status(400).json({ msg: telefonoError.message })

  const rolError = validarRol(req.body.rol)
  if (rolError) return res.status(400).json({ msg: rolError.message })

  const usuarioActualizado = await UsuarioSchema.findByIdAndUpdate(
    req.params.id,
    req.body,
  )

  res.status(200).json(usuarioActualizado)
}

export const recuperarPassword = async (req, res) => {
  const camposError = validarCamposVacios(req.body)
  if (camposError) return res.status(400).json({ msg: camposError.message })

  const correoError = validarCorreoElectronico(req.body.correo)
  if (correoError) return res.status(400).json({ msg: correoError.message })

  const usuario = await UsuarioSchema.findOne({ correo: req.body.correo })

  const ExistenciaError = validarSiExisten(usuario, 'usuario')
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  const token = usuario.crearToken()
  sendMailToUser(usuario.correo, token)
  usuario.token = token
  await usuario.save()

  res.status(200).json({ msg: 'Correo enviado' })
}

export const verificarToken = async (req, res) => {
  const usuario = await UsuarioSchema.findOne({ token: req.params.token })

  const ExistenciaError = validarSiExisten(usuario, 'usuario')
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  if (usuario.token !== req.params.token) {
    return res.status(400).json({ msg: 'Token inválido' })
  }

  res.status(200).json({ msg: 'Token verificado' })
}

export const nuevoPassword = async (req, res) => {
  const camposError = validarCamposVacios(req.body)
  if (camposError) return res.status(400).json({ msg: camposError.message })

  const usuario = await UsuarioSchema.findOne({ token: req.params.token })

  const ExistenciaError = validarSiExisten(usuario, 'usuario')
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  if (usuario.token !== req.params.token) {
    return res.status(400).json({ msg: 'Token inválido' })
  }

  const contraseniaError = validarContrasenia(req.body.contrasenia)
  if (contraseniaError)
    return res.status(400).json({ msg: contraseniaError.message })

  usuario.contrasenia = await usuario.encryptPassword(req.body.contrasenia)
  usuario.token = null

  await usuario.save()

  res.status(200).json({ msg: 'Contraseña actualizada' })
}

export const perfil = async (req, res) => {
  res.status(200).json(req.UsuarioSchema)
}

export const actualizarPassword = async (req, res) => {
  const { antiguaContrasenia, contrasenia } = req.body

  const camposError = validarCamposVacios(req.body)
  if (camposError) return res.status(400).json({ msg: camposError.message })

  const contraseniaError = validarContrasenia(contrasenia)
  if (contraseniaError)
    return res.status(400).json({ msg: contraseniaError.message })

  const usuario = await UsuarioSchema.findById(req.UsuarioSchema._id)

  const verificarPassword = await usuario.matchPassword(antiguaContrasenia)
  if (!verificarPassword) {
    return res.status(401).json({
      msg: 'Contraseña incorrecta. Por favor, verifica tu contraseña.',
    })
  }

  usuario.contrasenia = await usuario.encryptPassword(contrasenia)

  await usuario.save()

  res.status(200).json({ msg: 'Contraseña actualizada' })
}

export const cambiarRole = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const usuario = await UsuarioSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(usuario, 'usuarios')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró ese producto con ese ID: ${req.params.id}` })

  const rolError = validarRol(req.body.rol)
  if (rolError) return res.status(400).json({ msg: rolError.message })

  usuario.rol = req.body.rol

  await usuario.save()

  res.status(200).json({ usuario })
}

export const desactivarUsuario = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const usuario = await UsuarioSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(usuario, 'usuarios')
  if (ExistenciaError)
    return res.status(404).json({
      msg: `No se encontró el usuario con ese ID: ${req.params.id}`,
    })

  const desactivadoError = validarDesactivado(usuario, 'usuario')
  if (desactivadoError)
    return res.status(404).json({ msg: desactivadoError.message })

  await UsuarioSchema.findByIdAndUpdate(req.params.id, { activo: false })

  res.status(200).json({ msg: 'Usuario desactivado' })
}

export const activarUsuario = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const usuario = await UsuarioSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(usuario, 'usuarios')
  if (ExistenciaError)
    return res.status(404).json({
      msg: `No se encontró el usuario con ese ID: ${req.params.id}`,
    })

  const activadoError = validarActivado(usuario, 'usuario')
  if (activadoError) return res.status(404).json({ msg: activadoError.message })

  await UsuarioSchema.findByIdAndUpdate(req.params.id, { activo: true })

  res.status(200).json({ msg: 'Usuario activado' })
}

export const obtenerUsuariosDesactivados = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10

  const skip = (pagina - 1) * limite

  const usuarios = await UsuarioSchema.find({ activo: false })
    .skip(skip)
    .limit(limite)

  const ExistenciaError = validarSiExisten(usuarios, 'usuarios')
  if (ExistenciaError)
    return res.status(404).json({
      msg: 'No se encontraron usuarios desactivados',
    })

  res.status(200).json(usuarios)
}
