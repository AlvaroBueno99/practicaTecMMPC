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

function generateJSONld(monumento){
  const script = document.createElement("script");
  script.setAttribute("type","application/ld+json");

          let s = {
            "@context":"https://www.schema.org",
            "@type": "LandmarksOrHistoricalBuildings",
            "image": monumento.image[0],
            "name": monumento.name,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": monumento.address
            },
            "additionalProperty": {
              "@type": "PropertyValue",
              "name": "yearBuilt",
              "value": monumento.yearBuilt
            }
          };
          script.textContent+=JSON.stringify(s);
  document.head.appendChild(script);
}

// Generate HTML dinamically with JS

function generateCard(monumento) {
  let añoAjustado = (ajustarAño(`${monumento.yearBuilt}`));
  const card =/* HTML */

    `
    <div class="col-auto m-4">
    <div class="card overflow zoom hoverCard" id="card-${monumento.identifier}" style="width: 18rem;">
      <img class="card-img-top" src="${monumento.image[0]}" alt="Card image cap" />
      <div class="card-body align-items-center">
      <div id="monumentProperties">
        <h1 class="card-title">${monumento.name}</h1>
        <div id="direccion">
        <p class="card-text" id="mainCardText">${monumento.address}</p>
        </div>
        <div id="año">
        <div>
          <p class="card-text" id="mainCardText">Año de construcción: ${añoAjustado}</p>
        </div>
        </div>
        </div>
        <a href="/monumento.html?identifier=${monumento.identifier}" class="btn btn-primary formatoBoton cardBtn">Ver monumento</a>
        <button type="button" data-id="${monumento.identifier}" class="favorite-btn favorite-btn-main btn btn-outline-info ${monumento.isFavorite
          ? " is-favorite" : "" }" onclick="resultsDelegation(event)">
          ${monumento.isFavorite ? "♥" : "♡"}
        </button>
      </div>
    </div>
  </div>
    `;

  return card;
}

function ajustarAño(año) {
  if (año < 0) {
    año = año * -1;
    return año + " a.C"
  }
  return año;
}


function getQueryParams() {
  const search = new URLSearchParams(window.location.search);
  return search.get("term") || "";
}

// function pruebaObtencionDatosJSON() {
//   let totalMonuments = 0;
//   console.log("number of comunities in JSON: ", dataJSON.length);
//   dataJSON.forEach((comunidades) => {
//     Object.keys(comunidades).forEach((nombreComunidad) => {
//       console.log("comunidad: ", nombreComunidad);
//       console.log(
//         "monuments found in ",
//         nombreComunidad,
//         ": ",
//         comunidades[nombreComunidad].length
//       );
//       comunidades[nombreComunidad].forEach((monumento) => {
//         console.log("monumento: ", monumento);
//         totalMonuments++;
//       });
//     });
//   });
//   console.log("number of monuments found in JSON: ", totalMonuments);
// }

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
          color: "white"
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
    legend: {
      itemStyle: {
        color: '#FFFF',
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
        }
      }
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
        }
      }
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
    generateJSONld(monumento);
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

function completeMonumentsArray() {
  var monumentsArray = [];

  dataJSON.forEach((comunidades) => {
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
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false; }
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
          document.getElementById("searchBarMain").focus();
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

function irArriba(){
  $('.ir-arriba').click(function(){ $('body,html').animate({ scrollTop:'0px' },100); });
  $(window).scroll(function(){
    if($(this).scrollTop() > 0){ $('.ir-arriba').slideDown(600); }else{ $('.ir-arriba').slideUp(600); }
  });
}


window.onload = async function () {
  // ¿Lo tiene que hacer el usuario, o tiene que salir "inmediatamente" cuando cargue la pagina?
  // dentro del onload cuando hay que acceder al DOM "instantaneamente".
  await getJSONFile();

  // pruebaObtencionDatosJSON();

  generateColumChart();
  setHighchartsOptions();
  generatePieChart();

  term = getQueryParams();

  filter(false, true);

  autocomplete(document.getElementById("searchBarMain"));

  irArriba();
};
