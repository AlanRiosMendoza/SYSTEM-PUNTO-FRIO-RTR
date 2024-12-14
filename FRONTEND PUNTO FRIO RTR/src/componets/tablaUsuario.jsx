import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(10);

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
      } catch (error) {
        console.error("Error al obtener los usuarios", error);
      }
    };

    obtenerUsuarios();
  }, [pagina]);

  const handlePaginaAnterior = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  const handlePaginaSiguiente = () => {
    setPagina(pagina + 1);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Correo</th>
            <th className="border border-gray-300 px-4 py-2">Rol</th>
            <th className="border border-gray-300 px-4 py-2">Ultimo acceso</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
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
                  {usuario.nombre + " " +  usuario.apellido}
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
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {usuario.activo ? (
                    <span className="text-green-600">Activo</span>
                  ) : (
                    <span className="text-red-600">Inactivo</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
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
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TablaUsuarios;
