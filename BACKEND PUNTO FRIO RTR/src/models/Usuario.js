import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new Schema(
  {
    cedula: { type: String, required: true, trim: true, index: true },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    telefono: { type: String, default: null, trim: true },
    correo: { type: String, required: true, trim: true },
    contrasenia: { type: String, required: true, trim: true },
    rol: {
      type: String,
      trim: true,
      enum: ['administrador', 'cajero'],
      default: 'cajero',
    },
    fechaUltimoAcceso: { type: Date, default: null },
    activo: { type: Boolean, default: true },
    token: { type: String, default: null },
  },
  {
    timestamps: true,
  },
)
usuarioSchema.methods.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10)
  const passwordEncrypt = await bcrypt.hash(password, salt)
  return passwordEncrypt
}

usuarioSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.contrasenia)
}

usuarioSchema.methods.crearToken = function () {
  const tokenGenerado = (this.token = Math.random().toString(36).slice(2))
  return tokenGenerado
}

export default model('Usuario', usuarioSchema)
