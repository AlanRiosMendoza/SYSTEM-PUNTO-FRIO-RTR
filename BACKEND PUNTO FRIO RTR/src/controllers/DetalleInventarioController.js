import DetalleInventarioSchema from '../models/DetalleInventario.js'

export const crearDetalleInventario = async (req, res) => {
  const idError = validarObjectId(req.body.producto_id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const nuevoDetalleInventario = new DetalleInventarioSchema(req.body)
  await nuevoDetalleInventario.save()
  res.status(201).json(nuevoDetalleInventario)
}

export const obtenerDetalleInventario = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10

  const skip = (pagina - 1) * limite

  const detalleInventario = await DetalleInventarioSchema.find()
    .skip(skip)
    .limit(limite)

  const ExistenciaError = validarSiExisten(
    detalleInventario,
    'detalleInventario',
  )
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  res.status(200).json(detalleInventario)
}

export const obtenerDetalleInventarioPorId = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const detalleInventario = await DetalleInventarioSchema.findById(
    req.params.id,
  )

  const ExistenciaError = validarSiExisten(
    detalleInventario,
    'detalleInventario',
  )
  if (ExistenciaError)
    return res.status(404).json({
      msg: `No se encontró ese detalle de inventario con ese ID: ${req.params.id}`,
    })

  res.status(200).json(detalleInventario)
}
