import { Schema, model } from 'mongoose'

const ventaSchema = new Schema({
  cliente_cedula: { type: Number, ref: 'Cliente' },
  Usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  total: { type: Number },
  fecha: { type: Date, default: Date.now },
})

export default model('Venta', ventaSchema)
