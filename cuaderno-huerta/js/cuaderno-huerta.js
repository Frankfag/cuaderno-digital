// =====================================
// CUADERNO HUERTA - COMPLETO
// =====================================

const STORAGE_CULTIVOS = "huerta_cultivos";
const STORAGE_CHECKS = "huerta_checks";
const STORAGE_CAMPAÑA = "campaña_activa";

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
// CAMPAÑA
// =====================================
function getCampaña() {
  return localStorage.getItem(STORAGE_CAMPAÑA) || "2025-2026";
}

function setCampaña(valor) {
  localStorage.setItem(STORAGE_CAMPAÑA, valor);
}

function initSelectorCampaña() {
  const selector = document.getElementById("selectorAñoHuerta");
  const titulo = document.getElementById("tituloHuerta");

  if (!selector) return;

  selector.innerHTML = "";

  for (let i = 2023; i <= 2059; i++) {
    const option = document.createElement("option");
    option.value = `${i}-${i + 1}`;
    option.textContent = `${i}-${i + 1}`;
    selector.appendChild(option);
  }

  selector.value = getCampaña();

  console.log("Campaña Huerta:", getCampaña());

  if (titulo) {
    titulo.textContent = `CUADERNO HUERTA — ${getCampaña()}`;
  }

  selector.addEventListener("change", function () {
    setCampaña(selector.value);

    if (titulo) {
      titulo.textContent = `CUADERNO HUERTA — ${getCampaña()}`;
    }

    cargarChecklist();
    cargarTabla();
    actualizarResumen();
    actualizarAlertaPlagas();
  });
}

// =====================================
// UTILIDADES DE DATOS
// =====================================
function getCultivos() {
  return JSON.parse(localStorage.getItem(STORAGE_CULTIVOS)) || [];
}

function saveCultivos(data) {
  localStorage.setItem(STORAGE_CULTIVOS, JSON.stringify(data));
}

// =====================================
// CARGAR CULTIVOS DESDE SUPABASE
// =====================================
async function cargarCultivosDesdeSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from("cultivos_huerta")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error cargando cultivos desde Supabase:", error);
      return;
    }

    const cultivos = data.map(item => ({
      id: item.id,
      fechaPlantacion: item.fecha_plantacion,
      parcela: item.parcela,
      cultivo: item.cultivo,
      cultivoId: item.cultivo_id,
      variedad: item.variedad || "",
      superficie: item.superficie || "",
      riego: item.riego || "",
      diasCosecha: item.dias_cosecha || "",
      fechaCosecha: item.fecha_cosecha,
      familia: item.familia || "",
      notas: item.notas || "",
      campaña: item.campaña || getCampaña(),
      cosechado: item.cosechado || false,
      checklist: item.checklist || {
        riego: false,
        abonado: false,
        plagas: false
      }
    }));

    saveCultivos(cultivos);

    console.log("Cultivos cargados desde Supabase:", cultivos.length);

  } catch (err) {
    console.error("Error general cargando Supabase:", err);
  }
}

function formatearFechaISO(fechaISO) {
  if (!fechaISO) return "";
  const partes = fechaISO.split("-");
  if (partes.length !== 3) return fechaISO;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function sumarDias(fechaISO, dias) {
  if (!fechaISO || !dias) return "";

  const fecha = new Date(fechaISO + "T00:00:00");
  fecha.setDate(fecha.getDate() + Number(dias));

  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

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

// =====================================
// CHECKLIST POR CULTIVO
// =====================================
function normalizarChecklistCultivos() {
  const datos = getCultivos().map(function (item) {
    if (!item.checklist) {
      item.checklist = {
        riego: false,
        abonado: false,
        plagas: false,
        
      };
    } else {
      if (typeof item.checklist.riego === "undefined") item.checklist.riego = false;
      if (typeof item.checklist.abonado === "undefined") item.checklist.abonado = false;
      if (typeof item.checklist.plagas === "undefined") item.checklist.plagas = false;
      
    }

    return item;
  });

  saveCultivos(datos);
}

window.toggleCheck = function (id, tipo, el) {
  const valor = el.checked;

  const datos = getCultivos().map(function (item) {
    if (Number(item.id) === Number(id)) {
      if (!item.checklist) {
        item.checklist = {
          riego: false,
          abonado: false,
          plagas: false,
          
        };
      }

      item.checklist[tipo] = valor;
    }

    return item;
  });

  saveCultivos(datos);
  cargarTabla();
  actualizarAlertaPlagas();
};

function claseCheck(valor) {
  return valor ? "check-ok" : "check-ko";
}

function contarChecksCultivo(item) {
  if (!item.checklist) return 0;

  let total = 0;
  if (item.checklist.riego) total++;
  if (item.checklist.abonado) total++;
  if (item.checklist.plagas) total++;
  

  return total;
}

function resumenChecklist(item) {
  const total = contarChecksCultivo(item);

  if (total === 4) {
    return {
      texto: "🟢 Checklist completo",
      clase: "check-resumen-ok"
    };
  }

  if (total >= 2) {
    return {
      texto: "🟡 Checklist parcial",
      clase: "check-resumen-medio"
    };
  }

  return {
    texto: "🔴 Checklist pendiente",
    clase: "check-resumen-mal"
  };
}

// =====================================
// BASE DE DATOS DE CULTIVOS
// =====================================

const CULTIVOS_DB = {
  tomate_montserrat: { nombre: "Tomate Montserrat", dias: 125, familia: "Solanáceas" },
  tomate_cordebou: { nombre: "Tomate Cor de Bou", dias: 120, familia: "Solanáceas" },
  tomate_penjar: { nombre: "Tomate de Penjar", dias: 130, familia: "Solanáceas" },
  tomate_cherry: { nombre: "Tomate Cherry", dias: 95, familia: "Solanáceas" },

  pimientos: { nombre: "Pimiento", dias: 140, familia: "Solanáceas" },
  patatas: { nombre: "Patatas", dias: 110, familia: "Solanáceas" },

  calabacin: { nombre: "Calabacín", dias: 50, familia: "Cucurbitáceas" },
  pepino: { nombre: "Pepino", dias: 60, familia: "Cucurbitáceas" },

  col: { nombre: "Col", dias: 130, familia: "Crucíferas" },
  coliflor: { nombre: "Coliflor", dias: 140, familia: "Crucíferas" },

  cebolla: { nombre: "Cebolla / Calçot", dias: 160, familia: "Aliáceas" },
  puerro: { nombre: "Puerro", dias: 130, familia: "Aliáceas" },

  habas: { nombre: "Habas", dias: 150, familia: "Leguminosas" },
  guisantes: { nombre: "Guisantes", dias: 120, familia: "Leguminosas" },

  lechuga_romana: { nombre: "Lechuga Romana", dias: 65, familia: "Hojas" },
  lechuga_maravilla: { nombre: "Lechuga Maravilla", dias: 60, familia: "Hojas" },
  lechuga_trocadero: { nombre: "Lechuga Trocadero", dias: 55, familia: "Hojas" },
  acelga: { nombre: "Acelga", dias: 60, familia: "Hojas" },

  rabano: { nombre: "Rábano", dias: 30, familia: "Raíces" },

  alcachofas: { nombre: "Alcachofas", dias: 150, familia: "Compuestas" }
};


// =====================================
// FECHA PREVISTA AUTOMÁTICA DE COSECHA
// =====================================

function actualizarAutoCosecha() {
  const cultivoId = document.getElementById("hCultivo")?.value || "";
  const fechaPlantacion = document.getElementById("hFechaPlantacion")?.value || "";

  if (!cultivoId || !fechaPlantacion) {
    const campo = document.getElementById("hFechaCosecha");
    if (campo) campo.value = "";
    return;
  }

  const cultivo = CULTIVOS_DB[cultivoId];
  if (!cultivo) {
    const campo = document.getElementById("hFechaCosecha");
    if (campo) campo.value = "";
    return;
  }

  const inicio = new Date(fechaPlantacion);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + cultivo.dias);

  const campoFechaCosecha = document.getElementById("hFechaCosecha");
  if (campoFechaCosecha) {
    campoFechaCosecha.value = fin.toISOString().split("T")[0];
  }
}

function initFechaAutomatica() {
  const cultivo = document.getElementById("hCultivo");
  const fecha = document.getElementById("hFechaPlantacion");

  if (cultivo) {
    cultivo.addEventListener("change", actualizarAutoCosecha);
  }

  if (fecha) {
    fecha.addEventListener("change", actualizarAutoCosecha);
  }
  // Poner la fecha de hoy al abrir
  if (fecha && !fecha.value) {
    fecha.value = new Date().toISOString().split("T")[0];
    actualizarAutoCosecha();
  }
}


// =====================================
// FORMULARIO PRINCIPAL + ROTACIÓN
// =====================================

function initFormulario() {
  const form = document.getElementById("formHuerta");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fechaPlantacion = document.getElementById("hFechaPlantacion")?.value || "";
    const parcela = document.getElementById("hParcela")?.value?.trim?.() || "";
    const cultivoId = document.getElementById("hCultivo")?.value || "";
    const variedad = document.getElementById("hVariedad")?.value?.trim?.() || "";
    const superficie = document.getElementById("hSuperficie")?.value?.trim?.() || "";
    const riego = document.getElementById("hRiego")?.value || "";
    const fechaCosecha = document.getElementById("hFechaCosecha")?.value || "";
    const notas = document.getElementById("hNotas")?.value?.trim?.() || "";

    if (!fechaPlantacion || !parcela || !cultivoId || !fechaCosecha) {
      alert("Completa fecha de plantación, parcela, cultivo y asegúrate de que la fecha de cosecha se haya calculado.");
      return;
    }

    const cultivoInfo = CULTIVOS_DB[cultivoId];
    if (!cultivoInfo) {
      alert("No se ha encontrado la información del cultivo seleccionado.");
      return;
    }

    const diasCosecha = cultivoInfo.dias;
    const familia = cultivoInfo.familia;
    const cultivoNombre = cultivoInfo.nombre;

    const datos = getCultivos();

    // =====================================
    // ALERTA DE ROTACIÓN POR FAMILIA
    // =====================================
    const ultimo = datos
      .filter(item => (item.parcela || "").trim() === parcela)
      .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))[0];

    if (ultimo) {
      const familiaAnterior = ultimo.familia || "";
      const familiaActual = familia || "";
      console.log("Cultivo guardado en Supabase");
      if (familiaAnterior && familiaActual && familiaAnterior === familiaActual) {
        const continuar = confirm(
          `⚠️ ALERTA DE ROTACIÓN\n\n` +
          `Parcela: ${parcela}\n` +
          `Último cultivo: ${ultimo.cultivo}\n` +
          `Familia anterior: ${familiaAnterior}\n` +
          `Nuevo cultivo: ${cultivoNombre}\n` +
          `Familia nueva: ${familiaActual}\n\n` +
          `No es recomendable repetir la misma familia en la misma parcela porque favorece plagas, hongos y agotamiento del suelo.\n\n` +
          `¿Quieres guardar igualmente?`
        );

        if (!continuar) return;
      }
    }

    // =====================================
    // REGISTRO FINAL
    // =====================================
    const registro = {
      id: Date.now(),
      fechaPlantacion,
      parcela,
      cultivo: cultivoNombre,
      cultivoId,
      variedad,
      superficie,
      riego,
      diasCosecha,
      fechaCosecha,
      familia,
      notas,
      campaña: getCampaña(),
      cosechado: false,
      checklist: {
        riego: false,
        abonado: false,
        plagas: false,
        
      }
    };

    datos.push(registro);
    saveCultivos(datos);


// =====================================
    // SUPABASE
    // =====================================
    supabaseClient
  .from("cultivos_huerta")
  .insert({
    id: registro.id,
    fecha_plantacion: registro.fechaPlantacion,
    parcela: registro.parcela,
    cultivo: registro.cultivo,
    cultivo_id: registro.cultivoId,
    variedad: registro.variedad,
    superficie: registro.superficie || null,
    familia: registro.familia,
    riego: registro.riego,
    dias_cosecha: registro.diasCosecha,
    fecha_cosecha: registro.fechaCosecha,
    notas: registro.notas,
    campaña: registro.campaña,
    cosechado: registro.cosechado,
    checklist: registro.checklist
  })
  .then(({ error }) => {
    if (error) {
      console.error("Error Supabase:", error);
    } else {
      console.log("Cultivo guardado en Supabase");
    }
  });

    form.reset();
    const campoFechaCosecha = document.getElementById("hFechaCosecha");
    if (campoFechaCosecha) campoFechaCosecha.value = "";

    cargarTabla();
    actualizarResumen();
    actualizarAlertaPlagas();
  });
}


// =====================================
// FILTROS
// =====================================
function getFiltros() {
  const parcela = document.getElementById("filtroParcelaHuerta")?.value || "";
  const cultivo = document.getElementById("filtroCultivoHuerta")?.value || "";
  const estado = document.getElementById("filtroEstadoHuerta")?.value || "TODOS";

  return {
    parcela: parcela.trim().toLowerCase(),
    cultivo: cultivo.trim().toLowerCase(),
    estado: estado
  };
}

function initFiltros() {
  ["filtroParcelaHuerta", "filtroCultivoHuerta", "filtroEstadoHuerta"].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("input", cargarTabla);
    el.addEventListener("change", cargarTabla);
  });
}


// TABLA (CORREGIDA, LIMPIA Y ALINEADA)
// =====================================
function cargarTabla() {
   
  const tbody = document.getElementById("tablaHuertaBody");
  if (!tbody) return;

  const campaña = getCampaña();
  const filtros = getFiltros();

  let datos = getCultivos().filter(function (item) {
    return item.campaña === campaña;
  });

  datos = datos.filter(function (item) {
    const estado = calcularEstado(item.fechaCosecha, item.cosechado);

    const okParcela =
      !filtros.parcela || (item.parcela || "").toLowerCase().includes(filtros.parcela);

    const okCultivo =
      !filtros.cultivo || (item.cultivo || "").toLowerCase().includes(filtros.cultivo);

    const okEstado =
      filtros.estado === "TODOS" || estado === filtros.estado;

    return okParcela && okCultivo && okEstado;
  });

  tbody.innerHTML = "";

  if (datos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center;">No hay registros en esta campaña.</td>
      </tr>
    `;
    return;
  }

  datos
    .slice()
    .reverse()
    .forEach(function (item) {
      const estado = calcularEstado(item.fechaCosecha, item.cosechado);

      const resumenCheck = resumenChecklist(item);
      const claseRiego = claseCheck(item.checklist?.riego);
      const claseAbonado = claseCheck(item.checklist?.abonado);
      const clasePlagas = claseCheck(item.checklist?.plagas);
      const claseEstado = claseCheck(item.checklist?.estado);

      const tr = document.createElement("tr");

      // 💡 AQUÍ ESTÁ EL AJUSTE: Eliminamos las columnas viejas y ordenamos las celdas
            tr.innerHTML = `
        <!-- 1 -->
        <td>${formatearFechaISO(item.fechaPlantacion)}</td>
        <!-- 2 -->
        <td>${item.parcela || ""}</td>
        <!-- 3 -->
        <td>
          <strong>${item.cultivo || ""}</strong>
          ${item.variedad ? `<br><small style="color: #a0a0a0; font-size: 11px;">${item.variedad}</small>` : ''}
        </td>
        <!-- 4 -->
        <td>${item.diasCosecha || ""}</td>
        <!-- 5 -->
        <td>${formatearFechaISO(item.fechaCosecha)}</td>
        <!-- 6 -->
        <td><span class="badge-${estado.toLowerCase()}">${estado}</span></td>
        <!-- 7 -->
        <td>${item.notas || ""}</td>

        <!-- 8. Celda del Checklist -->
        <td style="vertical-align: middle; padding: 6px; text-align: center; width: 220px;">
          <div class="checklist-cultivo" style="display: block; margin: 0 auto; max-width: 200px;">
            <label class="check-item ${claseRiego}" style="display: block; margin: 2px 0; padding: 3px 6px; font-size: 11px; text-align: left;">
              <input type="checkbox" onchange="toggleCheck(${item.id}, 'riego', this)" ${item.checklist?.riego ? "checked" : ""}> 💧 Riego
            </label>
            <label class="check-item ${claseAbonado}" style="display: block; margin: 2px 0; padding: 3px 6px; font-size: 11px; text-align: left;">
              <input type="checkbox" onchange="toggleCheck(${item.id}, 'abonado', this)" ${item.checklist?.abonado ? "checked" : ""}> 🌿 Abono
            </label>
            <label class="check-item ${clasePlagas}" style="display: block; margin: 2px 0; padding: 3px 6px; font-size: 11px; text-align: left;">
              <input type="checkbox" onchange="toggleCheck(${item.id}, 'plagas', this)" ${item.checklist?.plagas ? "checked" : ""}> 🐛 Plagas
            
            <span class="check-resumen ${resumenCheck.clase}" style="font-size: 10px; margin-top: 4px; padding: 2px 4px; display: block;">
              ${resumenCheck.texto}
            </span>
          </div>
        </td>

        <!-- 9. Celda de Acción (Forzada como columna final limpia) -->
        <td style="vertical-align: middle; text-align: center; padding: 6px; width: 140px; min-width: 140px;">
          <button class="boton" onclick="marcarCosechado(${item.id})" style="display: block !important; width: 110px !important; margin: 4px auto !important; padding: 5px 0 !important; font-size: 18px !important;">Cosechado</button>
          <button class="boton" onclick="desmarcarCosechado(${item.id})" style="display: block !important; width: 110px !important; margin: 4px auto !important; padding: 5px 0 !important; font-size: 18px !important;">Desmarcar</button>
          <button class="boton boton-eliminar" onclick="borrarCultivo(${item.id})" style="display: block !important; width: 110px !important; margin: 4px auto !important; padding: 5px 0 !important; font-size: 11px !important;">🗑️ Eliminar</button>
        </td>
      `;


      



      



      tbody.appendChild(tr);
    });
}


// =====================================
// ACCIONES CULTIVO
// =====================================
window.marcarCosechado = function (id) {
  const datos = getCultivos().map(function (item) {
    if (Number(item.id) === Number(id)) {
      item.cosechado = true;
    }
    return item;
  });

  saveCultivos(datos);
  cargarTabla();
  actualizarResumen();
};

window.desmarcarCosechado = function (id) {
  const datos = getCultivos().map(function (item) {
    if (Number(item.id) === Number(id)) {
      item.cosechado = false;
    }
    return item;
  });

  saveCultivos(datos);
  cargarTabla();
  actualizarResumen();
};

window.borrarCultivo = function (id) {
  const datos = getCultivos().filter(function (item) {
    return Number(item.id) !== Number(id);
  });

  saveCultivos(datos);
  cargarTabla();
  actualizarResumen();
  actualizarAlertaPlagas();
};


// =====================================
// RESUMEN
// =====================================
function actualizarResumen() {
  const campaña = getCampaña();
  const datos = getCultivos().filter(function (item) {
    return item.campaña === campaña;
  });

  const totalCultivos = datos.length;
  const proximas = datos.filter(function (item) {
    return calcularEstado(item.fechaCosecha, item.cosechado) === "PROXIMO";
  }).length;

  const listos = datos.filter(function (item) {
    return calcularEstado(item.fechaCosecha, item.cosechado) === "LISTO";
  }).length;

  const totalCultivosEl = document.getElementById("totalCultivos");
  const proximasEl = document.getElementById("proximasCosechas");
  const listosEl = document.getElementById("listosCosechar");

  if (totalCultivosEl) totalCultivosEl.textContent = totalCultivos;
  if (proximasEl) proximasEl.textContent = proximas;
  if (listosEl) listosEl.textContent = listos;
}


// =====================================
// CHECKLIST GENERAL DE CAMPAÑA
// =====================================
function getChecklistKey() {
  return "huerta_checks_" + getCampaña();
}

function cargarChecklist() {
  const datos = JSON.parse(localStorage.getItem(getChecklistKey())) || {};

  document.querySelectorAll("[data-check]").forEach(function (chk) {
    const key = chk.getAttribute("data-check");
    chk.checked = datos[key] === true;

    chk.onchange = function () {
      const actual = JSON.parse(localStorage.getItem(getChecklistKey())) || {};
      actual[key] = chk.checked;
      localStorage.setItem(getChecklistKey(), JSON.stringify(actual));
    };
  });
}


// =====================================
// ALERTA DE PLAGAS
// =====================================
function actualizarAlertaPlagas() {
  const box = document.getElementById("alertaPlagas");
  const texto = document.getElementById("textoAlertaPlagas");

  if (!box || !texto) return;

  const cultivos = getCultivos().filter(item => item.campaña === getCampaña());
  const pendientes = cultivos.filter(item => !item.checklist?.plagas);

  box.classList.remove("alerta-roja", "alerta-amarilla", "alerta-verde");

  if (pendientes.length === 0) {
    box.classList.add("alerta-verde");
    texto.textContent = "✅ Todos los Checklist de los Cultivos Revisado";
    return;
  }

  const nombres = pendientes
    .slice(0, 3)
    .map(item => `${item.cultivo} (${item.parcela})`)
    .join(", ");

  if (pendientes.length <= 2) {
    box.classList.add("alerta-amarilla");
    texto.textContent = `⚠️ Control de Rutina en ${pendientes.length} cultivo(s): ${nombres}`;
    return;
  }

  box.classList.add("alerta-roja");
  texto.textContent = `🚨 Control de rutinas pendiente en ${pendientes.length} cultivos. Ejemplos: ${nombres}`;
}


// =====================================
// IMPRIMIR
// =====================================
function initPrint() {
  const btn = document.getElementById("btnPrintHuerta");
  if (btn) {
    btn.onclick = function () {
      window.print();
    };
  }
}


// =====================================
// EXPORTAR CSV
// =====================================
function initExport() {
  const btn = document.getElementById("btnExportHuerta");
  if (!btn) return;

  btn.onclick = function () {
    const campaña = getCampaña();
    const datos = getCultivos().filter(function (item) {
      return item.campaña === campaña;
    });

    let csv = "Fecha plantacion;Parcela;Cultivo;Variedad;Superficie;Riego;Dias hasta cosecha;Fecha cosecha;Estado;Notas;Check Riego;Check Abonado;Check Plagas;Check Estado\n";

    datos.forEach(function (item) {
      const estado = calcularEstado(item.fechaCosecha, item.cosechado);

      csv += [
        item.fechaPlantacion,
        item.parcela,
        item.cultivo,
        item.variedad || "",
        item.superficie || "",
        item.riego || "",
        item.diasCosecha || "",
        item.fechaCosecha || "",
        estado,
        (item.notas || "").replace(/;/g, ","),
        item.checklist?.riego ? "SI" : "NO",
        item.checklist?.abonado ? "SI" : "NO",
        item.checklist?.plagas ? "SI" : "NO",
        item.checklist?.estado ? "SI" : "NO"
      ].join(";") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cuaderno_huerta_${campaña}.csv`;
    a.click();
  };
}


// =====================================
// HORA REAL
// =====================================
function initHoraReus() {
  const el = document.getElementById("horaReus");
  if (!el) return;

  function actualizarHora() {
    const ahora = new Date();

    const hora = ahora.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    el.textContent = hora;
  }

  actualizarHora();
  setInterval(actualizarHora, 1000);
}


// =====================================
// ALERTA AGRÍCOLA METEO
// =====================================
function actualizarAlerta(lluvia, estado) {
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
    texto.textContent =
  "✅ CALOR A REGA OK";
  }
}


// =====================================
// PRONÓSTICO REAL DE REUS
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
    return {
      riego: "No regar",
      consejo: "Hay precipitación o tormenta"
    };
  }

  if (lluviaProb >= 70) {
    return {
      riego: "No regar",
      consejo: "Lluvia muy probable"
    };
  }

  if (lluviaProb >= 40) {
    return {
      riego: "Esperar",
      consejo: "Valora esperar por posible lluvia"
    };
  }

  return {
    riego: "Riego normal",
    consejo: "Sin lluvia relevante ahora"
  };
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

      if (
        data.hourly &&
        data.hourly.time &&
        data.hourly.precipitation_probability
      ) {
        const idx = data.hourly.time.indexOf(current.time);

        if (idx >= 0) {
          lluvia = data.hourly.precipitation_probability[idx];
        } else {
          lluvia = data.hourly.precipitation_probability[0] || 0;
        }
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

      actualizarAlerta(lluvia, estado);
    })
    .catch(err => {
      console.log("Error meteo ❌", err);
    });
}


// =====================================
// RADAR / MAPA REUS FIJO
// =====================================
function initRadar() {
  const contenedor = document.getElementById("mapRadarHuerta");
  if (!contenedor) return;

  if (typeof L === "undefined") {
    console.log("Leaflet no está cargado");
    return;
  }

  const map = L.map("mapRadarHuerta").setView([41.1561, 1.1069], 10);

  map.dragging.disable();
  map.scrollWheelZoom.disable();
  map.doubleClickZoom.disable();
  map.touchZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  L.marker([41.1561, 1.1069])
    .addTo(map)
    .bindPopup("Reus (Tarragona)")
    .openPopup();

  setTimeout(() => {
    map.invalidateSize();
  }, 300);
}


// =====================================
// RESET TOTAL
// =====================================
function initResetHuerta() {
  const btn = document.getElementById("btnResetHuerta");
  if (!btn) return;

  btn.addEventListener("click", function () {
    const confirmar = confirm(
      "⚠️ ATENCIÓN\n\nSe borrarán TODOS los datos de la huerta.\nEsta acción NO se puede deshacer.\n\n¿Continuar?"
    );

    if (!confirmar) return;

    localStorage.removeItem("huerta_cultivos");
    localStorage.removeItem("huerta_labores");
    localStorage.removeItem("huerta_riegos");
    localStorage.removeItem("huerta_abonos");
    localStorage.removeItem("huerta_cosechas");
    localStorage.removeItem("huerta_checks");
    localStorage.removeItem("huerta_checks_" + getCampaña());

    alert("✅ Datos eliminados");
    location.reload();
  });
}


// =====================================
// INICIO
// =====================================
document.addEventListener("DOMContentLoaded", async function () {
  console.log("JS huerta cargado ✅");

  // initMenuLinks(); // <-- COMENTADO PARA EVITAR QUE SE DETENGA EL SCRIPT 
  initSelectorCampaña();
  initFechaAutomatica();
  initFormulario();
  initFiltros();
  initPrint();
  initExport();
  initResetHuerta();

  await cargarCultivosDesdeSupabase();

  normalizarChecklistCultivos();

  cargarChecklist();
  cargarTabla();
  actualizarResumen();
  actualizarAlertaPlagas();

  try {
    initHoraReus();
    initPronosticoReus();
  } catch (e) {
    console.log("Error meteo/agro ❌", e);
  }

  try {
    initRadar();
  } catch (e) {
    console.log("Error radar ❌", e);
  }
});

// NUEVO: Funciones añadidas aquí para que el menú hamburguesa funcione a la perfección
function toggleMenu() {
  const menu = document.getElementById("menuLateral");
  if (menu) {
    menu.classList.toggle("activo"); // Usa 'activo' igual que tu CSS
  }
}

// Escucha los clics en toda la página para cerrar el menú si haces clic fuera
document.addEventListener("click", function(event) {
  const menu = document.getElementById("menuLateral");
  const boton = document.querySelector(".boton-menu");

  // Si el menú existe y está abierto (tiene la clase 'activo')
  if (menu && menu.classList.contains("activo")) {
    // Si el clic NO fue dentro del menú ni en el botón de la hamburguesa, se cierra solo
    if (!menu.contains(event.target) && (!boton || !boton.contains(event.target))) {
      menu.classList.remove("activo");
    }
  }
});

// ========================================================
// REPARADOR DE COLUMNAS: SEPARA BOTONES DE ACCIÓN A SU SITIO
// ========================================================
const originalCargarTabla = cargarTabla;
cargarTabla = function() {
  // 1. Ejecuta primero tu función original intacta (tiempo, datos, filtros...)
  originalCargarTabla();
  
  // 2. Buscamos todas las filas generadas en el histórico
  const filas = document.querySelectorAll("#tablaHuertaBody tr");
  
  filas.forEach(tr => {
    // Si la fila ya tiene 9 celdas, no hacemos nada
    if (tr.cells.length >= 9) return;
    
    // Buscamos la celda del checklist (la número 8, índice 7)
    const celdaChecklist = tr.cells[7] || tr.querySelector(".checklist-cultivo");
    if (!celdaChecklist) return;
    
    // Buscamos todos los botones que estén atrapados dentro de esa celda
    const botones = celdaChecklist.querySelectorAll("button");
    
    if (botones.length > 0) {
      // Creamos una nueva celda física real para las Acciones
      const nuevaCeldaAccion = document.createElement("td");
      nuevaCeldaAccion.style.verticalAlign = "middle";
      nuevaCeldaAccion.style.textAlign = "center";
      nuevaCeldaAccion.style.padding = "10px";
      
      // Creamos el contenedor vertical para los botones
      const contenedorBotones = document.createElement("div");
      contenedorBotones.style.display = "flex";
      contenedorBotones.style.flexDirection = "column";
      contenedorBotones.style.gap = "6px";
      contenedorBotones.style.alignItems = "center";
      contenedorBotones.style.justifyContent = "center";
      contenedorBotones.style.width = "100%";
      
      // Estilizamos cada botón para que sea compacto y plano
      botones.forEach(btn => {
        btn.style.display = "block";
        btn.style.width = "110px";
        btn.style.margin = "0 auto";
        btn.style.padding = "5px 0";
        btn.style.fontSize = "11px";
        btn.style.boxSizing = "border-box";
        
        // Mudamos el botón del checklist al nuevo contenedor
        contenedorBotones.appendChild(btn);
      });
      
      // Metemos el contenedor en la nueva celda y la añadimos a la fila
      nuevaCeldaAccion.appendChild(contenedorBotones);
      tr.appendChild(nuevaCeldaAccion);
    }
  });
};

