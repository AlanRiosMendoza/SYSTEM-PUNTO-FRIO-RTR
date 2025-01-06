import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventario = () => {
  const [detalleInventarios, setDetalleInventarios] = useState([]);
  const [pagina, setPagina] = useState(1); // Página actual
  const [limite, setLimite] = useState(10);
  const [hayMas, setHayMas] = useState(true); // Indica si hay más datos
  const [loading, setLoading] = useState(true);
  const [mensajeError, setMensajeError] = useState('');


  // Función para obtener los detalles del inventario con paginación
  const obtenerDetalleInventario = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/inventarios?pagina=${pagina}&limite=${limite}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDetalleInventarios(response.data || []); // Lista actualizada
      setHayMas(response.data.length === limite); // Verificar si hay más registros
      setMensajeError(''); // Limpia errores previos si los hubo
      setLoading(false);
    } catch (error) {
      setMensajeError('Hubo un error al obtener los detalles del inventario');
      console.error('Error:', error);
      setDetalleInventarios([]);
      setLoading(false);
    }
  };

  // Efecto para cargar datos al cambiar de página
  useEffect(() => {
    obtenerDetalleInventario();
  }, [pagina, limite]);

  // Manejo de botones de paginación
  const manejarPaginaSiguiente = () => {
    if (hayMas) {
      setPagina((prevPagina) => prevPagina + 1);
    }
  };

  const manejarPaginaAnterior = () => {
    if (pagina > 1) setPagina((prevPagina) => prevPagina - 1);
  };

  return (
    <div className="mt-4">
      <h1 className="font-black text-2xl sm:text-4xl text-gray-500 text-center">
        Detalle de Inventarios
      </h1>
      {mensajeError && <p className="text-red-500 text-center">{mensajeError}</p>}
  
      {loading ? (
        <p className="text-center text-gray-700">Cargando...</p>
      ) : (
        <>
          {/* Tabla responsiva */}
          <div className="overflow-x-auto">
            <table className="w-full mt-5 table-auto shadow-lg bg-white">
              <thead className="bg-gray-800 text-slate-400 text-sm sm:text-base">
                <tr>
                  <th className="p-2">N°</th>
                  <th className="p-2">Producto</th>
                  <th className="p-2">Cantidad</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Descripción</th>
                  <th className="p-2">Tipo de Movimiento</th>
                  <th className="p-2">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {detalleInventarios.length > 0 ? (
                  detalleInventarios.map((detalle, index) => (
                    <tr
                      key={detalle._id}
                      className="border-b hover:bg-gray-300 text-center text-sm sm:text-base"
                    >
                      <td>{(pagina - 1) * limite + index + 1}</td>
                      <td className="border border-gray-300 p-2">
                        {detalle.producto_id?.nombre || "Sin datos"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {detalle.cantidad || "0"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {detalle.fecha || "Sin fecha"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {detalle.descripcion || "Sin descripción"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {detalle.tipo_movimiento || "N/A"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {detalle.usuario_id?.nombre || ""}{" "}
                        {detalle.usuario_id?.apellido || ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center text-gray-500 p-4 text-sm sm:text-base"
                    >
                      No hay datos disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
  
          {/* Botones de paginación */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
            <button
              className={`px-4 py-2 rounded bg-blue-500 text-white ${
                pagina === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
              onClick={manejarPaginaAnterior}
              disabled={pagina === 1}
            >
              Anterior
            </button>
            <span className="text-sm sm:text-base font-medium">
              Página {pagina}
            </span>
            <button
              onClick={manejarPaginaSiguiente}
              disabled={!hayMas}
              className={`px-4 py-2 rounded bg-blue-500 text-white ${
                !hayMas ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );  
};

export default Inventario;
