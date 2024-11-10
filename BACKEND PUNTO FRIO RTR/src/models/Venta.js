import { Schema, model } from 'mongoose'

const ventaSchema = new Schema({
  cliente_id: { type: Schema.Types.ObjectId, ref: 'Cliente' },
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  total: { type: Number },
  fecha: { type: Date, default: Date.now },
})

export default model('Venta', ventaSchema)
