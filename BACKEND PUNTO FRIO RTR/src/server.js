import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerUsuario from './routers/Usuario.routes.js'

const app = express()
dotenv.config()

// Configuraciones
app.set('port', process.env.PORT || 3000)
app.use(cors())

// Middlewares
app.use(express.json())

// Rutas
app.use('/api/v1', routerUsuario)

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send('Page not found'))

export default app
