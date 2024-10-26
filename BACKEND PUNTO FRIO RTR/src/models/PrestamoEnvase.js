import { Schema, model } from 'mongoose'

const prestamoEnvaseSchema = new Schema({
  cliente_id: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
  prestamo: { type: String, required: true },
  deposito: { type: String, required: true },
  fecha_prestamo: { type: Date, default: Date.now },
  fecha_devuelto: { type: Date, default: null },
  devuelto: { type: Boolean, default: false },
})

export default model('PrestamoEnvase', prestamoEnvaseSchema)
