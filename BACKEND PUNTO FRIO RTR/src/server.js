import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
import routerUsuario from './routers/Usuario.routes.js'
import routerCategoria from './routers/Categoria.routes.js'

const app = express()
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configuraciones
app.set('port', process.env.PORT || 3000)
app.use(cors())

// Middlewares
app.use(express.json())

// Rutas
app.get('/', (req, res) => res.send('Servidor de Punto Frio RTR'))
app.use('/api/v1', routerUsuario)
app.use('/api/v1', routerCategoria)

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send('Page not found'))

export default app
