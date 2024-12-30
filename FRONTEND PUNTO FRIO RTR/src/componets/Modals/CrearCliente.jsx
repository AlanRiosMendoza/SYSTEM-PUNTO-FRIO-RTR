import React, { useState } from "react";
import axios from "axios";
import FormularioCliente from "../FormularioCliente";

const CrearCliente = ({ mostrarModal, setMostrarModal }) => {
  const agregarCliente = async (nuevoCliente) => {
    const token = localStorage.getItem("token");
    const url = `${import.meta.env.VITE_BACKEND_URL}/cliente`;
    await axios.post(url, nuevoCliente, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <FormularioCliente
      mostrarModal={mostrarModal}
      setMostrarModal={setMostrarModal}
      onSubmit={agregarCliente}
      titulo="Crear Cliente"
      mensajeExito="Cliente creado exitosamente"
    />
  );
};

export default CrearCliente;
