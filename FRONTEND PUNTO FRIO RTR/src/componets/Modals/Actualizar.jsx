import React, { useState, useEffect } from "react";
import axios from "axios";

const Actualizar = ({ producto, isOpen, onClose, onUpdate }) => {
  const [categorias, setCategorias] = useState([]);
  const categoriasUnicas = Array.from(new Set(categorias.map(a => a._id)))
  .map(id => categorias.find(a => a._id === id));
  const [formData, setFormData] = useState({
    nombre: "",
    categoria_id: "",
    precio: "",
    retornable: false,
  });

  useEffect(() => {
    if (producto && isOpen) {
      setFormData({
        nombre: producto.nombre || "",
        categoria_id: producto.categoria_id || "",
        precio: producto.precio || "",
        retornable: !!producto.retornable,
      });
    }
  }, [producto, isOpen]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_BACKEND_URL}/categorias?limite=100`;
        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        // Eliminar duplicados de categorías por `_id` directamente al cargar
        const categoriasUnicas = Array.from(new Set(data.map((cat) => cat._id)))
          .map((id) => data.find((cat) => cat._id === id));
    
        setCategorias(categoriasUnicas);
      } catch (error) {
        console.error("Error al obtener las categorías:", error.response?.data || error.message);
      }
    };    
  
    fetchCategorias();
  }, []);
  
  useEffect(() => {
    const fetchCategoria = async () => {
      if (producto && producto.categoria_id) {
        const categoriaId = producto.categoria_id._id || producto.categoria_id;
        try {
          const token = localStorage.getItem("token");
          const url = `${import.meta.env.VITE_BACKEND_URL}/categoria/${categoriaId}`;
          const { data } = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          setCategorias((prevCategorias) => {
            // Solo añade la categoría si no está presente
            const existe = prevCategorias.some((cat) => cat._id === data._id);
            return existe ? prevCategorias : [data, ...prevCategorias];
          });
        } catch (error) {
          console.error("Error al cargar la categoría:", error.response?.data || error.message);
        }
      }
    };    
  
    fetchCategoria();
  }, [producto]);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(({
      ...formData,
      [name]: type === "checkbox" ? checked : name === "retornable" ? value === "true" : value, 
    }));
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/producto/${producto._id}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      await axios.put(url, formData, { headers });
      alert("Producto actualizado correctamente");
      onUpdate(); // Refresca la lista de productos
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al actualizar el producto:", error.response?.data || error.message);
      alert("No se pudo actualizar el producto. Intenta nuevamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Actualizar Producto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Categoría</label>
            <select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              {/* Si el producto tiene categoría, mostrarla como predeterminada */}
              {!formData.categoria_id && <option value="">Seleccionar categoría</option>}
              {categoriasUnicas.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tipo de Envase</label>
            <div>
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="retornable"
                  value="true" // Representa el valor true
                  checked={formData.retornable === true}
                  onChange={(e) => handleChange(e)}
                  className="mr-2"
                />
                Retornable
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="retornable"
                  value="false" // Representa el valor false
                  checked={formData.retornable === false}
                  onChange={(e) => handleChange(e)}
                  className="mr-2"
                />
                No Retornable
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
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

export default Actualizar;
