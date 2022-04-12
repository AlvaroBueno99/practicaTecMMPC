let dataJSON;
let term = "";

// para los favoritos:
let favorites = [];

async function getJSONFile() {
  // lo guarda en la memoria principal (RAM)
  const response = await fetch("./json/monumentos.json");
  const { monumentos } = await response.json();
  dataJSON = monumentos;
}

// Generate HTML dinamically with JS

function generateCard(monumento) {
  const card =
    /* HTML */

    `
      <div class="col-auto m-4">
        <div
          class="card overflow zoom hoverCard"
          id="card-${monumento.identifier}"
          style="width: 18rem;"
        >
          <img
            class="card-img-top"
            src="${monumento.image}"
            alt="Card image cap"
          />
          <div class="card-body">
            <h5 class="card-title">${monumento.name}</h5>
            <p class="card-text ">${monumento.address}</p>
            <p class="card-text">${monumento.yearBuilt}</p>
            <a href="/monumento.html?identifier=${monumento.identifier}" class="btn btn-primary"
              >Go somewhere</a
            >
            <button
              type="button"
              data-id="${monumento.identifier}"
              class="favorite-btn btn btn-outline-info ${monumento.isFavorite
      ? "is-favorite"
      : ""}"
              onclick="resultsDelegation(event)"
            >
              ${monumento.isFavorite ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </div>
    `;

  return card;
}

function getQueryParams() {
  const search = new URLSearchParams(window.location.search);
  return search.get("term") || "";
}

function pruebaObtencionDatosJSON() {
  let totalMonuments = 0;
  console.log("number of comunities in JSON: ", dataJSON.length);
  dataJSON.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      console.log("comunidad: ", nombreComunidad);
      console.log(
        "monuments found in ",
        nombreComunidad,
        ": ",
        comunidades[nombreComunidad].length
      );
      comunidades[nombreComunidad].forEach((monumento) => {
        console.log("monumento: ", monumento);
        totalMonuments++;
      });
    });
  });
  console.log("number of monuments found in JSON: ", totalMonuments);
}

// ----------------------- Dynamic charts -----------------------------

// Set options

function setHighchartsOptions() {
  // Radialize the colors
  Highcharts.setOptions({
    colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
      return {
        radialGradient: {
          cx: 0.5,
          cy: 0.3,
          r: 0.7,
        },
        stops: [
          [0, color],
          [1, Highcharts.color(color).brighten(-0.3).get("rgb")], // darken
        ],
      };
    }),
  });
}

// Pie chart
function generatePieChart() {

  // Obtencion de los datos necesarios del JSON
  let totalMonuments = 0;
  let jsonArray = [];
  dataJSON.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      comunidades[nombreComunidad].forEach((monumento) => {
        totalMonuments++;
      });
    });
  });

  dataJSON.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      jsonArray.push({ name: nombreComunidad, y: (comunidades[nombreComunidad].length / totalMonuments) * 100 });
    });
  });


  // Build the chart
  Highcharts.chart("pieChartContainer", {
    chart: {
      plotBackgroundColor: null,
      backgroundColor: 'rgba(0, 0, 0, 0.658)',
      borderColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "Distribución de monumentos en cada comunidad",
      style: {
        color: '#FFFF',
      }

    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          connectorColor: "silver",
        },
      },
    },
    series: [
      {
        name: "Share",
        data: jsonArray,
      },
    ],
  });
}

// Column chart
function generateColumChart() {

  // Obtención de los datos del necesarios del JSON
  let arrayComunidades = [];
  let arrayAntigüedades = [];
  let antigüedadTotalComunidad = 0;
  var currentYear = new Date().getFullYear(); // obtenemos el año actual.

  // Obtenemos los nombres de todas las comunidades.
  dataJSON.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      arrayComunidades.push(nombreComunidad);
    });
  });

  // Obtenemos la antigüedad media de los monumentos de todas las comunidades.
  dataJSON.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      // console.log("comunidad: ", nombreComunidad);
      comunidades[nombreComunidad].forEach((monumento) => {
        // console.log("monumento: ", monumento);
        antigüedadTotalComunidad += (currentYear - monumento.yearBuilt);
      });
      arrayAntigüedades.push(antigüedadTotalComunidad / comunidades[nombreComunidad].length);
      antigüedadTotalComunidad = 0;
    });
  });

  Highcharts.chart("columnChartContainer", {
    chart: {
      type: "column",
      backgroundColor: 'rgba(0, 0, 0, 0.658)',
      borderColor: 'transparent',
    },
    legend:{
      itemStyle:{
        color:'#FFFF',
      },
    },
    title: {
      text: "Antigüedad media de monumentos en cada comunidad",
      style: {
        color: '#FFFF',
      }
    },
    subtitle: {
      // text: "Source: WorldClimate.com",
    },
    xAxis: {
      categories: arrayComunidades,
      crosshair: true,
      labels: {
        style: {
            color: '#FFFF'
        }}
    },
    yAxis: {
      min: 0,
      title: {
        text: "Antigüedad (años)",
        style: {
          color: '#FFFF',
        }
      },
      labels: {
        style: {
            color: '#FFFF'
        }}
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} años</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Antigüedad media (años)",
        data: arrayAntigüedades,
      },
    ],
  });
}

// Filters

function filter(displayFavorites = false, search = false) {
  // favorites
  favorites = JSON.parse(localStorage.getItem("monuments"));
  if (favorites === null) {
    favorites = [];
  }
  let cards = "";
  let monumentsArray = [];
  let select = document.getElementById("selectComunidad").value;
  // let term = document.getElementById("selectComunidad").value;

  let filter = document.querySelector('input[name="filter"]:checked').value;
  let order = document.querySelector('input[name="order"]:checked').value;

  dataJSON.forEach((comunidades) => {
    Object.keys(comunidades).forEach((nombreComunidad) => {
      if (nombreComunidad === select || select === "") {
        comunidades[nombreComunidad].forEach((monumento) => {
          if (
            !displayFavorites ||
            (displayFavorites && favorites.includes(monumento.identifier))
          ) {
            monumento.isFavorite = favorites.includes(monumento.identifier);
            // console.log("favorites", favorites);
            monumentsArray.push(monumento);
          }
        });
      }
    });
  });

  const filtered = _.filter(monumentsArray, (monumento) => {
    return (
      term === "" ||
      !search ||
      monumento.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(term)
    );
  });

  _.orderBy(filtered, [filter], [order]).forEach((monumento) => {
    // Libreria lodash

    cards += generateCard(monumento);
  });

  const cardRow = document.getElementById("filaCartas");
  cardRow.innerHTML = cards;
}

function setSearch(id) {
  term = document
    .getElementById(id)
    .value.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  filter(false, true);
  location.href = "#filaTituloCatalogo"; // sitúa al usuario en la sección de cartas.
}

// Favourites

function saveIntoDB(monument) {
  const monuments = this.getFromDB();

  monuments.push(monument.identifier);

  // Add the new array into the localstorage
  localStorage.setItem("monuments", JSON.stringify(monuments));
}

function removeFromDB(id) {
  const monuments = this.getFromDB();

  // Loop
  monuments.forEach((monumentID, index) => {
    if (id === monumentID) {
      monuments.splice(index, 1);
    }
  });
  // Set the array into local storage
  localStorage.setItem("monuments", JSON.stringify(monuments));
}

function getFromDB() {
  let monuments;
  // Check from localstorage

  if (localStorage.getItem("monuments") === null) {
    monuments = [];
  } else {
    monuments = JSON.parse(localStorage.getItem("monuments"));
  }
  return monuments;
}

function resultsDelegation(e) {
  e.stopPropagation();

  e.preventDefault();
  console.log(e);
  console.log(e.target);
  console.log(`#card-${e.target.dataset.id} > div > button > i`);
  icon = document.querySelector(
    `#card-${e.target.dataset.id} > div > button > i`
  );

  // When favourite btn is clicked
  if (e.target.classList.contains("favorite-btn")) {
    if (e.target.classList.contains("is-favorite")) {
      removeFromDB(e.target.dataset.id);
      // Remove the class
      e.target.classList.remove("is-favorite");
      e.target.textContent = "♡";
    } else {
      // Add the class
      e.target.classList.add("is-favorite");
      e.target.textContent = "♥";
      // Get Info
      const cardBody = e.target.parentElement;

      const monumentInfo = {
        identifier: e.target.dataset.id,
      };

      // console.log(drinkInfo);
      // Add into the storage
      saveIntoDB(monumentInfo);
    }
  }
}

window.onload = async function () {
  // ¿Lo tiene que hacer el usuario, o tiene que salir "inmediatamente" cuando cargue la pagina?
  // dentro del onload cuando hay que acceder al DOM "instantaneamente".
  await getJSONFile();

  pruebaObtencionDatosJSON();

  generateColumChart();
  setHighchartsOptions();
  generatePieChart();

  term = getQueryParams();

  filter(false, true);
};
