// =========================================================
// CONTROL OLIVAS V2 · JS LIMPIO Y COMENTADO
// =========================================================

// =========================================================
// 1. STORAGE
// =========================================================
const STORAGE_CAMPAÑA = "campaña_activa";
const STORAGE_CLIENTES = "olivas_clientes_v2";
const STORAGE_VIAJES = "olivas_viajes_v2";
const STORAGE_PARAMS = "olivas_parametros_v2";
const STORAGE_REGISTROS_TOTALES = "STORAGE_REGISTROS";

// =========================================================
// 2. LOGIN
// =========================================================
if (localStorage.getItem("login_ok") !== "true") {
  window.location.replace("login.html");
}

// =========================================================
// 3. MENÚ HAMBURGUESA
// =========================================================
function initMenuMovil() {
  const btnMenu = document.getElementById("btnMenu");
  const sidebar = document.getElementById("sidebar");

  if (!btnMenu || !sidebar) return;

  btnMenu.addEventListener("click", function (e) {
    e.stopPropagation();
    sidebar.classList.toggle("activo");
  });

  document.addEventListener("click", function (e) {
    if (!sidebar.contains(e.target) && e.target !== btnMenu) {
      sidebar.classList.remove("activo");
    }
  });

  sidebar.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      sidebar.classList.remove("activo");
    });
  });
}

// =========================================================
// 4. CAMPAÑA
// =========================================================
function campañaPorDefecto() {
  const year = new Date().getFullYear();
  return `${year}-${year + 1}`;
}

function getCampañaActiva() {
  return localStorage.getItem(STORAGE_CAMPAÑA) || campañaPorDefecto();
}

function setCampañaActiva(valor) {
  localStorage.setItem(STORAGE_CAMPAÑA, valor);
}

function generarCampañas() {
  const campañas = [];
  for (let año = 2024; año <= 2059; año++) {
    campañas.push(`${año}-${año + 1}`);
  }
  return campañas;
}

function initSelectorCampaña() {
  const selector = document.getElementById("selectorAño");
  const titulo = document.getElementById("tituloCampaña");
  if (!selector) return;

  selector.innerHTML = "";
  const campañas = generarCampañas();
  const activa = getCampañaActiva();

  campañas.forEach(camp => {
    const opt = document.createElement("option");
    opt.value = camp;
    opt.textContent = camp;
    if (camp === activa) opt.selected = true;
    selector.appendChild(opt);
  });

  if (titulo) {
    titulo.textContent = `Control de Olivas — Campaña ${activa}`;
  }

  selector.addEventListener("change", () => {
    setCampañaActiva(selector.value);
    if (titulo) {
      titulo.textContent = `Control de Olivas — Campaña ${selector.value}`;
    }
    renderTodo();
  });
}

// =========================================================
// 5. UTILIDADES
// =========================================================
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getEl(id) {
  return document.getElementById(id);
}

function formatoFechaISO(fechaISO) {
  if (!fechaISO) return "";
  const partes = fechaISO.split("-");
  if (partes.length !== 3) return fechaISO;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

function euros(n) {
  return `${Number(n || 0).toFixed(2).replace(".", ",")} €`;
}

function kilos(n) {
  return `${Number(n || 0).toFixed(2).replace(".", ",")} kg`;
}

function litros(n) {
  return `${Number(n || 0).toFixed(2).replace(".", ",")} L`;
}

function numero(n) {
  return Number(n || 0);
}

// =========================================================
// 6. PARÁMETROS REALES PERO EDITABLES
// ---------------------------------------------------------
// Valores por defecto:
// - Rendimiento graso ........... 15,82 %
// - Precio grano cooperativa .... 0,80 €/kg
// - Coste prensado .............. 0,24 €/kg
// - Coste garrafa unidad ........ 1,60 €
// =========================================================
function getParametrosPorDefecto() {
  return {
    rendimiento: 15.82,
    precioVentaGrano: 0.80,
    precioPrensada: 0.24,
    costeEnvasado: 1.60
  };
}

function getParametros() {
  return {
    ...getParametrosPorDefecto(),
    ...(JSON.parse(localStorage.getItem(STORAGE_PARAMS)) || {})
  };
}

function saveParametros(params) {
  localStorage.setItem(STORAGE_PARAMS, JSON.stringify(params));
}

function cargarParametrosEnInputs() {
  const params = getParametros();

  const inputRendimiento = getEl("rendimiento");
  const inputPrecioVentaGrano = getEl("precioVentaGrano");
  const inputPrecioPrensada = getEl("precioPrensada");
  const inputCosteEnvasado = getEl("costeEnvasado");

  if (inputRendimiento) inputRendimiento.value = params.rendimiento;
  if (inputPrecioVentaGrano) inputPrecioVentaGrano.value = params.precioVentaGrano;
  if (inputPrecioPrensada) inputPrecioPrensada.value = params.precioPrensada;
  if (inputCosteEnvasado) inputCosteEnvasado.value = params.costeEnvasado;
}

function leerParametrosDesdeInputs() {
  return {
    rendimiento: Number(getEl("rendimiento")?.value || getParametrosPorDefecto().rendimiento),
    precioVentaGrano: Number(getEl("precioVentaGrano")?.value || getParametrosPorDefecto().precioVentaGrano),
    precioPrensada: Number(getEl("precioPrensada")?.value || getParametrosPorDefecto().precioPrensada),
    costeEnvasado: Number(getEl("costeEnvasado")?.value || getParametrosPorDefecto().costeEnvasado)
  };
}

function initParametros() {
  cargarParametrosEnInputs();

  ["rendimiento", "precioVentaGrano", "precioPrensada", "costeEnvasado"].forEach(id => {
    const el = getEl(id);
    if (!el) return;

    const guardar = () => {
      saveParametros(leerParametrosDesdeInputs());
      renderTodo();
    };

    el.addEventListener("change", guardar);
    el.addEventListener("input", guardar);
  });

  const btnResetParams = getEl("resetParams");
  if (btnResetParams) {
    btnResetParams.addEventListener("click", function () {
      const ok = confirm("¿Resetear parámetros a los valores reales por defecto?");
      if (!ok) return;

      saveParametros(getParametrosPorDefecto());
      cargarParametrosEnInputs();
      renderTodo();
    });
  }
}

// =========================================================
// 7. DATOS REALES DE COSECHA DESDE TOTALES.HTML
// ---------------------------------------------------------
// Fuente real:
// localStorage.getItem("STORAGE_REGISTROS")
// filtrado por campaña activa
// =========================================================
function getRegistrosCosechaCampaña() {
  const campañaActiva = getCampañaActiva();

  const todosLosRegistros = JSON.parse(localStorage.getItem(STORAGE_REGISTROS_TOTALES)) || [];

  // Limpieza igual que en totales.html:
  const registrosLimpios = todosLosRegistros.filter(reg =>
    reg &&
    reg.parada &&
    String(reg.parada).trim() !== "" &&
    parseFloat(reg.kilos) > 0
  );

  return registrosLimpios.filter(reg => reg.campaña === campañaActiva);
}

function getTotalCosechaCampañaKg() {
  const registros = getRegistrosCosechaCampaña();
  return registros.reduce((acc, reg) => acc + numero(reg.kilos), 0);
}

// =========================================================
// 8. CLIENTES
// =========================================================
function getClientesCampaña() {
  return getData(STORAGE_CLIENTES).filter(item => item.campaña === getCampañaActiva());
}

function addCliente() {
  const cliente = getEl("clienteNombre")?.value.trim() || "";
  const garrafas = numero(getEl("clienteBotellas")?.value);
  const precio = numero(getEl("clientePrecio")?.value);
  const cobro = getEl("clienteEstadoCobro")?.value || "Pendiente";
  const notas = getEl("clienteNotas")?.value.trim() || "";

  if (!cliente || garrafas <= 0 || precio <= 0) {
    alert("Completa Cliente, Garrafas y Precio por garrafa.");
    return;
  }

  const litrosVendidos = garrafas * 5;
  const total = garrafas * precio;

  const item = {
    id: Date.now(),
    cliente,
    garrafas,
    litros: litrosVendidos,
    precio,
    total,
    cobro,
    notas,
    campaña: getCampañaActiva()
  };

  const datos = getData(STORAGE_CLIENTES);
  datos.push(item);
  saveData(STORAGE_CLIENTES, datos);

  limpiarFormularioCliente();
  renderTodo();
}

function limpiarFormularioCliente() {
  if (getEl("clienteNombre")) getEl("clienteNombre").value = "";
  if (getEl("clienteBotellas")) getEl("clienteBotellas").value = "";
  if (getEl("clientePrecio")) getEl("clientePrecio").value = "";
  if (getEl("clienteEstadoCobro")) getEl("clienteEstadoCobro").value = "Pendiente";
  if (getEl("clienteNotas")) getEl("clienteNotas").value = "";
}

function borrarCliente(id) {
  const ok = confirm("¿Quieres borrar este cliente?");
  if (!ok) return;

  const datos = getData(STORAGE_CLIENTES).filter(item => item.id !== id);
  saveData(STORAGE_CLIENTES, datos);
  renderTodo();
}

function renderClientes() {
  const tbody = document.querySelector("#tablaClientes tbody");
  if (!tbody) return;

  const clientes = getClientesCampaña();
  tbody.innerHTML = "";

  if (clientes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;">Sin clientes registrados</td>
      </tr>
    `;
    return;
  }

  clientes
    .slice()
    .reverse()
    .forEach(item => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.cliente}</td>
        <td>${item.garrafas}</td>
        <td>${litros(item.litros)}</td>
        <td>${euros(item.precio)}</td>
        <td>${euros(item.total)}</td>
        <td>${item.cobro}</td>
        <td>${item.notas || ""}</td>
        <td class="ocultar-print">
          <button type="button" class="boton boton--peligro" onclick="borrarCliente(${item.id})">Eliminar</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
}

// =========================================================
// 9. VIAJES
// =========================================================
function getViajesCampaña() {
  return getData(STORAGE_VIAJES).filter(item => item.campaña === getCampañaActiva());
}

function textoDestino(valor) {
  return valor === "aceite" ? "Molino / aceite" : "Cooperativa (oliva en grano)";
}

function addViaje() {
  const fecha = getEl("fechaViaje")?.value || "";
  const kg = numero(getEl("kgViaje")?.value);
  const destino = getEl("tipoViaje")?.value || "grano";
  const referencia = getEl("referenciaViaje")?.value.trim() || "";
  const observaciones = getEl("observacionesViaje")?.value.trim() || "";

  if (!fecha || kg <= 0) {
    alert("Completa Fecha y Kilos.");
    return;
  }

  const item = {
    id: Date.now(),
    fecha,
    destino,
    kg,
    referencia,
    observaciones,
    campaña: getCampañaActiva()
  };

  const datos = getData(STORAGE_VIAJES);
  datos.push(item);
  saveData(STORAGE_VIAJES, datos);

  limpiarFormularioViaje();
  renderTodo();
}

function limpiarFormularioViaje() {
  if (getEl("fechaViaje")) getEl("fechaViaje").value = hoyISO();
  if (getEl("kgViaje")) getEl("kgViaje").value = "";
  if (getEl("tipoViaje")) getEl("tipoViaje").value = "grano";
  if (getEl("referenciaViaje")) getEl("referenciaViaje").value = "";
  if (getEl("observacionesViaje")) getEl("observacionesViaje").value = "";
}

function borrarViaje(id) {
  const ok = confirm("¿Quieres borrar este viaje?");
  if (!ok) return;

  const datos = getData(STORAGE_VIAJES).filter(item => item.id !== id);
  saveData(STORAGE_VIAJES, datos);
  renderTodo();
}

function renderViajes() {
  const tbody = document.querySelector("#tablaViajes tbody");
  if (!tbody) return;

  const viajes = getViajesCampaña();
  tbody.innerHTML = "";

  if (viajes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">Sin viajes registrados</td>
      </tr>
    `;
    return;
  }

  viajes
    .slice()
    .reverse()
    .forEach(item => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${formatoFechaISO(item.fecha)}</td>
        <td>${textoDestino(item.destino)}</td>
        <td>${kilos(item.kg)}</td>
        <td>${item.referencia || ""}</td>
        <td>${item.observaciones || ""}</td>
        <td class="ocultar-print">
          <button type="button" class="boton boton--peligro" onclick="borrarViaje(${item.id})">Eliminar</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
}

// =========================================================
// 10. CÁLCULOS AVANZADOS DE CONTROL OLIVAS
// =========================================================
function calcularControlOlivas() {
  const params = getParametros();
  const clientes = getClientesCampaña();
  const viajes = getViajesCampaña();
  const totalCosechaKg = getTotalCosechaCampañaKg();

  const rendimientoFactor = numero(params.rendimiento) / 100;

  const garrafasVendidas = clientes.reduce((acc, item) => acc + numero(item.garrafas), 0);
  const litrosVendidos = clientes.reduce((acc, item) => acc + numero(item.litros), 0);
  const ingresosClientes = clientes.reduce((acc, item) => acc + numero(item.total), 0);

  const kgViajesGrano = viajes
    .filter(item => item.destino === "grano")
    .reduce((acc, item) => acc + numero(item.kg), 0);

  const kgViajesAceite = viajes
    .filter(item => item.destino === "aceite")
    .reduce((acc, item) => acc + numero(item.kg), 0);

  const kgNecesariosClientes = rendimientoFactor > 0
    ? litrosVendidos / rendimientoFactor
    : 0;

  const aceiteProducido = kgViajesAceite * rendimientoFactor;
  const aceiteRestante = aceiteProducido - litrosVendidos;
  const granoRestante = totalCosechaKg - kgViajesGrano - kgViajesAceite;

  const costePrensadoReal = kgViajesAceite * numero(params.precioPrensada);
  const costeGarrafaReal = garrafasVendidas * numero(params.costeEnvasado);
  const costeReal = costePrensadoReal + costeGarrafaReal;

  const beneficioAceite = ingresosClientes - costeReal;
  const beneficioCooperativa = kgViajesGrano * numero(params.precioVentaGrano);
  const beneficioTotal = beneficioAceite + beneficioCooperativa;

  return {
    params,
    totalCosechaKg,
    garrafasVendidas,
    litrosVendidos,
    ingresosClientes,
    kgViajesGrano,
    kgViajesAceite,
    kgNecesariosClientes,
    aceiteProducido,
    aceiteRestante,
    granoRestante,
    costeReal,
    beneficioAceite,
    beneficioCooperativa,
    beneficioTotal,
    totalClientes: clientes.length,
    totalViajes: viajes.length
  };
}

// =========================================================
// 11. KPIs
// =========================================================
function renderKPIs() {
  const calc = calcularControlOlivas();

  const map = {
    // KPI avanzados del control de olivas
    kpiCosecha: kilos(calc.totalCosechaKg),
    kpiKgNecesarios: kilos(calc.kgNecesariosClientes),
    kpiKgAceite: kilos(calc.kgViajesAceite),
    kpiAceiteDisponible: litros(calc.aceiteProducido),
    kpiAceiteRestante: litros(calc.aceiteRestante),
    kpiGranoRestante: kilos(calc.granoRestante),
    kpiBeneficioAceite: euros(calc.beneficioAceite),
    kpiBeneficioGrano: euros(calc.beneficioCooperativa),
    kpiBeneficioTotal: euros(calc.beneficioTotal),
    kpiCostesReales: euros(calc.costeReal),

    // También soporta los KPI simplificados de la v2
    kpiClientes: calc.totalClientes,
    kpiGarrafas: calc.garrafasVendidas,
    kpiLitrosVendidos: litros(calc.litrosVendidos),
    kpiIngresos: euros(calc.ingresosClientes),
    kpiViajes: calc.totalViajes,
    kpiKgViajes: kilos(calc.kgViajesGrano + calc.kgViajesAceite)
  };

  Object.entries(map).forEach(([id, valor]) => {
    const el = getEl(id);
    if (el) el.textContent = valor;
  });
}

// =========================================================
// 12. INFORME AUTOMÁTICO
// =========================================================
function renderInforme() {
  const c = calcularControlOlivas();
  const alertas = getEl("alertasStock");
  const report = getEl("reportTables");

  if (alertas) {
    if (c.totalCosechaKg <= 0 && c.totalClientes === 0 && c.totalViajes === 0) {
      alertas.textContent = "No hay datos suficientes todavía en la campaña activa.";
    } else {
      alertas.textContent = "Informe recalculado automáticamente con datos reales de la campaña activa.";
    }
  }

  if (!report) return;

  report.innerHTML = `
    <table class="tabla">
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Total cosecha campaña</td><td>${kilos(c.totalCosechaKg)}</td></tr>
        <tr><td>Kg necesarios para clientes</td><td>${kilos(c.kgNecesariosClientes)}</td></tr>
        <tr><td>Kg usados para aceite</td><td>${kilos(c.kgViajesAceite)}</td></tr>
        <tr><td>Aceite producido</td><td>${litros(c.aceiteProducido)}</td></tr>
        <tr><td>Aceite restante</td><td>${litros(c.aceiteRestante)}</td></tr>
        <tr><td>Grano restante</td><td>${kilos(c.granoRestante)}</td></tr>
        <tr><td>Beneficio aceite</td><td>${euros(c.beneficioAceite)}</td></tr>
        <tr><td>Beneficio cooperativa</td><td>${euros(c.beneficioCooperativa)}</td></tr>
        <tr><td>Beneficio total</td><td>${euros(c.beneficioTotal)}</td></tr>
        <tr><td>Coste real</td><td>${euros(c.costeReal)}</td></tr>
        <tr><td>Rendimiento graso</td><td>${numero(c.params.rendimiento).toFixed(2).replace(".", ",")} %</td></tr>
        <tr><td>Precio grano cooperativa</td><td>${euros(c.params.precioVentaGrano)}</td></tr>
        <tr><td>Coste prensado</td><td>${euros(c.params.precioPrensada)}</td></tr>
        <tr><td>Coste garrafa unidad</td><td>${euros(c.params.costeEnvasado)}</td></tr>
      </tbody>
    </table>
  `;
}

// =========================================================
// 13. ETIQUETAS MÓVILES AUTOMÁTICAS
// =========================================================
function aplicarEtiquetasTabla(tablaId) {
  const tabla = document.getElementById(tablaId);
  if (!tabla) return;

  const headers = Array.from(tabla.querySelectorAll("thead th")).map(th =>
    th.textContent.trim()
  );

  const filas = tabla.querySelectorAll("tbody tr");

  filas.forEach((tr) => {
    const celdas = tr.querySelectorAll("td");
    celdas.forEach((td, index) => {
      if (headers[index]) {
        td.setAttribute("data-label", headers[index]);
      }
    });
  });
}

// =========================================================
// 14. BOTONES GLOBALES
// =========================================================
function initBotonesGlobales() {
  const btnPrint = getEl("btnPrint");
  const btnExport = getEl("btnExport");
  const btnResetAll = getEl("btnResetAll");

  if (btnPrint) {
    btnPrint.addEventListener("click", function () {
      window.print();
    });
  }

  if (btnExport) {
    btnExport.addEventListener("click", function () {
      const c = calcularControlOlivas();
      const clientes = getClientesCampaña();
      const viajes = getViajesCampaña();

      let csv = "\uFEFF";
      csv += `CONTROL OLIVAS - CAMPAÑA ${getCampañaActiva()}\n\n`;

      csv += "RESUMEN GENERAL\n";
      csv += `Total cosecha campaña;${c.totalCosechaKg}\n`;
      csv += `Kg necesarios para clientes;${c.kgNecesariosClientes}\n`;
      csv += `Kg usados para aceite;${c.kgViajesAceite}\n`;
      csv += `Aceite producido;${c.aceiteProducido}\n`;
      csv += `Aceite restante;${c.aceiteRestante}\n`;
      csv += `Grano restante;${c.granoRestante}\n`;
      csv += `Beneficio aceite;${c.beneficioAceite}\n`;
      csv += `Beneficio cooperativa;${c.beneficioCooperativa}\n`;
      csv += `Beneficio total;${c.beneficioTotal}\n`;
      csv += `Coste real;${c.costeReal}\n\n`;

      csv += "PARÁMETROS\n";
      csv += `Rendimiento graso;${c.params.rendimiento}\n`;
      csv += `Precio grano cooperativa;${c.params.precioVentaGrano}\n`;
      csv += `Coste prensado;${c.params.precioPrensada}\n`;
      csv += `Coste garrafa unidad;${c.params.costeEnvasado}\n\n`;

      csv += "LISTADO CLIENTES\n";
      csv += "Cliente;Garrafas;Litros;Precio/u.;Total;Cobro;Notas\n";
      clientes.forEach(item => {
        csv += [
          item.cliente,
          item.garrafas,
          item.litros,
          item.precio,
          item.total,
          item.cobro,
          (item.notas || "").replaceAll(";", ",")
        ].join(";") + "\n";
      });

      csv += "\nLISTADO VIAJES\n";
      csv += "Fecha;Destino;Kg;Referencia;Observaciones\n";
      viajes.forEach(item => {
        csv += [
          item.fecha,
          textoDestino(item.destino),
          item.kg,
          item.referencia || "",
          (item.observaciones || "").replaceAll(";", ",")
        ].join(";") + "\n";
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `control_olivas_${getCampañaActiva()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  if (btnResetAll) {
    btnResetAll.addEventListener("click", function () {
      const ok = confirm("⚠️ ¿Seguro que quieres resetear clientes, viajes y parámetros de Control Olivas?");
      if (!ok) return;

      localStorage.removeItem(STORAGE_CLIENTES);
      localStorage.removeItem(STORAGE_VIAJES);
      localStorage.removeItem(STORAGE_PARAMS);
      renderTodo();
      initParametros();
      ponerFechaHoyViaje();
    });
  }
}

// =========================================================
// 15. FECHA AUTOMÁTICA
// =========================================================
function ponerFechaHoyViaje() {
  const inputFecha = getEl("fechaViaje");
  if (inputFecha && !inputFecha.value) {
    inputFecha.value = hoyISO();
  }
}

// =========================================================
// 16. RENDER TOTAL
// =========================================================
function renderTodo() {
  renderClientes();
  renderViajes();
  renderKPIs();
  renderInforme();
  aplicarEtiquetasTabla("tablaClientes");
  aplicarEtiquetasTabla("tablaViajes");
}

// =========================================================
// 17. EVENTOS
// =========================================================
function initEventos() {
  const btnCliente = getEl("addCliente");
  const btnViaje = getEl("addViaje");

  if (btnCliente) {
    btnCliente.addEventListener("click", addCliente);
  }

  if (btnViaje) {
    btnViaje.addEventListener("click", addViaje);
  }
}

// Exponer borrados al HTML
window.borrarCliente = borrarCliente;
window.borrarViaje = borrarViaje;

// =========================================================
// 18. INICIO
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  initMenuMovil();
  initSelectorCampaña();
  initParametros();
  initEventos();
  initBotonesGlobales();
  ponerFechaHoyViaje();
  renderTodo();
});