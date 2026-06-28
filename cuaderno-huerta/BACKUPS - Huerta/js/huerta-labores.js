// =====================================
// HUERTA LABORES · DESDE CERO
// =====================================

// -------------------------------------
// CONTROL LOGIN
// -------------------------------------


// -------------------------------------
// STORAGE
// -------------------------------------
const STORAGE_LABORES_HUERTA = "huerta_labores";
const STORAGE_CAMPAÑA_HUERTA = "huerta_campaña_activa";

// -------------------------------------
// MENÚ HAMBURGUESA
// -------------------------------------
function toggleMenu() {
  const menu = document.getElementById("menuLateral");
  if (menu) {
    menu.classList.toggle("activo");
  }
}
window.toggleMenu = toggleMenu;

// Cerrar menú al tocar fuera
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

// Cerrar menú al pulsar un enlace
function initMenuLinks() {
  document.querySelectorAll(".menu-lateral a").forEach(function (link) {
    link.addEventListener("click", function () {
      const menu = document.getElementById("menuLateral");
      if (menu) {
        menu.classList.remove("activo");
      }
    });
  });
}

// -------------------------------------
// CAMPAÑA
// -------------------------------------
function getCampañaHuerta() {
  return localStorage.getItem(STORAGE_CAMPAÑA_HUERTA) || "2025-2026";
}

// -------------------------------------
// DATOS
// -------------------------------------
function getLabores() {
  return JSON.parse(localStorage.getItem(STORAGE_LABORES_HUERTA)) || [];
}

function saveLabores(data) {
  localStorage.setItem(STORAGE_LABORES_HUERTA, JSON.stringify(data));
}

// -------------------------------------
// FECHAS
// -------------------------------------
function formatearFechaISO(fechaISO) {
  if (!fechaISO) return "";
  const partes = fechaISO.split("-");
  if (partes.length !== 3) return fechaISO;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function ponerFechaHoyLabor() {
  const campoFecha = document.getElementById("fechaLabor");
  if (campoFecha && !campoFecha.value) {
    campoFecha.value = new Date().toISOString().split("T")[0];
  }
}

// -------------------------------------
// FORMULARIO
// -------------------------------------
function initFormularioLabores() {
  const form = document.getElementById("formLabor");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fecha = document.getElementById("fechaLabor")?.value || "";
    const parcela = document.getElementById("parcelaAbono")?.value.trim() || "";
    const cultivo = document.getElementById("cultivoLabor")?.value.trim() || "";
    const trabajo = document.getElementById("trabajoLabor")?.value.trim() || "";
    const operario = document.getElementById("operarioLabor")?.value.trim() || "";
    const notas = document.getElementById("notasLabor")?.value.trim() || "";

    
console.log("fecha =", fecha);
console.log("parcela =", parcela);
console.log("cultivo =", cultivo);
console.log("trabajo =", trabajo);


    if (!fecha || !parcela || !trabajo) {
      alert("Completa Fecha, Parcela y Trabajo.");
      return;
    }

    const item = {
      id: Date.now(),
      fecha,
      parcela,
      cultivo,
      trabajo,
      operario,
      notas,
      campaña: getCampañaHuerta()
    };

    const datos = getLabores();
    datos.push(item);
    saveLabores(datos);

    form.reset();
    ponerFechaHoyLabor();
    cargarLabores();
  });
}

// -------------------------------------
// TABLA
// -------------------------------------
function cargarLabores() {
  const tbody = document.getElementById("tablaLabores");
  if (!tbody) return;

  const datos = getLabores().filter(function (item) {
    return item.campaña === getCampañaHuerta();
  });

  tbody.innerHTML = "";

  if (datos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;">Sin labores registradas</td>
      </tr>
    `;
    return;
  }

  datos
    .slice()
    .reverse()
    .forEach(function (item) {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${formatearFechaISO(item.fecha)}</td>
        <td>${item.parcela || ""}</td>
        <td>${item.cultivo || ""}</td>
        <td>${item.trabajo || ""}</td>
        <td>${item.operario || ""}</td>
        <td>${item.notas || ""}</td>
        <td>
          <button class="boton boton-eliminar" onclick="borrarLabor(${item.id})">❌</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
}

// -------------------------------------
// BORRAR
// -------------------------------------
window.borrarLabor = function (id) {
  const confirmar = confirm("¿Quieres borrar esta labor?");
  if (!confirmar) return;

  const datos = getLabores().filter(function (item) {
    return item.id !== id;
  });

  saveLabores(datos);
  cargarLabores();
};

// -------------------------------------
// INICIO
// -------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  console.log("Labores listo ✅");

  ponerFechaHoyLabor();
  initMenuLinks();
  initFormularioLabores();
  cargarLabores();
});