import mongoose from 'mongoose'
import VentaSchema from '../models/Venta'
import DetalleVentaSchema from '../models/DetalleVenta'
import ProductoSchema from '../models/Producto'

export const crearVenta = async (req, res) => {
  const { cedulaCliente, productos } = req.body
  const { usuarioId } = req.UsuarioSchema

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    for (const prod of productos) {
      const producto = await ProductoSchema.findById(prod.productoId).session(
        session,
      )

      if (!producto) {
        return res
          .status(404)
          .json({ msg: `Producto con ID ${prod.productoId} no encontrado` })
      }

      if (producto.stock < prod.cantidad) {
        return res.status(400).json({
          msg: `Stock insuficiente para el producto ${producto.nombre}`,
        })
      }
    }

    let total = 0
    productos.forEach((prod) => {
      total += prod.cantidad * prod.precioUnitario
    })

    const venta = new VentaSchema({
      cedulaCliente,
      usuarioId,
      total,
    })

    await venta.save({ session })

    for (const prod of productos) {
      const producto = await ProductoSchema.findById(prod.productoId).session(
        session,
      )

      const detalleVenta = new DetalleVentaSchema({
        ventaId: venta._id,
        productoId: prod.productoId,
        cantidad: prod.cantidad,
        precioUnitario: prod.precioUnitario,
        total: prod.cantidad * prod.precioUnitario,
      })

      await detalleVenta.save({ session })

      producto.stock -= prod.cantidad
      await producto.save({ session })
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
  const ventas = await VentaSchema.find()
  res.status(200).json(ventas)
}

export const obtenerVenta = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const venta = await VentaSchema.findById(req.params.id)
    .populate('Usuario_id', 'nombre apellido')
    .populate('cliente_cedula', 'nombre apellido')
    .lean()

  const ExistenciaError = validarSiExisten(venta, 'ventas')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `Venta con ID ${req.params.id} no encontrada` })

  const detallesVenta = await DetalleVentaSchema.find({ venta_id: venta._id })
    .populate('producto_id', 'nombre precio_unitario') // Poblar los productos
    .lean()

  venta.detalles = detallesVenta

  res.status(200).json(venta)
}
