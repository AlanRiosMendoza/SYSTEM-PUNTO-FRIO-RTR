import { Schema, model } from 'mongoose'

const ventaSchema = new Schema({
  cliente_id: { type: Schema.Types.ObjectId, ref: 'Cliente' },
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  metodo_pago: { type: String, required: true },
})

export default model('Venta', ventaSchema)
