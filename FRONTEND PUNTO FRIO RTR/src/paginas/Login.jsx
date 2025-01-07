import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Mensaje from "../componets/Alertas/Mensaje";
import { useNavigate } from "react-router-dom";

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
            className="flex justify-center items-center h-screen w-screen bg-cover bg-center"
            style={{
                backgroundImage: `url('/images/crop-man-with-beer-browsing-tablet.jpg')`,
            }}
        >
        <div className="w-full max-w-md bg-black/80 p-6 rounded-md">
            {/* Mensaje dinámico */}
            {Object.keys(mensaje).length > 0 && (
            <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
            )}

            {/* Título */}
            <h1 className="text-3xl font-semibold mb-4 text-center uppercase text-gray-300">
            Inicio de sesión
            </h1>
            <small className="text-gray-400 block mb-6 text-sm text-center">
            Por favor ingrese los siguientes campos
            </small>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-300">
                    Correo
                    </label>
                    <input
                    type="email"
                    name="correo"
                    value={form.correo || ""}
                    onChange={handlerChange}
                    placeholder="Ingrese su correo"
                    className="block w-full rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 py-2 px-3 bg-neutral-800 text-gray-200"
                    />
                </div>

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-semibold text-gray-300">
                    Contraseña
                    </label>
                    <input
                    type="password"
                    name="contrasenia"
                    value={form.contrasenia || ""}
                    onChange={handlerChange}
                    placeholder="Ingrese su contraseña"
                    className="block w-full rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 py-2 px-3 bg-neutral-800 text-gray-200"
                    />
                </div>

                <div className="mb-6">
                    <button className="py-2 w-full bg-gray-600 text-gray-300 border rounded-md hover:scale-105 duration-300 hover:bg-gray-700 hover:text-white">
                    Inicio
                    </button>
                </div>
            </form>

            {/* Enlace de recuperación */}
            <div className="text-sm text-center text-gray-300">
                <Link
                    to="/forgot/id"
                    className="underline text-sm hover:text-white"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>
        </div>
    </div>
  );
};

export default Login;