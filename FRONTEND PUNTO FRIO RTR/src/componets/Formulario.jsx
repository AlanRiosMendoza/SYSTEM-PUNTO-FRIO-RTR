import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mensaje from "./Alertas/Mensaje";
import { useState, useEffect } from "react";

export const Formulario = () => {
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState({});
    const [categorias, setCategorias] = useState([]); // Lista de categorías
    const [mostrarModal, setMostrarModal] = useState(false); // Controla la ventana emergente
    const [nuevaCategoria, setNuevaCategoria] = useState({
        nombre: "",
        descripcion: "",
    }); // Datos para la nueva categoría
    const [form, setForm] = useState({
        nombre: "",
        categoria_id: "",
        precio: "",
        retornable: "",
        activo: true,
    });

    // Función para obtener las categorías desde el backend
    const fetchCategorias = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/categorias`; // Ajusta según tu ruta de API
            const respuesta = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategorias(respuesta.data);
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
            setMensaje({
                respuesta: "Error al cargar categorías.",
                tipo: false,
            });
        }
    };

    useEffect(() => {
        fetchCategorias(); // Carga las categorías al montar el componente
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value === "true" ? true : value === "false" ? false : value,
        });
    };

    const handleNuevaCategoriaChange = (e) => {
        const { name, value } = e.target;
        setNuevaCategoria({
            ...nuevaCategoria,
            [name]: value,
        });
    };

    const agregarCategoria = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/categoria`; // Ajusta según tu ruta de API
            const respuesta = await axios.post(url, nuevaCategoria, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMensaje({
                respuesta: "Categoría creada exitosamente",
                tipo: true,
            });
            setNuevaCategoria({ nombre: "", descripcion: "" }); // Resetea el formulario
            setMostrarModal(false); // Cierra el modal
            fetchCategorias(); // Actualiza la lista de categorías
        } catch (error) {
            console.error(error.response?.data || error.message);
            setMensaje({
                respuesta: error.response?.data?.msg || "Ocurrió un error inesperado al agregar la categoría.",
                tipo: false,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/producto`; // Ajusta según tu ruta de API
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const respuesta = await axios.post(url, form, options);
            console.log("Producto registrado", respuesta.data);

            setMensaje({
                respuesta: respuesta.data.msg,
                tipo: true,
            });

            // Restaura el formulario a su estado inicial
            setForm({
                nombre: "",
                categoria_id: "",
                precio: "",
                retornable: "",
                activo: true,
            });

            setTimeout(() => {
                setMensaje("");
                navigate("/dashboard/listar");
            }, 4000);
        } catch (error) {
            console.error(error.response?.data || error.message);
            setMensaje({
                respuesta: error.response?.data?.msg || "Ocurrió un error inesperado",
                tipo: false,
            });

            setTimeout(() => {
                setMensaje("");
            }, 4000);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {Object.keys(mensaje).length > 0 && (
                    <Mensaje tipo={mensaje.tipo} className="mb-4">
                        {mensaje.respuesta}
                    </Mensaje>
                )}
            <h2 className="text-2xl font-bold mb-4">Ingreso de productos</h2>
                <div>
                    <label
                        htmlFor="nombre"
                        className="text-gray-700 uppercase font-bold text-sm"
                    >
                        Nombre del producto:
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
                        placeholder="Nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label
                        htmlFor="categoria_id"
                        className="text-gray-700 uppercase font-bold text-sm"
                    >
                        Categoría:
                    </label>
                    <div className="flex items-center space-x-4">
                        <select
                            id="categoria_id"
                            name="categoria_id"
                            value={form.categoria_id}
                            onChange={handleChange}
                            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
                        >
                            <option value="">Selecciona una categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria._id} value={categoria._id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setMostrarModal(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            Agregar categoría
                        </button>
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="precio"
                        className="text-gray-700 uppercase font-bold text-sm"
                    >
                        Precio:
                    </label>
                    <input
                        type="text"
                        id="precio"
                        name="precio"
                        value={form.precio}
                        onChange={(e) => {
                            // Validación para permitir solo números y un punto decimal
                            if (/^\d*\.?\d{0,2}$/.test(e.target.value)) {
                                handleChange(e);
                            }
                        }}
                        placeholder="0.00"
                        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
                    />
                </div>

                <div className="mt-4">
                    <label className="text-gray-700 uppercase font-bold text-sm">
                        Envase retornable:
                    </label>
                    <div className="flex items-center space-x-4 mt-2">
                        <label>
                            <input
                                type="radio"
                                name="retornable"
                                value={true}
                                checked={form.retornable === true}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Sí
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="retornable"
                                value={false}
                                checked={form.retornable === false}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            No
                        </label>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="text-gray-700 uppercase font-bold text-sm">
                        ¿Está activo?
                    </label>
                    <div className="flex items-center space-x-4 mt-2">
                        <label>
                            <input
                                type="radio"
                                name="activo"
                                value={true}
                                checked={form.activo === true}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Activo
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="activo"
                                value={false}
                                checked={form.activo === false}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Inactivo
                        </label>
                    </div>
                </div>

                <input
                    type="submit"
                    className="bg-gray-600 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all mt-2"
                    value="Registrar"
                />
            </form>
            {mostrarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4">Agregar nueva categoría</h2>
                        <form onSubmit={agregarCategoria}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={nuevaCategoria.nombre}
                                    onChange={handleNuevaCategoriaChange}
                                    className="border w-full p-2 rounded"
                                    placeholder="Nombre de la categoría"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={nuevaCategoria.descripcion}
                                    onChange={handleNuevaCategoriaChange}
                                    className="border w-full p-2 rounded"
                                    placeholder="Descripción de la categoría"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setMostrarModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
