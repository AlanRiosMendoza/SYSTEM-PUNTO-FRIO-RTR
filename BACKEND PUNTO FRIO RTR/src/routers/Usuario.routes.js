import { Router } from 'express'
import {
  registro,
  login,
  confirmar,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  recuperarPassword,
  verificarToken,
  nuevoPassword,
  perfil,
  actualizarPassword,
  desactivarUsuario,
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

router.put('/veterinario/actualizar-password', actualizarPassword)

router.patch('/desactivar-usuario/:id', desactivarUsuario)

export default router
