export const crearCliente = async (req, res) => {
  const camposError = validarCamposVacios(req.body)
  if (camposError) return res.status(400).json({ msg: camposError.message })

  const cedulaError = await validarCedulaUnica(req.body.cedula, 'cliente')
  if (cedulaError) return res.status(400).json({ msg: cedulaError.message })

  const correoError = validarCorreoElectronico(req.body.correo)
  if (correoError) return res.status(400).json({ msg: correoError.message })

  const correoUnicoError = await validarCorreoUnico(req.body.correo)
  if (correoUnicoError)
    return res.status(400).json({ msg: correoUnicoError.message })

  const telefonoError = validarLongitudNumero(req.body.telefono, 10, 'telefono')
  if (telefonoError) return res.status(400).json({ msg: telefonoError.message })

  const nuevoCliente = new ClienteSchema(req.body)

  nuevoCliente.save()

  res.status(201).json({ nuevoCliente })
}

export const obtenerClientes = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10

  const skip = (pagina - 1) * limite

  const clientes = await ClienteSchema.find({ activo: true })
    .skip(skip)
    .limit(limite)

  const ExistenciaError = validarSiExisten(clientes, 'clientes')
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  res.json(clientes)
}

export const obtenerCliente = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const cliente = await ClienteSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(cliente, 'cliente')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró el cliente con ese ID: ${req.params.id}` })

  res.status(200).json(cliente)
}

export const actualizarCliente = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const cliente = await ClienteSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(cliente, 'cliente')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró un cliente con el ID: ${req.params.id}` })

  const camposVaciosError = validarCamposVacios(req.body)
  if (camposVaciosError)
    return res.status(400).json({ msg: camposVaciosError.message })

  const cedulaError = validarLongitudNumero(req.body.cedula, 10, 'cédula')
  if (cedulaError) return res.status(400).json({ msg: cedulaError.message })

  const correoError = validarCorreoElectronico(req.body.correo)
  if (correoError) return res.status(400).json({ msg: correoError.message })

  const correoUnicoError = await validarCorreoUnico(req.body.correo)
  if (correoUnicoError)
    return res.status(400).json({ msg: correoUnicoError.message })

  const telefonoError = validarLongitudNumero(req.body.telefono, 10, 'telefono')
  if (telefonoError) return res.status(400).json({ msg: telefonoError.message })

  await ClienteSchema.findByIdAndUpdate(req.params.id, req.body)

  res.status(200).json({ msg: 'Cliente actualizado correctamente' })
}

export const desactivarCliente = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const cliente = await ClienteSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(cliente, 'cliente')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró el cliente con ese ID: ${req.params.id}` })

  const desactivadoError = validarDesactivado(cliente, 'cliente')
  if (desactivadoError)
    return res.status(400).json({ msg: desactivadoError.message })

  await ClienteSchema.findByIdAndUpdate(req.params.id, { activo: false })

  res.status(200).json({ msg: 'Cliente desactivado correctamente' })
}

export const activarCliente = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const cliente = await ClienteSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(cliente, 'cliente')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró el cliente con ese ID: ${req.params.id}` })

  const activadoError = validarActivado(cliente, 'cliente')
  if (activadoError) return res.status(400).json({ msg: activadoError.message })

  await ClienteSchema.findByIdAndUpdate(req.params.id, { activo: true })

  res.status(200).json({ msg: 'Cliente activado correctamente' })
}

export const obtenerClientesDesactivados = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10

  const skip = (pagina - 1) * limite

  const clientes = await ClienteSchema.find({ activo: false })
    .skip(skip)
    .limit(limite)

  const ExistenciaError = validarSiExisten(clientes, 'clientes')
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  res.json(clientes)
}
