var api = {
    url: "https://examen-laboratoria-sprint-5.herokuapp.com/topics/"
};

var arregloTemas = [];

var plantillaTema = '<div id="padre" class="jumbotron col-xs-8" data-id="__id__">' +
    '<h3>__tema__</h3>' +
    '<p>by __autor__</p>' +
    '<p><a class="res btn btn-primary btn-lg" data-toggle="modal" data-target="#modalRespuestas" href="#" role="button">__respuestas__ Respuestas</a></p>' +
    '</div>';

var plantillaRespuestas = '<div data-id="__id__">' +
    '<p>Autor: __autor__</p>' +
    '<p>Mensaje: __respuesta__</p>' +
    '<p>fecha: __fecha__</p>' +
    '<p>topic id: __topicId__</p>' +
    '</div>';

// Esta funcion carga la pagina y agrega eventos a los formularios y botones
var cargarPagina = function () {
    cargarTemas();
    //$("#filtrar").keyup(filtrarTemas);
    $("#buscando").click(filtrarTemas);
    $("#formularioTema").submit(agregarTema);
    $("#botonCrearRespuesta").click(cerrarModalRespuestas);
    $("#formularioRespuesta").submit(agregarRespuesta);
};

// Esta funcion jala los objetos de la api
var cargarTemas = function () {
    $.getJSON(api.url, function (temas) {
        temas.forEach(mostrarTemas);

        //Agregando objetos a arreglo para poder filtrar
        arregloTemas.push(temas);
    });
};



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

// Esta funcion agrega los objetos de la api al DOM
var agregarTema = function (e) {
    e.preventDefault();
    var nuevoAutor = $("#nuevoAutor").val();
    var nuevoTema = $("#nuevoTema").val();

    $.post(api.url, {
        author_name: nuevoAutor,
        content: nuevoTema
    }, function (tema) {
        mostrarTemas(tema);
        $('#myModal').modal('hide');
    });
};

var filtrarTemas = function (e) {
    e.preventDefault();
    var busqueda = $("#filtrar").val().toLowerCase();
    $.getJSON(api.url, function (temas) {

        var temasFiltrados = temas.filter(function (tema) {

            var criterioBusqueda = tema.content.toLowerCase().indexOf(busqueda) >= 0;
            return criterioBusqueda;
        });
        temasFiltrados.forEach(function(tema) {
            mostrarTemas(tema);
              console.log(temasFiltrados);
        });


    });
};


// Esta funcion muestra un modal con las respuestas a tema de la api
var mostrarRespuestas = function (e) {
    e.preventDefault();
    var $padre = $(this).parents("div");
    var $id = $padre.attr("data-id");

    $.getJSON(api.url + $id + "/responses", function (respuestas) {
        respuestas.forEach(function (respuesta) {

            crearRespuestas(respuesta);
        });
    });
};


// Esta funcion jala las respuestas de la api y las muestra en el DOM (un modal) 
var crearRespuestas = function (respuesta) {
    var plantillaFinalRespuestas = " ";
    var id = respuesta.id;
    var autorRespuesta = respuesta.author_name;
    var mensaje = respuesta.content;
    var fecha = respuesta.created_at;
    var topicId = respuesta.topic_id;

    plantillaFinalRespuestas += plantillaRespuestas
        .replace("__id__", topicId)
        .replace("__autor__", autorRespuesta)
        .replace("__respuesta__", mensaje)
        .replace("__fecha__", fecha)
        .replace("__topicId", topicId);

    $("#respuestasModal").append(plantillaFinalRespuestas);

};

// Esta funcion cierra el modal donde aparecen las respuestas para abrir otro donde se podra agregar otra respuesta
var cerrarModalRespuestas = function (e) {
    e.preventDefault();
    $("#modalRespuestas").modal("hide");
};

// Esta funcion pretende agregar respuestas
var agregarRespuesta = function (e) {
    e.preventDefault();
    var $padre = $("#padre");
    var $id = $padre.attr("data-id");


    var autorRespuesta = $("#autorRespuesta").val();
    var contenidoRespuesta = $("#respuesta").val();

    $.post(api.url + $id + "/responses", {
        author_name: autorRespuesta,
        content: contenidoRespuesta,

    }, function (respuesta) {
        agregarRespuesta(respuesta)
        $("#crearRespuesta").modal("hide");
        $("#modalRespuestas").modal("show");
    });
};


var conseguirFechaYHoraPublicacion = function () {


    var date = new Date();
    var dia = date.getDate();
    var mes = date.getMonth() + 1;
    var hora = date.getHours();
    var ano = date.getFullYear();
    var minutos = date.getMinutes();
    var segundos = date.getSeconds();

    /* Ceros en formatos fecha dd:mm:aa y hora hh:mm:ss */
    if (dia < 10) {
        dia = "0" + date.getDate();
    }

    if (mes < 10) {
        mes = "0" + mes;
    }

    if (hora < 10) {
        hora = "0" + date.getHours();
    }

    if (minutos < 10) {
        minutos = "0" + date.getMinutes();
    }

    if (segundos < 10) {
        segundos = "0" + date.getSeconds();
    }

    var fecha = dia + "-" + mes + "-" + ano;
    var hora = hora + ":" + minutos + ":" + segundos;
    var created = fecha + "T" + hora + ".501Z";

    return created;
    console.log(created);
};
$(document).on("click", ".res", mostrarRespuestas);
$(document).ready(cargarPagina);
