import mongoose from 'mongoose'
import VentaSchema from '../models/Venta.js'
import DetalleVentaSchema from '../models/DetalleVenta.js'
import ProductoSchema from '../models/Producto.js'
import DetalleInventarioSchema from '../models/DetalleInventario.js'

export const crearVenta = async (req, res) => {
  const { cedulaCliente, productos } = req.body
  const { id: usuarioId } = req.UsuarioSchema

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Verificar disponibilidad de stock para cada producto
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

    // Calcular el total de la venta
    let total = 0
    productos.forEach((prod) => {
      total += prod.cantidad * prod.precioUnitario
    })

    // Crear la venta
    const venta = new VentaSchema({
      cedulaCliente,
      usuarioId,
      total,
    })

    await venta.save({ session })

    // Procesar cada producto en la venta
    for (const prod of productos) {
      const producto = await ProductoSchema.findById(prod.productoId).session(
        session,
      )

      // Crear el detalle de venta
      const detalleVenta = new DetalleVentaSchema({
        ventaId: venta._id,
        productoId: prod.productoId,
        cantidad: prod.cantidad,
        precioUnitario: prod.precioUnitario,
        total: prod.cantidad * prod.precioUnitario,
      })

      await detalleVenta.save({ session })

      // Actualizar el stock del producto
      producto.stock -= prod.cantidad
      await producto.save({ session })

      // Registrar el movimiento de inventario como "salida"
      const detalleInventario = new DetalleInventarioSchema({
        usuario_id: usuarioId,
        producto_id: prod.productoId,
        cantidad: prod.cantidad,
        tipo_movimiento: 'salida',
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
