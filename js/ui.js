class UI {
  constructor() {
    this.seccionListado = document.getElementById("seccion-listado-noticias");
    this.seccionDetalle = document.getElementById("seccion-detalle-noticia");
    this.seccionCrear = document.getElementById("seccion-crear-noticia");
    this.contenedorNoticias = document.getElementById("contenedor-noticias");
    this.mapa = null;
    this.marcador = null;
  }

  renderizarListaDeNoticias(noticias, alHacerClickEnNoticia) {
    this.contenedorNoticias.innerHTML = "";
    noticias.forEach(noticia => {
      const elementoNoticia = document.createElement("div");
      elementoNoticia.className = "noticia";
      elementoNoticia.innerHTML = `
        <strong>${noticia.titulo}</strong>
        <br>${noticia.tipo ? `<span class="tipo">${noticia.tipo}</span> | ` : ""}
        ${noticia.direccion || "Sin dirección"}
      `;
      elementoNoticia.onclick = () => alHacerClickEnNoticia(noticia);
      this.contenedorNoticias.appendChild(elementoNoticia);
    });
  }

  renderizarDetalleDeNoticia(noticia) {
    this._mostrarSoloSeccion(this.seccionDetalle);
    
    document.getElementById("detalle-titulo").textContent = noticia.titulo;
    document.getElementById("detalle-contenido").textContent = noticia.contenido;
    document.getElementById("detalle-tipo").textContent = noticia.tipo || "No especificado";
    document.getElementById("detalle-direccion").textContent = noticia.direccion || "Sin dirección";

    this._renderizarImagenDetalle(noticia.imagen);
    this._renderizarMapaDetalle(noticia.coordenadas, noticia.direccion);
  }

  mostrarPantallaPrincipal() {
    this._mostrarSoloSeccion(this.seccionListado);
    if (document.body.classList.contains('modo-admin')) {
      this.seccionCrear.style.display = "block";
    }
  }

  _mostrarSoloSeccion(seccionActiva) {
    this.seccionListado.style.display = "none";
    this.seccionDetalle.style.display = "none";
    this.seccionCrear.style.display = "none";
    seccionActiva.style.display = "block";
  }
  
  _renderizarImagenDetalle(urlImagen) {
      const elementoImagen = document.getElementById("detalle-imagen");
      if (urlImagen) {
        elementoImagen.src = urlImagen;
        elementoImagen.style.display = "block";
      } else {
        elementoImagen.style.display = "none";
      }
  }

  _renderizarMapaDetalle(coordenadas, direccion) {
    const contenedorMapa = document.getElementById("mapa-detalle");
    if (coordenadas) {
      contenedorMapa.style.display = "block";
      if (!this.mapa) {
        this.mapa = L.map("mapa-detalle").setView(coordenadas, 16);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.mapa);
      } else {
        this.mapa.setView(coordenadas, 16);
      }
      if (this.marcador) {
        this.marcador.remove();
      }
      this.marcador = L.marker(coordenadas).addTo(this.mapa).bindPopup(direccion).openPopup();
    } else {
      contenedorMapa.style.display = "none";
    }
  }

  resetearFormulario() {
    document.getElementById("formulario-noticia").reset();
    document.getElementById("campo-coordenadas").value = "";
    const vistaPrevia = document.getElementById("vista-previa-imagen");
    vistaPrevia.style.display = "none";
    vistaPrevia.src = "";
  }
  
  popularSelectorDeTemas(temas) {
    const selector = document.getElementById('selector-tipo');
    temas.forEach(tema => {
      const opcion = document.createElement('option');
      opcion.value = tema;
      opcion.textContent = tema;
      selector.appendChild(opcion);
    });
  }
  
  crearFiltrosDeTipo(temas, alCambiarFiltro) {
      const contenedor = document.getElementById("filtros-por-tipo");
      contenedor.innerHTML = '<strong>Filtrar por tema:</strong>';
      temas.forEach(tipo => {
          const etiqueta = document.createElement('label');
          etiqueta.className = 'filtros-tipo-checkbox';
          etiqueta.innerHTML = `<input type="checkbox" name="tipo" value="${tipo}"> ${tipo}`;
          etiqueta.querySelector('input').addEventListener('change', alCambiarFiltro);
          contenedor.appendChild(etiqueta);
      });
  }
}