let data;
let term = "";

async function getJSONFile() {
  // lo guarda en la memoria principal (RAM)
  const response = await fetch("./json/monumentos.json");
  const { monumentos } = await response.json();
  data = monumentos;
}

function generateCard(monumento) {
  const card = /* HTML */

    `
      <div class="col-auto m-4">
        <div class="card overflow zoom" id="hoverCard" style="width: 18rem;">
          <img
            class="card-img-top"
            src="${monumento.image}"
            alt="Card image cap"
          />
          <div class="card-body">
            <h5 class="card-title">${monumento.name}</h5>
            <p class="card-text ">${monumento.address}</p>
            <p class="card-text">${monumento.year}</p>
            <a
              href="/monumento.html?name=${monumento.name}"
              class="btn btn-primary"
              >Go somewhere</a
            >
          </div>
        </div>
      </div>
    `;

  return card;
}

function filter() {
  // console.log(data);
  let cards = "";
  let monumentsArray = [];
  let select = document.getElementById("selectComunidad").value;
  // let term = document.getElementById("selectComunidad").value;

  let filter = document.querySelector('input[name="filter"]:checked').value;
  let order = document.querySelector('input[name="order"]:checked').value;

  data.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      if (nombreComunidad === select || select === "") {
        comunidades[nombreComunidad].forEach((monumento) => {
          monumentsArray.push(monumento);
        });
      }
    });
  });

  const filtered = _.filter(monumentsArray, (monumento) => {
    return (
      term === "" ||
      monumento.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(term)
    );
  });

  _.orderBy(filtered, [filter], [order]).forEach((monumento) => {
    // libreri lodash
    cards += generateCard(monumento);
  });

  const cardRow = document.getElementById("filaCartas");
  cardRow.innerHTML = cards;
}

function setSearch() {
  term = document
    .getElementById("searchBar")
    .value.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  filter();
}

// Weather API
$(document).ready(function(){

    function getWeather(){
        let lat = 39.57391699749901  
        let long = 2.6421308114331445 
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
            $("#weatherIcon").attr("src", iconURL);
            $('#humidity').html(`${humidity} %`); 

        })
        
    }

    getWeather();
})




window.onload = async function () {
  // ¿Lo tiene que hacer el usuario, o tiene que salir "inmediatamente" cuando cargue la pagina?
  // dentro del onload cuando hay que acceder al DOM "instantaneamente".
  await getJSONFile();
  filter();
};


