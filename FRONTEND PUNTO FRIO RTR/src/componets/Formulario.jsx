import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Mensaje from "./Alertas/Mensaje";
import { useState } from 'react';

export const Formulario = () => {
    const navigate = useNavigate()
    const [mensaje, setMensaje] = useState({})
    const [form, setform] = useState ({
        nombre: "",
        precio: "",
        stock: "",
        imagen: "",
        retornable: "",
        activo: ""
    })

    const handleChange = (e) => {
        setform({...form,
            [e.target.name]:e.target.value
        })
        const { name, value } = e.target;
        setform({
            ...form,
            [name]: value === "true" ? true : value === "false" ? false : value,
        });
    }


    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Obtén el archivo real seleccionado
        if (file) {
            setform({ 
                ...form, 
                imagen: file // Guarda el archivo en el estado del formulario 
            });
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.imagen) {
            console.log("Por favor selecciona una imagen.");
            return;
        }
        const formData = new FormData();
        formData.append("imagen", form.imagen); // Archivo de imagen
        Object.keys(form).forEach((key) => {
            if (key !== "imagen") {
                formData.append(key, form[key]);
            }
        });
    
        // Log para verificar los datos enviados
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/producto`;
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`, // Token
                },
            };
    
            const respuesta = await axios.post(url, formData, options);
            console.log("Producto registrado", respuesta.data);
    
            setMensaje({
                respuesta: respuesta.data.msg,
                tipo: true,
            });
            
            // Restaura el formulario a su estado inicial
            setform({
                nombre: "",
                precio: "",
                stock: "",
                imagen: null,
                retornable: "",
                activo: "",
            });

            setTimeout(() => {
                setMensaje("");
                // navigate("/dashboard/listar");
            }, 3000);
        } catch (error) {
            console.error(error.response?.data || error.message);
            setMensaje({
                respuesta: error.response?.data?.msg || "Ocurrió un error inesperado",
                tipo: false,
            });

            setTimeout(() => {
                setMensaje("");
            }, 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {Object.keys(mensaje).length > 0 && (
                <Mensaje tipo={mensaje.tipo} className="mb-4">
                    {mensaje.respuesta}
                </Mensaje>
            )}
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

            <div>
                <label
                    htmlFor="stock"
                    className="text-gray-700 uppercase font-bold text-sm"
                >
                    Unidades disponibles:
                </label>
                <input
                    type="text"
                    id="stock"
                    name="stock"
                    value={form.stock}
                    onChange={(e) => {
                        // Validación para permitir solo números
                        if (/^\d*$/.test(e.target.value)) {
                            handleChange(e);
                        }
                    }}
                    placeholder="0"
                    className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
                />
            </div>

            <div>
                <label
                    htmlFor="imagen"
                    className="text-gray-700 uppercase font-bold text-sm"
                >
                    Imagen:
                </label>
                <input
                    id="imagen"
                    className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
                    name="imagen"
                    type="file"
                    onChange={handleFileChange}
                />
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

    
            <input
                type="submit"
                className="bg-gray-600 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all mt-2"
                value="Registrar"
            />
        </form>
    );
}    