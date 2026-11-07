export function timeMinutes(value) {
  if (!value) return 0;
  var fechaHoraLocal = new Date().toLocaleString('en-US', {timeZone: 'America/Bogota'});
  var fechaInicial = new Date(value);
  if (isNaN(fechaInicial.getTime())) return 0;
  var fechaFinal = new Date(fechaHoraLocal);

  var diferenciaEnMilisegundos = fechaFinal - fechaInicial;

  var segundos = Math.floor(diferenciaEnMilisegundos / 1000);
  var minutos = Math.floor(segundos / 60);


  return minutos < 0 ? 0 : minutos;
}


