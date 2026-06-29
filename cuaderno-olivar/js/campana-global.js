// =====================================
// CAMPAÑA GLOBAL
// =====================================
const STORAGE_CAMPANA_GLOBAL = "CAMPAÑA_ACTIVA_GLOBAL";

function getCampanaGlobal() {
  return localStorage.getItem(STORAGE_CAMPANA_GLOBAL) || "2025-2026";
}

function setCampanaGlobal(campana) {
  localStorage.setItem(STORAGE_CAMPANA_GLOBAL, campana);
}

function aplicarCampanaGlobalEnSelector(selectorId, tituloId, textoTitulo) {
  const campana = getCampanaGlobal();

  const selector = document.getElementById(selectorId);
  const titulo = document.getElementById(tituloId);

  if (selector) {
    selector.value = campana;

    selector.addEventListener("change", function () {
      setCampanaGlobal(selector.value);

      if (titulo) {
        titulo.textContent = textoTitulo + selector.value;
      }

      // Si la página tiene función de renderizado, la relanzamos
      if (typeof renderizar === "function") {
        renderizar();
      }

      if (typeof renderCultivos === "function") {
        renderCultivos();
      }

      if (typeof renderTabla === "function") {
        renderTabla();
      }

      if (typeof actualizarDashboard === "function") {
        actualizarDashboard();
      }
    });
  }

  if (titulo) {
    titulo.textContent = textoTitulo + campana;
  }
}