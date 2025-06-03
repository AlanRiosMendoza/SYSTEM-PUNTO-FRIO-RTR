import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import Navbar from '../layout/Navbar'

const Dashboard = () => {
    const { auth } = useContext(AuthContext);
    const [localAuth, setLocalAuth] = useState(null);
    const autenticado = localStorage.getItem('token');

    useEffect(() => {
        if (auth?.nombre || auth?.rol) {
            setLocalAuth(auth);
        }
    }, [auth]);

    if (!autenticado) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar userRole={localAuth?.rol} />
            <div className="flex-1 overflow-y-scroll p-8 bg-[#F7F3E9]">
                <Outlet />
            </div>
            <div className="bg-[#337bb3] h-15">
                <p className="text-center text-white leading-[2.9rem] underline">
                    © {new Date().getFullYear()} Punto Frío R.T.T. Todos los derechos reservados.
                </p>
            </div>

        </div>
    );
};

export default Dashboard;
