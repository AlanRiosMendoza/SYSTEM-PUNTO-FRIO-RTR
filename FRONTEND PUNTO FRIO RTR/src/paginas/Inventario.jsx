import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventario = () => {
  const [detalleInventarios, setDetalleInventarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(10);
  const [loading, setLoading] = useState(true);
  const [mensajeError, setMensajeError] = useState('');
  const [totalRegistros, setTotalRegistros] = useState(0);

  const obtenerToken = () => {
    return localStorage.getItem('token');
  };

  const obtenerDetalleInventario = async () => {
    setLoading(true);
    try {
      const token = obtenerToken();
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/inventarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          pagina,
          limite,
        },
      });

      console.log('Respuesta del backend:', response.data);

      // Ajustar las claves según lo recibido del backend
      setDetalleInventarios(response.data.inventario || response.data || []);
      setTotalRegistros(response.data.total || 0);
    } catch (error) {
      setMensajeError('Hubo un error al obtener los detalles del inventario');
      console.error('Error:', error);
      setDetalleInventarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDetalleInventario();
  }, [pagina, limite]);

  const handlePaginaSiguiente = () => {
    if (pagina * limite < totalRegistros) {
      setPagina(pagina + 1);
    }
  };

  const handlePaginaAnterior = () => {
    if (pagina > 1) {
      setPagina(pagina - 1);
    }
  };

  return (
    <div className="mt-4">
      <h1 className="font-black text-4xl text-gray-500">Detalle de Inventarios</h1>
      {mensajeError && <p className="text-red-500">{mensajeError}</p>}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <table className="w-full mt-5 table-auto shadow-lg bg-white">
            <thead className="bg-gray-800 text-slate-400">
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
                  <tr key={detalle._id} className="border-b hover:bg-gray-300 text-center">
                    <td>{(pagina - 1) * limite + index + 1}</td>
                    <td className="border border-gray-300 p-2">{detalle.producto_id?.nombre || 'Sin datos'}</td>
                    <td className="border border-gray-300 p-2">{detalle.cantidad || '0'}</td>
                    <td className="border border-gray-300 p-2">{detalle.fecha || 'Sin fecha'}</td>
                    <td className="border border-gray-300 p-2">{detalle.descripcion || 'Sin descripción'}</td>
                    <td className="border border-gray-300 p-2">{detalle.tipo_movimiento || 'N/A'}</td>
                    <td className="border border-gray-300 p-2">
                      {detalle.usuario_id?.nombre || ''} {detalle.usuario_id?.apellido || ''}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 p-4">
                    No hay datos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePaginaAnterior}
              disabled={pagina === 1}
              className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
            >
              Anterior
            </button>
            <p>
              Página {pagina} de {Math.ceil(totalRegistros / limite)}
            </p>
            <button
              onClick={handlePaginaSiguiente}
              disabled={pagina * limite >= totalRegistros}
              className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
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
