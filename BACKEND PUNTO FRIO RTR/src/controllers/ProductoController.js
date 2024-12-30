import ProductoSchema from '../models/Producto.js'

import {
  validarObjectId,
  validarNombreUnico,
  validarSiExisten,
  validarDesactivado,
  validarActivado,
  validarCamposVacios,
} from '../validators/ComunValidators.js'

export const crearProducto = async (req, res) => {
  const camposError = validarCamposVacios(req.body)
  if (camposError) return res.status(400).json({ msg: camposError.message })

  const nombreError = await validarNombreUnico(req.body.nombre, 'producto')
  if (nombreError) return res.status(400).json({ msg: nombreError.message })

  const nuevoProducto = new ProductoSchema(req.body)
  await nuevoProducto.save()

  res.status(201).json({ msg: 'Producto creado' })
}

export const obtenerProductos = async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1
  const limite = parseInt(req.query.limite) || 10
  const skip = (pagina - 1) * limite

  const estado = req.query.estado
  const nombre = req.query.nombre

  const filtro = {}

  if (estado !== undefined) {
    filtro.activo = estado
  }

  if (nombre) {
    filtro.nombre = { $regex: nombre, $options: 'i' }
  }

  const productos = await ProductoSchema.find(filtro)
    .skip(skip)
    .limit(limite)
    .select('_id nombre descripcion precio activo retornable stock')
    .populate('categoria_id', 'nombre')

  const ExistenciaError = validarSiExisten(productos, 'productos')
  if (ExistenciaError)
    return res.status(404).json({ msg: ExistenciaError.message })

  res.json(productos)
}

export const obtenerProducto = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const producto = await ProductoSchema.findById(req.params.id)
    .select('_id nombre descripcion precio imagen retornable')
    .populate('categoria_id', 'nombre')

  const ExistenciaError = validarSiExisten(producto, 'productos')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró ese producto con ese ID: ${req.params.id}` })

  res.status(200).json(producto)
}

export const actualizarProducto = async (req, res) => {
  const idError = validarObjectId(req.params.id);
  if (idError) return res.status(400).json({ msg: idError.message });

  const producto = await ProductoSchema.findById(req.params.id);

  const ExistenciaError = validarSiExisten(producto, 'productos');
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró ese producto con ese ID: ${req.params.id}` });

  if (req.body.nombre && req.body.nombre !== producto.nombre) {
    const nombreError = await validarNombreUnico(
      req.body.nombre,
      'producto',
      req.params.id,
    );
    if (nombreError) return res.status(400).json({ msg: nombreError.message });
    producto.nombre = req.body.nombre;
  }

  if (req.body.categoria_id && req.body.categoria_id !== producto.categoria_id)
    producto.categoria_id = req.body.categoria_id;
  if (req.body.precio && req.body.precio !== producto.precio)
    producto.precio = req.body.precio;

  // Aquí está la corrección:
  if (req.body.hasOwnProperty('retornable') && req.body.retornable !== producto.retornable) {
    producto.retornable = req.body.retornable;
  }

  await producto.save();

  res.status(200).json({ msg: 'Producto actualizado' });
};


export const desactivarProducto = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const producto = await ProductoSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(producto, 'productos')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró ese producto con ese ID: ${req.params.id}` })

  const desactivadoError = validarDesactivado(producto, 'producto')
  if (desactivadoError)
    return res.status(404).json({ msg: desactivadoError.message })

  await ProductoSchema.findByIdAndUpdate(req.params.id, { activo: false })

  res.status(200).json({ msg: 'Producto desactivado' })
}

export const activarProducto = async (req, res) => {
  const idError = validarObjectId(req.params.id)
  if (idError) return res.status(400).json({ msg: idError.message })

  const producto = await ProductoSchema.findById(req.params.id)

  const ExistenciaError = validarSiExisten(producto, 'productos')
  if (ExistenciaError)
    return res
      .status(404)
      .json({ msg: `No se encontró ese producto con ese ID: ${req.params.id}` })

  const activadoError = validarActivado(producto, 'producto')
  if (activadoError) return res.status(404).json({ msg: activadoError.message })

  await ProductoSchema.findByIdAndUpdate(req.params.id, { activo: true })

  res.status(200).json({ msg: 'Producto activado' })
}
