import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerUsuario from './routers/Usuario.routes.js'

const app = express()
dotenv.config()

// Configuraciones
app.set('port', process.env.port || 3000)
app.use(cors())

// Middlewares
app.use(express.json())

// Rutas
app.use('/api', routerUsuario)

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send('Endpoint no encontrado - 404'))

export default app
