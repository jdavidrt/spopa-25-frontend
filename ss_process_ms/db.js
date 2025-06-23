const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "db", // ✅ "db" es el nombre del servicio en docker-compose.yml
  user: process.env.DB_USER || "usuario",
  password: process.env.DB_PASS || "contraseña",
  database: process.env.DB_NAME || "spopa",
  port: 5432,
});

module.exports = pool;