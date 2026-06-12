const urlPersonajes = "https://thesimpsonsapi.com/api/characters";
const urlCDN = "https://cdn.thesimpsonsapi.com/500";


let todosLosPersonajes = [];

// obtener el listado general
const obtenerPersonajes = async () => {
  try {
    const respuesta = await fetch(urlPersonajes);

    if (!respuesta.ok) {
      throw new Error("Error al conectar con la API");
    }

    const datos = await respuesta.json();
    todosLosPersonajes = datos.data || datos;
    renderizarCards(todosLosPersonajes);

  } catch (error) {
    console.log("Error:", error);
    document.querySelector("#contenedorPersonajes").innerHTML =
      `<div class="col-12 text-center text-danger py-4">
        <p>No se pudo cargar los personajes. Revisá tu conexión.</p>
      </div>`;
  }
};
const renderizarCards = (listaDePersonajes) => {
  const contenedor    = document.querySelector("#contenedorPersonajes");
  const sinResultados = document.querySelector("#mensajeSinResultados");
  limpiarResultados();
  if (listaDePersonajes.length === 0) {
    sinResultados.style.display = "block";
    return;
  }
  sinResultados.style.display = "none";
  const tarjetasHtml = listaDePersonajes.map((personaje) => {
    const urlImagen = personaje.image
      ? `${urlCDN}${personaje.image}`
      : "https://via.placeholder.com/200x200?text=Sin+imagen";
    const badgeEstado = personaje.status === "Alive"
      ? `<span class="badge bg-success">Vivo</span>`
      : `<span class="badge bg-danger">Fallecido</span>`;
    return `
      <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${urlImagen}" class="card-img-top" alt="${personaje.name}"
            onerror="this.src='https://via.placeholder.com/200x200?text=Sin+imagen'" />
          <div class="card-body d-flex flex-column">
            <h6 class="card-title fw-bold">${personaje.name}</h6>
            <p class="card-text text-muted small mb-1">${personaje.occupation || "Sin ocupación"}</p>
            <div class="mb-2">${badgeEstado}</div>
            <button class="btn btn-warning btn-sm mt-auto btn-ver-detalle"
              data-id="${personaje.id}">Ver detalle</button>
          </div>
        </div>
      </div>`;
  }).join("");
  contenedor.innerHTML = tarjetasHtml;
};