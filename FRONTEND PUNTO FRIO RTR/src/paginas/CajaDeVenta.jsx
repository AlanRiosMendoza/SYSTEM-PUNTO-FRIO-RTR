import React, { useState } from "react";
import PuntoDeVenta from "../componets/PuntoDeVenta";
import CrearCliente from "../componets/Modals/CrearCliente";
import TablaClientes from "../componets/TablaClientes";

const CajaDeVenta = () => {
  const [mostrarModal, setMostrarModal] = useState(false); // Controla el modal
  const [mostrarTabla, setMostrarTabla] = useState(false); // Controla la tabla de clientes

  return (
    <div>
      <h1 className="font-black text-4xl text-gray-500">Caja de Venta</h1>
      <hr className="my-2" />

      <p className="mb-4">Listo para realizar una venta</p>

      {/* Botones para Crear Cliente y alternar entre TablaClientes y PuntoDeVenta */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setMostrarModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Crear Cliente
        </button>
        <button
          onClick={() => setMostrarTabla(!mostrarTabla)}
          className={`px-4 py-2 ${
            mostrarTabla ? "bg-gray-500" : "bg-green-500"
          } text-white rounded-md hover:${
            mostrarTabla ? "bg-gray-600" : "bg-green-600"
          } transition`}
        >
          {mostrarTabla ? "Cajero" : "Ver Clientes"}
        </button>
      </div>

      {/* Modal para crear cliente */}
      <CrearCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
      />

      {/* Condicional para alternar entre TablaClientes y PuntoDeVenta */}
      {mostrarTabla ? (
        <TablaClientes setMostrarTabla={setMostrarTabla} />
      ) : (
        <PuntoDeVenta />
      )}
    </div>
  );
};

export default CajaDeVenta;
