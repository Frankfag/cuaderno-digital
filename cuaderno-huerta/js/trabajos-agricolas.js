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

  initFormularioTrabajos();

  cargarListaTrabajos();

  actualizarContadorTrabajos();

  cargarFechaActual();

  cargarCampaña();

  cargarOperarios();

  bloquearSelectCultivo();

  bloquearSelectTrabajo();

  cultivosGlobal = getCultivos();

  console.log(cultivosGlobal);

  await cargarParcelas();

  cargarFiltroParcelas();

  cargarFiltroCampañas();

  cargarCultivosParcela();

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

  console.log(
  cultivosGlobal.map(
    cultivo => cultivo.parcela
  )
);

  const PARCELAS_HUERTA = [
  "Parcela 1",
  "Parcela 2",
  "Parcela 3",
  "Parcela 4",
  "Parcela 5",
  "Parcela 6",
  "Parcela 7"
];

PARCELAS_HUERTA.forEach(parcela => {

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

  document
  .getElementById("filtroParcela")
  ?.addEventListener(
    "change",
    cargarListaTrabajos
  );  

  document
  .getElementById("filtroCategoria")
  ?.addEventListener(
    "change",
    cargarListaTrabajos
  );

  document
  .getElementById("filtroCampana")
  ?.addEventListener(
    "change",
    () => {

      console.log(
        "CAMBIO CAMPAÑA"
      );

      cargarListaTrabajos();

    }
  );

}


/* =====================================
   GUARDAR TRABAJO
===================================== */

async function guardarTrabajo(e) {

  e.preventDefault();

  const trabajos = getTrabajos();

  const trabajoId =
    document.getElementById("trabajoId").value;

  const selectOperario =
    document.getElementById("operario");

  const operarioNombre =
    selectOperario.options[
      selectOperario.selectedIndex
    ]?.text || "";

  const selectCultivo =
    document.getElementById("cultivo");

  const cultivoNombre =
    selectCultivo.options[
      selectCultivo.selectedIndex
    ]?.text || "";

  const registro = {

    id: trabajoId || Date.now(),

    fecha:
      document.getElementById("fecha").value,

    campana:
      document.getElementById("campana").value,

    parcela:
      document.getElementById("parcela").value,

    cultivo: cultivoNombre,

    operario: operarioNombre,

    categoria:
      document.getElementById("categoria").value,

    trabajo:
      document.getElementById("trabajo").value,

    observaciones:
      document.getElementById("observaciones").value,

    activo: true

  };

  if (trabajoId) {

    const indice =
      trabajos.findIndex(
        item =>
          String(item.id) ===
          String(trabajoId)
      );

    if (indice !== -1) {

      trabajos[indice] = registro;

    }

  } else {

     trabajos.unshift(registro);

  }

  saveTrabajos(trabajos);

  document.getElementById("trabajoId").value = "";

  cargarListaTrabajos();

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
   CULTIVOS
===================================== */
function cargarCultivosParcela() {

  const selectCultivo =
    document.getElementById("cultivo");

  selectCultivo.disabled = false;

  selectCultivo.innerHTML = `
    <option value="">
      Seleccionar cultivo
    </option>
  `;

  console.log(
  "TOTAL CULTIVOS:",
  Object.keys(CULTIVOS_DB).length
);

  Object.entries(CULTIVOS_DB)
    .forEach(([id, cultivo]) => {

      const option =
        document.createElement("option");

      option.value = id;

      option.textContent =
        cultivo.nombre;

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

/* =====================================
   LISTA DE TRABAJOS
===================================== */

function cargarListaTrabajos() {

  

  const lista =
    document.getElementById(
      "listaTrabajos"
    );

  if (!lista) return;

  let trabajos =
    getTrabajos();

  const filtroCampana =
    document.getElementById(
      "filtroCampana"
    )?.value || "";

  if (filtroCampana) {

    trabajos = trabajos.filter(
      item =>
        item.campana === filtroCampana
    );

  }

  

  const filtroParcela =
    document.getElementById(
      "filtroParcela"
    )?.value || "";

    const filtroCategoria =
  document.getElementById(
    "filtroCategoria"
  )?.value || "";

if (filtroCategoria) {

  trabajos = trabajos.filter(
    item =>
      item.categoria === filtroCategoria
  );

}


  if (filtroParcela) {

    trabajos = trabajos.filter(
      item =>
        item.parcela === filtroParcela
    );

  }

  lista.innerHTML = "";

  trabajos.forEach(item => {

    const card =
      document.createElement("div");

    card.className =
      "tarjeta-mini";

    card.innerHTML = `
      <h3>✂️ ${item.trabajo || "-"}</h3>

      ${item.fecha
  ? item.fecha
      .split("-")
      .reverse()
      .join("/")
  : "-"
}

      <p><strong>Campaña:</strong> ${item.campana || "-"}</p>

      <p><strong>Parcela:</strong> ${item.parcela || "-"}</p>

      <p><strong>Cultivo:</strong> ${item.cultivo || "-"}</p>

      <p><strong>Operario:</strong> ${item.operario || "-"}</p>

      
      ${item.observaciones? `<p><strong>Nota:</strong> ${item.observaciones}</p>`: ""} 

      <p><strong>Categoría:</strong> ${item.categoria || "-"}</p>

      <div class="acciones-formulario">

        <button
          class="boton"
          onclick="editarTrabajo(${item.id})">
          ✏️ Editar
        </button>

        <button
          class="boton"
          onclick="eliminarTrabajo(${item.id})">
          🗑️ Eliminar
        </button>

      </div>
    `;

    lista.appendChild(card);

  });

}

function cargarFiltroParcelas() {

  const select =
    document.getElementById(
      "filtroParcela"
    );

  if (!select) return;

  select.innerHTML = `
    <option value="">
      Todas las parcelas
    </option>
  `;

  const PARCELAS_HUERTA = [
    "Parcela 1",
    "Parcela 2",
    "Parcela 3",
    "Parcela 4",
    "Parcela 5",
    "Parcela 6",
    "Parcela 7"
  ];

  PARCELAS_HUERTA.forEach(parcela => {

    const option =
      document.createElement("option");

    option.value = parcela;

    option.textContent = parcela;

    select.appendChild(option);

  });

}

// =====================================
// RESET SOLO TRABAJOS AGRICOLAS
// =====================================

document
  .getElementById("btnResetTrabajos")
  ?.addEventListener(
    "click",
    function () {

      const respuesta = prompt(
        "⚠️ ATENCIÓN\n\nEscribe ELIMINAR para borrar todos los trabajos agrícolas."
      );

      if (respuesta !== "ELIMINAR") {
        alert("Operación cancelada.");
        return;
      }

      localStorage.removeItem(
        STORAGE_TRABAJOS_HUERTA
      );

      cargarListaTrabajos();
      actualizarContadorTrabajos();

      alert(
        "✅ Trabajos agrícolas eliminados."
      );

    }
  );




/* =====================================
  BOTON y EDITAR TRABAJO
===================================== */

function editarTrabajo(id) {

   console.log("EDITAR ID:", id);

  const trabajos = getTrabajos();

  const trabajo =
  trabajos.find(
    item =>
      String(item.id) ===
      String(id)
  );

  console.log("TRABAJO:", trabajo);


  if (!trabajo) return;

  document.getElementById(
    "trabajoId"
  ).value = trabajo.id;

  document.getElementById(
    "fecha"
  ).value = trabajo.fecha;

  document.getElementById(
    "campana"
  ).value = trabajo.campana;

  document.getElementById(
    "parcela"
  ).value = trabajo.parcela;

  const selectCultivo =
  document.getElementById(
    "cultivo"
  );

for (let i = 0; i < selectCultivo.options.length; i++) {

  if (
    selectCultivo.options[i].text ===
    trabajo.cultivo
  ) {

    selectCultivo.selectedIndex = i;

    break;

  }

}

  const selectOperario =
  document.getElementById(
    "operario"
  );

for (let i = 0; i < selectOperario.options.length; i++) {

  if (
    selectOperario.options[i].text ===
    trabajo.operario
  ) {

    selectOperario.selectedIndex = i;

    break;

  }

}

  document.getElementById(
    "categoria"
  ).value = trabajo.categoria;

  cargarTrabajosCategoria();

  document.getElementById(
    "trabajo"
  ).value = trabajo.trabajo;

  document.getElementById(
    "observaciones"
  ).value = trabajo.observaciones || "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}

/* =====================================
   BOTON ELIMINAR TRABAJO
===================================== */

function eliminarTrabajo(id) {

  console.log("ELIMINAR ID:", id);

  const trabajo = getTrabajos().find(
  item =>
    String(item.id) ===
    String(id)
);

const confirmar = confirm(
  `¿Eliminar el trabajo "${trabajo?.trabajo || "-"}"?`
);


  if (!confirmar) return;

  let trabajos = getTrabajos();

  trabajos = trabajos.filter(
  item =>
    String(item.id) !== String(id)
);

  saveTrabajos(trabajos);

  cargarListaTrabajos();

  actualizarContadorTrabajos();

}

/* =====================================
   FILTRO CAMPAÑAS
===================================== */

function cargarFiltroCampañas() {

  const select =
    document.getElementById(
      "filtroCampana"
    );

  if (!select) return;

  select.innerHTML = `
    <option value="">
      Todas las campañas
    </option>
  `;

  for (let i = 2023; i <= 2059; i++) {

    const option =
      document.createElement("option");

    option.value =
      `${i}-${i + 1}`;

    option.textContent =
      `${i}-${i + 1}`;

    select.appendChild(option);

  }

}