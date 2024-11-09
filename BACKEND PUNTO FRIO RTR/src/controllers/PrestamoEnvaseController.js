import PrestamoEnvaseSchema from '../models/PrestamoEnvase'

export const crearPrestamoEnvase = async (req, res) => {
  const clienteError = validarObjectId(req.body.cliente_id)
  if (clienteError) return res.status(400).json({ msg: clienteError.message })

  const validarCamposVacios = validarCamposVacios(req.body)
  if (validarCamposVacios)
    return res.status(400).json({ msg: validarCamposVacios.message })

  const prestamoEnvase = new PrestamoEnvaseSchema(req.body)
  await prestamoEnvase.save()
  res.status(201).json(prestamoEnvase)
}

export const obtenerPrestamosEnvase = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10

  const skip = (pagina - 1) * limite

  const prestamosEnvase = await PrestamoEnvaseSchema.find()
    .skip(skip)
    .limit(limite)
    .populate('cliente_id', 'nombre apellido')

  const ExistenciaError = validarSiExisten(
    prestamosEnvase,
    'prestamos de envase',
  )
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  res.status(200).json(prestamosEnvase)
}

export const obtenerPrestamoEnvase = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const prestamoEnvase = await PrestamoEnvaseSchema.findById(
    req.params.id,
  ).populate('cliente_id', 'nombre apellido')

  const ExistenciaError = validarSiExisten(
    prestamoEnvase,
    'prestamos de envase',
  )
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  res.status(200).json(prestamoEnvase)
}

export const devolverPrestamoEnvase = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const prestamoEnvase = await PrestamoEnvaseSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(
    prestamoEnvase,
    'prestamos de envase',
  )
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  prestamoEnvase.fecha_devuelto = Date.now()
  prestamoEnvase.devuelto = true

  await prestamoEnvase.save()

  res.status(200).json(prestamoEnvase)
}
