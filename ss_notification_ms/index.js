
const express = require("express");
require("dotenv").config();

const connectToBroker = require("./broker");
const handleNotification = require("./notificationHandler");

const app = express();
const PORT = process.env.PORT || 4010;

// Endpoint para revisar el servicio
app.get("/", (_, res) => res.send("Notifications microservice running"));
app.get("/health", (_, res) => res.send("Notifications ok"));

app.listen(PORT, () => {
  console.log(`🚀 Microservicio Notificaciones en puerto ${PORT}`);
  
  // Conectamos al broker
  connectToBroker(handleNotification).catch((err) => {
    console.error("Error conectando a RabbitMQ:", err);
    process.exit(1);
  });
});
