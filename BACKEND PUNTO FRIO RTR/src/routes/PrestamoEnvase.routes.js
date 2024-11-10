import { Router } from 'express'
import { verificarCajero } from '../middlewares/autenticacion.js'
import {
  crearPrestamoEnvase,
  obtenerPrestamosEnvase,
  obtenerPrestamoEnvase,
  devolverPrestamoEnvase,
} from '../controllers/PrestamoEnvaseController.js'

const router = Router()

router.post('/envase', verificarCajero, crearPrestamoEnvase)

router.get('/envases', verificarCajero, obtenerPrestamosEnvase)

router.get('/envase/:id', verificarCajero, obtenerPrestamoEnvase)

router.put('/envase/:id', verificarCajero, devolverPrestamoEnvase)

export default router
