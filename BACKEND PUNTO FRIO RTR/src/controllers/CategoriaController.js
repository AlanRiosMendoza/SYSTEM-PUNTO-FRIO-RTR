import { subirImagen } from '../config/cloudinary.js'
import CategoriaSchema from '../models/Categoria.js'
import fs from 'fs-extra'

export const crearCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body

  if (!req.files?.imagen) {
    return res.status(400).json({ msg: 'Se requiere una imagen' })
  }
  if (!nombre || !descripcion) {
    return res
      .status(400)
      .json({ msg: 'Se requiere el nombre y la descripción' })
  }

  if (await CategoriaSchema.findOne({ nombre }))
    return res
      .status(400)
      .json({ msg: 'Ya existe una categoría con ese nombre' })

  const imagenSubida = await subirImagen(
    req.files.imagen.tempFilePath,
    'categorias',
  )

  const nuevaCategoria = new CategoriaSchema({
    nombre,
    descripcion,
    imagen: imagenSubida.secure_url,
  })

  await fs.unlink(req.files.imagen.tempFilePath)

  await nuevaCategoria.save()

  res.status(201).json(nuevaCategoria)
}

export const obtenerCategorias = async (req, res) => {
  const categorias = await CategoriaSchema.find()

  res.json(categorias)
}

export const obtenerCategoria = async (req, res) => {
  const { id } = req.params
  const categoria = await CategoriaSchema.findById(id)
  if (!categoria)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe la categoría ${id}` })

  res.status(200).json(categoria)
}

export const actualizarCategoria = async (req, res) => {
  const { id } = req.params
  const categoria = CategoriaSchema.findById(id)
  if (!categoria)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe la categoría ${id}` })

  if (req.files?.imagen) {
    const imagenSubida = await subirImagen(
      req.files.imagen.tempFilePath,
      'categorias',
    )
    req.body.imagen = imagenSubida.secure_url
    await fs.unlink(req.files.imagen.tempFilePath)
  }

  if (req.body.nombre) {
    const existeCategoria = await CategoriaSchema.findOne({ nombre })
    if (existeCategoria)
      return res
        .status(400)
        .json({ msg: 'Ya existe una categoría con ese nombre' })
  }

  const categoriaActualizada = await CategoriaSchema.findByIdAndUpdate(
    id,
    req.body,
    { new: true },
  )

  res.status(200).json(categoriaActualizada)
}

export const desactivarCategoria = async (req, res) => {
  const { id } = req.params
  const categoria = CategoriaSchema.findById(id)
  if (!categoria)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe la categoría ${id}` })

  await CategoriaSchema.findByIdAndUpdate(id, { activo: false })

  res.status(200).json({ msg: 'Categoría desactivada' })
}

export const activarCategoria = async (req, res) => {
  const { id } = req.params
  const categoria = CategoriaSchema.findById(id)
  if (!categoria)
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe la categoría ${id}` })

  await CategoriaSchema.findByIdAndUpdate(id, { activo: true })

  res.status(200).json({ msg: 'Categoría activada' })
}
