class NoticiasService {
  constructor(noticiasIniciales) {
    this.noticias = noticiasIniciales;
  }

  obtenerTodasLasNoticias() {
    return this.noticias;
  }

  agregarNoticia(noticia) {
    this.noticias.push(noticia);
  }

  filtrarNoticias(terminoBusqueda, tiposSeleccionados) {
    return this.noticias.filter(noticia => {
      const coincideTitulo = noticia.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase());
      const sinFiltroDeTipo = tiposSeleccionados.length === 0;
      const coincideTipo = tiposSeleccionados.includes(noticia.tipo);

      return coincideTitulo && (sinFiltroDeTipo || coincideTipo);
    });
  }
}