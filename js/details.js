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
  return search.get("id");
}

function generateInformationCard(monumento) {
  const infoCard = // HTML

    `
  <div class="card-header">
  <div class="d-flex justify-content-between align-items-center">
      <i class="bi bi-ticket"> ${monumento.name}</i>
      <i class="bi bi-calendar"> Antiguedad</i>
      <i class="bi bi-house"> Dirección</i>
      <i class="bi bi-map"> Longitud/Latitud</i>
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

// Weather API
$(document).ready(function(){

  function getWeather(){
      let lat = 39.567727402259074 
      let long = 2.6512464232098596 
      let API_KEY = "bd1dd16fb46e8746f274b42dd40b7008";
      console.log(API_KEY);
      let baseURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${API_KEY}&lang=es`;

      $.get(baseURL,function(res){
          let data = res.current;
          let temp = Math.floor(data.temp - 273);
          let condition = data.weather[0].description;
          let icon = data.weather[0].icon;
          let iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
          let humidity = data.humidity;

          $('#temp-main').html(`${temp}°C`);
          console.log(`${temp}°`);
          $('#condition').html(condition);
          $('#weatherIcon').attr("src", iconURL);
          $('#humidity').html(`${humidity} %`); 

      })
      
  }

  getWeather();
})

// Search bar especifica de la pagina monumento
function submitSearch(e){
  e.preventDefault();
  const term = document
  .getElementById("searchBarMonum")
  .value.trim()
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  window.location.href = `/?term=${term}#filaTituloCatalogo`;
}

window.onload = async function () {
  await getJSONFile();
  const query = getQueryParams();
  let monument = null;
  detailsData.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      comunidades[nombreComunidad].forEach((monumento) => {
        if (monumento.id === parseInt(query)) {
          monument = monumento;
          comunidad = nombreComunidad;
        }
      });
    });
  });
  if (monument == null) {
    window.location.href = "/";
  }

  const infoCard = document.getElementById("cartaInformacion");
  infoCard.innerHTML = generateInformationCard(monument);

  document.getElementById("botonRutaRelacionada").href=`rutas.html?comunidad=${comunidad}`
};
