import AuthContext from '../context/AuthProvider';
import { useContext } from 'react';
import { Forbidden } from '../paginas/Forbidden';

export default function RoleBasedRoute({ children }) {
    const { auth } = useContext(AuthContext)

    if ("cajero" === auth.rol) {
        return <Forbidden/>
    } else {
        return children
    }
}
 