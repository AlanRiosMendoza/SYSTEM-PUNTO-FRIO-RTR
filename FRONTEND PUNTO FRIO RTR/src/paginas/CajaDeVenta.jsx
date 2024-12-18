import React, { useState } from "react";
import PuntoDeVenta from "../componets/PuntoDeVenta";
import CrearCliente from "../componets/Modals/CrearCliente";
import TablaClientes from "../componets/TablaClientes";
import GestionEnvases from "../componets/Modals/GestionEnvases";

const CajaDeVenta = () => {
  const [mostrarModal, setMostrarModal] = useState(false); // Controla el modal
  const [mostrarTabla, setMostrarTabla] = useState(false); // Controla la tabla de clientes
  const [mostrarEnvases, setMostrarEnvases] = useState(false); // Controla la gestión de envases

  return (
    <div>
      <h1 className="font-black text-4xl text-gray-500">Caja de Venta</h1>
      <hr className="my-2" />

      <p className="mb-4">Listo para realizar una venta</p>

      {/* Botones para Crear Cliente, Ver Clientes y Gestionar Envases */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setMostrarModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Crear Cliente
        </button>
        <button
          onClick={() => {
            setMostrarTabla(!mostrarTabla);
            setMostrarEnvases(false);
          }}
          className={`px-4 py-2 ${
            mostrarTabla ? "bg-gray-500" : "bg-green-500"
          } text-white rounded-md hover:${
            mostrarTabla ? "bg-gray-600" : "bg-green-600"
          } transition`}
        >
          {mostrarTabla ? "Cajero" : "Ver Clientes"}
        </button>
        <button
          onClick={() => {
            setMostrarEnvases(!mostrarEnvases);
            setMostrarTabla(false);
          }}
          className={`px-4 py-2 ${
            mostrarEnvases ? "bg-gray-500" : "bg-purple-500"
          } text-white rounded-md hover:${
            mostrarEnvases ? "bg-gray-600" : "bg-purple-600"
          } transition`}
        >
          {mostrarEnvases ? "Cajero" : "Gestionar Envases"}
        </button>
      </div>

      {/* Modal para crear cliente */}
      <CrearCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
      />

      {/* Condicional para alternar entre vistas */}
      {mostrarEnvases ? (
        <GestionEnvases />
      ) : mostrarTabla ? (
        <TablaClientes setMostrarTabla={setMostrarTabla} />
      ) : (
        <PuntoDeVenta />
      )}
    </div>
  );
};

export default CajaDeVenta;
