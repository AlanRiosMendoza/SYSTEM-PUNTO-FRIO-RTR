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
            className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-[#b2ffff] via-[#59d8d4] to-[#337bb3]"
        >
            <div className="w-full max-w-md p-6 rounded-md bg-white shadow-lg">
                {/* Mensaje dinámico */}
                {Object.keys(mensaje).length > 0 && (
                    <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                )}

                {/* Título */}
                <h1 className="text-3xl font-semibold mb-4 text-center uppercase text-gray-800">
                    Olvidaste tu contraseña
                </h1>
                <small className="text-gray-600 block mb-6 text-sm text-center">
                    No te preocupes, ingresa el correo para recuperar la contraseña.
                </small>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">Correo</label>
                        <input
                            type="email"
                            placeholder="Ingrese el correo de registro"
                            className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 py-2 px-3 bg-gray-100 text-gray-800"
                            name="correo"
                            value={mail.correo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-6">
                        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Enviar
                        </button>
                    </div>
                </form>

                {/* Redirección */}
                <div className="text-sm text-center text-gray-700">
                    <Link to="/login" className="underline hover:text-blue-600">¿Ya tienes una cuenta?</Link>
                </div>
            </div>
        </div>
    );
};
