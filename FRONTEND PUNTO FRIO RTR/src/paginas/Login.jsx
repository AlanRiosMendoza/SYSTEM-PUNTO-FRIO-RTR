import {Link} from 'react-router-dom'

const Login = () => {


    return (
        <>
            <div className="w-1/2 h-screen bg-[url('/images/crop-man-with-beer-browsing-tablet.jpg')] 
            bg-no-repeat bg-cover bg-center sm:block hidden
            ">
            </div>

            <div className="w-1/2 h-screen bg-orange-200 flex justify-center items-center">
                
                <div className="md:w-4/5 sm:w-full">
                
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase  text-gray-500" >Inicio de sesión</h1>
                    <small className="text-gray-600 block my-4 text-sm">Por favor ingrese los siguientes campos</small>


                    <form >
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Correo</label>
                            <input type="email" placeholder="Ingrese su correo" 
                            className="block w-full bg-orange-50 rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500" />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Contraseña</label>
                            <input type="password" placeholder="Ingrese su contarseña" 
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