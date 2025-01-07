import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Mensaje from "../componets/Alertas/Mensaje";

export const Forgot = () => {
    const [mensaje, setMensaje] = useState({});
    const [mail, setMail] = useState({ correo: "" });

    const handleChange = (e) => {
        setMail({
            ...mail,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mail.correo) {
            setMensaje({ respuesta: "El correo es obligatorio", tipo: false });
            setTimeout(() => setMensaje(""), 4000);
            return;
        }

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/recuperar-password`;
            const respuesta = await axios.post(url, mail);
            setMensaje({ respuesta: respuesta.data.msg, tipo: true });
            setMail({ correo: "" });
            setTimeout(() => setMensaje(""), 4000);
        } catch (error) {
            const mensajeError = error.response?.data?.msg || "Ocurrió un error inesperado";
            setMensaje({ respuesta: mensajeError, tipo: false });
            setTimeout(() => setMensaje(""), 4000);
        }
    };

    return (
        <div
            className="flex justify-center items-center h-screen w-screen bg-cover bg-center"
            style={{
                backgroundImage: `url('/public/images/bottle-695375_1280.jpg')`,
            }}
        >
            <div className="w-full max-w-md bg-black/80 p-6 rounded-md">
                {/* Mensaje dinámico */}
                {Object.keys(mensaje).length > 0 && (
                    <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                )}

                {/* Título */}
                <h1 className="text-3xl font-semibold mb-4 text-center uppercase text-gray-300">
                    Olvidaste tu contraseña
                </h1>
                <small className="text-gray-400 block mb-6 text-sm text-center">
                    No te preocupes, ingresa el correo para recuperar la contraseña.
                </small>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-semibold text-gray-300">Correo</label>
                        <input
                            type="email"
                            placeholder="Ingrese el correo de registro"
                            className="block w-full rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 py-2 px-3 bg-neutral-800 text-gray-200"
                            name="correo"
                            value={mail.correo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-6">
                        <button className="w-full bg-gray-600 text-gray-300 border py-2 rounded-md hover:scale-105 duration-300 hover:bg-gray-700 hover:text-white">
                            Enviar
                        </button>
                    </div>
                </form>

                {/* Redirección */}
                <div className="text-sm flex justify-between items-center text-gray-300">
                    <p>¿Ya tienes una cuenta?</p>
                    <Link
                        to="/login"
                        className="py-2 px-4 bg-gray-600 text-gray-300 border rounded-md hover:scale-110 duration-300 hover:bg-gray-700 hover:text-white"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};
