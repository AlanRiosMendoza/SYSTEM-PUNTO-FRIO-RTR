import { Router } from 'express'
import { crearDetalleInventario } from '../controllers/DetalleInventarioController'

const router = Router()

router.get('/detalle-inventario', crearDetalleInventario)

export default router
