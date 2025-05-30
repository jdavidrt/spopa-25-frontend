import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../assets/SPOPALogo.png";

const Hero = () => {
  const { isAuthenticated } = useAuth0();

  const [userType, setUserType] = useState(() => {
    // Intentar leer desde localStorage al iniciar el componente
    return localStorage.getItem("userType");
  });

  const roles = ["Estudiante", "Administrativo", "Empresa"];

  const handleRoleSelect = (role) => {
    setUserType(role);
    localStorage.setItem("userType", role);
    window.dispatchEvent(new Event("userTypeChange")); // Notificar cambio
  };

  useEffect(() => {
    // Limpiar userType del localStorage si el usuario no está autenticado
    if (!isAuthenticated) {
      setUserType(null);
      localStorage.removeItem("userType");
    }
  }, [isAuthenticated]);

  return (
    <div className="text-center hero my-5">
      {isAuthenticated && (
        <div className="mb-4">
          {!userType ? (
            <>
              <h5 className="mb-2">Selecciona tu rol:</h5>
              <div className="flex justify-center gap-3 mb-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    className="px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300 transition duration-200"
                    onClick={() => handleRoleSelect(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-lg font-semibold text-gray-700">
              Rol seleccionado:{" "}
              <span className="text-blue-600">{userType}</span>
            </p>
          )}
        </div>
      )}
      <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
      <h1 className="mb-4">SPOPA</h1>
    </div>
  );
};

export default Hero;
