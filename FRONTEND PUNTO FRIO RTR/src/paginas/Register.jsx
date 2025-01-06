import { useState } from "react"
import Mensaje from '../componets/Alertas/Mensaje'
import axios from "axios"
import TablaUsuarios from "../componets/tablaUsuario"

export const Register = () => {

    const [mensaje, setMensaje] = useState({})
    const [mostrarTabla, setMostrarTabla] = useState(false); // Estado para alternar entre la tabla y el formulario
    const [form, setform] = useState({
        nombre:"",
        apellido:"",
        cedula:"",
        correo:"",
        contrasenia:"",
        telefono:"",
        rol:""
    })

    const handlerChange = (e) => {
        const { name, value } = e.target;
        setform({
            ...form,
            [name]: name === "rol" ? value.toLowerCase() : value, // Convertir rol a minúsculas
        });
    };
    
    const handlerSubmit = async (e) => {
        e.preventDefault();
    
        // Validación de nombre
        if (!form.nombre || form.nombre.trim().length < 3) {
            setMensaje({ respuesta: "El nombre es obligatorio y debe tener al menos 3 caracteres.", tipo: false });
            return;
        }
    
        // Validación de apellido
        if (!form.apellido || form.apellido.trim().length < 3) {
            setMensaje({ respuesta: "El apellido es obligatorio y debe tener al menos 3 caracteres.", tipo: false });
            return;
        }
    
        // Validación de cédula (por ejemplo, que sea numérica y tenga una longitud específica)
        if (!form.cedula || form.cedula.trim().length !== 10 || isNaN(form.cedula)) {
            setMensaje({ respuesta: "La cédula debe tener exactamente 10 dígitos numéricos.", tipo: false });
            return;
        }
    
        // Validación de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.correo || !emailRegex.test(form.correo)) {
            setMensaje({ respuesta: "El correo es obligatorio y debe tener un formato válido.", tipo: false });
            return;
        }
    
        // Validación de teléfono (10 dígitos)
        const phoneRegex = /^[0-9]{10}$/;
        if (!form.telefono || !phoneRegex.test(form.telefono)) {
            setMensaje({ respuesta: "El número de teléfono debe tener exactamente 10 dígitos.", tipo: false });
            return;
        }
    
        // Validación de rol
        if (form.rol !== "cajero" && form.rol !== "administrador") {
            setMensaje({ respuesta: "El rol debe ser 'cajero' o 'administrador'.", tipo: false });
            return;
        }
    
        // Envío al backend
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No se encontró ningún token. Por favor, inicia sesión.");
                return;
            }
    
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };
    
            const url = `${import.meta.env.VITE_BACKEND_URL}/registro`;
            const respuesta = await axios.post(url, form, config);
    
            setMensaje({
                respuesta: respuesta.data.msg,
                tipo: true,
            });
    
            setTimeout(() => {
                setMensaje({});
            }, 3000);
    
            // Limpieza del formulario
            setform({
                nombre: "",
                apellido: "",
                cedula: "",
                correo: "",
                contrasenia: "",
                telefono: "",
                rol: "",
            });
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.msg || "Error desconocido";
            setMensaje({ respuesta: errorMessage, tipo: false });
            setTimeout(() => {
                setMensaje({});
            }, 5000);
        }
    };
    
    return (
        <>
            
            <div className="bg-transparent flex justify-center items-baseline">

                <div className="w-full bg-white p-8 rounded-lg shadow-lg">
                
                {Object.keys(mensaje).length>0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                
                {!mostrarTabla ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-800 uppercase">Registrar Usuario</h1>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-md shadow"
                                onClick={() => setMostrarTabla(true)} // Mostrar la tabla
                            >
                                Ver Usuarios
                            </button>
                        </div>

                        <p className="text-gray-600 text-center mt-2">Completa los detalles para crear una cuenta</p>


                    <form className="mt-6 space-y-4" onSubmit={handlerSubmit}>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="nombre">Nombre</label>
                            <input 
                                type="name" 
                                id="nombre" 
                                name="nombre" 
                                value={form.nombre || ""} 
                                onChange={handlerChange}
                                placeholder="Ingresar nombre" 
                                className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black" 
                                required/>
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="apellido">Apellido</label>
                            <input type="name" 
                            id="apellido" name="apellido" value={form.apellido || ""} onChange={handlerChange}
                            placeholder="Ingresar apellido" className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black" />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="cedula">Cédula</label>
                            <input
                                type="text" // Usamos texto porque type="number" permite valores negativos y decimales
                                id="cedula"
                                name="cedula"
                                value={form.cedula || ""}
                                maxLength="10" // Límite máximo de 10 caracteres
                                onChange={handlerChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Permitir solo números
                                }}
                                placeholder="0999999999"
                                className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="correo">Correo</label>
                            <input type="email" 
                            id="correo" name="correo" value={form.correo || ""} onChange={handlerChange}
                            placeholder="Ingresa tu correo" className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black" />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="contrasenia">Contraseña</label>
                            <input type="password" 
                            id="contrasenia" name="contrasenia" value={form.contrasenia || ""} onChange={handlerChange}
                            placeholder="********************" className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black" />
                        </div>
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="telefono">Teléfono</label>
                            <input
                                type="text" // Usamos texto porque type="number" permite valores negativos y decimales
                                id="telefono"
                                name="telefono"
                                value={form.telefono || ""}
                                maxLength="10" // Límite máximo de 10 caracteres
                                onChange={handlerChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Permitir solo números
                                }}
                                placeholder="0987654321"
                                className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="rol">Rol</label>
                            <select
                                id="rol"
                                name="rol"
                                value={form.rol}
                                onChange={handlerChange}
                                className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black"
                            >
                                <option value="">Seleccionar rol</option>
                                <option value="cajero">Cajero</option>
                                <option value="administrador">Administrador</option>
                            </select>
                        </div>
                        
                        <div className="mb-3 text-center">
                            <button 
                            className="w-1/2 bg-[#67841e] text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
                            >Registrar
                            </button>
                        </div>

                    </form>
                </>
                 ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-gray-800 uppercase">Usuarios Registrados</h1>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-md shadow"
                                onClick={() => setMostrarTabla(false)} // Volver al formulario
                            >
                                Volver
                            </button>
                        </div>

                        {/* Renderizar la tabla de usuarios */}
                        <TablaUsuarios />
                    </>
                )}
                </div>

            </div>

            {/* <div className="w-1/2 h-screen bg-[url('public/images/drink-1593837_1280.jpg')] 
            bg-no-repeat bg-cover bg-center sm:block hidden
            ">
            </div> */}
        </>
    )
}
