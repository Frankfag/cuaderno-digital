/* =====================================
   TRABAJOS AGRÍCOLAS
===================================== */

/* =====================================
   STORAGE TRABAJOS
===================================== */

const STORAGE_TRABAJOS_HUERTA =
  "huerta_trabajos";

/* =====================================
   OPERARIOS
===================================== */

const OPERARIOS = [
  { id: 1, nombre: "Franklin" },
  { id: 2, nombre: "Alexis" },
  { id: 3, nombre: "Meritxell" },
  { id: 4, nombre: "Invitado" }
];

/* =====================================
   CATEGORÍAS Y TRABAJOS
===================================== */

const TRABAJOS_POR_CATEGORIA = {

  "Preparación del terreno": [
    "Limpieza parcela",
    "Retirar rastrojos",
    "Labrar",
    "Airear",
    "Nivelar terreno",
    "Mulching"
  ],

  "Siembra y plantación": [
    "Semillero",
    "Repicado",
    "Trasplante",
    "Siembra directa",
    "Plantación"
  ],

  "Mantenimiento": [
    "Escardado",
    "Entutorado",
    "Poda",
    "Deschuponado",
    "Aclareo",
    "Aporcado",
    "Limpieza"
  ],

  "Cosecha": [
    "Recolección",
    "Clasificación",
    "Pesaje"
  ],

  "Postcosecha": [
    "Rotación cultivos",
    "Abono verde",
    "Limpieza parcela"
  ]

};

/* =====================================
   VARIABLES GLOBALES
===================================== */

let cultivosGlobal = [];

/* =====================================
   UTILIDADES TRABAJOS
===================================== */

function getTrabajos() {

  return JSON.parse(
    localStorage.getItem(
      STORAGE_TRABAJOS_HUERTA
    )
  ) || [];

}

function saveTrabajos(data) {

  localStorage.setItem(
    STORAGE_TRABAJOS_HUERTA,
    JSON.stringify(data)
  );

}

/* =====================================
   INICIO
===================================== */

document.addEventListener(
  "DOMContentLoaded",
  iniciarModulo
);

async function iniciarModulo() {

  cargarFechaActual();

  cargarCampaña();

  cargarOperarios();

  bloquearSelectCultivo();

  bloquearSelectTrabajo();

  cultivosGlobal = getCultivos();

  await cargarParcelas();

  configurarEventos();

}

/* =====================================
   FORMULARIO
===================================== */

function initFormularioTrabajos() {

  const form =
    document.getElementById(
      "formTrabajo"
    );

  if (!form) return;

  form.addEventListener(
    "submit",
    guardarTrabajo
  );

}

/* =====================================
   FECHA ACTUAL
===================================== */

function cargarFechaActual() {

  const hoy = new Date();

  const fechaFormateada =
    hoy.toISOString().split("T")[0];

  document.getElementById("fecha").value =
    fechaFormateada;

}

/* =====================================
   CAMPAÑA
===================================== */

function cargarCampaña() {

  const campana = getCampaña();

  document.getElementById("campana").value =
    campana || "";

}

/* =====================================
   OPERARIOS
===================================== */

function cargarOperarios() {

  const select =
    document.getElementById("operario");

  select.innerHTML = `
    <option value="">
      Seleccionar operario
    </option>
  `;

  OPERARIOS.forEach(operario => {

    const option =
      document.createElement("option");

    option.value = operario.id;
    option.textContent = operario.nombre;

    select.appendChild(option);

  });

}

/* =====================================
   PARCELAS
===================================== */

async function cargarParcelas() {

  const select =
    document.getElementById("parcela");

  select.innerHTML = `
    <option value="">
      Seleccionar parcela
    </option>
  `;

  const parcelasUnicas = [
    ...new Set(
      cultivosGlobal.map(
        cultivo => cultivo.parcela
      )
    )
  ];

  parcelasUnicas
    .filter(Boolean)
    .sort()
    .forEach(parcela => {

      const option =
        document.createElement("option");

      option.value = parcela;
      option.textContent = parcela;

      select.appendChild(option);

    });

}

/* =====================================
   BLOQUEAR CULTIVO
===================================== */

function bloquearSelectCultivo() {

  const select =
    document.getElementById("cultivo");

  select.disabled = true;

  select.innerHTML = `
    <option value="">
      Seleccionar parcela primero
    </option>
  `;

}

/* =====================================
   BLOQUEAR TRABAJO
===================================== */

function bloquearSelectTrabajo() {

  const select =
    document.getElementById("trabajo");

  select.disabled = true;

  select.innerHTML = `
    <option value="">
      Seleccionar categoría primero
    </option>
  `;

}

/* =====================================
   EVENTOS
===================================== */

function configurarEventos() {

  document
    .getElementById("parcela")
    .addEventListener(
      "change",
      cargarCultivosParcela
    );

  document
    .getElementById("categoria")
    .addEventListener(
      "change",
      cargarTrabajosCategoria
    );

}


/* =====================================
   GUARDAR TRABAJO
===================================== */

async function guardarTrabajo(e) {

  async function guardarTrabajo(e) {

  console.log("🚜 GUARDAR FUNCIONA");

  alert("ENTRÓ EN GUARDAR");

  e.preventDefault();

}
async function guardarTrabajo(e) {

    console.log("1");

    e.preventDefault();

    console.log("2");

    const trabajos = getTrabajos();

    console.log("3", trabajos);

    const registro = {
        id: Date.now()
    };

    console.log("4", registro);

    trabajos.push(registro);

    console.log("5", trabajos);

    saveTrabajos(trabajos);

    console.log("6");
}

  e.preventDefault();

  const trabajos =
    getTrabajos();

  const registro = {

    id: Date.now(),

    fecha:
      document.getElementById(
        "fecha"
      ).value,

    campana:
      document.getElementById(
        "campana"
      ).value,

    parcela:
      document.getElementById(
        "parcela"
      ).value,

    cultivo:
      document.getElementById(
        "cultivo"
      ).value,

    operario:
      document.getElementById(
        "operario"
      ).value,

    categoria:
      document.getElementById(
        "categoria"
      ).value,

    trabajo:
      document.getElementById(
        "trabajo"
      ).value,

    observaciones:
      document.getElementById(
        "observaciones"
      ).value,

    activo: true

  };

  trabajos.push(registro);

  saveTrabajos(trabajos);

  cargarTablaTrabajos();

  actualizarContadorTrabajos();

}

/* =====================================
   CONTADOR
===================================== */

function actualizarContadorTrabajos() {

  const total =
    getTrabajos().filter(
      item =>
        item.campana ===
        getCampaña()
    ).length;

  const contador =
    document.getElementById(
      "totalTrabajos"
    );

  if (contador) {

    contador.textContent =
      total;

  }

}

/* =====================================
   PARCELA → CULTIVOS
===================================== */

function cargarCultivosParcela() {

  const parcelaSeleccionada =
    document.getElementById("parcela").value;

  const selectCultivo =
    document.getElementById("cultivo");

  if (!parcelaSeleccionada) {

    bloquearSelectCultivo();

    return;

  }

  const cultivosFiltrados =
    cultivosGlobal.filter(
      cultivo =>
        String(cultivo.parcela) ===
        String(parcelaSeleccionada)
    );

  selectCultivo.disabled = false;

  if (cultivosFiltrados.length === 0) {

    selectCultivo.innerHTML = `
      <option value="">
        No hay cultivos disponibles
      </option>
    `;

    return;

  }

  selectCultivo.innerHTML = `
    <option value="">
      Seleccionar cultivo
    </option>
  `;

  cultivosFiltrados.forEach(cultivo => {

    const option =
      document.createElement("option");

    option.value =
      cultivo.cultivoId;

    option.textContent =
      cultivo.cultivo;

    selectCultivo.appendChild(option);

  });

}

/* =====================================
   CATEGORÍA → TRABAJOS
===================================== */

function cargarTrabajosCategoria() {

  const categoria =
    document.getElementById("categoria").value;

  const selectTrabajo =
    document.getElementById("trabajo");

  if (!categoria) {

    bloquearSelectTrabajo();

    return;

  }

  const trabajos =
    TRABAJOS_POR_CATEGORIA[categoria] || [];

  selectTrabajo.disabled = false;

  selectTrabajo.innerHTML = `
    <option value="">
      Seleccionar trabajo
    </option>
  `;

  trabajos.forEach(trabajo => {

    const option =
      document.createElement("option");

    option.value = trabajo;

    option.textContent = trabajo;

    selectTrabajo.appendChild(option);

  });

}