import { useContext } from "react"
import AuthContext from "../../context/AuthProvider"

export const CardPerfil = () => {
    const { auth } = useContext(AuthContext)

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Información personal</h2>
            <div className="bg-white border border-slate-200 h-auto p-4 
                            flex flex-col items-center justify-between shadow-xl rounded-lg">

                <div>
                    <img src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png" alt="img-client" className="m-auto " width={120} height={120} />
                </div>
                <div className="self-start">
                    <b>Nombre:</b><p className="inline-block ml-3">{auth.nombre}</p>
                </div>
                <div className="self-start">
                    <b>Apellido:</b><p className="inline-block ml-3">{auth.apellido}</p>
                </div >
                <div className="self-start">
                    <b>Identificación:</b><p className="inline-block ml-3">{auth.cedula}</p>
                </div>
                <div className="self-start">
                    <b>Rol:</b><p className="inline-block ml-3">{auth.rol}</p>
                </div>
                <div className="self-start">
                    <b>Teléfono:</b><p className="inline-block ml-3">{auth.telefono}</p>
                </div>
                <div className="self-start">
                    <b>Email:</b><p className="inline-block ml-3">{auth.correo}</p>
                </div>
            </div>
        </>
    )
}