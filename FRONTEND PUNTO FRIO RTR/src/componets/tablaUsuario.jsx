import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdChangeCircle } from "react-icons/md";
import ActualizarUsuario from "./Modals/ActualizarUsuario";

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(100);
  const [hayMas, setHayMas] = useState(true)

  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Obtener usuarios al cargar la página o cuando se actualiza la lista
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const respuesta = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/usuarios?page=${pagina}&limit=${limite}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsuarios(respuesta.data);
        setHayMas(respuesta.data.length === limite);
      } catch (error) {
        console.error("Error al obtener los usuarios", error);
      }
    };

    obtenerUsuarios();
  }, [pagina]);

  // Cambiar estado de usuario (activo/inactivo)
  const cambiarEstadoUsuario = async (usuario) => {
    const endpoint = usuario.activo
      ? `${import.meta.env.VITE_BACKEND_URL}/desactivar-usuario/${usuario._id}`
      : `${import.meta.env.VITE_BACKEND_URL}/activar-usuario/${usuario._id}`;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizar el estado localmente
      setUsuarios((usuariosAnteriores) =>
        usuariosAnteriores.map((u) =>
          u._id === usuario._id ? { ...u, activo: !u.activo } : u
        )
      );
    } catch (error) {
      console.error(
        "Error al cambiar el estado del usuario:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.msg ||
        "Hubo un problema al cambiar el estado del usuario."
      );
    }
  };

  // Función para abrir el modal de edición
  const handleEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalOpen(true);
  };

  const handlePaginaAnterior = () => {
    if (pagina > 1) setPagina((prev) => prev - 1);
  };

  const handlePaginaSiguiente = () => {
    if (hayMas) setPagina((prevPagina) => prevPagina + 1);
  };

  return (
    <div className="overflow-x-auto">
      <span className="flex justify-center"><MdChangeCircle className="h-7 w-7 text-blue-500 mr-2"/>Actualizar Rol</span>
      <table className="w-full mt-5 table-auto shadow-lg bg-white">
        <thead className="bg-gray-800 text-slate-400">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Último acceso</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario, index) => (
              <tr key={usuario._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {(pagina - 1) * limite + index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {usuario.nombre + " " + usuario.apellido}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {usuario.correo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {usuario.rol}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {usuario.fechaUltimoAcceso}
                </td>
                <td
                  className="border border-gray-300 px-4 py-2 text-center cursor-pointer"
                  onClick={() => cambiarEstadoUsuario(usuario)}
                >
                  {usuario.activo ? (
                    <span className="text-green-600 hover:underline">Activo</span>
                  ) : (
                    <span className="text-red-600 hover:underline">Inactivo</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <MdChangeCircle
                    className="h-7 w-7 cursor-pointer inline-block text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditarUsuario(usuario)} // Abre el modal
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="border border-gray-300 px-4 py-2 text-center text-gray-500"
              >
                No hay usuarios disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePaginaAnterior}
          disabled={pagina === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Anterior
        </button>
        <span>Página {pagina}</span>
        <button
          onClick={handlePaginaSiguiente}
          disabled={!hayMas}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Siguiente
        </button>
      </div>
      {/* Modal para actualizar usuario */}
      <ActualizarUsuario
        usuario={usuarioSeleccionado}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={() => {
          setModalOpen(false);
          // Actualizar usuarios después de cerrar el modal
          const token = localStorage.getItem("token");
          axios
            .get(
              `${import.meta.env.VITE_BACKEND_URL}/usuarios?page=${pagina}&limit=${limite}`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => setUsuarios(res.data))
            .catch((err) => console.error(err));
        }}
      />
    </div>
  );
};

export default TablaUsuarios;
