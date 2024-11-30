import { Router } from 'express'

import {
  crearVenta,
  obtenerVentas,
  obtenerVenta,
  obtenerVentasPorFecha,
} from '../controllers/VentaController.js'
import {
  verificarAutenticacion,
  verificarCajero,
} from '../middlewares/autenticacion.js'

const router = Router()

router.post('/venta', verificarCajero, crearVenta)
router.get('/ventas', verificarAutenticacion, obtenerVentas)
router.get('/ventas/informe', verificarAutenticacion, obtenerVentasPorFecha)
router.get('/venta/:id', verificarAutenticacion, obtenerVenta)

export default router
