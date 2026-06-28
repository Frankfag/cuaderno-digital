// =========================================================
// MASÍA CENTENARIA · ACCESO / LOGIN / SESIÓN / USUARIOS
// =========================================================

// =========================================================
// 1) CLAVES STORAGE
// =========================================================
const STORAGE_LOGIN_OK = "login_ok";
const STORAGE_CURRENT_USER = "usuario_actual";
const STORAGE_USERS = "usuarios_masia";
const STORAGE_PASSWORD = "password";



// =========================================================
// 2) RUTAS SEGÚN UBICACIÓN
// ---------------------------------------------------------
// Si la página está dentro de /cuaderno-huerta/
// ajusta automáticamente login e index
// =========================================================
function getLoginUrl() {
  return "/cuaderno-olivar/html/login.html";
}

function getIndexUrl() {
  return "/cuaderno-olivar/html/index.html";
}



// =========================================================
// 3) USUARIOS POR DEFECTO
// ---------------------------------------------------------
// Solo se crean si no existen aún
// =========================================================
function initUsuarios() {
  const existentes = JSON.parse(localStorage.getItem(STORAGE_USERS));

  if (!existentes || !Array.isArray(existentes) || existentes.length === 0) {
    const usuariosIniciales = [
      {
        user: "Franklin",
        pass: "fag230680",
        role: "Administrador"
      },
      {
        user: "Alexis",
        pass: "fag230680",
        role: "Jefe de Campo"
      },
      {
        user: "Meritxell",
        pass: "fag230680",
        role: "Mi Jefa"
      },
      {
        user: "Invitado",
        pass: "fag230680",
        role: "Invitado"
      }
    ];

    localStorage.setItem(
      STORAGE_USERS,
      JSON.stringify(usuariosIniciales)
    );
  }

  // Compatibilidad simple con login.js / mi-cuenta.js
  if (!localStorage.getItem(STORAGE_PASSWORD)) {
    localStorage.setItem(STORAGE_PASSWORD, "fag230680");
  }
}

function getUsuarios() {
  return JSON.parse(localStorage.getItem(STORAGE_USERS)) || [];
}



// =========================================================
// 4) SESIÓN
// =========================================================
function isLoggedIn() {
  return localStorage.getItem(STORAGE_LOGIN_OK) === "true";
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(STORAGE_CURRENT_USER)) || null;
}

function saveSession(usuarioObj) {
  localStorage.setItem(STORAGE_LOGIN_OK, "true");
  localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(usuarioObj));
}

function clearSession() {
  localStorage.removeItem(STORAGE_LOGIN_OK);
  localStorage.removeItem(STORAGE_CURRENT_USER);
}

// =====================================
// MOSTRAR / OCULTAR CONTRASEÑA
// =====================================
function initMostrarPassword() {
  const input = document.getElementById("pass");
  const boton = document.getElementById("btnMostrarPassword");

  if (!input || !boton) return;

  boton.addEventListener("click", function () {
    if (input.type === "password") {
      input.type = "text";
      boton.textContent = "🙈";
    } else {
      input.type = "password";
      boton.textContent = "👁️";
    }
  });
}


// =========================================================
// 5) LOGIN
// ---------------------------------------------------------
// Compatible con:
// - formulario #formLogin
// - inputs #user y #pass
// - mensaje #error
// =========================================================
function login() {
  const inputUser = document.getElementById("user");
  const inputPass = document.getElementById("pass");
  const error = document.getElementById("error");

  if (!inputUser || !inputPass || !error) return;

  const user = inputUser.value.trim().toLowerCase();
  const pass = inputPass.value.trim();

  error.textContent = "";

  const usuarios = getUsuarios();

  const encontrado = usuarios.find(u =>
    u.user.toLowerCase() === user && u.pass === pass
  );

  if (encontrado) {
    saveSession(encontrado);

    // Compatibilidad con el resto del proyecto
    localStorage.setItem(STORAGE_PASSWORD, encontrado.pass);

    window.location.replace(getIndexUrl());
  } else {
    error.textContent = "Usuario o contraseña incorrectos";
  }
}

window.login = login;



// =========================================================
// 6) LOGOUT
// =========================================================
function logout() {
  clearSession();
  window.location.replace(getLoginUrl());
}

window.logout = logout;



// =========================================================
// 7) PROTECCIÓN DE PÁGINAS
// ---------------------------------------------------------
// Si estás en login y ya hay sesión → te manda al index
// Si NO estás en login y no hay sesión → te manda al login
// =========================================================
function protegerPagina() {
  const path = window.location.pathname.toLowerCase();
  const esLogin = path.endsWith("/login.html") || path.endsWith("login.html");

  if (esLogin && isLoggedIn()) {
    window.location.replace(getIndexUrl());
    return;
  }

  if (!esLogin && !isLoggedIn()) {
    window.location.replace(getLoginUrl());
  }
}



// =========================================================
// 8) PINTAR USUARIO ACTUAL
// ---------------------------------------------------------
// Compatible con:
// <p id="usuarioActual"></p>
// =========================================================
function pintarUsuarioActual() {
  const el = document.getElementById("usuarioActual");
  const user = getCurrentUser();

  if (el && user) {
    el.textContent = `${user.user} (${user.role})`;
  }
}



// =========================================================
// 9) CAMBIAR CONTRASEÑA
// ---------------------------------------------------------
// Compatible con:
// - formCuenta
// - passActual
// - passNueva
// - passRepetir
// - msgCuenta
// =========================================================
function cambiarPassword() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const actual = document.getElementById("passActual");
  const nueva = document.getElementById("passNueva");
  const repetir = document.getElementById("passRepetir");
  const msg = document.getElementById("msgCuenta");

  if (!actual || !nueva || !repetir || !msg) return;

  msg.textContent = "";

  const passActual = actual.value.trim();
  const passNueva = nueva.value.trim();
  const passRepetir = repetir.value.trim();

  if (!passActual || !passNueva || !passRepetir) {
    msg.textContent = "Completa todos los campos";
    msg.style.color = "#ff8080";
    return;
  }

  if (passNueva.length < 6) {
    msg.textContent = "La nueva contraseña debe tener al menos 6 caracteres";
    msg.style.color = "#ff8080";
    return;
  }

  if (passNueva !== passRepetir) {
    msg.textContent = "La nueva contraseña no coincide";
    msg.style.color = "#ff8080";
    return;
  }

  const usuarios = getUsuarios();

  const coincideActual = usuarios.find(
    u =>
      u.user === currentUser.user &&
      u.pass === passActual
  );

  if (!coincideActual) {
    msg.textContent = "La contraseña actual no es correcta";
    msg.style.color = "#ff8080";
    return;
  }

  const actualizados = usuarios.map(u => {
    if (u.user === currentUser.user && u.pass === passActual) {
      return {
        ...u,
        pass: passNueva
      };
    }
    return u;
  });

  const usuarioActualizado = actualizados.find(
    u =>
      u.user === currentUser.user &&
      u.pass === passNueva
  );

  localStorage.setItem(
    STORAGE_USERS,
    JSON.stringify(actualizados)
  );

  // Compatibilidad con módulos que miran contraseña simple
  localStorage.setItem(STORAGE_PASSWORD, passNueva);

  saveSession(usuarioActualizado);

  msg.textContent = "✅ Contraseña cambiada correctamente";
  msg.style.color = "#4caf50";

  actual.value = "";
  nueva.value = "";
  repetir.value = "";
}

window.cambiarPassword = cambiarPassword;



// =========================================================
// 10) FORMULARIOS AUTOMÁTICOS
// ---------------------------------------------------------
// Si existe formLogin → conecta login()
// Si existe formCuenta → conecta cambiarPassword()
// =========================================================
function initFormulariosAcceso() {
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();
      login();
    });
  }

  const formCuenta = document.getElementById("formCuenta");
  if (formCuenta) {
    formCuenta.addEventListener("submit", function (e) {
      e.preventDefault();
      cambiarPassword();
    });
  }
}



// =========================================================
// 11) ABRIR CALENDARIO EN TODO INPUT DATE
// ---------------------------------------------------------
// Hace que el selector de fecha nativo se abra al clicar
// =========================================================
function initDatePickers() {
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.addEventListener("click", function () {
      if (input.showPicker) {
        input.showPicker();
      }
    });
  });
}



// =========================================================
// 12) ARRANQUE GENERAL
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  initUsuarios();
  protegerPagina();
  pintarUsuarioActual();
  initFormulariosAcceso();
  initDatePickers();
  initMostrarPassword();
});