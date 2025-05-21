import React, { useState, useEffect } from 'react';

// --- Constante para la URL base de la API de FastAPI ---
const API_BASE_URL = 'http://localhost:8000/api'; 

// Componente de formulario genérico para añadir/editar ofertas
// Ahora 'offer' puede ser null (para creación) o un objeto de oferta (para edición)
function OfferForm({ offer, onSave, onCancel }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (offer) { // Si 'offer' tiene datos (modo edición)
      setFormData({
        ...offer,
        // Convierte el array de programas_academicos_buscados a string para el input de texto
        programas_academicos_buscados: Array.isArray(offer.programas_academicos_buscados)
          ? offer.programas_academicos_buscados.join(', ')
          : ''
      });
    } else { // Si 'offer' es null o undefined (modo creación)
      setFormData({
        nombre_empresa: '',
        sector_empresa: '',
        correo_electronico: '',
        programas_academicos_buscados: '', // Se manejará como string separado por comas para el input
        titulo: '',
        cargo: '',
        horario: '',
        modalidad: '',
        tipo: '',
        fecha_cierre: '',
        fecha_inicio: '',
        vacantes: 1,
        ciudad: '',
        descripcion: '',
        perfil_aspirante: '',
        observaciones: ''
      });
    }
  }, [offer]); // Dependencia del 'offer' prop: se re-ejecuta si 'offer' cambia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      programas_academicos_buscados: formData.programas_academicos_buscados
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '')
    };
    onSave(finalData); // Llama a la función onSave pasada desde el padre
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 8,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        width: '90%',
        maxWidth: 600,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3>{offer ? 'Editar Oferta' : 'Nueva Oferta'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.keys(formData).map((key) => {
            // Excluye los campos '_id' y 'id' del renderizado
            if (key === '_id' || key === 'id') return null;

            return (
              <label key={key}>
                {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:
                {key === 'descripcion' || key === 'perfil_aspirante' || key === 'observaciones' ? (
                  <textarea
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required={key !== 'observaciones'}
                    style={{ width: '100%', minHeight: 80 }}
                  />
                ) : (
                  <input
                    type={key.includes('fecha') ? 'date' : (key === 'vacantes' ? 'number' : 'text')}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required={key !== 'observaciones'}
                    style={{ width: '100%' }}
                  />
                )}
              </label>
            );
          })}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
              {offer ? 'Guardar Cambios' : 'Crear Oferta'}
            </button>
            <button type="button" onClick={onCancel} style={{ padding: '10px 20px', marginLeft: 10, backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Componente para la tabla de estudiantes (sin cambios, no interactúa con la API de ofertas)
function StudentTable({ students }) {
  return (
    <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ padding: 10, textAlign: 'left' }}>Nombre</th>
          <th style={{ padding: 10, textAlign: 'left' }}>Paso actual (0/5)</th>
          <th style={{ padding: 10, textAlign: 'left' }}>Empresa asignada</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: 10 }}>{student.nombre}</td>
            <td style={{ padding: 10 }}>{student.paso_actual} / 5</td>
            <td style={{ padding: 10 }}>{student.empresa || 'Sin asignar'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Componente para la tabla de ofertas
function OfferTable({ offers, onEdit, onDelete }) {
  return (
    <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ padding: 10, textAlign: 'left' }}>Título</th>
          <th style={{ padding: 10, textAlign: 'left' }}>Empresa</th>
          <th style={{ padding: 10, textAlign: 'left' }}>Ciudad</th>
          <th style={{ padding: 10, textAlign: 'left' }}>Modalidad</th>
          <th style={{ padding: 10, textAlign: 'left' }}>Vacantes</th>
          <th style={{ padding: 10, textAlign: 'left' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {offers.map((offer) => (
          // Asegúrate de usar offer._id como clave
          <tr key={offer._id} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: 10 }}>{offer.titulo}</td>
            <td style={{ padding: 10 }}>{offer.nombre_empresa}</td>
            <td style={{ padding: 10 }}>{offer.ciudad}</td>
            <td style={{ padding: 10 }}>{offer.modalidad}</td>
            <td style={{ padding: 10 }}>{offer.vacantes}</td>
            <td style={{ padding: 10 }}>
              <button onClick={() => onEdit(offer)} style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>Editar</button>
              <button onClick={() => onDelete(offer._id)} style={{ padding: '8px 12px', marginLeft: 5, backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Componente principal del Panel de Administración
export default function AdminDashboard() {
  const [students] = useState([
    // Datos de prueba para estudiantes (ya que no hay un endpoint de estudiantes en tu backend actual)
    { id: 's1', nombre: 'Juan Pérez', paso_actual: 3, empresa: 'Tech Solutions' },
    { id: 's2', nombre: 'Maria García', paso_actual: 1, empresa: '' },
    { id: 's3', nombre: 'Pedro López', paso_actual: 5, empresa: 'Global Corp' },
  ]);

  const [offers, setOffers] = useState([]);
  const [editingOffer, setEditingOffer] = useState(null); // Objeto de oferta cuando se está editando
  const [showCreateForm, setShowCreateForm] = useState(false); // Nuevo estado para controlar la visibilidad del formulario de creación

  // --- Funciones para interactuar con la API ---

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/offers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Error al obtener las ofertas:', error);
      // Podrías mostrar una notificación al usuario aquí
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Función unificada para guardar (crear o actualizar) una oferta
  const handleSaveOffer = async (offerData) => {
    try {
      let response;
      if (offerData._id) { // Si la oferta tiene un _id, es una actualización
        response = await fetch(`${API_BASE_URL}/offers/${offerData._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(offerData),
        });
      } else { // Si no tiene _id, es una nueva creación
        response = await fetch(`${API_BASE_URL}/offers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(offerData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.detail || response.statusText}`);
      }

      const savedOffer = await response.json();
      fetchOffers(); // Refresca la lista completa de ofertas
      setEditingOffer(null); // Cierra el formulario de edición
      setShowCreateForm(false); // Cierra el formulario de creación
    } catch (error) {
      console.error('Error al guardar la oferta:', error);
      alert(`Error al guardar la oferta: ${error.message}`); // Mensaje de error al usuario
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Error: No se puede eliminar una oferta sin ID.');
      return;
    }
    if (!window.confirm('¿Está seguro de que desea eliminar esta oferta?')) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setOffers((prev) => prev.filter((o) => o._id !== id)); // Filtra usando _id
    } catch (error) {
      console.error('Error al eliminar la oferta:', error);
      alert('Error al eliminar la oferta. Por favor, intente de nuevo.');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Panel de Administrador</h2>

      <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginTop: 30 }}>Estudiantes Registrados</h3>
      <StudentTable students={students} />

      <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginTop: 30 }}>Ofertas Laborales</h3>
      <button onClick={() => setShowCreateForm(true)} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', marginBottom: 20 }}>
        Añadir nueva oferta
      </button>

      <OfferTable
        offers={offers}
        onEdit={(offer) => {
          setEditingOffer(offer); // Establece la oferta a editar
          setShowCreateForm(false); // Asegúrate de que el formulario de creación no esté abierto
        }}
        onDelete={handleDelete}
      />

      {/* Formulario para CREAR nueva oferta (aparece como modal) */}
      {showCreateForm && (
        <OfferForm
          offer={null} // Pasa null para indicar modo creación
          onSave={handleSaveOffer}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Formulario para EDITAR oferta existente (aparece como modal) */}
      {editingOffer && (
        <OfferForm
          offer={editingOffer} // Pasa la oferta existente para edición
          onSave={handleSaveOffer}
          onCancel={() => setEditingOffer(null)}
        />
      )}
    </div>
  );
}