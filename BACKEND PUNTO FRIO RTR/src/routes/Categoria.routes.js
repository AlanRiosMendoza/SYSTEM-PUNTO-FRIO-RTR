import { Router } from 'express'
import {
  activarCategoria,
  actualizarCategoria,
  crearCategoria,
  desactivarCategoria,
  obtenerCategoria,
  obtenerCategorias,
} from '../controllers/CategoriaController.js'
import { verificarAdministrador } from '../middlewares/autenticacion.js'

const router = Router()

router.post('/categoria', verificarAdministrador, crearCategoria)
router.get('/categorias', verificarAdministrador, obtenerCategorias)
router.get('/categoria/:id', verificarAdministrador, obtenerCategoria)
router.put('/categoria/:id', verificarAdministrador, actualizarCategoria)
router.patch('/categoria/:id', verificarAdministrador, desactivarCategoria)
router.patch('/categoria/activar/:id', verificarAdministrador, activarCategoria)

export default router
