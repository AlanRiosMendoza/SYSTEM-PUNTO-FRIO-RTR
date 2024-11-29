import jwt from 'jsonwebtoken'
import UsuarioSchema from '../models/Usuario.js'

export const verificarAutenticacion = async (req, res, next) => {
  if (!req.headers.authorization)
    return res
      .status(404)
      .json({ msg: 'Lo sentimos, debes proprocionar un token' })
  const { authorization } = req.headers
  try {
    const { id, rol } = jwt.verify(
      authorization.split(' ')[1],
      process.env.JWT_SECRET,
    )
    if (rol === 'administrador') {
      req.UsuarioSchema = await UsuarioSchema.findById(id)
        .lean()
        .select(
          '_id nombre apellido rol correo cedula telefono activo fechaUltimoAcceso',
        )
      next()
    }
    if (rol === 'cajero') {
      req.UsuarioSchema = await UsuarioSchema.findById(id)
        .lean()
        .select(
          '_id nombre apellido rol correo cedula telefono activo fechaUltimoAcceso',
        )
      next()
    }
  } catch (error) {
    const e = new Error('Formato del token no válido')
    return res.status(404).json({ msg: e.message })
  }
}

export const verificarAdministrador = async (req, res, next) => {
  if (!req.headers.authorization)
    return res
      .status(404)
      .json({ msg: 'Lo sentimos, debes proprocionar un token' })
  const { authorization } = req.headers
  try {
    const { id, rol } = jwt.verify(
      authorization.split(' ')[1],
      process.env.JWT_SECRET,
    )
    if (rol === 'administrador') {
      req.UsuarioSchema = await UsuarioSchema.findById(id)
        .lean()
        .select(
          '_id nombre apellido rol correo cedula telefono activo fechaUltimoAcceso',
        )
      next()
    } else {
      return res.status(403).json({ msg: 'Acceso denegado: Rol no autorizado' })
    }
  } catch (error) {
    return res.status(404).json({ msg: 'Formato del token no válido' })
  }
}

export const verificarCajero = async (req, res, next) => {
  if (!req.headers.authorization)
    return res
      .status(404)
      .json({ msg: 'Lo sentimos, debes proprocionar un token' })
  const { authorization } = req.headers
  try {
    const { id, rol } = jwt.verify(
      authorization.split(' ')[1],
      process.env.JWT_SECRET,
    )
    if (rol === 'cajero') {
      req.UsuarioSchema = await UsuarioSchema.findById(id)
        .lean()
        .select(
          '_id nombre apellido rol correo cedula telefono activo fechaUltimoAcceso',
        )
      next()
    } else {
      return res.status(403).json({ msg: 'Acceso denegado: Rol no autorizado' })
    }
  } catch (error) {
    return res.status(404).json({ msg: 'Formato del token no válido' })
  }
}
