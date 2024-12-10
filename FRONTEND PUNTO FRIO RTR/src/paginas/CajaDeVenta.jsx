import React, { useState } from "react";
import PuntoDeVenta from "../componets/PuntoDeVenta";
import axios from "axios";

const CajaDeVenta = () => {
  const [clienteId, setClienteId] = useState(""); // ID del cliente creado
  const [mostrarModal, setMostrarModal] = useState(false); // Controla el modal
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    telefono: "",
    direccion: ""
  });
  const [mensaje, setMensaje] = useState({}); // Mensajes de éxito o error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoCliente({
      ...nuevoCliente,
      [name]: value,
    });
  };

  const agregarCliente = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/cliente`; // Ajusta según tu ruta de API
      const respuesta = await axios.post(url, nuevoCliente, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Cliente creado exitosamente
      setMensaje({
        respuesta: "Cliente creado exitosamente",
        tipo: true,
      });
      setClienteId(respuesta.data.cliente_id); // Guarda el ID del cliente creado
      setMostrarModal(false); // Cierra el modal
      setNuevoCliente({
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
        telefono: "",
        direccion: ""
      });
    } catch (error) {
      // Error al crear el cliente
      setMensaje({
        respuesta:
          error.response?.data?.msg || "Error al crear el cliente.",
        tipo: false,
      });
    }
  };

  return (
    <div>
      <h1 className="font-black text-4xl text-gray-500">Caja de Venta</h1>
      <hr className="my-4" />

      <p className="mb-8">Listo para realizar una venta</p>

      {/* Botón para abrir el modal */}
      <button
        onClick={() => setMostrarModal(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Crear Cliente
      </button>

      {/* Modal para crear cliente */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">Crear Cliente</h2>
            {mensaje.respuesta && (
              <p
                className={`text-sm mb-4 ${
                  mensaje.tipo ? "text-green-500" : "text-red-500"
                }`}
              >
                {mensaje.respuesta}
              </p>
            )}
            <form onSubmit={agregarCliente} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={nuevoCliente.nombre}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={nuevoCliente.apellido}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cédula
                </label>
                <input
                  type="text"
                  name="cedula"
                  value={nuevoCliente.cedula}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo
                </label>
                <input
                  type="email"
                  name="correo"
                  value={nuevoCliente.correo}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={nuevoCliente.telefono}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Direccion
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={nuevoCliente.direccion}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Componente Punto de Venta */}
      <PuntoDeVenta clienteId={clienteId} />
    </div>
  );
};

export default CajaDeVenta;
