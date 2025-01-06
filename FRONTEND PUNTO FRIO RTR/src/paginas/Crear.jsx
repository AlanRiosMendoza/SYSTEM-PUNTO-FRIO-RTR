import React, { useState } from 'react';
import { Formulario } from '../componets/Formulario';
import Categoria from '../componets/Categoria';

const Crear = () => {
  // Estado para controlar la vista actual
  const [mostrarFormulario, setMostrarFormulario] = useState(true);

  // Función para alternar entre Formulario y Categoria
  const toggleVista = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  return (
    <div className="p-4">
      <h1 className="font-black text-2xl sm:text-4xl text-gray-500 text-center">
        Ingreso de productos
      </h1>
      <hr className="my-4" />
      <p className="mb-8 text-sm sm:text-base">
        Ingrese el nuevo producto, no olvide llenar cada campo obligatorio
      </p>
  
      {/* Botón para alternar entre Formulario y Categoría */}
      <div className="mb-4 flex justify-center">
        <button
          onClick={toggleVista}
          className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-all w-full sm:w-auto"
        >
          {mostrarFormulario ? "Ver Categorías" : "Ver Formulario"}
        </button>
      </div>
  
      {/* Mostrar el componente dependiendo del estado */}
      <div className="mt-4">
        {mostrarFormulario ? <Formulario /> : <Categoria />}
      </div>
    </div>
  );
};

export default Crear;
