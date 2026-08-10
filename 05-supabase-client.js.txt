/*
 * ONYX AUTH — Supabase client configuration
 * ------------------------------------------------------------
 * Remplace uniquement les 2 valeurs ci-dessous par celles de ton
 * projet Supabase : Project URL + Publishable key.
 *
 * IMPORTANT : n'utilise JAMAIS une service_role key dans le navigateur.
 */

window.ONYX_AUTH_CONFIG = Object.freeze({
  supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
  supabasePublishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
  applicationName: "Onyx Data Intelligence"
});

(function initializeOnyxSupabase() {
  const config = window.ONYX_AUTH_CONFIG;
  const hasRealConfig =
    config.supabaseUrl &&
    config.supabasePublishableKey &&
    !config.supabaseUrl.includes("YOUR_PROJECT_REF") &&
    !config.supabasePublishableKey.includes("YOUR_SUPABASE_PUBLISHABLE_KEY");

  window.ONYX_AUTH_READY = false;
  window.ONYX_AUTH_CONFIGURED = Boolean(hasRealConfig);

  if (!hasRealConfig) {
    console.warn("Onyx Auth : renseigne l'URL Supabase et la Publishable key dans 05-supabase-client.js.");
    return;
  }

  if (!window.supabase?.createClient) {
    console.error("Onyx Auth : la bibliothèque Supabase JS n'est pas chargée.");
    return;
  }

  window.onyxSupabase = window.supabase.createClient(
    config.supabaseUrl,
    config.supabasePublishableKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  window.ONYX_AUTH_READY = true;
})();
