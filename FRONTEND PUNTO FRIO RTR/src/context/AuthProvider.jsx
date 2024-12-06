import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true); // Nuevo estado de carga

    const perfil = async (token) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/perfil`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await axios.get(url, options);
            setAuth(respuesta.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Aseguramos que se termina de cargar
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            perfil(token);
        } else {
            setLoading(false); // Si no hay token, terminamos de cargar
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };
export default AuthContext;
