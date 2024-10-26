import { Schema, model } from 'mongoose'

const detalleInventarioSchema = new Schema({
  producto_id: { type: Schema.Types.ObjectId, ref: 'Producto' },
  cantidad: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  descripcion: { type: String },
  tipo_movimiento: { type: String, required: true },
  venta_id: { type: Schema.Types.ObjectId, ref: 'Venta' },
})

export default model('DetalleInventario', detalleInventarioSchema)
