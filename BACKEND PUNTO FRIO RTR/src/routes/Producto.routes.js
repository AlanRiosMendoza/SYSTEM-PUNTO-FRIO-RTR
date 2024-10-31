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

const router = Router()

router.post('/producto', crearProducto)
router.get('/productos', obtenerProductos)
router.get('/producto/:id', obtenerProducto)
router.put('/producto/:id', actualizarProducto)
router.patch('/producto/:id', desactivarProducto)
router.patch('/producto/activar/:id', activarProducto)
router.get('/productos/desactivados', obtenerProductosDesactivados)

export default router
