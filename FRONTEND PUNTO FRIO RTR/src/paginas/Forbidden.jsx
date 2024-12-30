import { RiUserForbidFill } from "react-icons/ri";

export const Forbidden = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-4">
            <div className=" p-8 rounded-lg bg-violet-300 shadow-lg max-w-lg w-full text-center">
                <RiUserForbidFill size={80} className="text-red-600 mx-auto" />
                <p className="text-4xl font-semibold text-gray-800 mt-6">Acceso Denegado</p>
                <p className="text-lg text-gray-600 mt-4">
                    Lo sentimos, usted no tiene acceso a esta página.
                    <br />
                    Favor contáctese con el administrador para obtener más información.
                </p>
            </div>
        </div>
    );
};
