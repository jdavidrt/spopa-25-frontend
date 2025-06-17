'use client';

import React, { useEffect, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

interface Offer {
  id: number;
  "Nombre de la entidad": string;
  "Cargo": string;
  "Área": string;
  "Modalidad": string;
  "Ciudad": string;
  "Correo electrónico": string;
}

function StudentOffersPage() {
  const [data, setData] = useState<Offer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BUSINESS_API_URL || 'http://localhost:8010'}/api/offers`);
        if (!response.ok) {
          throw new Error('Error al obtener las ofertas');
        }

        const result = await response.json();
        const adaptedData = result.map((oferta: any) => ({
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
        className="form-control mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Entidad</th>
              <th>Cargo</th>
              <th>Área</th>
              <th>Modalidad</th>
              <th>Ciudad</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item["Nombre de la entidad"]}</td>
                  <td>{item["Cargo"]}</td>
                  <td>{item["Área"]}</td>
                  <td>{item["Modalidad"]}</td>
                  <td>{item["Ciudad"]}</td>
                  <td>
                    <a
                      href={`mailto:${item["Correo electrónico"]}`}
                      className="text-primary"
                    >
                      {item["Correo electrónico"]}
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-muted">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withPageAuthRequired(StudentOffersPage);