import React, { useState, useContext } from 'react'; 
import Tabla from '../componets/Tabla';
import AuthContext from '../context/AuthProvider';
import Inventario from './Inventario'; // Asegúrate de importar el componente de inventarios

const Listar = () => {
  // Estado para alternar entre la tabla de productos y el inventario
  const [mostrarInventario, setMostrarInventario] = useState(false);
  const { auth } = useContext(AuthContext);

  // Función para alternar entre la vista de tabla y la vista de inventario
  const toggleVista = () => {
    setMostrarInventario(!mostrarInventario);
  };

  return (
    <div>
      <h1 className="font-black text-4xl text-gray-500">Lista de productos</h1>
      <div className="mb-4 mt-4">
        <p className="mb-2">Aquí encontrarás todos los productos que el establecimiento posee 😁</p>
      </div>

      {/* Mostrar elementos según el rol del usuario */}
      {auth.rol === "administrador" && (
        <>
          {/* Botón para alternar entre las vistas */}
          <button 
            onClick={toggleVista}
            className="bg-blue-500 text-white p-2 rounded mt-4"
          >
            {mostrarInventario ? 'Ver Tabla de Productos' : 'Ver Inventario'}
          </button>

          {/* Mostrar la vista de Inventario si el estado es verdadero, sino mostrar la tabla */}
          {mostrarInventario ? <Inventario /> : <Tabla />}
        </>
      )}

      {auth.rol === "cajero" && (
        <>
          {/* Solo se muestra la tabla si el rol es cajero */}
          <Tabla />
        </>
      )}
    </div>
  );
};

export default Listar;
