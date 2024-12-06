import React, { useState } from "react";
import axios from "axios";

const FormularioCliente = ({ onClienteCreado }) => {
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    telefono: "",
    direccion: "",
  });

  const [mensaje, setMensaje] = useState(""); // Mensaje de error o éxito
  const [clienteID, setClienteID] = useState(null); // Guardar el ID del cliente creado

  // Manejar cambios en los inputs
  const manejarCambio = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  // Manejar el envío del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (
      !cliente.nombre ||
      !cliente.apellido ||
      !cliente.cedula ||
      !cliente.correo ||
      !cliente.telefono
    ) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    if (!/^\d{10}$/.test(cliente.telefono)) {
      setMensaje("El teléfono debe tener 10 dígitos.");
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(cliente.correo)) {
      setMensaje("El correo electrónico no es válido.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/cliente`;

      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.post(url, cliente, options);

      if (respuesta.status === 201) {
        // Extraer el ID del cliente recién creado
        const idCreado = respuesta.data.nuevoCliente._id;
        setClienteID(idCreado);

        setMensaje("Cliente creado con éxito. ID: " + idCreado);

        if (onClienteCreado) {
          onClienteCreado(idCreado); // Pasar el ID al componente superior
        }
        
        setCliente({
          nombre: "",
          apellido: "",
          cedula: "",
          correo: "",
          telefono: "",
          direccion: "",
        }); // Resetear formulario

        setTimeout(() => {
          setMensaje("");
      }, 3000);
      }
    } catch (error) {
      const msg = error.response?.data?.msg || "Hubo un error al crear el cliente.";
      setMensaje(msg);
      setTimeout(() => {
        setMensaje("");
    }, 4000);
    }
  };

  return (
    <div className="p-2 min-h-screen">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Cliente</h2>

        {/* Mostrar mensaje */}
        {mensaje && (
          <div
            className={`p-4 mb-4 text-sm rounded-md ${
              mensaje.includes("éxito")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {mensaje}
          </div>
        )}

        {/* Mostrar ID del cliente si fue creado
        {clienteID && (
          <div className="p-4 mb-4 text-sm bg-blue-100 text-blue-700 rounded-md">
            Cliente creado con el ID: {clienteID}
          </div>
        )} */}

        {/* Formulario */}
        <form onSubmit={manejarEnvio}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={cliente.nombre}
              onChange={manejarCambio}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={cliente.apellido}
              onChange={manejarCambio}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cédula
            </label>
            <input
              type="text"
              name="cedula"
              maxLength="10" // Máximo 10 caracteres
              value={cliente.cedula}
              onChange={manejarCambio}
              pattern="\d{10}" // Acepta solo números
              title="La cédula debe contener exactamente 10 dígitos numéricos"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={cliente.correo}
              onChange={manejarCambio}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              maxLength="10" // Máximo 10 caracteres
              value={cliente.telefono}
              onChange={manejarCambio}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={cliente.direccion}
              onChange={manejarCambio}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Crear Cliente
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioCliente;
