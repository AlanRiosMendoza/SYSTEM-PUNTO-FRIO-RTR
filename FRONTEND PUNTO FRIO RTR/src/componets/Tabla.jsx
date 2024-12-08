import { useContext, useEffect, useState } from "react";
import { MdChangeCircle, MdUpdate, MdInfo } from "react-icons/md";
import axios from "axios";
import Mensaje from "./Alertas/Mensaje";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const Tabla = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [limite] = useState(10);
    const [ordenAscendente, setOrdenAscendente] = useState(true); // Estado para el orden de la tabla
    const [selectedFilter, setSelectedFilter] = useState("todos");

    const listarProductos = async () => {
        try {
            const token = localStorage.getItem("token");
            let url = `${import.meta.env.VITE_BACKEND_URL}/productos`;

            // Añadimos el filtro al URL si está definido
            if (selectedFilter === "activos") {
                url += "?estado=true";
            } else if (selectedFilter === "inactivos") {
                url += "?estado=false";
            }

            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await axios.get(url, options);
            console.log("Productos desde el backend:", respuesta.data);
            setProductos(respuesta.data);
            setProductosFiltrados(respuesta.data);
        } catch (error) {
            console.error(
                "Error al listar productos:",
                error.response?.data || error.message
            );
        }
    };

    const handlePaginaAnterior = () => {
        if (pagina > 1) setPagina((prev) => prev - 1);
    };

    const handlePaginaSiguiente = () => {
        setPagina((prev) => prev + 1);
    };

    const handleDelete = async (id, activo) => {
        try {
            const confirmar = confirm(
                `Vas a cambiar el estado de este producto a ${
                    activo ? "Inactivo" : "Activo"
                }, ¿Estás seguro de realizar esta acción?`
            );
            if (confirmar) {
                const token = localStorage.getItem("token");
                const url = !activo
                    ? `${import.meta.env.VITE_BACKEND_URL}/producto/activar/${id}` // Activar producto
                    : `${import.meta.env.VITE_BACKEND_URL}/producto/${id}`; // Desactivar producto

                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };

                await axios.patch(url, {}, { headers });
                alert(
                    `Producto ${
                        activo ? "desactivado" : "activado"
                    } correctamente`
                );
                listarProductos();
            }
        } catch (error) {
            console.error(
                "Error al cambiar el estado del producto:",
                error.response?.data || error.message
            );
            alert("No se pudo cambiar el estado del producto. Intenta nuevamente.");
        }
    };

    const ordenarPorNombre = () => {
        const productosOrdenados = [...productosFiltrados].sort((a, b) => {
            if (a.nombre.toLowerCase() < b.nombre.toLowerCase())
                return ordenAscendente ? -1 : 1;
            if (a.nombre.toLowerCase() > b.nombre.toLowerCase())
                return ordenAscendente ? 1 : -1;
            return 0;
        });
        setOrdenAscendente(!ordenAscendente); // Cambia el orden para el próximo clic
        setProductosFiltrados(productosOrdenados);
    };

    useEffect(() => {
        listarProductos();
    }, [selectedFilter, pagina]); // Llamar listarProductos cuando el filtro cambie

    return (
        <>
             {/* Radios de filtro */}
             <div className="flex justify-center items-center gap-4 mt-6">
                {["todos", "activos", "inactivos"].map((opcion) => (
                    <label
                        key={opcion}
                        className={`cursor-pointer rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
                            selectedFilter === opcion
                                ? "bg-blue-500 text-white shadow-lg"
                                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                        }`}
                    >
                        <input
                            type="radio"
                            value={opcion}
                            checked={selectedFilter === opcion}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="hidden" // Escondemos el radio original
                        />
                        {opcion.charAt(0).toUpperCase() + opcion.slice(1)} {/* Capitalizamos */}
                    </label>
                ))}
            </div>
            
            {productosFiltrados.length === 0 ? (
                <Mensaje tipo="active">{"No existen registros"}</Mensaje>
            ) : (
                <>
                    <table className="w-full mt-5 table-auto shadow-lg bg-white">
                        <thead className="bg-gray-800 text-slate-400">
                            <tr>
                                <th className="p-2">N°</th>
                                <th
                                    className="p-2 cursor-pointer"
                                    onClick={ordenarPorNombre}
                                >
                                    Nombre{" "}
                                    {ordenAscendente ? "▲" : "▼"}
                                </th>
                                <th className="p-2">Precio</th>
                                <th className="p-2">Stock</th>
                                <th className="p-2">Retornable</th>
                                <th className="p-2">Activo</th>
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.map((producto, index) => (
                                <tr
                                    className="border-b hover:bg-gray-300 text-center"
                                    key={producto._id}
                                >
                                    <td>{index + 1}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.precio}</td>
                                    <td>{producto.stock}</td>
                                    <td>{producto.retornable ? "Si" : "No"}</td>
                                    <td>
                                        <span
                                            className={`bg-blue-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${
                                                producto.activo
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {producto.activo
                                                ? "Activo"
                                                : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="py-2 text-center">
                                        <MdInfo
                                            className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                                            onClick={() =>
                                                navigate(
                                                    `/dashboard/visualizar/${producto._id}`
                                                )
                                            }
                                        />
                                        
                                        {auth.rol === "administrador" && (
                                            <>
                                                <MdUpdate
                                                    className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                                                    onClick={() =>
                                                        navigate(
                                                           `/dashboard/actualizar/${producto._id}`
                                                        )
                                                    }
                                                    
                                                />
                                                <MdChangeCircle
                                                    className="h-7 w-7 text-red-400 cursor-pointer inline-block mr-2"
                                                    onClick={() =>
                                                        handleDelete(
                                                            producto._id,
                                                            producto.activo
                                                        )
                                                    }
                                                />
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Control de paginación */}
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
                            className="px-4 py-2 border rounded-r bg-gray-800 text-white hover:bg-gray-700"
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default Tabla;
