import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import Mensaje from "../Alertas/Mensaje";

const FormularioPerfil = () => {
    const [mensaje, setMensaje] = useState({});
    const { auth, actualizarPerfil } = useContext(AuthContext);

    const [form, setForm] = useState({
        id: auth._id || "",
        nombre: auth.nombre || "",
        apellido: auth.apellido || "",
        cedula: auth.cedula || "",
        telefono: auth.telefono || "",
        correo: auth.correo || "",
    });

    // Sincroniza los datos de `auth` con el formulario cuando `auth` cambia
    useEffect(() => {
        setForm({
            id: auth._id || "",
            nombre: auth.nombre || "",
            apellido: auth.apellido || "",
            cedula: auth.cedula || "",
            telefono: auth.telefono || "",
            correo: auth.correo || "",
        });
    }, [auth]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(form).includes("")) {
            setMensaje({ respuesta: "Todos los campos deben ser ingresados", tipo: false });
            setTimeout(() => {
                setMensaje({});
            }, 3000);
            return;
        }
        const resultado = await actualizarPerfil(form);
        setMensaje(resultado);
        setTimeout(() => {
            setMensaje({});
        }, 3000);
    };

    return (
        <form onSubmit={handleSubmit}>
            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

            <div>
                <label htmlFor="nombre" className="text-gray-700 uppercase font-bold text-sm">
                    Nombre:
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
                <label htmlFor="apellido" className="text-gray-700 uppercase font-bold text-sm">
                    Apellido:
                </label>
                <input
                    id="apellido"
                    type="text"
                    className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
                    placeholder="Apellido"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="cedula" className="text-gray-700 uppercase font-bold text-sm">
                    Identificación:
                </label>
                <input
                    id="cedula"
                    type="text"
                    className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
                    placeholder="Identificación"
                    name="cedula"
                    value={form.cedula}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="telefono" className="text-gray-700 uppercase font-bold text-sm">
                    Teléfono:
                </label>
                <input
                    id="telefono"
                    type="text"
                    className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
                    placeholder="Teléfono"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="correo" className="text-gray-700 uppercase font-bold text-sm">
                    Correo electrónico:
                </label>
                <input
                    id="correo"
                    type="email"
                    className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
                    placeholder="Correo electrónico"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                className="bg-gray-800 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-600 cursor-pointer transition-all"
                value="Actualizar"
            />
        </form>
    );
};

export default FormularioPerfil;
