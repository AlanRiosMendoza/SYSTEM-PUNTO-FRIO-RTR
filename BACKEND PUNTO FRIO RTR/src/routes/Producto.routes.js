import { Router } from 'express'
import {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  desactivarProducto,
  activarProducto,
  obtenerProductosDesactivados,
} from '../controllers/ProductoController.js'
import { verificarAdministrador } from '../middlewares/autenticacion.js'

const router = Router()

router.post('/producto', verificarAdministrador, crearProducto)
router.get('/productos', obtenerProductos)
router.get('/producto/:id', obtenerProducto)
router.put('/producto/:id', verificarAdministrador, actualizarProducto)
router.patch('/producto/:id', verificarAdministrador, desactivarProducto)
router.patch('/producto/activar/:id', verificarAdministrador, activarProducto)
router.get('/productos/desactivados', obtenerProductosDesactivados)

export default router
