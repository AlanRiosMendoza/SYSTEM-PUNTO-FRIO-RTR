import logoDarkMode from '../assets/dark.png'
import logoFacebook from '../assets/facebook.png'
import logoinvitados from '../assets/82092848_l_normal_none.webp'
import { useState } from 'react'
import {Link} from 'react-router-dom'


export const LandinPage = () => {
    const [darkMode, setdarkMode] = useState(false)
    return (
        <div className={darkMode ? "dark" : ""}>
            <main className="bg-gradient-to-b from-[#8B0000] to-[#000000] px-8 md:px-16 lg:px-32 dark:bg-gradient-to-b dark:from-[#000000] dark:to-[#8B0000]">
                <section>
                    {/* Navbar */}
                    <nav className="p-8 mb-12 flex justify-between items-center">
                        <h1 className="text-3xl font-extrabold text-[#FFD700] dark:text-[#FFD700]">Punto Frío RTR</h1>
                        <ul className="flex items-center gap-8">
                            <li>
                                <img
                                    onClick={() => setdarkMode(!darkMode)}
                                    className="cursor-pointer border-2 border-[#FFD700] rounded-full transition duration-300 hover:scale-105"
                                    src={logoDarkMode}
                                    alt="logo"
                                    width={40}
                                    height={40}
                                />
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    className="bg-[#FFD700] text-black px-6 py-2 rounded-full transition hover:bg-[#8B0000] hover:text-white"
                                >
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </nav>
    
                    {/* Hero Section */}
                    <div className="text-center">
                        <h2 className="text-5xl py-4 text-[#FFD700] font-bold md:text-6xl">Bienvenido</h2>
                        <h3 className="text-2xl py-2 md:text-3xl text-[#F7F3E9] dark:text-[#F7F3E9]">
                            El mejor punto para mejorar su día y calmar la sed al mejor precio
                        </h3>
                        <p className="text-md py-4 leading-8 text-[#F7F3E9] md:text-lg max-w-2xl mx-auto">
                            Próximamente nuestras redes sociales para que nos puedas seguir
                        </p>
                    </div>
    
                    {/* Social Media Icons */}
                    <div className="flex justify-center gap-10 py-6">
                        <img
                            src={logoFacebook}
                            alt="logo-facebook"
                            width={50}
                            height={50}
                            className="border-2 border-[#FFD700] rounded-full transition duration-300 hover:scale-110"
                        />
                    </div>
    
                    {/* Image Section */}
                    <div className="relative mx-auto bg-gradient-to-b from-[#FFD700] to-[#8B0000] rounded-full h-80 w-80 mt-12 overflow-hidden md:h-96 md:w-96 dark:border-4 border-[#FFD700]">
                        <img src={logoinvitados} alt="logoinvitados" className="object-cover h-full w-full" />
                    </div>
                </section>
            </main>
        </div>
    );
    
}