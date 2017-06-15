var api = {
  url: "https://examen-laboratoria-sprint-5.herokuapp.com/topics/"
};

var cargarPagina = function () {
  cargarTemas();
  /*$("#filtrar").keyup(filtrarTemas);
  $("#buscando").click(filtrarTemas);*/
  $("#formularioTema").submit(agregarTema);
};

var cargarTemas = function () {
  $.getJSON(api.url, function (temas) {
    temas.forEach(mostrarTemas);
  });
};

var plantillaTema = '<div class="jumbotron col-xs-8" data-id="__id__">' +
  '<h3>__tema__</h3>' +
  '<p>by __autor__</p>' +
  '<p><a class="res btn btn-primary btn-lg" data-toggle="modal" data-target="#modalRespuestas" href="#" role="button">__respuestas__</a></p>' +
  '</div>';

var mostrarTemas = function (tema) {
  var plantillaFinalTema = " ";

  var id = tema.id;
  var autor = tema.author_name;
  var numeroRespuestas = tema.responses_count;
  var tema = tema.content;

  plantillaFinalTema += plantillaTema
    .replace("__id__", id)
    .replace("__tema__", tema)
    .replace("__autor__", autor)
    .replace("__respuestas__", numeroRespuestas);


  $("#listaTemas").append(plantillaFinalTema);
};

var agregarTema = function (e) {
  e.preventDefault();
  var nuevoAutor = $("#nuevoAutor").val();
  console.log(nuevoAutor);
  var nuevoTema = $("#nuevoTema").val();

  $.post(api.url, {
    author_name: nuevoAutor,
    content: nuevoTema
  }, function (tema) {
    crearTemas(tema);
    $('#myModal').modal('hide');
  });
};

/*var filtrarTemas = function (temas) {
  //e.preventDefault();
  console.log(temas);
  var busqueda = $("#filtrar").val().toLowerCase();
  var temasFiltrados = temas.filter(function (tema) {
    return tema.autor.toLowerCase().indexOf(busqueda) >= 0;
  });
  mostrarTemas(temasFiltrados);
};*/

var mostrarRespuestas = function (e) {
  e.preventDefault();
  var $padre = $(this).parents("div");
  var $id = $padre.attr("data-id");

  $.getJSON(api.url + $id + "/responses", function (respuestas) {
    console.log(respuestas);
    var $contenedorRespuestas = $("#modalRespuestas");
    respuestas.forEach(function (respuesta) {
      var autorRespuesta = respuesta.author_name;
      var mensaje = respuesta.content;
      var fecha = respuesta.created_at;

      var $autor = $("#autorRespuesta");
      var $mensajeRespuesta = $("#respuesta");
      var $fecha = $("#fechaRespuesta");

      $autor.text(autorRespuesta);
      $mensajeRespuesta.text(mensaje);
      $fecha.text(fecha);
      
    });

  });
};

$(document).on("click", ".res", mostrarRespuestas);
$(document).ready(cargarPagina);
