import React, { useState } from "react";
import axios from "axios";
import Mensaje from "../Alertas/Mensaje";

const CrearCliente = ({ mostrarModal, setMostrarModal }) => {
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    telefono: "",
    direccion: "",
  });
  const [mensaje, setMensaje] = useState({});

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
      const url = `${import.meta.env.VITE_BACKEND_URL}/cliente`;
      const respuesta = await axios.post(url, nuevoCliente, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje({
        respuesta: "Cliente creado exitosamente",
        tipo: true,
      });
      setMostrarModal(false);
      setNuevoCliente({
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
        telefono: "",
        direccion: "",
      });
      setTimeout(() => {
        setMensaje({});
      }, 5000);
    } catch (error) {
      setMensaje({
        respuesta: error.response?.data?.msg || "Error al crear el cliente.",
        tipo: false,
      });
      setTimeout(() => {
        setMensaje({});
      }, 5000);
    }
  };

  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Crear Cliente</h2>

        {Object.keys(mensaje).length > 0 && (
          <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
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
              maxLength="10"
              onChange={(e) => {
                if (/^\d*\.?\d{0}$/.test(e.target.value)) {
                  handleChange(e);
                }
              }}
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
              maxLength="10"
              onChange={(e) => {
                if (/^\d*\.?\d{0}$/.test(e.target.value)) {
                  handleChange(e);
                }
              }}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección
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
  );
};

export default CrearCliente;
