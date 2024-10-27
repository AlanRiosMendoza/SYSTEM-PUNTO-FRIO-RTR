import { Router } from 'express'
import {
  registro,
  login,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  recuperarPassword,
  verificarToken,
  nuevoPassword,
  perfil,
  actualizarPassword,
  desactivarUsuario,
  cambiarRole,
} from '../controllers/UsuarioController.js'

const router = Router()

router.post('/registro', registro)

router.post('/login', login)

router.get('/usuarios', obtenerUsuarios)

router.get('/usuario/:id', obtenerUsuario)

router.put('/usuario/:id', actualizarUsuario)

router.post('/recuperar-password', recuperarPassword)

router.post('/recuperar-password/:token', verificarToken)

router.post('/nuevo-password/:token', nuevoPassword)

router.get('/perfil', perfil)

router.put('/actualizar-password', actualizarPassword)

router.put('/cambiar-role/:id', cambiarRole)

router.patch('/desactivar-usuario/:id', desactivarUsuario)

export default router
