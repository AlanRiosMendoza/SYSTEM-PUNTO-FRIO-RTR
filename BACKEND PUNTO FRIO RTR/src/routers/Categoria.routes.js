import { Router } from 'express'
import {
  actualizarCategoria,
  crearCategoria,
  desactivarCategoria,
  obtenerCategoria,
  obtenerCategorias,
} from '../controllers/CategoriaController.js'

const router = Router()

router.post('/categoria', crearCategoria)
router.get('/categorias', obtenerCategorias)
router.get('/categoria/:id', obtenerCategoria)
router.put('/categoria/:id', actualizarCategoria)
router.patch('/categoria/:id', desactivarCategoria)

export default router
