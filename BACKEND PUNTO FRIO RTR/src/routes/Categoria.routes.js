import { Router } from 'express'
import {
  activarCategoria,
  actualizarCategoria,
  crearCategoria,
  desactivarCategoria,
  obtenerCategoria,
  obtenerCategorias,
  obtenerCategoriasDesactivadas,
} from '../controllers/CategoriaController.js'
import { verificarAdministrador } from '../middlewares/autenticacion.js'

const router = Router()

router.post('/categoria', verificarAdministrador, crearCategoria)
router.get('/categorias', obtenerCategorias)
router.get('/categoria/:id', obtenerCategoria)
router.put('/categoria/:id', verificarAdministrador, actualizarCategoria)
router.patch('/categoria/:id', verificarAdministrador, desactivarCategoria)
router.patch('/categoria/activar/:id', verificarAdministrador, activarCategoria)
router.get('/categorias/desactivadas', obtenerCategoriasDesactivadas)

export default router
