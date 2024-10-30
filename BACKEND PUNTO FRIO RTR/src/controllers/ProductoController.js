import ProductoSchema from '../models/Producto.js'
import { subirImagen } from '../config/cloudinary.js'
import fs from 'fs-extra'


export const crearProducto = async (req, res) => {
  const { nombre, categoria_id, precio, stock, retornable } = req.body

  if (!req.files?.imagen) {
    return res.status(400).json({ msg: 'Se requiere una imagen' })
  }

  if (!nombre || !categoria_id || !precio || !stock || !retornable) {
    return res.status(400).json({
      msg: 'Se requiere el nombre, la categoria, el precio, el stock y si es retornable',
    })
  }

  if (await ProductoSchema.findOne({ nombre }))
    return res.status(400).json({ msg: 'Ya existe un producto con ese nombre' })

  const imagenSubida = await subirImagen(
    req.files.imagen.tempFilePath,
    'productos'
  )

  const nuevoProducto = new ProductoSchema({
    nombre,
    categoria_id,
    precio,
    stock,
    retornable,
    imagen: imagenSubida.secure_url,
  })

  await fs.unlink(req.files.imagen.tempFilePath)

  await nuevoProducto.save()

  res.status(201).json(nuevoProducto)
}

export const obtenerProductos = async (req, res) => {
    const productos = await ProductoSchema.find({ activo: true })

    if (!productos || productos.length === 0)
        return res.status(404).json({ msg: 'No se encontraron productos activos' })

    res.json(productos)
}

export const obtenerProducto = async (req, res) => {
  const { id } = req.params
  const producto = await ProductoSchema.findById(id)
  if (!producto)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el producto ${id}` })

  res.status(200).json(producto)
}

export const actualizarProducto = async (req, res) => {
  const { id } = req.params
  const producto = ProductoSchema.findById(id)
  if (!producto)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el producto ${id}` })

  if (req.files?.imagen) {
    const imagenSubida = await subirImagen(
      req.files.imagen.tempFilePath,
      'productos',
    )
    req.body.imagen = imagenSubida.secure_url
  }

  const productoNuevo = await ProductoSchema.findByIdAndUpdate(id, req.body)
  
  await fs.unlink(req.files.imagen.tempFilePath)

  res.status(200).json(productoNuevo)
}

export const desactivarProducto = async (req, res) => {
  const { id } = req.params
  const producto = ProductoSchema.findById(id)
  if (!producto)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el producto ${id}` })

  await ProductoSchema.findByIdAndUpdate(id, { activo: false })

  res.status(200).json({ msg: 'Producto desactivado' })
}

export const activarProducto = async (req, res) => {
  const { id } = req.params
  const producto = ProductoSchema.findById(id)

  if (!producto)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el producto ${id}` })

  await ProductoSchema.findByIdAndUpdate(id, { activo: true })

  res.status(200).json({ msg: 'Producto activado' })
}
