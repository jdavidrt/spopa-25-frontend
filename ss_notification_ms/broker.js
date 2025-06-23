//conexion a rabbitmq y consumo de mjs
const amqp = require("amqplib");
require("dotenv").config();

async function connectToBroker(onMessage) {
  //nos conectamos al broker
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  //Declaramos exchange y la queue
  await channel.assertExchange(process.env.EXCHANGE, "topic", { durable: true });
  await channel.assertQueue(process.env.QUEUE, { durable: true });

  //Enlazamos la queue a la clave de enrutamiento que nos interesa
  await channel.bindQueue(
    process.env.QUEUE,
    process.env.EXCHANGE,
    process.env.ROUTING_KEY
  );

  //máximo 5 mensajes sin ack
  //channel.basicQos = channel.prefetch(5);
  await channel.prefetch(5);

  //Consumimos mensajes
  channel.consume(process.env.QUEUE, async (msg) => {
    if (!msg) return;

    let content;
    try {
      // 1️⃣ Intentamos parsear
      content = JSON.parse(msg.content.toString());
    } catch (parseErr) {
      console.error("⛔  Mensaje no válido JSON:", msg.content.toString());
      channel.reject(msg, false);            // lo descartamos (o envia a DLQ)
      return;                                // seguimos sin caernos
    }
      try {
      await onMessage(content);              // 2️⃣  Lógica de negocio
      channel.ack(msg);                      // 3️⃣  OK → confirmamos
    } catch (bizErr) {
      console.error("💥 Error procesando:", bizErr);
      channel.nack(msg, false, true);        // lo re‑encolamos
    }
  });

  console.log("Conectado a RabbitMQ y escuchando %s → %s",
              process.env.EXCHANGE,
              process.env.ROUTING_KEY);
}

module.exports = connectToBroker;
