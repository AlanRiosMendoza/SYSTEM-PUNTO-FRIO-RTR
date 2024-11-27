import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import routerUsuario from './routes/Usuario.routes.js'
import routerCategoria from './routes/Categoria.routes.js'
import routerProducto from './routes/Producto.routes.js'
import routerCliente from './routes/Cliente.routes.js'
import routerVenta from './routes/Venta.routes.js'
import routerPrestamoEnvase from './routes/PrestamoEnvase.routes.js'
import routerDetalleInventario from './routes/DetalleInventario.routes.js'

const app = express()
dotenv.config()

// Configuraciones
app.set('port', process.env.PORT || 3000)
app.use(cors())

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.get('/', (req, res) => res.send('Servidor de Punto Frio RTR'))
app.get('/api/v1', (req, res) => res.send('Servidor de Punto Frio RTR'))
app.use('/api/v1', routerUsuario)
app.use('/api/v1', routerCategoria)
app.use('/api/v1', routerProducto)
app.use('/api/v1', routerCliente)
app.use('/api/v1', routerVenta)
app.use('/api/v1', routerPrestamoEnvase)
app.use('/api/v1', routerDetalleInventario)

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send('Page not found'))

export default app
