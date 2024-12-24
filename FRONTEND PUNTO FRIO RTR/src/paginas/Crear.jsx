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
    <div>
      <h1 className='font-black text-4xl text-gray-500'>Ingreso de productos</h1>
      <hr className='my-4' />
      <p className='mb-8'>Ingrese el nuevo producto, no olvide llenar cada campo obligatorio</p>
      
      {/* Botón para alternar entre Formulario y Categoria */}
      <div className="mb-4">
        <button
          onClick={toggleVista}
          className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-all"
        >
          {mostrarFormulario ? 'Ver Categorías' : 'Ver Formulario'}
        </button>
      </div>

      {/* Mostrar el componente dependiendo del estado */}
      {mostrarFormulario ? <Formulario /> : <Categoria />}
    </div>
  );
};

export default Crear;
