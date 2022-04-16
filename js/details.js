let detailsData;
let comunidad;

async function getJSONFile() {
  // lo guarda en la memoria principal (RAM)
  const response = await fetch("./json/monumentos.json");
  const { monumentos } = await response.json();
  detailsData = monumentos;
}

function getQueryParams() {
  const search = new URLSearchParams(window.location.search);
  return search.get("identifier");
}
function generateSlider(monumento) {
  const infoSlider =
    // HTML

    `
  <div id="carouselMonumento" class="carousel slide" data-bs-ride="carousel">
                            
                        
  <div class="carousel-indicators">
  <button type="button" data-bs-target="#carouselMonumento" data-bs-slide-to="0"
      class="active" aria-current="true" aria-label="Slide 1"></button>
  <button type="button" data-bs-target="#carouselMonumento" data-bs-slide-to="1"
      aria-label="Slide 2"></button>
  <button type="button" data-bs-target="#carouselMonumento" data-bs-slide-to="2"
      aria-label="Slide 3"></button>

</div>
<div class="carousel-inner">
  <div class="carousel-item active" >
      <img  src="${monumento.image[0]}" id="slide1">
  </div>
  <div class="carousel-item" >
      <img  src="${monumento.image[1]}" id="slide2">
  </div>
  <div class="carousel-item" >
      <img  src="${monumento.image[2]}" id="slide3">
  </div>

  <button class="carousel-control-prev" type="button" data-bs-target="#carouselMonumento"
      data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselMonumento"
      data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
  </button>
</div>
</div>
  `;

  return infoSlider;
}

function generateInformationCard(monumento) {
  let antiguedad = (new Date().getFullYear() - `${monumento.yearBuilt}`);
  const infoCard =
    // HTML

    `
  <div class="card-header">
  <div class="d-flex justify-content-between align-items-center">
      <i class="bi bi-ticket"> ${monumento.name}</i>
      <i class="bi bi-calendar"> ${antiguedad}</i>
      <i class="bi bi-house"> ${monumento.address}</i>
      <i class="bi bi-map"> (${monumento.latitude} / ${monumento.longitude})</i>
  </div>
  </div>
  <div class="card-body">
      <h5 class="card-title">${monumento.name}</h5>
      <p class="card-text" id="monumentCardText">The Monument to Alfonso XII (Spanish: Monumento a Alfonso XII) is
          located in Buen Retiro Park (El Retiro), Madrid, Spain. The monument is situated on
          the
          east edge of an artificial lake near the center of the park.

          In 1902, a national contest was held to design a monument for King Alfonso XII at
          the
          initiative of the Queen Mother Maria Christina of Austria. The winner was the
          architect
          José Grases Riera, whose design consisted of a grand colonnade alongside a pond in
          El
          Retiro, with several sculptures surrounding an equestrian statue of the king, with
          everything constructed in bronze and marble.

          Grases Riera died in 1919 with work still in progress. The architect Teodoro
          Anasagasti
          took control of the project without modifying the original design. More than twenty
          sculptors worked on the project. The monument, financed by a popular collection, was
          inaugurated on June 6, 1922. It was the first of many commemorative statues (by
          artists
          such as Mariano Benlliure, Josep Clarà, and Mateo Inurria) that were added to parks
          in
          Spain over the last century.
      </p>

  </div>
  `;

  return infoCard;
}

function generateMap(monumento) {
  
  // Para los monumentos
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

  var map = L.map(document.getElementById("map").id).setView(
    [`${monumento.latitude}`, `${monumento.longitude}`],
    (zoom = 9)
  );
  L.tileLayer(
    "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=Xnyz2NNvIPyLSREOwih7",
    {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
  ).addTo(map);
  var marker = L.marker([`${monumento.latitude}`, `${monumento.longitude}`], {
    icon: blueIcon,
  }).addTo(map);
  marker.bindPopup(`${monumento.name}`);

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

  // return map;
}

function generateVideo(monumento) {
  const infoVideo =
    /* HTML */

    `
      <video controls poster="${monumento.image[0]}" id="vid">
        <source src="${monumento.video[0]}" type="video/webm" />
        <source src="${monumento.video[1]}" type="video/mp4" />
        Su navegador no soporta los formatos de video.
      </video>
    `;

  return infoVideo;
}

// Weather API

function getWeather(monumento) {
  let lat = `${monumento.latitude}`;
  let long = `${monumento.longitude}`;
  let API_KEY = "bd1dd16fb46e8746f274b42dd40b7008";
  
  let baseURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${API_KEY}&lang=es`;

  $.get(baseURL, function (res) {
    let data = res.current;
    let temp = Math.floor(data.temp - 273);
    let condition = data.weather[0].description;
    let icon = data.weather[0].icon;
    let iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    let humidity = data.humidity;

    $("#temp-main").html(`${temp}°C`);
    $("#condition").html(condition);
    $("#weatherIcon").attr("src", iconURL);
    $("#humidity").html(`${humidity} %`);

    $("#tituloTemperatura").html(`Tiempo en ${monumento.name}`);
    $("#tituloHumedad").html(`Humedad en ${monumento.name}`);
  });
}

// Search bar especifica de la pagina monumento
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

window.onload = async function () {
  await getJSONFile();
  const query = getQueryParams();
  let monument = null;
  detailsData.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      comunidades[nombreComunidad].forEach((monumento) => {
        if (monumento.identifier === query) {
          monument = monumento;
          comunidad = nombreComunidad;
        }
      });
    });
  });
  if (monument == null) {
    window.location.href = "/";
  }

  getWeather(monument);

  const infoCard = document.getElementById("cartaInformacion");
  infoCard.innerHTML = generateInformationCard(monument);

  const infoSlider = document.getElementById("carouselImagenes");
  infoSlider.innerHTML = generateSlider(monument);

  generateMap(monument);

  const infoVideo = document.getElementById("contVideo");
  infoVideo.innerHTML = generateVideo(monument);

  document.getElementById(
    "botonRutaRelacionada"
  ).href = `rutas.html?comunidad=${comunidad}`;
};
