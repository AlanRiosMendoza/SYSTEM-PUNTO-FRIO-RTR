import React, { useState, useEffect } from "react";
import axios from "axios";

const ActualizarUsuario = ({ usuario, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    cedula: "",
    telefono: "",
  });

  const [mostrarCorreo, setMostrarCorreo] = useState(false); // Controla si se muestra el campo de correo
  const [confirmarCorreo, setConfirmarCorreo] = useState(false); // Para el paso de confirmación

  useEffect(() => {
    if (usuario && isOpen) {
      setFormData({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        correo: usuario.correo || "",
        cedula: usuario.cedula || "",
        telefono: usuario.telefono || "",
      });
      setMostrarCorreo(false); // Restablecer al abrir el modal
      setConfirmarCorreo(false);
    }
  }, [usuario, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCorreoConfirmacion = (respuesta) => {
    setConfirmarCorreo(true);
    if (respuesta === "si") {
      setMostrarCorreo(true); // Mostrar campo de correo si confirma "Sí"
    } else {
      setMostrarCorreo(false); // Ocultar campo de correo si confirma "No"
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/perfil`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      await axios.put(url, formData, { headers });
      alert("Usuario actualizado correctamente");
      onUpdate(); // Refresca la lista o los datos del usuario
      onClose(); // Cierra el modal
    } catch (error) {
      console.error(
        "Error al actualizar el usuario:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.msg || "No se pudo actualizar el usuario");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Actualizar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Confirmación para el correo */}
          {!confirmarCorreo && (
            <div className="mb-4">
              <p className="text-sm font-medium">
                ¿Desea actualizar el correo electrónico?
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleCorreoConfirmacion("si")}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => handleCorreoConfirmacion("no")}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  No
                </button>
              </div>
            </div>
          )}

          {/* Campo de Correo, solo visible si confirma "Sí" */}
          {mostrarCorreo && (
            <div className="mb-4">
              <label className="block text-sm font-medium">Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium">Cédula</label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              maxLength="10"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              maxLength="10"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActualizarUsuario;
