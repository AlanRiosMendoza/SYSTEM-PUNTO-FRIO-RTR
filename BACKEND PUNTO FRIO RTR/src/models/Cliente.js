import { Schema, model } from 'mongoose'

const clienteSchema = new Schema({
  cedula: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  correo: { type: String, required: true, trim: true },
  telefono: { type: Number, required: true },
  direccion: { type: String, required: true, trim: true },
  activo: { type: Boolean, trim: true, default: true },
})

export default model('Cliente', clienteSchema)
