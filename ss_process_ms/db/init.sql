
-- Empresas
CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email_contacto VARCHAR(100)
);
-- Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    rol VARCHAR(20) NOT NULL, -- estudiante, profesor, empresa, administrador
    empresa_id INTEGER REFERENCES empresas(id)
);

-- Profesores
CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Ofertas
CREATE TABLE ofertas (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER REFERENCES empresas(id),
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    modalidad VARCHAR(20), -- práctica, pasantía
    estado VARCHAR(20) -- activa, inactiva
);

-- Procesos de Inscripción
CREATE TABLE procesos_inscripcion (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER REFERENCES usuarios(id),
    oferta_id INTEGER REFERENCES ofertas(id),
    profesor_id INTEGER REFERENCES profesores(id),
    estado VARCHAR(30) NOT NULL, -- pendiente_tutor, iniciado, documentacion_completa, en_revision_empresa, aprobado, rechazado, inscrito
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documentos
CREATE TABLE documentos (
    id SERIAL PRIMARY KEY,
    proceso_id INTEGER REFERENCES procesos_inscripcion(id),
    tipo VARCHAR(30) NOT NULL, -- identidad, matricula, carta_autorizacion
    url_archivo VARCHAR(255) NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) -- aprobado, pendiente, rechazado
);

-- Notificaciones
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(30) -- invitacion, estado, general, etc.
);

-- Empresa de prueba
INSERT INTO empresas (nombre, email_contacto) VALUES ('Empresa Elegante S.A.', 'contacto@elegante.com');

-- Usuario estudiante
INSERT INTO usuarios (nombre, email, rol, empresa_id)
VALUES ('Santi Estudiante', 'santi@uni.com', 'estudiante', 1);

-- Profesor
INSERT INTO profesores (nombre, email)
VALUES ('Profe Experto', 'profe@uni.com');

-- Oferta de pasantía
INSERT INTO ofertas (empresa_id, titulo, descripcion, modalidad, estado)
VALUES (1, 'Pasantía Backend Node', 'Trabaja con microservicios elegantes', 'pasantía', 'activa');

-- INSERT INTO procesos_inscripcion (estudiante_id, oferta_id, profesor_id, estado)
-- VALUES (1, 1, 1, 'pendiente_tutor');
