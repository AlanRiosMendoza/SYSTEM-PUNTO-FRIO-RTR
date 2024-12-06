import React, { useState } from 'react';
import Tabla from '../componets/Tabla';

const Listar = () => {
    const [filtro, setFiltro] = useState('todos'); // Estado para el filtro

    const manejarCambioFiltro = (evento) => {
        setFiltro(evento.target.value); // Actualiza el filtro cuando cambie
    };

    return (
        <div>
            <h1 className="font-black text-4xl text-gray-500">Lista de productos</h1>            
            <div className="mb-4 mt-4">
                <p className="mb-2">Filtrar productos:</p>
                <label className="mr-4">
                    <input
                        type="radio"
                        name="filtro"
                        value="todos"
                        checked={filtro === 'todos'}
                        onChange={manejarCambioFiltro}
                        className="mr-1"
                    />
                    Todos
                </label>
                <label className="mr-4">
                    <input
                        type="radio"
                        name="filtro"
                        value="activos"
                        checked={filtro === 'activos'}
                        onChange={manejarCambioFiltro}
                        className="mr-1"
                    />
                    Activos
                </label>
                <label className="mr-4">
                    <input
                        type="radio"
                        name="filtro"
                        value="inactivos"
                        checked={filtro === 'inactivos'}
                        onChange={manejarCambioFiltro}
                        className="mr-1"
                    />
                    Inactivos
                </label>
            </div>
            <Tabla filtro={filtro} />
        </div>
    );
};

export default Listar;
