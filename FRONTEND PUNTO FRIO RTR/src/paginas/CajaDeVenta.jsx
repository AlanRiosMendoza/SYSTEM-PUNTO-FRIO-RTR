import React, { useState } from "react";
import PuntoDeVenta from "../componets/PuntoDeVenta";
import CrearCliente from "../componets/Modals/CrearCliente";
import TablaClientes from "../componets/TablaClientes";
import GestionEnvases from "../componets/Modals/GestionEnvases";
import Factura from "../componets/Factura"; // Importa el componente Factura

const CajaDeVenta = () => {
  const [mostrarModal, setMostrarModal] = useState(false); // Controla el modal
  const [mostrarTabla, setMostrarTabla] = useState(false); // Controla la tabla de clientes
  const [mostrarEnvases, setMostrarEnvases] = useState(false); // Controla la gestión de envases
  const [mostrarFactura, setMostrarFactura] = useState(false); // Controla la visualización de la factura
  const [ventaId, setVentaId] = useState(null); // ID de la venta que se va a mostrar

  // Función para manejar la visualización de la factura
  const verFactura = (id) => {
    setVentaId(id); // Asignar el ID de la venta que se quiere mostrar
    setMostrarFactura(true); // Activar la visualización de la factura
  };

  // Función para ocultar la factura
  const ocultarFactura = () => {
    setMostrarFactura(false);
    setVentaId(null); // Limpiar el estado de ventaId
  };

  return (
    <div>
      <h1 className="font-black text-3xl sm:text-4xl text-gray-500">Caja de Venta</h1>
      <hr className="my-2" />

      <p className="mb-4">Listo para realizar una venta</p>

      {/* Botones para Crear Cliente, Ver Clientes y Gestionar Envases */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        <button
          onClick={() => setMostrarModal(true)}
          className="px-6 py-3 bg-[#695230] text-white rounded-md hover:bg-blue-600 transition"
        >
          Crear Cliente
        </button>
        <button
          onClick={() => {
            setMostrarTabla(!mostrarTabla);
            setMostrarEnvases(false);
          }}
          className={`px-6 py-3 ${mostrarTabla ? "bg-gray-500" : "bg-[#695230]"} text-white rounded-md hover:${mostrarTabla ? "bg-gray-600" : "bg-green-600"} transition`}
        >
          {mostrarTabla ? "Cajero" : "Ver Clientes"}
        </button>
        <button
          onClick={() => {
            setMostrarEnvases(!mostrarEnvases);
            setMostrarTabla(false);
          }}
          className={`px-6 py-3 ${mostrarEnvases ? "bg-gray-500" : "bg-[#695230]"} text-white rounded-md hover:${mostrarEnvases ? "bg-gray-600" : "bg-purple-600"} transition`}
        >
          {mostrarEnvases ? "Cajero" : "Gestionar Envases"}
        </button>

        {/* Botón para ver factura */}
        <button
          onClick={() => verFactura('12345')}
          className="px-6 py-3 bg-[#695230] text-white rounded-md hover:bg-yellow-600 transition"
        >
          Ver Factura
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

      {/* Mostrar la factura si el estado 'mostrarFactura' es true */}
      {mostrarFactura && <Factura ventaId={ventaId} />}

      {/* Botón para ocultar la factura */}
      {mostrarFactura && (
        <button
          onClick={ocultarFactura}
          className="px-6 py-3 mt-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Cerrar Factura
        </button>
      )}
    </div>
  );
};

export default CajaDeVenta;
