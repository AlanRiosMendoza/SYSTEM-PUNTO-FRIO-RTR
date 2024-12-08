import React from 'react';
import Tabla from '../componets/Tabla';

const Listar = () => {

    return (
        <div>
            <h1 className="font-black text-4xl text-gray-500">Lista de productos</h1>            
            <div className="mb-4 mt-4">
                <p className="mb-2">Aqui encontraras todos los productos que el establecimiento posee 😁</p>
            </div>
            <Tabla />
        </div>
    );
};

export default Listar;
