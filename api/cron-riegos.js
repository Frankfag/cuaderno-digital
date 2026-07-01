export default async function handler(req, res) {

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  try {

    // ✅ LEER RIEGOS
    const response = await fetch(
      "https://bmaffeacaztvhfblaegl.supabase.co/rest/v1/riegos_huerta",
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await response.json();
    const ahora = Date.now();

    if (!Array.isArray(data)) {
      return res.status(200).json({ ok: true });
    }

    // ✅ RECORRER RIEGOS
    for (const riego of data) {

      const fin = new Date(riego.fecha_hora_fin_prevista).getTime();
      const tiempoRestante = fin - ahora;
      const cincoMin = 5 * 60 * 1000;

      // ✅ AVISO 5 MINUTOS ANTES
      if (
        tiempoRestante > 0 &&
        tiempoRestante <= cincoMin &&
        !riego.aviso_enviado
      ) {

        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text:
                `⚠️ RIEGO A PUNTO DE TERMINAR\n\n` +
                `📍 Parcela: ${riego.parcela}\n` +
                `⏳ Faltan menos de 5 minutos`
            })
          }
        );

        // marcar aviso como enviado
        await fetch(
          `https://bmaffeacaztvhfblaegl.supabase.co/rest/v1/riegos_huerta?id=eq.${riego.id}`,
          {
            method: "PATCH",
            headers: {
              "apikey": SUPABASE_KEY,
              "Authorization": `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              aviso_enviado: true
            })
          }
        );
      }

      // ✅ FINALIZAR RIEGO
      if (fin <= ahora && !riego.fecha_hora_fin_real) {

        // actualizar estado
        await fetch(
          `https://bmaffeacaztvhfblaegl.supabase.co/rest/v1/riegos_huerta?id=eq.${riego.id}`,
          {
            method: "PATCH",
            headers: {
              "apikey": SUPABASE_KEY,
              "Authorization": `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal"
            },
            body: JSON.stringify({
              estado: "COMPLETADO",
              fecha_hora_fin_real: new Date().toISOString()
            })
          }
        );

        // enviar Telegram final
        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text:
                `🚿 RIEGO FINALIZADO\n\n` +
                `📍 Parcela: ${riego.parcela}\n` +
                `⏰ Hora: ${new Date().toLocaleTimeString("es-ES", {
                  timeZone: "Europe/Madrid",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                })}`
            })
          }
        );
      }
    }

    // ✅ RESPUESTA FINAL
    return res.status(200).json({ ok: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}