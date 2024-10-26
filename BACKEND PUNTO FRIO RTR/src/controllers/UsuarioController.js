export const registro = (req, res) => {
  res.send('POST REGISTRO')
}

export const login = (req, res) => {
  res.send('POST LOGIN')
}

export const confirmar = (req, res) => {
  res.send('POST CONFIRMAR')
}

export const obtenerUsuarios = (req, res) => {
  res.send('GET USUARIOS')
}

export const obtenerUsuario = (req, res) => {
  res.send('GET USUARIO')
}

export const actualizarUsuario = (req, res) => {
  res.send('PUT USUARIO')
}

export const recuperarPassword = (req, res) => {
  res.send('enviar mail')
}

export const verificarToken = (req, res) => {
  res.send('verificar token')
}

export const nuevoPassword = (req, res) => {
  res.send('crear password')
}

export const perfil = (req, res) => {
  res.send('perfil')
}

export const actualizarPassword = (req, res) => {
  res.send('actualizar password')
}

export const desactivarUsuario = (req, res) => {
  res.send('desactivar usuario')
}
