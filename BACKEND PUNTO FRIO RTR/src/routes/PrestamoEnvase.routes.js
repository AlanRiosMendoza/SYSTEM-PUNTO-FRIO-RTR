import { Router } from 'express'
import { verificarAutenticacion, verificarCajero } from '../middlewares/autenticacion.js'
import {
  crearPrestamoEnvase,
  obtenerPrestamosEnvase,
  obtenerPrestamoEnvase,
  devolverPrestamoEnvase,
} from '../controllers/PrestamoEnvaseController.js'

const router = Router()

router.post('/envase', verificarCajero, crearPrestamoEnvase)
router.get('/envases', verificarAutenticacion, obtenerPrestamosEnvase)
router.get('/envase/:id', verificarAutenticacion, obtenerPrestamoEnvase)
router.put('/envase/:id', verificarCajero, devolverPrestamoEnvase)

export default router
