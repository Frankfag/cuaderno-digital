// =========================================================
// MASÍA CENTENARIA · INICIO
// =========================================================

// =========================================================
// STORAGE
// =========================================================
const STORAGE_CAMPAÑA = "campaña_activa";

// =========================================================
// LOGIN
// =========================================================
if (localStorage.getItem("login_ok") !== "true") {
  window.location.replace("login.html");
}

// =========================================================
// UTILIDADES
// =========================================================
function getEl(id) {
  return document.getElementById(id);
}

// =========================================================
// MENÚ HAMBURGUESA
// =========================================================
function toggleMenu() {

  const menu = getEl("menuLateral");

  if (!menu) return;

  menu.classList.toggle("activo");

}

window.toggleMenu = toggleMenu;

function initMenuMovil() {

  const btnMenu = getEl("btnMenu");
  const menu = getEl("menuLateral");

  if (!btnMenu || !menu) return;

  btnMenu.addEventListener("click", function (e) {

    e.stopPropagation();

    menu.classList.toggle("activo");

  });

  document.addEventListener("click", function (e) {

    if (
      menu.classList.contains("activo") &&
      !menu.contains(e.target) &&
      !btnMenu.contains(e.target)
    ) {

      menu.classList.remove("activo");

    }

  });

}

// =========================================================
// CAMPAÑAS
// =========================================================
function generarCampañas() {

  const campañas = [];

  for (let año = 2024; año <= 2059; año++) {

    campañas.push(`${año}-${año + 1}`);

  }

  return campañas;

}

function getCampañaActiva() {

  return (
    localStorage.getItem(STORAGE_CAMPAÑA) ||
    "2025-2026"
  );

}

function setCampañaActiva(campaña) {

  localStorage.setItem(
    STORAGE_CAMPAÑA,
    campaña
  );

}

// =========================================================
// SELECTOR DE CAMPAÑA
// =========================================================
function initSelectorCampaña() {

  const selector = getEl("selectorCampaña");
  const titulo = getEl("tituloCampaña");

  if (!selector) return;

  selector.innerHTML = "";

  const campañas = generarCampañas();
  const activa = getCampañaActiva();

  campañas.forEach(campaña => {

    const option = document.createElement("option");

    option.value = campaña;
    option.textContent = campaña;

    if (campaña === activa) {

      option.selected = true;

    }

    selector.appendChild(option);

  });

  actualizarTituloCampaña();

  selector.addEventListener("change", function () {

    setCampañaActiva(this.value);

    actualizarTituloCampaña();

  });

}

// =========================================================
// TÍTULO
// =========================================================
function actualizarTituloCampaña() {

  const titulo = getEl("tituloCampaña");

  if (!titulo) return;

  titulo.textContent =
    `Panel Principal · Campaña ${getCampañaActiva()}`;

}

// =========================================================
// ACCESOS
// =========================================================
function initAccesos() {

  const enlaces =
    document.querySelectorAll(".camino-enlace-caja");

  enlaces.forEach(enlace => {

    enlace.addEventListener("mouseenter", function () {

      this.style.cursor = "pointer";

    });

  });

}

// =========================================================
// INICIALIZACIÓN GENERAL
// =========================================================
function initIndex() {

  initMenuMovil();

  initSelectorCampaña();

  initAccesos();

}

// =========================================================
// ARRANQUE
// =========================================================
document.addEventListener(
  "DOMContentLoaded",
  function () {

    initIndex();

  }
);