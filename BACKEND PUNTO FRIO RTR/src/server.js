import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload'

import routerUsuario from './routers/Usuario.routes.js'
import routerCategoria from './routers/Categoria.routes.js'
import routerProducto from './routers/Producto.routes.js'

const app = express()
dotenv.config()

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads',
  }),
)

// Configuraciones
app.set('port', process.env.PORT || 3000)
app.use(cors())

// Middlewares
app.use(express.json())

// Rutas
app.get('/', (req, res) => res.send('Servidor de Punto Frio RTR'))
app.get('/api/v1', (req, res) => res.send('Servidor de Punto Frio RTR'))
app.use('/api/v1', routerUsuario)
app.use('/api/v1', routerCategoria)
app.use('/api/v1', routerProducto)

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send('Page not found'))

export default app
