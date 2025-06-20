class ApiService {
  static normalizarDireccion(direccionTexto) {
    if (!direccionTexto || direccionTexto.trim().split(' ').length < 2) {
      return Promise.reject(new Error("Formato inválido. Por favor, ingresa la calle y la altura."));
    }

    const url = `https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${encodeURIComponent(direccionTexto)}&geocodificar=true`;

    return fetch(url)
      .then(respuesta => respuesta.json())
      .then(datos => {
        if (datos.direccionesNormalizadas && datos.direccionesNormalizadas.length > 0) {
          return datos.direccionesNormalizadas;
        } else {
          throw new Error("Dirección no encontrada. Verifica que la calle y altura sean correctas.");
        }
      });
  }
}