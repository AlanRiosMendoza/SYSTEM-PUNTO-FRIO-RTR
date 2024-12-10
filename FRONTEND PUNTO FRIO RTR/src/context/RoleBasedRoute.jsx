import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const RoleBasedRoute = ({ allowedRoles }) => {
  const { auth, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Cargando...</p>; // Muestra un mensaje mientras se carga el perfil
  }

  if (!auth || !auth.role) {
    // Si no hay usuario o no tiene rol, redirige al login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(auth.role)) {
    // Si el rol del usuario no está permitido, redirige a acceso denegado
    return <Navigate to="/acceso-denegado" />;
  }

  return <Outlet />; // Renderiza las rutas hijas si todo está correcto
};

export default RoleBasedRoute;
