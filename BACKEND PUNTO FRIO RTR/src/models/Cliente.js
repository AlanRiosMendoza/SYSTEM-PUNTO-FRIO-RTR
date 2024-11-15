import { Schema, model } from 'mongoose'

const clienteSchema = new Schema(
  {
    cedula: { type: String, required: true, unique: true },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    correo: { type: String, required: true, trim: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
)

export default model('Cliente', clienteSchema)
