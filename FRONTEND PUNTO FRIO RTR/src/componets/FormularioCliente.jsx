import React, { useState } from "react";
import Mensaje from "./Alertas/Mensaje";

const FormularioCliente = ({
  clienteInicial = {
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    telefono: "",
    direccion: "",
  },
  mostrarModal,
  setMostrarModal,
  onSubmit,
  titulo = "Formulario Cliente",
  mensajeExito = "Operación realizada con éxito",
}) => {
  const [cliente, setCliente] = useState(clienteInicial);
  const [mensaje, setMensaje] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Limitar la longitud del nombre y apellido a 50 caracteres
    if ((name === "nombre" || name === "apellido") && value.length > 30) {
      setMensaje({
          respuesta: `El ${name} no puede exceder los 30 caracteres.`,
          tipo: false,
      });
      setTimeout(() => {
          setMensaje({});
      }, 3000);
      return;
    }
    setCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación de longitud de nombre
    if (cliente.nombre.trim().length > 30) {
        setMensaje({ respuesta: "El nombre no puede exceder los 30 caracteres.", tipo: false });
        return;
    } 

    // Validación de longitud de apellido
    if (cliente.apellido.trim().length > 30) {
        setMensaje({ respuesta: "El apellido no puede exceder los 30 caracteres.", tipo: false });
        return;
    }

    try {
      await onSubmit(cliente); // Ejecuta la función onSubmit pasada como prop
      setMensaje({ respuesta: mensajeExito, tipo: true });
      setTimeout(() => setMensaje({}), 5000);
      setMostrarModal(false);
      setCliente("")
    } catch (error) {
      setMensaje({
        respuesta: error.response?.data?.msg || "Error en la operación.",
        tipo: false,
      });
      setTimeout(() => setMensaje({}), 5000);
    }
  };

  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">{titulo}</h2>

        {Object.keys(mensaje).length > 0 && (
          <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={cliente.nombre}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />
            <small className="text-gray-500">
              {30 - cliente.nombre.length} caracteres restantes
            </small>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={cliente.apellido}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />
            <small className="text-gray-500">
              {30 - cliente.apellido.length} caracteres restantes
            </small>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cédula
            </label>
            <input
              type="text"
              name="cedula"
              value={cliente.cedula}
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
              value={cliente.correo}
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
              value={cliente.telefono}
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
              value={cliente.direccion}
              maxLength={70}
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

export default FormularioCliente;
