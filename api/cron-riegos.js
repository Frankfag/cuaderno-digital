export default async function handler(req, res) {

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  try {

    const response = await fetch(
      "https://bmaffeacaztvhfblaegl.supabase.co/rest/v1/riegos_huerta?estado=eq.EN_CURSO",
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await response.json();
const ahora = Date.now();

// ✅ comprobar que es un array
if (!Array.isArray(data)) {
  console.log("No es array:", data);
  return res.status(200).json({ ok: true, aviso: "sin datos" });
}


    if (!Array.isArray(data)) {
      return res.status(200).json({ ok: true, notice: "no data" });
    }

    for (const riego of data) {

      const fin = new Date(riego.fecha_hora_fin_prevista).getTime();

      if (fin <= ahora && !riego.fecha_hora_fin_real) {

        // ✅ actualizar estado en Supabase
        await fetch(
          `https://bmaffeacaztvhfblaegl.supabase.co/rest/v1/riegos_huerta?id=eq.${riego.id}`,
          {
            method: "PATCH",
            headers: {
              "apikey": SUPABASE_KEY,
              "Authorization": `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              estado: "COMPLETADO",
              fecha_hora_fin_real: new Date().toISOString()
            })
          }
        );

        // ✅ enviar Telegram
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
                `🚿 Riego finalizado\n\n` +
                `📍 Parcela: ${riego.parcela}\n` +
                `⏰ Hora: ${new Date().toLocaleTimeString()}`
            })
          }
        );

        console.log("✅ Riego automático:", riego.parcela);
      }
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
