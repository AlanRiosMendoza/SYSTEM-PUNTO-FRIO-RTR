import mongoose from 'mongoose'

import CategoriaSchema from '../models/Categoria.js'
import ProductoSchema from '../models/Producto.js'
import UsuarioSchema from '../models/Usuario.js'
import ClienteSchema from '../models/Cliente.js'

export const validarImagenRequerida = (files) => {
  if (!files?.imagen) {
    return { error: true, message: 'Se requiere una imagen' }
  }
  return null
}

export const validarObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { error: true, message: `ID no válido: ${id}` }
  }
  return null
}

export const validarNombreUnico = async (schema, nombre) => {
  if (nombre === 'categoria') {
    const categoriaExistente = await CategoriaSchema.findOne({ nombre: schema })
    if (categoriaExistente) {
      return { error: true, message: `Ya existe una categoría con ese nombre` }
    }
  }
  if (nombre === 'producto') {
    const productoExistente = await ProductoSchema.findOne({ nombre: schema })
    if (productoExistente) {
      return { error: true, message: `Ya existe un producto con ese nombre` }
    }
  }
  if (nombre === 'usuario') {
    const usuarioExistente = await UsuarioSchema.findOne({ nombre: schema })
    if (usuarioExistente) {
      return { error: true, message: `Ya existe un producto con ese nombre` }
    }
  }
  return null
}

export const validarSiExisten = (schema, nombreSchema) => {
  if (!schema || schema.length === 0) {
    return { error: true, message: `No se encontraron ${nombreSchema}` }
  }
  return null
}

export const validarDesactivado = (schema, nombreSchema) => {
  if (!schema.activo) {
    return {
      error: true,
      message: `Lo sentimos, ${nombreSchema} ya esta desactivado`,
    }
  }
  return null
}

export const validarActivado = (schema, nombreSchema) => {
  if (schema.activo) {
    return {
      error: true,
      message: `Lo sentimos, ${nombreSchema} ya esta activado`,
    }
  }
  return null
}

export const validarCamposVacios = (body) => {
  const camposFaltantes = []

  Object.entries(body).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      value.toString().trim() === ''
    ) {
      camposFaltantes.push(key)
    }
  })

  if (camposFaltantes.length > 0) {
    return {
      error: true,
      message: `Faltan los siguientes campos: ${camposFaltantes.join(', ')}`,
    }
  }

  return null
}

export const validarCorreoElectronico = (correo) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(correo)) {
    return {
      error: true,
      message: 'Por favor, proporciona un correo electrónico válido',
    }
  }
  return null
}

export const validarLongitudNumero = (numero, longitud, campo) => {
  if (numero.length !== longitud) {
    return {
      error: true,
      message: `Por favor, asegúrate de que ${campo} tenga ${longitud} caracteres.`,
    }
  }
  return null
}

export const validarLongitudPalabra = (palabra, longitud, campo) => {
  if (palabra.length < longitud) {
    return {
      error: true,
      message: `Por favor, asegúrate de que ${campo} tenga al menos ${longitud} caracteres.`,
    }
  }
  return null
}

export const validarContrasenia = (contrasenia) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/
  if (!passwordRegex.test(contrasenia)) {
    return {
      error: true,
      message:
        'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula y un carácter especial.',
    }
  }
  return null
}

export const validarCorreoExistente = async (correo) => {
  const usuarioExistente = await UsuarioSchema.findOne({ correo })
  if (usuarioExistente) {
    return { error: true, message: 'Ya existe un usuario con ese correo' }
  }
  return null
}

export const validarCorreoNoExistente = async (correo) => {
  const usuarioExistente = await UsuarioSchema.findOne({ correo })
  if (!usuarioExistente) {
    return {
      error: true,
      message: 'Usuario no encontrado. Por favor, verifica tu correo.',
    }
  }
  return null
}

export const validarRol = (rol) => {
  if (rol !== 'administrador' && rol !== 'cajero') {
    return {
      error: true,
      message: 'El rol debe ser "administrador" o "cajero"',
    }
  }
  return null
}

export const validarCedulaUnica = async (schema, nombre) => {
  if (nombre === 'usuario') {
    const usuarioExistente = await UsuarioSchema.findOne({ schema })
    if (usuarioExistente) {
      return { error: true, message: 'Ya existe un usuario con esa cédula' }
    }
  }
  if (nombre === 'cliente') {
    const clienteExistente = await ClienteSchema.findOne({ schema })
    if (clienteExistente) {
      return { error: true, message: 'Ya existe un cliente con esa cédula' }
    }
  }
  return null
}
