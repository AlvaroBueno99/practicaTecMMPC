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

function generateJSONld(monumento){
  const script = document.createElement("script");
  script.setAttribute("type","application/ld+json");

          let s = {
            "@context":"https://www.schema.org",
            "@type": "LandmarksOrHistoricalBuildings",
            "name":monumento.name,
            "identifier": monumento.identifier,
            "image":[
              monumento.image[0],
              monumento.image[1],
              monumento.image[2]
            ],
            "description": monumento.description,
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": monumento.latitude,
              "longitude": monumento.longitude
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": monumento.address
            },
            "additionalProperty": {
              "@type": "PropertyValue",
              "name": "yearBuilt",
              "value": monumento.yearBuilt
            },
            "subjectOf":{
              "@type": "VideoObject",
              "name": [
                monumento.video[0],
                monumento.video[1]
              ],
              "thumbnail": "Monument image",
              "description": "Short video about the monument",
              "uploadDate": "27/05/2022",
              "thumbnailURL": monumento.image[0]
            }
          };
          script.textContent+=JSON.stringify(s);
  document.head.appendChild(script);
}

function generateSlider(monumento) {
  const infoSlider =/* HTML */

    `
    <div  id="carouselMonumento" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselMonumento" data-bs-slide-to="0" class="active" aria-current="true"
        aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselMonumento" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselMonumento" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="${monumento.image[0]}" id="slide1" alt="imagen del monumento" width="788" height="474">
      </div>
      <div class="carousel-item">
        <img src="${monumento.image[1]}" id="slide2" alt="imagen del monumento" width="788" height="474">
      </div>
      <div class="carousel-item">
        <img src="${monumento.image[2]}" id="slide3" alt="imagen del monumento" width="788" height="474">
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselMonumento" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselMonumento" data-bs-slide="next">
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
  let latitud = +(Math.round(`${monumento.latitude}` + "e+5")  + "e-5");
  let longitud = +(Math.round(`${monumento.longitude}` + "e+5")  + "e-5");
  const infoCard =
    /* HTML */

    `
  <div class="card-header">
      
      <p class="datosCartaMon"><img src="img/iconos/landmark.svg" class="iconoPagMonum" alt=""><br> ${monumento.name}</p>
      <p class="datosCartaMon"><img src="img/iconos/calendar.svg" class="iconoPagMonum" alt=""> <br>${antiguedad} años de <br> antigüedad</p> 
      <p class="datosCartaMon"><img src="img/iconos/place.svg" class="iconoPagMonum" alt=""> <br>${monumento.address}</p> 
      <p class=" datosCartaMon"> <img src="img/iconos/map.svg" class="iconoPagMonum" alt=""> <br>
        (${latitud} / ${longitud})
        <meta content=${monumento.latitude} />
        <meta content=${monumento.longitude} />
        </p>
  </div>
  <div class="card-body" id="monumentCard">
      <h1 class="card-title">${monumento.name}</h1>
      <p class="card-text" id="monumentCardText"> ${monumento.description}
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
  var marker = L.marker([`${monumento.latitude}`, `${monumento.longitude}`], 
  {icon: blueIcon},
  {alt: 'Map marker'},).addTo(map);
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

  if (navigator.geolocation) {
    if(sessionStorage.getItem("segundaVezMonum")===null){
      map.addEventListener("drag click", mostrarGeolocalizacion);

    function mostrarGeolocalizacion() {
      alert('Para una mejor experiencia permita la geolocalización.');
      navigator.geolocation.getCurrentPosition(showCurrentPos);
      function showCurrentPos(position) {
        var currentPos = L.marker(
          [position.coords.latitude, position.coords.longitude],
          { icon: greenIcon },
          {alt: 'Map marker'}
        ).addTo(map);
        currentPos.bindPopup("Tu posición actual");
      }
      map.removeEventListener("drag click", mostrarGeolocalizacion);
      sessionStorage.setItem("segundaVezMonum", true);
    }
    }else{
      navigator.geolocation.getCurrentPosition(showCurrentPos);
      function showCurrentPos(position) {
        var currentPos = L.marker(
          [position.coords.latitude, position.coords.longitude],
          { icon: greenIcon },
          {alt: 'Map marker'}
        ).addTo(map);
        currentPos.bindPopup("Tu posición actual");
      }
    }
  } else {
    alert('La geolocalización no está soportada');
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
    let iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
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

function completeMonumentsArray(){
  var monumentsArray = [];

  detailsData.forEach((comunidades) => {
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
              document.getElementById("searchBarMonum").focus();
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
        addActive(x);}
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

  generateJSONld(monument);

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

  autocomplete(document.getElementById("searchBarMonum"));
};
