import { subirImagen } from '../config/cloudinary.js'
import CategoriaSchema from '../models/Categoria.js'
import fs from 'fs-extra'
import {
  validarActivado,
  validarCamposVacios,
  validarDesactivado,
  validarImagenRequerida,
  validarNombreUnico,
  validarObjectId,
  validarSiExisten,
} from '../validators/ComunValidators.js'

export const crearCategoria = async (req, res) => {
  const imagenError = validarImagenRequerida(req.files)
  if (imagenError) return res.status(400).json({ msg: imagenError.message })

  const camposError = validarCamposVacios(req.body)
  if (camposError) return res.status(400).json({ msg: camposError.message })

  const nombreError = await validarNombreUnico(req.body.nombre, 'categoria')
  if (nombreError) return res.status(400).json({ msg: nombreError.message })

  const imagenSubida = await subirImagen(
    req.files.imagen.tempFilePath,
    'categorias',
  )

  req.body.imagen = imagenSubida.secure_url

  const nuevaCategoria = new CategoriaSchema(req.body)

  try {
    await fs.unlink(req.files.imagen.tempFilePath)
  } catch (error) {
    return res.status(500).json({ msg: 'Error al borrar la imagen temporal', error })
  }

  await nuevaCategoria.save()

  res.status(201).json(nuevaCategoria)
}

export const obtenerCategorias = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10
  const skip = (pagina - 1) * limite

  const estado = req.query.estado || true

  const categorias = await CategoriaSchema.find({ activo: estado })
    .skip(skip)
    .limit(limite)

  const ExistenciaError = validarSiExisten(categorias, 'categorias')
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  res.status(200).json(categorias)
}

export const obtenerCategoria = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const categoria = await CategoriaSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(categoria, 'categorias')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró ese producto con ese ID: ${req.params.id}` })

  res.status(200).json(categoria)
}

export const actualizarCategoria = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const categoria = CategoriaSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(categoria, 'categorias')
  if (ExistenciaError)
    return res.status(404).json({
      msg: `No se encontró esa categoría con ese ID: ${req.params.id}`,
    })

  const nombreError = await validarNombreUnico(req.body.nombre, 'categoria')
  if (nombreError) return res.status(400).json({ msg: nombreError.message })

  if (req.files?.imagen) {
    const imagenSubida = await subirImagen(
      req.files.imagen.tempFilePath,
      'categorias',
    )
    req.body.imagen = imagenSubida.secure_url
    await fs.unlink(req.files.imagen.tempFilePath)
  }

  const categoriaActualizada = await CategoriaSchema.findByIdAndUpdate(
    req.params.id,
    req.body,
  )

  res.status(200).json(categoriaActualizada)
}

export const desactivarCategoria = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })
  console.log(req.params.id)
  const categoria = await CategoriaSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(categoria, 'categorias')
  if (ExistenciaError)
    return res.status(404).json({
      msg: `No se encontró esa categoría con ese ID: ${req.params.id}`,
    })

  const desactivadoError = validarDesactivado(categoria, 'categoria')
  console.log(desactivadoError)
  if (desactivadoError)
    return res.status(404).json({ msg: desactivadoError.message })

  await CategoriaSchema.findByIdAndUpdate(req.params.id, { activo: false })

  res.status(200).json({ msg: 'Categoría desactivada' })
}

export const activarCategoria = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const categoria = await CategoriaSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(categoria, 'categorias')
  if (ExistenciaError)
    return res.status(404).json({
      msg: `No se encontró esa categoria con ese ID: ${req.params.id}`,
    })

  const activadoError = validarActivado(categoria, 'producto')
  if (activadoError) return res.status(404).json({ msg: activadoError.message })

  await CategoriaSchema.findByIdAndUpdate(req.params.id, { activo: true })

  res.status(200).json({ msg: 'Categoría activada' })
}
