import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Mensaje from "../componets/Alertas/Mensaje";

const Restablecer = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [form, setForm] = useState({
    contrasenia: "",
    confirmarContrasenia: "",
  });
  const [mensaje, setMensaje] = useState({});
  const [tokenValido, setTokenValido] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.contrasenia !== form.confirmarContrasenia) {
      setMensaje({ respuesta: "Las contraseñas no coinciden", tipo: false });
      return;
    }

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/nuevo-password/${token}`;
      const respuesta = await axios.post(url, { contrasenia: form.contrasenia });
      setMensaje({ respuesta: respuesta.data.msg, tipo: true });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMensaje({ respuesta: error.response.data.msg, tipo: false });
    }
  };

  const verifyToken = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/nuevo-password/${token}`;
      await axios.get(url);
      setTokenValido(true);
    } catch (error) {
      setMensaje({ respuesta: error.response.data.msg, tipo: false });
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-[#b2ffff] via-[#59d8d4] to-[#337bb3]">
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-lg">
        {/* Mensaje dinámico */}
        {Object.keys(mensaje).length > 0 && (
          <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
        )}

        {/* Título */}
        <h1 className="text-3xl font-semibold mb-4 text-center uppercase text-gray-800">
          Restablecimiento de Contraseña
        </h1>
        <small className="text-gray-600 block mb-6 text-sm text-center">
          Ingrese su nueva contraseña para continuar.
        </small>

        {/* Formulario */}
        {tokenValido && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Nueva Contraseña
              </label>
              <input
                type="password"
                name="contrasenia"
                value={form.contrasenia || ""}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 py-2 px-3 bg-gray-100 text-gray-800"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmarContrasenia"
                value={form.confirmarContrasenia || ""}
                onChange={handleChange}
                placeholder="Repita su contraseña"
                className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 py-2 px-3 bg-gray-100 text-gray-800"
              />
            </div>

            <div className="mb-6">
              <button className="py-2 w-full bg-blue-600 text-white border rounded-md hover:scale-105 duration-300 hover:bg-blue-700">
                Restablecer Contraseña
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Restablecer;
