import React from 'react'
import { Formulario } from '../componets/Formulario'

const Crear = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Ingreso de productos</h1>
            <hr className='my-4' />
            <p className='mb-8'>Ingrese el nuevo producto, no olvide llenar cada campo obligatorio</p>
            <Formulario />
        </div>
    )
}

export default Crear