// =====================================
// HUERTA CALENDARIO
// Archivo independiente
// NO toca:
// - cuaderno-huerta.html
// - huerta-dashboard.html
// - huerta-cosecha.html
// =====================================

// =====================================
// MENÚ HAMBURGUESA
// =====================================
// Función para abrir y cerrar el menú con el botón ☰
function toggleMenu() {
  const menu = document.getElementById("menuLateral");
  menu.classList.toggle("activo"); // Usa 'activo' igual que tu CSS
}

// Escucha los clics en toda la página para cerrar el menú si haces clic fuera
document.addEventListener("click", function(event) {
  const menu = document.getElementById("menuLateral");
  const boton = document.querySelector(".boton-menu");

  // 1. Verifica si el menú está abierto (tiene la clase 'activo')
  // 2. Verifica que el clic NO haya sido dentro del menú lateral
  // 3. Verifica que el clic NO haya sido en el botón de la hamburguesa
  if (menu.classList.contains("activo") && !menu.contains(event.target) && !boton.contains(event.target)) {
    menu.classList.remove("activo"); // Quita la clase y el CSS lo esconde con animación
  }
});




// =====================================
// STORAGE
// =====================================
// Aquí guardamos el checklist final de compra / siembra
const STORAGE_CALENDARIO_CHECKLIST = "huerta_calendario_checklist";


// =====================================
// ZONA 1 · BASE DE CULTIVOS
// =====================================
// AQUÍ EDITAS LOS DATOS DE CADA CULTIVO
//
// CAMPOS DE CADA CULTIVO:
//
// id ....................... identificador interno
// nombre ................... nombre del cultivo
// icono .................... emoji del cultivo
// imagen ................... ruta imagen
// meses .................... meses en que aparece en el calendario
//
// temporadaSiembra ......... texto de temporada óptima de siembra
// tipoSiembra .............. Directa / Almácigo / ambas
// profundidad .............. profundidad de semilla
// distancia ................ distancia entre plantas
// riego .................... tipo / frecuencia de riego
//
// tiempoCosecha ............ tiempo aproximado hasta cosecha
// temporadaCosecha ......... época de cosecha
// clima .................... clima / temperatura ideal
// plagas ................... plagas frecuentes
// beneficiosos ............. cultivos beneficiosos
// perjudiciales ............ cultivos perjudiciales
//
// Si luego quieres añadir más cultivos,
// copia un bloque y cambia valores.
// =====================================
// =====================================
  // CULTIVO ·LECHUGAS
  // =====================================
const baseCultivos = {
  lechugas: {
    id: "lechugas",
    nombre: "Lechugas",
    icono: "🥬",
    imagen: "../img/lechugas.png",
    meses: ["septiembre", "octubre", "noviembre", "febrero", "marzo"],

    temporadaSiembra: "Otoño y final de invierno",
    tipoSiembra: "Directa o almácigo",
    profundidad: "0,5 - 1 cm",
    distancia: "25 - 30 cm",
    riego: "Frecuente y regular",

    tiempoCosecha: "2 - 3 meses",
    temporadaCosecha: "Otoño, invierno y primavera",
    clima: "Templado, 10ºC - 20ºC",
    plagas: "Pulgón, babosas, trips",
    beneficiosos: "Zanahoria, rábano, cebolla",
    perjudiciales: "Col muy pegada, apio en exceso"
  },
  "lechuga-escarola": {
    id: "lechuga-escarola",
    nombre: "Lechuga escarola",
    icono: "🥬",
    imagen: "../img/lechuga-escarola.png",
    meses: ["septiembre", "octubre", "noviembre", "febrero", "marzo"],

    temporadaSiembra: "Otoño y final de invierno",
    tipoSiembra: "Directa o almácigo",
    profundidad: "0,5 - 1 cm",
    distancia: "25 - 30 cm",
    riego: "Frecuente y regular",

    tiempoCosecha: "2 - 3 meses",
    temporadaCosecha: "Otoño, invierno y primavera",
    clima: "Templado, 10ºC - 20ºC",
    plagas: "Pulgón, babosas, trips",
    beneficiosos: "Zanahoria, rábano, cebolla",
    perjudiciales: "Col muy pegada, apio en exceso"
  },
  "lechuga-roble": {
    id: "lechuga-roble",
    nombre: "Lechuga roble",
    icono: "🥬",
    imagen: "../img/lechuga-roble.png",
    meses: ["septiembre", "octubre", "noviembre", "febrero", "marzo"],

    temporadaSiembra: "Otoño y final de invierno",
    tipoSiembra: "Directa o almácigo",
    profundidad: "0,5 - 1 cm",
    distancia: "25 - 30 cm",
    riego: "Frecuente y regular",

    tiempoCosecha: "2 - 3 meses",
    temporadaCosecha: "Otoño, invierno y primavera",
    clima: "Templado, 10ºC - 20ºC",
    plagas: "Pulgón, babosas, trips",
    beneficiosos: "Zanahoria, rábano, cebolla",
    perjudiciales: "Col muy pegada, apio en exceso"
  },
  "lechuga-romana": {
    id: "lechuga-romana",
    nombre: "Lechuga romana",
    icono: "🥬",
    imagen: "../img/lechuga-romana.png",
    meses: ["septiembre", "octubre", "noviembre", "febrero", "marzo"],

    temporadaSiembra: "Otoño y final de invierno",
    tipoSiembra: "Directa o almácigo",
    profundidad: "0,5 - 1 cm",
    distancia: "25 - 30 cm",
    riego: "Frecuente y regular",

    tiempoCosecha: "2 - 3 meses",
    temporadaCosecha: "Otoño, invierno y primavera",
    clima: "Templado, 10ºC - 20ºC",
    plagas: "Pulgón, babosas, trips",
    beneficiosos: "Zanahoria, rábano, cebolla",
    perjudiciales: "Col muy pegada, apio en exceso"
  },
  // =====================================
  // CULTIVO ·PATATAS
  // =====================================
  patatas: {
    id: "patatas",
    nombre: "Patatas",
    icono: "🥬",
    imagen: "../img/patatas.png",
    meses: ["septiembre", "octubre", "noviembre", "febrero", "marzo"],

    temporadaSiembra: "Otoño y final de invierno",
    tipoSiembra: "Directa o almácigo",
    profundidad: "0,5 - 1 cm",
    distancia: "25 - 30 cm",
    riego: "Frecuente y regular",

    tiempoCosecha: "2 - 3 meses",
    temporadaCosecha: "Otoño, invierno y primavera",
    clima: "Templado, 10ºC - 20ºC",
    plagas: "Pulgón, babosas, trips",
    beneficiosos: "Zanahoria, rábano, cebolla",
    perjudiciales: "Col muy pegada, apio en exceso"
  },
// =====================================
  // CULTIVO ·CEBOLLAS
  // =====================================
  cebolla: {
    id: "cebolla",
    nombre: "Cebollas",
    icono: "🧅",
    imagen: "../img/cebollas.png",
    meses: ["septiembre", "octubre", "noviembre", "diciembre", "enero"],

    temporadaSiembra: "Otoño e invierno",
    tipoSiembra: "Almácigo o directa",
    profundidad: "1 - 2 cm",
    distancia: "10 - 15 cm",
    riego: "Moderado",

    tiempoCosecha: "4 - 6 meses",
    temporadaCosecha: "Primavera y verano",
    clima: "Templado, 10ºC - 25ºC",
    plagas: "Trips, mosca de la cebolla",
    beneficiosos: "Zanahoria, lechuga, remolacha",
    perjudiciales: "Judía y guisante muy cerca"
  },
// =====================================
  // CULTIVO ·ZANAHORIAS
  // =====================================
  "zanahorias": {
    id: "zanahorias",
    nombre: "Zanahorias",
    icono: "🥕",
    imagen: "../img/zanahorias.png",
    meses: ["septiembre", "octubre", "noviembre", "febrero", "marzo", "abril"],

    temporadaSiembra: "Otoño y primavera",
    tipoSiembra: "Directa",
    profundidad: "0,5 - 1 cm",
    distancia: "8 - 10 cm",
    riego: "Regular sin encharcar",

    tiempoCosecha: "3 - 4 meses",
    temporadaCosecha: "Todo el año según siembra",
    clima: "Templado, 10ºC - 25ºC",
    plagas: "Mosca de la zanahoria, pulgón",
    beneficiosos: "Lechuga, cebolla, puerro",
    perjudiciales: "Eneldo en exceso"
  },
// =====================================
  // CULTIVO ·TOMATES
  // =====================================
  tomates: {
    id: "tomates",
    nombre: "Tomates",
    icono: "🍅",
    imagen: "../img/tomates.png",
    meses: ["febrero", "marzo", "abril"],

    temporadaSiembra: "Final de invierno y primavera",
    tipoSiembra: "Almácigo",
    profundidad: "0,5 - 1 cm",
    distancia: "40 - 50 cm",
    riego: "Frecuente y controlado",

    tiempoCosecha: "3 - 4 meses",
    temporadaCosecha: "Verano",
    clima: "Cálido, 18ºC - 30ºC",
    plagas: "Mosca blanca, tuta, pulgón",
    beneficiosos: "Albahaca, cebolla, ajo",
    perjudiciales: "Patata cercana"
  },
  // =====================================
  // CULTIVO ·TOMATES CHERRY
  // =====================================
  "tomates-cherry": {
    id: "tomates-cherry",
    nombre: "Tomates cherry",
    icono: "🍅",
    imagen: "../img/tomates-cherry.png",
    meses: ["febrero", "marzo", "abril"],

    temporadaSiembra: "Final de invierno y primavera",
    tipoSiembra: "Almácigo",
    profundidad: "0,5 - 1 cm",
    distancia: "40 - 50 cm",
    riego: "Frecuente y controlado",

    tiempoCosecha: "3 - 4 meses",
    temporadaCosecha: "Verano",
    clima: "Cálido, 18ºC - 30ºC",
    plagas: "Mosca blanca, tuta, pulgón",
    beneficiosos: "Albahaca, cebolla, ajo",
    perjudiciales: "Patata cercana"
  },
// =====================================
  // CULTIVO ·PIMIENTOS VERDES
  // =====================================
  "pimientos-verdes": {
    id: "pimientos-verdes",
    nombre: "pimientos-verdes",
    icono: "🫑",
    imagen: "../img/pimientos-verdes.png",
    meses: ["febrero", "marzo", "abril"],

    temporadaSiembra: "Final de invierno y primavera",
    tipoSiembra: "Almácigo",
    profundidad: "0,5 - 1 cm",
    distancia: "40 cm",
    riego: "Moderado y constante",

    tiempoCosecha: "4 - 5 meses",
    temporadaCosecha: "Verano y otoño",
    clima: "Cálido, 18ºC - 30ºC",
    plagas: "Araña roja, pulgón, mosca blanca",
    beneficiosos: "Albahaca, cebolla",
    perjudiciales: "Hinojo"
  },
// =====================================
  // CULTIVO ·ESPINACA
  // =====================================
  
   espinaca: {
    id: "espinacas",
    nombre: "Espinacas",
    icono: "🥬",
    imagen: "../img/espinacas.png",
    meses: ["septiembre", "octubre", "noviembre", "febrero", "marzo"],

    temporadaSiembra: "Otoño y final de invierno",
    tipoSiembra: "Directa",
    profundidad: "1 - 2 cm",
    distancia: "15 - 20 cm",
    riego: "Frecuente",

    tiempoCosecha: "2 - 3 meses",
    temporadaCosecha: "Otoño, invierno y primavera",
    clima: "Fresco, 8ºC - 20ºC",
    plagas: "Minador, pulgón, babosas",
    beneficiosos: "Fresa, col, lechuga",
    perjudiciales: "Remolacha muy junta"
  },

// =====================================
  // CULTIVO ·HABA 
  // =====================================

  habas: {
    id: "habas",
    nombre: "Habas",
    icono: "🫘",
    imagen: "../img/habas.png",
    meses: ["octubre", "noviembre", "diciembre", "enero"],

    temporadaSiembra: "Otoño e invierno",
    tipoSiembra: "Directa",
    profundidad: "3 - 5 cm",
    distancia: "25 - 30 cm",
    riego: "Moderado",

    tiempoCosecha: "4 - 5 meses",
    temporadaCosecha: "Invierno y primavera",
    clima: "Fresco, 5ºC - 20ºC",
    plagas: "Pulgón negro, trips",
    beneficiosos: "Lechuga, espinaca, zanahoria",
    perjudiciales: "Ajo muy próximo"
  },
 // =====================================
  // CULTIVO ·COL
  // =====================================
  
  col: {
    id: "col",
    nombre: "Col",
    icono: "🥬",
    imagen: "../img/col.png",
    meses: ["julio", "agosto", "septiembre", "octubre"],

    temporadaSiembra: "Verano y otoño",
    tipoSiembra: "Almácigo o directa",
    profundidad: "1 cm",
    distancia: "40 - 50 cm",
    riego: "Regular",

    tiempoCosecha: "3 - 5 meses",
    temporadaCosecha: "Otoño e invierno",
    clima: "Fresco, 10ºC - 20ºC",
    plagas: "Oruga de la col, pulgón, mosca",
    beneficiosos: "Cebolla, espinaca, apio",
    perjudiciales: "Fresa muy próxima"
  },


   // =====================================
  // CULTIVO · AJO
  // =====================================
  ajo: {
    id: "ajo",
    nombre: "Ajo",
    icono: "🧄",
    imagen: "../img/ajo.png",
    meses: ["octubre", "noviembre", "diciembre", "enero"],

    temporadaSiembra: "Otoño e invierno",
    tipoSiembra: "Directa",
    profundidad: "3 - 5 cm",
    distancia: "10 - 15 cm",
    riego: "Moderado, poco frecuente",

    tiempoCosecha: "5 - 6 meses",
    temporadaCosecha: "Primavera y principios de verano",
    clima: "Fresco, 8ºC - 20ºC",
    plagas: "Trips, roya, nematodos",
    beneficiosos: "Lechuga, zanahoria, tomate",
    perjudiciales: "Judías y guisantes muy cerca"
  },

  // =====================================
  // CULTIVO · PUERRO
  // =====================================
  puerros: {
    id: "puerros",
    nombre: "Puerros",
    icono: "🌿",
    imagen: "../img/puerros.png",
    meses: ["enero", "febrero", "marzo", "septiembre", "octubre"],

    temporadaSiembra: "Final de invierno, primavera y principios de otoño",
    tipoSiembra: "Almácigo o directa",
    profundidad: "1 cm",
    distancia: "15 - 20 cm",
    riego: "Regular",

    tiempoCosecha: "4 - 6 meses",
    temporadaCosecha: "Otoño, invierno y primavera",
    clima: "Templado, 10ºC - 22ºC",
    plagas: "Trips, mosca de la cebolla",
    beneficiosos: "Zanahoria, cebolla, apio",
    perjudiciales: "Legumbres muy cerca"
  },

  // =====================================
  // CULTIVO · ACELGA
  // =====================================
  
  acelga: {
    id: "acelga",
    nombre: "Acelga",
    icono: "🥬",
    imagen: "../img/acelga.png",
    meses: ["febrero", "marzo", "abril", "septiembre", "octubre", "noviembre"],

    temporadaSiembra: "Primavera y otoño",
    tipoSiembra: "Directa",
    profundidad: "1 - 2 cm",
    distancia: "30 - 40 cm",
    riego: "Frecuente y regular",

    tiempoCosecha: "2 - 3 meses",
    temporadaCosecha: "Casi todo el año según siembra",
    clima: "Templado, 10ºC - 24ºC",
    plagas: "Pulgón, babosas, minador",
    beneficiosos: "Lechuga, col, cebolla",
    perjudiciales: "Espinaca muy junta"
  },

  // =====================================
  // CULTIVO · BRÓCOLI
  // =====================================
  brocoli: {
    id: "brocoli",
    nombre: "Brócoli",
    icono: "🥦",
    imagen: "../img/brocoli.png",
    meses: ["julio", "agosto", "septiembre", "octubre"],

    temporadaSiembra: "Final de verano y otoño",
    tipoSiembra: "Almácigo",
    profundidad: "1 cm",
    distancia: "40 - 50 cm",
    riego: "Regular",

    tiempoCosecha: "3 - 5 meses",
    temporadaCosecha: "Otoño e invierno",
    clima: "Fresco, 10ºC - 20ºC",
    plagas: "Oruga, mosca de la col, pulgón",
    beneficiosos: "Cebolla, apio, espinaca",
    perjudiciales: "Fresa muy próxima"
  },

  // =====================================
  // CULTIVO · COLIFLOR
  // =====================================
  coliflor: {
    id: "coliflor",
    nombre: "Coliflor",
    icono: "🥦",
    imagen: "../img/coliflor.png",
    meses: ["julio", "agosto", "septiembre", "octubre"],

    temporadaSiembra: "Final de verano y otoño",
    tipoSiembra: "Almácigo",
    profundidad: "1 cm",
    distancia: "40 - 50 cm",
    riego: "Regular y constante",

    tiempoCosecha: "4 - 5 meses",
    temporadaCosecha: "Otoño e invierno",
    clima: "Fresco, 10ºC - 20ºC",
    plagas: "Oruga de la col, pulgón, mosca",
    beneficiosos: "Apio, cebolla, espinaca",
    perjudiciales: "Fresa muy próxima"
  },

  // =====================================
  // CULTIVO · GUISANTE
  // =====================================
  guisantes: {
    id: "guisantes",
    nombre: "Guisantes",
    icono: "🫛",
    imagen: "../img/guisantes.png",
    meses: ["octubre", "noviembre", "diciembre", "enero", "febrero"],

    temporadaSiembra: "Otoño e invierno",
    tipoSiembra: "Directa",
    profundidad: "3 - 4 cm",
    distancia: "10 - 15 cm",
    riego: "Moderado",

    tiempoCosecha: "3 - 4 meses",
    temporadaCosecha: "Invierno y primavera",
    clima: "Fresco, 8ºC - 18ºC",
    plagas: "Pulgón, oídio, trips",
    beneficiosos: "Zanahoria, lechuga, rábano",
    perjudiciales: "Ajo y cebolla muy cerca"
  },

  // =====================================
  // CULTIVO · REMOLACHA
  // =====================================
  
  remolacha: {
    id: "remolacha",
    nombre: "Remolacha",
    icono: "🫜",
    imagen: "../img/remolacha.png",
    meses: ["febrero", "marzo", "abril", "septiembre", "octubre"],

    temporadaSiembra: "Primavera y otoño",
    tipoSiembra: "Directa",
    profundidad: "2 - 3 cm",
    distancia: "15 - 20 cm",
    riego: "Regular",

    tiempoCosecha: "3 - 4 meses",
    temporadaCosecha: "Primavera, verano y otoño",
    clima: "Templado, 10ºC - 24ºC",
    plagas: "Pulgón, minador, babosas",
    beneficiosos: "Cebolla, lechuga, col",
    perjudiciales: "Espinaca muy pegada"
  },

  // =====================================
  // CULTIVO · PEPINO
  // =====================================
  pepino: {
    id: "pepino",
    nombre: "Pepino",
    icono: "🥒",
    imagen: "../img/pepino.png",
    meses: ["abril", "mayo", "junio"],

    temporadaSiembra: "Primavera",
    tipoSiembra: "Directa o almácigo",
    profundidad: "2 - 3 cm",
    distancia: "40 - 60 cm",
    riego: "Frecuente y abundante",

    tiempoCosecha: "2 - 3 meses",
    temporadaCosecha: "Verano",
    clima: "Cálido, 18ºC - 30ºC",
    plagas: "Araña roja, pulgón, oídio",
    beneficiosos: "Lechuga, judía, maíz",
    perjudiciales: "Patata aromáticas muy invasivas"
  },

  // =====================================
  // CULTIVO · CALABACÍN
  // =====================================
  calabacin: {
    id: "calabacin",
    nombre: "Calabacín",
    icono: "🥒",
    imagen: "../img/calabacin.png",
    meses: ["abril", "mayo", "junio"],

    temporadaSiembra: "Primavera",
    tipoSiembra: "Directa o almácigo",
    profundidad: "2 - 3 cm",
    distancia: "70 - 100 cm",
    riego: "Frecuente, sin encharcar",

    tiempoCosecha: "2 - 3 meses",
    temporadaCosecha: "Verano",
    clima: "Cálido, 18ºC - 30ºC",
    plagas: "Oídio, pulgón, araña roja",
    beneficiosos: "Maíz, judía, cebolla",
    perjudiciales: "Patata muy cerca"
  },

  // =====================================
  // CULTIVO · RÁBANO
  // =====================================
  
  rabano: {
    id: "rabano",
    nombre: "Rábano",
    icono: "🌱",
    imagen: "../img/rabano.png",
    meses: ["febrero", "marzo", "abril", "septiembre", "octubre", "noviembre"],

    temporadaSiembra: "Primavera y otoño",
    tipoSiembra: "Directa",
    profundidad: "1 cm",
    distancia: "5 - 8 cm",
    riego: "Regular",

    tiempoCosecha: "1 - 2 meses",
    temporadaCosecha: "Primavera y otoño",
    clima: "Templado, 8ºC - 22ºC",
    plagas: "Escarabajo, pulgón, babosas",
    beneficiosos: "Lechuga, zanahoria, espinaca",
    perjudiciales: "Hyssopo o aromáticas muy invasivas"
  }
};


// =========================================================
// STORAGE DEL CHECKLIST
// =========================================================
const STORAGE_CHECKLIST_CULTIVOS = "huerta_checklist_cultivos";

function getChecklistCultivos() {
  return JSON.parse(localStorage.getItem(STORAGE_CHECKLIST_CULTIVOS)) || [];
}

function saveChecklistCultivos(data) {
  localStorage.setItem(STORAGE_CHECKLIST_CULTIVOS, JSON.stringify(data));
}

function euros(valor) {
  return `${Number(valor || 0).toFixed(2).replace(".", ",")} €`;
}

function getMesSeleccionado() {
  const selector = document.getElementById("selectorMesCalendario");
  return selector ? selector.value : "septiembre";
}

// =========================================================
// MENÚ HAMBURGUESA
// =========================================================
function toggleMenu() {
  const menu = document.getElementById("menuLateral");
  if (!menu) return;
  menu.classList.toggle("activo");
}
window.toggleMenu = toggleMenu;

document.addEventListener("click", function (event) {
  const menu = document.getElementById("menuLateral");
  const boton = document.querySelector(".boton-menu");

  if (!menu || !boton) return;

  if (
    menu.classList.contains("activo") &&
    !menu.contains(event.target) &&
    !boton.contains(event.target)
  ) {
    menu.classList.remove("activo");
  }
});

// =========================================================
// AGRUPAR CULTIVOS POR TEMPORADA (PARA EL SELECT)
// =========================================================
function obtenerGrupoCultivo(cultivo) {
  if (!cultivo) return "📦 Otros cultivos";

  const id = (cultivo.id || "").toLowerCase();
  const temporada = (cultivo.temporadaSiembra || "").toLowerCase();
  const meses = Array.isArray(cultivo.meses) ? cultivo.meses : [];

  if (id.includes("patata")) return "🥔 Final invierno";

  if (
    temporada.includes("primavera") ||
    meses.includes("abril") ||
    meses.includes("mayo") ||
    meses.includes("junio")
  ) {
    return "🌞 Primavera - Verano";
  }

  if (
    temporada.includes("otoño") ||
    temporada.includes("invierno") ||
    meses.includes("septiembre") ||
    meses.includes("octubre") ||
    meses.includes("noviembre") ||
    meses.includes("diciembre") ||
    meses.includes("enero") ||
    meses.includes("febrero")
  ) {
    return "🍂 Otoño - Invierno";
  }

  return "📦 Otros cultivos";
}

// =========================================================
// PINTAR SELECT AGRUPADO POR TEMPORADAS
// =========================================================
function renderSelectorCultivo() {
  const selector = document.getElementById("selectorCultivo");
  if (!selector) return;

  selector.innerHTML = "";

  const opcionInicial = document.createElement("option");
  opcionInicial.value = "";
  opcionInicial.textContent = "-- Selecciona cultivo --";
  selector.appendChild(opcionInicial);

  const grupos = {};

  Object.values(baseCultivos).forEach(c => {
    const grupo = obtenerGrupoCultivo(c);
    if (!grupos[grupo]) grupos[grupo] = [];
    grupos[grupo].push(c);
  });

  const orden = [
    "🌞 Primavera - Verano",
    "🥔 Final invierno",
    "🍂 Otoño - Invierno",
    "📦 Otros cultivos"
  ];

  orden.forEach(nombreGrupo => {
    if (!grupos[nombreGrupo] || grupos[nombreGrupo].length === 0) return;

    const optgroup = document.createElement("optgroup");
    optgroup.label = nombreGrupo;

    grupos[nombreGrupo]
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = `${c.icono} ${c.nombre}`;
        optgroup.appendChild(option);
      });

    selector.appendChild(optgroup);
  });

  selector.addEventListener("change", function () {
    if (!this.value) return;
    verCultivo(this.value);
  });
}

// =========================================================
// RENDER DEL CALENDARIO POR MES
// =========================================================
function renderCalendarioPorMes(mes) {
  const grid = document.getElementById("gridCalendarioCultivo");
  if (!grid) return;

  grid.innerHTML = "";

  let cultivosMes;

  if (mes === "todos") {
    cultivosMes = Object.values(baseCultivos);
  } else {
    cultivosMes = Object.values(baseCultivos).filter(c =>
      Array.isArray(c.meses) && c.meses.includes(mes)
    );
  }

  if (cultivosMes.length === 0) {
    grid.innerHTML = `<p>No hay cultivos configurados para este mes.</p>`;
    return;
  }

  cultivosMes
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .forEach(c => {
      const card = document.createElement("div");
      card.className = "card-cultivo";

      const rutaImagen = c.imagen;

      card.innerHTML = `
        <img src="${rutaImagen}" alt="${c.nombre}">
        <p>${c.icono} ${c.nombre}</p>
      `;

      card.addEventListener("click", function () {
        verCultivo(c.id);
      });

      grid.appendChild(card);
    });
}

// =========================================================
// VER FICHA DEL CULTIVO
// =========================================================
function verCultivo(id) {
  const c = baseCultivos[id];
  if (!c) return;

  const detalle = document.getElementById("detalleCultivo");
  const grid = document.getElementById("gridCalendarioCultivo");

  if (!detalle || !grid) return;

  detalle.classList.remove("fade-in");
  grid.classList.remove("fade-out");

  detalle.innerHTML = `
    <button
      class="boton boton-volver-cultivo"
      type="button"
      onclick="volverCultivos()">
      ← Volver al calendario
    </button>

    <img src="${c.imagen}" alt="${c.nombre}" class="ficha-imagen">

    <h2>${c.icono} ${c.nombre}</h2>

    <p><strong>Temporada óptima de siembra:</strong> ${c.temporadaSiembra || "-"}</p>
    <p><strong>Tipo de siembra:</strong> ${c.tipoSiembra || "-"}</p>
    <p><strong>Profundidad semilla:</strong> ${c.profundidad || "-"}</p>
    <p><strong>Distancia entre plantas:</strong> ${c.distancia || "-"}</p>
    <p><strong>Riego:</strong> ${c.riego || "-"}</p>

    <hr>

    <p><strong>Tiempo de cosecha:</strong> ${c.tiempoCosecha || "-"}</p>
    <p><strong>Temporada de cosecha:</strong> ${c.temporadaCosecha || "-"}</p>

    <hr>

    <p><strong>Clima / temperatura:</strong> ${c.clima || "-"}</p>
    <p><strong>Tipos de plagas:</strong> ${c.plagas || "-"}</p>
    <p><strong>Cultivos beneficiosos:</strong> ${c.beneficiosos || "-"}</p>
    <p><strong>Cultivos perjudiciales:</strong> ${c.perjudiciales || "-"}</p>

    <hr>

    <div class="formulario-grid ficha-grid">
      <div class="campo">
        <label>Nombre</label>
        <input type="text" id="checkNombreCultivo" value="${c.nombre}" readonly>
      </div>

      <div class="campo">
        <label>Cantidad</label>
        <input type="number" id="checkCantidadCultivo" min="1" value="1">
      </div>

      <div class="campo">
        <label>Precio (€)</label>
        <input type="number" id="checkPrecioCultivo" min="0" step="0.01" value="0">
      </div>
    </div>

    <div class="acciones-ficha-cultivo">
      <button
        class="boton"
        type="button"
        onclick="anadirChecklist('${c.id}')">
        ✅ Añadir al checklist
      </button>

      <button
        class="boton"
        type="button"
        onclick="window.print()">
        🖨️ Imprimir ficha
      </button>
    </div>
  `;

  // animación salida galería
  grid.classList.add("fade-out");

  setTimeout(() => {
    grid.style.display = "none";
    detalle.classList.remove("oculto");
    detalle.style.display = "block";

    void detalle.offsetWidth;
    detalle.classList.add("fade-in");

    detalle.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 300);
}

// =========================================================
// VOLVER AL CALENDARIO
// =========================================================
window.volverCultivos = function () {
  const grid = document.getElementById("gridCalendarioCultivo");
  const detalle = document.getElementById("detalleCultivo");

  if (!grid || !detalle) return;

  detalle.classList.remove("fade-in");
  detalle.style.display = "none";
  detalle.classList.add("oculto");
  detalle.innerHTML = "";

  grid.style.display = "grid";
  grid.classList.remove("fade-out");

  renderCalendarioPorMes(getMesSeleccionado());

  grid.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};

// =========================================================
// AÑADIR AL CHECKLIST
// =========================================================
window.anadirChecklist = function (idCultivo) {
  const cultivo = baseCultivos[idCultivo];
  if (!cultivo) return;

  const nombre = document.getElementById("checkNombreCultivo")?.value || cultivo.nombre;
  const cantidad = Number(document.getElementById("checkCantidadCultivo")?.value || 1);
  const precio = Number(document.getElementById("checkPrecioCultivo")?.value || 0);

  const datos = getChecklistCultivos();

  datos.push({
    uid: Date.now(),
    idCultivo,
    nombre,
    cantidad,
    precio,
    total: cantidad * precio
  });

  saveChecklistCultivos(datos);
  renderResumenChecklistCultivos();
};

// =========================================================
// BORRAR DEL CHECKLIST
// =========================================================
window.borrarChecklistCultivo = function (uid) {
  const datos = getChecklistCultivos().filter(item => item.uid !== uid);
  saveChecklistCultivos(datos);
  renderResumenChecklistCultivos();
};

// =========================================================
// RESUMEN DEL CHECKLIST
// =========================================================
function renderResumenChecklistCultivos() {
  const contenedor = document.getElementById("resumenChecklistCultivos");
  if (!contenedor) return;

  const datos = getChecklistCultivos();

  if (datos.length === 0) {
    contenedor.innerHTML = `
      <p style="text-align:center;">
        Todavía no has añadido semillas o compras al checklist.
      </p>
    `;
    return;
  }

  const totalGeneral = datos.reduce((acc, item) => acc + Number(item.total || 0), 0);

  contenedor.innerHTML = `
    <div style="margin-bottom: 15px; text-align:center;">
      <strong>Total estimado:</strong> ${euros(totalGeneral)}
    </div>

    <div class="tabla-contenedor">
      <table class="tabla">
        <thead>
          <tr>
            <th>Cultivo</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          ${datos.map(item => `
            <tr>
              <td>${item.nombre}</td>
              <td>${item.cantidad}</td>
              <td>${euros(item.precio)}</td>
              <td>${euros(item.total)}</td>
              <td>
                <button
                  class="boton boton-eliminar"
                  type="button"
                  onclick="borrarChecklistCultivo(${item.uid})">
                  ❌
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// =========================================================
// INICIALIZACIÓN
// =========================================================
function initCalendarioCultivos() {
  const selectorMes = document.getElementById("selectorMesCalendario");
  if (!selectorMes) return;

  renderCalendarioPorMes(selectorMes.value);
  renderSelectorCultivo();
  renderResumenChecklistCultivos();

  selectorMes.addEventListener("change", function () {
    volverCultivos();
  });
  
}
    function initCalendarioCultivos() {

  const selectorMes =
    document.getElementById("selectorMesCalendario");

  if (!selectorMes) return;

  renderCalendarioPorMes(selectorMes.value);

  renderSelectorCultivo();

  renderResumenChecklistCultivos();

  selectorMes.addEventListener("change", function () {

    volverCultivos();

  });

  const btnMenu =
    document.getElementById("btnMenu");

  if (btnMenu) {

    btnMenu.addEventListener("click", function () {

      toggleMenu();

    });

  }

}

// =========================================================
// ARRANQUE
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  initCalendarioCultivos();
});