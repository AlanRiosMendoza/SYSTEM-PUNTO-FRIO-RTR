import { useState } from "react";
import axios from "axios";
import Mensaje from "../Alertas/Mensaje";

const Visualizar = ({ producto, isOpen, onClose, onUpdate }) => {
    const [cantidad, setCantidad] = useState("");
    const [mensaje, setMensaje] = useState(null);

    if (!isOpen || !producto) return null; // Si el modal está cerrado o no hay producto, no renderizar

    const handleActualizarStock = async () => {
        try {
            if (!cantidad || isNaN(cantidad)) {
                setMensaje({ tipo: false, texto: "Por favor ingresa una cantidad válida." });
                setTimeout(() => setMensaje(""), 4000);
                return;
            }

            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/inventario`;

            const data = {
                producto_id: producto._id,
                cantidad: parseInt(cantidad, 10),
            };

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            await axios.post(url, data, { headers });

            setMensaje({ tipo: true, texto: "Stock actualizado correctamente." });
            setCantidad("");
            onUpdate(); // Refresca la lista en la tabla
            onClose();  // Cierra el modal
        } catch (error) {
            console.error("Error al actualizar el stock:", error.response?.data || error.message);
            setMensaje({ tipo: false, texto: "No se pudo actualizar el stock. Intenta nuevamente." });
            setTimeout(() => setMensaje(""), 4000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Actualizar Stock</h2>

                {mensaje && (
                    <Mensaje tipo={mensaje.tipo}>{mensaje.texto}</Mensaje>
                )}

                <p className="mb-4">Producto: <span className="font-medium">{producto.nombre}</span></p>

                <div className="mb-4">
                    <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">
                        Cantidad a añadir al stock:
                    </label>
                    <input
                        type="number"
                        id="cantidad"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleActualizarStock}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Visualizar;
