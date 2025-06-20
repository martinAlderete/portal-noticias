document.addEventListener('DOMContentLoaded', iniciarAplicacion);

function iniciarAplicacion() {
  const noticiasService = new NoticiasService(noticiasData);
  const ui = new UI();

  function refrescarListaDeNoticias() {
    const terminoBusqueda = document.getElementById('campo-busqueda').value;
    const tiposSeleccionados = obtenerTiposSeleccionados();
    const noticiasFiltradas = noticiasService.filtrarNoticias(terminoBusqueda, tiposSeleccionados);
    
    ui.renderizarListaDeNoticias(noticiasFiltradas, (noticia) => {
      ui.renderizarDetalleDeNoticia(noticia);
    });
  }

  function obtenerTiposSeleccionados() {
    const checkboxesMarcados = document.querySelectorAll('#filtros-por-tipo input:checked');
    return Array.from(checkboxesMarcados).map(checkbox => checkbox.value);
  }
  
  function configurarEventListeners() {
    document.getElementById('boton-vista-admin').addEventListener('click', () => document.body.classList.add('modo-admin'));
    document.getElementById('boton-vista-visitante').addEventListener('click', () => document.body.classList.remove('modo-admin'));
    document.getElementById('formulario-noticia').addEventListener('submit', manejarEnvioDeFormulario);
    document.getElementById('boton-normalizar-direccion').addEventListener('click', manejarNormalizacionDeDireccion);
    document.getElementById('selector-imagen').addEventListener('change', manejarSeleccionDeImagen);
    document.getElementById('enlace-volver-listado').addEventListener('click', (evento) => {
        evento.preventDefault();
        ui.mostrarPantallaPrincipal();
    });
  }

  function manejarEnvioDeFormulario(evento) {
    evento.preventDefault();
    const nuevaNoticia = {
      titulo: document.getElementById('campo-titulo').value,
      contenido: document.getElementById('campo-contenido').value,
      tipo: document.getElementById('selector-tipo').value,
      direccion: document.getElementById('campo-direccion').value,
      coordenadas: document.getElementById('campo-coordenadas').value.split(',').map(Number),
      imagen: document.getElementById('vista-previa-imagen').src,
    };
    noticiasService.agregarNoticia(nuevaNoticia);
    ui.resetearFormulario();
    refrescarListaDeNoticias();
    alert('Noticia publicada con éxito.');
  }

  function manejarNormalizacionDeDireccion() {
    const direccion = document.getElementById('campo-direccion').value;
    ApiService.normalizarDireccion(direccion)
      .then(resultados => {
        const coords = resultados[0].coordenadas;
        document.getElementById('campo-coordenadas').value = `${coords.y},${coords.x}`;
        alert('Dirección normalizada correctamente.');
      })
      .catch(error => {
        alert(error.message);
      });
  }

  function manejarSeleccionDeImagen(evento) {
    const archivo = evento.target.files[0];
    const vistaPrevia = document.getElementById('vista-previa-imagen');
    if (archivo) {
      const reader = new FileReader();
      reader.onload = (e) => {
        vistaPrevia.src = e.target.result;
        vistaPrevia.style.display = 'block';
      };
      reader.readAsDataURL(archivo);
    } else {
      vistaPrevia.src = "";
      vistaPrevia.style.display = 'none';
    }
  }

  function inicializarInterfaz() {
    ui.popularSelectorDeTemas(TEMAS_NOTICIAS);
    ui.crearFiltrosDeTipo(TEMAS_NOTICIAS, refrescarListaDeNoticias);
    document.getElementById('campo-busqueda').addEventListener('input', refrescarListaDeNoticias);
    configurarEventListeners();
    refrescarListaDeNoticias();
  }
  
  inicializarInterfaz();
}