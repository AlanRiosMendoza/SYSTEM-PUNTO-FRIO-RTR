import { Router } from 'express'
import {
  crearCliente,
  obtenerClientes,
  obtenerCliente,
  actualizarCliente,
  desactivarCliente,
  activarCliente,
  obtenerClientesDesactivados,
} from '../controllers/ClienteController.js'
import {
  verificarAutenticacion,
  verificarCajero,
} from '../middlewares/autenticacion.js'

const router = Router()

router.post('/cliente', verificarCajero, crearCliente)
router.get('/clientes', verificarAutenticacion, obtenerClientes)
router.get('/cliente/:id', verificarCajero, obtenerCliente)
router.put('/cliente/:id', verificarCajero, actualizarCliente)
router.patch(
  '/cliente/desactivar/:id',
  verificarAutenticacion,
  desactivarCliente,
)
router.patch('/cliente/activar/:id', verificarAutenticacion, activarCliente)
router.get(
  '/clientes/desactivados',
  verificarAutenticacion,
  obtenerClientesDesactivados,
)

export default router
