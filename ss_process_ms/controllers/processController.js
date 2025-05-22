const pool = require("../db");

// Obtener todos los procesos de inscripción
exports.getProcesos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM procesos_inscripcion");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener procesos" });
  }
};

// Crear un nuevo proceso de inscripción
exports.createProceso = async (req, res) => {
  const { estudiante_id, oferta_id, profesor_id, estado } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO procesos_inscripcion (estudiante_id, oferta_id, profesor_id, estado)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [estudiante_id, oferta_id, profesor_id, estado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al crear proceso" });
  }
};

// Cambiar el estado de un proceso de inscripción
exports.updateEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const result = await pool.query(
      `UPDATE procesos_inscripcion SET estado = $1, fecha_actualizacion = NOW() WHERE id = $2 RETURNING *`,
      [estado, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proceso no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar estado" });
  }
};