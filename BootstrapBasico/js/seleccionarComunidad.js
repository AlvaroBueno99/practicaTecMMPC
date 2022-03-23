/* con JQUERY
var staticUrl = 'https://practicateccmmmonumentos2122.netlify.app/bootstrapbasico/json/monumentos.json'

$.getJSON(staticUrl, function(data){
    console.log(data)
});
*/

// Petición del fichero JSON al servidor Netlify

const requestURL = "https://practicateccmmmonumentos2122.netlify.app/bootstrapbasico/json/monumentos.json";
const request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function () {
    const alumnos = request.response;
    console.log(alumnos);
    console.log("La petición ha sido respondida");
    console.log("prueba 2 del github vscode sync");
}

/*
function seleccionarAndalucia(){
    fila = document.getElementById("fila1Cartas");

    img = document.createElement("img")
    img.className = "card-img-top"

    bodyDiv = document.createElement("div")
    bodyDiv.className = "card-body"

    h5 = document.createElement("h5")
    h5.className = "card-title"
    h5.innerHTML = "Card Title with JS"

    p = document.createElement("p")
    p.className = "card-text"
    p.innerHTML = "paragraph text with JS"

    a = document.createElement("a")


    cardDiv = document.createElement("div");
    card.setAttribute("style", "width: 18rem;")

}
*/

var parentRow = document.createElement("DIV"); // Crea el DIV principal que contiene todo lo demas.

var att_class_parentRow = document.createAttribute("class");
att_class_parentRow.value = "row justify-content-center"
parentRow.setAttributeNode(att_class_parentRow);


var columnaGrandeIzquierda = document.createElement("DIV"); // Crea la columna de la izquierda donde iran contenidos los checkBox y etc.

var att_class_columnaGrandeIzquierda = document.createAttribute("class");
att_class_columnaGrandeIzquierda.value = "col-md-auto";
columnaGrandeIzquierda.setAttributeNode(att_class_columnaGrandeIzquierda);

var att_id_columnaGrandeIzquierda = document.createAttribute("id");
att_id_columnaGrandeIzquierda.value = "columnaGrandeIzquierda";
columnaGrandeIzquierda.setAttributeNode(att_id_columnaGrandeIzquierda);


var columnaGrandeDerecha = document.createElement("DIV"); // Crea la columna de la derecha donde iran contenidas las tarjetas.

var att_class_columnaGrandeDerecha = document.createAttribute("class");
att_class_columnaGrandeDerecha.value = "col-md-auto";
columnaGrandeDerecha.setAttributeNode(att_class_columnaGrandeDerecha);

var att_id_columnaGrandeDerecha = document.createAttribute("id");
att_id_columnaGrandeDerecha.value = "columnaGrandeDerecha";
columnaGrandeDerecha.setAttributeNode(att_id_columnaGrandeDerecha);


parentRow.appendChild(columnaGrandeIzquierda);
parentRow.appendChild(columnaGrandeDerecha);

// ------------------------------------------------------------------------------

var filaTarjetas1 = document.createElement("DIV");
var att_class_filaTarjetas1 = document.createAttribute("class");
att_class_filaTarjetas1.value = "row justify-content-center";
filaTarjetas1.setAttributeNode(att_class_filaTarjetas1);

var att_id_filaTarjertas1 = document.createAttribute("id");
att_id_filaTarjertas1.value = "CardRow1";
filaTarjetas1.setAttributeNode(att_id_filaTarjertas1);

// -----------------------------------------------------------------------------

var filaTarjetas2 = document.createElement("DIV");
var att_class_filaTarjetas2 = document.createAttribute("class");
att_class_filaTarjetas2.value = "row justify-content-center";
filaTarjetas2.setAttributeNode(att_class_filaTarjetas2);

var att_id_filaTarjertas2 = document.createAttribute("id");
att_id_filaTarjertas2.value = "CardRow2";
filaTarjetas2.setAttributeNode(att_id_filaTarjertas2);

// -----------------------------------------------------------------------------

function crearTarjeta(nombreHotel) {

    // -----------------------------------------------------------------------------

    var contenedor_tarjeta = document.createElement("DIV");

    var att_class_contenedor_tarjeta = document.createAttribute("class");
    att_class_contenedor_tarjeta.value = "col-md-auto";
    contenedor_tarjeta.setAttributeNode(att_class_contenedor_tarjeta);

    // -----------------------------------------------------------------------------

    var tarjeta = document.createElement("DIV");

    var att_class_tarjeta = document.createAttribute("class");
    att_class_tarjeta.value = "card";
    tarjeta.setAttributeNode(att_class_tarjeta);

    var att_style_tarjeta = document.createAttribute("style");
    att_style_tarjeta.value = "width: 18 rem;"
    tarjeta.setAttributeNode(att_style_tarjeta);

    // ----------------------------------------------------------------------------

    var img_tarjeta = document.createElement("IMG");

    var att_class_img_tarjeta = document.createAttribute("class");
    att_class_img_tarjeta.value = "card-img-top";
    img_tarjeta.setAttributeNode(att_class_img_tarjeta);

    var att_src_img_tarjeta = document.createAttribute("src");
    att_src_img_tarjeta.value = imagenHotel;
    img_tarjeta.setAttributeNode(att_src_img_tarjeta);

    var att_alt_img_tarjeta = document.createAttribute("alt");
    att_alt_img_tarjeta.value = "Card image cap";
    img_tarjeta.setAttributeNode(att_alt_img_tarjeta);

    // -----------------------------------------------------------------------------

    var cuerpoTexto_tarjeta = document.createElement("DIV");

    var att_class_cuerpoTexto_tarjeta = document.createAttribute("class");
    att_class_cuerpoTexto_tarjeta.value = "card-body";
    cuerpoTexto_tarjeta.setAttributeNode(att_class_cuerpoTexto_tarjeta);

    // -----------------------------------------------------------------------------

    var header_tarjeta = document.createElement("H5");

    var att_class_header_tarjeta = document.createAttribute("class");
    att_class_header_tarjeta.value = "card-title";
    header_tarjeta.setAttributeNode(att_class_header_tarjeta);


    // -----------------------------------------------------------------------------

    var texto_header_tarjeta = document.createTextNode(nombreHotel);
    header_tarjeta.appendChild(texto_header_tarjeta);


    // -----------------------------------------------------------------------------

    var divIcono1_tarjeta = document.createElement("DIV");
    var icono1_tarjeta = document.createElement("IMG");

    var att_class_icono1_tarjeta = document.createAttribute("class");
    att_class_icono1_tarjeta.value = "icon";
    icono1_tarjeta.setAttributeNode(att_class_icono1_tarjeta);

    var att_src_icono1_tarjeta = document.createAttribute("src");
    att_src_icono1_tarjeta.value = icono1;
    icono1_tarjeta.setAttributeNode(att_src_icono1_tarjeta);

    var span_icono1_tarjeta = document.createElement("span");
    span_icono1_tarjeta.textContent = " Wifi Gratuito";

    // ------------------------------------------------------------------------------

    var divIcono2_tarjeta = document.createElement("DIV");
    var icono2_tarjeta = document.createElement("IMG");

    var att_class_icono2_tarjeta = document.createAttribute("class");
    att_class_icono2_tarjeta.value = "icon";
    icono2_tarjeta.setAttributeNode(att_class_icono2_tarjeta);

    var att_src_icono2_tarjeta = document.createAttribute("src");
    att_src_icono2_tarjeta.value = icono2;
    icono2_tarjeta.setAttributeNode(att_src_icono2_tarjeta);

    var span_icono2_tarjeta = document.createElement("span");
    span_icono2_tarjeta.textContent = " Piscina";

    // -----------------------------------------------------------------------------

    var parrafo_tarjeta = document.createElement("P");

    var att_class_parrafo_tarjeta = document.createAttribute("class");
    att_class_parrafo_tarjeta.value = "card-text";
    parrafo_tarjeta.setAttributeNode(att_class_parrafo_tarjeta);

    // -----------------------------------------------------------------------------

    var texto_parrafo_tarjeta = document.createTextNode("265 € (1 persona - 1 día)");
    parrafo_tarjeta.appendChild(texto_parrafo_tarjeta);

    // ----------------------------------------------------------------------------

    var cuerpoEnlaceBoton_tarjeta = document.createElement("DIV");

    var att_class_cuerpoEnlaceBoton_tarjeta = document.createAttribute("class");
    att_class_cuerpoEnlaceBoton_tarjeta.value = "card-body";
    cuerpoEnlaceBoton_tarjeta.setAttributeNode(att_class_cuerpoEnlaceBoton_tarjeta);

    // ----------------------------------------------------------------------------

    var enlaceBoton_tarjeta = document.createElement("A");

    var att_href_enlaceBoton_tarjeta = document.createAttribute("href");
    att_href_enlaceBoton_tarjeta.value = "EsPrincep.html";
    enlaceBoton_tarjeta.setAttributeNode(att_href_enlaceBoton_tarjeta);

    var att_class_enlaceBoton_tarjeta = document.createAttribute("class");
    att_class_enlaceBoton_tarjeta.value = "btn btn-primary";
    enlaceBoton_tarjeta.setAttributeNode(att_class_enlaceBoton_tarjeta);

    enlaceBoton_tarjeta.innerText = "Ver más";


    // ----------------------------------------------------------------------------

    cuerpoEnlaceBoton_tarjeta.appendChild(enlaceBoton_tarjeta);

    cuerpoTexto_tarjeta.appendChild(header_tarjeta);

    divIcono1_tarjeta.appendChild(icono1_tarjeta);
    divIcono1_tarjeta.appendChild(span_icono1_tarjeta);
    cuerpoTexto_tarjeta.appendChild(divIcono1_tarjeta);


    divIcono2_tarjeta.appendChild(icono2_tarjeta);
    divIcono2_tarjeta.appendChild(span_icono2_tarjeta);
    cuerpoTexto_tarjeta.appendChild(divIcono2_tarjeta);

    cuerpoTexto_tarjeta.appendChild(parrafo_tarjeta);

    tarjeta.appendChild(img_tarjeta);
    tarjeta.appendChild(cuerpoTexto_tarjeta);
    tarjeta.appendChild(cuerpoEnlaceBoton_tarjeta);

    contenedor_tarjeta.appendChild(tarjeta);
    fila.appendChild(contenedor_tarjeta);

    columnaGrandeDerecha.appendChild(fila);
    // document.body.appendChild(parentRow);

}