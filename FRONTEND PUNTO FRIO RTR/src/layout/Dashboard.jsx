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
        { to: '/dashboard', label: 'Perfil de usuario' },
        { to: '/dashboard/listar', label: 'Lista e Informe' },
        { to: '/dashboard/crear', label: 'Productos' },
        { to: '/dashboard/CajaDeVenta', label: 'Caja registradora' },
        { to: '/dashboard/register', label: 'Administración de usuarios' },
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
            <div className="md:w-1/5 bg-gradient-to-r from-black to-[#67841e] px-5 py-4">
                <h2 className="text-3xl font-black text-center text-[#FFD700]">Sistema de Ventas Punto Frio RTR</h2>

                <p className="text-[#F7F3E9] text-center my-4 text-sm">
                    <span className="bg-green-600 w-3 h-3 inline-block rounded-full"></span> Bienvenido - {localAuth?.nombre || "Cargando..."}
                </p>
                <p className="text-[#F7F3E9] text-center my-4 text-sm">Rol - {localAuth?.rol || "Cargando..."}</p>
    
                {/* Links de navegación */}
                <ul className="mt-10">
                    {links.map((link) => (
                        <li key={link.to} className="text-center">
                            <Link
                                to={link.to}
                                className={`${
                                    urlActual === link.to
                                        ? 'text-[#FFD700] bg-[#67841e] px-3 py-2 rounded-md'
                                        : 'text-[#F7F3E9]'
                                } text-lg block mt-2 hover:text-[#FFD700] my-3`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
    
            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-between h-screen bg-[#F7F3E9]">
                {/* Encabezado */}
                <div className="bg-[#67841e] py-2 flex md:justify-end items-center gap-5 justify-center">
                    <div className="text-md font-semibold text-[#FFD700]">Bienvenido - {localAuth?.nombre || "Cargando..."}</div>
                    <div>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
                            alt="Usuario conectado"
                            className="border-2 border-[#FFD700] rounded-full"
                            width={50}
                            height={50}
                        />
                    </div>
                    <div>
                        <Link
                            to="/"
                            className="text-[#F7F3E9] mr-3 text-md block hover:bg-[#8B0000] text-center bg-[#8e7b1f] px-4 py-1 rounded-lg"
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
                <div className="bg-[#67841e] h-12">
                    <p className="text-center text-[#FFD700] leading-[2.9rem] underline">Todos los derechos reservados</p>
                </div>
            </div>
        </div>
    );        
};

export default Dashboard;
