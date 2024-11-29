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

  res.status(201).json({ msg: 'Usuario creado' })
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

  const { _id, nombre, apellido, rol } = usuario

  res.status(200).json({
    token,
    usuario: { _id, nombre, apellido, correo, rol },
  })
}

export const obtenerUsuarios = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10
  const skip = (pagina - 1) * limite

  const estado = req.query.estado
  const cedula = req.query.cedula

  const filtro = {}

  if (estado !== undefined) {
    filtro.activo = estado
  }

  if (cedula) {
    filtro.cedula = { $regex: cedula, $options: 'i' }
  }

  const usuarios = await UsuarioSchema.find(filtro)
    .skip(skip)
    .limit(limite)
    .select('_id cedula nombre apellido rol correo telefono activo fechaUltimoAcceso')

  const ExistenciaError = validarSiExisten(usuarios, 'usuarios')
  if (ExistenciaError) {
    return res.status(404).json({ msg: ExistenciaError.message })
  }

  res.status(200).json(usuarios)
}

export const obtenerUsuario = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const usuario = await UsuarioSchema.findById(req.params.id).select(
    '_id nombre apellido rol correo cedula telefono activo fechaUltimoAcceso',
  )

  const ExistenciaError = validarSiExisten(usuario, 'usuario')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró el usuario con ese ID: ${req.params.id}` })

  res.status(200).json(usuario)
}

export const actualizarPerfil = async (req, res) => {

  const usuario = await UsuarioSchema.findById(req.UsuarioSchema._id)

  const camposVaciosError = validarCamposVacios(req.body)
  if (camposVaciosError)
    return res.status(400).json({ msg: camposVaciosError.message })

  if (req.body.correo && req.body.correo !== usuario.correo) {
    const correoError = validarCorreoElectronico(req.body.correo)
    if (correoError) return res.status(400).json({ msg: correoError.message })

    const correoExistenteError = await validarCorreoExistente(req.body.correo)
    if (correoExistenteError)
      return res.status(400).json({ msg: correoExistenteError.message })
    usuario.correo = req.body.correo
  }

  if (req.body.cedula && req.body.cedula !== usuario.cedula) {
    const cedulaError = validarLongitudNumero(req.body.cedula, 10, 'cédula')
    if (cedulaError) return res.status(400).json({ msg: cedulaError.message })
    usuario.cedula = req.body.cedula
  }

  if (req.body.nombre && req.body.nombre !== usuario.nombre) {
    const nombreError = validarLongitudPalabra(req.body.nombre, 2, 'nombre')
    if (nombreError) return res.status(400).json({ msg: nombreError.message })
    usuario.nombre = req.body.nombre
  }

  if (req.body.apellido && req.body.apellido !== usuario.apellido) {
    const apellidoError = validarLongitudPalabra(req.body.apellido, 2, 'apellido')
    if (apellidoError) return res.status(400).json({ msg: apellidoError.message })
    usuario.apellido = req.body.apellido
  }

  if (req.body.telefono && req.body.telefono !== usuario.telefono) {
    const telefonoError = validarLongitudNumero(req.body.telefono, 10, 'teléfono')
    if (telefonoError) return res.status(400).json({ msg: telefonoError.message })
    usuario.telefono = req.body.telefono
  }

  await usuario.save()

  res.status(200).json({ msg: 'Usuario actualizado' })
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
  res.status(200).json(req.UsuarioSchema).select(
    '_id nombre apellido rol correo cedula telefono activo fechaUltimoAcceso',
  )
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

  res.status(200).json({ msg: 'Rol actualizado' })
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
