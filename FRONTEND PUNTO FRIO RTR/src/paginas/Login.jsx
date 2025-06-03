import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Mensaje from "../componets/Alertas/Mensaje";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Importar el ícono de retroceso

const Login = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState({});
    const [form, setForm] = useState({
        correo: "",
        contrasenia: "",
    });

    const handlerChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/login`;
            const respuesta = await axios.post(url, form);
            localStorage.setItem("token", respuesta.data.token);
            setAuth(respuesta.data);
        } catch (error) {
            if (error.response) {
                const errorMessage =
                    error.response.data?.msg || "Error desconocido";
                const validationErrorMessage = error.response.data?.errors?.[0]?.msg;

                setMensaje({
                    respuesta: validationErrorMessage || errorMessage,
                    tipo: false,
                });
            } else {
                setMensaje({
                    respuesta: "Error de conexión o el servidor no respondió.",
                    tipo: false,
                });
            }
        }
    };

    useEffect(() => {
        if (auth?.nombre) {
            navigate("/dashboard");
        }
    }, [auth, navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !auth?.nombre) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/perfil`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setAuth(response.data);
                } catch (error) {
                    console.log("Error al obtener el perfil:", error);
                }
            };
            fetchUserData();
        }
    }, [auth]);

    return (
        <div
            className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-[#b2ffff] via-[#59d8d4] to-[#337bb3]"
        >
            <div className="w-full max-w-md bg-white p-6 rounded-md shadow-lg">
                {/* Mensaje dinámico */}
                {Object.keys(mensaje).length > 0 && (
                    <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                )}

                {/* Botón de retroceso */}
                <Link
                    to="/"
                    className="absolute top-4 left-4 text-gray-800 hover:text-blue-600"
                >
                    <FaArrowLeft size={24} />
                </Link>

                {/* Título */}
                <h1 className="text-3xl font-semibold mb-4 text-center uppercase text-gray-800">
                    Inicio de sesión
                </h1>
                <small className="text-gray-600 block mb-6 text-sm text-center">
                    Por favor ingrese los siguientes campos
                </small>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-semibold text-gray-800">
                            Correo
                        </label>
                        <input
                            type="email"
                            name="correo"
                            value={form.correo || ""}
                            onChange={handlerChange}
                            placeholder="Ingrese su correo"
                            className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 py-2 px-3 bg-gray-100 text-gray-800"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-semibold text-gray-800">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="contrasenia"
                            value={form.contrasenia || ""}
                            onChange={handlerChange}
                            placeholder="Ingrese su contraseña"
                            className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 py-2 px-3 bg-gray-100 text-gray-800"
                        />
                    </div>

                    <div className="mb-6">
                        <button className="py-2 w-full bg-blue-600 text-white border rounded-md hover:scale-105 duration-300 hover:bg-blue-700">
                            Iniciar sesión
                        </button>
                    </div>
                </form>

                {/* Enlace de recuperación */}
                <div className="text-sm text-center text-gray-800">
                    <Link
                        to="/forgot/id"
                        className="underline text-sm hover:text-blue-600"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
