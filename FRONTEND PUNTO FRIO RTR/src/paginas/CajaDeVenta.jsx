import React, { useContext, useState } from "react";
import PuntoDeVenta from "../componets/PuntoDeVenta";
import TablaClientes from "../componets/TablaClientes";
import GestionEnvases from "../componets/Modals/GestionEnvases";
import Factura from "../componets/Factura"; // Importa el componente Factura
import AuthContext from "../context/AuthProvider";

const CajaDeVenta = () => {
  const [mostrarTabla, setMostrarTabla] = useState(false); // Controla la tabla de clientes
  const [mostrarEnvases, setMostrarEnvases] = useState(false); // Controla la gestión de envases
  const [mostrarFactura, setMostrarFactura] = useState(false); // Controla la visualización de la factura
  const [ventaId, setVentaId] = useState(null); // ID de la venta que se va a mostrar
  const {auth} = useContext(AuthContext)
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
      <h1 className="font-black text-3xl sm:text-4xl text-gray-500">Caja Registradora</h1>
      <hr className="my-2" />

      <p className="mb-4">Listo para realizar una venta</p>

      {/* Botones para Crear Cliente, Ver Clientes y Gestionar Envases */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        
        <button
          onClick={() => {
            setMostrarTabla(!mostrarTabla);
            setMostrarEnvases(false);
            setMostrarFactura(false)
          }}
          className={`px-6 py-3 ${mostrarTabla ? "bg-gray-500" : "bg-[#695230]"} text-white rounded-md hover:${mostrarTabla ? "bg-gray-600" : "bg-green-600"} transition`}
        >
          {mostrarTabla ? "Cajero" : "Ver Clientes"}
        </button>
        <button
          onClick={() => {
            setMostrarEnvases(!mostrarEnvases);
            setMostrarTabla(false);
            setMostrarFactura(false)
          }}
          className={`px-6 py-3 ${mostrarEnvases ? "bg-gray-500" : "bg-[#695230]"} text-white rounded-md hover:${mostrarEnvases ? "bg-gray-600" : "bg-purple-600"} transition`}
        >
          {mostrarEnvases ? "Cajero" : "Gestionar Envases"}
        </button>
        {auth.rol === "cajero" && (
          <button
            onClick={() => (mostrarFactura ? ocultarFactura() : verFactura('12345'))}
            className={`px-6 py-3 mt-4 ${
              mostrarFactura ? "bg-red-500 hover:bg-red-600" : "bg-[#695230] hover:bg-yellow-600"
            } text-white rounded-md transition`}        
            >
            {mostrarFactura ? "Cerrar Factura" : "Ver Factura"}
          </button>
        )}
      </div>

      {/* Condicional para alternar entre vistas */}
      {mostrarEnvases ? (
        <GestionEnvases />
      ) : mostrarTabla ? (
        <TablaClientes setMostrarTabla={setMostrarTabla} />
      ) : mostrarFactura ? (
        <div>
          <Factura ventaId={ventaId} />
        </div>
      ) : (
        <div>
          <PuntoDeVenta />
        </div>
      )}
    </div>
  );
};

export default CajaDeVenta;