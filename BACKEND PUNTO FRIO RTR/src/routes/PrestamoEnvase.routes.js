import { Router } from 'express'
import { verificarCajero } from '../middlewares/autenticacion.js'
import {
  crearPrestamoEnvase,
  obtenerPrestamosEnvase,
  obtenerPrestamoEnvase,
  devolverPrestamoEnvase,
} from '../controllers/PrestamoEnvaseController.js'

const router = Router()

router.post('/prestamo-envase', verificarCajero, crearPrestamoEnvase)

router.get('/prestamos-envase', verificarCajero, obtenerPrestamosEnvase)

router.get('/prestamo-envase/:id', verificarCajero, obtenerPrestamoEnvase)

router.put(
  '/prestamo-envase/devolver/:id',
  verificarCajero,
  devolverPrestamoEnvase,
)

export default router
