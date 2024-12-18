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
    <div>
      <h2 className="text-2xl font-bold mb-4">Clientes Registrados</h2>
      <table className="min-w-full divide-y divide-gray-200 border shadow-lg">
        <thead className="bg-gray-800 text-slate-400">
          <tr>
            <th className="p-2">
              N°
            </th>
            <th className="px-4 py-2 text-sm font-medium uppercase">
              Nombre
            </th>
            <th className="px-4 py-2 text-sm font-medium uppercase">
              Apellido
            </th>
            <th className="px-4 py-2 text-sm font-medium uppercase">
              Cédula
            </th>
            <th className="px-4 py-2 text-sm font-medium uppercase">
              Correo
            </th>
            <th className="px-4 py-2 text-sm font-medium uppercase">
              Teléfono
            </th>
            <th className="px-4 py-2 text-sm font-medium uppercase">
              Dirección
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clientes.map((cliente, index) => (
            <tr key={cliente._id}>
              <td className="px-4 py-2 text-center">{index + 1}</td>
              <td className="px-4 py-2 text-center">{cliente.nombre}</td>
              <td className="px-4 py-2 text-center">{cliente.apellido}</td>
              <td className="px-4 py-2 text-center">{cliente.cedula}</td>
              <td className="px-4 py-2 text-center">{cliente.correo}</td>
              <td className="px-4 py-2 text-center">{cliente.telefono}</td>
              <td className="px-4 py-2 text-center">{cliente.direccion}</td>
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
