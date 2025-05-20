import React, { useState } from 'react';

// Datos de prueba
const mockStudents = [
  { id: 1, nombre: 'Laura Gómez', paso_actual: 2, empresa: null },
  { id: 2, nombre: 'Juan Pérez', paso_actual: 5, empresa: 'Tech Solutions' },
  { id: 3, nombre: 'Ana Ríos', paso_actual: 0, empresa: null }
];

const mockOffers = [
  {
    id: 1,
    nombre_empresa: 'Tech Solutions',
    sector_empresa: 'Tecnología',
    correo_electronico: 'contacto@techsolutions.com',
    programas_academicos_buscados: ['Ingeniería de Sistemas'],
    titulo: 'Pasantía en Backend',
    cargo: 'Desarrollador Node.js',
    horario: '8am-5pm',
    modalidad: 'Remoto',
    tipo: 'Tiempo completo',
    fecha_cierre: '2025-06-30',
    fecha_inicio: '2025-07-15',
    vacantes: 1,
    ciudad: 'Medellín',
    descripcion: 'Apoyar en el desarrollo de microservicios.',
    perfil_aspirante: 'Conocimiento en Node.js y bases de datos.',
    observaciones: 'Posibilidad de contratación.'
  }
];

function OfferForm({ offer, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    offer || {
      nombre_empresa: '',
      sector_empresa: '',
      correo_electronico: '',
      programas_academicos_buscados: '',
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
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      programas_academicos_buscados: formData.programas_academicos_buscados.split(',').map(s => s.trim())
    };
    onSave(finalData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20, padding: 20, border: '1px solid #ccc' }}>
      <h3>{offer ? 'Editar Oferta' : 'Nueva Oferta'}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.keys(formData).map((key) => (
          <label key={key}>
            {key.replace(/_/g, ' ')}:
            <input
              type={key.includes('fecha') ? 'date' : 'text'}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required={key !== 'observaciones'}
              style={{ width: '100%' }}
            />
          </label>
        ))}
        <div>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}

function StudentTable({ students }) {
  return (
    <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 20 }}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Paso actual (0/5)</th>
          <th>Empresa asignada</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>{student.nombre}</td>
            <td>{student.paso_actual} / 5</td>
            <td>{student.empresa || 'Sin asignar'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OfferTable({ offers, onEdit, onDelete }) {
  return (
    <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 20 }}>
      <thead>
        <tr>
          <th>Título</th>
          <th>Empresa</th>
          <th>Ciudad</th>
          <th>Modalidad</th>
          <th>Vacantes</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {offers.map((offer) => (
          <tr key={offer.id}>
            <td>{offer.titulo}</td>
            <td>{offer.nombre_empresa}</td>
            <td>{offer.ciudad}</td>
            <td>{offer.modalidad}</td>
            <td>{offer.vacantes}</td>
            <td>
              <button onClick={() => onEdit(offer)}>Editar</button>
              <button onClick={() => onDelete(offer.id)} style={{ marginLeft: 5 }}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminDashboard() {
  const [students] = useState(mockStudents);
  const [offers, setOffers] = useState(mockOffers);
  const [editingOffer, setEditingOffer] = useState(null);

  const handleSave = (offer) => {
    if (editingOffer) {
      setOffers((prev) =>
        prev.map((o) => (o.id === editingOffer.id ? { ...offer, id: editingOffer.id } : o))
      );
    } else {
      setOffers((prev) => [...prev, { ...offer, id: Date.now() }]);
    }
    setEditingOffer(null);
  };

  const handleDelete = (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Panel de Administrador</h2>

      <h3>Estudiantes Registrados</h3>
      <StudentTable students={students} />

      <h3>Ofertas Laborales</h3>
      <button onClick={() => setEditingOffer({})}>Añadir nueva oferta</button>
      <OfferTable offers={offers} onEdit={setEditingOffer} onDelete={handleDelete} />

      {editingOffer !== null && (
        <OfferForm
          offer={Object.keys(editingOffer).length ? editingOffer : null}
          onSave={handleSave}
          onCancel={() => setEditingOffer(null)}
        />
      )}
    </div>
  );
}
