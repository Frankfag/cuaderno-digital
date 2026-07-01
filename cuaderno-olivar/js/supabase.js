const SUPABASE_URL = "https://bmaffeacaztvhfblaegl.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtYWZmZWFjYXp0dmhmYmxhZWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2ODI1MDEsImV4cCI6MjA5ODI1ODUwMX0.SO4ji1NnWTyvTfaiPd6Jn2Ytq_uMwNkd1BGMTXIYRc8";

// 🔥 MUY IMPORTANTE: global
window.supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);