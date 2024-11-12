import { useState } from "react"
import Mensaje from '../componets/Alertas/Mensaje'
import axios from "axios"

export const Register = () => {

    const [mensaje, setMensaje] = useState({})

    const [form, setform] = useState({
        nombre:"",
        apellido:"",
        cedula:"",
        correo:"",
        contrasenia:"",
        telefono:"",
        rol:""
    })

    const handlerChange = (e) => {
        // Si el campo es 'rol', transformamos el valor a minúsculas
        const value = e.target.name === "rol" ? e.target.value.toLowerCase() : e.target.value;
        
        setform({...form,
            [e.target.name]:e.target.value
        })
    }

    const handlerSubmit = async(e) => {
        e.preventDefault()
        // Validación del campo 'rol'
        if (form.rol !== "cajero" && form.rol !== "administrador") {
            setMensaje({ respuesta: "El rol debe ser 'cajero' o 'administrador'.", tipo: false });
            return; // Detener el envío del formulario si la validación falla
        }
        try {
            const url = "http://localhost:3000/api/v1/registro"
            const respuesta = await axios.post(url, form)
            setMensaje({respuesta:respuesta.data.msg,tipo:true})
            setform({})
        } catch (error) {
            setMensaje({respuesta:error.response.data?.errors[0].msg,tipo:false})
        }
    }

    return (
        <>
            
            <div className="bg-transparent flex justify-center items-baseline">

                <div className="md:w-4/5 sm:w-full my-2">
                
                {Object.keys(mensaje).length>0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-700">Bienvenido</h1>
                    <small className="text-gray-700 block my-4 text-sm">Ingresa los siguientes detalles</small>


                    <form className="mx-2" onSubmit={handlerSubmit}>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="nombre">Nombre</label>
                            <input type="name" 
                            id="nombre" name="nombre" value={form.nombre || ""} onChange={handlerChange}
                            placeholder="Ingresar nombre" className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black" required/>
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="apellido">Apellido</label>
                            <input type="name" 
                            id="apellido" name="apellido" value={form.apellido || ""} onChange={handlerChange}
                            placeholder="Ingresar apellido" className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black" />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="cedula">Cédula</label>
                            <input type="tel" 
                            id="cedula" name="cedula" value={form.cedula || ""} onChange={handlerChange}
                            placeholder="099999999" className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black" />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="correo">Correo</label>
                            <input type="email" 
                            id="correo" name="correo" value={form.correo || ""} onChange={handlerChange}
                            placeholder="Ingresa tu correo" className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black" />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="contrasenia">Contraseña</label>
                            <input type="password" 
                            id="contrasenia" name="contrasenia" value={form.contrasenia || ""} onChange={handlerChange}
                            placeholder="********************" className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black" />
                        </div>
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="telefono">Teléfono</label>
                            <input type="tel" 
                            id="telefono" name="telefono" value={form.telefono || ""} onChange={handlerChange}
                            placeholder="0987654321" className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black" />
                        </div>
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold text-gray-400" htmlFor="rol">Rol</label>
                            <input type="text" 
                            id="rol" name="rol" value={form.rol || ""} onChange={handlerChange}
                            placeholder="Cajero o Administrador" className="block w-full rounded-md border border-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 py-1 px-1.5 bg-white text-black" />
                        </div>
                        
                        <div className="mb-3">
                            <button className="bg-gray-500 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white " >Registrar
                            </button>
                        </div>

                    </form>

                </div>

            </div>

            {/* <div className="w-1/2 h-screen bg-[url('public/images/drink-1593837_1280.jpg')] 
            bg-no-repeat bg-cover bg-center sm:block hidden
            ">
            </div> */}
        </>
    )
}
