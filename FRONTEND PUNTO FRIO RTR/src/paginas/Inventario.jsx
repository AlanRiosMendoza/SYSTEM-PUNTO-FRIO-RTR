import React from 'react'
import Tabla from '../componets/Tabla'

const Inventario = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Agregar...</h1>
            <hr className='my-4' />
            <p className='mb-8'>Este módulo te permite registrar un nuevo .....</p>
            <Tabla />
        </div>
    )
}

export default Inventario