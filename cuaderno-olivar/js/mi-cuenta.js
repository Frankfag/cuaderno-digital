// =========================================================
// MASÍA CENTENARIA · MI CUENTA
// =========================================================

// =========================================================
// LOGIN
// =========================================================
if (localStorage.getItem("login_ok") !== "true") {
  window.location.replace("login.html");
}

// =========================================================
// UTILIDADES
// =========================================================
function getEl(id) {
  return document.getElementById(id);
}

// =========================================================
// MENÚ HAMBURGUESA
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

    menu.classList.toggle("activo");

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
// USUARIO ACTUAL
// =========================================================
function mostrarUsuarioActual() {

  const usuarioActual = getEl("usuarioActual");

  if (!usuarioActual) return;

  const usuario =
    localStorage.getItem("usuario_actual") ||
    localStorage.getItem("usuario") ||
    localStorage.getItem("username") ||
    "Administrador";

  usuarioActual.textContent = usuario;

}

// =========================================================
// MENSAJES
// =========================================================
function mostrarMensaje(texto, esError = false) {

  const msg = getEl("msgCuenta");

  if (!msg) return;

  msg.textContent = texto;

  msg.style.color =
    esError
      ? "#ff7b7b"
      : "#4caf50";

}

// =========================================================
// CAMBIO CONTRASEÑA
// =========================================================
function initFormularioCuenta() {

  const form = getEl("formCuenta");

  if (!form) return;

  form.addEventListener("submit", function (e) {

    e.preventDefault();

    const passActual =
      getEl("passActual").value.trim();

    const passNueva =
      getEl("passNueva").value.trim();

    const passRepetir =
      getEl("passRepetir").value.trim();

    const passwordGuardada =
      localStorage.getItem("password") ||
      "1234";

    // Validar contraseña actual

    if (passActual !== passwordGuardada) {

      mostrarMensaje(
        "La contraseña actual no es correcta.",
        true
      );

      return;

    }

    // Longitud mínima

    if (passNueva.length < 6) {

      mostrarMensaje(
        "La nueva contraseña debe tener al menos 6 caracteres.",
        true
      );

      return;

    }

    // Coincidencia

    if (passNueva !== passRepetir) {

      mostrarMensaje(
        "Las contraseñas no coinciden.",
        true
      );

      return;

    }

    // Guardar

    localStorage.setItem(
      "password",
      passNueva
    );

    mostrarMensaje(
      "✅ Contraseña actualizada correctamente."
    );

    form.reset();

  });

}

// =========================================================
// INICIALIZACIÓN
// =========================================================
function initMiCuenta() {

  initMenuMovil();

  mostrarUsuarioActual();

  initFormularioCuenta();

}

// =========================================================
// ARRANQUE
// =========================================================
document.addEventListener("DOMContentLoaded", function () {

  initMiCuenta();

});