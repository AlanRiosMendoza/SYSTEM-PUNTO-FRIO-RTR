import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categoria = () => {
    const [categorias, setCategorias] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [limite] = useState(10);
    const [mensaje, setMensaje] = useState('');
    const [ediciones, setEdiciones] = useState({}); // Estado para almacenar ediciones de nombres
    const [hayMas, setHayMas] = useState(true)
    
    useEffect(() => {
        const obtenerCategorias = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categorias`, {
            params: {
                pagina, // Enviado siempre
                limite, // Enviado siempre
            },
            headers: { Authorization: `Bearer ${token}` },
            });
            setCategorias(response.data); // Asumiendo que el backend devuelve directamente el array de categorías
            setHayMas(response.data.length === limite);
        } catch (error) {
            console.error(error)
            setMensaje(error.response?.data?.msg || 'Error al obtener categorías');
        }
        };
    
        obtenerCategorias();
    }, [pagina]);
    
    const manejarEdicion = (id, value) => {
        setEdiciones({ ...ediciones, [id]: value }); // Guardar el valor del input en el estado local
    };

    const manejarActualizar = async (id) => {
        try {
        const token = localStorage.getItem('token');
        const nuevoNombre = ediciones[id]; // Obtener el nuevo nombre del estado local

        if (!nuevoNombre) {
            setMensaje('El nombre no puede estar vacío');
            return;
        }

        await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/categoria/${id}`,
            { nombre: nuevoNombre },
            {
            headers: { Authorization: `Bearer ${token}` },
            }
        );
        setMensaje('Categoría actualizada correctamente');
        setPagina(1); // Recargar la lista
        } catch (error) {
        setMensaje(error.response?.data?.msg || 'Error al actualizar categoría');
        }
    };

    const manejarActivarDesactivar = async (id, accion) => {
        try {
        const token = localStorage.getItem('token');
        const endpoint = accion === 'activar' ? `/categoria/activar/${id}` : `/categoria/${id}`;
        await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setMensaje(`Categoría ${accion === 'activar' ? 'activada' : 'desactivada'} correctamente`);
        setPagina(1); // Recargar la lista
        } catch (error) {
        setMensaje(error.response?.data?.msg || `Error al ${accion} categoría`);
        }
    };

    const handlePaginaAnterior = () => {
        if (pagina > 1) setPagina((prev) => prev - 1);
    };

    const handlePaginaSiguiente = () => {
        if (hayMas) setPagina((prevPagina) => prevPagina + 1);
    };

    return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Categorías</h2>
      {mensaje && <p>{mensaje}</p>}

      <table className="min-w-full divide-y divide-gray-200 border shadow-lg">
        <thead className="bg-gray-800 text-slate-400">
          <tr >
            <th className="p-2">Nombre</th>
            <th className="p-2">Descripción</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categorias.map((categoria) => (
            <tr key={categoria._id}>
              <td className="px-4 py-2 text-center">
                <input
                  type="text"
                  value={ediciones[categoria._id] || categoria.nombre} // Mostrar valor actual o el nuevo editado
                  onChange={(e) => manejarEdicion(categoria._id, e.target.value)} // Actualizar estado local
                />
              </td>
              <td className="px-4 py-2 text-center">{categoria.descripcion}</td>
              <td className="px-4 py-2 text-center">{categoria.activo ? 'Activo' : 'Inactivo'}</td>
              <td className="px-4 py-2 text-center">
                <button
                    onClick={() => manejarActualizar(categoria._id)}
                    className="mr-2 bg-blue-500 text-white font-semibold py-1 px-2 rounded-md hover:bg-blue-600 transition-all"
                >
                    Guardar
                </button>
                <button
                    onClick={() => manejarActivarDesactivar(categoria._id, categoria.activo ? 'desactivar' : 'activar')}
                    className={`${
                    categoria.activo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    } text-white font-semibold py-1 px-2 rounded-md transition-all`}
                >
                    {categoria.activo ? 'Desactivar' : 'Activar'}
                </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

        <div className="flex justify-center mt-4">
            <button
                onClick={handlePaginaAnterior}
                disabled={pagina === 1}
                className={`px-4 py-2 border rounded-l ${
                    pagina === 1
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
            >
                Anterior
            </button>
            <span className="px-4 py-2 border-t border-b text-gray-700 font-medium">
                {pagina}
            </span>
            <button
                onClick={handlePaginaSiguiente}
                disabled={!hayMas}
                className={`px-4 py-2 border rounded-r ${
                    !hayMas
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
            >
                Siguiente
            </button>
        </div>
    </div>
  );
};

export default Categoria;
