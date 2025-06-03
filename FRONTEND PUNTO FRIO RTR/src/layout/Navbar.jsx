import React, { useState, useEffect } from 'react';
import { AiOutlineCreditCard, AiOutlineAppstore, AiOutlineUsergroupAdd, AiOutlineDatabase, AiOutlineClose, AiOutlineMenu, AiOutlineUser, AiOutlineSetting, AiOutlineKey, AiOutlineLogout } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ userRole }) => {
    const [nav, setNav] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();

    const handleNav = () => setNav(!nav);
    const handleUserMenuToggle = () => setUserMenuOpen(!userMenuOpen);
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserMenuOpen(false);
        window.location.href = '/login';
    };

    // Cerrar el menú si la pantalla se agranda
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setNav(false); // Cierra el menú en pantallas grandes
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const links = [
        { to: '/dashboard/listar', label: 'Inventario', icon: <AiOutlineDatabase /> },
        ...(userRole === "administrador"
            ? [
                { to: '/dashboard/crear', label: 'Productos', icon: <AiOutlineAppstore /> },
                { to: '/dashboard/register', label: 'Administración de usuarios', icon: <AiOutlineUsergroupAdd /> },
            ]
            : []),
        ...(userRole === "cajero" ? 
            [
                { to: '/dashboard/CajaDeVenta', label: 'Caja registradora', icon: <AiOutlineCreditCard /> },
            ]:[]
        )
    ];

    const userOptions = [
        { id: 1, text: 'Ver Perfil', to: '/dashboard/perfil', icon: <AiOutlineUser /> },
        { id: 2, text: 'Actualizar Perfil', to: '/dashboard/actualizar-perfil', icon: <AiOutlineSetting /> },
        { id: 3, text: 'Actualizar Contraseña', to: '/dashboard/actualizar-contrasena', icon: <AiOutlineKey /> },
        { id: 4, text: 'Cerrar Sesión', route: '/logout', icon: <AiOutlineLogout />, onClick: handleLogout },
    ];

    return (
        <div className="bg-[#337bb3] flex justify-between items-center h-20 px-6 text-white relative">
            <div className="flex items-center">
                <button onClick={handleNav} className="md:hidden">
                    {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                </button>
                <img
                    src="https://res.cloudinary.com/dkhh1qdbr/image/upload/v1738133108/c9bcfadl6ejdm2ohhpdf.png"
                    alt="Logo"
                    className="w-16 h-16 ml-4"
                />
            </div>

            {/* Links de navegación */}
            <ul className="hidden md:flex space-x-6">
                {links.map((link) => (
                    <li key={link.to}
                        className={`p-4 rounded-xl duration-300 ${location.pathname.startsWith(link.to)
                            ? 'bg-[#b2ffff] text-black'
                            : 'hover:bg-[#b2ffff] hover:text-black'
                        }`}>
                        <Link to={link.to}>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Menú de usuario */}
            <div className="relative">
                <button onClick={handleUserMenuToggle} className="p-2 rounded-full">
                    <img src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png" alt="Usuario" className="w-10 h-10 rounded-full" />
                </button>
                {userMenuOpen && (
                    <ul className="absolute right-0 mt-2 w-48 bg-[#337bb3] border rounded-lg shadow-lg">
                        {userOptions.map((option) => (
                            <li
                                key={option.id}
                                className="flex items-center p-3 cursor-pointer hover:bg-[#b2ffff] hover:text-black rounded-lg"
                                onClick={option.onClick}
                            >
                                <Link
                                    to={option.to}
                                    className="flex items-center hover:scale-110 duration-300"
                                >
                                    {option.icon} <span className="ml-2">{option.text}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Menú móvil */}
            <div className={`fixed top-0 left-0 w-[40%] h-full bg-[#337BB3] border-r transition-transform duration-500 ${nav ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center p-4">
                    <img src="https://res.cloudinary.com/dkhh1qdbr/image/upload/v1738133108/c9bcfadl6ejdm2ohhpdf.png" alt="Logo" className="w-10 h-10" />
                    <button onClick={handleNav} className="text-white">
                        <AiOutlineClose size={20} />
                    </button>
                </div>
                <ul>
                    {links.map((link) => (
                        <li key={link.to} className='rounded-lg'>
                            <Link
                                to={link.to}
                                className="flex items-center p-3 cursor-pointer hover:bg-[#b2ffff] hover:text-black rounded-lg"
                                onClick={() => setNav(false)}
                            >
                                {link.icon} <span className="ml-2">{link.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
