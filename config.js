/* Xenwinx cloud sync settings — the SAME two values go in every copy of this file:
   desktop:  XenwinxStudioDashboard/config.js
   phone/web: XenwinxStudioDashboard/export/config.js
   Get them from Supabase → Project Settings → API. Leave blank to type them in the app instead
   (Profile & settings → Cloud sync). The anon key is safe to publish: row-level security
   only lets each account read its own profile. */
window.XW_CONFIG = {
  supabaseUrl: 'https://cxvvicjtyhkynedezmag.supabase.co',   // Rooted Tales project (table: xw_profiles)
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dnZpY2p0eWhreW5lZGV6bWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NzY2NzIsImV4cCI6MjA4NjQ1MjY3Mn0.lRPFe1dnSfCfJqAerIndT2fhRDIvXk-ryDJ5NIgtvEg'
};
