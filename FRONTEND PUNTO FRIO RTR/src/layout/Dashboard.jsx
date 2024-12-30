import AuthContext from '../context/AuthProvider';
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

const Dashboard = () => {
    const location = useLocation();
    const urlActual = location.pathname;

    const { auth } = useContext(AuthContext);
    const [localAuth, setLocalAuth] = useState(null); 
    const autenticado = localStorage.getItem('token');

    const links = [
        { to: '/dashboard', label: 'Perfil' },
        { to: '/dashboard/listar', label: 'Listar' },
        { to: '/dashboard/crear', label: 'Crear' },
        { to: '/dashboard/CajaDeVenta', label: 'Caja de venta' },
        { to: '/dashboard/register', label: 'Registrar' },
    ];

    useEffect(() => {
        if (auth?.nombre || auth?.rol) {
            setLocalAuth(auth); // Actualiza el estado local cuando el contexto tenga los datos
        }
    }, [auth]);

    if (!autenticado) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="md:flex md:min-h-screen">
            {/* Sidebar */}
            <div className="md:w-1/5 bg-gray-800 px-5 py-4">
                <h2 className="text-4xl font-black text-center text-slate-200">Sistema de Ventas</h2>

                <img
                    src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
                    alt="Usuario conectado"
                    className="m-auto mt-8 p-1 border-2 border-slate-500 rounded-full"
                    width={120}
                    height={120}
                />
                <p className="text-slate-400 text-center my-4 text-sm">
                    <span className="bg-green-600 w-3 h-3 inline-block rounded-full"></span> Bienvenido - {localAuth?.nombre || "Cargando..."}
                </p>
                <p className="text-slate-400 text-center my-4 text-sm">Rol - {localAuth?.rol || "Cargando..."}</p>
                <hr className="mt-5 border-slate-500" />

                {/* Links de navegación */}
                <ul className="mt-5">
                    {links.map((link) => (
                        <li key={link.to} className="text-center">
                            <Link
                                to={link.to}
                                className={`${
                                    urlActual === link.to
                                        ? 'text-slate-200 bg-gray-900 px-3 py-2 rounded-md'
                                        : 'text-slate-600'
                                } text-xl block mt-2 hover:text-slate-600`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-between h-screen bg-green-100">
            {/* Encabezado */}
            <div className="bg-gray-800 py-2 flex md:justify-end items-center gap-5 justify-center">
                <div className="text-md font-semibold text-slate-100">Bienvenido - {localAuth?.nombre || "Cargando..."}</div>
                    <div>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
                            alt="Usuario conectado"
                            className="border-2 border-green-600 rounded-full"
                            width={50}
                            height={50}
                        />
                    </div>
                    <div>
                        <Link
                            to="/"
                            className="text-white mr-3 text-md block hover:bg-red-900 text-center bg-red-800 px-4 py-1 rounded-lg"
                            onClick={() => {
                                localStorage.removeItem('token'); // Eliminar el token
                                setAuth({}); // Limpiar el estado de auth
                            }}
                        >
                            Salir
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="overflow-y-scroll p-8">
                    <Outlet />
                </div>

                {/* Footer */}
                <div className="bg-gray-800 h-12">
                    <p className="text-center text-slate-100 leading-[2.9rem] underline">Todos los derechos reservados</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
