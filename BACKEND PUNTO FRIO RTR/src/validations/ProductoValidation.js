import mongoose from 'mongoose'
import ProductoSchema from '../models/Producto.js'

export const validarObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { error: true, message: `ID de producto no válido: ${id}` }
  }
  return null
}

export const validarProductoActivo = (producto) => {
  if (!producto) {
    return { error: true, message: 'Lo sentimos, no existe el producto' }
  }
  if (!producto.activo) {
    return { error: true, message: 'Lo sentimos, el producto está desactivado' }
  }
  return null
}

export const validarImagenRequerida = (files) => {
  if (!files?.imagen) {
    return { error: true, message: 'Se requiere una imagen' }
  }
  return null
}

export const validarCamposProducto = (body) => {
  const { nombre, categoria_id, precio, stock, retornable } = body
  const camposFaltantes = []

  if (!nombre) camposFaltantes.push('nombre')
  if (!categoria_id) camposFaltantes.push('categoria_id')
  if (!precio) camposFaltantes.push('precio')
  if (!stock) camposFaltantes.push('stock')
  if (retornable === undefined || retornable === null)
    camposFaltantes.push('retornable')

  if (camposFaltantes.length > 0) {
    return {
      error: true,
      message: `Faltan los siguientes campos: ${camposFaltantes.join(', ')}`,
    }
  }

  return null
}

export const validarNombreUnico = async (nombre) => {
  const productoExistente = await ProductoSchema.findOne({ nombre })
  if (productoExistente) {
    return { error: true, message: 'Ya existe un producto con ese nombre' }
  }
  return null
}
