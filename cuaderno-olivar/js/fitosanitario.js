// =========================================================
// MASÍA CENTENARIA · FITOSANITARIO OLIVAR
// JS LIMPIO Y COMPLETO
// =========================================================



// =========================================================
// 1) STORAGE
// =========================================================
const STORAGE_FITOSANITARIO = "olivar_fitosanitario_registros";
const STORAGE_CAMPAÑA = "campaña_activa";



// =========================================================
// 2) UTILIDADES GENERALES
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
// Todas tus páginas tipo cuaderno deben llegar hasta 2059-2060
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
    titulo.textContent = `Registro Fitosanitario — Campaña ${activa}`;
  }

  selector.addEventListener("change", function () {
    setCampañaActiva(this.value);

    if (titulo) {
      titulo.textContent = `Registro Fitosanitario — Campaña ${this.value}`;
    }

    renderTablaFitosanitario();
  });
}



// =========================================================
// 6) DATOS
// =========================================================
function getRegistrosFitosanitarios() {
  return JSON.parse(localStorage.getItem(STORAGE_FITOSANITARIO)) || [];
}

function saveRegistrosFitosanitarios(data) {
  localStorage.setItem(STORAGE_FITOSANITARIO, JSON.stringify(data));
}

function getRegistrosCampaña() {
  const activa = getCampañaActiva();
  return getRegistrosFitosanitarios().filter(item => item.campaña === activa);
}



// =========================================================
// 7) FECHA AUTOMÁTICA
// =========================================================
function initFechaHoy() {
  const inputFecha = getEl("fitoFecha");
  if (!inputFecha) return;

  if (!inputFecha.value) {
    inputFecha.value = hoyISO();
  }
}



// =========================================================
// 8) FORMULARIO
// =========================================================
function limpiarFormularioFitosanitario() {
  const form = getEl("formFitosanitario");
  if (!form) return;

  form.reset();
  initFechaHoy();

  // Volver a dejar la parada vacía
  const parcela = getEl("fitoParcela");
  if (parcela) parcela.value = "";
}

function obtenerDatosFormulario() {
  return {
    id: Date.now(),
    fecha: getEl("fitoFecha")?.value || "",
    parada: getEl("fitoParcela")?.value || "",
    superficie: getEl("fitoSuperficie")?.value || "",
    producto: getEl("fitoProducto")?.value.trim() || "",
    registro: getEl("fitoRegistro")?.value.trim() || "",
    dosis: getEl("fitoDosis")?.value.trim() || "",
    caldo: getEl("fitoLitros")?.value || "",
    plaga: getEl("fitoPlaga")?.value.trim() || "",
    operario: getEl("fitoOperario")?.value.trim() || "",
    carnet: getEl("fitoCarnet")?.value.trim() || "",
    equipo: getEl("fitoMaquinaria")?.value.trim() || "",
    roma: getEl("fitoRoma")?.value.trim() || "",
    plazo: getEl("fitoPlazo")?.value || "",
    campaña: getCampañaActiva()
  };
}

function validarRegistro(registro) {
  return (
    registro.fecha &&
    registro.parada &&
    registro.superficie !== "" &&
    registro.producto &&
    registro.registro &&
    registro.dosis &&
    registro.caldo !== "" &&
    registro.plaga &&
    registro.operario &&
    registro.carnet &&
    registro.equipo &&
    registro.plazo !== ""
  );
}

function initFormularioFitosanitario() {
  const form = getEl("formFitosanitario");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const registro = obtenerDatosFormulario();

    if (!validarRegistro(registro)) {
      alert("Completa todos los campos obligatorios del tratamiento.");
      return;
    }

    const datos = getRegistrosFitosanitarios();
    datos.push(registro);
    saveRegistrosFitosanitarios(datos);

    limpiarFormularioFitosanitario();
    renderTablaFitosanitario();
  });
}



// =========================================================
// 9) TABLA HISTÓRICO
// =========================================================
function renderTablaFitosanitario() {
  const tbody = getEl("tablaFitosanitarioBody");
  if (!tbody) return;

  const registros = getRegistrosCampaña();

  tbody.innerHTML = "";

  if (registros.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="14" style="text-align:center;">
          Sin tratamientos registrados en esta campaña.
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
        <td>${item.superficie}</td>
        <td>${item.producto}</td>
        <td>${item.registro}</td>
        <td>${item.dosis}</td>
        <td>${item.caldo}</td>
        <td>${item.plaga}</td>
        <td>${item.operario}</td>
        <td>${item.carnet}</td>
        <td>${item.equipo}</td>
        <td>${item.roma || ""}</td>
        <td>${item.plazo}</td>
        <td>
          <button
            class="btn-eliminar"
            type="button"
            onclick="borrarTratamiento(${item.id})">
            ❌
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
}

window.borrarTratamiento = function (id) {
  const ok = confirm("¿Quieres borrar este tratamiento?");
  if (!ok) return;

  const datos = getRegistrosFitosanitarios().filter(item => item.id !== id);
  saveRegistrosFitosanitarios(datos);
  renderTablaFitosanitario();
};



// =========================================================
// 10) IMPRIMIR
// =========================================================
function initBotonImprimir() {
  const btn = getEl("btnImprimirFito");
  if (!btn) return;

  btn.addEventListener("click", function () {
    window.print();
  });
}



// =========================================================
// 11) EXPORTAR CSV COMPATIBLE CON EXCEL
// =========================================================
function exportarCSVFitosanitario() {
  const registros = getRegistrosCampaña();

  if (registros.length === 0) {
    alert("No hay registros en el histórico para exportar.");
    return;
  }

  let contenidoCsv = "\uFEFF";
  contenidoCsv += `REGISTRO FITOSANITARIO OLIVAR - CAMPAÑA ${getCampañaActiva()}\n\n`;
  contenidoCsv += "Fecha;Parada;Superficie;Producto;Registro;Dosis;Caldo;Plaga/Motivo;Operario;Carnet;Equipo;ROMA;Plazo\n";

  registros.forEach(item => {
    const fila = [
      formatearFechaISO(item.fecha),
      item.parada,
      item.superficie,
      item.producto,
      item.registro,
      item.dosis,
      item.caldo,
      item.plaga,
      item.operario,
      item.carnet,
      item.equipo,
      item.roma || "",
      item.plazo
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
    `Registro_Fitosanitario_Olivar_${getCampañaActiva()}.csv`
  );

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function initBotonExcel() {
  const btn = getEl("btnExcelFito");
  if (!btn) return;

  btn.addEventListener("click", function () {
    exportarCSVFitosanitario();
  });
}



// =========================================================
// 12) INICIALIZACIÓN GENERAL
// =========================================================
function initFitosanitario() {
  initMenuMovil();
  initSelectorCampaña();
  initFechaHoy();
  initFormularioFitosanitario();
  initBotonImprimir();
  initBotonExcel();
  renderTablaFitosanitario();
}



// =========================================================
// 13) ARRANQUE
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  initFitosanitario();
});