import React, { useEffect, useState } from "react";
import axios from "axios";
import ActualizarCliente from "./Modals/ActualizarCliente";
import { MdUpdate } from "react-icons/md";

const TablaClientes = ({ setMostrarTabla }) => {
  const [clientes, setClientes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(10); //limite de registro
  const [hayMas, setHayMas] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_BACKEND_URL}/clientes?pagina=${pagina}&limite=${limite}`;
        const respuesta = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClientes(respuesta.data);
        setHayMas(respuesta.data.length === limite);
      } catch (error) {
        console.error("Error al obtener los clientes", error);
      }
    };

    obtenerClientes();
  }, [pagina]);

  const handlePaginaAnterior = () => {
    if (pagina > 1) setPagina((prev) => prev - 1);
  };

  const handlePaginaSiguiente = () => {
    if (hayMas) setPagina((prevPagina) => prevPagina + 1);
  };

  const handleEditarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModal(true);
  };

  const actualizarCliente = async (id, datosActualizados) => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/cliente/${id}`;
      await axios.put(url, datosActualizados, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Cliente actualizado correctamente");
      setClientes((prev) =>
        prev.map((cliente) =>
          cliente._id === id ? { ...cliente, ...datosActualizados } : cliente
        )
      );
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al actualizar el cliente:", error.response?.data || error.message);
      alert("No se pudo actualizar el cliente. Intenta nuevamente.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Clientes Registrados</h2>
      <span className="flex"><MdUpdate className="h-7 w-7 text-blue-500 inline-block mr-2"/>Actualizar clientes</span>
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full divide-y divide-gray-200 border shadow-lg">
          <thead className="bg-gray-800 text-slate-400">
            <tr>
              <th className="p-2">N°</th>
              <th className="px-4 py-2 text-sm font-medium uppercase">Nombre</th>
              <th className="px-4 py-2 text-sm font-medium uppercase">Apellido</th>
              <th className="px-4 py-2 text-sm font-medium uppercase">Cédula</th>
              <th className="px-4 py-2 text-sm font-medium uppercase">Correo</th>
              <th className="px-4 py-2 text-sm font-medium uppercase">Teléfono</th>
              <th className="px-4 py-2 text-sm font-medium uppercase">Dirección</th>
              <th className="px-4 py-2 text-sm font-medium uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientes.map((cliente, index) => (
              <tr key={cliente._id}>
                <td className="px-4 py-2 text-center">
                  {(pagina - 1) * limite + index + 1}
                </td>
                <td className="px-4 py-2 text-center">{cliente.nombre}</td>
                <td className="px-4 py-2 text-center">{cliente.apellido}</td>
                <td className="px-4 py-2 text-center">{cliente.cedula}</td>
                <td className="px-4 py-2 text-center">{cliente.correo}</td>
                <td className="px-4 py-2 text-center">{cliente.telefono}</td>
                <td className="px-4 py-2 text-center">{cliente.direccion}</td>
                <td className="px-4 py-2 text-center">
                  <MdUpdate
                    onClick={() => handleEditarCliente(cliente)}
                    className="h-7 w-7 text-blue-500 cursor-pointer inline-block mr-2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePaginaAnterior}
          disabled={pagina === 1}
          className={`px-4 py-2 border rounded-l ${pagina === 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-gray-800 text-white hover:bg-gray-700"}`}
        >
          Anterior
        </button>
        <span className="px-4 py-2 border-t border-b text-gray-700 font-medium">
          {pagina}
        </span>
        <button
          onClick={handlePaginaSiguiente}
          disabled={!hayMas}
          className={`px-4 py-2 border rounded-r ${!hayMas ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-gray-800 text-white hover:bg-gray-700"}`}
        >
          Siguiente
        </button>
      </div>
  
      {/* Componente de ActualizarCliente */}
      {mostrarModal && (
        <ActualizarCliente
          clienteSeleccionado={clienteSeleccionado}
          setClienteSeleccionado={setClienteSeleccionado}
          setMostrarModal={setMostrarModal}
          actualizarCliente={actualizarCliente}
        />
      )}
    </div>
  );  
};

export default TablaClientes;
