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

const limpiarResultados = () => {
  document.querySelector("#contenedorPersonajes").innerHTML = "";
};

const filtrarPersonajes = (textoBuscado) => {
  if (!textoBuscado || textoBuscado.trim() === "") {
    renderizarCards(todosLosPersonajes);
    return;
  }
  const filtrados = todosLosPersonajes.filter((personaje) =>
    personaje.name.toLowerCase().includes(textoBuscado.toLowerCase().trim())
  );
  renderizarCards(filtrados);
};

const inputBusqueda = document.querySelector("#inputBusqueda");
inputBusqueda.addEventListener("input", (evento) => {
  filtrarPersonajes(evento.target.value);
});



const obtenerDetalle = async (id) => {
  try {
    const respuesta = await fetch(`${urlPersonajes}/${id}`);
    if (!respuesta.ok) throw new Error("Error al obtener el detalle");
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.log("Error en detalle:", error);
    return null;
  }
};




const mostrarModal = (personaje) => {
  document.querySelector("#modalNombre").textContent = personaje.name;
  document.querySelector("#modalOcupacion").textContent  = personaje.occupation || "Sin ocupación";
  document.querySelector("#modalEstado").textContent = personaje.status || "Desconocido";
  document.querySelector("#modalEdad").textContent = personaje.age || "Desconocida";
  document.querySelector("#modalNacimiento").textContent = personaje.birth_date || "Desconocida";
  document.querySelector("#modalGenero").textContent = personaje.gender || "No especificado";
  const urlImagen = personaje.image
    ? `${urlCDN}${personaje.image}`
    : "https://via.placeholder.com/200x200?text=Sin+imagen";
  document.querySelector("#modalImagen").src = urlImagen;
  const frases = personaje.phrases;
  document.querySelector("#modalFrase").textContent =
    frases && frases.length > 0 ? frases[0] : "Sin frase";
  const modal = new bootstrap.Modal(document.querySelector("#modalDetalle"));
  modal.show();
};




const contenedor = document.querySelector("#contenedorPersonajes");
contenedor.addEventListener("click", async (evento) => {
  if (evento.target.classList.contains("btn-ver-detalle")) {
    const id = evento.target.dataset.id;
    evento.target.textContent = "Cargando...";
    evento.target.disabled    = true;
    const personaje = await obtenerDetalle(id);
    evento.target.textContent = "Ver detalle";
    evento.target.disabled    = false;
    if (!personaje) return;
    mostrarModal(personaje);
  }
});

obtenerPersonajes();