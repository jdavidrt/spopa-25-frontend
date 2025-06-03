const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const procesosRoutes = require("./routes/process");

const app = express();
const port = process.env.PORT || 4000;

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas para procesos de inscripción
app.use("/api/process", procesosRoutes);

app.get("/", (req, res) => {
  res.send("Microservicio de procesos de inscripción activo");
});

app.listen(port, () => {
  console.log(`Microservicio de procesos escuchando en el puerto ${port}`);
});

app.use((err, req, res, next) => {
  console.error("Error no capturado:", err.stack);
  res.status(500).send("Error del servidor");
});
