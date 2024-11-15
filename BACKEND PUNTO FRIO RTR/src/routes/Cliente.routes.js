import { Router } from 'express'
import {
  crearCliente,
  obtenerClientes,
  obtenerCliente,
  actualizarCliente,
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

export default router
