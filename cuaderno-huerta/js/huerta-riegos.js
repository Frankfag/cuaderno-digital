// =====================================
// HUERTA RIEGOS - LIMPIO Y ESTABLE
// =====================================

// ---------- STORAGE ----------
const STORAGE_RIEGOS_HUERTA = "huerta_riegos";
const STORAGE_CAMPAÑA_HUERTA = "campaña_activa";
const STORAGE_CULTIVOS_HUERTA = "huerta_cultivos";
const STORAGE_PARCELAS_CONTROL_RIEGO = "huerta_riego_parcelas_control";
const STORAGE_CHECKS_SEMANA_RIEGO = "checks_semana_riego";

// MENU HAMBURGUESA ☰
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
// CAMPAÑA / DATOS
// =====================================
function getCampañaHuerta() {
  return localStorage.getItem(STORAGE_CAMPAÑA_HUERTA) || "2025-2026";
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getRiegos() {
  return getData(STORAGE_RIEGOS_HUERTA);
}

function minutosAHoras(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;

  if (h > 0 && m > 0) return `${h} h ${m} min`;
  if (h > 0) return `${h} h`;
  return `${m} min`;
}



// =====================================
// CARGAR RIEGOS DESDE SUPABASE
// =====================================
async function cargarRiegosDesdeSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from("riegos_huerta")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error cargando riegos desde Supabase:", error);
      return;
    }

    const riegos = data.map(item => ({
      id: item.id,
      fecha: item.fecha,
      horaPrevista: item.hora_prevista || "",
      parcela: item.parcela || "",
      minutos: item.minutos || 0,
      sistema: item.sistema || "",
      notas: item.notas || "",
      estado: item.estado || "PENDIENTE",
      fechaHoraInicioReal: item.fecha_hora_inicio_real || "",
      fechaHoraFinPrevista: item.fecha_hora_fin_prevista || "",
      fechaHoraFinReal: item.fecha_hora_fin_real || "",
      campaña: item.campaña || getCampañaHuerta()
    }));

    saveRiegos(riegos);

    console.log("Riegos cargados desde Supabase:", riegos.length);

  } catch (err) {
    console.error("Error general cargando riegos desde Supabase:", err);
  }
}

function saveRiegos(data) {
  saveData(STORAGE_RIEGOS_HUERTA, data);
}

function getCultivosHuerta() {
  return getData(STORAGE_CULTIVOS_HUERTA);
}

function getParcelasControl() {
  return getData(STORAGE_PARCELAS_CONTROL_RIEGO);
}

function saveParcelasControl(data) {
  saveData(STORAGE_PARCELAS_CONTROL_RIEGO, data);
}

function getChecksSemana() {
  return JSON.parse(localStorage.getItem(STORAGE_CHECKS_SEMANA_RIEGO)) || {};
}

function saveChecksSemana(data) {
  localStorage.setItem(STORAGE_CHECKS_SEMANA_RIEGO, JSON.stringify(data));
}

// Incluye datos antiguos sin campaña + datos nuevos con campaña actual
function getRiegosCampaña() {
  return getRiegos().filter(item => !item.campaña || item.campaña === getCampañaHuerta());
}

// =====================================
// TELEGRAM
// =====================================
const TELEGRAM_TOKEN = "8883964028:AAGCM42R9Z09jV2ohKDPYmjk7cN7rGPM6sY";
const TELEGRAM_CHAT_ID = "-5105892734";
//const TELEGRAM_CHAT_ID = "6191197987";

function enviarTelegram(mensaje) {

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: mensaje
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Telegram OK", data);
  })
  .catch(err => {
    console.error("Error Telegram", err);
  });
}

// =====================================
// UTILIDADES
// =====================================
function hoyISO() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatearFechaISO(fechaISO) {
  if (!fechaISO) return "";
  const partes = fechaISO.split("-");
  if (partes.length !== 3) return fechaISO;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatearFechaHora(fechaISO) {
  if (!fechaISO) return "-";
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function normalizarTexto(texto) {
  return (texto || "").trim().replace(/\s+/g, " ");
}

function escaparHTML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function restanteTexto(ms) {
  if (ms <= 0) return "00:00";
  const totalSeg = Math.floor(ms / 1000);
  const min = Math.floor(totalSeg / 60);
  const seg = totalSeg % 60;
  return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
}

function obtenerInicioSemana(fecha = new Date()) {
  const d = new Date(fecha);
  const dia = d.getDay(); // 0 domingo
  const diff = dia === 0 ? -6 : 1 - dia; // lunes inicio
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diff);
  return d;
}

function obtenerFinSemana(fecha = new Date()) {
  const inicio = obtenerInicioSemana(fecha);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 7);
  return fin;
}

function estaSemana(fechaISO) {
  if (!fechaISO) return false;
  const fecha = new Date(fechaISO + "T00:00:00");
  const inicio = obtenerInicioSemana();
  const fin = obtenerFinSemana();
  return fecha >= inicio && fecha < fin;
}

function esHoy(fechaISO) {
  return fechaISO === hoyISO();
}

function generaId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// =====================================
// PARCELAS SUGERIDAS
// =====================================
function obtenerParcelasCultivos() {
  return getCultivosHuerta()
    .filter(item => !item.campaña || item.campaña === getCampañaHuerta())
    .map(item => normalizarTexto(item.parcela))
    .filter(Boolean);
}

function obtenerParcelasRiegos() {
  return getRiegosCampaña()
    .map(item => normalizarTexto(item.parcela))
    .filter(Boolean);
}

function obtenerParcelasSugeridas() {
  const lista = [
    ...obtenerParcelasCultivos(),
    ...obtenerParcelasRiegos(),
    ...getParcelasControl()
  ];
  return [...new Set(lista)].sort((a, b) => a.localeCompare(b));
}

function renderDatalistParcelas() {
  const datalist = document.getElementById("listaParcelasRiego");
  if (!datalist) return;

  const parcelas = obtenerParcelasSugeridas();
  datalist.innerHTML = parcelas
    .map(p => `<option value="${escaparHTML(p)}"></option>`)
    .join("");
}

// =====================================
// FORMULARIO
// =====================================
function initFechaPorDefecto() {
  const input = document.getElementById("fechaRiego");
  if (input) input.value = hoyISO();
}

function initFormularioRiego() {
  const form = document.getElementById("formRiego");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fecha = document.getElementById("fechaRiego")?.value || hoyISO();
    const hora = document.getElementById("horaRiego")?.value || "";
    const parcela = normalizarTexto(document.getElementById("parcelaRiego")?.value);
    const horasInput = document.getElementById("minutosRiego").value || 0;
    const minutos = Number(horasInput) * 60;
    const sistema = document.getElementById("sistemaRiego")?.value || "Goteo";
    const notas = normalizarTexto(document.getElementById("notasRiego")?.value || "");

    if (!fecha || !parcela || minutos <= 0) {
      alert("Completa fecha, parcela y minutos de riego.");
      return;
    }

    const registro = {
  id: generaId(),
  fecha: fecha,
  horaPrevista: hora,
  parcela: parcela,
  minutos: minutos,
  sistema: sistema,
  notas: notas,
  estado: "PENDIENTE",
  fechaHoraInicioReal: "",
  fechaHoraFinPrevista: "",
  fechaHoraFinReal: "",
  campaña: getCampañaHuerta()
};

    const datos = getRiegos();
    datos.push(registro);
    saveRiegos(datos);
    // =====================================
// SUPABASE
// =====================================
    supabaseClient
  .from("riegos_huerta")
  .insert({
    id: registro.id,
    fecha: registro.fecha,
    hora_prevista: registro.horaPrevista,
    parcela: registro.parcela,
    minutos: registro.minutos,
    sistema: registro.sistema,
    notas: registro.notas,
    estado: registro.estado,
    fecha_hora_inicio_real: registro.fechaHoraInicioReal,
    fecha_hora_fin_prevista: registro.fechaHoraFinPrevista,
    fecha_hora_fin_real: registro.fechaHoraFinReal,
    campaña: registro.campaña
  })
  .then(({ error }) => {
    if (error) {
      console.error("Error guardando riego en Supabase:", error);
    } else {
      console.log("Riego guardado en Supabase");
    }
  });
    form.reset();
    initFechaPorDefecto();

    renderDatalistParcelas();
    cargarRiegos();
    actualizarPanelRiego();
    actualizarResumen();
    actualizarInformeSemanal();
    actualizarAlertaGeneral();
  });
}

// =====================================
// RIEGO ACTIVO
// =====================================
function getRiegoActivo() {
  return getRiegosCampaña().find(x => x.estado === "EN_CURSO") || null;
}

function getPendientesOrdenados() {
  return getRiegosCampaña()
    .filter(x => x.estado === "PENDIENTE")
    .sort((a, b) => {
      const aa = `${a.fecha} ${a.horaPrevista || "99:99"}`;
      const bb = `${b.fecha} ${b.horaPrevista || "99:99"}`;
      return aa.localeCompare(bb);
    });
}

function getSiguientePendiente() {
  const pendientes = getPendientesOrdenados();
  return pendientes.length ? pendientes[0] : null;
}

function pedirPermisoNotificaciones() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function lanzarAvisoFin(mensaje) {
  alert(mensaje);

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Riego terminado", { body: mensaje });
  }
}

// =====================================
// ACCIONES RIEGO
// =====================================
// =====================================
// INICIAR RIEGO
// =====================================
window.iniciarRiego = function (id) {
  const datos = getRiegos();
  const item = datos.find(x => Number(x.id) === Number(id));

  if (!item) return;

  const ahora = new Date();
  const fin = new Date(
    ahora.getTime() + Number(item.minutos) * 60 * 1000
  );

  item.estado = "EN_CURSO";
  item.fechaHoraInicioReal = ahora.toISOString();
  item.fechaHoraFinPrevista = fin.toISOString();
  item.fechaHoraFinReal = "";

  saveRiegos(datos);

  supabaseClient
    .from("riegos_huerta")
    .update({
      estado: item.estado,
      fecha_hora_inicio_real: item.fechaHoraInicioReal,
      fecha_hora_fin_prevista: item.fechaHoraFinPrevista,
      fecha_hora_fin_real: item.fechaHoraFinReal
    })
    .eq("id", item.id)
    .then(({ error }) => {
      if (error) {
        console.error("Error iniciando riego en Supabase:", error);
      } else {
        console.log("Riego iniciado en Supabase");
      }
    });

  console.log("RIEGO INICIADO:", item);

  cargarRiegos();
  actualizarPanelRiego();
  actualizarResumen();
  actualizarAlertaGeneral();
};


// =====================================
// FINALIZAR RIEGO
// =====================================
window.finalizarRiego = function (id, automatico = false) {
  const datos = getRiegos();
  const item = datos.find(x => Number(x.id) === Number(id));

  if (!item) return;

  item.estado = "COMPLETADO";
  item.fechaHoraFinReal = new Date().toISOString();

  saveRiegos(datos);

  supabaseClient
    .from("riegos_huerta")
    .update({
      estado: item.estado,
      fecha_hora_inicio_real: item.fechaHoraInicioReal,
      fecha_hora_fin_prevista: item.fechaHoraFinPrevista,
      fecha_hora_fin_real: item.fechaHoraFinReal
    })
    .eq("id", item.id)
    .then(({ error }) => {
      if (error) {
        console.error("Error finalizando riego en Supabase:", error);
      } else {
        console.log("Riego finalizado en Supabase");
      }
    });

  const siguiente = getSiguientePendiente();

  const textoSiguiente = siguiente
    ? ` Siguiente pendiente: ${siguiente.parcela}${siguiente.horaPrevista ? ` a las ${siguiente.horaPrevista}` : ""}.`
    : " No quedan más riegos pendientes.";

  const mensaje = automatico
    ? `⏰ Ha terminado el riego de ${item.parcela}.${textoSiguiente}`
    : `✅ Has finalizado el riego de ${item.parcela}.${textoSiguiente}`;

// =====================================
// ENVIAR MENSAJE A TELEGRAM
// =====================================
    enviarTelegram(
  `🚿 Riego finalizado\n\n` +
  `Parcela: ${item.parcela}\n` +
  `Hora: ${new Date().toLocaleTimeString()}\n\n` +
  `${textoSiguiente}`
);

  lanzarAvisoFin(mensaje);

  cargarRiegos();
  actualizarPanelRiego();
  actualizarResumen();
  actualizarInformeSemanal();
  actualizarAlertaGeneral();
};


// =====================================
// CANCELAR RIEGO
// =====================================
window.cancelarRiego = function (id) {
  const datos = getRiegos();
  const item = datos.find(x => Number(x.id) === Number(id));

  if (!item) return;

  item.estado = "CANCELADO";
  item.fechaHoraFinReal = "";

  saveRiegos(datos);

  supabaseClient
    .from("riegos_huerta")
    .update({
      estado: item.estado,
      fecha_hora_inicio_real: item.fechaHoraInicioReal,
      fecha_hora_fin_prevista: item.fechaHoraFinPrevista,
      fecha_hora_fin_real: item.fechaHoraFinReal
    })
    .eq("id", item.id)
    .then(({ error }) => {
      if (error) {
        console.error("Error cancelando riego en Supabase:", error);
      } else {
        console.log("Riego cancelado en Supabase");
      }
    });

  cargarRiegos();
  actualizarPanelRiego();
  actualizarResumen();
  actualizarInformeSemanal();
  actualizarAlertaGeneral();
};


// =====================================
// ELIMINAR RIEGO
// =====================================
window.eliminarRiego = function (id) {
  const datos = getRiegos().filter(
    x => Number(x.id) !== Number(id)
  );

  saveRiegos(datos);

  supabaseClient
    .from("riegos_huerta")
    .delete()
    .eq("id", id)
    .then(({ error }) => {
      if (error) {
        console.error("Error eliminando riego en Supabase:", error);
      } else {
        console.log("Riego eliminado de Supabase");
      }
    });

  cargarRiegos();
  actualizarPanelRiego();
  actualizarResumen();
  actualizarInformeSemanal();
  actualizarAlertaGeneral();
  renderDatalistParcelas();
;



  cargarRiegos();
  actualizarPanelRiego();
  actualizarResumen();
  actualizarInformeSemanal();
  actualizarAlertaGeneral();
  renderDatalistParcelas();
};

// =====================================
// PANEL EN VIVO + CONTADOR
// =====================================
function actualizarPanelRiego() {
  const parcela = document.getElementById("parcelaActualRiego");
  const inicio = document.getElementById("inicioActualRiego");
  const fin = document.getElementById("finPrevistoRiego");
  const contador = document.getElementById("contadorRiego");
  const siguiente = document.getElementById("siguienteRiego");
  const estado = document.getElementById("estadoActualRiego");
  const mensaje = document.getElementById("mensajeEstadoRiego");

  if (!parcela || !inicio || !fin || !contador || !siguiente || !estado || !mensaje) return;

  const activo = getRiegoActivo();
  const siguientePendiente = getSiguientePendiente();

  if (!activo) {
    parcela.value = "-";
    inicio.value = "-";
    fin.value = "-";
    contador.value = "-";
    siguiente.value = siguientePendiente ? siguientePendiente.parcela : "-";
    estado.value = "SIN RIEGO";

    mensaje.classList.remove("alerta-roja", "alerta-verde");
    mensaje.classList.add("alerta-amarilla");
    mensaje.innerHTML = "<p>Ahora mismo no hay ningún riego en marcha.</p>";
    actualizarRestantesEnTabla();
    return;
  }

  const finMs = new Date(activo.fechaHoraFinPrevista).getTime();
  const ahoraMs = Date.now();
  const restanteMs = finMs - ahoraMs;

  if (restanteMs <= 0) {
    contador.value = "00:00";
    window.finalizarRiego(activo.id, true);
    return;
  }

  parcela.value = activo.parcela;
  inicio.value = formatearFechaHora(activo.fechaHoraInicioReal);
  fin.value = formatearFechaHora(activo.fechaHoraFinPrevista);
  contador.value = restanteTexto(restanteMs);
  siguiente.value = siguientePendiente ? siguientePendiente.parcela : "No hay";
  estado.value = "EN CURSO";

  mensaje.classList.remove("alerta-roja", "alerta-amarilla");
  mensaje.classList.add("alerta-verde");
  mensaje.innerHTML = `<p>🚿 Regando <strong>${escaparHTML(activo.parcela)}</strong>. Tiempo restante: <strong>${restanteTexto(restanteMs)}</strong></p>`;

  actualizarRestantesEnTabla();
}

// Actualiza solo la celda "Restante" de la fila activa sin redibujar la tabla entera
function actualizarRestantesEnTabla() {
  const filas = document.querySelectorAll("#tablaRiegos tr[data-id]");

  filas.forEach(tr => {
    const id = Number(tr.dataset.id);
    const item = getRiegos().find(x => Number(x.id) === id);

    const tdRestante = tr.querySelector(".celda-restante");
    const tdEstado = tr.querySelector(".celda-estado");

    if (!item || !tdRestante || !tdEstado) return;

    // 🔥 LIMPIAR CLASES
    tr.classList.remove("fila-riego-activo", "fila-riego-pendiente", "fila-riego-completado");

    // 🔥 CAMBIAR ESTADO BONITO
    if (item.estado === "EN_CURSO") {
      tdEstado.innerHTML = `<span class="estado-riego-activa">💧 EN CURSO</span>`;
    } else if (item.estado === "PENDIENTE") {
      tdEstado.innerHTML = `<span class="estado-riego-pendiente">⏳ PENDIENTE</span>`;
    } else if (item.estado === "COMPLETADO") {
      tdEstado.innerHTML = `<span class="estado-riego-finalizada">✅ COMPLETADO</span>`;
    } else {
      tdEstado.textContent = item.estado;
    }

    // 🔥 CONTADOR Y COLORES
    if (item.estado === "EN_CURSO" && item.fechaHoraFinPrevista) {
      const ms = new Date(item.fechaHoraFinPrevista).getTime() - Date.now();

      tdRestante.textContent = restanteTexto(ms);

      tr.classList.add("fila-riego-activo");

      // 🔥 si queda poco tiempo → rojo
      if (ms < 60000) {
        tdRestante.style.color = "red";
      } else {
        tdRestante.style.color = "#ffd700";
      }

    } else if (item.estado === "PENDIENTE") {

      tdRestante.textContent = "-";
      tr.classList.add("fila-riego-pendiente");

    } else if (item.estado === "COMPLETADO") {

      tdRestante.textContent = "-";
      tr.classList.add("fila-riego-completado");

    } else {
      tdRestante.textContent = "-";
    }
  });
}

// =====================================
// TABLA
// =====================================
function renderAcciones(item) {
  if (item.estado === "PENDIENTE") {
    return `
      <button class="boton" onclick="iniciarRiego(${item.id})">▶ Iniciar</button>
      <button class="boton boton-eliminar" onclick="eliminarRiego(${item.id})">❌</button>
    `;
  }

  if (item.estado === "EN_CURSO") {
    return `
      <button class="boton" onclick="finalizarRiego(${item.id})">✅ Finalizar</button>
      <button class="boton boton-eliminar" onclick="cancelarRiego(${item.id})">⛔ Cancelar</button>
    `;
  }

  return `
    <button class="boton boton-eliminar" onclick="eliminarRiego(${item.id})">🗑️</button>
  `;
}
function renderEstadoBonito(estado) {
  if (estado === "EN_CURSO") {
    return `<span class="estado-riego-activa">💧 EN CURSO</span>`;
  }

  if (estado === "PENDIENTE") {
    return `<span class="estado-riego-pendiente">⏳ PENDIENTE</span>`;
  }

  if (estado === "COMPLETADO") {
    return `<span class="estado-riego-finalizada">✅ COMPLETADO</span>`;
  }

  if (estado === "CANCELADO") {
    return `<span class="estado-riego-finalizada">⛔ CANCELADO</span>`;
  }

  return estado;
}
function calcularRestanteInicial(item) {
  if (item.estado !== "EN_CURSO" || !item.fechaHoraFinPrevista) return "-";
  return restanteTexto(new Date(item.fechaHoraFinPrevista).getTime() - Date.now());
}
``

function cargarRiegos() {
  const tbody = document.getElementById("tablaRiegos");
  if (!tbody) return;

  const datos = getRiegosCampaña()
    .slice()
    .sort((a, b) => {
      // 1️⃣ PRIORIDAD POR ESTADO
      const orden = {
        "EN_CURSO": 1,
        "PENDIENTE": 2,
        "COMPLETADO": 3,
        "CANCELADO": 4
      };

      const diffEstado = (orden[a.estado] || 99) - (orden[b.estado] || 99);
      if (diffEstado !== 0) return diffEstado;

      // 2️⃣ DENTRO DEL MISMO ESTADO, ORDEN POR FECHA/HORA
      const aa = `${a.fecha} ${a.horaPrevista || "99:99"}`;
      const bb = `${b.fecha} ${b.horaPrevista || "99:99"}`;
      return bb.localeCompare(aa);
    });

  tbody.innerHTML = "";

  if (datos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center;">Sin riegos guardados</td>
      </tr>
    `;
    return;
  }

  datos.forEach(item => {
    const tr = document.createElement("tr");
    tr.dataset.id = item.id;

    // clase visual por estado
    if (item.estado === "EN_CURSO") tr.classList.add("fila-riego-activo");
    if (item.estado === "PENDIENTE") tr.classList.add("fila-riego-pendiente");
    if (item.estado === "COMPLETADO") tr.classList.add("fila-riego-completado");

    tr.innerHTML = `
      <td>${formatearFechaISO(item.fecha)}</td>
      <td>${item.horaPrevista || "-"}</td>
      <td><strong>${item.parcela}</strong></td>
      <td>${minutosAHoras(item.minutos)}</td>

      <td>${item.sistema || "Goteo"}</td>
      <td class="celda-estado">
        ${renderEstadoBonito(item.estado)}
      </td>
      <td class="celda-restante">
        ${calcularRestanteInicial(item)}
      </td>
      <td>${item.notas || ""}</td>
      <td>${renderAcciones(item)}</td>
    `;

    tbody.appendChild(tr);
  });
}


// =====================================
// RESUMEN (opcional, no rompe si no está en HTML)
// =====================================
function actualizarResumen() {
  const datos = getRiegosCampaña();

  const enCurso = datos.filter(x => x.estado === "EN_CURSO").length;
  const pendientesHoy = datos.filter(x => x.estado === "PENDIENTE" && esHoy(x.fecha)).length;
  const completadosSemana = datos.filter(x => x.estado === "COMPLETADO" && estaSemana(x.fecha)).length;
  const minutosSemana = datos
    .filter(x => x.estado === "COMPLETADO" && estaSemana(x.fecha))
    .reduce((acc, item) => acc + (Number(item.minutos) || 0), 0);

  const a = document.getElementById("resumenEnCurso");
  const b = document.getElementById("resumenPendientesHoy");
  const c = document.getElementById("resumenCompletadosSemana");
  const d = document.getElementById("resumenMinutosSemana");

  if (a) a.textContent = enCurso;
  if (b) b.textContent = pendientesHoy;
  if (c) c.textContent = completadosSemana;
  if (d) d.textContent = minutosSemana;
}

// =====================================
// CONTROL SEMANAL + CHECK + BORRAR
// =====================================
function cargarParcelasControlTextarea() {
  const textarea = document.getElementById("parcelasControlSemanal");
  if (!textarea) return;
  textarea.value = getParcelasControl().join(", ");
}

function initControlSemanal() {
  const btn = document.getElementById("btnGuardarParcelasControl");
  const textarea = document.getElementById("parcelasControlSemanal");
  if (!btn || !textarea) return;

  btn.addEventListener("click", function () {
    const parcelas = textarea.value
      .split(",")
      .map(x => normalizarTexto(x))
      .filter(Boolean);

    saveParcelasControl([...new Set(parcelas)]);
    // Si cambia la lista, también reseteamos checks para evitar índices viejos
    saveChecksSemana({});

    renderDatalistParcelas();
    actualizarInformeSemanal();
    actualizarAlertaGeneral();
    alert("Listado semanal guardado correctamente.");
  });
}

window.borrarParcela = function (index) {
  const datos = getParcelasControl();
  datos.splice(index, 1);
  saveParcelasControl(datos);

  const checks = getChecksSemana();
  const nuevoChecks = {};
  datos.forEach((_, i) => {
    nuevoChecks[i] = checks[i] || false;
  });
  saveChecksSemana(nuevoChecks);

  cargarParcelasControlTextarea();
  renderDatalistParcelas();
  actualizarInformeSemanal();
  actualizarAlertaGeneral();
};

function initChecksSemana() {
  document.addEventListener("change", function (e) {
    if (e.target.classList.contains("checkParcelaSemana")) {
      const index = e.target.dataset.index;
      const checks = getChecksSemana();
      checks[index] = e.target.checked;
      saveChecksSemana(checks);
    }
  });
}

function actualizarInformeSemanal() {
  const box = document.getElementById("informeSemanalRiego");
  if (!box) return;

  const parcelasControl = getParcelasControl();
  const checks = getChecksSemana();

  const riegosSemana = getRiegosCampaña().filter(
    item => item.estado === "COMPLETADO" && estaSemana(item.fecha)
  );

  const parcelasRegadas = [...new Set(riegosSemana.map(item => item.parcela))];
  const pendientes = parcelasControl.filter(p => !parcelasRegadas.includes(p));

  const inicioSemana = obtenerInicioSemana();
  const finSemana = new Date(obtenerFinSemana().getTime() - 1);

  const minutos = riegosSemana.reduce(
    (acc, item) => acc + (Number(item.minutos) || 0),
    0
  );

  box.classList.remove("alerta-roja", "alerta-amarilla", "alerta-verde");

  if (parcelasControl.length === 0) {
    box.classList.add("alerta-amarilla");
    box.innerHTML = `
      <p><strong>Semana actual:</strong> ${inicioSemana.toLocaleDateString("es-ES")} - ${finSemana.toLocaleDateString("es-ES")}</p>
      <p>No has definido todavía las parcelas de control semanal.</p>
    `;
    return;
  }

  if (pendientes.length > 0) {
    box.classList.add("alerta-roja");
  } else {
    box.classList.add("alerta-verde");
  }

  const listaParcelasHTML = parcelasControl.map((parcela, i) => `
    <div style="display:flex; align-items:center; gap:8px; margin:6px 0;">
      <input
        type="checkbox"
        class="checkParcelaSemana"
        data-index="${i}"
        ${checks[i] ? "checked" : ""}
      >
      <span>${escaparHTML(parcela)}</span>
      <button
        onclick="borrarParcela(${i})"
        class="boton boton-eliminar"
        style="margin-left:auto;">
        ❌
      </button>
    </div>
  `).join("");

  box.innerHTML = `
    <p><strong>Semana actual:</strong> ${inicioSemana.toLocaleDateString("es-ES")} - ${finSemana.toLocaleDateString("es-ES")}</p>
    <p><strong>Parcelas controladas:</strong> ${parcelasControl.length}</p>
    <p><strong>Regadas esta semana:</strong> ${
      parcelasRegadas.length > 0 ? escaparHTML(parcelasRegadas.join(", ")) : "Ninguna todavía"
    }</p>
    <p><strong>Pendientes esta semana:</strong> ${
      pendientes.length > 0 ? escaparHTML(pendientes.join(", ")) : "Ninguna. Todo al día ✅"
    }</p>
    <p><strong>Minutos completados:</strong> ${minutos}</p>
    <hr style="margin:10px 0;">
    <strong>Checklist semanal:</strong>
    ${listaParcelasHTML}
  `;
}

// =====================================
// ALERTA GENERAL
// =====================================
function actualizarAlertaGeneral() {
  const box = document.getElementById("alertaRiegoGeneral");
  const texto = document.getElementById("textoAlertaRiegoGeneral");
  if (!box || !texto) return;

  const activo = getRiegoActivo();
  const parcelasControl = getParcelasControl();
  const riegosSemana = getRiegosCampaña().filter(
    item => item.estado === "COMPLETADO" && estaSemana(item.fecha)
  );
  const regadas = [...new Set(riegosSemana.map(item => item.parcela))];
  const pendientes = parcelasControl.filter(p => !regadas.includes(p));

  box.classList.remove("alerta-roja", "alerta-amarilla", "alerta-verde");

  if (activo) {
    box.classList.add("alerta-verde");
    texto.textContent = `🚿 Riego en curso en ${activo.parcela}.`;
    return;
  }

  if (pendientes.length > 0) {
    box.classList.add("alerta-roja");
    texto.textContent = `⚠️ Parcelas pendientes esta semana: ${pendientes.join(", ")}.`;
    return;
  }

  box.classList.add("alerta-verde");
  texto.textContent = "✅ Sin alertas de riego. Todo controlado.";
}

// =====================================
// RESET SOLO RIEGOS
// =====================================
function initResetRiegos() {
  const btn = document.getElementById("btnResetRiegos");
  if (!btn) return;

  btn.addEventListener("click", function () {
    const confirmar = confirm("⚠️ Se borrarán TODOS los riegos. ¿Continuar?");
    if (!confirmar) return;

    localStorage.removeItem(STORAGE_RIEGOS_HUERTA);
    localStorage.removeItem(STORAGE_CHECKS_SEMANA_RIEGO);

    alert("✅ Riegos eliminados");
    location.reload();
  });
}

// =====================================
// RELOJ LOCAL
// =====================================
function initHoraReus() {
  const el = document.getElementById("horaReus");
  if (!el) return;

  function actualizarHora() {
    const ahora = new Date();
    el.textContent = ahora.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  actualizarHora();
  setInterval(actualizarHora, 1000);
}

// =====================================
// METEO / ALERTA AGRÍCOLA
// Igual que el estilo de cuaderno-huerta.js
// =====================================
function descripcionWeatherCode(code, isDay) {
  if (code === 0) return isDay ? "Soleado ☀️" : "Noche despejada 🌙";
  if (code === 1) return isDay ? "Mayormente despejado 🌤️" : "Mayormente despejado 🌙";
  if (code === 2) return isDay ? "Poco nuboso ⛅" : "Poco nuboso 🌙";
  if (code === 3) return "Nublado ☁️";
  if (code === 45 || code === 48) return "Niebla 🌫️";
  if (code === 51 || code === 53 || code === 55) return "Llovizna 🌦️";
  if (code === 56 || code === 57) return "Llovizna helada 🌧️";
  if (code === 61 || code === 63 || code === 65) return "Lluvia 🌧️";
  if (code === 66 || code === 67) return "Lluvia helada 🌧️";
  if (code === 71 || code === 73 || code === 75 || code === 77) return "Nieve ❄️";
  if (code === 80 || code === 81 || code === 82) return "Chubascos 🌦️";
  if (code === 85 || code === 86) return "Chubascos de nieve ❄️";
  if (code === 95) return "Tormenta ⛈️";
  if (code === 96 || code === 99) return "Tormenta con granizo ⛈️";
  return isDay ? "Tiempo estable ☀️" : "Noche estable 🌙";
}

function consejoRiego(lluviaProb, estado) {
  if (estado.includes("Lluvia") || estado.includes("Tormenta")) {
    return { riego: "No regar", consejo: "Hay precipitación o tormenta" };
    }
  if (lluviaProb >= 70) {
    return { riego: "No regar", consejo: "Lluvia muy probable" };
  }
  if (lluviaProb >= 40) {
    return { riego: "Esperar", consejo: "Valora esperar por posible lluvia" };
  }
  return { riego: "Riego normal", consejo: "Sin lluvia relevante ahora" };
}

function actualizarAlertaMeteo(lluvia, estado) {
  const box = document.getElementById("alertaHuerta");
  const texto = document.getElementById("textoAlerta");
  if (!box || !texto) return;

  box.classList.remove("alerta-roja", "alerta-amarilla", "alerta-verde");

  if (estado.includes("Lluvia") || estado.includes("Tormenta") || lluvia >= 70) {
    box.classList.add("alerta-roja");
    texto.textContent = "🚨 NO REGAR - LLUVIA FUERTE";
  } else if (lluvia >= 40) {
    box.classList.add("alerta-amarilla");
    texto.textContent = "⚠️ POSIBLE LLUVIA - VALORAR RIEGO";
  } else {
    box.classList.add("alerta-verde");
    texto.textContent = "✅ CONDICIÓN NORMAL - RIEGO PERMITIDO";
  }
}

function initPronosticoReus() {
  const lat = 41.1561;
  const lon = 1.1069;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current_weather=true&hourly=precipitation_probability&timezone=Europe%2FMadrid`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const current = data.current_weather;
      if (!current) return;

      const temp = current.temperature;
      const code = current.weathercode;
      const isDay = current.is_day === 1;

      let lluvia = 0;
      if (data.hourly && data.hourly.time && data.hourly.precipitation_probability) {
        const idx = data.hourly.time.indexOf(current.time);
        lluvia = idx >= 0
          ? data.hourly.precipitation_probability[idx]
          : (data.hourly.precipitation_probability[0] || 0);
      }

      const estado = descripcionWeatherCode(code, isDay);
      const rec = consejoRiego(lluvia, estado);

      const elTemp = document.getElementById("tempReus");
      const elEstado = document.getElementById("estadoReus");
      const elLluvia = document.getElementById("lluviaReus");
      const elRiego = document.getElementById("riegoReus");
      const elConsejo = document.getElementById("consejoReus");

      if (elTemp) elTemp.textContent = `${temp} °C`;
      if (elEstado) elEstado.textContent = estado;
      if (elLluvia) elLluvia.textContent = `${lluvia} %`;
      if (elRiego) elRiego.textContent = rec.riego;
      if (elConsejo) elConsejo.textContent = rec.consejo;

      actualizarAlertaMeteo(lluvia, estado);
    })
    .catch(err => {
      console.log("Error meteo ❌", err);
    });
}

// =====================================
// INIT
// =====================================
document.addEventListener("DOMContentLoaded", async function () {

  await cargarRiegosDesdeSupabase();

  initFechaPorDefecto();
  renderDatalistParcelas();

  initFormularioRiego();
  initControlSemanal();
  initChecksSemana();
  initResetRiegos();
  cargarParcelasControlTextarea();
  pedirPermisoNotificaciones();

  cargarRiegos();
  actualizarPanelRiego();
  actualizarResumen();
  actualizarInformeSemanal();
  actualizarAlertaGeneral();

  initHoraReus();
  initPronosticoReus();

  // En tiempo real: SOLO panel + celdas restante, no redibujar tabla completa
  setInterval(function () {
    actualizarPanelRiego();
    actualizarResumen();
    actualizarAlertaGeneral();
  }, 1000);

  // Meteo cada 15 min
  setInterval(function () {
    initPronosticoReus();
  }, 15 * 60 * 1000);

});
