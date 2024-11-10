import { Router } from 'express'
import {
  crearDetalleInventario,
  obtenerDetalleInventario,
  obtenerDetalleInventarioPorId,
} from '../controllers/DetalleInventarioController.js'
import { verificarAdministrador } from '../middlewares/autenticacion.js'

const router = Router()

router.post('/inventario', verificarAdministrador, crearDetalleInventario)
router.get('/inventarios', verificarAdministrador, obtenerDetalleInventario)
router.get(
  '/inventario/:id',
  verificarAdministrador,
  obtenerDetalleInventarioPorId,
)

export default router
