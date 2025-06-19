class UI {
  constructor() {
    this.listadoSection = document.getElementById("seccion-listado");
    this.detalleSection = document.getElementById("seccion-detalle");
    this.crearSection = document.getElementById("seccion-crear");
    this.noticiasContainer = document.getElementById("noticias");
    this.map = null;
    this.marker = null;
  }

  mostrarNoticias(noticias, onNoticiaClick) {
    this.noticiasContainer.innerHTML = "";
    noticias.forEach((n, i) => {
      const div = document.createElement("div");
      div.className = "noticia";
      div.innerHTML = `
        <strong>${n.titulo}</strong>
        <br>${n.tipo ? `<span class="tipo">${n.tipo}</span> | ` : ""}
        ${n.direccion || "Sin dirección"}
      `;
      div.onclick = () => onNoticiaClick(i);
      this.noticiasContainer.appendChild(div);
    });
  }

  mostrarDetalle(noticia) {
    if (this.listadoSection) this.listadoSection.style.display = "none";
    if (this.crearSection) this.crearSection.style.display = "none";
    this.detalleSection.style.display = "block";

    document.getElementById("detTitulo").textContent = noticia.titulo;
    document.getElementById("detContenido").textContent = noticia.contenido;
    document.getElementById("detTipo").textContent = noticia.tipo || "No especificado";
    document.getElementById("detDireccion").textContent = noticia.direccion || "Sin dirección";

    const detImagen = document.getElementById("detImagen");
    if (noticia.imagen) {
      detImagen.src = noticia.imagen;
      detImagen.style.display = "block";
    } else {
      detImagen.style.display = "none";
    }

    const mapContainer = document.getElementById("map");
    if (noticia.coordenadas) {
      mapContainer.style.display = "block";
      if (!this.map) {
        this.map = L.map("map").setView(noticia.coordenadas, 16);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map);
      } else {
        this.map.setView(noticia.coordenadas, 16);
        if (this.marker) this.map.removeLayer(this.marker);
      }
      this.marker = L.marker(noticia.coordenadas).addTo(this.map).bindPopup(noticia.direccion).openPopup();
    } else {
      mapContainer.style.display = "none";
    }
  }

  // --- CORRECCIÓN AQUÍ ---
  // Se ha ajustado esta función para que funcione correctamente con el nuevo sistema de vistas.
  mostrarListado() {
    if (this.listadoSection) this.listadoSection.style.display = "block";
    // La visibilidad de la sección de crear ahora es manejada 100% por CSS.
    // Esto evita que al volver atrás se muestre el formulario en la vista de visitante.
    if (document.body.classList.contains('modo-admin')) {
      if (this.crearSection) this.crearSection.style.display = "block";
    }
    this.detalleSection.style.display = "none";
  }

  resetForm() {
    const form = document.getElementById("formNoticia");
    if (form) {
      form.reset();
      document.getElementById("coordenadas").value = "";
      const preview = document.getElementById("preview");
      preview.style.display = "none";
      preview.src = "";
    }
  }
  
  popularSelectTemas(temas) {
    const select = document.getElementById('tipo');
    if (!select) return;

    // Limpiar opciones anteriores para evitar duplicados si se llama varias veces
    select.innerHTML = '<option value="" disabled selected>Seleccione un tema</option>';

    temas.forEach(tema => {
      const option = document.createElement('option');
      option.value = tema;
      option.textContent = tema;
      select.appendChild(option);
    });
  }
  
  mostrarFiltrosTipo(temas, onFiltroChange) {
      const container = document.getElementById("filtros-tipo");
      container.innerHTML = '<strong>Filtrar por tema:</strong>';
      temas.forEach(tipo => {
          const label = document.createElement('label');
          label.className = 'filtros-tipo-checkbox';
          label.innerHTML = `
              <input type="checkbox" name="tipo" value="${tipo}"> ${tipo}
          `;
          label.querySelector('input').addEventListener('change', onFiltroChange);
          container.appendChild(label);
      });
  }
}