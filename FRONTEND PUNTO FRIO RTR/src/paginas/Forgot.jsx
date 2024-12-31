import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';

export const Forgot = () => {
    const [mensaje, setMensaje] = useState({});
    const [mail, setMail] = useState({ correo: '' });

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
            setMail({ correo: '' });
            setTimeout(() => setMensaje(""), 4000);
        } catch (error) {
            const mensajeError = error.response?.data?.msg || "Ocurrió un error inesperado";
            setMensaje({ respuesta: mensajeError, tipo: false });
            setTimeout(() => setMensaje(""), 4000);
        }
    };

    return (
        <>
            <div className="bg-neutral-900 flex justify-center items-center w-1/2">
                <div className="md:w-4/5 sm:w-full">
                    {Object.keys(mensaje).length > 0 && (
                        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                    )}

                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-300">
                        Olvidaste tu contraseña
                    </h1>
                    <small className="text-gray-400 block my-4 text-sm mx-2">
                        No te preocupes, ingresa el correo para recuperar la contraseña
                    </small>

                    <form onSubmit={handleSubmit} className="mx-2">
                        <div className="mb-1">
                            <label className="mb-2 block text-sm font-semibold">Correo</label>
                            <input
                                type="correo"
                                placeholder="Ingrese el correo de registro"
                                className="block w-full rounded-md border border-gray-300 focus:border-white focus:outline-none focus:ring-1 focus:ring-white py-1 px-1.5 text-white bg-black"
                                name="correo"
                                value={mail.correo}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <button className="bg-gray-600 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white">
                                Enviar
                            </button>
                        </div>
                    </form>

                    <div className="my-20"></div>

                    <div className="mt-3 text-sm flex justify-between items-center text-gray-200">
                        <p>Ya tienes una cuenta</p>
                        <Link
                            to="/login"
                            className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white"
                        >
                            Inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>

            <div
                className="w-1/2 h-screen bg-[url('/public/images/bottle-695375_1280.jpg')] 
                bg-no-repeat bg-cover bg-center sm:block hidden"
            ></div>
        </>
    );
};
