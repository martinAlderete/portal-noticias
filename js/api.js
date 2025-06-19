class ApiService {
  static normalizarDireccion(direccion) {
    
    if (!direccion || direccion.trim().split(' ').length < 2) {
      return Promise.reject(new Error("Formato inválido. Por favor, ingresa la calle y la altura."));
    }

    const url = `https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${encodeURIComponent(direccion)}&geocodificar=true`;

    return fetch(url)
      .then(res => res.json())
      .then(data => {
        
        if (data.direccionesNormalizadas && data.direccionesNormalizadas.length > 0) {
          return data.direccionesNormalizadas;
        } else {
          
          throw new Error("Dirección no encontrada. Verifica que la calle y altura sean correctas.");
        }
      });
  }
}