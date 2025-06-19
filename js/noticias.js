class NoticiasService {
  // El constructor recibe la lista de noticias y los temas válidos.
  constructor(noticiasIniciales, temasValidos) {
    // Si por alguna razón temasValidos no se pasa, usamos un array vacío para evitar errores.
    const temas = temasValidos || [];

    // Validamos que las noticias iniciales tengan un tópico válido.
    this.noticias = noticiasIniciales.filter(
      noticia => !noticia.tipo || temas.includes(noticia.tipo)
    );
  }

 
  obtenerNoticias() {
    return this.noticias;
  }

  
  agregarNoticia(noticia) {
    this.noticias.push(noticia);
    console.log('Noticia agregada a la lista actual.');
  }

  
  obtenerNoticiaPorIndice(index) {
    return this.noticias[index];
  }

  // Filtra las noticias por término de búsqueda y tipos.
   
  filtrarNoticias(terminoBusqueda, tiposSeleccionados) {
    return this.noticias.filter(noticia => {
      const coincideTitulo = noticia.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase());
      const coincideTipo = tiposSeleccionados.length === 0 || tiposSeleccionados.includes(noticia.tipo);
      return coincideTitulo && coincideTipo;
    });
  }
}