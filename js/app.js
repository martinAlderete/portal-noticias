document.addEventListener('DOMContentLoaded', () => {
  const noticiasService = new NoticiasService(noticiasData, TEMAS_NOTICIAS);
  const ui = new UI();

  const btnVistaAdmin = document.getElementById('btn-vista-admin');
  const btnVistaVisitante = document.getElementById('btn-vista-visitante');

  btnVistaAdmin.addEventListener('click', () => {
    document.body.classList.add('modo-admin');
  });

  btnVistaVisitante.addEventListener('click', () => {
    document.body.classList.remove('modo-admin');
  });

  const actualizarListado = () => {
    console.log("Actualizando listado...");
    const terminoBusqueda = document.getElementById('busqueda').value;
    const tiposSeleccionados = Array.from(document.querySelectorAll('#filtros-tipo input:checked')).map(input => input.value);
    const noticiasFiltradas = noticiasService.filtrarNoticias(terminoBusqueda, tiposSeleccionados);
    const indicesOriginales = noticiasFiltradas.map(n => noticiasService.obtenerNoticias().indexOf(n));
    
    ui.mostrarNoticias(noticiasFiltradas, (indexFiltrado) => {
        const indiceReal = indicesOriginales[indexFiltrado];
        const noticia = noticiasService.obtenerNoticiaPorIndice(indiceReal);
        ui.mostrarDetalle(noticia);
    });
  };

  const inicializarComponentesUI = () => {
      ui.mostrarFiltrosTipo(TEMAS_NOTICIAS, actualizarListado);
      document.getElementById('busqueda').addEventListener('input', actualizarListado);
      ui.popularSelectTemas(TEMAS_NOTICIAS);
  };

  const form = document.getElementById('formNoticia');
  const btnNormalizar = document.getElementById('btnNormalizar');
  const inputImagen = document.getElementById('imagen');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const contenido = document.getElementById('contenido').value;
    const tipo = document.getElementById('tipo').value;
    const direccion = document.getElementById('direccion').value;
    const coord = document.getElementById('coordenadas').value;
    const coords = coord ? coord.split(',').map(Number) : null;
    const preview = document.getElementById('preview');
    const imagen = preview.style.display !== 'none' ? preview.src : '';

    const nuevaNoticia = { titulo, contenido, tipo, direccion, coordenadas: coords, imagen };
    noticiasService.agregarNoticia(nuevaNoticia);
    ui.resetForm();
    actualizarListado();
    alert('Noticia publicada con éxito.');
  });

  btnNormalizar.addEventListener('click', () => {
    const direccion = document.getElementById('direccion').value;
    const inputCoordenadas = document.getElementById('coordenadas');

    ApiService.normalizarDireccion(direccion)
      .then(resultados => {
        // Si la API devuelve un solo resultado, lo resolvemos directamente.
        if (resultados.length === 1) {
          return resultados[0].coordenadas;
        }
        // Si devuelve varios, le pasamos la responsabilidad a la UI.
        // El método de la UI devuelve una promesa con las coordenadas elegidas.
        return ui.seleccionarDireccion(resultados);
      })
      .then(coords => {
        // Este .then() recibe las coordenadas, sea del caso único o de la selección.
        inputCoordenadas.value = `${coords.y},${coords.x}`;
        alert('Dirección normalizada correctamente.');
      })
      .catch(error => {
        // Atrapa cualquier error del proceso (API, selección inválida, cancelación).
        alert(error.message);
      });
  });

  inputImagen.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('preview');
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.src = event.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      preview.style.display = 'none';
    }
  });

  document.querySelector('.volver').addEventListener('click', (e) => {
    e.preventDefault();
    ui.mostrarListado();
  });
  
  inicializarComponentesUI();

  // --- CORRECCIÓN AQUÍ ---
  // Realizamos la primera carga de noticias en un timeout para asegurar que el DOM esté listo.
  setTimeout(actualizarListado, 0);
});