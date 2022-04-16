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


window.onload = async function () {
  await getJSONFile();
  const select = document.getElementById("selectComunidad");
  select.value = getQueryParams();
  getRouteMap();
};
