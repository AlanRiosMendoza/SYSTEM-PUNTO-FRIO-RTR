import React, { useState } from "react";
import PuntoDeVenta from "../componets/PuntoDeVenta";
import FormularioCliente from "../componets/Perfil/FormularioCliente";

const CajaDeVenta = () => {
  const [tipoCliente, setTipoCliente] = useState("consumidor_final");
  const [clienteId, setClienteId] = useState(null); // Maneja el ID del cliente

  const manejarCambioTipoCliente = (e) => {
    setTipoCliente(e.target.value);
    if (e.target.value === "consumidor_final") {
      setClienteId(null); // Si es consumidor final, no hay cliente asociado
    }
  };

  return (
    <div>
      <h1 className="font-black text-4xl text-gray-500">Caja de Venta</h1>
      <hr className="my-4" />

      <p className="mt-8 font-bold text-lg">Seleccione el tipo de cliente:</p>
      <div className="flex items-center gap-4 my-4">
        {/* Opciones de tipo de cliente */}
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="tipoCliente"
            value="consumidor_final"
            checked={tipoCliente === "consumidor_final"}
            onChange={manejarCambioTipoCliente}
            className="form-radio text-blue-500"
          />
          <span>Consumidor Final</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="tipoCliente"
            value="factura_con_datos"
            checked={tipoCliente === "factura_con_datos"}
            onChange={manejarCambioTipoCliente}
            className="form-radio text-blue-500"
          />
          <span>Factura con Datos</span>
        </label>
      </div>

      {/* Mostrar formulario del cliente si se selecciona "factura_con_datos" */}
      {tipoCliente === "factura_con_datos" && (
        <>
          <p className="mb-8">Datos personales del cliente</p>
          <FormularioCliente onClienteCreado={(id) => setClienteId(id)} />
        </>
      )}

      <p className="mb-8">Listo para realizar una venta</p>

      {/* Componente Punto de Venta */}
      <PuntoDeVenta />
    </div>
  );
};

export default CajaDeVenta;
