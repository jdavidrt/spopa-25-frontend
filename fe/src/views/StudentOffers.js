import React, { useEffect, useState } from "react";

const Offers = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // Simulación de carga desde una API (reemplazar con fetch real)
  useEffect(() => {
    /* const fetchData = async () => {
      // Aquí deberías hacer una petición a tu backend, por ejemplo:
      // const response = await fetch('/api/ofertas');
      // const result = await response.json();
      const result = [
        {
          id: 1,
          "Marca Temporal": "2025-05-10 12:34",
          "Numero de convocatoria": "001",
          "Nombre de la entidad": "Empresa XYZ",
          "Sector de la entidad": "Tecnología",
          "Correo electrónico": "contacto@xyz.com",
          "Programas académicos requeridos": "Ingeniería de Sistemas",
          "Título de la convocatoria": "Desarrollador Web",
          "Cargo": "Intern",
          "Área": "Desarrollo",
          "Horario": "8am - 5pm",
          "Modalidad": "Remoto",
          "Ciudad": "Bogotá",
        },
        // Puedes agregar más datos aquí para pruebas
      ];
      setData(result);
    }; */

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8010/api/offers`);
        if (!response.ok) {
          throw new Error('Error al obtener las ofertas');
        }
  
        const result = await response.json();
  
        // Asegúrate que el backend devuelve el arreglo de objetos con los mismos campos esperados
        const adaptedData = result.map((oferta) => ({
          id: oferta.id,
          "Nombre de la entidad": oferta.company.name,
          "Cargo": oferta.position,
          "Área": oferta.department,
          "Modalidad": oferta.modality,
          "Ciudad": oferta.company.city,
          "Correo electrónico": oferta.company.email,
        }));
        
        setData(adaptedData);
      } catch (error) {
        console.error("Error al obtener las ofertas:", error);
      }
    };

    fetchData();
  }, []);

  // Filtro por campos clave
  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buscador de Convocatorias</h1>

      <input
        type="text"
        placeholder="Buscar por entidad, cargo, ciudad..."
        className="w-full p-3 mb-6 border border-gray-300 rounded-xl"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-xl">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Entidad</th>
              <th className="px-4 py-2">Cargo</th>
              <th className="px-4 py-2">Área</th>
              <th className="px-4 py-2">Modalidad</th>
              <th className="px-4 py-2">Ciudad</th>
              <th className="px-4 py-2">Correo</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr key={item.id} className="border-t text-sm hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{item["Nombre de la entidad"]}</td>
                  <td className="px-4 py-2">{item["Cargo"]}</td>
                  <td className="px-4 py-2">{item["Área"]}</td>
                  <td className="px-4 py-2">{item["Modalidad"]}</td>
                  <td className="px-4 py-2">{item["Ciudad"]}</td>
                  <td className="px-4 py-2">
                    <a
                      href={`mailto:${item["Correo electrónico"]}`}
                      className="text-blue-600 underline"
                    >
                      {item["Correo electrónico"]}
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Offers;
