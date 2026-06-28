// =========================================================
// MASÍA CENTENARIA · REGISTRO DE PESAJES
// JS LIMPIO Y COMPLETO
// =========================================================

// =========================================================
// 1) STORAGE
// ---------------------------------------------------------
// IMPORTANTE:
// Se usa STORAGE_REGISTROS para mantener la compatibilidad
// con Totales y Control Olivas.
// =========================================================
const STORAGE_REGISTROS = "STORAGE_REGISTROS";
const STORAGE_CAMPAÑA = "campaña_activa";

// =========================================================
// 2) UTILIDADES
// =========================================================
function getEl(id) {
  return document.getElementById(id);
}

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

function formatearFechaISO(fechaISO) {
  if (!fechaISO) return "";
  const partes = fechaISO.split("-");
  if (partes.length !== 3) return fechaISO;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatoKilos(valor) {
  return `${Number(valor || 0).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} kg`;
}

function numero(valor) {
  return Number(valor || 0);
}

// =========================================================
// 3) LOGIN
// =========================================================
if (localStorage.getItem("login_ok") !== "true") {
  window.location.replace("login.html");
}

// =========================================================
// 4) MENÚ HAMBURGUESA
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
    toggleMenu();
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
// 5) CAMPAÑAS
// ---------------------------------------------------------
// Todas tus páginas cuaderno deben llegar hasta 2059-2060
// =========================================================
function generarCampañas() {
  const campañas = [];

  for (let año = 2024; año <= 2059; año++) {
    campañas.push(`${año}-${año + 1}`);
  }

  return campañas;
}

function getCampañaActiva() {
  return localStorage.getItem(STORAGE_CAMPAÑA) || "2025-2026";
}

function setCampañaActiva(campaña) {
  localStorage.setItem(STORAGE_CAMPAÑA, campaña);
}

function initSelectorCampaña() {
  const selector = getEl("selectorCampaña");
  const titulo = getEl("tituloCampaña");

  if (!selector) return;

  selector.innerHTML = "";

  const campañas = generarCampañas();
  const activa = getCampañaActiva();

  campañas.forEach(camp => {
    const opt = document.createElement("option");
    opt.value = camp;
    opt.textContent = camp;

    if (camp === activa) {
      opt.selected = true;
    }

    selector.appendChild(opt);
  });

  if (titulo) {
    titulo.textContent = `Registro de Pesajes — Campaña ${activa}`;
  }

  selector.addEventListener("change", function () {
    setCampañaActiva(this.value);

    if (titulo) {
      titulo.textContent = `Registro de Pesajes — Campaña ${this.value}`;
    }

    renderTablaPesajes();
  });
}

// =========================================================
// 6) DATOS
// =========================================================
function getRegistros() {
  return JSON.parse(localStorage.getItem(STORAGE_REGISTROS)) || [];
}

function saveRegistros(data) {
  localStorage.setItem(STORAGE_REGISTROS, JSON.stringify(data));
}

function getRegistrosCampaña() {
  const activa = getCampañaActiva();

  return getRegistros().filter(item => item.campaña === activa);
}

// =========================================================
// 7) FECHA AUTOMÁTICA
// =========================================================
function initFechaHoy() {
  const inputFecha = getEl("fecha");
  if (!inputFecha) return;

  if (!inputFecha.value) {
    inputFecha.value = hoyISO();
  }
}

// =========================================================
// 8) FORMULARIO
// =========================================================
function limpiarFormularioRegistro() {
  const form = getEl("formRegistro");
  if (!form) return;

  form.reset();
  initFechaHoy();

  const selectParada = getEl("parada");
  if (selectParada) {
    selectParada.value = "";
  }
}

function obtenerDatosFormulario() {
  return {
    id: Date.now(),
    parada: getEl("parada")?.value || "",
    kilos: getEl("kilos")?.value || "",
    fecha: getEl("fecha")?.value || "",
    campaña: getCampañaActiva()
  };
}

function validarRegistro(registro) {
  return (
    registro.parada &&
    registro.fecha &&
    registro.kilos !== "" &&
    numero(registro.kilos) > 0
  );
}

function initFormularioRegistro() {
  const form = getEl("formRegistro");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const registro = obtenerDatosFormulario();

    if (!validarRegistro(registro)) {
      alert("Completa Parada, Kilos y Fecha correctamente.");
      return;
    }

    const datos = getRegistros();
    datos.push(registro);
    saveRegistros(datos);

    limpiarFormularioRegistro();
    renderTablaPesajes();
  });

  // Salto automático al campo Kilos al elegir parada
  const selectParada = getEl("parada");
  const inputKilos = getEl("kilos");

  if (selectParada && inputKilos) {
    selectParada.addEventListener("change", function () {
      if (this.value !== "") {
        inputKilos.focus();
      }
    });
  }
}

// =========================================================
// 9) TABLA HISTÓRICO
// =========================================================
function renderTablaPesajes() {
  const tbody = getEl("tablaBody");
  if (!tbody) return;

  const registros = getRegistrosCampaña();

  tbody.innerHTML = "";

  if (registros.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;">
          Sin pesajes registrados en esta campaña.
        </td>
      </tr>
    `;
    return;
  }

  registros
    .slice()
    .reverse()
    .forEach(item => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${formatearFechaISO(item.fecha)}</td>
        <td>${item.parada}</td>
        <td>${formatoKilos(item.kilos)}</td>
        <td>
          <button
            class="btn-eliminar"
            type="button"
            onclick="borrarPesaje(${item.id})">
            ❌
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
}

window.borrarPesaje = function (id) {
  const ok = confirm("¿Quieres borrar este pesaje?");
  if (!ok) return;

  const datos = getRegistros().filter(item => item.id !== id);
  saveRegistros(datos);
  renderTablaPesajes();
};

// =========================================================
// 10) IMPRIMIR
// =========================================================
function initBotonImprimir() {
  const btn = getEl("btnImprimir");
  if (!btn) return;

  btn.addEventListener("click", function () {
    window.print();
  });
}

// =========================================================
// 11) EXPORTAR CSV COMPATIBLE CON EXCEL
// =========================================================
function exportarCSVPesajes() {
  const registros = getRegistrosCampaña();

  if (registros.length === 0) {
    alert("No hay pesajes en esta campaña para exportar.");
    return;
  }

  let contenidoCsv = "\uFEFF";
  contenidoCsv += `REGISTRO DE PESAJES - CAMPAÑA ${getCampañaActiva()}\n\n`;
  contenidoCsv += "Fecha;Parada;Kilos\n";

  registros.forEach(item => {
    const fila = [
      formatearFechaISO(item.fecha),
      item.parada,
      item.kilos
    ]
      .map(valor => String(valor).replace(/;/g, ","))
      .join(";");

    contenidoCsv += `${fila}\n`;
  });

  const blob = new Blob([contenidoCsv], {
    type: "text/csv;charset=utf-8;"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute(
    "download",
    `Registro_Pesajes_${getCampañaActiva()}.csv`
  );

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function initBotonExcel() {
  const btn = getEl("btnExcel");
  if (!btn) return;

  btn.addEventListener("click", function () {
    exportarCSVPesajes();
  });
}

// =========================================================
// 12) INICIALIZACIÓN GENERAL
// =========================================================
function initRegistro() {
  initMenuMovil();
  initSelectorCampaña();
  initFechaHoy();
  initFormularioRegistro();
  initBotonImprimir();
  initBotonExcel();
  renderTablaPesajes();
}

// =========================================================
// 13) ARRANQUE
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  initRegistro();
});
