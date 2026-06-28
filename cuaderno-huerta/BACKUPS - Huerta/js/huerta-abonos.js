// =====================================
// HUERTA ABONOS · DESDE CERO
// =====================================

// -------------------------------------
// CONTROL LOGIN
// -------------------------------------


// -------------------------------------
// STORAGE
// -------------------------------------
const STORAGE_ABONOS_HUERTA = "huerta_abonos";
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

// Cerrar menú al pulsar enlaces
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
function getAbonos() {
  return JSON.parse(localStorage.getItem(STORAGE_ABONOS_HUERTA)) || [];
}

function saveAbonos(data) {
  localStorage.setItem(STORAGE_ABONOS_HUERTA, JSON.stringify(data));
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

function ponerFechaHoyAbono() {
  const campoFecha = document.getElementById("fechaAbono");
  if (campoFecha && !campoFecha.value) {
    campoFecha.value = new Date().toISOString().split("T")[0];
  }
}

// -------------------------------------
// FORMULARIO
// -------------------------------------
function initFormularioAbono() {
  const form = document.getElementById("formAbono");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fecha = document.getElementById("fechaAbono")?.value || "";
    const parcela = document.getElementById("parcelaAbono")?.value.trim() || "";
    const producto = document.getElementById("productoAbono")?.value.trim() || "";
    const cantidad = document.getElementById("cantidadAbono")?.value.trim() || "";
    const notas = document.getElementById("notasAbono")?.value.trim() || "";

    if (!fecha || !parcela || !producto) {
      alert("Completa Fecha, Parcela y Producto.");
      return;
    }

    const item = {
      id: Date.now(),
      fecha,
      parcela,
      producto,
      cantidad,
      notas,
      campaña: getCampañaHuerta()
    };

    const datos = getAbonos();
    datos.push(item);
    saveAbonos(datos);

    form.reset();
    ponerFechaHoyAbono();
    cargarAbonos();
  });
}

// -------------------------------------
// TABLA
// -------------------------------------
function cargarAbonos() {
  const tbody = document.getElementById("tablaAbonos");
  if (!tbody) return;

  const datos = getAbonos().filter(function (item) {
    return item.campaña === getCampañaHuerta();
  });

  tbody.innerHTML = "";

  if (datos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">Sin abonados registrados</td>
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
        <td>${item.producto || ""}</td>
        <td>${item.cantidad || ""}</td>
        <td>${item.notas || ""}</td>
        <td>
          <button class="boton boton-eliminar" onclick="borrarAbono(${item.id})">❌</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
}

// -------------------------------------
// BORRAR
// -------------------------------------
window.borrarAbono = function (id) {
  const confirmar = confirm("¿Quieres borrar este abonado?");
  if (!confirmar) return;

  const datos = getAbonos().filter(function (item) {
    return item.id !== id;
  });

  saveAbonos(datos);
  cargarAbonos();
};

// -------------------------------------
// INICIO
// -------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  console.log("Abonos listo ✅");

  ponerFechaHoyAbono();
  initMenuLinks();
  initFormularioAbono();
  cargarAbonos();
});