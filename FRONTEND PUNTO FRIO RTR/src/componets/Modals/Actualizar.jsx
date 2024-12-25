import React, { useMemo } from "react";

const ActualizarCliente = ({ clienteSeleccionado, mostrarModal, setMostrarModal }) => {
  const clienteInicial = useMemo(() => clienteSeleccionado, [clienteSeleccionado]);

  const actualizarCliente = async (clienteActualizado) => {
    const token = localStorage.getItem("token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/cliente/${clienteActualizado._id}`;
    await axios.put(url, clienteActualizado, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <FormularioCliente
      clienteInicial={clienteInicial}
      mostrarModal={mostrarModal}
      setMostrarModal={setMostrarModal}
      onSubmit={actualizarCliente}
      titulo="Actualizar Cliente"
      mensajeExito="Cliente actualizado exitosamente"
    />
  );
};

export default ActualizarCliente;
