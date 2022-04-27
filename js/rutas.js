let dataRutas;
let map = undefined;


async function getJSONFile() {
  // lo guarda en la memoria principal (RAM)
  const response = await fetch("./json/monumentos.json");
  const { monumentos } = await response.json();
  dataRutas = monumentos;
}

function getQueryParams() {
  const search = new URLSearchParams(window.location.search);
  return search.get("comunidad");
}

// Search bar especifica de la pagina rutas
function submitSearch(e) {
  e.preventDefault();
  const term = document
    .getElementById("searchBarMonum")
    .value.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  window.location.href = `/?term=${term}#filaTituloCatalogo`;
}


// Generación dinámica del mapa de routas.
function getRouteMap() {
  var container = L.DomUtil.get("map1");
  if (container != null) {
    container._leaflet_id = null;
  }
  if (map != undefined) {
    map.remove();
    map = undefined;
  }

  const select = document.getElementById("selectComunidad");
  console.log(select.value);

  /*
  var blueIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  */
  map = L.map("map");

  // map.eachLayer(function (layer) {
  //   map.removeLayer(layer);
  // });

  L.tileLayer(
    "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=Xnyz2NNvIPyLSREOwih7",
    {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
  ).addTo(map);

  // Bucle para generar un marcador para cada monumento de la comunidad.

  var markers = [];
  var name = [];
  var identifier = [];
  let iteration = 0;

  dataRutas.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      if (nombreComunidad.localeCompare(select.value) == 0) {
        comunidades[nombreComunidad].forEach((monumento) => {
          // console.log(monumento.latitude, monumento.longitude);
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
          name.push(
            `${monumento.name}`
          ),
          identifier.push(
            `${monumento.identifier}`
          );
          /*
          markers[markerIndex] = L.marker([`${monumento.latitude}`, `${monumento.longitude}`], {
            icon: blueIcon,
          }).addTo(map);
          markers[markerIndex].bindPopup(`${monumento.name}`);
          */
        });
      }
    });
  });

  /*
  var marker = L.marker([39.56771199239134, 2.648343010456217], {
    icon: blueIcon,
  }).addTo(map);
  marker.bindPopup("Catedral-Basílica de Santa María");
  */

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

  navigator.geolocation.getCurrentPosition(showCurrentPos);
  function showCurrentPos(position) {
    var currentPos = L.marker(
      [position.coords.latitude, position.coords.longitude],
      { icon: greenIcon }
    ).addTo(map);
    currentPos.bindPopup("Tu posición actual");
  }

  L.Routing.control({
    // show: false,
    collapsible: true,
    draggableWaypoints: false,
    addWaypoints: false,
    waypoints: markers,
    createMarker: function(i,wp,nWps){
      return L.marker(wp.latLng)
      .bindPopup(function(){
        return ' <a href="/monumento.html?identifier='+ identifier[i] +'">'+ name[i] + '</a>';
      });
    },
    router: L.Routing.mapbox(
      "pk.eyJ1IjoiYWRyaWJlbm5hc2FyIiwiYSI6ImNsMGprcDMyMTAxZHczYmwxaXNsZWp3NjcifQ.5tEEAlSEDIIbUx4NS5E0lQ"
    ),
  }).addTo(map);


  /*
  L.Routing.control({
      waypoints: [
          L.latLng(39.56771199239134, 2.648343010456217),
          L.latLng(39.60, 2.70),
          L.latLng(39.64, 2.75)
      ],
      router: L.Routing.graphHopper('ed1f5692-1b9d-4de6-a4e3-694fd5868ce1')
  }).addTo(map);
  */

  // L.control._container.style.display = "None";
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

function completeMonumentsArray(){
  var monumentsArray = [];

  dataRutas.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
        comunidades[nombreComunidad].forEach((monumento) => {
          monumentsArray.push(
            `${monumento.name}`,
          )
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
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
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
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
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
  const select = document.getElementById("selectComunidad");
  select.value = getQueryParams();
  getRouteMap();
  autocomplete(document.getElementById("searchBarRutas"));
};
