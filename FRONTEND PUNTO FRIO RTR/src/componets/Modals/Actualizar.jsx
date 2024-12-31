import React, { useState, useEffect } from "react";
import axios from "axios";

const Actualizar = ({ producto, isOpen, onClose, onUpdate }) => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    categoria_id: "",
    precio: "",
    retornable: false,
  });

  // Consolidar la lógica de categorías únicas
  const obtenerCategoriasUnicas = (categorias) =>
    Array.from(new Set(categorias.map((cat) => cat._id))).map((id) =>
      categorias.find((cat) => cat._id === id)
    );

  useEffect(() => {
    if (producto && isOpen) {
      setFormData({
        nombre: producto.nombre || "",
        categoria_id: producto.categoria_id?._id || producto.categoria_id || "",
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
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(obtenerCategoriasUnicas(data));
      } catch (error) {
        console.error("Error al obtener las categorías:", error.response?.data || error.message);
      }
    };

    if (isOpen) {
      fetchCategorias();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/producto/${producto._id}`;
      await axios.put(url, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
              <option value="">Seleccionar categoría</option>
              {categorias.map((categoria) => (
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
              min="0"
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
                  value={true}
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
                  value={false}
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
