import mongoose from 'mongoose'
import moment from 'moment-timezone'
import VentaSchema from '../models/Venta.js'
import DetalleVentaSchema from '../models/DetalleVenta.js'
import ProductoSchema from '../models/Producto.js'
import DetalleInventarioSchema from '../models/DetalleInventario.js'
import {
  validarObjectId,
  validarSiExisten,
} from '../validators/ComunValidators.js'

export const crearVenta = async (req, res) => {
  const { cliente_id, productos } = req.body
  const { _id: usuario_id } = req.UsuarioSchema

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    let total = 0

    for (const prod of productos) {
      const producto = await ProductoSchema.findById(prod.producto_id).session(
        session,
      )

      if (!producto) {
        return res
          .status(404)
          .json({ msg: `Producto con ID ${prod.producto_id} no encontrado` })
      }

      if (producto.stock < prod.cantidad) {
        return res.status(400).json({
          msg: `Stock insuficiente para el producto ${producto.nombre}`,
        })
      }

      total += prod.cantidad * producto.precio
    }

    const venta = new VentaSchema({
      cliente_id,
      usuario_id,
      total,
    })

    await venta.save({ session })

    for (const prod of productos) {
      const producto = await ProductoSchema.findById(prod.producto_id).session(
        session,
      )

      const detalleVenta = new DetalleVentaSchema({
        venta_id: venta._id,
        producto_id: prod.producto_id,
        cantidad: prod.cantidad,
        precio_unitario: producto.precio,
        total: prod.cantidad * producto.precio,
      })

      await detalleVenta.save({ session })

      producto.stock -= prod.cantidad
      await producto.save({ session })

      const detalleInventario = new DetalleInventarioSchema({
        usuario_id: usuario_id,
        producto_id: prod.producto_id,
        cantidad: prod.cantidad,
        tipo_movimiento: 'Salida',
        venta_id: venta._id,
        descripcion: 'Venta de producto',
      })

      await detalleInventario.save({ session })
    }

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({ msg: 'Venta creada exitosamente' })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    res.status(404).json({ msg: error.message })
  }
}

export const obtenerVentas = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10
  const skip = (pagina - 1) * limite

  const ventas = await VentaSchema.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limite)
    .populate('usuario_id', 'nombre apellido')
    .populate('cliente_id', 'nombre apellido')
    .select('_id total fecha')

  const ventasObjeto = ventas.map((venta) => {
    const fechaEcuador = moment(venta.fecha)
      .tz('America/Guayaquil')
      .format('YYYY-MM-DD HH:mm:ss')
    return {
      ...venta.toObject(),
      fecha: fechaEcuador,
    }
  })

  res.status(200).json(ventasObjeto)
}

export const obtenerVenta = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const venta = await VentaSchema.findById(req.params.id)
    .populate('usuario_id', 'nombre apellido')
    .populate('cliente_id', 'nombre apellido')
    .select('_id total fecha')

  const ExistenciaError = validarSiExisten(venta, 'ventas')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `Venta con ID ${req.params.id} no encontrada` })

  const detallesVenta = await DetalleVentaSchema.find({ venta_id: venta._id })
    .populate('producto_id', 'nombre precio_unitario')
    .lean()

  const ventaObjeto = venta.toObject()
  ventaObjeto.fecha = moment(venta.fecha)
    .tz('America/Guayaquil')
    .format('YYYY-MM-DD HH:mm:ss')
  ventaObjeto.detalles = detallesVenta

  res.status(200).json(ventaObjeto)
}

export const obtenerVentasPorFecha = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ msg: 'Los campos son requeridos' })
  }

  const fechaInicioUTC = moment
    .tz(fechaInicio, 'YYYY-MM-DD', 'America/Guayaquil')
    .startOf('day')
    .utc()
    .toDate()

  const fechaFinUTC = moment
    .tz(fechaFin, 'YYYY-MM-DD', 'America/Guayaquil')
    .endOf('day')
    .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
    .utc()
    .toDate()

  if (fechaInicio > fechaFin) {
    return res.status(400).json({
      msg: 'La fecha de inicio no puede ser mayor a la fecha de fin',
    })
  }

  if (fechaInicio > new Date() || fechaFin > new Date()) {
    return res.status(400).json({ msg: 'Las fechas no pueden ser futuras' })
  }

  let query = {
    fecha: { $gte: fechaInicioUTC, $lte: fechaFinUTC },
  }

  if (req.UsuarioSchema.rol === 'administrador') {
    const ventas = await VentaSchema.find(query)
      .populate('usuario_id', 'nombre apellido')
      .populate('cliente_id', 'nombre apellido')
      .select('_id total fecha')

    if (ventas.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron ventas' })
    }

    const ventasObjeto = ventas.map((venta) => {
      const fechaEcuador = moment(venta.fecha)
        .tz('America/Guayaquil')
        .format('YYYY-MM-DD HH:mm:ss')
      return {
        ...venta.toObject(),
        fecha: fechaEcuador,
      }
    })

    return res.status(200).json(ventas)
  }

  if (req.UsuarioSchema.rol === 'cajero') {
    query.usuario_id = req.UsuarioSchema._id
    const ventas = await VentaSchema.find(query)
      .populate('usuario_id', 'nombre apellido')
      .populate('cliente_id', 'nombre apellido')
      .select('_id total fecha')

    if (ventas.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron ventas' })
    }
    const ventasObjeto = ventas.map((venta) => {
      const fechaEcuador = moment(venta.fecha)
        .tz('America/Guayaquil')
        .format('YYYY-MM-DD HH:mm:ss')
      return {
        ...venta.toObject(),
        fecha: fechaEcuador,
      }
    })

    return res.status(200).json(ventasObjeto)
  }
}
