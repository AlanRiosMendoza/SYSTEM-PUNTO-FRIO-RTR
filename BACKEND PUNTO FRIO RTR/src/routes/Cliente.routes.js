import { Router } from 'express'
import {
  crearCliente,
  obtenerClientes,
  obtenerCliente,
  actualizarCliente,
  desactivarCliente,
  activarCliente,
} from '../controllers/ClienteController.js'
import {
  verificarAutenticacion,
  verificarCajero,
} from '../middlewares/autenticacion.js'

const router = Router()

router.post('/cliente', verificarCajero, crearCliente)
router.get('/clientes', verificarAutenticacion, obtenerClientes)
router.get('/cliente/:id', verificarAutenticacion, obtenerCliente)
router.put('/cliente/:id', verificarCajero, actualizarCliente)
router.patch('/cliente/:id', verificarCajero, desactivarCliente)
router.patch('/cliente/activar/:id', verificarCajero, activarCliente)

export default router
