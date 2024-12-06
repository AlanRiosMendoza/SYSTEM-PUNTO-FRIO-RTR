import {Link} from 'react-router-dom'
import AuthContext from '../context/AuthProvider'
import { useContext, useState, useEffect} from 'react'
import axios from 'axios'
import Mensaje from '../componets/Alertas/Mensaje'
import { useNavigate } from 'react-router-dom'


const Login = () => {

    const {auth, setAuth} = useContext(AuthContext)
    const navigate = useNavigate()
    const [mensaje, setMensaje] = useState({})
    const [form, setForm] = useState({
        correo:"",
        contrasenia:""
    })

    const handlerChange = (e) => {
        setForm({...form,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/login`;
            const respuesta = await axios.post(url, form);
            localStorage.setItem('token' ,respuesta.data.token)
            setAuth(respuesta.data)
            // navigate('/dashboard')
        } catch (error) {
            console.log(error)
            if (error.response) {
                // Verifica la estructura del error en el backend
                const errorMessage = error.response.data?.msg || "Error desconocido";  // Si no hay 'msg', muestra un mensaje por defecto
                
                // Si el backend tiene errores en un array (como en `errors[0].msg`)
                const validationErrorMessage = error.response.data?.errors?.[0]?.msg;
            
                setMensaje({
                  respuesta: validationErrorMessage || errorMessage, // Usa el mensaje de validación o el mensaje por defecto
                  tipo: false // Esto indica que es un mensaje de error
                });
              } else {
                // Si no hay una respuesta (error de red, servidor no disponible, etc.)
                setMensaje({
                  respuesta: "Error de conexión o el servidor no respondió.",
                  tipo: false
                });
            }
        }
    }

    // Realiza la navegación solo después de que se haya actualizado el estado
    useEffect(() => {
        if (auth?.nombre) {
            navigate('/dashboard');  // Solo navega si los datos de auth están disponibles
        }
    }, [auth, navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !auth?.nombre) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/perfil`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    setAuth(response.data);
                } catch (error) {
                    console.log("Error al obtener el perfil:", error);
                }
            };
            fetchUserData();
        }
    }, [auth]);

    return (
        <>
            <div className="w-1/2 h-screen bg-[url('/images/crop-man-with-beer-browsing-tablet.jpg')] 
            bg-no-repeat bg-cover bg-center sm:block hidden
            ">
            </div>

            <div className="w-1/2 h-screen bg-orange-200 flex justify-center items-center">
                
                <div className="md:w-4/5 sm:w-full">
                
                    {Object.keys(mensaje).length>0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase  text-gray-500" >Inicio de sesión</h1>
                    <small className="text-gray-600 block my-4 text-sm">Por favor ingrese los siguientes campos</small>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Correo</label>
                            <input type="email" 
                            name="correo" value={form.correo || ""} onChange={handlerChange}
                            placeholder="Ingrese su correo" 
                            className="block w-full bg-orange-50 rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500" />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Contraseña</label>
                            <input type="password" 
                            name="contrasenia" value={form.contrasenia || ""} onChange={handlerChange}
                            placeholder="Ingrese su contarseña" 
                            className="block w-full bg-orange-50 rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500" />
                        </div>

                        <div className="my-8">
                            <button className="py-2 w-full block text-center bg-gray-500 text-slate-300 border rounded-xl hover:scale-100 duration-300 hover:bg-gray-900 hover:text-white">Inicio</button>
                        </div>

                    </form>

                    <div className="mt-5 text-xs border-b-2 py-4 ">
                        <Link to="/forgot/id" className="underline text-sm text-gray-600 hover:text-gray-900">Olvidaste tu contraseña</Link>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Login