import { Router } from 'express'

import {
  crearVenta,
  obtenerVentas,
  obtenerVenta,
} from '../controllers/VentaController.js'
import {
  verificarAutenticacion,
  verificarCajero,
} from '../middlewares/autenticacion.js'

const router = Router()

router.post('/venta', verificarCajero, crearVenta)

router.get('/ventas', verificarAutenticacion, obtenerVentas)

router.get('/venta/:id', verificarAutenticacion, obtenerVenta)

export default router
