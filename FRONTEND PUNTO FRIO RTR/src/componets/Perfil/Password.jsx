import { useState, useContext } from "react"
import Mensaje from "../Alertas/Mensaje"
import AuthContext from "../../context/AuthProvider"

const Password = () => {
    const { actualizarPassword } = useContext(AuthContext);
    const [mensaje, setMensaje] = useState({})
    const [form, setForm] = useState({
        passwordactual:"",
        passwordnuevo:""
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(form).includes(""))
        {
            setMensaje({ respuesta: "Todos los campos deben ser ingresados", tipo: false })
                setTimeout(() => {
                    setMensaje({})
                }, 3000);
            return
        }

		if (form.passwordnuevo.length < 6)
        {
            setMensaje({ respuesta: "El password debe tener mínimo 6 carácteres", tipo: false })
            setTimeout(() => {
                setMensaje({})
            }, 3000);
        return
        }
        // Enviar datos al backend
        const resultado = await actualizarPassword({
            antiguaContrasenia: form.passwordactual,
            contrasenia: form.passwordnuevo,
        });

        // Manejo de la respuesta del backend
        setMensaje({ respuesta: resultado.respuesta, tipo: resultado.tipo });
        setTimeout(() => {
            setMensaje({});
        }, 3000);

        // Opcional: Resetear formulario si fue exitoso
        if (resultado.tipo) {
            setForm({
                passwordactual: "",
                passwordnuevo: "",
            });
        }
}

    return (
        <>
        <div className='mt-5'>
            <h1 className='font-black text-3xl mb-6 text-gray-500'>Actualizar Contraseña</h1>
        </div>
        <form  onSubmit={handleSubmit}>
	     {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
             <div>
                <label
                    htmlFor='passwordactual'
                    className='text-gray-700 uppercase font-bold text-sm'>Password actual: </label>
                <input
                    id='passwordactual'
                    type="password"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='**************'
                    name='passwordactual'
                    value={form.passwordactual}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label
                    htmlFor='passwordnuevo'
                    className='text-gray-700 uppercase font-bold text-sm'>Nuevo password: </label>
                <input
                    id='passwordnuevo'
                    type="password"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='**************'
                    name='passwordnuevo'
                    value={form.passwordnuevo}
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                className='bg-gray-800 w-full p-3 
        text-slate-300 uppercase font-bold rounded-lg 
        hover:bg-gray-600 cursor-pointer transition-all'
                value='Actualizar' />
        </form>
        </>
    )
}

export default Password