import { useContext, useEffect, useState } from 'react';
import { MdDeleteForever, MdNoteAdd, MdInfo } from 'react-icons/md';
import axios from 'axios';
import Mensaje from './Alertas/Mensaje';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

const Tabla = ({ filtro }) => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);

    const listarProductos = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/productos`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await axios.get(url, options);
            let productosFiltrados = respuesta.data;

            if (filtro === 'activos') {
                productosFiltrados = productosFiltrados.filter((producto) => producto.activo);
            } else if (filtro === 'inactivos') {
                productosFiltrados = productosFiltrados.filter((producto) => !producto.activo);
            }

            setProductos(productosFiltrados);
        } catch (error) {
            console.error('Error al listar productos:', error.response?.data || error.message);
        }
    };

    const handleDelete = async (id, activo) => {
        try {
            const confirmar = confirm(
                `Vas a cambiar el estado de este producto a ${activo ? 'Inactivo' : 'Activo'}, ¿Estás seguro de realizar esta acción?`
            );
            if (confirmar) {
                const token = localStorage.getItem('token');
                const url = !activo
                    ? `${import.meta.env.VITE_BACKEND_URL}/producto/activar/${id}` // Activar producto
                    : `${import.meta.env.VITE_BACKEND_URL}/producto/${id}`; // Desactivar producto

                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                };

                await axios.patch(url, {}, { headers });
                alert(`Producto ${activo ? 'desactivado' : 'activado'} correctamente`);
                listarProductos();
            }
        } catch (error) {
            console.error('Error al cambiar el estado del producto:', error.response?.data || error.message);
            alert('No se pudo cambiar el estado del producto. Intenta nuevamente.');
        }
    };

    useEffect(() => {
        listarProductos();
    }, [filtro]); // Llamar listarProductos cuando el filtro cambie

    return (
        <>
            {productos.length === 0 ? (
                <Mensaje tipo="active">{'No existen registros'}</Mensaje>
            ) : (
                <table className="w-full mt-5 table-auto shadow-lg bg-white">
                    <thead className="bg-gray-800 text-slate-400">
                        <tr>
                            <th className="p-2">N°</th>
                            <th className="p-2">Nombre:</th>
                            <th className="p-2">Precio</th>
                            <th className="p-2">Stock</th>
                            <th className="p-2">Retornable</th>
                            <th className="p-2">Activo</th>
                            <th className="p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto, index) => (
                            <tr className="border-b hover:bg-gray-300 text-center" key={producto._id}>
                                <td>{index + 1}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.precio}</td>
                                <td>{producto.stock}</td>
                                <td>{producto.retornable ? 'Si' : 'No'}</td>
                                <td>
                                    <span
                                        className={`bg-blue-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${
                                            producto.activo ? 'text-green-500' : 'text-red-500'
                                        }`}
                                    >
                                        {producto.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="py-2 text-center">
                                    <MdNoteAdd
                                        className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                                        onClick={() => navigate(`/dashboard/visualizar/${producto._id}`)}
                                    />
                                    {auth.rol === 'administrador' && (
                                        <>
                                            <MdInfo
                                                className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                                                onClick={() => navigate(`/dashboard/actualizar/${producto._id}`)}
                                            />
                                            <MdDeleteForever
                                                className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                                                onClick={() => handleDelete(producto._id, producto.activo)}
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default Tabla;
