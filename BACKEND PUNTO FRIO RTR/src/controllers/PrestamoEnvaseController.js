import PrestamoEnvaseSchema from '../models/PrestamoEnvase.js'
import {
  validarCamposVacios,
  validarObjectId,
  validarSiExisten,
} from '../validators/ComunValidators.js'
import moment from 'moment-timezone'

export const crearPrestamoEnvase = async (req, res) => {
  const clienteError = validarObjectId(req.body.cliente_id)
  if (clienteError) return res.status(400).json({ msg: clienteError.message })

  const camposError = validarCamposVacios(req.body)
  if (camposError) return res.status(400).json({ msg: camposError.message })

  const prestamoEnvase = new PrestamoEnvaseSchema(req.body)
  await prestamoEnvase.save()
  res.status(201).json({ msg: 'Préstamo de envase creado' })
}

export const obtenerPrestamosEnvase = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10
  const skip = (pagina - 1) * limite

  const estado = req.query.estado
  const filtro = estado !== undefined ? { devuelto: estado } : {}

  const prestamosEnvase = await PrestamoEnvaseSchema.find(filtro)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limite)
    .populate('cliente_id', 'nombre apellido cedula')

  const ExistenciaError = validarSiExisten(
    prestamosEnvase,
    'prestamos de envase',
  )
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  const prestamosEnvaseObjeto = prestamosEnvase.map((prestamoEnvase) => {
    const fecha_devuelto = moment(prestamoEnvase.fecha_devuelto).tz('America/Guayaquil').format('DD/MM/YYYY HH:mm:ss')
    const fecha_prestamo = moment(prestamoEnvase.fecha_prestamo).tz('America/Guayaquil').format('DD/MM/YYYY HH:mm:ss')
    return {
      ...prestamoEnvase.toObject(),
      fecha_devuelto,
      fecha_prestamo,
    }})

  res.status(200).json(prestamosEnvaseObjeto)
}

export const obtenerPrestamoEnvase = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const prestamoEnvase = await PrestamoEnvaseSchema.findById(req.params.id)
    .populate('cliente_id', 'nombre apellido')
    .select('_id prestamo deposito fecha_devuelto devuelto fecha_prestamo')

  const ExistenciaError = validarSiExisten(
    prestamoEnvase,
    'prestamos de envase',
  )
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  const prestamoObjeto = {
    ...prestamoEnvase.toObject(),
    fecha_devuelto: moment(prestamoEnvase.fecha_devuelto).tz('America/Guayaquil').format('DD/MM/YYYY HH:mm:ss'),
    fecha_prestamo: moment(prestamoEnvase.fecha_prestamo).tz('America/Guayaquil').format('DD/MM/YYYY HH:mm:ss'),
  }

  res.status(200).json(prestamoObjeto)
}

export const devolverPrestamoEnvase = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const prestamoEnvase = await PrestamoEnvaseSchema.findById(req.params.id)
    .populate('cliente_id', 'nombre apellido')
    .select('_id prestamo deposito fecha_devuelto devuelto fecha_prestamo')

  const ExistenciaError = validarSiExisten(
    prestamoEnvase,
    'prestamos de envase',
  )
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  prestamoEnvase.fecha_devuelto = Date.now()
  prestamoEnvase.devuelto = true

  await prestamoEnvase.save()

  res.status(200).json({ msg: 'Préstamo de envase devuelto' })
}
