import ProductoSchema from '../models/Producto.js'
import { subirImagen } from '../config/cloudinary.js'
import fs from 'fs-extra'
import {
  validarCamposProducto,
  validarImagenRequerida,
  validarNombreUnico,
  validarObjectId,
  validarProductoActivo,
} from '../validations/ProductoValidation.js'

export const crearProducto = async (req, res) => {
  const imagenError = validarImagenRequerida(req.files)
  if (imagenError) return res.status(400).json({ msg: imagenError.message })

  const camposError = validarCamposProducto(req.body)
  if (camposError) return res.status(400).json({ msg: camposError.message })

  const nombreError = await validarNombreUnico(req.body.nombre)
  if (nombreError) return res.status(400).json({ msg: nombreError.message })

  const imagenSubida = await subirImagen(
    req.files.imagen.tempFilePath,
    'productos',
  )

  req.body.imagen = imagenSubida.secure_url

  const nuevoProducto = new ProductoSchema(req.body)

  await fs.unlink(req.files.imagen.tempFilePath)
  await nuevoProducto.save()

  res.status(201).json(nuevoProducto)
}

export const obtenerProductos = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10

  const skip = (pagina - 1) * limite

  const productos = await ProductoSchema.find({ activo: true })
    .skip(skip)
    .limit(limite)

  if (!productos || productos.length === 0) {
    return res.status(404).json({ msg: 'No se encontraron productos activos' })
  }

  res.json(productos)
}

export const obtenerProducto = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const producto = await ProductoSchema.findById(req.params.id)

  const productoError = validarProductoActivo(producto)
  if (productoError) return res.status(404).json({ msg: productoError.message })

  res.status(200).json(producto)
}

export const actualizarProducto = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const producto = await ProductoSchema.findById(req.params.id)
  if (!producto) {
    return res.status(404).json({
      msg: `Lo sentimos, no existe el producto con ID ${req.params.id}`,
    })
  }

  if (req.files?.imagen) {
    const imagenSubida = await subirImagen(
      req.files.imagen.tempFilePath,
      'productos',
    )
    req.body.imagen = imagenSubida.secure_url
    await fs.unlink(req.files.imagen.tempFilePath)
  }

  const productoNuevo = await ProductoSchema.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  )
  res.status(200).json(productoNuevo)
}

export const desactivarProducto = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const producto = await ProductoSchema.findById(req.params.id)

  const productoError = validarProductoActivo(producto)
  if (productoError) return res.status(404).json({ msg: productoError.message })

  await ProductoSchema.findByIdAndUpdate(req.params.id, { activo: false })
  res.status(200).json({ msg: 'Producto desactivado' })
}

export const activarProducto = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const producto = await ProductoSchema.findById(req.params.id)
  if (!producto) {
    return res.status(404).json({
      msg: `Lo sentimos, no existe el producto con ID ${req.params.id}`,
    })
  }

  await ProductoSchema.findByIdAndUpdate(req.params.id, { activo: true })
  res.status(200).json({ msg: 'Producto activado' })
}

export const obtenerProductosDesactivados = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10

  const skip = (pagina - 1) * limite

  const productos = await ProductoSchema.find({ activo: false })
    .skip(skip)
    .limit(limite)

  if (!productos || productos.length === 0) {
    return res.status(404).json({ msg: 'No se encontraron productos inactivo' })
  }
  
  res.json(productos)
}
