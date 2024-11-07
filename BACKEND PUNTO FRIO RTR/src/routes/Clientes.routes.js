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

const router = Router()

router.post('/cliente', crearCliente)
router.get('/clientes', obtenerClientes)
router.get('/cliente/:id', obtenerCliente)
router.put('/cliente/:id', actualizarCliente)
router.patch('/cliente/:id', desactivarCliente)
router.patch('/cliente/activar/:id', activarCliente)
router.get('/clientes/desactivados', obtenerClientesDesactivados)

export default router
