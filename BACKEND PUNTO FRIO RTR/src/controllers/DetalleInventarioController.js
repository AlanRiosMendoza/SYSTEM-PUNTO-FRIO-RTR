import moment from 'moment-timezone'
import detalleInventarioSchema from '../models/DetalleInventario.js'
import {
  validarObjectId,
  validarSiExisten,
} from '../validators/ComunValidators.js'
import productoSchema from '../models/Producto.js'

export const crearDetalleInventario = async (req, res) => {
  const { id: usuarioId } = req.UsuarioSchema
  const idError = validarObjectId(req.body.producto_id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const producto = await productoSchema.findById(req.body.producto_id)

  const ExistenciaError = validarSiExisten(producto, 'producto')
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  producto.stock += parseInt(req.body.cantidad)
  await producto.save()

  const nuevoDetalleInventario = new detalleInventarioSchema(req.body)
  nuevoDetalleInventario.usuario_id = usuarioId
  nuevoDetalleInventario.tipo_movimiento = 'Entrada'
  await nuevoDetalleInventario.save()

  res.status(201).json({ msg: 'Detalle de inventario creado' })
}

export const obtenerDetalleInventario = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10

  const skip = (pagina - 1) * limite

  const detalleInventario = await detalleInventarioSchema.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limite)
    .select('_id cantidad fecha descripcion tipo_movimiento')
    .populate('usuario_id', 'nombre apellido')
    .populate('producto_id', 'nombre stock')

  const ExistenciaError = validarSiExisten(
    detalleInventario,
    'detalleInventario',
  )
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  const inventarioObjeto = detalleInventario.map((detalle) => {
    const fechaEcuador = moment(detalle.fecha)
      .tz('America/Guayaquil')
      .format('YYYY-MM-DD HH:mm:ss')
    return {
      ...detalle.toObject(),
      fecha: fechaEcuador,
    }
  })

  res.status(200).json(inventarioObjeto)
}

export const obtenerDetalleInventarioPorId = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const detalleInventario = await detalleInventarioSchema.findById(
    req.params.id,
  )
    .select('_id cantidad fecha descripcion tipo_movimiento')
    .populate('usuario_id', 'nombre apellido')
    .populate('producto_id', 'nombre stock')

  const ExistenciaError = validarSiExisten(
    detalleInventario,
    'detalleInventario',
  )
  if (ExistenciaError)
    return res.status(404).json({
      msg: `No se encontró ese detalle de inventario con ese ID: ${req.params.id}`,
    })

  const inventarioObjeto = detalleInventario.toObject()

  inventarioObjeto.fecha = moment(detalleInventario.fecha)
    .tz('America/Guayaquil')
    .format('YYYY-MM-DD HH:mm:ss')

  res.status(200).json(inventarioObjeto)
}
