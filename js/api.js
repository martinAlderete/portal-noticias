class ApiService {
  static normalizarDireccion(direccion) {
    if (!direccion) {
      alert("Por favor, ingrese una dirección.");
      return Promise.reject("Dirección no proporcionada");
    }

    const url = `https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${encodeURIComponent(direccion)}&geocodificar=true`;

    return fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error('Error en la respuesta de la red');
        }
        return res.json();
      })
      .then(data => {
        if (data.direccionesNormalizadas && data.direccionesNormalizadas.length > 0) {
          const coords = data.direccionesNormalizadas[0].coordenadas;
          return { y: coords.y, x: coords.x };
        } else {
          throw new Error("No se pudo normalizar la dirección.");
        }
      });
  }
}