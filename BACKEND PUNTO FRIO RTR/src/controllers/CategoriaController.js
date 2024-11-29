import CategoriaSchema from '../models/Categoria.js'
import {
  validarActivado,
  validarCamposVacios,
  validarDesactivado,
  validarNombreUnico,
  validarObjectId,
  validarSiExisten,
} from '../validators/ComunValidators.js'

export const crearCategoria = async (req, res) => {
  const camposError = validarCamposVacios(req.body)
  if (camposError) return res.status(400).json({ msg: camposError.message })

  const nombreError = await validarNombreUnico(req.body.nombre, 'categoria')
  if (nombreError) return res.status(400).json({ msg: nombreError.message })

  const nuevaCategoria = new CategoriaSchema(req.body)

  await nuevaCategoria.save()

  res.status(201).json({ msg: 'Categoría creada' })
}

export const obtenerCategorias = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10
  const skip = (pagina - 1) * limite

  const estado = req.query.estado
  const nombre = req.query.nombre

  const filtro = {}

  if (estado !== undefined) {
    filtro.activo = estado
  }

  if (nombre) {
    filtro.nombre = { $regex: nombre, $options: 'i' }
  }

  const categorias = await CategoriaSchema.find(filtro)
    .skip(skip)
    .limit(limite)
    .select('_id nombre descripcion activo')

  const ExistenciaError = validarSiExisten(categorias, 'categorias')
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  res.status(200).json(categorias)
}

export const obtenerCategoria = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const categoria = await CategoriaSchema.findById(req.params.id).select(
    '_id nombre descripcion activo',
  )

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

  const categoria = await CategoriaSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(categoria, 'categorias')
  if (ExistenciaError)
    return res.status(404).json({
      msg: `No se encontró esa categoría con ese ID: ${req.params.id}`,
    })

  if (req.body.nombre && req.body.nombre !== categoria.nombre) {
    const nombreError = await validarNombreUnico(req.body.nombre, 'categoria')
    if (nombreError) return res.status(400).json({ msg: nombreError.message })
    categoria.nombre = req.body.nombre
  }

  if (req.body.descripcion) categoria.descripcion = req.body.descripcion

  await categoria.save()

  res.status(200).json({ msg: 'Categoría actualizada' })
}

export const desactivarCategoria = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })
  const categoria = await CategoriaSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(categoria, 'categorias')
  if (ExistenciaError)
    return res.status(404).json({
      msg: `No se encontró esa categoría con ese ID: ${req.params.id}`,
    })

  const desactivadoError = validarDesactivado(categoria, 'categoria')
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
