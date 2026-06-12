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