import React, { useState } from "react";
import axios from "axios";

const ActualizarUsuario = ({ usuario, isOpen, onClose, onUpdate }) => {
  const [nuevoRol, setNuevoRol] = useState(usuario?.rol || "Seleccionar rol"); // Inicializa con el rol actual del usuario
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleRolChange = (e) => {
    setNuevoRol(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const token = localStorage.getItem("token");

      const url = `${import.meta.env.VITE_BACKEND_URL}/cambiar-role/${usuario._id}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const data = { rol: nuevoRol };

      await axios.put(url, data, { headers });

      alert("Rol actualizado correctamente");
      onUpdate(); // Refresca la lista de usuarios
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al actualizar el rol:", error.response?.data || error.message);
      setError(
        error.response?.data?.msg ||
        "Hubo un problema al actualizar el rol. Intenta nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Actualizar Rol del Usuario</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Usuario:</label>
            <p className="bg-gray-100 p-2 rounded">{usuario?.nombre} {usuario?.apellido}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rol:</label>
            <select
              value={nuevoRol}
              onChange={handleRolChange}
              className="w-full p-2 border rounded"
            >
              <option value="SinAsignar">Selecionar rol</option>
              <option value="cajero">Cajero</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                cargando && "opacity-50 cursor-not-allowed"
              }`}
              disabled={cargando}
            >
              {cargando ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActualizarUsuario;
