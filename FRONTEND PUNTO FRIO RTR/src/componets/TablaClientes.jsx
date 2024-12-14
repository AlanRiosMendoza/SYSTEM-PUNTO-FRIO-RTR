import React, { useEffect, useState } from "react";
import axios from "axios";

const TablaClientes = ({ setMostrarTabla }) => {
  const [clientes, setClientes] = useState([]);
  const [pagina, setPagina] = useState(1); // Controla la paginación

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_BACKEND_URL}/clientes?pagina=${pagina}&limite=10`;
        const respuesta = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClientes(respuesta.data);
      } catch (error) {
        console.error("Error al obtener los clientes", error);
      }
    };

    obtenerClientes();
  }, [pagina]);

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Clientes Registrados</h2>
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Nombre
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Apellido
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Cédula
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Correo
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Teléfono
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Dirección
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clientes.map((cliente) => (
            <tr key={cliente._id}>
              <td className="px-4 py-2">{cliente.nombre}</td>
              <td className="px-4 py-2">{cliente.apellido}</td>
              <td className="px-4 py-2">{cliente.cedula}</td>
              <td className="px-4 py-2">{cliente.correo}</td>
              <td className="px-4 py-2">{cliente.telefono}</td>
              <td className="px-4 py-2">{cliente.direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
        >
          Anterior
        </button>
        <button
          onClick={() => setPagina((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
        >
          Siguiente
        </button>
        <button
          onClick={() => setMostrarTabla(false)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TablaClientes;
