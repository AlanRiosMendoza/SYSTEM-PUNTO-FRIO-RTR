import CategoriaSchema from '../models/Categoria.js'

export const crearCategoria = async (req, res) => {
  if (!req.imagen) {
    return res.status(400).json({ msg: 'No se ha subido una imagen' })
  }

  imagenResultado = await subirImagen(req.imagen, 'categorias')

  const nuevaCategoria = new CategoriaSchema(req.body)

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
