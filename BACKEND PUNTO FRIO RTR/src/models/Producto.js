import { Schema, model } from 'mongoose'

const productoSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    categoria_id: { type: Schema.Types.ObjectId, ref: 'Categoria' },
    precio: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    retornable: { type: Boolean, required: true },
    activo: { type: Boolean, trim: true, default: true },
  },
  {
    timestamps: true,
  },
)

export default model('Producto', productoSchema)
