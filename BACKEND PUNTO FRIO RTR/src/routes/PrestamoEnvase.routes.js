import { Router } from 'express'
import { verificarCajero } from '../middlewares/autenticacion.js'
import {
  crearPrestamoEnvase,
  obtenerPrestamoEnvase,
  obtenerPrestamoEnvase,
  devolverPrestamoEnvase,
} from '../controllers/PrestamoEnvaseController.js'

const router = Router()

router.post('/prestamo-envase', verificarCajero, crearPrestamoEnvase)

router.get('/prestamos-envase', verificarCajero, obtenerPrestamoEnvase)

router.get('/prestamo-envase/:id', verificarCajero, obtenerPrestamoEnvase)

router.patch(
  '/prestamo-envase/devolver/:id',
  verificarCajero,
  devolverPrestamoEnvase,
)

export default router
