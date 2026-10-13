// Datos de la boda. Es el único archivo que hay que tocar para cambiar textos básicos.
window.BODA = {
  // URL del backend (Google Apps Script). Vacío = modo demo (los datos quedan en este navegador).
  API_URL: "",

  novia: "Ruth",
  novio: "David",
  nombresCompletos: "Ruth Verón & David Urbieta",
  frase: "Dos caminos, un mismo destino",
  invitacion: "Con mucha alegría te invitamos a celebrar nuestra boda",

  fechaISO: "2026-11-15T19:00:00-03:00",
  fechaTexto: "Domingo 15 de noviembre de 2026",
  horaTexto: "19:00 hs",
  duracionHoras: 6,                       // para el botón "Agregar a mi calendario"

  lugar: "Star Recepciones",
  direccion: "12 de Octubre c/ San Cosme",
  ciudad: "San Lorenzo",
  mapa: "https://maps.app.goo.gl/5dBvECKjBNGbasgR9?g_st=aw",

  vestimenta: "Elegante",

  regalos: "Lo más importante para nosotros es tu presencia. Si además querés hacernos un regalo, podés hacerlo con una transferencia a este alias:",
  alias: "4318607",                       // lo que se copia
  aliasMostrar: "4.318.607",              // lo que se ve
  aliasTitular: "",                       // opcional: nombre del titular de la cuenta

  // Itinerario por defecto. Lo que se cargue desde el panel del organizador lo reemplaza.
  itinerario: []
};
window.CUMPLE = window.BODA;              // compatibilidad con api.js
