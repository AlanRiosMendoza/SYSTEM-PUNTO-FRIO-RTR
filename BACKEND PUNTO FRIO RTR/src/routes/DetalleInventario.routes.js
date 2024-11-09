import { Router } from 'express'
import { crearDetalleInventario } from '../controllers/DetalleInventarioController.js'

const router = Router()

router.get('/detalle-inventario', crearDetalleInventario)

export default router
