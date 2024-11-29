import { Router } from 'express'
import {
  registro,
  login,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarPerfil,
  recuperarPassword,
  nuevoPassword,
  perfil,
  actualizarPassword,
  desactivarUsuario,
  cambiarRole,
  activarUsuario,
} from '../controllers/UsuarioController.js'
import {
  verificarAdministrador,
  verificarAutenticacion,
} from '../middlewares/autenticacion.js'

const router = Router()

router.post('/registro', verificarAdministrador, registro)
router.post('/login', login)
router.get('/usuarios', verificarAdministrador, obtenerUsuarios)
router.get('/usuario/:id', verificarAdministrador, obtenerUsuario)
router.get('/perfil', verificarAutenticacion, perfil)
router.put('/perfil', verificarAutenticacion, actualizarPerfil)
router.post('/recuperar-password', recuperarPassword)
router.post('/nuevo-password/:token', nuevoPassword)
router.put('/actualizar-password', verificarAutenticacion, actualizarPassword)
router.put('/cambiar-role/:id', verificarAdministrador, cambiarRole)
router.patch(
  '/desactivar-usuario/:id',
  verificarAdministrador,
  desactivarUsuario,
)

router.patch('/activar-usuario/:id', verificarAdministrador, activarUsuario)

export default router
