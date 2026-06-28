// =====================================
// COSECHA HUERTA - LIMPIO
// =====================================

const STORAGE_COSECHA_HUERTA = "huerta_cosechas";
const STORAGE_CAMPAÑA_HUERTA = "huerta_campaña_activa";

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


// ==============================
// CAMPAÑA
// ==============================
function getCampañaHuerta() {
  return localStorage.getItem(STORAGE_CAMPAÑA_HUERTA) || "2025-2026";
}

// ==============================
// DATOS
// ==============================
function getCosechas() {
  return JSON.parse(localStorage.getItem(STORAGE_COSECHA_HUERTA)) || [];
}

function saveCosechas(data) {
  localStorage.setItem(STORAGE_COSECHA_HUERTA, JSON.stringify(data));
}

// ==============================
// FORMATEAR FECHA
// ==============================
function formatearFechaISO(fechaISO) {
  if (!fechaISO) return "";
  const partes = fechaISO.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// ==============================
// GUARDAR COSECHA
// ==============================
function initFormularioCosecha() {

  const form = document.getElementById("formCosecha");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fecha = document.getElementById("fechaCosecha").value;
    const parcela = document.getElementById("parcelaCosecha").value.trim();
    const cultivo = document.getElementById("cultivoCosecha").value.trim();
    const kilos = document.getElementById("kilosCosecha").value;
    const destino = document.getElementById("destinoCosecha").value.trim();
    const notas = document.getElementById("notasCosecha").value.trim();

    if (!fecha || !parcela || !cultivo || !kilos) {
      alert("Completa fecha, parcela, cultivo y kilos");
      return;
    }

    const item = {
      id: Date.now(),
      fecha,
      parcela,
      cultivo,
      kilos: Number(kilos),
      destino,
      notas,
      campaña: getCampañaHuerta()
    };

    const datos = getCosechas();
    datos.push(item);
    saveCosechas(datos);

    form.reset();
    cargarCosechas();
  });
}

// ==============================
// CARGAR TABLA
// ==============================
function cargarCosechas() {

  const tbody = document.getElementById("tablaCosecha");
  if (!tbody) return;

  const datos = getCosechas().filter(item => item.campaña === getCampañaHuerta());

  tbody.innerHTML = "";

  if (datos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;">Sin cosechas</td>
      </tr>
    `;
    return;
  }

  datos.slice().reverse().forEach(item => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${formatearFechaISO(item.fecha)}</td>
      <td>${item.parcela}</td>
      <td>${item.cultivo}</td>
      <td>${item.kilos}</td>
      <td>${item.destino || ""}</td>
      <td>${item.notas || ""}</td>
      <button class="boton boton-eliminar" onclick="borrarCosecha(${item.id})">❌</button>

    `;

    tbody.appendChild(tr);
  });
}

// ==============================
// BORRAR
// ==============================
window.borrarCosecha = function (id) {
  const datos = getCosechas().filter(item => item.id !== id);
  saveCosechas(datos);
  cargarCosechas();
};

// ==============================
// INICIO
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  console.log("Cosecha lista ✅");
  
// Fecha de hoy automática
  const fechaCosecha = document.getElementById("fechaCosecha");

  if (fechaCosecha && !fechaCosecha.value) {
    fechaCosecha.value = new Date().toISOString().split("T")[0];
  }

  initFormularioCosecha();
  cargarCosechas();
});


// ==============================
// ABAJO: COSECHA ACTUALIZADO COSAS NUEVAS
// ==============================

// ==============================
// 🔝COSECHA ACTUALIZADO COSAS NUEVAS
// ==============================

// ==============================
// ✅ FUNCIÓN PARA MOSTRAR FICHA COSECHA
// ==============================
