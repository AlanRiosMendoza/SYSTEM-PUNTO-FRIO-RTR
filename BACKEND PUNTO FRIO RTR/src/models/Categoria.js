import { Schema, model } from 'mongoose'

const categoriaSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, unique: true },
    descripcion: { type: String, required: true, trim: true },
    activo: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

export default model('Categoria', categoriaSchema)
