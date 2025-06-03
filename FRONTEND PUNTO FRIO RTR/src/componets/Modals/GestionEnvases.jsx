import React, { useState, useEffect } from "react";
import axios from "axios";
import Mensaje from "../Alertas/Mensaje";
import CrearCliente from "./CrearCliente";

const GestionEnvases = () => {
  const [envases, setEnvases] = useState([]);
  const [mensaje, setMensaje] = useState({}); 
  const [prestamo_cantidad, setPrestamo_cantidad] = useState("");
  const [deposito_cantidad, setDeposito_cantidad] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false); // Controla el modal
  
  // Buscar cliente por cédula
  const buscarCliente = async (cedula) => {
    if (!cedula) {
      setMensaje({ texto: "Por favor, ingrese la cédula del cliente.", tipo: false });
      setTimeout(() => setMensaje(""), 4000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/clientes?cedula=${cedula}`;
      const respuesta = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (respuesta.data && respuesta.data.length > 0) {
        setClienteSeleccionado(respuesta.data[0]);
        setMensaje("");
      } else {
        setMensaje({texto:"No se encontró un cliente con la cédula proporcionada.", tipo: false });
        setTimeout(() => setMensaje(""), 4000);
      }
      setBusquedaCliente("");
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      setMensaje({texto:"Error al buscar el cliente. Verifique la cédula.", tipo: false});
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  // Obtener envases desde el backend
  const fetchEnvases = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/envases`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnvases(response.data);
    } catch (error) {
      console.error("Error al obtener los envases:", error);
    }
  };

  // Registrar préstamo de envases
  const handleCrearEnvase = async () => {
    if (!clienteSeleccionado) {
      setMensaje({texto:"Debe buscar un cliente primero.", tipo: false});
      setTimeout(() => setMensaje(""), 4000);
      return;
    }

    if (!prestamo_cantidad || !deposito_cantidad) {
      setMensaje({texto:"Debe completar los campos de préstamo y depósito.", tipo: false});
      setTimeout(() => setMensaje(""), 4000);
      return;
    }

    const token = localStorage.getItem("token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/envase`;
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const prestamoData = {
      cliente_id: clienteSeleccionado._id,
      prestamo: prestamo_cantidad,
      deposito: deposito_cantidad,
    };

    try {
      await axios.post(url, prestamoData, options);
      setMensaje({texto:"Envase registrado con éxito.", tipo: true});
      setTimeout(() => setMensaje(""), 4000);

      setClienteSeleccionado(null);
      setBusquedaCliente("");
      setPrestamo_cantidad("");
      setDeposito_cantidad("");
      fetchEnvases();
    } catch (error) {
      console.error("Error al registrar el préstamo:", error);
      setMensaje({texto:"Hubo un error al procesar el préstamo.", tipo: false});
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  // Devolver envase
  const handleDevolverEnvase = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/envase/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchEnvases();
    } catch (error) {
      console.error("Error al devolver el préstamo de envase:", error);
    }
  };

  useEffect(() => {
    fetchEnvases();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Envases</h2>
  
      {/* Mostrar mensaje */}
      {mensaje.texto && <Mensaje tipo={mensaje.tipo}>{mensaje.texto}</Mensaje>}
  
      {/* Selección de cliente */}
      {!clienteSeleccionado ? (
        <div className="max-w-4xl mb-4 mx-auto bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Buscar Cliente</h3>
          <input
            type="text"
            placeholder="Ingrese la cédula del cliente..."
            value={busquedaCliente}
            maxLength="10"
            onChange={(e) => setBusquedaCliente(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            onClick={() => buscarCliente(busquedaCliente)}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 mb-2 rounded-md hover:bg-blue-600 transition"
          >
            Buscar
          </button>
          <button
            onClick={() => setMostrarModal(true)}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 mb-2 mx-4 rounded-md hover:bg-blue-600 transition"
          >
            Crear Cliente
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mb-4 mx-auto bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Cliente Seleccionado</h3>
          <p>
            <strong>Nombre:</strong> {clienteSeleccionado.nombre}{" "}
            {clienteSeleccionado.apellido}
          </p>
          <p>
            <strong>Cédula:</strong> {clienteSeleccionado.cedula}
          </p>
          <button
            onClick={() => setClienteSeleccionado(null)}
            className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-red-600 transition"
          >
            Cambiar Cliente
          </button>
          <button
            onClick={() => setMostrarModal(true)}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 mb-2 mx-4 rounded-md hover:bg-blue-600 transition"
          >
            Crear Cliente
          </button>
        </div>
      )}
  
      {/* Registrar préstamo */}
      <div className="max-w-4xl mb-4 mx-auto bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Registrar Préstamo</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <input
            type="text"
            placeholder="Cantidad de Préstamo"
            value={prestamo_cantidad}
            onChange={(e) => setPrestamo_cantidad(e.target.value)}
            className="w-full sm:w-auto border px-2 py-1 mb-4 sm:mb-0 sm:mr-2"
          />
          <input
            type="text"
            placeholder="Depósito"
            value={deposito_cantidad}
            onChange={(e) => setDeposito_cantidad(e.target.value)}
            className="w-full sm:w-auto border px-2 py-1 mb-4 sm:mb-0 sm:mr-2"
          />
          <button
            onClick={handleCrearEnvase}
            className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Crear Préstamo
          </button>
        </div>
      </div>
  
      {/* Listado de préstamos */}
      <div className="overflow-x-auto">
        <table className="w-full mt-5 table-auto shadow-lg bg-white">
          <thead className="bg-gray-800 text-slate-400">
            <tr>
              <th className="p-2 text-xs sm:text-sm">Cliente</th>
              <th className="p-2 text-xs sm:text-sm">Préstamo</th>
              <th className="p-2 text-xs sm:text-sm">Depósito</th>
              <th className="p-2 text-xs sm:text-sm">Devuelto</th>
              <th className="p-2 text-xs sm:text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {envases.map((envase) => (
              <tr key={envase._id}>
                <td className="border-b hover:bg-gray-300 text-center text-xs sm:text-sm">
                  {envase.cliente_id?.nombre} {envase.cliente_id?.apellido}
                </td>
                <td className="border-b hover:bg-gray-300 text-center text-xs sm:text-sm">
                  {envase.prestamo}
                </td>
                <td className="border-b hover:bg-gray-300 text-center text-xs sm:text-sm">
                  {envase.deposito}
                </td>
                <td className="border-b hover:bg-gray-300 text-center text-xs sm:text-sm">
                  {envase.devuelto ? "Sí" : "No"}
                </td>
                <td className="border-b hover:bg-gray-300 text-center text-xs sm:text-sm">
                  {!envase.devuelto && (
                    <button
                      onClick={() => handleDevolverEnvase(envase._id)}
                      className="bg-purple-500 text-white px-2 py-1 rounded-md hover:bg-purple-600"
                    >
                      Devolver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal para crear cliente */}
      <CrearCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
      />
    </div>
  );  
};

export default GestionEnvases;
