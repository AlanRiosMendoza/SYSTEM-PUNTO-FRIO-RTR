import React, { useState } from 'react';
import axios from 'axios';

const Buscar = () => {

  const [nombre, setNombre] = useState('');
  const [productos, setProductos] = useState([]);
  
  const buscarProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_BACKEND_URL}/productos?nombre=${nombre}`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      
      const respuesta = await axios.get(url, options);
      setProductos(respuesta.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <h1 className="text-xl font-bold">Buscar Productos</h1>

      {/* diseño de boton */}
      <hr className='my-4' />
        <button
            className="mb-8 bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
            ¿Deseas buscar algún producto?
        </button>
      <p className="mb-8">
          Productos disponibles
      </p>
      {/* fin de diseño de boton */}

      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Buscar por nombre..."
        className="p-2 border rounded"
      />
      <button
        onClick={buscarProductos}
        className="bg-blue-500 text-white p-2 rounded ml-2"
      >
        Buscar
      </button>
      
      <div className="mt-4">
        <h2 className="font-bold">Resultados:</h2>
        <ul>
          {productos.map((producto) => (
            <li key={producto._id}>
              {producto.nombre} - ${producto.precio}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

    // const [nombre, setNombre] = useState('');
    // const [productos, setProductos] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState('');

    // const buscarProductos = async () => {
    //     if (nombre.trim() === '') {
    //         setProductos([]);  // Si no hay texto en la barra de búsqueda, limpiar los resultados
    //         return;
    //     }

    //     setLoading(true);  // Iniciar carga
    //     setError('');  // Limpiar errores

    //     try {
    //         const token = localStorage.getItem('token');
    //         const url = `${import.meta.env.VITE_BACKEND_URL}/productos/${nombre}`;
    //         const options = {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             }
    //         };
    //         const respuesta = await axios.get(url, options);
    //         setProductos(respuesta.data);  // Actualizar el estado con los productos encontrados
    //     } catch (err) {
    //         setError('No se encontraron productos o hubo un error en la búsqueda.');
    //     } finally {
    //         setLoading(false);  // Finalizar carga
    //     }
    // };

    // return (
    //     <div className="p-4">
    //         <h1 className="font-black text-4xl text-gray-500 mb-4">Buscar Producto</h1>
            
    //         {/* Barra de búsqueda */}
    //         <input
    //             type="text"
    //             placeholder="Buscar producto por nombre..."
    //             value={nombre}
    //             onChange={(e) => setNombre(e.target.value)}  // Actualizar el estado del nombre
    //             onKeyUp={buscarProductos}  // Activar la búsqueda al escribir
    //             className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
    //         />
            
    //         {loading && <p>Cargando...</p>}  {/* Mostrar mensaje de carga */}
    //         {error && <p className="text-red-500">{error}</p>}  {/* Mostrar errores */}

    //         {/* Mostrar los resultados de búsqueda */}
    //         {productos.length > 0 && (
    //             <table className="w-full mt-5 table-auto shadow-lg bg-white">
    //                 <thead className="bg-gray-800 text-slate-400">
    //                     <tr>
    //                         <th className="p-2">N°</th>
    //                         <th className="p-2">Nombre</th>
    //                         <th className="p-2">Precio</th>
    //                         <th className="p-2">Stock</th>
    //                         <th className="p-2">Acciones</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {productos.map((producto, index) => (
    //                         <tr className="border-b hover:bg-gray-300 text-center" key={producto._id}>
    //                             <td>{index + 1}</td>
    //                             <td>{producto.nombre}</td>
    //                             <td>{producto.precio}</td>
    //                             <td>{producto.stock}</td>
    //                             <td>
    //                                 <button className="bg-blue-500 text-white py-1 px-4 rounded">Ver detalles</button>
    //                             </td>
    //                         </tr>
    //                     ))}
    //                 </tbody>
    //             </table>
    //         )}

    //         {productos.length === 0 && !loading && (
    //             <p>No se encontraron productos con ese nombre.</p>
    //         )}
    //     </div>
    // );
}
export default Buscar