import { Router } from 'express'
import {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  desactivarProducto,
  activarProducto,
} from '../controllers/ProductoController.js'
import {
  verificarAdministrador,
  verificarAutenticacion,
} from '../middlewares/autenticacion.js'

const router = Router()

router.post('/producto', verificarAdministrador, crearProducto)
router.get('/productos', verificarAutenticacion, obtenerProductos)
router.get('/producto/:id', verificarAutenticacion, obtenerProducto)
router.put('/producto/:id', verificarAdministrador, actualizarProducto)
router.patch('/producto/:id', verificarAdministrador, desactivarProducto)
router.patch('/producto/activar/:id', verificarAdministrador, activarProducto)

export default router
