//nodemail 
async function handleNotification(evento) {
    console.log(" Evento recibido:", evento); 
  switch (evento.evento) {
    case "OfertaCreada":
      console.log(
        `Enviar correo: ¡Nueva oferta publicada! -> "${evento.titulo}"`
      );
      // TODO: logica de email
      break;

    default:
      console.log("Evento ignorado:", evento);
  }
}

module.exports = handleNotification;
