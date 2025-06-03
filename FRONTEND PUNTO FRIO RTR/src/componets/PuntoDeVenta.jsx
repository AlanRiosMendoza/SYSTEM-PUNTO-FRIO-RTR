import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Mensaje from "./Alertas/Mensaje";
import CrearCliente from "../componets/Modals/CrearCliente";

const PuntoDeVenta = () => {
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState({});
  const [busqueda, setBusqueda] = useState(""); // Estado para el filtro de búsqueda
  const [mostrarModal, setMostrarModal] = useState(false); // Controla el modal
  
  // Estados para manejar clientes
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Cargar productos desde el backend
  useEffect(() => {
  const cargarProductos = async () => {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/productos?limite=500`;
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
        setMensaje({ texto: "Error al cargar productos disponibles.", tipo: false });
        setTimeout(() => setMensaje(""), 4000);
      }
    };

    cargarProductos();
  }, []);

  // Filtrar los productos según la búsqueda
  const productosFiltrados = useMemo(() => {
    return productosDisponibles.filter((producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
}, [productosDisponibles, busqueda]);

  const buscarCliente = async (cedula) => {
    if (!cedula) {
      setMensaje({ texto: "Por favor, ingrese la cédula del cliente.", tipo: false });
      setTimeout(() => setMensaje(""), 4000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/clientes?cedula=${cedula}`;
      const respuesta = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (respuesta.data && respuesta.data.length > 0) {
        setClienteSeleccionado(respuesta.data[0]);
        setMensaje({ texto: "Cliente encontrado.", tipo: true });
        setTimeout(() => setMensaje(""), 4000);
      } else {
        setMensaje({ texto: "No se encontró el cliente.", tipo: false });
        setTimeout(() => setMensaje(""), 4000);
      }
      setBusquedaCliente("");
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      setMensaje({ texto: "La cédula ingresada no corresponde a ningún cliente.", tipo: false });
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  // Agregar producto a la venta
  const agregarProducto = () => {
    const producto = productosDisponibles.find(
      (p) => p._id === productoSeleccionado
    );

    if (!producto) {
      setMensaje({ texto: "Producto no encontrado.", tipo: false });
      setTimeout(() => setMensaje(""), 4000);
      return;
    }

    if (cantidad <= 0) {
      setMensaje({ texto: "La cantidad debe ser mayor a 0.", tipo: false });
      setTimeout(() => setMensaje(""), 4000);
      return;
    }

    if (producto.stock < cantidad) {
      setMensaje({
        texto: `Stock insuficiente para ${producto.nombre}. Quedan ${producto.stock} unidades.`,
        tipo: false,
      });
      setTimeout(() => setMensaje(""), 4000);
      return;
    }

    const existente = productosSeleccionados.find(
      (p) => p.producto_id === producto._id
    );

    if (existente) {
      // Si el producto ya está en la lista, solo actualiza la cantidad
      existente.cantidad += cantidad;
      existente.subtotal += cantidad * producto.precio;
      setProductosSeleccionados([...productosSeleccionados]);
    } else {
      const nuevoProducto = {
        producto_id: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad,
        subtotal: producto.precio * cantidad,
      };

      setProductosSeleccionados([...productosSeleccionados, nuevoProducto]);
    }

    setTotal(total + cantidad * producto.precio);

    // Resetear campos
    setProductoSeleccionado("");
    setCantidad(1);
    setMensaje({ texto: "Producto agregado correctamente.", tipo: true });
    setTimeout(() => setMensaje(""), 4000);
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
    setMensaje({ texto: "Producto eliminado correctamente.", tipo: true });
    setTimeout(() => setMensaje(""), 4000);
  };

  // Finalizar la venta
  const finalizarVenta = async () => {
    if (!clienteSeleccionado || productosSeleccionados.length === 0) {
      setMensaje({ texto: "Debe seleccionar un cliente y agregar al menos un producto.", tipo: false });
      setTimeout(() => setMensaje(""), 4000);
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
      cliente_id: clienteSeleccionado._id,
      productos: productosSeleccionados.map((p) => ({
        producto_id: p.producto_id,
        cantidad: p.cantidad,
      })),
    };

    try {
      await axios.post(url, ventaData, options);
      setMensaje({ texto: "Venta realizada con éxito.", tipo: true });
      setProductosSeleccionados([]);
      setTotal(0);
      setClienteSeleccionado(null);
      setBusquedaCliente("");
      setTimeout(() => setMensaje(""), 4000);
    } catch (error) {
      console.error("Error al realizar la venta:", error);
      setMensaje({ texto: "Hubo un error al procesar la venta.", tipo: false });
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Punto de Venta</h2>

        {mensaje.texto && <Mensaje tipo={mensaje.tipo}>{mensaje.texto}</Mensaje>}

        {!clienteSeleccionado ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Buscar Cliente</h3>
            <input
              type="text"
              placeholder="Ingrese la cédula del cliente..."
              value={busquedaCliente}
              maxLength="10"
              onChange={(e) => setBusquedaCliente(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            <div className="flex">
              <button
                onClick={() => buscarCliente(busquedaCliente)}
                className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 mb-2 mx-4 rounded-md hover:bg-blue-600 transition"
              >
                Buscar
              </button>
              <button
                onClick={() => setMostrarModal(true)}
                className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 mb-2 mx-4 rounded-md hover:bg-blue-600 transition"
              >
                Crear Cliente
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Cliente Seleccionado</h3>
            <div className="mb-2">
              <p>
                <strong>Nombre:</strong> {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
              </p>
              <p>
                <strong>Cédula:</strong> {clienteSeleccionado.cedula}
              </p>
            </div>
            <div className="flex">
              <button
                onClick={() => setClienteSeleccionado()}
                className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 mb-2 mx-4 rounded-md hover:bg-red-600 transition"
              >
                Cambiar Cliente
              </button>
              <button
                  onClick={() => setMostrarModal(true)}
                  className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 mb-2 mx-4 rounded-md hover:bg-blue-600 transition"
                >
                  Crear Cliente
              </button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-4 sm:p-4 sm:mt-2">
          <label className="block text-xl font-bold mb-4 text-gray-700 sm:text-lg">
            Buscar Producto:
          </label>
          <div className="border px-2 py-1 mr-2">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Escribe el nombre del producto..."
              className="flex-grow px-4 py-2 mx-2 mb-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 sm:text-sm"
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
              className="w-20 px-4 py-2 mx-2 mb-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 sm:text-sm"
            />
            <button
              onClick={agregarProducto}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition sm:text-sm"
            >
              Agregar
            </button>
          </div>
        </div>

        {busqueda && productosFiltrados.length > 0 && (
          <div className="mb-6">
            <ul className="bg-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto">
              {productosFiltrados.map((producto) => (
                <li
                  key={producto._id}
                  onClick={() => {
                    setProductoSeleccionado(producto._id);
                    setBusqueda(producto.nombre); 
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                >
                  {producto.nombre} - ${producto.precio} (Stock: {producto.stock})
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full mt-5 table-auto shadow-lg bg-white">
            <thead className="bg-gray-800 text-slate-400">
              <tr>
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
                  <td className="px-4 py-2 border text-center">{p.nombre}</td>
                  <td className="px-4 py-2 border text-center">{p.cantidad}</td>
                  <td className="px-4 py-2 border text-center">${p.precio.toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">${p.subtotal.toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">
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
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-700">Total: ${total.toFixed(2)}</h3>
          <button
            onClick={finalizarVenta}
            className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Finalizar Venta
          </button>
        </div>
      </div>
      {/* Modal para crear cliente */}
      <CrearCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
      />
    </div>
  );
};

export default PuntoDeVenta;