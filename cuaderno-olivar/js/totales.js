// =========================================================
// MASÍA CENTENARIA · TOTALES
// JS LIMPIO Y COMPLETO
// =========================================================

// =========================================================
// 1) STORAGE
// ---------------------------------------------------------
// IMPORTANTE:
// Se usa STORAGE_REGISTROS para mantener compatibilidad con:
// - registro.js
// - control-olivas.js
// =========================================================
const STORAGE_REGISTROS = "STORAGE_REGISTROS";
const STORAGE_CAMPAÑA = "campaña_activa";

// =========================================================
// 2) UTILIDADES
// =========================================================
function getEl(id) {
  return document.getElementById(id);
}

function numero(valor) {
  return Number(valor || 0);
}

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

function formatoFechaISO(fechaISO) {
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
// Todas tus páginas tipo cuaderno llegan hasta 2059-2060
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
    titulo.textContent = `Totales de Producción — Campaña ${activa}`;
  }

  selector.addEventListener("change", function () {
    setCampañaActiva(this.value);

    if (titulo) {
      titulo.textContent = `Totales de Producción — Campaña ${this.value}`;
    }

    procesarYFiltrarTotales();
  });
}

// =========================================================
// 6) DATOS
// =========================================================
function getRegistros() {
  return JSON.parse(localStorage.getItem(STORAGE_REGISTROS)) || [];
}

function getRegistrosLimpios() {
  return getRegistros().filter(reg =>
    reg &&
    reg.parada &&
    String(reg.parada).trim() !== "" &&
    numero(reg.kilos) > 0
  );
}

function getRegistrosCampaña() {
  const activa = getCampañaActiva();
  return getRegistrosLimpios().filter(reg => reg.campaña === activa);
}

// =========================================================
// 7) PROCESAR Y FILTRAR TOTALES
// ---------------------------------------------------------
// Esta es la función central de la página.
// Calcula KPIs y pinta el listado detallado.
// =========================================================
function procesarYFiltrarTotales() {
  const tbody = getEl("tablaTotales");
  const buscarParada = getEl("buscarParada");

  if (!tbody) return;

  tbody.innerHTML = "";

  const campañaActiva = getCampañaActiva();
  const paradaSeleccionada = buscarParada ? buscarParada.value : "TODAS";

  let registrosCampaña = getRegistrosLimpios().filter(reg => reg.campaña === campañaActiva);

  // KPIs de campaña completa (antes del filtro de parada)
  let sumaKilosGlobal = 0;
  let maxKilosGlobal = 0;
  let totalApartadosGlobal = registrosCampaña.length;

  registrosCampaña.forEach(reg => {
    const k = numero(reg.kilos);
    sumaKilosGlobal += k;
    if (k > maxKilosGlobal) {
      maxKilosGlobal = k;
    }
  });

  // Pintar KPIs globales de campaña
  const totalKilosGlobal = getEl("totalKilosGlobal");
  const maximoPesajeGlobal = getEl("maximoPesajeGlobal");
  const totalApartadosEl = getEl("totalApartadosGlobal");

  if (totalKilosGlobal) {
    totalKilosGlobal.innerText = formatoKilos(sumaKilosGlobal);
  }

  if (maximoPesajeGlobal) {
    maximoPesajeGlobal.innerText = formatoKilos(maxKilosGlobal);
  }

  if (totalApartadosEl) {
    totalApartadosEl.innerText = totalApartadosGlobal;
  }

  // Aplicar filtro visual por parada para la tabla
  let registrosFiltrados = registrosCampaña;

  if (paradaSeleccionada && paradaSeleccionada !== "TODAS") {
    registrosFiltrados = registrosCampaña.filter(reg => {
      return String(reg.parada).toUpperCase().trim() === paradaSeleccionada.toUpperCase().trim();
    });
  }

  if (registrosFiltrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;">
          No hay datos en pantalla para el filtro seleccionado.
        </td>
      </tr>
    `;
    return;
  }

  registrosFiltrados
    .slice()
    .reverse()
    .forEach(reg => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${formatoFechaISO(reg.fecha)}</td>
        <td>${reg.parada}</td>
        <td>${formatoKilos(reg.kilos)}</td>
      `;

      tbody.appendChild(tr);
    });
}

// =========================================================
// 8) BOTÓN IMPRIMIR
// =========================================================
function initBotonImprimir() {
  const btn = getEl("btnImprimirTotales");
  if (!btn) return;

  btn.addEventListener("click", function () {
    window.print();
  });
}

// =========================================================
// 9) EXPORTAR CSV COMPATIBLE CON EXCEL
// =========================================================
function exportarCSVTotales() {
  const campañaActiva = getCampañaActiva();
  const buscarParada = getEl("buscarParada");
  const paradaSeleccionada = buscarParada ? buscarParada.value : "TODAS";

  let registros = getRegistrosCampaña();

  if (paradaSeleccionada && paradaSeleccionada !== "TODAS") {
    registros = registros.filter(reg => {
      return String(reg.parada).toUpperCase().trim() === paradaSeleccionada.toUpperCase().trim();
    });
  }

  if (registros.length === 0) {
    alert("No hay datos consolidados en pantalla para exportar.");
    return;
  }

  let contenidoCsv = "\uFEFF";
  contenidoCsv += `RESUMEN TOTALES - CAMPAÑA ${campañaActiva}\n\n`;
  contenidoCsv += "Fecha;Parada;Kilos\n";

  registros
    .slice()
    .reverse()
    .forEach(reg => {
      const fila = [
        formatoFechaISO(reg.fecha),
        reg.parada,
        reg.kilos
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
    `Resumen_Totales_Masia_Centenaria_${campañaActiva}.csv`
  );

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function initBotonExcel() {
  const btn = getEl("btnExcelTotales");
  if (!btn) return;

  btn.addEventListener("click", function () {
    exportarCSVTotales();
  });
}

// =========================================================
// 10) FILTRO POR PARADA
// =========================================================
function initFiltroParada() {
  const buscarParada = getEl("buscarParada");
  if (!buscarParada) return;

  buscarParada.addEventListener("change", function () {
    procesarYFiltrarTotales();
  });
}

// =========================================================
// 11) INICIALIZACIÓN GENERAL
// =========================================================
function initTotales() {
  initMenuMovil();
  initSelectorCampaña();
  initFiltroParada();
  initBotonImprimir();
  initBotonExcel();
  procesarYFiltrarTotales();
}

// =========================================================
// 12) ARRANQUE
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  initTotales();
});