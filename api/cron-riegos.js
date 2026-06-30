export default async function handler(req, res) {

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  try {

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

    console.log("DATA:", data);

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
