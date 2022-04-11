let dataRutas;


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

function getRuta(){
    const select = document.getElementById("selectComunidad");
    console.log(select.value);
}

window.onload = async function () {
  await getJSONFile();
  const select = document.getElementById("selectComunidad");
  select.value = getQueryParams();
  getRuta();
};
