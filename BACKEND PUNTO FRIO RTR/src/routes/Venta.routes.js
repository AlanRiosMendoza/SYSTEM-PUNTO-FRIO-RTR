import { Router } from 'express'

import {
  crearVenta,
  obtenerVentas,
  obtenerVenta,
} from '../controllers/VentaController.js'

const router = Router()

router.post('/venta', crearVenta)

router.get('/ventas', obtenerVentas)

router.get('/venta/:id', obtenerVenta)

export default router
