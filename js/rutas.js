let dataRutas;
let map = undefined;
let community;
let dataRestaurantes;

async function getJSONFile() {
  // lo guarda en la memoria principal (RAM)
  const response = await fetch("./json/monumentos.json");
  const { monumentos } = await response.json();
  dataRutas = monumentos;
}

async function getExternJSONFile() {
  const response = await fetch("https://gastronomiaesp.000webhostapp.com/JSON/cocineros.json");
  const { cocineros } = await response.json();
  dataRestaurantes = cocineros;
}

function getQueryParams() {
  const search = new URLSearchParams(window.location.search);
  return search.get("comunidad");
}

function generateJSONld(monumento) {
  const script = document.createElement("script");
  script.setAttribute("type", "application/ld+json");

  let s = {
    "@context": "https://www.schema.org",
    "@type": "LandmarksOrHistoricalBuildings",
    "name": monumento.name,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": monumento.latitude,
      "longitude": monumento.longitude
    },
  };
  script.textContent += JSON.stringify(s);
  document.head.appendChild(script);
}

// const marker = {
//   visited: Boolean,
//   coords: L.latLng(),
//   id : ""
// };

// function Marker (visited,coords,id){
//   this.visited= visited,
//   this.coords=  coords,
//   this.id = id
// };

// function orderMarkersArrayPerDistance(arr){
//   var tempArr = [];
//   var aux=0;
//   for (var i = 0; i<arr.length;i++){
//     for ( var j = 0; i<arr.length-1;i++){
//       if(L.GeometryUtil.distance(map,arr[i].coords,arr[j+1].coords)>aux){

//       }
//     }

//   }

// }

function switchRouteMap() {
  const select = document.getElementById("selectComunidad");
  window.location.href = `/rutas.html?comunidad=${select.value}`;
}

function switchRouteMapB(value) {
  window.location.href = `/rutas.html?comunidad=${value}`;
}

function reverseGeocoding(lat, long) {
  var geocodeService = L.esri.Geocoding.geocodeService();

  geocodeService.reverse().latlng([lat, long]).run(function (error, result) {
    if (error) {
      return;
    }
    var arr = result.address.Match_addr.split(',');
    return arr[arr.length - 1];
  });

}

// Generación dinámica del mapa de routas.
function getRouteMap() {
  const select = document.getElementById("selectComunidad");
  if (!select.value) {
    select.value = "Andalucía";
  }
  community = select.value;
  map = L.map("map");

  L.tileLayer(
    "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=Xnyz2NNvIPyLSREOwih7",
    {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
  ).addTo(map);

  try {
    // Obtención y procesado de los datos JSON obtenidos de otro grupo.
    let markersLat = [];
    let markersLong = [];
    let nameRest = [];
    dataRestaurantes.forEach((cocinero) => {
      cocinero.restaurantes.restaurant.forEach((restaurante) => {
        var geocodeService = L.esri.Geocoding.geocodeService();

        geocodeService.reverse().latlng([restaurante.geo.latitude, restaurante.geo.longitude]).run(function (error, result) {
          if (error) {
            return;
          }

          var arr = result.address.Match_addr.split(',');
          arr = arr[arr.length - 1].slice(1);

          if (arr.localeCompare(select.value) == 0) {
            markersLat.push(`${restaurante.geo.latitude}`),
              markersLong.push(`${restaurante.geo.longitude}`),
              nameRest.push((`${restaurante.name}`));

            // Para los restaurantes
            var redIcon = new L.Icon({
              iconUrl:
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
              shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            });

            for (let index = 0; index < markersLat.length; index++) {
              var marker = L.marker([markersLat[index], markersLong[index]],
                { icon: redIcon },
                { alt: 'Map marker' }).addTo(map);
              marker.bindPopup(nameRest[index]);
            }
          }
        });
      })
    });
  }
  catch (error) {
    console.error(error);
  }

  // Bucle para generar un marcador para cada monumento de la comunidad.

  var markers = [];
  // var objects = [];
  var name = [];
  var identifier = [];
  let iteration = 0;

  dataRutas.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      if (nombreComunidad.localeCompare(select.value) == 0) {
        comunidades[nombreComunidad].forEach((monumento) => {
          generateJSONld(monumento);
          if (iteration == 0) {
            map.setView(
              [`${monumento.latitude}`, `${monumento.longitude}`],
              (zoom = 9)
            );
          }
          iteration++;
          markers.push(
            L.latLng(`${monumento.latitude}`, `${monumento.longitude}`)
          ),
            name.push(`${monumento.name}`),
            identifier.push(`${monumento.identifier}`);
        });
      }
    });
  });

  if (navigator.geolocation) {
    if (sessionStorage.getItem("segundaVezRutas") === null) {
      map.addEventListener("drag click", mostrarGeolocalizacion);

      function mostrarGeolocalizacion() {
        alert('Para una mejor experiencia permita la geolocalización.');
        navigator.geolocation.getCurrentPosition(showCurrentPos);
        function showCurrentPos(position) {
          var currentPos = L.marker(
            [position.coords.latitude, position.coords.longitude],
            { icon: greenIcon },
            { alt: 'Map marker' }
          ).addTo(map);
          currentPos.bindPopup("Tu posición actual");
        }
        map.removeEventListener("drag click", mostrarGeolocalizacion);
        sessionStorage.setItem("segundaVezRutas", true);
      }
    } else {
      navigator.geolocation.getCurrentPosition(showCurrentPos);
      function showCurrentPos(position) {
        var currentPos = L.marker(
          [position.coords.latitude, position.coords.longitude],
          { icon: greenIcon },
          { alt: 'Map marker' }
        ).addTo(map);
        currentPos.bindPopup("Tu posición actual");
      }
    }
  } else {
    alert('La geolocalización no está soportada');
  }

  // Para la posición del usuario
  var greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  L.Routing.control({
    // show: false,
    collapsible: true,
    draggableWaypoints: false,
    addWaypoints: false,
    waypoints: markers,
    createMarker: function (i, wp, nWps) {
      return L.marker(wp.latLng, { alt: 'Map marker' }).bindPopup(function () {
        return (
          ' <a href="/monumento.html?identifier=' +
          identifier[i] +
          '">' +
          name[i] +
          "</a>"
        );
      });
    },
    router: L.Routing.mapbox(
      "pk.eyJ1IjoiYWRyaWJlbm5hc2FyIiwiYSI6ImNsMGprcDMyMTAxZHczYmwxaXNsZWp3NjcifQ.5tEEAlSEDIIbUx4NS5E0lQ"
    ),
  }).addTo(map);

  // Leyenda
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Leyenda</h4>";
    div.innerHTML += '<img class="icon" src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" alt=""></img><span>Monumento</span><br>';
    div.innerHTML += '<img class="icon" src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" alt=""><span>Restaurante Destacado</span><br>';
    div.innerHTML += '<img class="icon" src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" alt=""><span>Posición Actual</span><br>';
    div.innerHTML += '<img class="icon" src="./img/iconos/ruta.svg" alt=""><span>Ruta a seguir</span><br>';
    return div;
  };

  legend.addTo(map);

  // Comunidad
  var comunidadSeleccionada = L.control({
    position: "bottomleft"
  });

  comunidadSeleccionada.onAdd = function (map) {
    var div = L.DomUtil.create("div", "comunidad");
    div.innerHTML += "<h4>" + `${select.value}` + "</h4>";
    return div;
  };

  comunidadSeleccionada.addTo(map);
}

function getFromDB() {
  let comments;
  // Check from localstorage

  if (localStorage.getItem("comments") === null) {
    comments = {};
  } else {
    comments = JSON.parse(localStorage.getItem("comments"));
  }

  return comments;
}

function saveIntoDB(comment) {
  const comments = this.getFromDB();

  if (!comments[community]) {
    comments[community] = [];
  }
  comments[community].push(comment);

  // Add the new array into the localstorage
  localStorage.setItem("comments", JSON.stringify(comments));
  console.log(JSON.stringify(comments));
}

function writeComment(e) {
  // e.preventDefault();
  console.log("submit was clicked");
  const name = document.getElementById("nameInput");
  const text = document.getElementById("commentInput");
  console.log(uuidv4());
  const comment = {
    id: uuidv4(),
    name: name.value,
    text: text.value,
    date: Date.now(),
    liked: false
  };
  saveIntoDB(comment);
  generateCommentFeed();
  name.value = "";
  text.value = "";
}

function generateCommentFeed() {
  const comments = getFromDB()[community];
  let commentsHTML = "";
  // console.log(comments);
  if (!comments) {
    let commentHTML = /*HTML*/
      `
      <div id="contenedorComentarioPorDefecto">
        <h5> Esto está muy vacío ... </h5>
        <h6 id="cometarioPorDefecto"> ¡Sé el primero en dejar un comentario! <h6>
        <div id="svgComentarios"></div>
        </div>
    `
    document.getElementById("commentsDiv").innerHTML = commentHTML;
  } else {

    comments.forEach((comment) => {
      const date = new Date(comment.date);
      const commentHTML = /* HTML */
        `
      <div id="commentContainer">
        <div class="d-flex flex-start align-items-center ">
          <img
            class="rounded-circle shadow-1-strong me-3"
            src="https://ui-avatars.com/api/?name=${comment.name}"
            alt="avatar"
            width="60"
            height="60"
            alt="Comment Icon Image"
          />
          <div>
            <h6 class="fw-bold text-primary mb-1">${comment.name}</h6>
            <p class="text-muted small mb-0">${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</p>
          </div>
        </div>

        <p class="ms-3 mt-3 mb-4 pb-2" id="commentText">
          ${comment.text}
        </p>

        <div class=" d-flex justify-content-start mb-4">
          <button onclick="toggleLiked('${comment.id}')" class="favorite-btn btn btn-link d-flex align-items-center me-3 text-decoration-none" id="heart">
            
            <p class="mb-0 fs-2">${comment.liked ? "♥" : "♡"}</p>
          </button>
        </div>
        </div>
      `;
      commentsHTML += commentHTML;
    });
    document.getElementById("commentsDiv").innerHTML = commentsHTML;
  }
}

function toggleLiked(id) {
  let comments = getFromDB();
  comments[community] = comments[community].map(comment => {
    if (comment.id === id) {
      comment.liked = !comment.liked;
    }
    return comment;
  });
  localStorage.setItem("comments", JSON.stringify(comments));
  generateCommentFeed();
}

// Search bar especifica de la pagina monumento
function submitSearch(e) {
  e.preventDefault();
  const term = document
    .getElementById("searchBarRutas")
    .value.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  window.location.href = `/?term=${term}#filaTituloCatalogo`;
}


function completeMonumentsArray() {
  var monumentsArray = [];

  dataRutas.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      comunidades[nombreComunidad].forEach((monumento) => {
        monumentsArray.push(`${monumento.name}`);
      });
    });
  });
  return monumentsArray;
}

function autocomplete(inp) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  var arr = completeMonumentsArray();
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          document.getElementById("searchBarRutas").focus();
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    }
    // } else if (e.keyCode == 13) {
    //   /*If the ENTER key is pressed, prevent the form from being submitted,*/
    //   e.preventDefault();
    //   if (currentFocus > -1) {
    //     /*and simulate a click on the "active" item:*/
    //     if (x) x[currentFocus].click();
    //   }
    // }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

window.onload = async function () {
  await getJSONFile();
  try {
    await getExternJSONFile();
  }
  catch (error) {
    console.error(error);
  }
  finally {
    const select = document.getElementById("selectComunidad");
    select.value = getQueryParams();
    getRouteMap();
    autocomplete(document.getElementById("searchBarRutas"));
    generateCommentFeed();
  }
};
