import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Mensaje from './Alertas/Mensaje';

const Categoria = () => {
    const [categorias, setCategorias] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [limite] = useState(10);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: null }); // Objeto para almacenar texto y tipo
    const [ediciones, setEdiciones] = useState({}); // Estado para almacenar ediciones de nombres
    const [hayMas, setHayMas] = useState(true);
    
    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categorias`, {
                    params: { pagina, limite },
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategorias(response.data); 
                setHayMas(response.data.length === limite);
            } catch (error) {
                setMensaje({
                    texto: error.response?.data?.msg || 'Error al obtener categorías',
                    tipo: false,
                });
            }
        };

        obtenerCategorias();
    }, [pagina]);

    const manejarEdicion = (id, value) => {
        setEdiciones({ ...ediciones, [id]: value });
    };

    const manejarActualizar = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const nuevoNombre = ediciones[id];

            if (!nuevoNombre) {
                setMensaje({ texto: 'El nombre no puede estar vacío', tipo: false });
                return;
            }

            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/categoria/${id}`,
                { nombre: nuevoNombre },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMensaje({ texto: 'Categoría actualizada correctamente', tipo: true });
            setPagina(1);
        } catch (error) {
            setMensaje({
                texto: error.response?.data?.msg || 'Error al actualizar categoría',
                tipo: false,
            });
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
            setMensaje({
                texto: `Categoría ${accion === 'activar' ? 'activada' : 'desactivada'} correctamente`,
                tipo: true,
            });
            setPagina(1);
        } catch (error) {
            setMensaje({
                texto: error.response?.data?.msg || `Error al ${accion} categoría`,
                tipo: false,
            });
        }
    };

    const handlePaginaAnterior = () => {
        if (pagina > 1) setPagina((prev) => prev - 1);
    };

    const handlePaginaSiguiente = () => {
        if (hayMas) setPagina((prevPagina) => prevPagina + 1);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Gestión de Categorías</h2>

            {mensaje.texto && <Mensaje tipo={mensaje.tipo}>{mensaje.texto}</Mensaje>}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border shadow-lg">
                    <thead className="bg-gray-800 text-slate-400">
                        <tr>
                            <th className="p-2 text-sm sm:text-base">Nombre</th>
                            <th className="p-2 text-sm sm:text-base">Descripción</th>
                            <th className="p-2 text-sm sm:text-base">Estado</th>
                            <th className="p-2 text-sm sm:text-base">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categorias.map((categoria) => (
                            <tr key={categoria._id}>
                                <td className="px-4 py-2 text-center">
                                    <input
                                        type="text"
                                        value={ediciones[categoria._id] || categoria.nombre}
                                        onChange={(e) => manejarEdicion(categoria._id, e.target.value)}
                                        className="w-full p-1 border rounded-md text-sm sm:text-base"
                                    />
                                </td>
                                <td className="px-4 py-2 text-sm sm:text-base">{categoria.descripcion}</td>
                                <td className="px-4 py-2 text-sm sm:text-base">
                                    {categoria.activo ? 'Activo' : 'Inactivo'}
                                </td>
                                <td className="px-4 py-2 text-center flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => manejarActualizar(categoria._id)}
                                        className="mr-2 px-4 py-2 bg-blue-600 text-white font-medium text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={() =>
                                            manejarActivarDesactivar(
                                                categoria._id,
                                                categoria.activo ? 'desactivar' : 'activar'
                                            )
                                        }
                                        className={`px-4 py-2 font-medium text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                            categoria.activo
                                                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                                                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                                        }`}
                                    >
                                        {categoria.activo ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap justify-center items-center mt-4 gap-2">
                <button
                    onClick={handlePaginaAnterior}
                    disabled={pagina === 1}
                    className={`px-4 py-2 border rounded-l ${
                        pagina === 1
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                >
                    Anterior
                </button>
                <span className="px-4 py-2 border-t border-b text-gray-700 font-medium">{pagina}</span>
                <button
                    onClick={handlePaginaSiguiente}
                    disabled={!hayMas}
                    className={`px-4 py-2 border rounded-r ${
                        !hayMas
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default Categoria;
