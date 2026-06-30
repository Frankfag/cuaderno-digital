// =====================================
// VIGILANCIA GLOBAL DE RIEGOS
// =====================================

async function vigilarRiegosGlobal() {

  try {

    const { data, error } = await supabaseClient
      .from("riegos_huerta")
      .select("*")
      .eq("estado", "EN_CURSO");

    if (error) {
      console.error("Error vigilando riegos:", error);
      return;
    }

    const ahora = Date.now();

    data.forEach(riego => {

      if (!riego.fecha_hora_fin_prevista) return;

      const fin = new Date(riego.fecha_hora_fin_prevista).getTime();

      if (fin <= ahora) {

        console.log("⏰ Riego terminado automáticamente:", riego.parcela);

        finalizarRiegoGlobal(riego);

      }

    });

  } catch (err) {
    console.error("Error global riegos:", err);
  }
}


// =====================================
// FINALIZAR DESDE GLOBAL
// =====================================

function finalizarRiegoGlobal(riego) {

  const ahoraISO = new Date().toISOString();

  supabaseClient
    .from("riegos_huerta")
    .update({
      estado: "COMPLETADO",
      fecha_hora_fin_real: ahoraISO
    })
    .eq("id", riego.id)
    .then(() => {

      enviarTelegram(
        `🚿 Riego finalizado\n\n` +
        `Parcela: ${riego.parcela}\n` +
        `Hora: ${new Date().toLocaleTimeString("es-ES", {
          timeZone: "Europe/Madrid",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })}`
      );

      console.log("✅ Riego finalizado GLOBAL y enviado");

    });

}


// =====================================
// INTERVALO GLOBAL
// =====================================

setInterval(vigilarRiegosGlobal, 10000);
