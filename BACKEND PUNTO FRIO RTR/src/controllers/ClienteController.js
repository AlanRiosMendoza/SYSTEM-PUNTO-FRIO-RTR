import ClienteSchema from '../models/Cliente.js'
import {
  validarCamposVacios,
  validarCedulaUnica,
  validarCorreoElectronico,
  validarCorreoExistente,
  validarLongitudNumero,
  validarObjectId,
  validarSiExisten,
} from '../validators/ComunValidators.js'

export const crearCliente = async (req, res) => {
  const camposError = validarCamposVacios(req.body)
  if (camposError) return res.status(400).json({ msg: camposError.message })

  const cedulaError = await validarCedulaUnica(req.body.cedula, 'cliente')
  if (cedulaError) return res.status(400).json({ msg: cedulaError.message })

  const correoError = validarCorreoElectronico(req.body.correo)
  if (correoError) return res.status(400).json({ msg: correoError.message })

  const correoUnicoError = await validarCorreoExistente(req.body.correo)
  if (correoUnicoError)
    return res.status(400).json({ msg: correoUnicoError.message })

  const telefonoError = validarLongitudNumero(req.body.telefono, 10, 'telefono')
  if (telefonoError) return res.status(400).json({ msg: telefonoError.message })

  const nuevoCliente = new ClienteSchema(req.body)

  nuevoCliente.save()

  res.status(201).json({ msg: 'Cliente creado' })
}

export const obtenerClientes = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10
  const skip = (pagina - 1) * limite

  const cedula = req.query.cedula

  const filtro = {}

  if (cedula) {
    filtro.cedula = { $regex: cedula, $options: 'i' }
  }

  const clientes = await ClienteSchema.find(filtro)
    .skip(skip)
    .limit(limite)
    .select('_id cedula nombre apellido correo telefono direccion')

  const ExistenciaError = validarSiExisten(clientes, 'clientes')
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  res.json(clientes)
}

export const obtenerCliente = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const cliente = await ClienteSchema.findById(req.params.id).select(
    '_id cedula nombre apellido correo telefono direccion',
  )

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

  if (req.body.correo) {
    const correoError = validarCorreoElectronico(req.body.correo)
    if (correoError) return res.status(400).json({ msg: correoError.message })

    const correoUnicoError = await validarCorreoExistente(req.body.correo)
    if (correoUnicoError)
      return res.status(400).json({ msg: correoUnicoError.message })

    cliente.correo = req.body.correo
  }

  const camposVaciosError = validarCamposVacios(req.body)
  if (camposVaciosError)
    return res.status(400).json({ msg: camposVaciosError.message })

  const cedulaError = validarLongitudNumero(req.body.cedula, 10, 'cédula')
  if (cedulaError) return res.status(400).json({ msg: cedulaError.message })

  const telefonoError = validarLongitudNumero(req.body.telefono, 10, 'telefono')
  if (telefonoError) return res.status(400).json({ msg: telefonoError.message })

  cliente.cedula = req.body.cedula
  cliente.nombre = req.body.nombre
  cliente.apellido = req.body.apellido
  cliente.telefono = req.body.telefono
  cliente.direccion = req.body.direccion

  await cliente.save()

  res.status(200).json({ msg: 'Cliente actualizado' })
}
