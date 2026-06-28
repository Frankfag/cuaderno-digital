// =====================================
// HUERTA DASHBOARD - COMPLETO Y LIMPIO
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


// -------------------------------------
// STORAGE
// -------------------------------------
const STORAGE_CAMPAÑA_HUERTA = "huerta_campaña_activa";
const STORAGE_CULTIVOS_HUERTA = "huerta_cultivos";
const STORAGE_LABORES_HUERTA = "huerta_labores";
const STORAGE_RIEGOS_HUERTA = "huerta_riegos";
const STORAGE_ABONOS_HUERTA = "huerta_abonos";
const STORAGE_COSECHA_HUERTA = "huerta_cosechas";

// -------------------------------------
// CAMPAÑA
// -------------------------------------
function getCampañaHuerta() {
  return localStorage.getItem(STORAGE_CAMPAÑA_HUERTA) || "2025-2026";
}

// -------------------------------------
// DATOS
// -------------------------------------
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function cultivosCampaña() {
  return getData(STORAGE_CULTIVOS_HUERTA).filter(
    item => item.campaña === getCampañaHuerta()
  );
}

function laboresCampaña() {
  return getData(STORAGE_LABORES_HUERTA).filter(
    item => item.campaña === getCampañaHuerta()
  );
}

function riegosCampaña() {
  return getData(STORAGE_RIEGOS_HUERTA).filter(
    item => !item.campaña || item.campaña === getCampañaHuerta()
  );
}

function abonosCampaña() {
  return getData(STORAGE_ABONOS_HUERTA).filter(
    item => item.campaña === getCampañaHuerta()
  );
}

function cosechasCampaña() {
  return getData(STORAGE_COSECHA_HUERTA).filter(
    item => item.campaña === getCampañaHuerta()
  );
}

// -------------------------------------
// UTILIDADES
// -------------------------------------
function calcularEstado(fechaCosechaISO, cosechado) {
  if (cosechado) return "COSECHADO";
  if (!fechaCosechaISO) return "EN_CURSO";

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const cosecha = new Date(fechaCosechaISO + "T00:00:00");
  const diff = Math.ceil((cosecha - hoy) / (1000 * 60 * 60 * 24));

  if (diff <= 0) return "LISTO";
  if (diff <= 15) return "PROXIMO";
  return "EN_CURSO";
}

function restanteTexto(ms) {
  if (ms <= 0) return "00:00";

  const totalSeg = Math.floor(ms / 1000);
  const min = Math.floor(totalSeg / 60);
  const seg = totalSeg % 60;

  return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
}

function formatearFechaISO(fechaISO) {
  if (!fechaISO) return "";
  const partes = fechaISO.split("-");
  if (partes.length !== 3) return fechaISO;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function getFirstEl(ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}

// -------------------------------------
// MINI-LISTAS DE TARJETAS
// -------------------------------------
function renderMiniLista(contenedorId, items, textoVacio, ordenarPor = null, limite = 4, mostrarFecha = false) {
  const lista = document.getElementById(contenedorId);
  if (!lista) return;

  if (!items || items.length === 0) {
    lista.innerHTML = `<div class="mini-vacio">${textoVacio}</div>`;
    return;
  }

  let datos = items.slice();

  if (ordenarPor) {
    datos.sort((a, b) => new Date(a[ordenarPor]) - new Date(b[ordenarPor]));
  }

  lista.innerHTML = datos
    .slice(0, limite)
    .map(item => {
      const cultivo = item.cultivo || "Cultivo";
      const parcela = item.parcela || "Sin parcela";
      const fecha = mostrarFecha && item.fechaCosecha
        ? ` — ${formatearFechaISO(item.fechaCosecha)}`
        : "";

      return `
        <div class="mini-item-dashboard">
          <strong>${cultivo}</strong><br>
          <small>${parcela}${fecha}</small>
        </div>
      `;
    })
    .join("");
}

// -------------------------------------
// RESUMEN DASHBOARD
// -------------------------------------
function cargarResumenDashboard() {
  const cultivos = cultivosCampaña();
  const labores = laboresCampaña();
  const riegos = riegosCampaña();
  const abonos = abonosCampaña();
  const cosechas = cosechasCampaña();

  // ✅ ARRAY de cultivos próximos
  const proximos = cultivos.filter(
    item => calcularEstado(item.fechaCosecha, item.cosechado) === "PROXIMO"
  );
  const proximosNum = proximos.length;

  // ✅ ARRAY de cultivos listos
  const listosArray = cultivos.filter(
    item => calcularEstado(item.fechaCosecha, item.cosechado) === "LISTO"
  );
  const listosNum = listosArray.length;

  // ✅ ARRAY de cultivos activos (no cosechados)
  const activosArray = cultivos.filter(item => !item.cosechado);
  const activosNum = activosArray.length;

  const kilos = cosechas.reduce(
    (acc, item) => acc + (Number(item.kilos) || 0),
    0
  );

  // ===== RIEGOS =====
  const riegosCompletados = riegos.filter(
    item => item.estado === "COMPLETADO"
  ).length;

  const riegosPendientes = riegos.filter(
    item => item.estado === "PENDIENTE"
  ).length;

  const enCurso = riegos.find(
    item => item.estado === "EN_CURSO"
  );

  // ===== CAMPOS PRINCIPALES =====
  const elCultivos = document.getElementById("dashCultivos");
  const elProximas = document.getElementById("proximasCosechas");
  const elListos = document.getElementById("listosCosechar");
  const elKilos = document.getElementById("dashKilos");
  const elLabores = document.getElementById("dashLabores");
  const elRiegos = document.getElementById("dashRiegos");
  const elRiegosComp = document.getElementById("dashRiegosCompletados");
  const elRiegosPend = document.getElementById("dashRiegosPendientes");
  const elAbonos = document.getElementById("dashAbonos");
  const elCampaña = document.getElementById("dashCampaña");

  if (elCultivos) elCultivos.textContent = activosNum;
  if (elProximas) elProximas.textContent = proximosNum;
  if (elListos) elListos.textContent = listosNum;
  if (elKilos) elKilos.textContent = kilos.toFixed(0);
  if (elLabores) elLabores.textContent = labores.length;
  if (elRiegos) elRiegos.textContent = riegos.length;
  if (elRiegosComp) elRiegosComp.textContent = riegosCompletados;
  if (elRiegosPend) elRiegosPend.textContent = riegosPendientes;
  if (elAbonos) elAbonos.textContent = abonos.length;
  if (elCampaña) elCampaña.textContent = getCampañaHuerta();

  // ===== LISTA PRÓXIMAS COSECHAS =====
  const listaProximas = document.getElementById("listaProximasDashboard");
  if (listaProximas) {
    if (proximosNum === 0) {
      listaProximas.innerHTML = `<div class="mini-vacio">Sin próximas cosechas</div>`;
    } else {
      listaProximas.innerHTML = proximos
        .slice()
        .sort((a, b) => new Date(a.fechaCosecha) - new Date(b.fechaCosecha))
        .slice(0, 4)
        .map(item => `
          <div class="mini-item-dashboard">
            <strong>${item.cultivo || "Cultivo"}</strong><br>
            <small>${item.parcela || "Sin parcela"}</small>
          </div>
        `)
        .join("");
    }
  }

  // ===== LISTA LISTOS PARA COSECHAR =====
  const listaListos = document.getElementById("listaListosDashboard");
  if (listaListos) {
    if (listosNum === 0) {
      listaListos.innerHTML = `<div class="mini-vacio">Nada listo</div>`;
    } else {
      listaListos.innerHTML = listosArray
        .slice()
        .sort((a, b) => new Date(a.fechaCosecha) - new Date(b.fechaCosecha))
        .slice(0, 4)
        .map(item => `
          <div class="mini-item-dashboard">
            <strong>${item.cultivo || "Cultivo"}</strong><br>
            <small>${item.parcela || "Sin parcela"}</small>
          </div>
        `)
        .join("");
    }
  }

  // ===== LISTA CULTIVOS ACTIVOS =====
  const listaActivos = document.getElementById("listaActivosDashboard");
  if (listaActivos) {
    if (activosNum === 0) {
      listaActivos.innerHTML = `<div class="mini-vacio">Sin cultivos activos</div>`;
    } else {
      listaActivos.innerHTML = activosArray
        .slice()
        .sort((a, b) => new Date(a.fechaPlantacion) - new Date(b.fechaPlantacion))
        .slice(0, 6)
        .map(item => `
          <div class="mini-item-dashboard">
            <strong>${item.cultivo || "Cultivo"}</strong><br>
            <small>${item.parcela || "Sin parcela"}</small>
          </div>
        `)
        .join("");
    }
  }

  // ===== TEXTO + CONTADOR DE RIEGO =====
  const aviso = document.getElementById("dashAvisoRiegos");
  const contador = document.getElementById("dashContadorRiego");

  if (enCurso) {
    if (aviso) {
      aviso.innerHTML = `💧 Regando: <strong>${enCurso.parcela}</strong>`;
    }

    if (contador && enCurso.fechaHoraFinPrevista) {
      const ahora = Date.now();
      const fin = new Date(enCurso.fechaHoraFinPrevista).getTime();
      const restante = fin - ahora;

      if (restante <= 0) {
        contador.textContent = "⏱️ 00:00";
      } else {
        contador.textContent = "⏱️ " + restanteTexto(restante);
      }

      contador.classList.remove("rojo");

      if (restante < 60000) {
        contador.classList.add("rojo");
      }
    }
  } else {
    if (aviso) {
      if (riegosPendientes > 0) {
        aviso.innerHTML = `⚠️ ${riegosPendientes} pendientes`;
      } else {
        aviso.innerHTML = "✅ Todo OK";
      }
    }

    if (contador) {
      contador.textContent = "";
      contador.classList.remove("rojo");
    }
  }
}
// -------------------------------------
// ALERTA GLOBAL
// -------------------------------------
function cargarAlertaDashboard() {
  const cultivos = cultivosCampaña();

  const listos = cultivos.filter(
    item => calcularEstado(item.fechaCosecha, item.cosechado) === "LISTO"
  ).length;

  const proximos = cultivos.filter(
    item => calcularEstado(item.fechaCosecha, item.cosechado) === "PROXIMO"
  ).length;

  const box = document.getElementById("alertaDashboard");
  const texto = document.getElementById("textoAlertaDashboard");

  if (!box || !texto) return;

  box.classList.remove("alerta-roja", "alerta-amarilla", "alerta-verde");

  if (listos > 0) {
    box.classList.add("alerta-roja");
    texto.textContent = `🚨 Hay ${listos} cultivo(s) listos para cosechar`;
  } else if (proximos > 0) {
    box.classList.add("alerta-amarilla");
    texto.textContent = `⚠️ Hay ${proximos} cultivo(s) próximos a cosecha`;
  } else {
    box.classList.add("alerta-verde");
    texto.textContent = "✅ Sin alertas críticas de cosecha";
  }
}

// -------------------------------------
// RESUMEN POR PARCELA
// -------------------------------------
function cargarParcelasDashboard() {
  const tbody = document.getElementById("tablaParcelasDashboard");
  if (!tbody) return;

  const cultivos = cultivosCampaña();
  const labores = laboresCampaña();
  const riegos = riegosCampaña();
  const abonos = abonosCampaña();
  const cosechas = cosechasCampaña();

  const resumen = {};

  cultivos.forEach(item => {
    if (!resumen[item.parcela]) {
      resumen[item.parcela] = {
        cultivos: 0,
        labores: 0,
        riegos: 0,
        abonos: 0,
        kilos: 0
      };
    }
    resumen[item.parcela].cultivos += 1;
  });

  labores.forEach(item => {
    if (!resumen[item.parcela]) {
      resumen[item.parcela] = {
        cultivos: 0,
        labores: 0,
        riegos: 0,
        abonos: 0,
        kilos: 0
      };
    }
    resumen[item.parcela].labores += 1;
  });

  riegos.forEach(item => {
    if (!resumen[item.parcela]) {
      resumen[item.parcela] = {
        cultivos: 0,
        labores: 0,
        riegos: 0,
        abonos: 0,
        kilos: 0
      };
    }
    resumen[item.parcela].riegos += 1;
  });

  abonos.forEach(item => {
    if (!resumen[item.parcela]) {
      resumen[item.parcela] = {
        cultivos: 0,
        labores: 0,
        riegos: 0,
        abonos: 0,
        kilos: 0
      };
    }
    resumen[item.parcela].abonos += 1;
  });

  cosechas.forEach(item => {
    if (!resumen[item.parcela]) {
      resumen[item.parcela] = {
        cultivos: 0,
        labores: 0,
        riegos: 0,
        abonos: 0,
        kilos: 0
      };
    }
    resumen[item.parcela].kilos += Number(item.kilos) || 0;
  });

  tbody.innerHTML = "";

  const parcelas = Object.keys(resumen);

  if (parcelas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">Sin datos de parcelas</td>
      </tr>
    `;
    return;
  }

  parcelas.forEach(parcela => {
    const r = resumen[parcela];
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${parcela}</td>
      <td>${r.cultivos}</td>
      <td>${r.labores}</td>
      <td>${r.riegos}</td>
      <td>${r.abonos}</td>
      <td>${r.kilos.toFixed(0)}</td>
    `;

    tbody.appendChild(tr);
  });
}

// -------------------------------------
// REFRESCAR DASHBOARD
// -------------------------------------
function refrescarDashboard() {
  cargarResumenDashboard();
  cargarAlertaDashboard();
  cargarParcelasDashboard();
}

// -------------------------------------
// INICIO
// -------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  console.log("Dashboard huerta listo ✅");
  refrescarDashboard();
});

document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    refrescarDashboard();
  }
});

window.addEventListener("focus", function () {
  refrescarDashboard();
});

// refresco en vivo para contador y aviso de riego
setInterval(function () {
  cargarResumenDashboard();
}, 1000);
