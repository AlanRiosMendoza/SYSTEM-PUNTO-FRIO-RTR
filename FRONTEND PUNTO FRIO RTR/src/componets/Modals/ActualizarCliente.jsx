import React from "react";

const ActualizarCliente = ({
  clienteSeleccionado,
  setClienteSeleccionado,
  setMostrarModal,
  actualizarCliente,
}) => {
  if (!clienteSeleccionado) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteSeleccionado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarCliente(clienteSeleccionado._id, clienteSeleccionado);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Actualizar Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={clienteSeleccionado.nombre || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={clienteSeleccionado.apellido || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Cédula</label>
            <input
              type="text"
              name="cedula"
              value={clienteSeleccionado.cedula || ""}
              maxLength="10"
              onChange={(e) => {
                if (/^\d*\.?\d{0}$/.test(e.target.value)) {
                  handleChange(e);
                }
              }}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Correo</label>
            <input
              type="email"
              name="correo"
              value={clienteSeleccionado.correo || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={clienteSeleccionado.telefono || ""}
              maxLength="10"
              onChange={(e) => {
                if (/^\d*\.?\d{0}$/.test(e.target.value)) {
                  handleChange(e);
                }
              }}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={clienteSeleccionado.direccion || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMostrarModal(false)}
              className="px-4 py-2 bg-gray-300 rounded mr-2"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActualizarCliente;