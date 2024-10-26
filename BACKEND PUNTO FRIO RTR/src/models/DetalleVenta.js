import { Schema, model } from 'mongoose'

const detalleVentaSchema = new Schema({
  venta_id: { type: Schema.Types.ObjectId, ref: 'Venta' },
  producto_id: { type: Schema.Types.ObjectId, ref: 'Producto' },
  cantidad: { type: Number, required: true },
  precio_unitario: { type: Number, required: true },
  total: { type: Number, required: true },
})

export default model('DetalleVenta', detalleVentaSchema)
