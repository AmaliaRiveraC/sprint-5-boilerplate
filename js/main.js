var api = {
  url: "https://examen-laboratoria-sprint-5.herokuapp.com/topics/"
};

var $listaTemas = $("#listaTemas");

var cargarPagina = function () {
  cargarTemas();
  $("#formularioTema").submit(agregarTema);
};

var cargarTemas = function () {
  $.getJSON(api.url, function (temas) {
      temas.forEach(crearTemas);
  });
};

var plantillaTema = '<div class="jumbotron col-xs-8" data-id="__id__">' +
  '<h3>__tema__</h3>' +
  '<p>by __autor__</p>' +
  '<p><a class="btn btn-primary btn-lg" href="#" role="button">__respuestas__</a></p>' +
  '</div>';

var crearTemas = function (tema) {
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

var agregarTema = function(e) {
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
  
$(document).ready(cargarPagina);
