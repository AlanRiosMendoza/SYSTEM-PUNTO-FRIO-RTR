import React, { useState, useEffect } from "react";
import axios from "axios";
import Mensaje from "./Alertas/Mensaje";

const PuntoDeVenta = () => {
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [total, setTotal] = useState(0);
  const [clienteId, setClienteId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState(""); // Estado para el filtro de búsqueda

  // Cargar productos desde el backend
useEffect(() => {
  const cargarProductos = async () => {
    const token = localStorage.getItem("token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/productos`;
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const respuesta = await axios.get(url, options);
      // Filtrar solo los productos activos
      const productosActivos = respuesta.data.filter((producto) => producto.activo);
      setProductosDisponibles(productosActivos);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  cargarProductos();
}, []);

  // Filtrar los productos según la búsqueda
  const productosFiltrados = productosDisponibles.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Agregar producto a la venta
  const agregarProducto = () => {
    const producto = productosDisponibles.find(
      (p) => p._id === productoSeleccionado
    );

    if (!producto) {
      setMensaje("Producto no encontrado");
      setTimeout(() => {
        setMensaje("");
    }, 3000);
      return;
    }

    if (producto.stock < cantidad) {
      setMensaje(`Stock insuficiente para ${producto.nombre}. Quedan ${producto.stock} unidades.`);
      return;
    }

    const nuevoProducto = {
      producto_id: producto._id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
      subtotal: producto.precio * cantidad,
    };

    setProductosSeleccionados([...productosSeleccionados, nuevoProducto]);
    setTotal(total + nuevoProducto.subtotal);

    // Resetear campos
    setProductoSeleccionado("");
    setCantidad(1);
    setMensaje("");
    setBusqueda(""); // Limpiar la búsqueda después de agregar el producto
  };

  // Eliminar producto
  const eliminarProducto = (productoId) => {
    const productoAEliminar = productosSeleccionados.find(
      (p) => p.producto_id === productoId
    );

    setProductosSeleccionados(
      productosSeleccionados.filter((p) => p.producto_id !== productoId)
    );
    setTotal(total - productoAEliminar.subtotal);
  };

  // Finalizar la venta
  const finalizarVenta = async () => {
    if (!clienteId || productosSeleccionados.length === 0) {
      setMensaje("Debe seleccionar un cliente y agregar al menos un producto.");
      return;
    }

    const token = localStorage.getItem("token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/venta`;
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const ventaData = {
      cliente_id: clienteId || null,
      productos: productosSeleccionados.map((p) => ({
        producto_id: p.producto_id,
        cantidad: p.cantidad,
      })),
    };

    try {
      await axios.post(url, ventaData, options);
      alert("Venta realizada con éxito.");
      setProductosSeleccionados([]);
      setTotal(0);
      setClienteId("");
      setMensaje(""); // Limpiar el mensaje
    } catch (error) {
      console.error("Error al realizar la venta:", error);
      setMensaje("Hubo un error al procesar la venta.");
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Punto de Venta</h2>

        {/* Mostrar mensaje */}
        {mensaje && <Mensaje tipo={false}>{mensaje}</Mensaje>}

        {/* Barra de búsqueda para seleccionar producto */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar Producto:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Escribe el nombre del producto..."
              className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            <input
              type="text"
              min="1"
              value={cantidad}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  setCantidad(Number(e.target.value));
                }
              }}
              className="w-20 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              onClick={agregarProducto}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Mostrar la lista de productos solo si hay texto en la barra de búsqueda */}
        {busqueda && productosFiltrados.length > 0 && (
          <div className="mb-6">
            <ul className="bg-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto">
              {productosFiltrados.map((producto) => (
                <li
                  key={producto._id}
                  onClick={() => {
                    setProductoSeleccionado(producto._id);
                    setBusqueda(producto.nombre); // Autocompletar en el input
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                >
                  {producto.nombre} - ${producto.precio} (Stock: {producto.stock})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lista de Productos Seleccionados */}
        <table className="w-full text-left table-auto border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border">Producto</th>
              <th className="px-4 py-2 border">Cantidad</th>
              <th className="px-4 py-2 border">Precio Unitario</th>
              <th className="px-4 py-2 border">Subtotal</th>
              <th className="px-4 py-2 border">Acción</th>
            </tr>
          </thead>
          <tbody>
            {productosSeleccionados.map((p) => (
              <tr key={p.producto_id}>
                <td className="px-4 py-2 border">{p.nombre}</td>
                <td className="px-4 py-2 border">{p.cantidad}</td>
                <td className="px-4 py-2 border">${p.precio.toFixed(2)}</td>
                <td className="px-4 py-2 border">${p.subtotal.toFixed(2)}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => eliminarProducto(p.producto_id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total y Finalización */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-700">Total: ${total.toFixed(2)}</h3>
          <button
            onClick={finalizarVenta}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default PuntoDeVenta;