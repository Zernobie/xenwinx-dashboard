/* Default cloud sync connection (used if config.js isn't loaded, e.g. in Electron Fiddle). Anon key is public by design. */
window.XW_CONFIG = (window.XW_CONFIG && window.XW_CONFIG.supabaseUrl) ? window.XW_CONFIG : { supabaseUrl: 'https://cxvvicjtyhkynedezmag.supabase.co', supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dnZpY2p0eWhreW5lZGV6bWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NzY2NzIsImV4cCI6MjA4NjQ1MjY3Mn0.lRPFe1dnSfCfJqAerIndT2fhRDIvXk-ryDJ5NIgtvEg' };


/* App splash: cottage scene + logo on every launch, then the landing page plays its intro. */
(function xwSplash() {
  if (window.__xwSplash) return; window.__xwSplash = true;
  const st = document.createElement('style'); st.id = 'xenwinx-splash';
  st.textContent = `
#xw-splash { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; cursor: pointer;
  background: #1f3a2c url('assets/splash-cottage.jpg') center / cover no-repeat; transition: opacity .7s ease, visibility .7s; }
#xw-splash::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 30%, rgba(8,22,14,.45) 100%); }
#xw-splash .xw-splash-logo { position: relative; width: min(42vw, 190px); aspect-ratio: 1; border-radius: 28px; background: #fff;
  display: grid; place-items: center; box-shadow: 0 24px 60px rgba(0,20,10,.45); animation: xwSplashLogo 1s cubic-bezier(.2,.8,.2,1.15) .25s both; }
#xw-splash .xw-splash-logo img { width: 88%; height: auto; }
#xw-splash.xw-out { opacity: 0; visibility: hidden; }
#xw-splash .xw-splash-art { display: none; position: absolute; inset: 0; background: url('assets/splash-cottage.jpg') center / contain no-repeat; }
@media (min-aspect-ratio: 1/1) {
  #xw-splash::before { -webkit-backdrop-filter: blur(28px) brightness(.7); backdrop-filter: blur(28px) brightness(.7); background: rgba(8,22,14,.25); }
  #xw-splash .xw-splash-art { display: block; }
}
@keyframes xwSplashLogo { from { opacity: 0; transform: scale(.6) translateY(20px); } to { opacity: 1; transform: none; } }
html.xw-splashing .gate-intro, html.xw-splashing .gate-intro * { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce) { #xw-splash .xw-splash-logo { animation: none; } }`;
  document.head.appendChild(st);
  const el = document.createElement('div'); el.id = 'xw-splash'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<div class="xw-splash-art"></div><div class="xw-splash-logo"><img src="assets/xenwinx-logo.png" alt=""></div>';
  document.documentElement.classList.add('xw-splashing');
  (document.body || document.documentElement).appendChild(el);
  let done = false;
  const finish = () => { if (done) return; done = true; el.classList.add('xw-out');
    document.documentElement.classList.remove('xw-splashing'); setTimeout(() => el.remove(), 800); };
  el.addEventListener('click', finish);
  setTimeout(finish, 2200);
})();

/* Xenwinx Studio Dashboard — full app, self-contained for Electron Fiddle. */

(function injectStyles() {
  const css = "* { box-sizing: border-box; }\nhtml, body { margin: 0; height: 100%; }\nbody {\n  font-family: 'Work Sans', sans-serif;\n  color: var(--font-color, #213247);\n  background: var(--bg-color, #e8f1fb);\n}\ninput, select, textarea, button { font-family: 'Work Sans', sans-serif; }\n::-webkit-scrollbar { width: 10px; height: 10px; }\n::-webkit-scrollbar-thumb { background: oklch(0.72 0.06 240); border-radius: 6px; }\n::-webkit-scrollbar-track { background: transparent; }\n\n.app {\n  display: flex;\n  height: 100vh;\n  width: 100%;\n  background: linear-gradient(160deg, var(--bg-color, #e8f1fb), color-mix(in oklch, var(--bg-color, #e8f1fb) 65%, oklch(0.86 0.05 250) 35%));\n  color: var(--font-color, #213247);\n  text-shadow: var(--glow, 0 0 6px oklch(0.75 0.1 240 / 0.35));\n  overflow: hidden;\n}\n\n/* Sidebar */\n.sidebar {\n  width: 250px;\n  flex-shrink: 0;\n  background: linear-gradient(180deg, rgba(255,255,255,0.5), rgba(210,225,245,0.28));\n  backdrop-filter: blur(20px);\n  -webkit-backdrop-filter: blur(20px);\n  border-right: 1px solid rgba(255,255,255,0.4);\n  box-shadow: 4px 0 30px rgba(60,90,140,0.1);\n  display: flex;\n  flex-direction: column;\n  padding: 24px 14px;\n  gap: 22px;\n  overflow-y: auto;\n}\n.brand { display: flex; align-items: center; gap: 9px; padding: 2px 10px 6px; position: relative; }\n.brand-swirl { position: absolute; left: -6px; top: -6px; opacity: .35; }\n.brand-logo { width: 28px; height: 28px; object-fit: contain; border-radius: 6px; background: oklch(0.97 0.005 195); position: relative; }\n.brand-name { font-family: 'Space Grotesk', sans-serif; font-size: 19px; font-weight: 600; letter-spacing: .01em; }\n.brand-dot { background: linear-gradient(90deg, oklch(0.5 0.07 195), oklch(0.42 0.066 195)); -webkit-background-clip: text; background-clip: text; color: transparent; }\n\n.nav-group { display: flex; flex-direction: column; gap: 4px; }\n.nav-label { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: oklch(0.56 0.02 80); padding: 0 10px; margin-bottom: 2px; }\n.nav-btn {\n  text-align: left; padding: 9px 12px; border-radius: 8px; border: none; cursor: pointer;\n  font-size: 13.5px; background: transparent; color: oklch(0.44 0.02 80); font-weight: 500;\n}\n.nav-btn.active { background: oklch(0.85 0.035 195); color: oklch(0.3 0.05 195); font-weight: 600; }\n\n/* Main */\n.main { flex: 1; overflow-y: auto; padding: 32px 40px 60px; }\n.view { max-width: 1100px; }\n.view.narrow { max-width: 900px; }\n.view.narrower { max-width: 800px; }\n\nh1.page-title { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 600; margin: 0 0 4px; }\n.page-sub { color: oklch(0.46 0.02 80); font-size: 14px; margin-bottom: 24px; }\n.header-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 22px; }\n\n.card {\n  background: linear-gradient(135deg, rgba(255,255,255,0.55), rgba(210,225,245,0.35));\n  backdrop-filter: blur(14px);\n  -webkit-backdrop-filter: blur(14px);\n  border: 1px solid rgba(255,255,255,0.5);\n  box-shadow: 0 4px 24px rgba(60,90,140,0.12);\n  border-radius: 10px;\n  padding: 20px;\n}\n.card.tight { padding: 16px 18px; }\n.card.row { display: flex; align-items: center; gap: 14px; padding: 14px 18px; }\n\n.grid-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; margin-bottom: 28px; }\n.grid-cards.small { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 26px; }\n.overview-card { cursor: pointer; background: linear-gradient(135deg, rgba(255,255,255,0.55), rgba(210,225,245,0.35)); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 4px 24px rgba(60,90,140,0.12); border-radius: 10px; padding: 18px; }\n.overview-card .label { font-size: 13px; color: oklch(0.46 0.02 80); margin-bottom: 10px; }\n.overview-card .stat { margin-top: 12px; font-size: 13px; color: oklch(0.28 0.02 80); }\n\n.badge { display: inline-block; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 99px; border: 1px solid transparent; white-space: nowrap; }\n.badge.sm { font-size: 11px; padding: 3px 9px; }\n.badge.xs { font-size: 11px; padding: 3px 8px; }\n\n.list-col { display: flex; flex-direction: column; gap: 16px; }\n.list-col.tight { gap: 10px; }\n.list-col.tighter { gap: 8px; }\n\n.btn-primary {\n  padding: 9px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600;\n  background: linear-gradient(90deg, oklch(0.5 0.07 195), oklch(0.35 0.06 195)); color: oklch(0.97 0.008 90);\n}\n.ghost-btn {\n  padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 12.5px; font-weight: 600;\n  background: transparent; border: 1px solid oklch(0.75 0.014 80); color: oklch(0.3 0.02 80);\n}\n.ghost-btn.small { padding: 5px 10px; border-radius: 7px; font-size: 11.5px; }\n.danger-btn {\n  padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 12.5px; font-weight: 600;\n  background: transparent; border: 1px solid oklch(0.55 0.15 25); color: oklch(0.5 0.18 25);\n}\n.danger-btn.small { padding: 5px 9px; border-radius: 7px; font-size: 12px; }\n\n.field { display: flex; flex-direction: column; font-size: 12.5px; color: oklch(0.42 0.02 80); gap: 0; margin-bottom: 14px; }\n.field input, .field select, .field textarea {\n  width: 100%; margin-top: 6px; padding: 9px 10px; border-radius: 7px; border: 1px solid oklch(0.78 0.014 80);\n  background: oklch(0.965 0.012 80); color: oklch(0.22 0.02 80); font-size: 13px;\n}\n.field textarea { resize: vertical; }\n.checkbox-field { display: flex; align-items: center; gap: 8px; font-size: 13px; color: oklch(0.28 0.02 80); margin-bottom: 14px; }\n\n.task-row, .step-row {\n  display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: oklch(0.92 0.013 80); border-radius: 7px;\n}\n.substep-row { display: flex; align-items: center; gap: 10px; padding: 6px 10px; background: oklch(0.9 0.014 80); border-radius: 6px; }\n.substep-wrap { display: flex; flex-direction: column; gap: 4px; margin: 4px 0 4px 26px; }\n.workflow-wrap { display: flex; flex-direction: column; gap: 4px; }\n.strike { text-decoration: line-through; }\n\n.progress-track { height: 8px; border-radius: 99px; background: oklch(0.92 0.013 80); overflow: hidden; margin: 14px 0 22px; }\n.progress-track.thin { height: 6px; margin: 0; }\n.progress-fill { height: 100%; background: linear-gradient(90deg, oklch(0.5 0.07 195), oklch(0.35 0.06 195)); }\n\n.chip {\n  padding: 6px 11px; border-radius: 99px; border: 1px solid oklch(0.78 0.014 80); background: transparent;\n  color: oklch(0.5 0.02 80); font-size: 11.5px; font-weight: 600; cursor: pointer;\n}\n.chip.active { border-color: color-mix(in oklch, oklch(0.52 0.15 150) 45%, transparent); background: color-mix(in oklch, oklch(0.52 0.15 150) 18%, transparent); color: oklch(0.55 0.14 150); }\n\n.filter-chip {\n  padding: 6px 12px; border-radius: 99px; border: 1px solid oklch(0.78 0.014 80); background: transparent;\n  color: oklch(0.42 0.02 80); font-size: 12px; cursor: pointer;\n}\n.filter-chip.active { border-color: oklch(0.62 0.09 50); background: color-mix(in oklch, oklch(0.62 0.09 50) 18%, transparent); color: oklch(0.32 0.06 195); }\n\n.view-btn {\n  padding: 7px 14px; border-radius: 7px; border: 1px solid oklch(0.78 0.014 80); background: transparent;\n  color: oklch(0.42 0.02 80); font-size: 12.5px; font-weight: 600; cursor: pointer;\n}\n.view-btn.active { border-color: oklch(0.62 0.09 50); background: color-mix(in oklch, oklch(0.62 0.09 50) 18%, transparent); color: oklch(0.32 0.06 195); }\n\na { color: oklch(0.5 0.07 195); }\na:hover { color: oklch(0.35 0.06 195); }\n\n/* Modal */\n.modal-overlay {\n  position: fixed; inset: 0; background: oklch(0.25 0.02 80 / 0.45);\n  display: flex; align-items: center; justify-content: center; z-index: 50;\n}\n.modal-overlay.hidden { display: none; }\n.modal {\n  width: 440px; max-height: 82vh; overflow-y: auto; background: oklch(0.995 0.005 80);\n  border: 1px solid oklch(0.78 0.014 80); border-radius: 12px; padding: 24px;\n}\n.modal-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 600; margin-bottom: 18px; }\n.modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 22px; }\n\n/* Settings */\n.settings-toggle {\n  position: fixed; bottom: 20px; right: 20px; width: 44px; height: 44px; border-radius: 50%;\n  border: 1px solid rgba(255,255,255,0.5); background: linear-gradient(135deg, rgba(255,255,255,0.55), rgba(210,225,245,0.35)); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 4px 24px rgba(60,90,140,0.12); cursor: pointer; font-size: 18px; z-index: 60;\n}\n.settings-panel {\n  position: fixed; bottom: 74px; right: 20px; width: 240px; background: linear-gradient(135deg, rgba(255,255,255,0.55), rgba(210,225,245,0.35)); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 4px 24px rgba(60,90,140,0.12);\n  border-radius: 10px; padding: 16px; z-index: 60;\n  display: flex; flex-direction: column; gap: 12px;\n}\n.settings-panel.hidden { display: none; }\n.settings-title { font-weight: 600; font-size: 13px; }\n.settings-row { display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; gap: 10px; }\n.settings-row input[type=\"color\"] { width: 40px; height: 28px; border: none; padding: 0; background: none; cursor: pointer; }\n.settings-row select { padding: 4px 6px; border-radius: 6px; border: 1px solid oklch(0.78 0.014 80); }\n\n.back-btn {\n  display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px;\n  border: 1px solid rgba(255,255,255,0.5);\n  background: linear-gradient(135deg, rgba(255,255,255,0.5), rgba(210,225,245,0.3));\n  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);\n  color: oklch(0.32 0.05 240); font-size: 13px; font-weight: 600; cursor: pointer; margin-bottom: 16px;\n}\n.back-btn.hidden { display: none; }\n.tracker-item { background: rgba(255,255,255,0.35); border: 1px solid rgba(255,255,255,0.45); border-radius: 8px; padding: 10px 12px; }\n.tracker-item-row { display: flex; align-items: center; gap: 10px; }\n.tracker-item-text { flex: 1; background: transparent; border: none; outline: none; font-size: 13.5px; color: inherit; font-family: 'Work Sans', sans-serif; }\n.tracker-item-text.strike { text-decoration: line-through; opacity: 0.6; }\n.attach-btn { padding: 5px 10px; border-radius: 7px; font-size: 11.5px; font-weight: 600; background: transparent; border: 1px solid oklch(0.75 0.014 80); color: oklch(0.3 0.02 80); cursor: pointer; }\n.attach-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; margin-left: 26px; }\n.attach-chip { position: relative; }\n.attach-chip img { width: 48px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.5); display: block; }\n.attach-name { font-size: 11px; padding: 6px 10px; border-radius: 6px; background: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.5); max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; }\n.attach-remove { position: absolute; top: -6px; right: -6px; width: 16px; height: 16px; border-radius: 99px; border: none; background: oklch(0.68 0.19 25); color: white; font-size: 10px; line-height: 1; cursor: pointer; padding: 0; }\n.daily-check-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }\n.dc-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4px; }\n.dc-label-done { color: oklch(0.52 0.15 150); }\n.dc-label-next { color: oklch(0.5 0.07 195); }\n.dc-label-block { color: oklch(0.68 0.19 25); }\n.dc-text { font-size: 13.5px; line-height: 1.5; }\n\n\n/* ===== Universe layer (added in the universe-pillar restructure) ===== */\nbody { background: color-mix(in srgb, var(--bg-color, #e8f1fb) 90%, var(--u-primary, #0b1330)); }\n.u-switcher { display: flex; flex-direction: column; gap: 4px; }\n.u-tab {\n  display: flex; align-items: center; gap: 9px; width: 100%; text-align: left; cursor: pointer;\n  padding: 7px 10px; border-radius: 9px; border: 1px solid transparent; background: rgba(255,255,255,0.28);\n  color: oklch(0.36 0.02 80);\n}\n.u-tab:hover { background: rgba(255,255,255,0.5); }\n.u-tab.active {\n  background: color-mix(in srgb, var(--u-accent) 20%, rgba(255,255,255,0.6));\n  border-color: color-mix(in srgb, var(--u-accent) 55%, transparent);\n}\n.u-dot { width: 10px; height: 10px; border-radius: 99px; flex-shrink: 0; box-shadow: 0 0 0 2px rgba(255,255,255,0.5); }\n.u-tab-body { display: flex; flex-direction: column; gap: 1px; min-width: 0; }\n.u-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.u-status { font-size: 10px; letter-spacing: .06em; text-transform: uppercase; color: oklch(0.55 0.02 80); }\n.u-status-active { color: oklch(0.5 0.13 150); }\n.u-status-upcoming { color: oklch(0.58 0.13 70); }\n.u-status-complete { color: oklch(0.5 0.07 240); }\n.u-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }\n.u-chip { font-size: 11.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 5px 11px; border-radius: 99px; border: 1px solid transparent; color: oklch(0.3 0.03 80); }\n.u-header-sub { font-size: 12.5px; color: oklch(0.48 0.02 80); }\n.big-stat { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 600; margin-top: 4px; }\n.empty { font-size: 13px; color: oklch(0.5 0.02 80); padding: 22px; border-radius: 10px; border: 1px dashed oklch(0.8 0.014 80); background: rgba(255,255,255,0.35); }\n\n/* Skin-driven chrome */\n.nav-btn.active { background: color-mix(in srgb, var(--u-accent) 26%, rgba(255,255,255,0.55)); color: oklch(0.26 0.03 80); font-weight: 600; }\n.btn-primary { background: linear-gradient(90deg, color-mix(in srgb, var(--u-accent) 88%, #000), color-mix(in srgb, var(--u-primary) 60%, var(--u-accent))); color: #fff; }\n.progress-fill { background: linear-gradient(90deg, var(--u-accent), color-mix(in srgb, var(--u-primary) 45%, var(--u-accent))); }\n.brand-dot { background: linear-gradient(90deg, var(--u-accent), var(--u-accent2)); -webkit-background-clip: text; background-clip: text; color: transparent; }\n.chip.active, .filter-chip.active, .view-btn.active { border-color: color-mix(in srgb, var(--u-accent) 60%, transparent); background: color-mix(in srgb, var(--u-accent) 20%, transparent); }\nxenwinx-dashboard { display: block; height: 100%; }\n\n.rollup-row { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 12px; align-items: center; padding: 11px 20px; font-size: 13px; border-bottom: 1px solid oklch(0.88 0.013 80); }\n.rollup-row:last-child { border-bottom: none; }\n.rollup-head { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: oklch(0.52 0.02 80); font-weight: 600; }\n.rollup-total { font-weight: 700; background: rgba(255,255,255,0.4); }\n\n\n/* ===== Signature layer — distinctive Xenwinx chrome ===== */\nbody {\n  background:\n    radial-gradient(1100px 620px at 92% -8%, color-mix(in srgb, var(--u-accent) 16%, transparent), transparent 70%),\n    radial-gradient(900px 520px at 8% 108%, color-mix(in srgb, var(--u-accent2) 13%, transparent), transparent 72%),\n    color-mix(in srgb, var(--bg-color, #e8f1fb) 92%, var(--u-primary, #0b1330));\n}\n\n/* Sidebar becomes a deep universe-tinted rail */\n.sidebar {\n  width: 262px;\n  background: linear-gradient(180deg, var(--u-primary), color-mix(in srgb, var(--u-primary) 78%, #000));\n  border-right: 1px solid color-mix(in srgb, var(--u-accent) 32%, transparent);\n  box-shadow: 18px 0 44px -34px rgba(0,0,0,.55);\n  padding: 22px 14px 30px;\n  gap: 22px;\n}\n.sidebar::after {\n  content: ''; position: absolute; top: 0; right: 0; width: 1px; height: 100%;\n  background: linear-gradient(180deg, var(--u-accent), transparent 65%);\n}\n.sidebar { position: relative; }\n.brand { padding: 0 6px 4px; }\n.brand-name { color: rgba(255,255,255,.95); font-size: 20px; letter-spacing: -.01em; }\n.brand-logo { background: rgba(255,255,255,.92); }\n.brand-swirl circle { stroke: color-mix(in srgb, var(--u-accent) 70%, #fff); }\n.nav-label {\n  color: rgba(255,255,255,.42); font-size: 10px; letter-spacing: .16em; padding: 0 8px;\n  display: flex; align-items: center; gap: 8px;\n}\n.nav-label::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.14); }\n.nav-btn {\n  position: relative; color: rgba(255,255,255,.68); font-size: 13px; padding: 8px 12px 8px 14px;\n  border-radius: 7px; letter-spacing: .005em;\n}\n.nav-btn:hover { background: rgba(255,255,255,.07); color: rgba(255,255,255,.92); }\n.nav-btn.active {\n  background: color-mix(in srgb, var(--u-accent) 16%, rgba(255,255,255,.06));\n  color: #fff; font-weight: 600;\n}\n.nav-btn.active::before {\n  content: ''; position: absolute; left: 0; top: 7px; bottom: 7px; width: 3px; border-radius: 99px;\n  background: linear-gradient(180deg, var(--u-accent), var(--u-accent2));\n}\n.u-tab { background: rgba(255,255,255,.05); color: rgba(255,255,255,.74); border-color: rgba(255,255,255,.08); }\n.u-tab:hover { background: rgba(255,255,255,.1); }\n.u-tab.active {\n  background: color-mix(in srgb, var(--u-accent) 22%, rgba(255,255,255,.06));\n  border-color: color-mix(in srgb, var(--u-accent) 65%, transparent);\n  color: #fff;\n}\n.u-dot { box-shadow: 0 0 0 3px color-mix(in srgb, var(--u-primary) 70%, #000); }\n.u-status { color: rgba(255,255,255,.45); }\n.u-status-active { color: color-mix(in srgb, var(--u-accent) 75%, #fff); }\n.u-status-upcoming { color: rgba(255,255,255,.5); }\n\n/* Editorial main canvas */\n.main { padding: 40px 46px 70px; }\nh1.page-title {\n  position: relative; padding-top: 16px; font-size: 34px; letter-spacing: -.025em; line-height: 1.05;\n}\nh1.page-title::before {\n  content: ''; position: absolute; top: 0; left: 0; width: 40px; height: 4px; border-radius: 99px;\n  background: linear-gradient(90deg, var(--u-accent), var(--u-accent2));\n}\n.page-sub { font-size: 13.5px; letter-spacing: .005em; }\n\n/* Adjustable type colours (set from the sidebar Appearance panel) */\nh1.page-title { color: var(--heading-color, inherit); }\n.page-sub, .u-header-sub { color: var(--subheading-color, oklch(0.46 0.02 80)); }\n.modal-title, .settings-title { color: var(--heading-color, inherit); }\n\n/* Editable universe pillars */\n.pillar-row { display: flex; align-items: center; gap: 4px; }\n.pillar-tick { color: var(--u-accent); font-weight: 700; }\n.pillar-edit-btn {\n  margin-left: auto; border: none; background: rgba(255,255,255,.12); color: rgba(255,255,255,.8);\n  font: 600 10px/1 'Work Sans', sans-serif; letter-spacing: .08em; text-transform: uppercase;\n  padding: 4px 7px; border-radius: 6px; cursor: pointer;\n}\n.pillar-edit-btn:hover { background: rgba(255,255,255,.22); }\n.nav-label::after { display: none; }\n.pillar-mini {\n  flex-shrink: 0; width: 24px; height: 24px; border-radius: 6px; cursor: pointer;\n  border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.06);\n  color: rgba(255,255,255,.75); font-size: 12px; line-height: 1;\n}\n.pillar-mini:hover { background: rgba(255,255,255,.16); }\n.pillar-mini.danger { color: oklch(0.72 0.15 25); }\n.pillar-add {\n  margin-top: 6px; width: 100%; padding: 7px 10px; border-radius: 8px; cursor: pointer;\n  border: 1px dashed rgba(255,255,255,.28); background: transparent; color: rgba(255,255,255,.72);\n  font: 500 12px 'Work Sans', sans-serif;\n}\n.pillar-add:hover { background: rgba(255,255,255,.08); }\n\n/* Panels: hairline + lift instead of heavy blur */\n.card, .overview-card {\n  background: linear-gradient(155deg, rgba(255,255,255,.72), rgba(255,255,255,.5));\n  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);\n  border: 1px solid rgba(255,255,255,.75);\n  border-radius: 16px;\n  box-shadow: 0 1px 0 rgba(255,255,255,.6) inset, 0 18px 34px -28px rgba(20,30,50,.55);\n}\n.overview-card { transition: transform .16s ease, box-shadow .16s ease; }\n.overview-card:hover { transform: translateY(-2px); box-shadow: 0 26px 40px -28px rgba(20,30,50,.6); }\n.big-stat { font-size: 26px; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }\n.rollup-row { font-variant-numeric: tabular-nums; }\n.badge { letter-spacing: .02em; }\n.u-chip { background: color-mix(in srgb, var(--u-accent) 20%, transparent); border-color: color-mix(in srgb, var(--u-accent) 50%, transparent); }\n.btn-primary { box-shadow: 0 10px 22px -14px color-mix(in srgb, var(--u-primary) 70%, var(--u-accent)); }\n.back-btn { border-radius: 99px; }\n\n\n/* ===== Theme system — variable sets swapped by html.theme-* ===== */\n:root {\n  --t-font-body: 'Work Sans', sans-serif; --t-font-head: 'Space Grotesk', sans-serif;\n  --t-head-weight: 600; --t-head-case: none; --t-head-track: -.02em;\n  --t-ink: #213247; --t-ink-2: oklch(0.3 0.02 80); --t-ink-3: oklch(0.4 0.02 80); --t-muted: oklch(0.46 0.02 80); --t-faint: oklch(0.56 0.02 80);\n  --t-surface: rgba(255,255,255,.66); --t-surface-solid: oklch(0.995 0.004 80); --t-surface-2: oklch(0.92 0.013 80); --t-input: oklch(0.965 0.012 80);\n  --t-line: rgba(255,255,255,.8); --t-line-2: oklch(0.78 0.014 80); --t-line-3: oklch(0.88 0.013 80); --t-bw: 1px;\n  --t-radius: 16px; --t-radius-sm: 8px; --t-radius-badge: 99px; --t-avatar-radius: 50%; --t-avatar-ring: 0 0 0 2px rgba(255,255,255,.7);\n  --t-side-ink: rgba(255,255,255,.95); --t-side-muted: rgba(255,255,255,.68); --t-side-faint: rgba(255,255,255,.45); --t-side-hover: rgba(255,255,255,.07); --t-side-line: rgba(255,255,255,.12);\n  --t-btn-bg: linear-gradient(90deg, color-mix(in srgb, var(--u-accent) 88%, #000), color-mix(in srgb, var(--u-primary) 60%, var(--u-accent))); --t-btn-ink: #fff;\n  --t-page: radial-gradient(1100px 620px at 92% -8%, color-mix(in srgb, var(--u-accent) 16%, transparent), transparent 70%), radial-gradient(900px 520px at 8% 108%, color-mix(in srgb, var(--u-accent2) 13%, transparent), transparent 72%), color-mix(in srgb, var(--bg-color, #e8f1fb) 92%, var(--u-primary, #0b1330));\n}\nhtml.theme-japanese {\n  --t-font-head: 'Shippori Mincho', serif; --t-font-body: 'Zen Kaku Gothic New', sans-serif;\n  --t-head-weight: 700; --t-head-case: none; --t-head-track: .01em;\n  --t-ink: #231f1c; --t-ink-2: #3a332d; --t-ink-3: #4f463e; --t-muted: #6b6158; --t-faint: #81766b;\n  --t-page: radial-gradient(700px 420px at 100% 0, rgba(194,59,34,.08), transparent 70%), var(--bg-color);\n  --t-sidebar: radial-gradient(circle at 50% 100%, transparent 8px, rgba(244,238,227,.05) 9px, rgba(244,238,227,.05) 10px, transparent 11px) 0 0/22px 11px, #1e2638;\n  --t-sidebar-border: 1px solid rgba(194,59,34,.6);\n  --t-side-ink: #f4eee3; --t-side-muted: rgba(244,238,227,.72); --t-side-faint: rgba(244,238,227,.5); --t-side-hover: rgba(244,238,227,.07); --t-side-active: rgba(194,59,34,.28); --t-side-line: rgba(244,238,227,.14);\n  --t-surface: #fbf8f2; --t-surface-solid: #fdfbf7; --t-surface-2: #efe8dc; --t-input: #f7f2e9; --t-line: #d8cdbb; --t-line-2: #c7baa4; --t-line-3: #e3d9c9; --t-bw: 1px;\n  --t-radius: 3px; --t-radius-sm: 2px; --t-radius-badge: 2px; --t-shadow: 0 1px 0 #d8cdbb; --t-shadow-hover: 0 10px 22px -16px rgba(35,31,28,.45);\n  --t-btn-bg: #c23b22; --t-btn-ink: #fff; --t-btn-border: 1px solid #a83220; --t-btn-shadow: none;\n  --t-badge-case: none; --t-badge-icon: none; --t-badge-bw: 1px;\n  --t-avatar-radius: 4px; --t-avatar-ring: 0 0 0 1px #c7baa4;\n}\nhtml.theme-anime {\n  --t-font-head: 'Mochiy Pop One', sans-serif; --t-font-body: 'M PLUS Rounded 1c', sans-serif;\n  --t-head-weight: 400; --t-head-case: none; --t-head-track: 0;\n  --t-ink: #2a2140; --t-ink-2: #3a2f55; --t-ink-3: #4d4268; --t-muted: #655b82; --t-faint: #7e7499;\n  --t-page: radial-gradient(800px 500px at 92% -10%, rgba(255,95,162,.18), transparent 70%), radial-gradient(700px 500px at 0% 110%, rgba(108,140,255,.18), transparent 70%), var(--bg-color);\n  --t-sidebar: linear-gradient(180deg, #ffe0f0, #e0e6ff); --t-sidebar-border: 2px solid #ffc4e1;\n  --t-side-ink: #2a2140; --t-side-muted: #4f4570; --t-side-faint: #7a6f98; --t-side-hover: rgba(255,255,255,.55); --t-side-active: #ffffff; --t-side-line: rgba(42,33,64,.1);\n  --t-surface: #ffffff; --t-surface-solid: #ffffff; --t-surface-2: #fbeef8; --t-input: #fff8fc; --t-line: #ffd0e8; --t-line-2: #e6c6e3; --t-line-3: #f6e0f0; --t-bw: 2px;\n  --t-radius: 22px; --t-radius-sm: 14px; --t-radius-badge: 99px; --t-shadow: 0 12px 26px -16px rgba(255,95,162,.5); --t-shadow-hover: 0 18px 32px -16px rgba(108,140,255,.5);\n  --t-btn-bg: linear-gradient(90deg, #ff5fa2, #8a7bff); --t-btn-ink: #fff; --t-btn-border: none; --t-btn-shadow: 0 8px 18px -8px rgba(255,95,162,.7);\n  --t-badge-case: none; --t-badge-icon: '\\2726\\00a0'; --t-badge-bw: 1.5px;\n  --t-avatar-radius: 50%; --t-avatar-ring: 0 0 0 3px #fff, 0 0 0 5px #ffc4e1;\n}\nhtml.theme-steampunk {\n  --t-font-head: 'Cinzel', serif; --t-font-body: 'Spectral', serif;\n  --t-head-weight: 700; --t-head-case: none; --t-head-track: .03em;\n  --t-ink: #2e2116; --t-ink-2: #3d2d1e; --t-ink-3: #4e3b28; --t-muted: #65503a; --t-faint: #7c6649;\n  --t-page: radial-gradient(1000px 600px at 50% -20%, rgba(255,244,214,.7), transparent 70%), radial-gradient(circle at 100% 100%, rgba(120,70,30,.2), transparent 50%), var(--bg-color);\n  --t-sidebar: linear-gradient(180deg, #3b2718, #22160d); --t-sidebar-border: 4px double #b8862f;\n  --t-side-ink: #f1e3c2; --t-side-muted: rgba(241,227,194,.74); --t-side-faint: rgba(241,227,194,.5); --t-side-hover: rgba(184,134,47,.14); --t-side-active: rgba(184,134,47,.3); --t-side-line: rgba(184,134,47,.32);\n  --t-surface: #f6ecd6; --t-surface-solid: #f8f0dd; --t-surface-2: #ebdcbc; --t-input: #fbf5e6; --t-line: #a8823c; --t-line-2: #b0925a; --t-line-3: #dcc89e; --t-bw: 1px;\n  --t-radius: 4px; --t-radius-sm: 3px; --t-radius-badge: 2px;\n  --t-shadow: inset 0 0 0 3px #f6ecd6, inset 0 0 0 4px rgba(168,130,60,.45), 0 12px 22px -16px rgba(46,33,22,.65); --t-shadow-hover: inset 0 0 0 3px #f6ecd6, inset 0 0 0 4px rgba(168,130,60,.7), 0 16px 26px -16px rgba(46,33,22,.7);\n  --t-btn-bg: linear-gradient(180deg, #d6a750, #9c7128); --t-btn-ink: #2a1a0c; --t-btn-border: 1px solid #6e4f1a; --t-btn-shadow: inset 0 1px 0 rgba(255,255,255,.45), 0 2px 0 #6e4f1a;\n  --t-badge-case: uppercase; --t-badge-icon: '\\2699\\00a0'; --t-badge-bw: 1px;\n  --t-avatar-radius: 50%; --t-avatar-ring: 0 0 0 3px #b8862f, 0 0 0 4px #6e4f1a;\n}\nhtml.theme-gamer {\n  color-scheme: dark;\n  --t-font-head: 'Orbitron', sans-serif; --t-font-body: 'Chakra Petch', sans-serif;\n  --t-head-weight: 700; --t-head-case: uppercase; --t-head-track: .06em;\n  --t-ink: #e4ecff; --t-ink-2: #d2dbf2; --t-ink-3: #b8c2dc; --t-muted: #95a1c0; --t-faint: #7e8aa8;\n  --t-page: linear-gradient(rgba(61,255,168,.035) 1px, transparent 1px) 0 0/100% 32px, linear-gradient(90deg, rgba(61,255,168,.035) 1px, transparent 1px) 0 0/32px 100%, radial-gradient(900px 500px at 100% 0, rgba(255,63,210,.12), transparent 70%), var(--bg-color);\n  --t-sidebar: #070910; --t-sidebar-border: 1px solid rgba(61,255,168,.4);\n  --t-side-ink: #e4ecff; --t-side-muted: rgba(228,236,255,.7); --t-side-faint: rgba(228,236,255,.46); --t-side-hover: rgba(61,255,168,.07); --t-side-active: rgba(61,255,168,.14); --t-side-line: rgba(61,255,168,.18);\n  --t-surface: #121726; --t-surface-solid: #121726; --t-surface-2: #1a2033; --t-input: #0b0f1a; --t-line: rgba(61,255,168,.26); --t-line-2: #2e3858; --t-line-3: #222a42; --t-bw: 1px;\n  --t-radius: 0; --t-radius-sm: 0; --t-radius-badge: 0; --t-shadow: 0 14px 30px -20px rgba(61,255,168,.45); --t-shadow-hover: 0 0 0 1px rgba(61,255,168,.5), 0 14px 30px -16px rgba(61,255,168,.6);\n  --t-btn-bg: #3dffa8; --t-btn-ink: #04130c; --t-btn-border: none; --t-btn-shadow: 0 0 16px rgba(61,255,168,.45);\n  --t-badge-case: uppercase; --t-badge-icon: '\\25b8\\00a0'; --t-badge-bw: 1px;\n  --t-avatar-radius: 0; --t-avatar-ring: 0 0 0 1px #3dffa8;\n}\nhtml.theme-cartoon {\n  --t-font-head: 'Luckiest Guy', sans-serif; --t-font-body: 'Baloo 2', sans-serif;\n  --t-head-weight: 400; --t-head-case: none; --t-head-track: .02em;\n  --t-ink: #1b1b1b; --t-ink-2: #222; --t-ink-3: #303030; --t-muted: #474747; --t-faint: #5c5c5c;\n  --t-page: radial-gradient(circle, rgba(27,27,27,.09) 1.2px, transparent 1.7px) 0 0/18px 18px, var(--bg-color);\n  --t-sidebar: #2a62d6; --t-sidebar-border: 3px solid #1b1b1b;\n  --t-side-ink: #fff; --t-side-muted: rgba(255,255,255,.9); --t-side-faint: rgba(255,255,255,.75); --t-side-hover: rgba(255,255,255,.14); --t-side-active: #ffbe0b; --t-side-active-ink: #1b1b1b; --t-side-line: rgba(255,255,255,.35);\n  --t-surface: #ffffff; --t-surface-solid: #ffffff; --t-surface-2: #fff1c9; --t-input: #fffaf0; --t-line: #1b1b1b; --t-line-2: #1b1b1b; --t-line-3: #e8dcc0; --t-bw: 3px;\n  --t-radius: 16px; --t-radius-sm: 12px; --t-radius-badge: 99px; --t-shadow: 5px 5px 0 #1b1b1b; --t-shadow-hover: 7px 7px 0 #1b1b1b;\n  --t-btn-bg: #ff5a5f; --t-btn-ink: #fff; --t-btn-border: 3px solid #1b1b1b; --t-btn-shadow: 3px 3px 0 #1b1b1b;\n  --t-badge-case: none; --t-badge-icon: '\\2605\\00a0'; --t-badge-bw: 2px;\n  --t-avatar-radius: 50%; --t-avatar-ring: 0 0 0 3px #1b1b1b;\n}\n\n/* Shared themed chrome (every theme except Classic) */\nhtml.themed body, html.themed .app { background: var(--t-page); }\nhtml.themed body { font-family: var(--t-font-body); }\nhtml.themed input, html.themed select, html.themed textarea, html.themed button, html.themed .tracker-item-text, html.themed .pillar-add, html.themed .pillar-edit-btn { font-family: var(--t-font-body); }\nhtml.themed h1.page-title, html.themed .modal-title, html.themed .brand-name, html.themed .big-stat, html.themed .settings-title { font-family: var(--t-font-head); font-weight: var(--t-head-weight); text-transform: var(--t-head-case); letter-spacing: var(--t-head-track); }\nhtml.themed h1.page-title { font-size: 32px; line-height: 1.15; }\nhtml.themed .sidebar { background: var(--t-sidebar); border-right: var(--t-sidebar-border); box-shadow: none; }\nhtml.themed .sidebar::after { display: none; }\nhtml.themed .brand-name { color: var(--t-side-ink); }\nhtml.themed .nav-label { color: var(--t-side-faint); }\nhtml.themed .nav-btn { color: var(--t-side-muted); border-radius: var(--t-radius-sm); }\nhtml.themed .nav-btn:hover { background: var(--t-side-hover); color: var(--t-side-ink); }\nhtml.themed .nav-btn.active { background: var(--t-side-active); color: var(--t-side-active-ink, var(--t-side-ink)); }\nhtml.themed .u-tab { background: var(--t-side-hover); color: var(--t-side-muted); border-color: var(--t-side-line); border-radius: var(--t-radius-sm); }\nhtml.themed .u-tab:hover { color: var(--t-side-ink); }\nhtml.themed .u-tab.active { background: var(--t-side-active); color: var(--t-side-active-ink, var(--t-side-ink)); border-color: var(--u-accent); }\nhtml.themed .u-status, html.themed .u-status-upcoming, html.themed .u-status-active, html.themed .u-status-complete { color: var(--t-side-faint); }\nhtml.themed .u-tab.active .u-status { color: inherit; opacity: .8; }\nhtml.themed .u-dot { box-shadow: 0 0 0 2px var(--t-side-line); }\nhtml.themed .pillar-edit-btn, html.themed .pillar-mini { background: var(--t-side-hover); color: var(--t-side-muted); border-color: var(--t-side-line); }\nhtml.themed .pillar-add { border-color: var(--t-side-line); color: var(--t-side-muted); }\nhtml.themed .card, html.themed .overview-card { background: var(--t-surface); border: var(--t-bw) solid var(--t-line); border-radius: var(--t-radius); box-shadow: var(--t-shadow); backdrop-filter: none; -webkit-backdrop-filter: none; }\nhtml.themed .overview-card:hover { box-shadow: var(--t-shadow-hover); }\nhtml.themed .overview-card .label, html.themed .field { color: var(--t-muted); }\nhtml.themed .overview-card .stat, html.themed .checkbox-field { color: var(--t-ink-2); }\nhtml.themed .field input, html.themed .field select, html.themed .field textarea { background: var(--t-input); color: var(--t-ink); border: 1px solid var(--t-line-2); border-radius: var(--t-radius-sm); }\nhtml.themed .btn-primary { background: var(--t-btn-bg); color: var(--t-btn-ink); border: var(--t-btn-border); box-shadow: var(--t-btn-shadow); border-radius: var(--t-radius-sm); }\nhtml.themed .ghost-btn, html.themed .attach-btn, html.themed .view-btn { border-color: var(--t-line-2); color: var(--t-ink-2); border-radius: var(--t-radius-sm); }\nhtml.themed .chip, html.themed .filter-chip { border-color: var(--t-line-2); color: var(--t-ink-3); border-radius: var(--t-radius-badge); }\nhtml.themed .chip.active, html.themed .filter-chip.active, html.themed .view-btn.active { color: var(--t-ink); }\nhtml.themed .danger-btn { border-radius: var(--t-radius-sm); }\nhtml.themed .back-btn { background: var(--t-surface); border: 1px solid var(--t-line-2); color: var(--t-ink-2); backdrop-filter: none; -webkit-backdrop-filter: none; border-radius: var(--t-radius-sm); }\nhtml.themed .task-row, html.themed .step-row, html.themed .substep-row { background: var(--t-surface-2); border-radius: var(--t-radius-sm); }\nhtml.themed .progress-track { background: var(--t-surface-2); border-radius: var(--t-radius-badge); }\nhtml.themed .progress-fill { background: var(--u-accent); }\nhtml.themed .tracker-item, html.themed .attach-name { background: var(--t-surface-2); border-color: var(--t-line-2); border-radius: var(--t-radius-sm); }\nhtml.themed .empty { background: transparent; border-color: var(--t-line-2); color: var(--t-muted); border-radius: var(--t-radius); }\nhtml.themed .rollup-row { border-bottom-color: var(--t-line-3); }\nhtml.themed .rollup-head { color: var(--t-faint); }\nhtml.themed .rollup-total { background: var(--t-surface-2); }\nhtml.themed .modal { background: var(--t-surface-solid); border: var(--t-bw) solid var(--t-line); border-radius: var(--t-radius); color: var(--t-ink); box-shadow: var(--t-shadow); }\nhtml.themed .settings-panel, html.themed .settings-toggle { background: var(--t-surface-solid); border: var(--t-bw) solid var(--t-line); color: var(--t-ink); backdrop-filter: none; -webkit-backdrop-filter: none; box-shadow: var(--t-shadow); }\nhtml.themed .settings-panel { border-radius: var(--t-radius); }\nhtml.themed .settings-row select { background: var(--t-input); color: var(--t-ink); border-color: var(--t-line-2); }\nhtml.themed .badge { border-radius: var(--t-radius-badge); text-transform: var(--t-badge-case); border-width: var(--t-badge-bw); }\nhtml.themed .badge::before { content: var(--t-badge-icon); }\nhtml.themed .u-chip { color: var(--t-ink); border-radius: var(--t-radius-badge); }\nhtml.themed .u-header-sub { color: var(--subheading-color, var(--t-muted)); }\n\n/* Japanese — hanko stamp marks, hinomaru nav dot */\nhtml.theme-japanese h1.page-title::before { width: 14px; height: 14px; border-radius: 2px; background: #c23b22; }\nhtml.theme-japanese .nav-btn.active::before { width: 6px; height: 6px; top: 50%; bottom: auto; margin-top: -3px; left: 4px; border-radius: 50%; background: #c23b22; }\nhtml.theme-japanese .badge { letter-spacing: .04em; }\n/* Anime — sparkles and gradients */\nhtml.theme-anime h1.page-title::before { width: 64px; height: 6px; background: linear-gradient(90deg, #ff5fa2, #ffc46b, #6c8cff); }\nhtml.theme-anime .nav-btn.active::before { content: '\\2726'; width: auto; height: auto; top: 50%; bottom: auto; transform: translateY(-50%); left: 2px; background: none; color: #ff5fa2; font-size: 10px; }\nhtml.theme-anime .badge { font-weight: 700; }\n/* Steampunk — riveted brass plates */\nhtml.theme-steampunk .card, html.theme-steampunk .overview-card {\n  background:\n    radial-gradient(circle at 9px 9px, #c99a45 1.8px, #6e4f1a 2.6px, transparent 3.2px),\n    radial-gradient(circle at calc(100% - 9px) 9px, #c99a45 1.8px, #6e4f1a 2.6px, transparent 3.2px),\n    radial-gradient(circle at 9px calc(100% - 9px), #c99a45 1.8px, #6e4f1a 2.6px, transparent 3.2px),\n    radial-gradient(circle at calc(100% - 9px) calc(100% - 9px), #c99a45 1.8px, #6e4f1a 2.6px, transparent 3.2px),\n    linear-gradient(180deg, #f8efdb, #f1e4c8);\n}\nhtml.theme-steampunk h1.page-title::before { width: 72px; height: 6px; border-radius: 1px; background: repeating-linear-gradient(90deg, #b8862f 0 5px, #6e4f1a 5px 7px); }\nhtml.theme-steampunk .nav-btn.active::before { content: '\\2699'; width: auto; height: auto; top: 50%; bottom: auto; transform: translateY(-50%); left: 1px; background: none; color: #d6a750; font-size: 11px; }\nhtml.theme-steampunk .badge { letter-spacing: .08em; font-size: 10.5px; }\n/* Gamer — chamfered HUD panels, neon */\nhtml.theme-gamer .card, html.theme-gamer .overview-card, html.theme-gamer .modal, html.theme-gamer .theme-card, html.theme-gamer .profile-card { clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px); }\nhtml.theme-gamer .btn-primary { clip-path: polygon(7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%, 0 7px); text-transform: uppercase; letter-spacing: .06em; }\nhtml.theme-gamer h1.page-title { text-shadow: 0 0 22px rgba(61,255,168,.3); }\nhtml.theme-gamer h1.page-title::before { width: 48px; height: 3px; border-radius: 0; background: #3dffa8; box-shadow: 0 0 12px #3dffa8; }\nhtml.theme-gamer .nav-btn.active::before { content: '\\25b6'; width: auto; height: auto; top: 50%; bottom: auto; transform: translateY(-50%); left: 2px; background: none; color: #3dffa8; font-size: 8px; border-radius: 0; }\nhtml.theme-gamer .badge { border-left-width: 3px; letter-spacing: .06em; font-size: 10.5px; }\nhtml.theme-gamer .nav-label { letter-spacing: .2em; }\n/* Cartoon — ink outlines, hard shadows */\nhtml.theme-cartoon h1.page-title { font-size: 38px; }\nhtml.theme-cartoon h1.page-title::before { width: 52px; height: 14px; top: -2px; border-radius: 99px; background: #ffbe0b; border: 3px solid #1b1b1b; }\nhtml.theme-cartoon .nav-btn.active { border: 2px solid #1b1b1b; box-shadow: 2px 2px 0 #1b1b1b; }\nhtml.theme-cartoon .nav-btn.active::before { display: none; }\nhtml.theme-cartoon .u-tab.active { border: 2px solid #1b1b1b; box-shadow: 2px 2px 0 #1b1b1b; }\nhtml.theme-cartoon .ghost-btn, html.theme-cartoon .back-btn { border: 2px solid #1b1b1b; background: #fff; color: #1b1b1b; box-shadow: 2px 2px 0 #1b1b1b; font-weight: 700; }\nhtml.theme-cartoon .btn-primary:active, html.theme-cartoon .ghost-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #1b1b1b; }\nhtml.theme-cartoon .badge { border-color: #1b1b1b !important; font-weight: 700; }\nhtml.theme-cartoon .overview-card:hover { transform: translate(-2px, -2px); }\n\n/* ===== Avatars ===== */\n.avatar { display: inline-block; flex-shrink: 0; width: 40px; height: 40px; overflow: hidden; border-radius: var(--t-avatar-radius); box-shadow: var(--t-avatar-ring); background: var(--t-surface-2); }\n.avatar svg, .avatar img { width: 100%; height: 100%; display: block; object-fit: cover; }\nhtml.theme-gamer .avatar { clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); }\n\n/* ===== Sidebar profile chip ===== */\n.profile-chip { display: flex; align-items: center; gap: 6px; }\n.profile-chip-main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; padding: 8px 10px 8px 8px; border-radius: var(--t-radius-sm); border: 1px solid var(--t-side-line); background: var(--t-side-hover); cursor: pointer; text-align: left; color: var(--t-side-ink); font: inherit; }\n.profile-chip-main:hover, .profile-chip-main.active { border-color: var(--u-accent); }\n.pc-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }\n.pc-text b { font-size: 13.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.pc-text span { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--t-side-faint); }\n\n/* ===== Gate: landing, log-in, create profile ===== */\n.gate { position: fixed; inset: 0; overflow-y: auto; background: var(--t-page); color: var(--t-ink); font-family: var(--t-font-body); z-index: 80; }\n.gate-inner { min-height: 100%; max-width: 1180px; margin: 0 auto; padding: 56px 48px; display: flex; box-sizing: border-box; }\n.gate-landing { align-items: center; gap: 64px; flex-wrap: wrap; }\n.gate-copy { flex: 1 1 420px; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 24px; }\n.gate-brand { display: flex; align-items: center; gap: 10px; font-family: var(--t-font-head); font-size: 14px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--t-ink-2); }\n.gate-brand .brand-logo { width: 34px; height: 34px; background: #fff; border-radius: var(--t-radius-sm); }\n.gate-title { margin: 0; font-family: var(--t-font-head); font-weight: var(--t-head-weight); text-transform: var(--t-head-case); letter-spacing: var(--t-head-track); font-size: clamp(42px, 5.6vw, 76px); line-height: 1.02; color: var(--heading-color, var(--t-ink)); text-wrap: balance; }\n.gate-title.sm { font-size: clamp(28px, 3.4vw, 42px); line-height: 1.1; }\n.gate-sub { margin: 0; font-size: 17px; line-height: 1.55; color: var(--t-muted); max-width: 540px; text-wrap: pretty; }\n.gate-actions { display: flex; gap: 12px; flex-wrap: wrap; }\n.gate-btn { padding: 14px 26px; font-size: 15px; min-width: 150px; white-space: nowrap; }\n.gate-note { font-size: 13px; color: var(--t-faint); }\n.gate-continue { display: inline-flex; align-items: center; gap: 10px; padding: 6px 14px 6px 6px; border-radius: 99px; border: 1px solid var(--t-line-2); background: var(--t-surface); color: var(--t-ink-2); font: inherit; font-size: 14px; cursor: pointer; }\n.gate-continue:hover { border-color: var(--u-accent); }\n.gate-art { flex: 1 1 340px; max-width: 460px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }\n.gate-art-tile { display: block; transform: rotate(calc((var(--d) - 5.5) * 1.2deg)); }\n.gate-art-tile:nth-child(even) { translate: 0 14px; }\n.gate-art .avatar { width: 100%; height: auto; aspect-ratio: 1; }\n.gate-col { flex-direction: column; gap: 28px; max-width: 980px; }\n.gate-col.wide { max-width: 1120px; }\n.gate-col .back-btn { margin: 0; }\n.profile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }\n.profile-card { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 26px 16px; cursor: pointer; text-align: center; color: var(--t-ink); font: inherit; transition: transform .15s ease; }\n.profile-card:hover { transform: translateY(-3px); }\n.pc-name { font-family: var(--t-font-head); font-weight: var(--t-head-weight); font-size: 18px; color: var(--t-ink); }\n.pc-meta { font-size: 12px; color: var(--t-muted); }\n.profile-card.add { border: 2px dashed var(--t-line-2); background: transparent; border-radius: var(--t-radius); justify-content: center; min-height: 200px; }\n.gate-pin { max-width: 440px; }\n.pin-card { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 32px 28px; }\n.pin-card #gatePin { text-align: center; font-size: 22px; letter-spacing: .6em; }\n.gate-error { color: oklch(0.55 0.19 25); font-size: 13px; font-weight: 600; margin-right: auto; }\nhtml.theme-gamer .gate-error { color: #ff6b8a; }\n.wiz-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }\n.wiz-steps { display: flex; gap: 8px; list-style: none; margin: 0; padding: 0; font-size: 13px; flex-wrap: wrap; }\n.wiz-steps li { padding: 6px 13px; border-radius: var(--t-radius-badge); border: 1px solid var(--t-line-2); color: var(--t-muted); }\n.wiz-steps li.on { background: var(--t-btn-bg); color: var(--t-btn-ink); border-color: transparent; font-weight: 700; }\n.wiz-steps li.done { color: var(--t-ink-2); }\n.wiz-body { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 32px; align-items: start; }\n.wiz-foot { display: flex; justify-content: flex-end; align-items: center; gap: 12px; flex-wrap: wrap; }\n.av-preview { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 26px 22px; }\n.opt { font-size: 11.5px; color: var(--t-faint); font-weight: 400; }\n@media (max-width: 820px) { .wiz-body { grid-template-columns: minmax(0, 1fr); } .gate-inner { padding: 32px 22px; } .gate-landing { gap: 40px; } }\n\n/* ===== Shared pickers ===== */\n.av-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(78px, 1fr)); gap: 10px; }\n.av-tile { padding: 7px; border-radius: calc(var(--t-radius-sm) + 4px); border: 2px solid transparent; background: transparent; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; font: inherit; font-size: 11.5px; color: var(--t-muted); }\n.av-tile:hover { background: var(--t-surface-2); }\n.av-tile.sel { border-color: var(--u-accent); background: color-mix(in srgb, var(--u-accent) 12%, transparent); color: var(--t-ink); font-weight: 700; }\n.av-tile .avatar { width: 100%; height: auto; aspect-ratio: 1; }\n.av-up-box { width: 100%; aspect-ratio: 1; box-sizing: border-box; border: 2px dashed var(--t-line-2); border-radius: var(--t-avatar-radius); display: grid; place-items: center; font-size: 24px; color: var(--t-muted); }\n.theme-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }\n.theme-card { text-align: left; padding: 0; border: 2px solid var(--t-line-2); border-radius: var(--t-radius); background: var(--t-surface); cursor: pointer; overflow: hidden; display: flex; flex-direction: column; color: var(--t-ink); font: inherit; transition: transform .15s ease; }\n.theme-card:hover { transform: translateY(-2px); }\n.theme-card.sel { border-color: var(--u-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--u-accent) 30%, transparent); }\n.theme-pv { height: 132px; display: flex; overflow: hidden; }\n.theme-meta { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 4px; }\n.theme-name { font-weight: 700; font-size: 15px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }\n.theme-tick { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: var(--t-radius-badge); background: var(--t-btn-bg); color: var(--t-btn-ink); }\n.theme-blurb { font-size: 12.5px; color: var(--t-muted); line-height: 1.45; }\n.sec-groups { display: flex; flex-direction: column; gap: 18px; }\n.sec-group-label { font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: var(--t-faint); font-weight: 700; margin-bottom: 8px; }\n.sec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }\n.sec-item { display: flex; align-items: center; gap: 10px; text-align: left; padding: 10px 12px; border-radius: var(--t-radius-sm); border: 1px solid var(--t-line-2); background: var(--t-surface); color: var(--t-ink); cursor: pointer; font: inherit; font-size: 13.5px; }\n.sec-item.off { color: var(--t-faint); background: transparent; border-style: dashed; }\n.sec-item:disabled { cursor: default; }\n.sec-box { width: 18px; height: 18px; box-sizing: border-box; border-radius: 4px; border: 1.5px solid currentColor; display: grid; place-items: center; font-size: 12px; line-height: 1; flex-shrink: 0; }\n.sec-item.on .sec-box { background: var(--u-accent); border-color: var(--u-accent); color: #fff; }\nhtml.theme-gamer .sec-item.on .sec-box, html.theme-cartoon .sec-item.on .sec-box { color: #1b1b1b; }\n.sec-lock { margin-left: auto; font-size: 11px; color: var(--t-faint); }\n\n/* ===== Profile & settings page ===== */\n.pf-head { display: flex; gap: 22px; align-items: center; flex-wrap: wrap; }\n.pf-fields { flex: 1; min-width: 240px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; align-items: end; }\n.pf-h { font-family: var(--t-font-head); font-size: 16px; font-weight: var(--t-head-weight); text-transform: var(--t-head-case); letter-spacing: var(--t-head-track); margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; color: var(--heading-color, inherit); }\n.pf-h span { font-family: var(--t-font-body); font-size: 12px; text-transform: none; letter-spacing: 0; color: var(--t-muted); font-weight: 500; }\n.pf-note { font-size: 12.5px; line-height: 1.5; color: var(--t-muted); margin: -4px 0 14px; }\n.pf-account { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }\n.settings-link { width: 100%; }\n\n.back-btn, .wiz-steps li, .sec-lock, .pc-meta, .theme-tick { white-space: nowrap; }\n.gate-col .back-btn, .wiz-head .back-btn { flex-shrink: 0; }\n.btn-primary, .ghost-btn, .danger-btn, .view-btn { white-space: nowrap; }\n\n/* PIN recovery + profile deletion */\n.gate-link { background: none; border: 0; padding: 4px; font: inherit; font-size: 13px; color: var(--t-muted); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; align-self: center; }\n.gate-link:hover { color: var(--t-ink); }\n.rec-box { display: flex; flex-direction: column; gap: 10px; padding-top: 14px; margin-top: 4px; border-top: 1px solid var(--t-line-2); }\n.del-box { display: flex; flex-direction: column; gap: 12px; padding: 14px 16px; border: 1px solid oklch(0.62 0.15 25 / .55); border-radius: var(--t-radius-sm, 8px); background: oklch(0.6 0.16 25 / .07); font-size: 13px; line-height: 1.5; color: var(--t-ink-2); flex-basis: 100%; }\n.danger-btn.solid { background: oklch(0.52 0.18 25); border-color: oklch(0.52 0.18 25); color: #fff; }\n.danger-btn.solid:hover { background: oklch(0.46 0.18 25); }\n.login-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }\n.profile-card { position: relative; }\n.profile-card.managing { outline: 2px dashed oklch(0.6 0.16 25 / .6); outline-offset: -6px; }\n.pc-del { position: absolute; top: 10px; right: 10px; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; background: oklch(0.52 0.18 25); color: #fff; }\n.gate-notice { font-size: 13px; color: var(--t-ink-2); padding: 10px 14px; border: 1px solid var(--t-line-2); border-radius: var(--t-radius-sm, 8px); background: var(--t-surface); }\nhtml.theme-gamer .del-box { border-color: #ff6b8a80; background: #ff6b8a12; }\n\n/* ===== Overview tabs, finance ledger, charts ===== */\n.ov-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }\n.ov-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }\n.view-btn.active { background: color-mix(in srgb, var(--u-accent) 20%, transparent); border-color: var(--u-accent); }\n.fin-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }\n.fin-month { font: 600 17px var(--t-font-head); min-width: 150px; text-align: center; color: var(--t-ink); }\n.fin-cur { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--t-muted); }\n.fin-cur select, .xf-input { padding: 7px 9px; border: 1px solid var(--t-line-2); border-radius: var(--t-radius-sm); background: var(--t-input); color: var(--t-ink); font: inherit; font-size: 13px; }\n.fin-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 16px; margin-bottom: 16px; }\n.fin-grid > .card, .rp-builder > .card { margin: 0; }\n.fin-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 12px; }\n.fin-form .field { margin: 0; }\n.fin-form .span2 { grid-column: 1 / -1; }\n.seg { display: inline-flex; border: 1px solid var(--t-line-2); border-radius: var(--t-radius-sm); overflow: hidden; }\n.seg button { border: 0; background: transparent; padding: 8px 16px; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; color: var(--t-ink-3); }\n.seg button.on { background: color-mix(in srgb, var(--u-accent) 24%, transparent); color: var(--t-ink); }\n.fin-row { display: grid; grid-template-columns: 96px minmax(0, 1fr) auto auto; gap: 12px; align-items: center; padding: 10px 12px; background: var(--t-surface-2); border-radius: var(--t-radius-sm); font-size: 13px; color: var(--t-ink-2); }\n.fin-amt { font-variant-numeric: tabular-nums; white-space: nowrap; }\n.fin-amt.in { color: oklch(0.45 0.13 150); } .fin-amt.out { color: oklch(0.55 0.17 25); }\nhtml.theme-gamer .fin-amt.in { color: #3dffa8; } html.theme-gamer .fin-amt.out { color: #ff6b8a; }\n.bud-row { display: grid; grid-template-columns: minmax(110px, 1fr) 110px minmax(0, 1.4fr) minmax(120px, auto); gap: 12px; align-items: center; font-size: 13px; color: var(--t-ink-2); }\n.bud-row input { width: 100%; box-sizing: border-box; padding: 6px 8px; border: 1px solid var(--t-line-2); border-radius: var(--t-radius-sm); background: var(--t-input); color: var(--t-ink); font: inherit; }\n.bud-amt { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; white-space: nowrap; }\n.cat-chips { display: flex; flex-wrap: wrap; gap: 6px; }\n.cat-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 4px 3px 10px; border: 1px solid var(--t-line-2); border-radius: var(--t-radius-badge); font-size: 12px; color: var(--t-ink-2); }\n.cat-chip button { border: 0; background: none; cursor: pointer; color: var(--t-muted); font-size: 15px; line-height: 1; padding: 0 5px; }\n.cat-chip button:hover { color: oklch(0.55 0.17 25); }\n.ch-donut { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }\n.ch-donut svg { flex-shrink: 0; }\n.ch-center { font: 600 12.5px var(--t-font-head); fill: var(--t-ink); }\n.ch-ring-txt { font: 600 17px var(--t-font-head); fill: var(--t-ink); }\n.ch-legend { display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; color: var(--t-ink-2); min-width: 150px; flex: 1; }\n.ch-legend.row { flex-direction: row; flex-wrap: wrap; gap: 16px; margin-top: 12px; }\n.ch-legend > div { display: flex; align-items: center; gap: 8px; }\n.ch-legend i { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }\n.ch-legend span { flex: 1; }\n.ch-legend b { font-variant-numeric: tabular-nums; font-weight: 600; }\n.ch-hbars { display: flex; flex-direction: column; gap: 10px; }\n.ch-hrow { display: grid; grid-template-columns: minmax(90px, 170px) minmax(0, 1fr) auto; gap: 12px; align-items: center; font-size: 13px; color: var(--t-ink-2); }\n.ch-hrow b { font-variant-numeric: tabular-nums; font-weight: 600; white-space: pre; }\n.ch-htrack { height: 12px; background: var(--t-surface-2); border-radius: 99px; overflow: hidden; display: block; }\n.ch-htrack > span { display: block; height: 100%; border-radius: 99px; }\n.ch-cols { display: flex; align-items: flex-end; gap: 12px; height: 180px; padding-top: 8px; overflow-x: auto; }\n.ch-col { flex: 1; min-width: 40px; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; }\n.ch-colbars { flex: 1; width: 100%; display: flex; align-items: flex-end; justify-content: center; gap: 4px; }\n.ch-colbars span { width: 40%; max-width: 22px; border-radius: 4px 4px 0 0; min-height: 2px; }\n.ch-cl { font-size: 11px; color: var(--t-muted); white-space: nowrap; }\n\n/* ===== Reports ===== */\n.rp-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }\n.rp-card { cursor: pointer; display: flex; flex-direction: column; gap: 6px; text-align: left; font: inherit; color: inherit; margin: 0; }\n.rp-empty { text-align: center; padding: 44px 24px; display: flex; flex-direction: column; gap: 10px; align-items: center; }\n.rp-builder { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }\n.rp-checks { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }\n.rp-check { display: flex; gap: 9px; align-items: center; padding: 9px 11px; border: 1px solid var(--t-line-2); border-radius: var(--t-radius-sm); font: inherit; font-size: 13px; cursor: pointer; color: var(--t-ink-2); background: var(--t-surface-solid); text-align: left; }\n.rp-check.on { border-color: var(--u-accent); background: color-mix(in srgb, var(--u-accent) 12%, var(--t-surface-solid)); color: var(--t-ink); }\n.rp-box { width: 16px; height: 16px; flex-shrink: 0; border: 1.5px solid var(--t-line-2); border-radius: 4px; display: grid; place-items: center; font-size: 11px; font-weight: 700; color: var(--t-btn-ink, #fff); }\n.rp-check.on .rp-box { background: var(--u-accent); border-color: var(--u-accent); }\n.rp-toolbar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 12px; }\n.rp-wrap { overflow-x: auto; }\n.rp-doc { background: var(--t-surface-solid); color: var(--t-ink); border: 1px solid var(--t-line-3); border-radius: var(--t-radius); padding: 40px 44px; max-width: 900px; font-family: var(--t-font-body); box-sizing: border-box; }\n.rp-doc h2 { font-family: var(--t-font-head); font-weight: var(--t-head-weight); text-transform: var(--t-head-case); letter-spacing: var(--t-head-track); font-size: 16px; margin: 0 0 14px; color: var(--t-ink); }\n.rp-h3 { font-size: 13px; font-weight: 600; color: var(--t-ink-2); margin: 22px 0 10px; }\n.rp-head { display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; padding-bottom: 22px; border-bottom: 2px solid var(--u-accent); margin-bottom: 28px; flex-wrap: wrap; }\n.rp-brand { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--t-muted); }\n.rp-brand img { width: 26px; height: 26px; object-fit: contain; }\n.rp-title { font-family: var(--t-font-head); font-weight: var(--t-head-weight); letter-spacing: var(--t-head-track); text-transform: var(--t-head-case); font-size: 30px; line-height: 1.1; margin: 10px 0 6px; text-wrap: pretty; }\n.rp-meta { font-size: 12.5px; color: var(--t-muted); line-height: 1.45; }\n.rp-sec { margin-bottom: 32px; break-inside: avoid; page-break-inside: avoid; }\n.rp-rings { display: grid; grid-template-columns: repeat(auto-fill, minmax(128px, 1fr)); gap: 12px; }\n.rp-ring { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; padding: 14px 8px; border: 1px solid var(--t-line-3); border-radius: var(--t-radius-sm); }\n.rp-ring b { font-size: 13px; } .rp-ring span { font-size: 11.5px; color: var(--t-muted); }\n.rp-ring-main { background: color-mix(in srgb, var(--u-accent) 10%, transparent); border-color: var(--u-accent); }\n.rp-pies { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }\n.rp-pie h3 { font-size: 13px; margin: 0 0 10px; color: var(--t-ink-2); }\n.rp-table { width: 100%; border-collapse: collapse; font-size: 12.5px; color: var(--t-ink-2); }\n.rp-table th, .rp-table td { padding: 8px 10px; border-bottom: 1px solid var(--t-line-3); text-align: left; }\n.rp-table th { color: var(--t-muted); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }\n.rp-table .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }\n.rp-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }\n.rp-stat { padding: 12px 14px; border: 1px solid var(--t-line-3); border-radius: var(--t-radius-sm); }\n.rp-stat span { font-size: 11.5px; color: var(--t-muted); display: block; margin-bottom: 4px; }\n.rp-stat b { font-family: var(--t-font-head); font-size: 19px; font-weight: 600; font-variant-numeric: tabular-nums; }\n.rp-list-items { display: flex; flex-direction: column; font-size: 13px; }\n.rp-li { display: flex; gap: 12px; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--t-line-3); }\n.rp-li > span:first-child { flex: 1; min-width: 0; }\n.rp-notes { font-size: 13.5px; line-height: 1.6; color: var(--t-ink-2); }\n.rp-foot { margin-top: 24px; font-size: 11px; color: var(--t-faint); }\n#xwPrint { display: none; -webkit-print-color-adjust: exact; print-color-adjust: exact; }\n@media print {\n  html.xw-print body > *:not(#xwPrint) { display: none !important; }\n  html.xw-print #xwPrint { display: block !important; }\n  html.xw-print, html.xw-print body { background: var(--t-surface-solid, #fff) !important; height: auto !important; overflow: visible !important; }\n  html.xw-print #xwPrint .rp-doc { border: 0; border-radius: 0; max-width: none; padding: 0; }\n  @page { margin: 14mm; }\n}\n\n.btn-primary.small { padding: 6px 12px; font-size: 12px; }\n.gate-extras { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; margin-top: 4px; }\n.gate-extras .gate-link { align-self: auto; }\n\n/* ===== Phone layout: slide-out sidebar ===== */\n.mob-bar, .nav-scrim { display: none; }\n@media (max-width: 820px) {\n  .app { height: 100dvh; }\n  .sidebar { position: fixed !important; z-index: 60; top: 0; bottom: 0; left: 0; width: min(86vw, 300px) !important; transform: translateX(-104%); transition: transform .25s ease; overflow-y: auto; padding-top: calc(18px + env(safe-area-inset-top)) !important; }\n  .app.nav-open .sidebar { transform: none; }\n  .app.nav-open .nav-scrim { display: block; position: fixed; inset: 0; background: rgba(10,14,22,.5); z-index: 55; }\n  .main { padding: 0 16px calc(96px + env(safe-area-inset-bottom)) !important; }\n  .mob-bar { display: flex; align-items: center; gap: 10px; position: sticky; top: 0; z-index: 20; margin: 0 -16px 14px; padding: calc(10px + env(safe-area-inset-top)) 16px 10px; background: var(--t-surface-solid, #fff); border-bottom: 1px solid var(--t-line-3); }\n  .nav-toggle { width: 44px; height: 44px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 4px; border: 1px solid var(--t-line-2); border-radius: var(--t-radius-sm); background: transparent; cursor: pointer; }\n  .nav-toggle span { width: 18px; height: 2px; border-radius: 2px; background: var(--t-ink); }\n  .mob-logo { width: 28px; height: 28px; object-fit: contain; }\n  .mob-title { font: 600 16px var(--t-font-head); color: var(--t-ink); }\n  .header-row { flex-wrap: wrap; gap: 12px; align-items: flex-start; }\n  h1.page-title, html.themed h1.page-title { font-size: 26px; }\n  .grid-cards, .grid-cards.small { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }\n  .big-stat { font-size: 19px; }\n  .card.row { flex-wrap: wrap; }\n  .rp-builder { grid-template-columns: minmax(0, 1fr); }\n  .rp-doc { padding: 22px 18px; }\n  .nav-btn, .u-tab { min-height: 44px; }\n}\n@media (max-width: 560px) {\n  .fin-row { grid-template-columns: minmax(0, 1fr) auto auto; } .fin-row > .rp-meta:first-child { grid-column: 1 / -1; }\n  .bud-row { grid-template-columns: minmax(0, 1fr) 100px; } .bud-row .ch-htrack, .bud-row .bud-amt { grid-column: 1 / -1; } .bud-amt { text-align: left; }\n  .fin-form { grid-template-columns: minmax(0, 1fr); }\n  .ch-hrow { grid-template-columns: minmax(0, 1fr) auto; } .ch-hrow .ch-htrack { grid-column: 1 / -1; grid-row: 2; }\n}\n";
  const s = document.createElement('style'); s.id = 'xenwinx-styles'; s.textContent = css; document.head.appendChild(s);
})();

/* Xenwinx Studio Dashboard — Universe-Pillar model
   Self-mounting: <xenwinx-dashboard></xenwinx-dashboard> */

/* ---------------- Constants ---------------- */
const PALETTE = {
  teal: 'oklch(0.5 0.07 195)', amber: 'oklch(0.58 0.13 70)', green: 'oklch(0.52 0.15 150)',
  red: 'oklch(0.68 0.19 25)', gray: 'oklch(0.52 0.02 80)'
};
const GAME_STATUS = ['planned', 'pre-production', 'in development', 'on hold', 'published'];
const CURRENCIES = ['USD', 'ZAR'];
const CADENCES = ['monthly', 'yearly', 'once'];
const MERCH_STATUS = ['planned', 'in production', 'available'];
const ANIMATION_STATUS = ['planned', 'in production', 'published'];
const MODEL_STATUS = ['planned', 'in progress', 'done'];
const ENV_STATUS = ['planned', 'in progress', 'done'];
const SOCIAL_STATUS = ['live', 'not live'];
const TASK_STATUS = ['planned', 'in progress', 'blocked', 'done'];
const BUG_STATUS = ['open', 'in progress', 'resolved'];
const PRIORITY = ['low', 'medium', 'high'];
const BOOK_STATUS = ['planned', 'in-progress', 'done'];
const GOAL_STATUS = ['not started', 'in progress', 'done', 'delayed'];
const UNIVERSE_STATUS = ['active', 'upcoming', 'complete'];
const LEARN_STATUS = ['planned', 'in progress', 'done'];
const AGE_TIERS = ['Early Reader', 'Middle Reader', 'Teen 13+'];
const ZAR_PER_USD = 18.5;
const WF_STATUS = ['not started', 'in progress', 'done', 'blocked', 'not needed'];
const PILLARS = ['Story Books', 'Concept Art', 'Journal', 'Game', 'App', 'Animation', 'Merch', 'Social', 'Create', 'Financials', 'Studio'];
const COMPANY_INFO = {
  founder: 'Zernobie Winkworth', established: 2020,
  tagline: 'Imagine. Design. Inspiring Minds',
  vision: 'To be the global catalyst for purpose-driven creativity, where immersive technology and artistic expression empower cultural storytelling and connect communities.',
  mission: 'Xenwinx merges storytelling, innovation, and visual artistry to create impactful digital experiences. Through original games, apps, narratives, and artistry, we build inclusive worlds that celebrate culture, environment, and shared human values.',
  competencies: ['Mobile App Developer', 'Children\u2019s Book Illustrator', 'Game Developer', '3D Modeller', 'Animator', 'Digital Environment Artist', 'Software Developer', 'AR Content Creator']
};

/* ---------------- Universe factory ---------------- */
function uid() { return 'id' + Math.random().toString(36).slice(2, 9); }
function defaultRevenue() {
  return [
    { id: uid(), name: 'Story Book Sales', live: false, actual: 0, target: 0 },
    { id: uid(), name: 'Journal Sales', live: false, actual: 0, target: 0 },
    { id: uid(), name: 'App Subscriptions / IAP', live: false, actual: 0, target: 0 },
    { id: uid(), name: 'Game IAP / Ads', live: false, actual: 0, target: 0 },
    { id: uid(), name: 'Merch', live: false, actual: 0, target: 0 }
  ];
}
function mkUniverse(cfg) {
  return Object.assign({
    status: 'upcoming', cycleYear: 2027, tagline: '', ageTier: 'Early Reader',
    storyBooks: { target: 0, items: [] },
    conceptArtBook: { title: cfg.name + ' Concept Art Book', status: 'planned', pages: 0, notes: '' },
    journal: { target: 0, items: [] },
    game: { name: cfg.name, status: 'planned', designDoc: '', notes: '', tasks: [], workflow: [] },
    app: { name: cfg.name + ' App', buildStatus: 'planned', notes: '', versions: [], bugs: [], workflow: [], miniGames: [], gallery: [] },
    /* This universe's contribution to the two shared, permanent apps.
       The apps themselves are top-level entities (state.apps) — not universe-owned. */
    rootedTalesContent: { addedToApp: false, versionAdded: '', miniGames: [], gallery: [], badges: [] },
    xenwinxWorldsContent: { addedToApp: false, levelCheats: [], bonusCutscenes: [], communityShowcase: [] },
    animation: { clips: [] },
    merch: { items: [] },
    socialMedia: { platforms: [] },
    create: { artLearning: [], tutorials: [], modelling3D: [], environment: [] },
    financials: { revenue: defaultRevenue(), expenses: [], giving: defaultGiving() }
  }, cfg);
}
/* Giving: planned allocation only — stays inactive until a universe is profitable.
   Causes are defined here ONCE per universe and nowhere else in the app. */
const GIVING_CAUSES = {
  flumfy: 'Orphanages and shelters',
  akai: 'Nature and animal/ocean protection',
  aura: '',
  kitsune: 'Education funding',
  fireWithAsh: 'Cultural preservation and humanitarian support',
  catchersAndTakers: 'Domestic violence, trafficking, and abuse support foundations',
  iGarden: 'Nature and deforestation'
};
function defaultGiving() { return { cause: '', allocationPercent: null, status: 'inactive until revenue exists' }; }

const akaiBooks = (function () {
  const explicitTitles = [
    'The Adventures of Rusty the Red Panda', 'The Adventures of Akai the Red Panda: A Heart-warming Panda Reunion',
    'Akai and Kaito in the Great Ocean Odyssey', 'Akai the Red Panda and The Curious Raccoons',
    'Akai and The Red Panda and The Quokka Quest', 'Akai and the Tale of The Sea Otter',
    'Akai\u2019s Remarkable Adventure with The Cozy Koala', 'Akai and Hedge: The Treasure of Friendship',
    'Akai with The Playful Monkeys', 'Akai and The Joyful Elephant', 'Akai\u2019s Lessons with The Wise Owls', 'Akai and The Lost Reindeer'
  ];
  const seriesParts = [
    'Part 13 \u2013 Squirrel (Niko)', 'Part 14 \u2013 Jelly Fish (Lumi)', 'Part 15 \u2013 Octopus (Calyx)', 'Part 16 \u2013 Sea Horse (Sage)',
    'Part 17 \u2013 Shark (Kai)', 'Part 18 \u2013 Whale (Willow)', 'Part 19 \u2013 Seal (Nami)', 'Part 20 \u2013 Heron (Aoi)',
    'Part 21 \u2013 Snake (Basilisk)', 'Part 22 \u2013 Lion (Blaze)', 'Part 23 \u2013 Wolf (Amaruq)', 'Part 24 \u2013 Tiger (Rajin)',
    'Part 25 \u2013 Polar Bear (Isen)', 'Part 26 \u2013 Siberian Tiger (Kazan)', 'Part 27 \u2013 Snow Leopard (Nyra)', 'Part 28 \u2013 Snow Owl (Strix)',
    'Part 29 \u2013 Snow Squirrel (Snowflake)', 'Part 30 \u2013 Japanese Long-tail Tit (Tatsu)', 'Part 31 \u2013 Snow Rabbit (Frost)',
    'Part 32 \u2013 Snow Fox (Arctic)', 'Part 33 \u2013 Cat (Calico)', 'Part 34 \u2013 Dog (Thorne)'
  ];
  return [...explicitTitles, ...seriesParts].map((title, i) => {
    const idx = i + 1;
    const status = idx <= 19 ? 'done' : idx <= 21 ? 'in-progress' : 'planned';
    const checklist = status === 'done' ? { cover: true, end: true, chapter: true, inText: true, storyBook: true }
      : status === 'in-progress' ? { cover: true, end: false, chapter: true, inText: false, storyBook: false }
      : { cover: false, end: false, chapter: false, inText: false, storyBook: false };
    return { id: 'bk' + idx, title, status, checklist };
  });
})();

const akaiJournals = [
  'The Curious Red Panda: A Journal for Wandering Thoughts', 'The Peaceful Panda: A Journal for Bamboo Grove Reflections',
  'The Clever Raccoon: A Journal for Midnight Ideas', 'The Joyful Quokka: A Journal for Sunny Moments',
  'The Quiet Koala: A Journal for Eucalyptus-Scented Reflections', 'The Gentle Hedgehog: A Journal for Cozy Thoughts',
  'The Energetic Monkey: A Journal for Playful Adventures', 'The Wise Elephant: A Journal for Treasured Memories',
  'The Wise Owl: A Journal for Nocturnal Insights', 'The Guided Reindeer: A Journal for Star-Lit Journeys',
  'The Playful Sea Otter: A Journal for Floating Thoughts & Dreams', 'The Tranquil Sea Turtle: A Journal for Deep Ocean Calm',
  'The Resourceful Squirrel: A Journal for Gathering Little Moments',
  'The Luminous Jellyfish: A Journal for Drifting Dreams & Gentle Light',
  'The Curious Octopus: A Journal for Tangled Thoughts & Hidden Discoveries',
  'The Graceful Seahorse: A Journal for Gentle Currents & Quiet Dreams',
  'The Fearless Shark: A Journal for Courageous Journeys & Deep Waters',
  'The Majestic Whale: A Journal for Deep Thoughts & Oceanic Memories',
  'The Playful Seal: A Journal for Joyful Waves & Floating Moments',
  'The Serene Heron: A Journal for Still Waters & Graceful Reflections',
  'The Mysterious Snake: A Journal for Transformation & Hidden Wisdom',
  'The Courageous Lion: A Journal for Brave Hearts & Golden Dreams',
  'The Loyal Wolf: A Journal for Wild Hearts & Moonlit Journeys',
  'The Powerful Tiger: A Journal for Inner Strength & Fearless Dreams'
].map((title, i) => ({ id: 'j' + (i + 1), title, created: true, amazonListed: i < 7 }));

const flumfyJournals = [
  ...['The Verdant Flumfy: A Journal for Forest Whispers & Growing Dreams',
    'The Sage Flumfy: A Journal for Quiet Wisdom & Thoughtful Reflections',
    'The Rosy Flumfy: A Journal for Heartfelt Moments & Little Joys',
    'The Lila Flumfy: A Journal for Dreaming Beyond the Stars',
    'The Ember Flumfy: A Journal for Brave Hearts & Little Sparks'
  ].map(title => ({ title, group: 'The Legendary Flumfies' })),
  ...['The Drifter: A Journal for Wandering Paths & Places In Between',
    'The Gloom Wisp: A Journal for Lost Light & Forgotten Memories',
    'The Ice Spiker: A Journal for Frozen Dreams & Mountain Whispers',
    'The Current Rider: A Journal for Shifting Waters & Changing Paths',
    'The Nightmare Weaver: A Journal for Midnight Fears & Unspoken Dreams',
    'The Void Seeker: A Journal for Forgotten Places & Echoes of the Unknown',
    'The Shadow Fox: A Journal for Lost Memories & the Light Within'
  ].map(title => ({ title, group: 'The Shadows' }))
].map((x, i) => ({ id: 'fj' + (i + 1), title: x.title, group: x.group, created: false, amazonListed: false }));

/* ---------------- State ---------------- */
const state = {
  activeUniverse: 'flumfy',
  universeOpen: true,
  pillarEdit: false,
  navEdit: {},
  navExtras: {},
  activeView: 'overview',
  notesFilter: 'All',
  scheduleView: 'month',
  scheduleAnchor: '2026-07-29',
  appearance: { bgColor: '#e8f1fb', fontColor: '#213247', headingColor: '#16202e', subheadingColor: '#5a6470', chartStyle: 'bar', glowStyle: 'soft', glowOn: true, glowColor: '#7aa7ff' },
  modal: null,
  draft: {},
  history: [],

  universes: {
    flumfy: mkUniverse({
      id: 'flumfy', name: 'Flumfy Universe', short: 'Flumfy', status: 'active', cycleYear: 2026,
      tagline: 'Finnish-mythology arcade adventure \u2014 the active 2026 cycle',
      skin: { primary: '#0b1330', accent: '#4fd1ae', accent2: '#e8965a' },
      storyBooks: { target: 5, items: [
        { id: 'fb1', title: 'Flumfy and the Lost Aurora', status: 'in-progress', checklist: { cover: true, end: false, chapter: false, inText: false, storyBook: false } },
        { id: 'fb2', title: 'Flumfy in the Twilight Meadows', status: 'planned', checklist: { cover: false, end: false, chapter: false, inText: false, storyBook: false } }
      ] },
      conceptArtBook: { title: 'Flumfy Concept Art Book', status: 'in progress', pages: 24, notes: 'Creature line-up, biome keys and the five playable Flumfies. Doubles as the game art bible.' },
      journal: { target: 12, items: flumfyJournals },
      game: {
        name: 'Flumfy: Aurora Rescue', status: 'in development', designDoc: '',
        notes: 'Mobile arcade game blending Finnish mythology; 5 playable Flumfy creatures restoring the Northern Lights. Levels: Twilight Meadows, Crystal Peaks, Aurora River, Fox\u2019s Den.',
        tasks: [
          { id: 't1', name: 'Build Level 3: Aurora River', status: 'in progress', outstanding: 'Waiting on art assets' },
          { id: 't2', name: 'Fix save bug', status: 'blocked', outstanding: 'Repro on Android only' }
        ],
        workflow: [
          { id: 'gw1', name: 'Phase 1: Core Player & Movement (Week 1)', done: false, substeps: [
            { id: 'gw1a', name: 'Step 1. Player scene with imported sprites and animations (idle, walk, jump, shoot).', done: false },
            { id: 'gw1b', name: 'Step 2. Auto-scroll camera and parallax background.', done: false },
            { id: 'gw1c', name: 'Step 3. Tap-to-jump with variable height.', done: false },
            { id: 'gw1d', name: 'Step 4. Swipe detection for shooting.', done: false },
            { id: 'gw1e', name: 'Step 5. Basic Drifter enemy moving in a sine wave.', done: false }
          ] },
          { id: 'gw2', name: 'Phase 2: First Biome & Enemies (Week 2-3)', done: false },
          { id: 'gw3', name: 'Phase 3: Remaining Biomes & Boss (Week 4-6)', done: false },
          { id: 'gw4', name: 'Phase 4: UI Flow & Monetization (Week 7-8)', done: false },
          { id: 'gw5', name: 'Phase 5: Polish & Launch (Week 9-10)', done: false }
        ]
      },
      app: {
        name: 'Flumfy Companion', buildStatus: 'planned',
        notes: 'Companion app carrying the Flumfy skin \u2014 mini-games, concept-art gallery and story reader.',
        versions: [], bugs: [], workflow: [],
        miniGames: [
          { id: 'mg1', name: 'Aurora Match', status: 'planned', notes: 'Colour-match puzzle using the biome palette.' },
          { id: 'mg2', name: 'Flumfy Feed', status: 'planned', notes: 'Tap-timing snack game.' }
        ],
        gallery: [
          { id: 'gl1', name: 'Twilight Meadows key art', status: 'in progress', notes: '' },
          { id: 'gl2', name: 'Five Flumfies line-up', status: 'done', notes: '' }
        ]
      },
      animation: { clips: [
        { id: 'fa1', title: 'Aurora Rescue \u2014 teaser (reuses game environments)', status: 'planned', notes: 'Cut from in-engine biome assets.' }
      ] },
      merch: { items: [
        { id: 'm1', category: 'Desktop Items', name: 'Lamps, stationery holder, mouse pad, headset stand, piggy bank', status: 'planned' },
        { id: 'm2', category: 'Bookmarks', name: 'Magnetic themed bookmarks', status: 'planned' },
        { id: 'm3', category: '3D Prints', name: '3D printed character figures', status: 'planned' },
        { id: 'm4', category: 'Posters', name: 'Concept art posters', status: 'planned' },
        { id: 'm5', category: 'Apparel', name: 'Hoodies, t-shirts, beanies, caps, crewnecks, socks, scarves', status: 'planned' }
      ] },
      socialMedia: { platforms: [
        { id: 'fs1', platform: 'Discord', handle: '#flumfy-devlog', link: 'https://discord.gg/WTvSSWPDzX', status: 'live', workLog: 'Weekly build screenshots posted.' }
      ] },
      create: {
        artLearning: [{ id: 'cl1', name: 'Pixel-light study for aurora effects', status: 'in progress', notes: 'Friday learning habit.' }],
        tutorials: [{ id: 'ct1', name: 'Godot 4: parallax + auto-scroll camera', status: 'done', notes: '' }],
        modelling3D: [{ id: 'cm1', name: 'Flumfy creature base mesh', category: 'Creatures', status: 'in progress', notes: '' }],
        environment: [
          { id: 'ev1', name: 'Mad Scientist Lab', status: 'in progress', notes: 'Frankenstein-inspired operating room; lever-pull moment with hazardous vials.' },
          { id: 'ev2', name: 'Full Moon at a Pier and Lighthouse', status: 'planned', notes: '' },
          { id: 'ev3', name: 'Japanese Tea Room with Garden', status: 'planned', notes: '' }
        ]
      },
      financials: {
        revenue: [
          { id: 'fr1', name: 'Story Book Sales', live: false, actual: 0, target: 200 },
          { id: 'fr2', name: 'Journal Sales', live: false, actual: 0, target: 100 },
          { id: 'fr3', name: 'App Subscriptions / IAP', live: false, actual: 0, target: 400 },
          { id: 'fr4', name: 'Game IAP / Ads', live: false, actual: 0, target: 1000 },
          { id: 'fr5', name: 'Merch', live: false, actual: 0, target: 500 }
        ],
        expenses: [
          { id: 'fe1', name: 'Google Play registration', amount: 25, currency: 'USD', cadence: 'once', taxable: true },
          { id: 'fe2', name: 'Steam registration', amount: 100, currency: 'USD', cadence: 'once', taxable: true },
          { id: 'fe3', name: 'Game art outsourcing', amount: 0, currency: 'USD', cadence: 'monthly', taxable: false },
          { id: 'fe4', name: 'Launch ad spend', amount: 0, currency: 'USD', cadence: 'monthly', taxable: false }
        ]
      }
    }),
    akai: mkUniverse({
      id: 'akai', name: 'Akai', short: 'Akai', status: 'active', cycleYear: 2026,
      tagline: 'Red panda picture-book series, journals, Rooted Tales app & the weekly animation',
      skin: { primary: '#2e2015', accent: '#e8965a', accent2: '#6b8f5a' },
      storyBooks: { target: 34, items: akaiBooks },
      conceptArtBook: { title: 'Akai Concept Art Book', status: 'planned', pages: 0, notes: 'Character sheets across all 34 parts.' },
      journal: { target: 24, items: akaiJournals },
      game: { name: 'Akai (pivoted to animation)', status: 'on hold', designDoc: '', notes: 'Original indie game concept became the weekly YouTube animation series.', tasks: [], workflow: [] },
      app: {
        name: 'Rooted Tales', buildStatus: 'in development',
        notes: 'Rooted Tales is 95% complete ahead of publish \u2014 the companion reading app for the Akai the Red Panda universe.',
        versions: [{ id: 'v1', version: '0.4.2', date: '2026-07-10', notes: 'Fixed sync issue on Android' }],
        bugs: [{ id: 'bug1', title: 'Crash on save for large journals', status: 'open', priority: 'high' }],
        miniGames: [], gallery: [],
        workflow: [
          { id: 'w1', name: 'Export from Figma Make \u2192 local folder', done: false },
          { id: 'w2', name: 'Clean up the exported mess (duplicates, wrong structure)', done: false },
          { id: 'w3', name: 'Install dependencies and fix build errors', done: false },
          { id: 'w4', name: 'Set up Supabase backend', done: false },
          { id: 'w5', name: 'Build the production web app', done: false },
          { id: 'w6', name: '(Attempt to) create Android WebView app', done: false },
          { id: 'w7', name: 'Android', done: false, substeps: [
            { id: 'w7a', name: 'Step 1: Create a new Android Studio project', done: false },
            { id: 'w7b', name: 'Step 2: Copy your dist folder into assets', done: false },
            { id: 'w7c', name: 'Step 3: Write the WebView code in MainActivity.java', done: false },
            { id: 'w7d', name: 'Step 4: Add Internet permission', done: false },
            { id: 'w7e', name: 'Step 5: Add a basic theme (to avoid resource errors)', done: false },
            { id: 'w7f', name: 'Step 6: Build and run', done: false }
          ] },
          { id: 'w8', name: 'Signed APK', done: false },
          { id: 'w9', name: 'Google Play Store Prep', done: false }
        ]
      },
      animation: { clips: [
        { id: 'an1', title: 'Akai the Red Panda: A Journey Through Nature \u2014 Ep. 1', status: 'in production', notes: 'Weekly YouTube animation story series.' }
      ] },
      merch: { items: [] },
      socialMedia: { platforms: [
        { id: 'sm1', platform: 'Discord', handle: 'Xenwinx\u2019s Server', link: 'https://discord.gg/WTvSSWPDzX', status: 'live', workLog: '' },
        { id: 'sm2', platform: 'Instagram', handle: '@Xenwinx_studio', link: 'https://www.instagram.com/xenwinx_studio/', status: 'live', workLog: '' },
        { id: 'sm3', platform: 'LinkedIn', handle: 'zernobie-winkworth', link: 'https://www.linkedin.com/in/zernobie-winkworth/', status: 'live', workLog: '' },
        { id: 'sm4', platform: 'YouTube', handle: 'Akai animation series', link: '', status: 'not live', workLog: 'Channel art pending.' }
      ] },
      create: {
        artLearning: [], tutorials: [],
        modelling3D: [], environment: []
      },
      financials: {
        revenue: [
          { id: 'ar1', name: 'Story Book Sales (Amazon)', live: true, actual: 1200, target: 2000 },
          { id: 'ar2', name: 'Journal Sales (Amazon)', live: true, actual: 400, target: 800 },
          { id: 'ar3', name: 'Rooted Tales Subscriptions / IAP', live: false, actual: 0, target: 1500 },
          { id: 'ar4', name: 'YouTube (animation)', live: false, actual: 0, target: 300 },
          { id: 'ar5', name: 'Merch', live: false, actual: 0, target: 0 },
          { id: 'ar6', name: 'Sponsorships', live: false, actual: 0, target: 0 }
        ],
        expenses: [
          { id: 'ae1', name: 'Amazon Ads (books & journals)', amount: 0, currency: 'USD', cadence: 'monthly', taxable: false },
          { id: 'ae2', name: 'Print proofs', amount: 0, currency: 'USD', cadence: 'monthly', taxable: false }
        ]
      }
    }),
    aura: mkUniverse({
      id: 'aura', name: 'Aura: The Collector\u2019s Quest', short: 'Aura', status: 'upcoming', cycleYear: 2027,
      tagline: 'Artifact-collecting adventure for kids \u2014 Verdant Wilds to Frozen Expanse',
      skin: { primary: '#3a2418', accent: '#c9a15a', accent2: '#8a6a3f' },
      game: { name: 'Aura: The Collector\u2019s Quest', status: 'planned', designDoc: '', notes: 'Collect magical artifacts across the Verdant Wilds, Earthen Depths, Blazing Peaks, Frozen Expanse.', tasks: [], workflow: [] }
    }),
    kitsune: mkUniverse({
      id: 'kitsune', name: 'The Celestial Kitsune', short: 'Kitsune', status: 'upcoming', cycleYear: 2028,
      tagline: 'A celestial fox reclaiming its powers across elemental realms',
      skin: { primary: '#0f1029', accent: '#f0c14b', accent2: '#8a6fd1' },
      game: { name: 'Legend of the Kitsune: Rise of the Celestial Fox', status: 'planned', designDoc: '', notes: 'A celestial Kitsune trapped in human form journeys through elemental realms to reclaim its powers.', tasks: [], workflow: [] }
    }),
    fireWithAsh: mkUniverse({
      id: 'fireWithAsh', name: 'Fire with Ash', short: 'Fire with Ash', status: 'upcoming', cycleYear: 2029,
      tagline: 'Mesoamerican-inspired resurrection epic',
      skin: { primary: '#3d1a12', accent: '#e0602c', accent2: '#1a1210' },
      game: { name: 'Fire with Ash: Return of the Sun-Blooded', status: 'planned', designDoc: '', notes: 'Ixchelra, a resurrected warrior deity, journeys through six Mesoamerican-inspired regions.', tasks: [], workflow: [] }
    }),
    catchersAndTakers: mkUniverse({
      id: 'catchersAndTakers', name: 'Catchers and Takers', short: 'Catchers & Takers', status: 'upcoming', cycleYear: 2030,
      tagline: 'Open-world cops-and-robbers team play',
      skin: { primary: '#1c2230', accent: '#d94f4f', accent2: '#4f7fd9' },
      game: { name: 'Catchers and Takers', status: 'planned', designDoc: '', notes: 'Players form a team to either rob a bank or catch the robbers.', tasks: [], workflow: [] }
    }),
    iGarden: mkUniverse({
      id: 'iGarden', name: 'i-Garden', short: 'i-Garden', status: 'upcoming', cycleYear: 2030,
      tagline: 'AR garden & plant-care experience',
      skin: { primary: '#1a2e1c', accent: '#e08fae', accent2: '#e8c85a' },
      game: { name: 'i-Garden', status: 'planned', designDoc: '', notes: 'AR game \u2014 a virtual garden/farming experience; become an agriculture specialist or bonsai master.', tasks: [], workflow: [] }
    })
  },

  /* Global (studio-wide, not per-universe) */
  library3D: [
    { id: 'md1', name: 'Phoenix', category: 'Creatures', status: 'done', notes: 'Portfolio piece, reusable across universes.' },
    { id: 'md2', name: 'Shelby Mustang GT 500 1967', category: 'Automobiles', status: 'done', notes: '' },
    { id: 'md3', name: 'Samurai Stone Warrior', category: 'Cartoon & Human', status: 'in progress', notes: '' }
  ],
  studioCosts: [
    { id: 'f1', name: 'Adobe', amount: 11.99, currency: 'USD', cadence: 'monthly', taxable: false },
    { id: 'f2', name: 'Figma', amount: 23, currency: 'USD', cadence: 'monthly', taxable: false },
    { id: 'f3', name: 'SupaBase', amount: 25, currency: 'USD', cadence: 'monthly', taxable: false },
    { id: 'f4', name: 'ElevenLabs', amount: 5, currency: 'USD', cadence: 'monthly', taxable: false },
    { id: 'f5', name: 'Claude', amount: 23, currency: 'USD', cadence: 'monthly', taxable: false },
    { id: 'f6', name: 'Canva', amount: 160, currency: 'ZAR', cadence: 'monthly', taxable: false },
    { id: 'f7', name: 'ChatGPT', amount: 149, currency: 'ZAR', cadence: 'monthly', taxable: false },
    { id: 'f8', name: 'GoDaddy Domain', amount: 2070, currency: 'ZAR', cadence: 'yearly', taxable: false },
    { id: 'f9', name: 'Unreal Engine registration', amount: 0, currency: 'USD', cadence: 'once', taxable: true }
  ],
  goals: [
    { id: 'go1', text: 'Ship Aurora Rescue soft launch', targetDate: '2026-09-15', pillar: 'Game', status: 'in progress' },
    { id: 'go2', text: 'Publish next 3 Akai titles', targetDate: '2026-08-30', pillar: 'Story Books', status: 'delayed' }
  ],
  notes: [{ id: 'n1', text: 'Check in with illustrator about Akai series backlog before end of month.', pillar: 'Story Books' }],
  dailyChecks: [
    { id: 'dc1', date: '2026-07-29', heading: 'Onboarding & priorities sync', area: 'Studio', whatDone: 'Reviewed onboarding checklist and synced with founder on priorities.', whatNeeds: 'Finish Level 3 art pass; confirm Amazon ad budget.', blockers: 'Waiting on Android save-bug repro steps.' }
  ],
  scheduleItems: [],
  masterTrackerItems: [
    { id: 'mt1', text: 'AR business card (NFC) programmed & live', done: true, attachments: [] },
    { id: 'mt2', text: 'Company presentation deck finished', done: true, attachments: [] },
    { id: 'mt3', text: 'Company reel finished', done: true, attachments: [] },
    { id: 'mt4', text: 'Website live at www.xenwinx.com (HTTPS enabled)', done: true, attachments: [] },
    { id: 'mt5', text: 'All 24 journals created', done: true, attachments: [] },
    { id: 'mt6', text: 'Company dashboard rebuild complete', done: true, attachments: [] },
    { id: 'mt7', text: '12 of 24 journals listed on Amazon', done: false, attachments: [] },
    { id: 'mt8', text: '19 books uploaded to Amazon (paperback)', done: false, attachments: [] },
    { id: 'mt9', text: 'Rooted Tales app published', done: false, attachments: [] },
    { id: 'mt10', text: 'Flumfy: Aurora Rescue playable build', done: false, attachments: [] },
    { id: 'mt11', text: 'Physical business cards printed', done: false, attachments: [] },
    { id: 'mt12', text: 'Company registration filed', done: false, attachments: [] }
  ],
  dailyTrackerItems: [
    { id: 'dt1', text: 'Dashboard rebuild (time-boxed 2\u20133 hrs)', done: true, attachments: [] },
    { id: 'dt2', text: 'Friday learning & creating habit active', done: true, attachments: [] },
    { id: 'dt3', text: 'New book layout finalized (cleared before Aug 1)', done: false, attachments: [] },
    { id: 'dt4', text: 'App + Game daily split running (App AM, Game PM)', done: false, attachments: [] },
    { id: 'dt5', text: 'Social media posting activated', done: false, attachments: [] },
    { id: 'dt6', text: 'Amazon Ads live for books/journals', done: false, attachments: [] },
    { id: 'dt7', text: 'Flumfy Godot: player + parallax built', done: false, attachments: [] },
    { id: 'dt8', text: 'Flumfy 1st biome + 3 enemies complete', done: false, attachments: [] },
    { id: 'dt9', text: 'Monthly Akai book shipped', done: false, attachments: [] },
    { id: 'dt10', text: 'App update / version bump released', done: false, attachments: [] }
  ]
};
const UNIVERSE_BASE_ORDER = ['flumfy', 'akai', 'aura', 'kitsune', 'fireWithAsh', 'catchersAndTakers', 'iGarden'];
state.universeOrder = UNIVERSE_BASE_ORDER.slice();
function uOrder() { return state.universeOrder.filter(id => state.universes[id]); }
const AGE_TIER_BY_UNIVERSE = {
  flumfy: 'Early Reader', akai: 'Early Reader', aura: 'Middle Reader', kitsune: 'Teen 13+',
  fireWithAsh: 'Teen 13+', catchersAndTakers: 'Teen 13+', iGarden: 'Early Reader'
};
uOrder().forEach(id => {
  const u = state.universes[id];
  u.financials.giving = Object.assign(defaultGiving(), u.financials.giving, { cause: GIVING_CAUSES[id] || '' });
  u.ageTier = AGE_TIER_BY_UNIVERSE[id] || u.ageTier;
  /* Migration: the old per-universe app's mini-games and gallery ARE this universe's
     Rooted Tales contribution — shared by reference so nothing is lost or duplicated. */
  u.rootedTalesContent.miniGames = u.app.miniGames;
  u.rootedTalesContent.gallery = u.app.gallery;
  u.socialMedia.platforms.forEach(p => { if (!p.posts) p.posts = []; });
});
state.universes.akai.rootedTalesContent.addedToApp = true;
state.universes.akai.rootedTalesContent.versionAdded = '0.4.2';
state.universes.akai.rootedTalesContent.badges = [
  { id: 'bd1', name: 'Bamboo Reader', status: 'done', notes: 'Awarded for finishing any Akai title.' },
  { id: 'bd2', name: 'Ocean Explorer', status: 'planned', notes: 'Awarded for the full ocean arc (parts 14\u201320).' }
];
state.universes.flumfy.rootedTalesContent.versionAdded = '';

/* Shared apps — top-level, not nested in any universe.
   Rooted Tales IS the object Akai's app field already pointed at (same reference, no data lost). */
state.apps = {
  rootedTales: Object.assign(state.universes.akai.app, {
    id: 'rootedTales', displayName: 'Rooted Tales', liveVersion: '0.4.2',
    content: { miniGames: [], gallery: [], badges: [] },
    blurb: 'The permanent reading app \u2014 every universe\u2019s books, journals, gallery, mini-games and badges accumulate here over time.'
  }),
  xenwinxWorlds: {
    id: 'xenwinxWorlds', displayName: 'Xenwinx Worlds', status: 'planned-dormant',
    buildStatus: 'not started', liveVersion: '\u2014', versions: [], bugs: [], workflow: [],
    notes: '',
    blurb: 'The permanent gaming app. Fully deferred \u2014 not a stretch goal. It stays a placeholder until several games exist to populate it; a single-game app would launch bare.'
  }
};
/* Rooted Tales content lives on the app itself, never inside a universe.
   Seeded once from the old per-universe lists so nothing is lost. */
uOrder().forEach(id => {
  const u = state.universes[id], rt = u.rootedTalesContent;
  ['miniGames', 'gallery', 'badges'].forEach(k => {
    (rt[k] || []).forEach(x => state.apps.rootedTales.content[k].push(Object.assign({ universe: u.short }, x)));
  });
});
/* Game workflow process table: Phase / Sub Phase / Task / What it covers / Your status.
   Existing checklist workflows are migrated in so nothing is lost. */
uOrder().forEach(id => {
  const g = state.universes[id].game;
  if (!g.workflowTable) g.workflowTable = [];
  (g.workflow || []).forEach(step => {
    const phase = step.name;
    const subs = step.substeps && step.substeps.length ? step.substeps : [{ id: step.id, name: step.name, done: step.done }];
    subs.forEach(sub => g.workflowTable.push({
      id: uid(), phase, subPhase: '', task: sub.name, covers: '',
      status: sub.done ? 'done' : 'not started'
    }));
  });
  g.workflow = [];
});
state.achievements = [
  { id: 'ac1', text: 'AR business card (NFC) programmed and live', date: '2026-03-12', pillar: 'Studio' },
  { id: 'ac2', text: 'Company reel and presentation deck finished', date: '2026-04-02', pillar: 'Studio' },
  { id: 'ac3', text: 'www.xenwinx.com live with HTTPS', date: '2026-05-20', pillar: 'Studio' },
  { id: 'ac4', text: 'All 24 Akai journals created', date: '2026-06-28', pillar: 'Journal' },
  { id: 'ac5', text: '19 Akai books uploaded to Amazon (paperback)', date: '2026-07-15', pillar: 'Story Books' }
];

/* ---------------- Shell ---------------- */
const STUDIO_NAV = [
  { view: 'overview', label: 'Overview' },
  { view: 'about', label: 'About' },
  { view: 'library', label: '3D Asset Library' },
  { view: 'studiocosts', label: 'Studio Costs' }
];
const APPS_NAV = [
  { view: 'apps-rootedtales', label: 'Rooted Tales' },
  { view: 'apps-xenwinxworlds', label: 'Xenwinx Worlds', dormant: true }
];
const PLANNING_NAV = [
  { view: 'goals', label: 'Goals' }, { view: 'achievements', label: 'Achievements' }, { view: 'schedule', label: 'Schedule' },
  { view: 'notes', label: 'Notes' }, { view: 'dailycheck', label: 'Daily Check' }
];
const DOCS_NAV = [{ view: 'trackers', label: 'Trackers' }];
const UNIVERSE_NAV = [
  { view: 'u-home', label: 'Universe Home' },
  { view: 'u-storybooks', label: 'Story Books' },
  { view: 'u-conceptart', label: 'Concept Art Book' },
  { view: 'u-journal', label: 'Journal' },
  { view: 'u-game', label: 'Game' },
  { view: 'u-worlds', label: 'Xenwinx Worlds Content', dormant: true },
  { view: 'u-animation', label: 'Animation' },
  { view: 'u-merch', label: 'Merch' },
  { view: 'u-social', label: 'Social Media' },
  { view: 'u-create', label: 'Create' },
  { view: 'u-financials', label: 'Financials' }
];

/* ---------------- Persistence ---------------- */
const SAVE_KEY = 'xenwinx-dashboard-v1';
const NO_PERSIST = { modal: 1, draft: 1, history: 1, pillarEdit: 1, navEdit: 1 };
let saveTimer = null, saveWarned = false;
function stateSnapshot(stripAttachments) {
  const out = {};
  Object.keys(state).forEach(k => { if (!NO_PERSIST[k]) out[k] = state[k]; });
  const json = JSON.stringify(out, (k, v) => (stripAttachments && k === 'attachments') ? [] : v);
  return json;
}
function saveState() {
  if (!ACTIVE) return;
  cloudNoteChange();
  try {
    localStorage.setItem(profileKey(ACTIVE), stateSnapshot(false));
  } catch (e) {
    try {
      localStorage.setItem(profileKey(ACTIVE), stateSnapshot(true));
      if (!saveWarned) { saveWarned = true; console.warn('Xenwinx: storage full \u2014 saved without file attachments.'); }
    } catch (e2) { console.warn('Xenwinx: could not save dashboard state.', e2); }
  }
}
function queueSave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveState, 350); }
function deepMerge(target, src) {
  if (!src || typeof src !== 'object') return target;
  Object.keys(src).forEach(k => {
    const sv = src[k], tv = target[k];
    if (Array.isArray(sv)) target[k] = sv;
    else if (sv && typeof sv === 'object' && tv && typeof tv === 'object' && !Array.isArray(tv)) deepMerge(tv, sv);
    else target[k] = sv;
  });
  return target;
}
function loadState(profileId) {
  resetState();
  let raw = null;
  try { raw = localStorage.getItem(profileKey(profileId)); } catch (e) { return; }
  if (!raw) return;
  try { deepMerge(state, JSON.parse(raw)); } catch (e) { console.warn('Xenwinx: saved state unreadable, starting fresh.', e); }
}

const SHELL_HTML = `
<div class="app">
  <aside class="sidebar">
    <div class="brand">
      <svg width="40" height="40" viewBox="0 0 40 40" class="brand-swirl" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="oklch(0.45 0.06 195)" stroke-width="2" stroke-dasharray="70 40" stroke-linecap="round" transform="rotate(-40 20 20)"/></svg>
      <img src="assets/xenwinx-logo.png" alt="Xenwinx" class="brand-logo">
      <div class="brand-name">Xenwinx<span class="brand-dot">.</span></div>
    </div>
    <div id="profileChip"></div>

    <div class="nav-group">
      <div class="nav-label" id="studioNavLabel">Studio</div>
      <div id="studioNav" class="nav-group"></div>
      <div id="studioNavTools"></div>
    </div>

    <div class="nav-group" id="appsGroup">
      <div class="nav-label" id="appsNavLabel">Apps</div>
      <div id="appsNav" class="nav-group"></div>
      <div id="appsNavTools"></div>
    </div>

    <div class="nav-group" id="universeSwitcherGroup">
      <div class="nav-label" id="universeSwitcherLabel">Universe</div>
      <div id="universeSwitcher" class="u-switcher"></div>
      <div id="universeSwitcherTools"></div>
    </div>

    <div class="nav-group" id="universeNavGroup">
      <div class="nav-label" id="universeNavLabel">In this universe</div>
      <div id="universeNav" class="nav-group"></div>
      <div id="universeNavTools"></div>
    </div>

    <div class="nav-group" id="planningGroup">
      <div class="nav-label">Planning</div>
      <div id="planningNav" class="nav-group"></div>
    </div>

    <div class="nav-group" id="docsGroup">
      <div class="nav-label">Docs</div>
      <div id="docsNav" class="nav-group"></div>
    </div>
  </aside>

  <main id="main" class="main">
    <div class="mob-bar"><button class="nav-toggle" data-action="xf-nav" aria-label="Open menu"><span></span><span></span><span></span></button><img src="assets/xenwinx-logo.png" alt="" class="mob-logo"><span class="mob-title">Xenwinx Studio</span></div>
    <button id="backBtn" class="back-btn hidden" data-action="back">&larr; Back</button>
    <div id="mainContent"></div>
  </main>
  <div class="nav-scrim" data-action="xf-nav-close"></div>
</div>

<div id="modalOverlay" class="modal-overlay hidden">
  <div class="modal" id="modalBox"></div>
</div>

<button id="settingsToggle" class="settings-toggle" title="Appearance settings">&#9881;</button>
<div id="settingsPanel" class="settings-panel hidden">
  <div class="settings-title">Appearance</div>
  <label class="settings-row">Theme<select id="themeInput"></select></label>
  <button class="ghost-btn small settings-link" data-action="nav" data-view="profile">Profile, avatar &amp; sections</button>
  <label class="settings-row">Background<input type="color" id="bgColorInput"></label>
  <label class="settings-row">Body text<input type="color" id="fontColorInput"></label>
  <label class="settings-row">Headings<input type="color" id="headingColorInput"></label>
  <label class="settings-row">Sub-headings<input type="color" id="subheadingColorInput"></label>
  <label class="settings-row">Revenue chart style
    <select id="chartStyleInput"><option value="bar">Bar</option><option value="donut">Donut</option><option value="minimal">Minimal</option></select>
  </label>
  <label class="settings-row">Glow on<input type="checkbox" id="glowOnInput"></label>
  <label class="settings-row">Glow color<input type="color" id="glowColorInput"></label>
  <label class="settings-row">Glow strength
    <select id="glowStyleInput"><option value="none">None</option><option value="soft">Soft</option><option value="strong">Strong</option></select>
  </label>
  <button id="settingsReset" class="ghost-btn small">Reset to defaults</button>
</div>`;

let ROOT = null;
const $ = sel => ROOT.querySelector(sel);
const $$ = sel => Array.from(ROOT.querySelectorAll(sel));

/* ---------------- Helpers ---------------- */
function U() { return state.universes[state.activeUniverse]; }
function navigateTo(view) {
  if (view === state.activeView) return;
  state.history.push({ view: state.activeView, universe: state.activeUniverse });
  state.activeView = view;
  render();
}
function goBack() {
  if (!state.history.length) return;
  const prev = state.history.pop();
  state.activeView = prev.view; state.activeUniverse = prev.universe;
  applySkin(); render();
}
function setUniverse(id, view) {
  if (!state.universes[id]) return;
  state.history.push({ view: state.activeView, universe: state.activeUniverse });
  /* Clicking the universe you are already in switches it off again. */
  if (!view && id === state.activeUniverse && state.universeOpen !== false) {
    state.universeOpen = false;
    if (state.activeView.startsWith('u-')) state.activeView = 'overview';
    render(); return;
  }
  state.universeOpen = true;
  state.activeUniverse = id;
  state.activeView = view || (state.activeView.startsWith('u-') ? state.activeView : 'u-home');
  applySkin(); render();
}
function navConfig() {
  const u = U();
  if (!u.navConfig) u.navConfig = { done: {}, hidden: {}, custom: [] };
  if (!u.navConfig.done) u.navConfig.done = {};
  if (!u.navConfig.hidden) u.navConfig.hidden = {};
  if (!u.navConfig.custom) u.navConfig.custom = [];
  return u.navConfig;
}
function navExtras(scope) {
  if (!state.navExtras) state.navExtras = {};
  const c = state.navExtras[scope] || (state.navExtras[scope] = {});
  if (!c.done) c.done = {};
  if (!c.hidden) c.hidden = {};
  if (!c.custom) c.custom = [];
  return c;
}
function cfgFor(scope) { return scope === 'pillars' ? navConfig() : navExtras(scope); }
function customNavEntry(id) {
  const pools = [navExtras('studio').custom, navExtras('apps').custom];
  uOrder().forEach(uid2 => { const n = state.universes[uid2].navConfig; if (n && n.custom) pools.push(n.custom); });
  for (const p of pools) { const hit = p.find(c => c.id === id); if (hit) return hit; }
  return null;
}
function currentCustomPillar() {
  return customNavEntry(state.activeView.replace(/^(u-c-|g-c-)/, ''));
}
function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '\u2014'; }
function statusMeta(status) {
  const s = (status || '').toLowerCase();
  let c = PALETTE.gray;
  if (s === 'pre-production' || s === 'on hold' || s === 'upcoming') c = PALETTE.amber;
  else if (s === 'in development' || s === 'in progress' || s === 'in production' || s === 'active') c = PALETTE.teal;
  else if (['published', 'done', 'resolved', 'created', 'live', 'listed', 'on track', 'in-progress', 'complete', 'available'].includes(s)) c = PALETTE.green;
  else if (['blocked', 'open', 'delayed', 'attention', 'not started', 'not created', 'not listed', 'not live'].includes(s)) c = PALETTE.red;
  return { label: cap(status), color: c, bg: `color-mix(in oklch, ${c} 18%, transparent)`, border: `color-mix(in oklch, ${c} 45%, transparent)` };
}
function badgeMeta(label) {
  const map = { 'On Track': PALETTE.green, 'In Progress': PALETTE.teal, 'Planned': PALETTE.gray, 'Attention': PALETTE.red };
  const c = map[label] || PALETTE.gray;
  return { label, color: c, bg: `color-mix(in oklch, ${c} 18%, transparent)`, border: `color-mix(in oklch, ${c} 45%, transparent)` };
}
function badgeHtml(meta, sizeClass) {
  return `<div class="badge ${sizeClass || ''}" style="background:${meta.bg};color:${meta.color};border-color:${meta.border}">${esc(meta.label)}</div>`;
}
function fmtMoney(n, cur) { return `${cur === 'ZAR' ? 'R' : '$'}${(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function fmtUSD(n) { return fmtMoney(n, 'USD'); }
function optionsHtml(opts, selected) { return opts.map(o => `<option value="${esc(o)}" ${o === selected ? 'selected' : ''}>${esc(o)}</option>`).join(''); }
function toUSD(amount, currency) { return currency === 'ZAR' ? (amount || 0) / ZAR_PER_USD : (amount || 0); }
function monthlyOf(list) {
  return (list || []).reduce((a, x) => a + (x.cadence === 'monthly' ? toUSD(x.amount, x.currency) : x.cadence === 'yearly' ? toUSD(x.amount, x.currency) / 12 : 0), 0);
}
function oneOffOf(list) { return (list || []).reduce((a, x) => a + (x.cadence === 'once' ? toUSD(x.amount, x.currency) : 0), 0); }
function uRevenue(u) { return u.financials.revenue.reduce((a, r) => a + (r.actual || 0), 0); }
function uExpenses(u) { return monthlyOf(u.financials.expenses); }
function uNet(u) { return uRevenue(u) - uExpenses(u); }
function monthsElapsed() { return new Date().getMonth() + 1; }
function uNetYTD(u) { return uNet(u) * monthsElapsed(); }
function givingActive(u) { return uNetYTD(u) > 0; }
function rollup() {
  const universes = uOrder().map(id => state.universes[id]);
  const revenue = universes.reduce((a, u) => a + uRevenue(u), 0);
  const uExp = universes.reduce((a, u) => a + uExpenses(u), 0);
  const overhead = monthlyOf(state.studioCosts);
  return { revenue, uExp, overhead, expenses: uExp + overhead, net: revenue - uExp - overhead };
}
function progressPct(done, target) { return target > 0 ? Math.min(100, (done / target) * 100) : 0; }

/* ---------------- Attachments (images & PDFs, any record) ---------------- */
const ATTACH_ACCEPT = 'image/*,application/pdf';
function attachmentsHtml(type, id, key, list, label) {
  const items = list || [];
  return `<div class="attach-row" style="margin-left:0">
    <label class="attach-btn" style="cursor:pointer">${label || '+ Image / PDF'}<input type="file" multiple accept="${ATTACH_ACCEPT}" style="display:none" data-action="attach-files" data-att-type="${type}" data-att-id="${id}" data-att-key="${key || ''}"></label>
    ${items.map(a => `<div class="attach-chip">
      ${a.isImage ? `<img src="${a.dataUrl}" alt="${esc(a.name)}">` : `<a class="attach-name" href="${a.dataUrl}" target="_blank" download="${esc(a.name)}" style="display:inline-block;text-decoration:none">${esc(a.name)}</a>`}
      <button class="attach-remove" data-action="remove-attachment" data-att-type="${type}" data-att-id="${id}" data-att-key="${key || ''}" data-att="${a.id}">&times;</button>
    </div>`).join('')}
  </div>`;
}
function attachTarget(t) {
  return findIn(t.dataset.attType, t.dataset.attId, t.dataset.attKey || undefined);
}
function workflowOf(scope) {
  const u = U();
  return scope === 'game' ? u.game.workflow : scope === 'rt' ? state.apps.rootedTales.workflow : u.app.workflow;
}

/* ---------------- Skin ---------------- */
function applySkin() {
  const s = activeSkin();
  const el = document.documentElement;
  el.style.setProperty('--u-primary', s.primary);
  el.style.setProperty('--u-accent', s.accent);
  el.style.setProperty('--u-accent2', s.accent2 || s.accent);
}
function applyAppearance() {
  const el = document.documentElement;
  el.style.setProperty('--bg-color', state.appearance.bgColor);
  el.style.setProperty('--font-color', state.appearance.fontColor);
  el.style.setProperty('--heading-color', state.appearance.headingColor || state.appearance.fontColor);
  el.style.setProperty('--subheading-color', state.appearance.subheadingColor || 'oklch(0.46 0.02 80)');
  const a = state.appearance;
  const c = a.glowColor || '#7aa7ff';
  el.style.setProperty('--glow', (!a.glowOn || a.glowStyle === 'none') ? 'none'
    : a.glowStyle === 'strong' ? `0 0 14px ${c}, 0 0 4px ${c}` : `0 0 7px ${c}`);
}

/* ---------------- Render dispatch ---------------- */
const VIEW_RENDERERS = {
  overview: renderOverview, profile: renderProfile, about: renderAbout, library: renderLibrary, studiocosts: renderStudioCosts,
  goals: renderGoals, achievements: renderAchievements, schedule: renderSchedule, notes: renderNotes, dailycheck: renderDailyCheck, trackers: renderTrackers,
  'apps-rootedtales': renderRootedTalesApp, 'apps-xenwinxworlds': renderXenwinxWorldsApp,
  'u-worlds': renderWorldsContent,
  'u-home': renderUniverseHome, 'u-storybooks': renderStoryBooks, 'u-conceptart': renderConceptArt, 'u-journal': renderJournal,
  'u-game': renderGame, 'u-app': renderApp, 'u-animation': renderAnimation, 'u-merch': renderMerch,
  'u-social': renderSocial, 'u-create': renderCreate, 'u-financials': renderUniverseFinancials
};

function navGroupHtml(scope, base, viewPrefix) {
  const cfg = cfgFor(scope), editing = !!state.navEdit[scope];
  const rows = base.map(n => ({ view: n.view, label: n.label, dormant: n.dormant }))
    .concat(cfg.custom.map(c => ({ view: viewPrefix + c.id, label: c.label, custom: c.id, done: c.done })));
  return rows.filter(n => (n.custom || !sectionHidden(n.view)) && (editing || !cfg.hidden[n.view])).map(n => {
    const done = n.custom ? !!n.done : !!cfg.done[n.view];
    const hidden = !!cfg.hidden[n.view];
    const dim = hidden ? ';opacity:.35' : done ? ';opacity:.55' : n.dormant ? ';opacity:.6' : '';
    return `<div class="pillar-row">
      <button class="nav-btn ${state.activeView === n.view ? 'active' : ''}" data-action="nav" data-view="${n.view}" style="flex:1${dim}">${done ? '<span class="pillar-tick">\u2713</span> ' : ''}${esc(n.label)}${n.dormant ? ' <span style="font-size:10px;letter-spacing:.05em;text-transform:uppercase;opacity:.8">planned</span>' : ''}</button>
      ${editing ? `<button class="pillar-mini" title="Mark done" data-action="toggle-nav-done" data-scope="${scope}" data-view="${n.view}"${n.custom ? ` data-pid="${n.custom}"` : ''}>${done ? '\u2713' : '\u25cb'}</button>` : ''}
      ${editing && n.custom ? `<button class="pillar-mini danger" title="Remove" data-action="delete-navitem" data-scope="${scope}" data-pid="${n.custom}">&times;</button>` : ''}
      ${editing && !n.custom ? `<button class="pillar-mini${hidden ? '' : ' danger'}" title="${hidden ? 'Restore' : 'Remove from sidebar'}" data-action="toggle-nav-hidden" data-scope="${scope}" data-view="${n.view}">${hidden ? '+' : '\u00d7'}</button>` : ''}
    </div>`;
  }).join('');
}
function navLabelHtml(scope, text) {
  return `<span>${esc(text)}</span><button class="pillar-edit-btn" data-action="toggle-nav-edit" data-scope="${scope}">${state.navEdit[scope] ? 'Done' : 'Edit'}</button>`;
}
function renderSidebar() {
  const open = state.universeOpen !== false;
  $('#profileChip').innerHTML = profileChipHtml();
  const simpleNav = list => list.filter(n => !sectionHidden(n.view)).map(n => `<button class="nav-btn ${state.activeView === n.view ? 'active' : ''}" data-action="nav" data-view="${n.view}">${esc(n.label)}</button>`).join('');
  $('#planningNav').innerHTML = simpleNav(PLANNING_NAV);
  $('#planningGroup').style.display = $('#planningNav').innerHTML ? '' : 'none';
  $('#docsNav').innerHTML = simpleNav(DOCS_NAV);
  $('#docsGroup').style.display = $('#docsNav').innerHTML ? '' : 'none';

  $('#studioNavLabel').innerHTML = navLabelHtml('studio', 'Studio');
  $('#studioNav').innerHTML = navGroupHtml('studio', STUDIO_NAV, 'g-c-');
  $('#studioNavTools').innerHTML = state.navEdit.studio ? `<button class="pillar-add" data-action="new-navitem" data-scope="studio">+ Add studio page</button>` : '';

  $('#appsNavLabel').innerHTML = navLabelHtml('apps', 'Apps');
  $('#appsNav').innerHTML = navGroupHtml('apps', APPS_NAV, 'g-c-');
  $('#appsNavTools').innerHTML = state.navEdit.apps ? `<button class="pillar-add" data-action="new-navitem" data-scope="apps">+ Add app</button>` : '';
  $('#appsGroup').style.display = (!state.navEdit.apps && !$('#appsNav').innerHTML.trim()) ? 'none' : '';

  const uOff = sectionHidden('grp:universes');
  $('#universeSwitcherGroup').style.display = uOff ? 'none' : '';
  if (uOff) { $('#universeNavGroup').style.display = 'none'; return; }

  const uCfg = navExtras('universeList'), uEditing = !!state.navEdit.universeList;
  $('#universeSwitcherLabel').innerHTML = navLabelHtml('universeList', 'Universe');
  $('#universeSwitcher').innerHTML = uOrder().filter(id => uEditing || !uCfg.hidden[id]).map(id => {
    const u = state.universes[id];
    const active = open && id === state.activeUniverse;
    const hidden = !!uCfg.hidden[id];
    return `<div class="pillar-row">
      <button class="u-tab ${active ? 'active' : ''}" data-action="set-universe" data-u="${id}" style="flex:1${hidden ? ';opacity:.35' : ''}" title="${active ? 'Click again to switch off' : 'Open ' + esc(u.short)}">
        <span class="u-dot" style="background:${u.skin.accent}"></span>
        <span class="u-tab-body"><span class="u-name">${esc(u.short)}</span><span class="u-status u-status-${u.status}">${cap(u.status)}</span></span>
      </button>
      ${uEditing ? `<button class="pillar-mini${hidden ? '' : ' danger'}" title="${hidden ? 'Restore' : 'Hide from sidebar'}" data-action="toggle-nav-hidden" data-scope="universeList" data-view="${id}">${hidden ? '+' : '\u00d7'}</button>
      <button class="pillar-mini danger" title="Delete universe" data-action="delete-universe" data-u="${id}">\u2715</button>` : ''}
    </div>`;
  }).join('');
  $('#universeSwitcherTools').innerHTML = uEditing ? `<button class="pillar-add" data-action="new-universe">+ Add universe</button>` : '';

  const group = $('#universeNavGroup');
  group.style.display = open ? '' : 'none';
  if (!open) { $('#universeNav').innerHTML = ''; $('#universeNavTools').innerHTML = ''; return; }
  $('#universeNavLabel').innerHTML = navLabelHtml('pillars', 'In ' + U().short);
  $('#universeNav').innerHTML = navGroupHtml('pillars', UNIVERSE_NAV, 'u-c-');
  $('#universeNavTools').innerHTML = state.navEdit.pillars ? `<button class="pillar-add" data-action="new-navitem" data-scope="pillars">+ Add pillar</button>` : '';
}

function render() {
  renderSidebar();
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === state.activeView));
  const renderer = /^(u-c-|g-c-)/.test(state.activeView) ? renderCustomPillar : (VIEW_RENDERERS[state.activeView] || renderOverview);
  $('#mainContent').innerHTML = renderer();
  $('#backBtn').classList.toggle('hidden', state.history.length === 0);
  $('#main').scrollTop = 0;
  featuresAfterRender();
  queueSave();
}

function renderCustomPillar() {
  const c = currentCustomPillar();
  if (!c) return renderOverview();
  const inUniverse = state.activeView.startsWith('u-c-');
  return `
  <div class="view narrower">
    ${inUniverse ? universeHeader() : ''}
    <div class="header-row">
      <div><h1 class="page-title">${esc(c.label)}</h1><div class="page-sub" style="margin-bottom:0">${inUniverse ? 'Pillar you added to ' + esc(U().short) : 'Page you added to the sidebar'}</div></div>
      <label class="checkbox-field" style="cursor:pointer;margin:0"><input type="checkbox" data-action="toggle-nav-done" data-scope="${inUniverse ? 'pillars' : 'studio'}" data-view="${state.activeView}" data-pid="${c.id}" ${c.done ? 'checked' : ''}>Done</label>
    </div>
    <div class="card">
      <div style="font-size:15px;font-weight:600;margin-bottom:10px">Notes</div>
      <textarea id="pillarNotes" rows="9" style="width:100%;box-sizing:border-box;font-family:'Work Sans',sans-serif;font-size:13.5px;line-height:1.55;color:inherit;background:var(--t-surface-solid);border:1px solid oklch(0.87 0.013 80);border-radius:8px;padding:11px 13px;resize:vertical">${esc(c.notes || '')}</textarea>
      ${attachmentsHtml('pillar', c.id, 'any', c.attachments)}
    </div>
  </div>`;
}

function universeHeader(sub) {
  const u = U();
  return `<div class="u-header">
    <div class="u-chip" style="background:color-mix(in srgb, ${u.skin.accent} 22%, transparent);border-color:color-mix(in srgb, ${u.skin.accent} 55%, transparent)">${esc(u.short)}</div>
    <div class="u-header-sub">${esc(sub || u.tagline)}</div>
  </div>`;
}

/* ---------------- Overview (company-wide) ---------------- */
function outstandingItems() {
  const out = [];
  uOrder().forEach(id => {
    const u = state.universes[id];
    u.game.tasks.forEach(t => { if (t.status === 'blocked') out.push({ text: `${u.short} \u2014 ${u.game.name}: ${t.name}`, pillar: 'Game' }); });
    u.app.bugs.forEach(b => { if (b.status === 'open' && b.priority === 'high') out.push({ text: `${u.short} \u2014 ${u.app.name}: ${b.title}`, pillar: 'App' }); });
  });
  state.goals.filter(g => g.status === 'delayed').forEach(g => out.push({ text: g.text, pillar: g.pillar }));
  return out;
}
function miniBars(income, expenses) {
  const max = Math.max(income, expenses, 1);
  return `<div class="card">
    <div style="display:flex;align-items:flex-end;gap:40px;height:150px;padding:0 20px">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end">
        <div style="font-size:13px;font-weight:600;color:oklch(0.4 0.12 150)">${fmtUSD(income)}</div>
        <div style="width:64px;border-radius:8px 8px 0 0;background:linear-gradient(180deg,oklch(0.55 0.1 150),oklch(0.4 0.09 150));height:${(income / max) * 100}%"></div>
        <div style="font-size:12px;color:var(--t-muted)">Income</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end">
        <div style="font-size:13px;font-weight:600;color:oklch(0.6 0.16 25)">${fmtUSD(expenses)}</div>
        <div style="width:64px;border-radius:8px 8px 0 0;background:linear-gradient(180deg,oklch(0.68 0.16 25),oklch(0.5 0.15 25));height:${(expenses / max) * 100}%"></div>
        <div style="font-size:12px;color:var(--t-muted)">Expenses</div>
      </div>
    </div>
  </div>`;
}
function renderOverview() {
  if (state.ovTab === 'finance') return renderFinanceTab();
  if (state.ovTab === 'reports') return renderReportsTab();
  const r = rollup();
  const out = outstandingItems();
  const recentAch = state.achievements.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 5);
  const netColor = r.net >= 0 ? 'oklch(0.45 0.13 150)' : 'oklch(0.55 0.17 25)';
  return `
  <div class="view">
    ${overviewHead()}

    <div class="grid-cards">
      <div class="overview-card" data-action="nav" data-view="studiocosts">
        <div class="label">Company revenue / mo</div>
        <div class="big-stat">${fmtUSD(r.revenue)}</div>
        <div class="stat">Est. YTD ${fmtUSD(r.revenue * monthsElapsed())}</div>
      </div>
      <div class="overview-card" data-action="nav" data-view="studiocosts">
        <div class="label">Company expenses / mo</div>
        <div class="big-stat">${fmtUSD(r.expenses)}</div>
        <div class="stat">${fmtUSD(r.overhead)} studio overhead + ${fmtUSD(r.uExp)} universe</div>
      </div>
      <div class="overview-card" data-action="nav" data-view="studiocosts">
        <div class="label">Net this month</div>
        <div class="big-stat" style="color:${netColor}">${fmtUSD(r.net)}</div>
        <div class="stat">Est. YTD ${fmtUSD(r.net * monthsElapsed())}</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:28px">
      <div class="header-row" style="margin-bottom:4px">
        <div style="font-size:15px;font-weight:600">Achievements</div>
        <button class="ghost-btn small" data-action="nav" data-view="achievements">Open log</button>
      </div>
      <div style="font-size:12.5px;color:var(--t-muted);margin-bottom:14px">${state.achievements.length} wins logged — this list updates the moment one is added or edited</div>
      ${recentAch.length === 0 ? `<div style="font-size:13px;color:var(--t-faint)">No wins logged yet.</div>` :
        `<div class="list-col tighter">${recentAch.map(a => `
          <div class="task-row">
            <div style="font-size:11px;color:var(--u-accent);text-transform:uppercase;letter-spacing:.04em;width:110px;flex-shrink:0;font-weight:600">${esc(a.pillar)}</div>
            <div style="font-size:13px;flex:1">${esc(a.text)}</div>
            <div style="font-size:12px;color:var(--t-muted)">${esc(a.date)}</div>
          </div>`).join('')}</div>`}
    </div>

    <div style="font-size:15px;font-weight:600;margin-bottom:4px">Income vs Expenses</div>
    <div style="font-size:12.5px;color:var(--t-muted);margin-bottom:14px">Company-wide, monthly, USD</div>
    ${miniBars(r.revenue, r.expenses)}

    <div class="card" style="margin-top:24px">
      <div style="font-size:15px;font-weight:600;margin-bottom:4px">Outstanding &amp; Delayed</div>
      <div style="color:var(--t-muted);font-size:13px;margin-bottom:14px">Flagged items pulled from every universe</div>
      ${out.length === 0 ? `<div style="font-size:13px;color:var(--t-faint)">Nothing flagged right now.</div>` :
        `<div class="list-col tighter">${out.map(o => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--t-surface-2);border:1px solid oklch(0.87 0.013 80);border-radius:8px">
            <div style="width:8px;height:8px;border-radius:99px;background:oklch(0.68 0.19 25);flex-shrink:0"></div>
            <div style="font-size:13px;flex:1">${esc(o.text)}</div>
            <div style="font-size:11px;color:var(--t-muted);text-transform:uppercase;letter-spacing:0.04em">${esc(o.pillar)}</div>
          </div>`).join('')}</div>`}
    </div>
  </div>`;
}

/* ---------------- Universe home ---------------- */
function renderUniverseHome() {
  const u = U();
  const booksDone = u.storyBooks.items.filter(b => b.status === 'done').length;
  const jCreated = u.journal.items.filter(j => j.created).length;
  const cards = [
    { view: 'u-storybooks', label: 'Story Books', stat: `${booksDone} of ${u.storyBooks.target || 0} done`, badge: u.storyBooks.items.length === 0 ? 'Planned' : booksDone >= (u.storyBooks.target || 0) ? 'On Track' : 'In Progress' },
    { view: 'u-conceptart', label: 'Concept Art Book', stat: `${u.conceptArtBook.pages || 0} pages \u2014 ${u.conceptArtBook.status}`, badge: u.conceptArtBook.status === 'planned' ? 'Planned' : u.conceptArtBook.status === 'done' ? 'On Track' : 'In Progress' },
    { view: 'u-journal', label: 'Journal', stat: `${jCreated} of ${u.journal.target || 0} created`, badge: u.journal.items.length === 0 ? 'Planned' : jCreated >= (u.journal.target || 0) ? 'On Track' : 'In Progress' },
    { view: 'u-game', label: 'Game', stat: `${cap(u.game.status)} \u00b7 ${u.game.tasks.length} tasks`, badge: u.game.tasks.some(t => t.status === 'blocked') ? 'Attention' : u.game.status === 'in development' ? 'In Progress' : u.game.status === 'published' ? 'On Track' : 'Planned' },
    { view: 'u-worlds', label: 'Xenwinx Worlds Content', stat: 'Planned \u2014 not started', badge: 'Planned' },
    { view: 'u-animation', label: 'Animation', stat: `${u.animation.clips.length} clips tracked`, badge: u.animation.clips.length === 0 ? 'Planned' : u.animation.clips.some(c => c.status === 'published') ? 'On Track' : 'In Progress' },
    { view: 'u-merch', label: 'Merch', stat: `${u.merch.items.length} lines planned`, badge: u.merch.items.length === 0 ? 'Planned' : u.merch.items.some(m => m.status === 'available') ? 'On Track' : 'In Progress' },
    { view: 'u-social', label: 'Social Media', stat: `${u.socialMedia.platforms.filter(p => p.status === 'live').length} of ${u.socialMedia.platforms.length} live`, badge: u.socialMedia.platforms.length === 0 ? 'Planned' : u.socialMedia.platforms.every(p => p.status === 'live') ? 'On Track' : 'Attention' },
    { view: 'u-create', label: 'Create', stat: `${u.create.artLearning.length + u.create.tutorials.length + u.create.modelling3D.length + u.create.environment.length} items`, badge: 'In Progress' },
    { view: 'u-financials', label: 'Financials', stat: `Net ${fmtUSD(uNet(u))}/mo`, badge: uNet(u) >= 0 ? 'On Track' : 'Attention' }
  ];
  return `
  <div class="view">
    ${universeHeader()}
    <h1 class="page-title">${esc(u.name)}</h1>
    <div class="page-sub">${cap(u.status)} \u00b7 cycle ${u.cycleYear} \u00b7 ${esc(u.ageTier)}</div>
    <div class="grid-cards">
      ${cards.map(c => `<div class="overview-card" data-action="nav" data-view="${c.view}">
        <div class="label">${c.label}</div>${badgeHtml(badgeMeta(c.badge))}<div class="stat">${c.stat}</div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div style="font-size:15px;font-weight:600;margin-bottom:8px">Universe skin</div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        ${[['Primary', u.skin.primary], ['Accent', u.skin.accent], ['Accent 2', u.skin.accent2]].map(([l, c]) =>
          `<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid oklch(0.87 0.013 80);border-radius:8px">
            <span style="width:18px;height:18px;border-radius:5px;background:${c}"></span>
            <span style="font-size:12.5px;color:var(--t-ink-3)">${l} ${c}</span></div>`).join('')}
        <button class="ghost-btn small" data-action="edit-universe">Edit universe</button>
      </div>
    </div>
  </div>`;
}

/* ---------------- Story books ---------------- */
function chipHtml(active, label, action, id, key) {
  return `<button class="chip ${active ? 'active' : ''}" data-action="${action}" data-id="${id}" data-key="${key}">${label}</button>`;
}
function renderStoryBooks() {
  const u = U();
  const done = u.storyBooks.items.filter(b => b.status === 'done').length;
  return `
  <div class="view">
    ${universeHeader()}
    <div class="header-row" style="margin-bottom:8px">
      <div><h1 class="page-title">Story Books</h1><div class="page-sub" style="margin-bottom:0">${done} of ${u.storyBooks.target || 0} done</div></div>
      <div style="display:flex;gap:8px"><button class="ghost-btn" data-action="edit-target" data-key="storyBooks">Target</button><button class="btn-primary" data-action="new-storybook">+ Add Book</button></div>
    </div>
    <div class="progress-track"><div class="progress-fill" style="width:${progressPct(done, u.storyBooks.target)}%"></div></div>
    ${u.storyBooks.items.length === 0 ? `<div class="empty">No story books yet for ${esc(u.short)}.</div>` : `
    <div class="list-col tight">
      ${u.storyBooks.items.map(bk => { const m = statusMeta(bk.status); return `
        <div class="card tight">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
            <div style="font-size:15px;font-weight:600">${esc(bk.title)}</div>
            <div style="display:flex;align-items:center;gap:10px">
              ${badgeHtml(m, 'sm')}
              <button class="ghost-btn small" data-action="edit-storybook" data-id="${bk.id}">Edit</button>
              <button class="danger-btn small" data-action="delete-storybook" data-id="${bk.id}">&times;</button>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
            ${chipHtml(bk.checklist.cover, 'Cover', 'toggle-checklist', bk.id, 'cover')}
            ${chipHtml(bk.checklist.end, 'End image', 'toggle-checklist', bk.id, 'end')}
            ${chipHtml(bk.checklist.chapter, 'Chapter images', 'toggle-checklist', bk.id, 'chapter')}
            ${chipHtml(bk.checklist.inText, 'In-text images', 'toggle-checklist', bk.id, 'inText')}
            ${chipHtml(bk.checklist.storyBook, 'Story book images', 'toggle-checklist', bk.id, 'storyBook')}
          </div>
        </div>`; }).join('')}
    </div>`}
  </div>`;
}

/* ---------------- Concept art book ---------------- */
function renderConceptArt() {
  const u = U(), c = u.conceptArtBook;
  return `
  <div class="view narrow">
    ${universeHeader()}
    <div class="header-row">
      <div><h1 class="page-title">Concept Art Book</h1><div class="page-sub" style="margin-bottom:0">One art book per universe</div></div>
      <button class="ghost-btn" data-action="edit-conceptart">Edit</button>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
        <div style="font-size:17px;font-weight:600;font-family:var(--t-font-head)">${esc(c.title)}</div>
        ${badgeHtml(statusMeta(c.status), 'sm')}
      </div>
      <div style="margin-top:10px;font-size:13px;color:var(--t-muted)">${c.pages || 0} pages laid out</div>
      <div style="margin-top:14px;font-size:13px;color:var(--t-ink-3)">${esc(c.notes) || 'No notes yet.'}</div>
    </div>
  </div>`;
}

/* ---------------- Journal ---------------- */
function renderJournal() {
  const u = U();
  const created = u.journal.items.filter(j => j.created).length;
  const listed = u.journal.items.filter(j => j.amazonListed).length;
  return `
  <div class="view narrow">
    ${universeHeader()}
    <div class="header-row" style="margin-bottom:8px">
      <div><h1 class="page-title">Journals</h1><div class="page-sub" style="margin-bottom:0">${created} created, ${listed} listed on Amazon (${u.journal.target || 0} target)</div></div>
      <div style="display:flex;gap:8px"><button class="ghost-btn" data-action="edit-target" data-key="journal">Target</button><button class="btn-primary" data-action="new-journal">+ Add Journal</button></div>
    </div>
    <div class="progress-track"><div class="progress-fill" style="width:${progressPct(created, u.journal.target)}%"></div></div>
    ${u.journal.items.length === 0 ? `<div class="empty">No journals yet for ${esc(u.short)}.</div>` : `
    <div class="list-col tight">
      ${u.journal.items.map(j => `
        <div class="card row">
          ${j.group ? `<div style="font-size:11px;color:var(--u-accent);text-transform:uppercase;letter-spacing:0.04em;width:150px;flex-shrink:0;font-weight:600">${esc(j.group)}</div>` : ''}
          <div style="font-size:15px;font-weight:600;flex:1">${esc(j.title)}</div>
          ${badgeHtml(statusMeta(j.created ? 'created' : 'not created'), 'sm')}${badgeHtml(statusMeta(j.amazonListed ? 'listed' : 'not listed'), 'sm')}
          <button class="ghost-btn small" data-action="edit-journal" data-id="${j.id}">Edit</button>
          <button class="danger-btn small" data-action="delete-journal" data-id="${j.id}">&times;</button>
        </div>`).join('')}
    </div>`}
  </div>`;
}

const WF_STATUS_COLOR = {
  'not started': 'oklch(0.62 0.02 80)', 'in progress': PALETTE.amber, 'done': PALETTE.green,
  'blocked': PALETTE.red, 'not needed': 'oklch(0.7 0.02 80)'
};
function workflowTableHtml(g) {
  const rows = g.workflowTable || [];
  const done = rows.filter(r => r.status === 'done').length;
  const cell = 'padding:9px 11px;border-bottom:1px solid oklch(0.9 0.01 80);vertical-align:top;font-size:12.5px;text-wrap:pretty';
  const head = 'padding:9px 11px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--t-muted);font-weight:600;border-bottom:1px solid oklch(0.85 0.013 80);white-space:nowrap';
  return `
  <div style="margin-top:14px;padding-top:14px;border-top:1px solid oklch(0.87 0.013 80)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--t-ink-2)">Workflow process</div>
        <div style="font-size:12px;color:var(--t-muted)">${done} of ${rows.length} tasks done</div>
      </div>
      <button class="ghost-btn small" data-action="new-wfrow">+ Workflow row</button>
    </div>
    ${rows.length === 0 ? `<div style="font-size:13px;color:var(--t-faint)">No workflow rows yet</div>` : `
    <div style="overflow-x:auto;border:1px solid oklch(0.87 0.013 80);border-radius:10px;background:var(--t-surface-solid)">
      <table style="width:100%;border-collapse:collapse;min-width:840px">
        <thead><tr>
          <th style="${head};width:170px">Phase</th>
          <th style="${head};width:150px">Sub Phase</th>
          <th style="${head};width:230px">Task</th>
          <th style="${head}">What it covers</th>
          <th style="${head};width:140px">Your status</th>
          <th style="${head};width:96px"></th>
        </tr></thead>
        <tbody>
          ${rows.map((r, i) => {
            const prev = rows[i - 1];
            const newPhase = !prev || prev.phase !== r.phase;
            return `<tr${newPhase && i > 0 ? ' style="border-top:2px solid var(--t-line-3)"' : ''}>
              <td style="${cell};font-weight:${newPhase ? '600' : '400'};color:${newPhase ? 'var(--u-accent)' : 'oklch(0.72 0.02 80)'}">${esc(r.phase)}</td>
              <td style="${cell};color:var(--t-ink-3)">${esc(r.subPhase) || '&mdash;'}</td>
              <td style="${cell};font-weight:500">${esc(r.task)}</td>
              <td style="${cell};color:var(--t-ink-3)">${esc(r.covers) || '&mdash;'}</td>
              <td style="${cell}">
                <select data-action-input="wfrow-status" data-id="${r.id}" style="font-size:12px;font-family:'Work Sans',sans-serif;border:1px solid oklch(0.82 0.014 80);border-radius:6px;padding:4px 6px;background:#fff;color:${WF_STATUS_COLOR[r.status] || 'inherit'};font-weight:600">
                  ${WF_STATUS.map(s => `<option value="${s}" ${s === r.status ? 'selected' : ''}>${cap(s)}</option>`).join('')}
                </select>
              </td>
              <td style="${cell};white-space:nowrap">
                <button class="ghost-btn small" data-action="edit-wfrow" data-id="${r.id}">Edit</button>
                <button class="danger-btn small" data-action="delete-wfrow" data-id="${r.id}">&times;</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`}
  </div>`;
}

/* ---------------- Game ---------------- */
function renderWorkflow(steps, toggleAction, scope) {
  if (!steps || !steps.length) return '';
  return `<div class="workflow-wrap">${steps.map(w => `
    <div>
      <div style="display:flex;align-items:center;gap:8px">
        <label class="step-row" style="cursor:pointer;flex:1">
          <input type="checkbox" ${w.done ? 'checked' : ''} data-action="${toggleAction}" data-step="${w.id}">
          <span style="font-size:13px;flex:1" class="${w.done ? 'strike' : ''}">${esc(w.name)}</span>
        </label>
        ${scope ? `<button class="ghost-btn small" data-action="new-substep" data-scope="${scope}" data-step="${w.id}">+ Sub-task</button>
        <button class="ghost-btn small" data-action="edit-step" data-scope="${scope}" data-step="${w.id}">Edit</button>
        <button class="danger-btn small" data-action="delete-step" data-scope="${scope}" data-step="${w.id}">&times;</button>` : ''}
      </div>
      ${w.substeps ? `<div class="substep-wrap">${w.substeps.map(sub => `
        <div style="display:flex;align-items:center;gap:8px">
          <label class="substep-row" style="cursor:pointer;flex:1">
            <input type="checkbox" ${sub.done ? 'checked' : ''} data-action="${toggleAction}-sub" data-step="${w.id}" data-sub="${sub.id}">
            <span style="font-size:12.5px;flex:1" class="${sub.done ? 'strike' : ''}">${esc(sub.name)}</span>
          </label>
          ${scope ? `<button class="danger-btn small" data-action="delete-substep" data-scope="${scope}" data-step="${w.id}" data-sub="${sub.id}">&times;</button>` : ''}
        </div>`).join('')}</div>` : ''}
    </div>`).join('')}</div>`;
}
function renderGame() {
  const u = U(), g = u.game;
  return `
  <div class="view">
    ${universeHeader()}
    <div class="header-row">
      <div><h1 class="page-title">${esc(g.name)}</h1><div class="page-sub" style="margin-bottom:0">Game tracker</div></div>
      <button class="ghost-btn" data-action="edit-game">Edit game</button>
    </div>
    <div class="card">
      <div style="display:flex;align-items:center;gap:12px">
        ${badgeHtml(statusMeta(g.status), 'sm')}
        <div style="font-size:13px">${g.designDoc ? `<a href="${esc(g.designDoc)}" target="_blank">Design doc &rarr;</a>` : `<span style="color:var(--t-faint)">No design doc linked</span>`}</div>
      </div>
      <div style="margin-top:14px;padding-top:14px;border-top:1px solid oklch(0.87 0.013 80)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-size:13px;font-weight:600;color:var(--t-ink-2)">Tasks</div>
          <button class="ghost-btn small" data-action="new-task">+ Task</button>
        </div>
        ${g.tasks.length === 0 ? `<div style="font-size:13px;color:var(--t-faint)">No tasks yet</div>` :
          `<div class="list-col tighter">${g.tasks.map(t => `
            <div>
              <div class="task-row">
                <div style="font-size:13px;flex:1">${esc(t.name)}</div>
                <div style="font-size:12px;color:var(--t-muted)">${esc(t.outstanding)}</div>
                ${badgeHtml(statusMeta(t.status), 'xs')}
                <button class="ghost-btn small" data-action="edit-task" data-id="${t.id}">Edit</button>
                <button class="danger-btn small" data-action="delete-task" data-id="${t.id}">&times;</button>
              </div>
              ${attachmentsHtml('task', t.id, '', t.attachments)}
            </div>`).join('')}</div>`}
      </div>
      ${workflowTableHtml(g)}
      <div style="margin-top:14px;font-size:13px;color:var(--t-ink-3)">${esc(g.notes)}</div>
    </div>
  </div>`;
}

/* ---------------- App ---------------- */
function simpleList(items, editAction, deleteAction, emptyText) {
  if (!items.length) return `<div style="font-size:13px;color:var(--t-faint)">${emptyText}</div>`;
  return `<div class="list-col tighter">${items.map(x => `
    <div class="task-row">
      <div style="font-size:13px;flex:1">${esc(x.name || x.title)}</div>
      ${x.notes ? `<div style="font-size:12px;color:var(--t-muted);flex:1">${esc(x.notes)}</div>` : ''}
      ${badgeHtml(statusMeta(x.status), 'xs')}
      <button class="ghost-btn small" data-action="${editAction}" data-id="${x.id}">Edit</button>
      <button class="danger-btn small" data-action="${deleteAction}" data-id="${x.id}">&times;</button>
    </div>`).join('')}</div>`;
}
function renderApp() {
  const u = U(), a = u.app;
  const workflowDone = a.workflow.filter(w => w.done).length;
  return `
  <div class="view">
    ${universeHeader()}
    <h1 class="page-title">${esc(a.name)}</h1>
    <div class="page-sub">App build status &amp; tracking</div>
    <div class="card" style="margin-bottom:18px">
      <div style="font-size:13px;color:var(--t-muted);margin-bottom:8px">Build status</div>
      <select id="appBuildStatus" style="width:100%;padding:9px 10px;border-radius:7px;border:1px solid var(--t-line-2);background:var(--t-input);font-size:13px">${optionsHtml(GAME_STATUS, a.buildStatus)}</select>
      <div style="margin-top:14px">
        <div style="font-size:13px;color:var(--t-muted);margin-bottom:6px">Notes</div>
        <textarea id="appNotes" rows="3" style="width:100%;padding:9px 10px;border-radius:7px;border:1px solid var(--t-line-2);background:var(--t-input);font-size:13px;resize:vertical">${esc(a.notes)}</textarea>
      </div>
    </div>
    ${a.workflow.length ? `
    <div class="card" style="margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-size:15px;font-weight:600">Workflow</div>
        <div style="font-size:12.5px;color:var(--t-muted)">${workflowDone} of ${a.workflow.length} steps done</div>
      </div>
      ${renderWorkflow(a.workflow, 'toggle-app-step')}
    </div>` : ''}
    <div class="card" style="margin-bottom:18px">
      <div class="header-row" style="margin-bottom:10px"><div style="font-size:15px;font-weight:600">Mini games</div><button class="ghost-btn small" data-action="new-minigame">+ Mini game</button></div>
      ${simpleList(a.miniGames, 'edit-minigame', 'delete-minigame', 'No mini games yet')}
    </div>
    <div class="card" style="margin-bottom:18px">
      <div class="header-row" style="margin-bottom:10px"><div style="font-size:15px;font-weight:600">In-app gallery</div><button class="ghost-btn small" data-action="new-gallery">+ Gallery piece</button></div>
      ${simpleList(a.gallery, 'edit-gallery', 'delete-gallery', 'No gallery pieces yet')}
    </div>
    <div class="card" style="margin-bottom:18px">
      <div class="header-row" style="margin-bottom:10px"><div style="font-size:15px;font-weight:600">Version history</div><button class="ghost-btn small" data-action="new-version">+ Version</button></div>
      ${a.versions.length === 0 ? `<div style="font-size:13px;color:var(--t-faint)">No versions logged yet</div>` :
        `<div class="list-col tighter">${a.versions.map(v => `
          <div class="task-row">
            <div style="font-weight:600;font-size:13px">${esc(v.version)}</div>
            <div style="font-size:12px;color:var(--t-muted)">${esc(v.date)}</div>
            <div style="font-size:13px;flex:1;color:var(--t-ink-2)">${esc(v.notes)}</div>
            <button class="ghost-btn small" data-action="edit-version" data-id="${v.id}">Edit</button>
            <button class="danger-btn small" data-action="delete-version" data-id="${v.id}">&times;</button>
          </div>`).join('')}</div>`}
    </div>
    <div class="card">
      <div class="header-row" style="margin-bottom:10px"><div style="font-size:15px;font-weight:600">Outstanding bugs &amp; tasks</div><button class="ghost-btn small" data-action="new-bug">+ Bug/Task</button></div>
      ${a.bugs.length === 0 ? `<div style="font-size:13px;color:var(--t-faint)">Nothing outstanding</div>` :
        `<div class="list-col tighter">${a.bugs.map(b => `
          <div class="task-row">
            <div style="font-size:13px;flex:1">${esc(b.title)}</div>
            <div style="font-size:11px;text-transform:uppercase;color:var(--t-muted)">${esc(b.priority)}</div>
            ${badgeHtml(statusMeta(b.status), 'xs')}
            <button class="ghost-btn small" data-action="edit-bug" data-id="${b.id}">Edit</button>
            <button class="danger-btn small" data-action="delete-bug" data-id="${b.id}">&times;</button>
          </div>`).join('')}</div>`}
    </div>
  </div>`;
}

/* ---------------- Shared apps: Rooted Tales & Xenwinx Worlds (top-level) ---------------- */
function contentList(items, key, emptyText) {
  if (!items.length) return `<div style="font-size:13px;color:var(--t-faint)">${emptyText}</div>`;
  return `<div class="list-col tighter">${items.map(x => `
    <div class="task-row">
      ${x.universe ? `<div style="font-size:11px;color:var(--u-accent);text-transform:uppercase;letter-spacing:.04em;font-weight:600;width:96px;flex-shrink:0">${esc(x.universe)}</div>` : ''}
      <div style="font-size:13px;flex:1">${esc(x.name || x.title)}</div>
      ${x.notes ? `<div style="font-size:12px;color:var(--t-muted);flex:1">${esc(x.notes)}</div>` : ''}
      ${badgeHtml(statusMeta(x.status), 'xs')}
      <button class="ghost-btn small" data-action="edit-appcontent" data-id="${x.id}" data-key="${key}">Edit</button>
      <button class="danger-btn small" data-action="delete-appcontent" data-id="${x.id}" data-key="${key}">&times;</button>
    </div>`).join('')}</div>`;
}
function contentCard(title, sub, items, key, emptyText) {
  return `<div class="card" style="margin-bottom:18px">
    <div class="header-row" style="margin-bottom:10px">
      <div><div style="font-size:15px;font-weight:600">${title}</div><div style="font-size:12.5px;color:var(--t-muted)">${sub}</div></div>
      <button class="ghost-btn small" data-action="new-appcontent" data-key="${key}">+ Add</button>
    </div>
    ${contentList(items, key, emptyText)}
  </div>`;
}
function inputRowHtml(id, label, value) {
  return `<div style="margin-top:14px">
    <div style="font-size:13px;color:var(--t-muted);margin-bottom:6px">${label}</div>
    <input id="${id}" value="${esc(value)}" style="width:100%;padding:9px 10px;border-radius:7px;border:1px solid var(--t-line-2);background:var(--t-input);font-size:13px">
  </div>`;
}
function renderRootedTalesApp() {
  const a = state.apps.rootedTales;
  const included = uOrder().map(id => state.universes[id]).filter(u => u.rootedTalesContent.addedToApp);
  const workflowDone = a.workflow.filter(w => w.done).length;
  return `
  <div class="view">
    <h1 class="page-title">Rooted Tales</h1>
    <div class="page-sub">Shared reading app \u2014 not owned by any one universe. Content accumulates permanently.</div>

    <div class="card" style="margin-bottom:18px">
      <div class="header-row" style="margin-bottom:10px">
        <div style="font-size:15px;font-weight:600">Build</div>
        ${badgeHtml(statusMeta(a.buildStatus), 'sm')}
      </div>
      <div style="font-size:13px;color:var(--t-ink-3);margin-bottom:14px">${esc(a.blurb)}</div>
      <div style="font-size:13px;color:var(--t-muted);margin-bottom:6px">Build status</div>
      <select id="rtBuildStatus" style="width:100%;padding:9px 10px;border-radius:7px;border:1px solid var(--t-line-2);background:var(--t-input);font-size:13px">${optionsHtml(GAME_STATUS, a.buildStatus)}</select>
      ${inputRowHtml('rtLiveVersion', 'Live version', a.liveVersion)}
      <div style="margin-top:14px">
        <div style="font-size:13px;color:var(--t-muted);margin-bottom:6px">Notes</div>
        <textarea id="rtNotes" rows="3" style="width:100%;padding:9px 10px;border-radius:7px;border:1px solid var(--t-line-2);background:var(--t-input);font-size:13px;resize:vertical">${esc(a.notes)}</textarea>
      </div>
    </div>

    <div class="card" style="margin-bottom:18px">
      <div style="font-size:15px;font-weight:600;margin-bottom:4px">Universes included</div>
      <div style="font-size:12.5px;color:var(--t-muted);margin-bottom:14px">${included.length} of ${uOrder().length} universes have content shipped in the app — managed here, not inside the universes</div>
      <div class="list-col tighter">${uOrder().map(id => {
        const u = state.universes[id], rt = u.rootedTalesContent;
        return `<div class="task-row">
          <span class="u-dot" style="background:${u.skin.accent}"></span>
          <div style="font-size:13px;flex:1">${esc(u.name)}</div>
          <input value="${esc(rt.versionAdded || '')}" placeholder="version" data-action-input="rt-version" data-u="${id}" style="flex:0 0 90px;font-size:12px;border:1px solid var(--t-line-2);border-radius:6px;padding:4px 7px;background:rgba(255,255,255,.5);font-family:'Work Sans',sans-serif;color:inherit">
          ${badgeHtml(statusMeta(rt.addedToApp ? 'live' : 'not live'), 'xs')}
          <label class="attach-btn" style="cursor:pointer;display:flex;align-items:center;gap:6px"><input type="checkbox" data-action="toggle-rt-universe" data-u="${id}" ${rt.addedToApp ? 'checked' : ''}>In app</label>
        </div>`;
      }).join('')}</div>
    </div>

    <div class="card" style="margin-bottom:18px">
      <div class="header-row" style="margin-bottom:12px">
        <div><div style="font-size:15px;font-weight:600">Build workflow</div><div style="font-size:12.5px;color:var(--t-muted)">${workflowDone} of ${a.workflow.length} tasks done</div></div>
        <button class="ghost-btn small" data-action="new-step" data-scope="rt">+ Workflow task</button>
      </div>
      ${a.workflow.length ? renderWorkflow(a.workflow, 'toggle-rt-step', 'rt') : `<div style="font-size:13px;color:var(--t-faint)">No workflow tasks yet</div>`}
    </div>

    ${contentCard('Mini games', 'Playable extras in the app', a.content.miniGames, 'rtMiniGames', 'No mini games yet')}
    ${contentCard('Gallery', 'Concept art and key art shown in-app', a.content.gallery, 'rtGallery', 'No gallery pieces yet')}
    ${contentCard('Badges', 'Reading rewards', a.content.badges, 'rtBadges', 'No badges yet')}

    <div class="card" style="margin-bottom:18px">
      <div class="header-row" style="margin-bottom:10px"><div style="font-size:15px;font-weight:600">Version history</div><button class="ghost-btn small" data-action="new-version" data-key="rootedTales">+ Version</button></div>
      ${a.versions.length === 0 ? `<div style="font-size:13px;color:var(--t-faint)">No versions logged yet</div>` :
        `<div class="list-col tighter">${a.versions.map(v => `
          <div class="task-row">
            <div style="font-weight:600;font-size:13px">${esc(v.version)}</div>
            <div style="font-size:12px;color:var(--t-muted)">${esc(v.date)}</div>
            <div style="font-size:13px;flex:1;color:var(--t-ink-2)">${esc(v.notes)}</div>
            <button class="ghost-btn small" data-action="edit-version" data-id="${v.id}" data-key="rootedTales">Edit</button>
            <button class="danger-btn small" data-action="delete-version" data-id="${v.id}" data-key="rootedTales">&times;</button>
          </div>`).join('')}</div>`}
    </div>

    <div class="card">
      <div class="header-row" style="margin-bottom:10px"><div style="font-size:15px;font-weight:600">Bug list</div><button class="ghost-btn small" data-action="new-bug" data-key="rootedTales">+ Bug/Task</button></div>
      ${a.bugs.length === 0 ? `<div style="font-size:13px;color:var(--t-faint)">Nothing outstanding</div>` :
        `<div class="list-col tighter">${a.bugs.map(b => `
          <div class="task-row">
            <div style="font-size:13px;flex:1">${esc(b.title)}</div>
            <div style="font-size:11px;text-transform:uppercase;color:var(--t-muted)">${esc(b.priority)}</div>
            ${badgeHtml(statusMeta(b.status), 'xs')}
            <button class="ghost-btn small" data-action="edit-bug" data-id="${b.id}" data-key="rootedTales">Edit</button>
            <button class="danger-btn small" data-action="delete-bug" data-id="${b.id}" data-key="rootedTales">&times;</button>
          </div>`).join('')}</div>`}
    </div>
  </div>`;
}
function dormantBanner(text) {
  return `<div style="padding:14px 16px;border:1px dashed oklch(0.72 0.02 80);border-radius:10px;background:repeating-linear-gradient(135deg,rgba(255,255,255,.4) 0 10px,rgba(0,0,0,.02) 10px 20px);margin-bottom:18px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
      ${badgeHtml(statusMeta('not started'), 'sm')}
      <div style="font-size:13px;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--t-muted)">Planned \u2014 not started</div>
    </div>
    <div style="font-size:13px;color:var(--t-ink-3);text-wrap:pretty">${text}</div>
  </div>`;
}
function renderXenwinxWorldsApp() {
  const a = state.apps.xenwinxWorlds;
  return `
  <div class="view narrower">
    <h1 class="page-title" style="opacity:.75">Xenwinx Worlds</h1>
    <div class="page-sub">Shared gaming app \u2014 tracked as a placeholder only. No active work.</div>
    ${dormantBanner(esc(a.blurb))}
    <div class="card" style="opacity:.7">
      <div style="font-size:15px;font-weight:600;margin-bottom:12px">Placeholder record</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px">
        ${[['Status', 'Planned \u2014 dormant'], ['Build status', 'Not started'], ['Live version', '\u2014'], ['Universes included', 'None yet']].map(([l, v]) =>
          `<div style="padding:12px 14px;border-radius:9px;border:1px dashed var(--t-line-2);background:rgba(255,255,255,0.35)">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--t-muted);margin-bottom:6px">${l}</div>
            <div style="font-size:13.5px;color:var(--t-ink-2)">${v}</div></div>`).join('')}
      </div>
      <div style="margin-top:14px;font-size:12.5px;color:var(--t-muted)">Unlocks when several games have shipped. Per-universe ideas parked for it live under each universe\u2019s Xenwinx Worlds Content page.</div>
    </div>
  </div>`;
}
function renderWorldsContent() {
  const u = U(), w = u.xenwinxWorldsContent;
  return `
  <div class="view narrower">
    ${universeHeader()}
    <div class="header-row">
      <div><h1 class="page-title" style="opacity:.8">Xenwinx Worlds Content</h1><div class="page-sub" style="margin-bottom:0">Ideas parked for the gaming app \u2014 no active work</div></div>
      <button class="ghost-btn" data-action="nav" data-view="apps-xenwinxworlds">Open app record</button>
    </div>
    ${dormantBanner('Xenwinx Worlds is fully deferred. Anything logged here is a parked idea for when the app is eventually built \u2014 it is not scheduled work.')}
    <div style="opacity:.82">
      ${contentCard('Level cheats', 'Unlocks and hints for shipped games', w.levelCheats, 'wCheats', 'Nothing parked yet')}
      ${contentCard('Bonus cutscenes', 'Extra story beats held for the app', w.bonusCutscenes, 'wCutscenes', 'Nothing parked yet')}
      ${contentCard('Community showcase', 'Curated player creations \u2014 no open chat', w.communityShowcase, 'wShowcase', 'Nothing parked yet')}
    </div>
  </div>`;
}

/* ---------------- Achievements (global completed-wins log) ---------------- */
function renderAchievements() {
  const list = state.achievements.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return `
  <div class="view narrower">
    <div class="header-row">
      <div><h1 class="page-title">Achievements</h1><div class="page-sub" style="margin-bottom:0">Shipped wins \u2014 separate from active Goals</div></div>
      <button class="btn-primary" data-action="new-achievement">+ Add Win</button>
    </div>
    ${list.length === 0 ? `<div class="empty">No wins logged yet.</div>` : `
    <div class="list-col tighter">
      ${list.map(a => `
        <div class="card">
          <div class="row" style="gap:12px">
            <div style="font-size:11px;color:var(--u-accent);text-transform:uppercase;letter-spacing:0.04em;width:110px;flex-shrink:0;font-weight:600">${esc(a.pillar)}</div>
            <div style="font-size:14px;flex:1">${esc(a.text)}</div>
            <div style="font-size:12px;color:var(--t-muted)">${esc(a.date)}</div>
            ${badgeHtml(badgeMeta('On Track'), 'sm')}
            <button class="ghost-btn small" data-action="edit-achievement" data-id="${a.id}">Edit</button>
            <button class="danger-btn small" data-action="delete-achievement" data-id="${a.id}">&times;</button>
          </div>
          ${attachmentsHtml('achievement', a.id, '', a.attachments)}
        </div>`).join('')}
    </div>`}
  </div>`;
}

/* ---------------- Animation ---------------- */
function renderAnimation() {
  const u = U();
  return `
  <div class="view narrow">
    ${universeHeader()}
    <div class="header-row">
      <div><h1 class="page-title">Animation</h1><div class="page-sub" style="margin-bottom:0">Clips &amp; episodes \u2014 reuses this universe\u2019s game environments</div></div>
      <button class="btn-primary" data-action="new-clip">+ Add Clip</button>
    </div>
    ${u.animation.clips.length === 0 ? `<div class="empty">No clips yet for ${esc(u.short)}.</div>` : `
    <div class="list-col tight">
      ${u.animation.clips.map(a => `
        <div class="card tight">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
            <div style="display:flex;flex-direction:column;gap:8px;flex:1;min-width:0">
              <div style="font-size:15px;font-weight:600">${esc(a.title)}</div>
              ${badgeHtml(statusMeta(a.status), 'sm')}
            </div>
            <div style="display:flex;gap:8px">
              <button class="ghost-btn small" data-action="edit-clip" data-id="${a.id}">Edit</button>
              <button class="danger-btn small" data-action="delete-clip" data-id="${a.id}">Delete</button>
            </div>
          </div>
          <div style="margin-top:10px;font-size:13px;color:var(--t-ink-3)">${esc(a.notes)}</div>
        </div>`).join('')}
    </div>`}
  </div>`;
}

/* ---------------- Merch ---------------- */
function renderMerch() {
  const u = U();
  return `
  <div class="view narrow">
    ${universeHeader()}
    <div class="header-row">
      <div><h1 class="page-title">Merchandise</h1><div class="page-sub" style="margin-bottom:0">Activates once ${esc(u.short)} ships</div></div>
      <button class="btn-primary" data-action="new-merch">+ Add Item</button>
    </div>
    ${u.merch.items.length === 0 ? `<div class="empty">No merch lines yet for ${esc(u.short)}.</div>` : `
    <div class="list-col tighter">
      ${u.merch.items.map(x => `
        <div class="card row">
          <div style="font-size:11px;color:var(--u-accent);text-transform:uppercase;letter-spacing:0.04em;width:120px;flex-shrink:0;font-weight:600">${esc(x.category)}</div>
          <div style="font-size:14px;flex:1">${esc(x.name)}</div>
          ${badgeHtml(statusMeta(x.status), 'sm')}
          <button class="ghost-btn small" data-action="edit-merch" data-id="${x.id}">Edit</button>
          <button class="danger-btn small" data-action="delete-merch" data-id="${x.id}">&times;</button>
        </div>`).join('')}
    </div>`}
  </div>`;
}

/* ---------------- Social ---------------- */
function renderSocial() {
  const u = U();
  return `
  <div class="view narrower">
    ${universeHeader()}
    <div class="header-row">
      <div><h1 class="page-title">Social Media</h1><div class="page-sub" style="margin-bottom:0">Channels, posts and notes for ${esc(u.short)}</div></div>
      <button class="btn-primary" data-action="new-social">+ Add Channel</button>
    </div>
    ${u.socialMedia.platforms.length === 0 ? `<div class="empty">No channels yet for ${esc(u.short)}.</div>` : `
    <div class="list-col tighter">
      ${u.socialMedia.platforms.map(x => `
        <div class="card" style="display:flex;flex-direction:column;gap:6px">
          <div class="row" style="gap:14px">
            <div style="font-size:15px;font-weight:600;width:110px;flex-shrink:0">${esc(x.platform)}</div>
            ${x.link ? `<a href="${esc(x.link)}" target="_blank" style="font-size:13px;flex:1">${esc(x.handle)}</a>` : `<div style="font-size:13px;flex:1;color:var(--t-muted)">${esc(x.handle)}</div>`}
            ${badgeHtml(statusMeta(x.status), 'sm')}
            <button class="ghost-btn small" data-action="new-socialpost" data-key="${x.id}">+ Log post</button>
            <button class="ghost-btn small" data-action="edit-social" data-id="${x.id}">Edit</button>
            <button class="danger-btn small" data-action="delete-social" data-id="${x.id}">&times;</button>
          </div>
          ${x.workLog ? `<div style="font-size:12.5px;color:var(--t-muted);margin-left:124px">${esc(x.workLog)}</div>` : ''}
          ${(x.posts || []).length === 0 ? `<div style="font-size:12.5px;color:var(--t-faint);margin-left:124px">No posts logged yet</div>` :
            `<div class="list-col tighter" style="margin-top:4px">${x.posts.slice().sort((p, q) => (q.date || '').localeCompare(p.date || '')).map(p => `
              <div style="border:1px solid oklch(0.87 0.013 80);border-radius:8px;padding:10px 12px;background:var(--t-surface-solid)">
                <div class="row" style="gap:10px">
                  <div style="font-size:12px;color:var(--u-accent);font-weight:600;width:92px;flex-shrink:0">${esc(p.date) || '\u2014'}</div>
                  <div style="font-size:13px;flex:1">${esc(p.what)}</div>
                  <button class="ghost-btn small" data-action="edit-socialpost" data-id="${p.id}" data-key="${x.id}">Edit</button>
                  <button class="danger-btn small" data-action="delete-socialpost" data-id="${p.id}" data-key="${x.id}">&times;</button>
                </div>
                ${p.notes ? `<div style="font-size:12.5px;color:var(--t-ink-3);margin-top:6px;text-wrap:pretty">${esc(p.notes)}</div>` : ''}
                ${attachmentsHtml('socialpost', p.id, x.id, p.attachments)}
              </div>`).join('')}</div>`}
        </div>`).join('')}
    </div>`}
  </div>`;
}

/* ---------------- Create (per universe) ---------------- */
const CREATE_SECTIONS = [
  { key: 'artLearning', label: 'Art Learning', sub: 'Studies &amp; skill work' },
  { key: 'tutorials', label: 'Tutorials', sub: 'Courses and walkthroughs followed' },
  { key: 'modelling3D', label: '3D Modelling', sub: 'Models built for this universe' },
  { key: 'environment', label: 'Environment', sub: 'Scene concepts &amp; environment art' }
];
function renderCreate() {
  const u = U();
  return `
  <div class="view">
    ${universeHeader()}
    <h1 class="page-title">Create</h1>
    <div class="page-sub">Learning, tutorials, 3D and environment work for ${esc(u.short)}</div>
    <div class="list-col">
      ${CREATE_SECTIONS.filter(sec => !sectionHidden('create:' + sec.key)).map(sec => {
        const items = u.create[sec.key];
        return `<div class="card">
          <div class="header-row" style="margin-bottom:4px">
            <div style="font-size:15px;font-weight:600">${sec.label}</div>
            <button class="ghost-btn small" data-action="new-create" data-key="${sec.key}">+ Add</button>
          </div>
          <div style="font-size:12.5px;color:var(--t-muted);margin-bottom:12px">${sec.sub}</div>
          ${items.length === 0 ? `<div style="font-size:13px;color:var(--t-faint)">Nothing logged yet</div>` :
            `<div class="list-col tighter">${items.map(x => `
              <div class="task-row">
                ${x.category ? `<div style="font-size:11px;color:var(--u-accent);text-transform:uppercase;letter-spacing:.04em;font-weight:600;width:110px">${esc(x.category)}</div>` : ''}
                <div style="font-size:13px;flex:1">${esc(x.name)}</div>
                ${x.notes ? `<div style="font-size:12px;color:var(--t-muted)">${esc(x.notes)}</div>` : ''}
                ${badgeHtml(statusMeta(x.status), 'xs')}
                <button class="ghost-btn small" data-action="edit-create" data-key="${sec.key}" data-id="${x.id}">Edit</button>
                <button class="danger-btn small" data-action="delete-create" data-key="${sec.key}" data-id="${x.id}">&times;</button>
              </div>`).join('')}</div>`}
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

/* ---------------- Universe financials ---------------- */
function revenueRowHtml(r) {
  const chartStyle = state.appearance.chartStyle;
  const pctNum = r.target > 0 ? Math.min(100, (r.actual / r.target) * 100) : 0;
  const circumference = 2 * Math.PI * 14;
  let chart;
  if (chartStyle === 'bar') chart = `<div class="progress-track thin" style="flex:1"><div class="progress-fill" style="width:${pctNum}%"></div></div>`;
  else if (chartStyle === 'donut') chart = `<div style="flex-shrink:0;width:34px;height:34px"><svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="14" fill="none" stroke="oklch(0.92 0.013 80)" stroke-width="5"/><circle cx="17" cy="17" r="14" fill="none" stroke="var(--u-accent)" stroke-width="5" stroke-dasharray="${(pctNum / 100) * circumference} ${circumference}" transform="rotate(-90 17 17)" stroke-linecap="round"/></svg></div><div style="flex:1"></div>`;
  else chart = `<div style="flex:1;font-size:12.5px;font-weight:600;color:var(--u-accent)">${Math.round(pctNum)}%</div>`;
  return `<div class="card row" style="gap:16px">
    <div style="font-size:14px;font-weight:600;width:220px">${esc(r.name)}</div>
    ${badgeHtml(statusMeta(r.live ? 'live' : 'not live'), 'sm')}
    ${chart}
    <div style="font-size:13px;color:var(--t-ink-2);width:150px;text-align:right">$${(r.actual || 0).toLocaleString()} / $${(r.target || 0).toLocaleString()}</div>
    <button class="ghost-btn small" data-action="edit-revenue" data-id="${r.id}">Edit</button>
    <button class="danger-btn small" data-action="delete-revenue" data-id="${r.id}">&times;</button>
  </div>`;
}
function expenseGroupsHtml(list, editAction, deleteAction) {
  const groups = [
    { label: 'Monthly \u2014 USD', rows: list.filter(x => x.cadence === 'monthly' && x.currency === 'USD'), cur: 'USD' },
    { label: 'Monthly \u2014 ZAR', rows: list.filter(x => x.cadence === 'monthly' && x.currency === 'ZAR'), cur: 'ZAR' },
    { label: 'Yearly', rows: list.filter(x => x.cadence === 'yearly'), cur: null },
    { label: 'One-off', rows: list.filter(x => x.cadence === 'once'), cur: null }
  ].filter(g => g.rows.length);
  if (!groups.length) return `<div style="font-size:13px;color:var(--t-faint)">No expenses logged</div>`;
  return `<div class="list-col" style="gap:20px">${groups.map(grp => {
    const total = grp.rows.reduce((a, x) => a + toUSD(x.amount, x.currency), 0);
    return `<div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="font-size:13px;font-weight:600;color:var(--t-ink-2)">${grp.label}</div>
        <div style="font-size:13px;font-weight:600;color:var(--u-accent)">Total: ${fmtUSD(total)}</div>
      </div>
      <div class="list-col tighter">${grp.rows.map(row => `
        <div style="display:flex;align-items:center;gap:12px;background:var(--t-surface-solid);border:1px solid oklch(0.87 0.013 80);border-radius:8px;padding:10px 14px">
          <div style="font-size:13px;flex:1">${esc(row.name)}</div>
          ${row.taxable ? `<div style="font-size:11px;text-transform:uppercase;color:var(--t-muted)">taxable</div>` : ''}
          <div style="font-size:13px;color:var(--t-ink-2)">${fmtMoney(row.amount, row.currency)}</div>
          <button class="ghost-btn small" data-action="${editAction}" data-id="${row.id}">Edit</button>
          <button class="danger-btn small" data-action="${deleteAction}" data-id="${row.id}">&times;</button>
        </div>`).join('')}</div>
    </div>`;
  }).join('')}</div>`;
}
function renderUniverseFinancials() {
  const u = U();
  const rev = uRevenue(u), exp = uExpenses(u), net = rev - exp;
  const oneOff = oneOffOf(u.financials.expenses);
  return `
  <div class="view narrower">
    ${universeHeader()}
    <div class="header-row">
      <div><h1 class="page-title">${esc(u.short)} Financials</h1><div class="page-sub" style="margin-bottom:0">Revenue, expenses and net position for this universe only</div></div>
      <button class="btn-primary" data-action="new-uexpense">+ Add Expense</button>
    </div>

    <div class="grid-cards small">
      <div class="card"><div style="font-size:12.5px;color:var(--t-muted)">Revenue / mo</div><div class="big-stat">${fmtUSD(rev)}</div></div>
      <div class="card"><div style="font-size:12.5px;color:var(--t-muted)">Expenses / mo</div><div class="big-stat">${fmtUSD(exp)}</div></div>
      <div class="card"><div style="font-size:12.5px;color:var(--t-muted)">Net / mo</div><div class="big-stat" style="color:${net >= 0 ? 'oklch(0.45 0.13 150)' : 'oklch(0.55 0.17 25)'}">${fmtUSD(net)}</div></div>
      <div class="card"><div style="font-size:12.5px;color:var(--t-muted)">Est. net YTD</div><div class="big-stat">${fmtUSD(net * monthsElapsed())}</div></div>
    </div>

    <div style="margin-bottom:24px">
      <div class="header-row" style="margin-bottom:12px">
        <div><div style="font-size:15px;font-weight:600">Revenue by source</div><div style="font-size:12.5px;color:var(--t-muted)">Monthly actual vs target</div></div>
        <button class="ghost-btn small" data-action="new-revenue">+ Stream</button>
      </div>
      <div class="list-col tighter">${u.financials.revenue.map(revenueRowHtml).join('')}</div>
    </div>

    <div style="font-size:15px;font-weight:600;margin-bottom:12px">Expenses tagged to ${esc(u.short)}</div>
    ${expenseGroupsHtml(u.financials.expenses, 'edit-uexpense', 'delete-uexpense')}
    ${oneOff ? `<div style="margin-top:10px;font-size:12.5px;color:var(--t-muted)">One-off costs to date: ${fmtUSD(oneOff)} (excluded from the monthly net)</div>` : ''}

    <div style="margin-top:28px">
      <div style="font-size:15px;font-weight:600;margin-bottom:4px">Income vs Expenses</div>
      <div style="font-size:12.5px;color:var(--t-muted);margin-bottom:14px">${esc(u.short)} only, monthly, USD</div>
      ${miniBars(rev, exp)}
    </div>
    ${givingPanelHtml(u)}
    <div style="margin-top:14px;font-size:12px;color:var(--t-muted)">Studio-wide tooling costs are tracked separately under Studio Costs and added to the company roll-up on Overview.</div>
  </div>`;
}

/* ---------------- Giving (planned allocation per universe) ---------------- */
function givingPanelHtml(u) {
  const g = u.financials.giving;
  const active = givingActive(u);
  const alloc = g.allocationPercent == null ? 'Not set' : g.allocationPercent + '%';
  const box = (label, value) => `<div style="padding:12px 14px;border-radius:9px;border:1px dashed var(--t-line-2);background:rgba(255,255,255,0.35)">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--t-muted);margin-bottom:6px">${label}</div>
    <div style="font-size:13.5px;color:var(--t-ink-2)">${value}</div></div>`;
  return `
  <div class="card" style="margin-top:28px;${active ? '' : 'opacity:.62'}">
    <div class="header-row" style="margin-bottom:4px">
      <div style="font-size:15px;font-weight:600">Giving</div>
      <div style="display:flex;align-items:center;gap:10px">
        ${badgeHtml(active ? badgeMeta('In Progress') : statusMeta('not started'), 'sm')}
        <button class="ghost-btn small" data-action="edit-giving">Edit</button>
      </div>
    </div>
    <div style="font-size:12.5px;color:var(--t-muted);margin-bottom:14px">Planned allocation — ${active ? 'this universe is profitable, allocation can be switched on' : 'inactive until ' + esc(u.short) + ' is profitable (net YTD above zero)'}</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
      ${box('Cause', g.cause ? esc(g.cause) : '<span style="color:oklch(0.55 0.17 25)">Not yet assigned \u2014 decide before this goes live</span>')}
      ${box('Allocation', alloc)}
      ${box('Status', active ? 'Eligible — nothing given yet' : esc(g.status))}
    </div>
    <div style="margin-top:12px;font-size:12px;color:var(--t-muted)">No funds are being given yet — this is a planned allocation, not an active commitment.</div>
  </div>`;
}

/* ---------------- Studio costs (global) ---------------- */
function renderStudioCosts() {
  const r = rollup();
  return `
  <div class="view narrower">
    <div class="header-row">
      <div><h1 class="page-title">Studio Costs</h1><div class="page-sub" style="margin-bottom:0">Shared tooling &amp; company overheads \u2014 not tied to one universe</div></div>
      <button class="btn-primary" data-action="new-expense">+ Add Cost</button>
    </div>
    <div class="grid-cards small">
      <div class="card"><div style="font-size:12.5px;color:var(--t-muted)">Overhead / mo</div><div class="big-stat">${fmtUSD(r.overhead)}</div></div>
      <div class="card"><div style="font-size:12.5px;color:var(--t-muted)">Universe expenses / mo</div><div class="big-stat">${fmtUSD(r.uExp)}</div></div>
      <div class="card"><div style="font-size:12.5px;color:var(--t-muted)">Company net / mo</div><div class="big-stat" style="color:${r.net >= 0 ? 'oklch(0.45 0.13 150)' : 'oklch(0.55 0.17 25)'}">${fmtUSD(r.net)}</div></div>
    </div>
    ${expenseGroupsHtml(state.studioCosts, 'edit-expense', 'delete-expense')}
    <div style="margin-top:24px">
      <div style="font-size:15px;font-weight:600;margin-bottom:12px">Per-universe net</div>
      <div class="list-col tighter">
        ${uOrder().map(id => { const u = state.universes[id]; const net = uNet(u); return `
          <div class="card row" data-action="open-universe" data-u="${id}" style="cursor:pointer">
            <span style="width:10px;height:10px;border-radius:99px;background:${u.skin.accent}"></span>
            <div style="font-size:14px;flex:1">${esc(u.name)}</div>
            <div style="font-size:13px;color:var(--t-muted)">Rev ${fmtUSD(uRevenue(u))}</div>
            <div style="font-size:13px;color:var(--t-muted)">Exp ${fmtUSD(uExpenses(u))}</div>
            <div style="font-size:13px;font-weight:600;width:110px;text-align:right;color:${net >= 0 ? 'oklch(0.45 0.13 150)' : 'oklch(0.55 0.17 25)'}">${fmtUSD(net)}</div>
          </div>`; }).join('')}
      </div>
    </div>
  </div>`;
}

/* ---------------- 3D Asset Library (global) ---------------- */
function renderLibrary() {
  return `
  <div class="view narrow">
    <div class="header-row">
      <div><h1 class="page-title">3D Asset Library</h1><div class="page-sub" style="margin-bottom:0">Shared models reusable across every universe</div></div>
      <button class="btn-primary" data-action="new-model">+ Add Model</button>
    </div>
    <div class="list-col tighter">
      ${state.library3D.map(x => `
        <div class="card row">
          <div style="font-size:11px;color:oklch(0.62 0.09 50);text-transform:uppercase;letter-spacing:0.04em;width:130px;flex-shrink:0;font-weight:600">${esc(x.category)}</div>
          <div style="font-size:14px;flex:1">${esc(x.name)}</div>
          ${badgeHtml(statusMeta(x.status), 'sm')}
          <button class="ghost-btn small" data-action="edit-model" data-id="${x.id}">Edit</button>
          <button class="danger-btn small" data-action="delete-model" data-id="${x.id}">&times;</button>
        </div>`).join('')}
    </div>
  </div>`;
}

/* ---------------- About ---------------- */
function renderAbout() {
  return `
  <div class="view narrow">
    <div style="display:flex;align-items:center;gap:20px;margin-bottom:22px">
      <div style="width:64px;height:64px;flex-shrink:0;border-radius:14px;background:oklch(0.97 0.005 195);display:flex;align-items:center;justify-content:center;overflow:hidden">
        <img src="assets/xenwinx-logo.png" alt="Xenwinx logo" style="width:100%;height:100%;object-fit:contain;padding:4px">
      </div>
      <div>
        <h1 style="font-family:var(--t-font-head);font-size:32px;font-weight:700;margin:0">Xenwinx Studio</h1>
        <div style="font-size:13px;color:var(--t-muted);margin-top:4px">Established ${COMPANY_INFO.established} &middot; Founder: ${esc(COMPANY_INFO.founder)}</div>
      </div>
    </div>
    <div style="font-family:var(--t-font-head);font-style:italic;font-size:18px;color:var(--u-accent);margin-bottom:22px">&ldquo;${esc(COMPANY_INFO.tagline)}&rdquo;</div>
    <div class="card" style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;color:oklch(0.42 0.066 195)">Corporate Vision</div>
      <div style="font-size:14px;line-height:1.6;color:var(--t-ink-2)">${esc(COMPANY_INFO.vision)}</div>
    </div>
    <div class="card" style="margin-bottom:22px">
      <div style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;color:oklch(0.35 0.06 195)">Mission</div>
      <div style="font-size:14px;line-height:1.6;color:var(--t-ink-2)">${esc(COMPANY_INFO.mission)}</div>
    </div>
    <div style="font-size:15px;font-weight:600;margin-bottom:10px">Core Competencies</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px">
      ${COMPANY_INFO.competencies.map(c => `<div style="padding:9px 14px;background:var(--t-surface-solid);border:1px solid oklch(0.87 0.013 80);border-radius:8px;font-size:13px;color:var(--t-ink-2)">${esc(c)}</div>`).join('')}
    </div>
  </div>`;
}

/* ---------------- Goals ---------------- */
function renderGoals() {
  return `
  <div class="view narrow">
    <div class="header-row">
      <div><h1 class="page-title">Goals</h1><div class="page-sub" style="margin-bottom:0">Studio-wide targets across all universes</div></div>
      <button class="btn-primary" data-action="new-goal">+ Add Goal</button>
    </div>
    <div class="list-col tighter">
      ${state.goals.map(go => `
        <div class="card row">
          <div style="font-size:14px;flex:1">${esc(go.text)}</div>
          <div style="font-size:12px;color:var(--t-muted)">${esc(go.targetDate)}</div>
          <div style="font-size:11px;color:oklch(0.62 0.09 50);text-transform:uppercase;letter-spacing:0.04em;width:100px">${esc(go.pillar)}</div>
          ${badgeHtml(statusMeta(go.status), 'sm')}
          <button class="ghost-btn small" data-action="edit-goal" data-id="${go.id}">Edit</button>
          <button class="danger-btn small" data-action="delete-goal" data-id="${go.id}">&times;</button>
        </div>`).join('')}
    </div>
    ${(() => {
      const completed = [
        ...state.masterTrackerItems.filter(i => i.done).map(i => ({ text: i.text, label: 'Master Tracker' })),
        ...state.dailyTrackerItems.filter(i => i.done).map(i => ({ text: i.text, label: 'Daily Tracker' }))
      ];
      if (!completed.length) return '';
      return `<div style="margin-top:28px">
        <div style="font-size:15px;font-weight:600;margin-bottom:4px">Completed (from Trackers)</div>
        <div style="font-size:12.5px;color:var(--t-muted);margin-bottom:12px">Checked off in the Master &amp; Daily Trackers</div>
        <div class="list-col tighter">
          ${completed.map(c => `<div class="card row"><div style="font-size:13.5px;flex:1;text-decoration:line-through;opacity:0.7">${esc(c.text)}</div><div style="font-size:11px;color:oklch(0.62 0.09 50);text-transform:uppercase;letter-spacing:0.04em">${esc(c.label)}</div></div>`).join('')}
        </div>
      </div>`;
    })()}
  </div>`;
}

/* ---------------- Schedule ---------------- */
function parseISO(str) { return new Date(str + 'T00:00:00'); }
function shiftAnchor(delta) {
  const cur = parseISO(state.scheduleAnchor);
  const next = new Date(cur);
  if (state.scheduleView === 'day') next.setDate(cur.getDate() + delta);
  else if (state.scheduleView === 'month') next.setMonth(cur.getMonth() + delta);
  else next.setFullYear(cur.getFullYear() + delta);
  state.scheduleAnchor = next.toISOString().slice(0, 10);
  render();
}
const EVENT_KINDS = {
  item: { label: 'Calendar', color: PALETTE.teal },
  goal: { label: 'Goal', color: PALETTE.amber },
  check: { label: 'Daily Check', color: PALETTE.green },
  blocker: { label: 'Blocker', color: PALETTE.red }
};
function scheduleEvents(dateStr) {
  const out = [];
  state.scheduleItems.filter(s => s.date === dateStr).forEach(s => out.push({ kind: 'item', id: s.id, text: s.text, pillar: s.pillar, editable: true }));
  state.goals.filter(g => g.targetDate === dateStr).forEach(g => out.push({ kind: 'goal', id: g.id, text: g.text, pillar: g.pillar }));
  state.dailyChecks.filter(d => d.date === dateStr).forEach(d => out.push({
    kind: d.blockers ? 'blocker' : 'check', id: d.id, pillar: d.area || 'Studio',
    text: (d.heading || 'Daily check') + (d.blockers ? ' \u2014 blocked: ' + d.blockers : '')
  }));
  return out;
}
function eventChipHtml(ev, compact) {
  const k = EVENT_KINDS[ev.kind];
  const inner = `<span style="flex:1;min-width:0;${compact ? 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap' : ''}">${esc(ev.text)}</span>`;
  const attrs = ev.editable ? `data-action="edit-scheduleitem" data-id="${ev.id}"` : `data-action="nav" data-view="${ev.kind === 'goal' ? 'goals' : 'dailycheck'}"`;
  return `<div ${attrs} style="cursor:pointer;display:flex;align-items:center;gap:6px;font-size:${compact ? '10.5px' : '13px'};line-height:1.3;padding:${compact ? '3px 5px' : '8px 11px'};border-radius:6px;background:color-mix(in oklch, ${k.color} 16%, transparent);border:1px solid color-mix(in oklch, ${k.color} 40%, transparent);color:var(--t-ink-2)">
    <span style="width:6px;height:6px;border-radius:99px;background:${k.color};flex-shrink:0"></span>${inner}
    ${compact ? '' : `<span style="font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:${k.color};font-weight:600">${k.label}</span>`}
  </div>`;
}
function buildMonthGrid(anchorDate) {
  const year = anchorDate.getFullYear(), month = anchorDate.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ num: d, dateStr, events: scheduleEvents(dateStr) });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
function renderSchedule() {
  const anchorDate = parseISO(state.scheduleAnchor);
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let label = '', body = '';
  if (state.scheduleView === 'month') {
    label = `${monthNames[anchorDate.getMonth()]} ${anchorDate.getFullYear()}`;
    body = `
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px">
        ${dayNames.map(d => `<div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--t-muted);font-weight:600;padding-left:4px">${d}</div>`).join('')}
      </div>
      <div class="list-col" style="gap:6px">${buildMonthGrid(anchorDate).map(week => `
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">
          ${week.map(cell => cell ? `
            <div data-action="new-scheduleitem" data-date="${cell.dateStr}" title="Click to add an item" style="cursor:pointer;min-height:86px;border-radius:8px;padding:6px;background:var(--t-surface-solid);border:1px solid oklch(0.87 0.013 80);display:flex;flex-direction:column;gap:3px">
              <div style="font-size:12px;color:var(--t-muted)">${cell.num}</div>
              ${cell.events.map(ev => eventChipHtml(ev, true)).join('')}
            </div>` : `<div style="min-height:86px"></div>`).join('')}
        </div>`).join('')}</div>
      <div style="margin-top:12px;display:flex;gap:14px;flex-wrap:wrap;font-size:11.5px;color:var(--t-muted)">
        ${Object.keys(EVENT_KINDS).map(k => `<div style="display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:99px;background:${EVENT_KINDS[k].color}"></span>${EVENT_KINDS[k].label}</div>`).join('')}
        <div>Click any day to add an item</div>
      </div>`;
  } else if (state.scheduleView === 'day') {
    label = anchorDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const events = scheduleEvents(state.scheduleAnchor);
    body = `
      <div class="card">
        <div class="header-row" style="margin-bottom:12px">
          <div style="font-size:15px;font-weight:600">This day</div>
          <button class="ghost-btn small" data-action="new-scheduleitem" data-date="${state.scheduleAnchor}">+ Add item</button>
        </div>
        ${events.length === 0 ? `<div style="font-size:13px;color:var(--t-faint)">Nothing scheduled this day</div>` :
          `<div class="list-col tighter">${events.map(ev => `
            <div class="row" style="gap:10px">
              <div style="flex:1">${eventChipHtml(ev)}</div>
              <div style="font-size:11px;color:oklch(0.62 0.09 50);text-transform:uppercase;letter-spacing:.04em;width:96px">${esc(ev.pillar || '')}</div>
              ${ev.editable ? `<button class="danger-btn small" data-action="delete-scheduleitem" data-id="${ev.id}">&times;</button>` : ''}
            </div>`).join('')}</div>`}
      </div>`;
  } else {
    label = `${anchorDate.getFullYear()}`;
    body = `<div class="list-col" style="gap:14px">${monthNames.map((mn, i) => {
      const prefix = `${anchorDate.getFullYear()}-${String(i + 1).padStart(2, '0')}`;
      const days = [];
      for (let d = 1; d <= 31; d++) {
        const ds = `${prefix}-${String(d).padStart(2, '0')}`;
        const evs = scheduleEvents(ds);
        if (evs.length) days.push({ ds, evs });
      }
      return `<div>
        <div style="font-size:13px;font-weight:600;color:var(--t-ink-2);margin-bottom:6px">${mn}</div>
        ${days.length === 0 ? `<div style="font-size:12px;color:var(--t-faint)">&mdash;</div>` :
          `<div class="list-col tighter">${days.map(day => day.evs.map(ev => `
            <div class="row" style="gap:10px"><div style="font-size:12px;color:var(--t-muted);width:96px;flex-shrink:0">${esc(day.ds)}</div><div style="flex:1">${eventChipHtml(ev)}</div></div>`).join('')).join('')}</div>`}
      </div>`;
    }).join('')}</div>`;
  }
  const viewBtn = (id, txt) => `<button class="view-btn ${state.scheduleView === id ? 'active' : ''}" data-action="set-schedule-view" data-view="${id}">${txt}</button>`;
  return `
  <div class="view">
    <div class="header-row" style="margin-bottom:20px">
      <div><h1 class="page-title">Schedule</h1><div class="page-sub" style="margin-bottom:0">Your own calendar items, goal deadlines and daily-check entries in one place</div></div>
      <div style="display:flex;gap:6px;align-items:center">${viewBtn('day', 'Day')}${viewBtn('month', 'Month')}${viewBtn('year', 'Year')}<button class="btn-primary" data-action="new-scheduleitem">+ Add Item</button></div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <button class="ghost-btn" data-action="schedule-prev">&larr; Prev</button>
      <div style="font-family:var(--t-font-head);font-size:16px;font-weight:600">${esc(label)}</div>
      <button class="ghost-btn" data-action="schedule-next">Next &rarr;</button>
    </div>
    ${body}
  </div>`;
}

/* ---------------- Notes ---------------- */
function renderNotes() {
  const filtered = state.notes.filter(n => state.notesFilter === 'All' || n.pillar === state.notesFilter);
  return `
  <div class="view narrower">
    <div class="header-row" style="margin-bottom:18px">
      <div><h1 class="page-title">Notes</h1><div class="page-sub" style="margin-bottom:0">Freeform, taggable by pillar</div></div>
      <button class="btn-primary" data-action="new-note">+ Add Note</button>
    </div>
    <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap">
      ${['All', ...PILLARS].map(p => `<button class="filter-chip ${state.notesFilter === p ? 'active' : ''}" data-action="set-notes-filter" data-filter="${p}">${p}</button>`).join('')}
    </div>
    <div class="list-col tight">
      ${filtered.map(n => `
        <div class="card tight">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
            <div style="font-size:14px;flex:1">${esc(n.text)}</div>
            <div style="display:flex;gap:8px;flex-shrink:0">
              <button class="ghost-btn small" data-action="edit-note" data-id="${n.id}">Edit</button>
              <button class="danger-btn small" data-action="delete-note" data-id="${n.id}">&times;</button>
            </div>
          </div>
          <div style="margin-top:8px;font-size:11px;color:oklch(0.62 0.09 50);text-transform:uppercase;letter-spacing:0.04em">${esc(n.pillar)}</div>
          ${attachmentsHtml('note', n.id, '', n.attachments)}
        </div>`).join('')}
    </div>
  </div>`;
}

/* ---------------- Trackers ---------------- */
function trackerItemHtml(section, it) {
  const attachHtml = it.attachments.length ? `<div class="attach-row">${it.attachments.map(a => `
    <div class="attach-chip">
      ${a.isImage ? `<img src="${a.dataUrl}" alt="${esc(a.name)}">` : `<span class="attach-name">${esc(a.name)}</span>`}
      <button class="attach-remove" data-action="remove-tracker-attachment" data-section="${section}" data-id="${it.id}" data-att="${a.id}">&times;</button>
    </div>`).join('')}</div>` : '';
  return `
    <div class="tracker-item">
      <div class="tracker-item-row">
        <input type="checkbox" data-action="toggle-tracker-item" data-section="${section}" data-id="${it.id}" ${it.done ? 'checked' : ''}>
        <input class="tracker-item-text ${it.done ? 'strike' : ''}" value="${esc(it.text)}" data-action-input="tracker-item-text" data-section="${section}" data-id="${it.id}">
        <label class="attach-btn">Attach<input type="file" multiple style="display:none" data-action="tracker-item-files" data-section="${section}" data-id="${it.id}"></label>
        <button class="danger-btn small" data-action="delete-tracker-item" data-section="${section}" data-id="${it.id}">&times;</button>
      </div>
      ${attachHtml}
    </div>`;
}
function renderTrackers() {
  return `
  <div class="view">
    <h1 class="page-title">Trackers</h1>
    <div class="page-sub">Tick items off as you complete them \u2014 completed items surface under Goals. Attach files or images to any item.</div>
    <div class="list-col">
      <div class="card">
        <div class="header-row" style="margin-bottom:4px"><div style="font-size:15px;font-weight:600">Master Tracker</div><button class="ghost-btn small" data-action="add-tracker-item" data-section="master">+ Add item</button></div>
        <div style="font-size:12.5px;color:var(--t-muted);margin-bottom:12px">Company snapshot, current state &amp; 2026 finish line</div>
        <div class="list-col tighter">${state.masterTrackerItems.map(it => trackerItemHtml('master', it)).join('')}</div>
      </div>
      <div class="card">
        <div class="header-row" style="margin-bottom:4px"><div style="font-size:15px;font-weight:600">Daily / Weekly Tracker</div><button class="ghost-btn small" data-action="add-tracker-item" data-section="daily">+ Add item</button></div>
        <div style="font-size:12.5px;color:var(--t-muted);margin-bottom:12px">Working schedule &amp; month-to-month actions</div>
        <div class="list-col tighter">${state.dailyTrackerItems.map(it => trackerItemHtml('daily', it)).join('')}</div>
      </div>
    </div>
  </div>`;
}

/* ---------------- Daily Check ---------------- */
function renderDailyCheck() {
  return `
  <div class="view narrow">
    <div class="header-row">
      <div><h1 class="page-title">Meeting &amp; Daily Check</h1><div class="page-sub" style="margin-bottom:0">What was done, what's next, and any blockers — entries appear on the Schedule</div></div>
      <button class="btn-primary" data-action="new-dailycheck">+ Add Entry</button>
    </div>
    <div class="list-col tighter">
      ${state.dailyChecks.map(dc => `
        <div class="card">
          <div class="header-row" style="margin-bottom:10px">
            <div class="row" style="gap:12px;flex:1;min-width:0">
              <div style="font-size:13px;font-weight:600;color:var(--u-accent);flex-shrink:0">${esc(dc.date)}</div>
              <div style="font-size:15px;font-weight:600;font-family:var(--t-font-head);flex:1;min-width:0">${esc(dc.heading) || 'Untitled check'}</div>
              <div style="font-size:11px;color:oklch(0.62 0.09 50);text-transform:uppercase;letter-spacing:.04em;font-weight:600">${esc(dc.area || 'Studio')}</div>
              ${dc.blockers ? badgeHtml(statusMeta('blocked'), 'xs') : badgeHtml(badgeMeta('On Track'), 'xs')}
            </div>
            <div style="display:flex;gap:8px">
              <button class="ghost-btn small" data-action="edit-dailycheck" data-id="${dc.id}">Edit</button>
              <button class="danger-btn small" data-action="delete-dailycheck" data-id="${dc.id}">&times;</button>
            </div>
          </div>
          <div class="daily-check-grid">
            <div><div class="dc-label dc-label-done">What Was Done</div><div class="dc-text">${esc(dc.whatDone)}</div></div>
            <div><div class="dc-label dc-label-next">What Needs To Be Done</div><div class="dc-text">${esc(dc.whatNeeds)}</div></div>
            <div><div class="dc-label dc-label-block">Blockers</div><div class="dc-text">${esc(dc.blockers)}</div></div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

/* ---------------- Collections (generic CRUD backbone) ---------------- */
function coll(type, key) {
  const u = U();
  switch (type) {
    case 'storybook': return u.storyBooks.items;
    case 'journal': return u.journal.items;
    case 'task': return u.game.tasks;
    case 'bug': return key === 'rootedTales' ? state.apps.rootedTales.bugs : u.app.bugs;
    case 'version': return key === 'rootedTales' ? state.apps.rootedTales.versions : u.app.versions;
    case 'appcontent': {
      const rt = state.apps.rootedTales.content, w = u.xenwinxWorldsContent;
      return { rtMiniGames: rt.miniGames, rtGallery: rt.gallery, rtBadges: rt.badges,
        wCheats: w.levelCheats, wCutscenes: w.bonusCutscenes, wShowcase: w.communityShowcase }[key] || null;
    }
    case 'achievement': return state.achievements;
    case 'socialpost': { const p = u.socialMedia.platforms.find(x => x.id === key); if (!p) return null; if (!p.posts) p.posts = []; return p.posts; }
    case 'minigame': return u.app.miniGames;
    case 'gallery': return u.app.gallery;
    case 'clip': return u.animation.clips;
    case 'merch': return u.merch.items;
    case 'social': return u.socialMedia.platforms;
    case 'revenue': return u.financials.revenue;
    case 'uexpense': return u.financials.expenses;
    case 'create': return u.create[key];
    case 'model3d': return state.library3D;
    case 'expense': return state.studioCosts;
    case 'goal': return state.goals;
    case 'note': return state.notes;
    case 'dailycheck': return state.dailyChecks;
    case 'scheduleitem': return state.scheduleItems;
    case 'wfrow': return u.game.workflowTable;
    case 'pillar': {
      if (key === 'studio' || key === 'apps') return navExtras(key).custom;
      if (key === 'any') {
        const id2 = state.activeView.replace(/^(u-c-|g-c-)/, '');
        const pools = [navExtras('studio').custom, navExtras('apps').custom, navConfig().custom];
        return pools.find(p => p.some(c => c.id === id2)) || navConfig().custom;
      }
      return navConfig().custom;
    }
    default: return null;
  }
}
function findIn(type, id, key) { const c = coll(type, key); return c && c.find(x => x.id === id); }
function removeFrom(type, id, key) {
  const c = coll(type, key); if (!c) return;
  const i = c.findIndex(x => x.id === id);
  if (i > -1) c.splice(i, 1);
  render();
}

/* ---------------- Modal ---------------- */
function defaultDraft(type) {
  switch (type) {
    case 'appcontent': return { name: '', status: 'planned', notes: '' };
    case 'step': case 'substep': return { name: '', done: false };
    case 'socialpost': return { date: '', what: '', notes: '', attachments: [] };
    case 'achievement': return { text: '', date: '', pillar: 'Studio', attachments: [] };
    case 'universe': return { name: '', short: '', status: 'upcoming', cycleYear: 2027, tagline: '', ageTier: 'Early Reader', skin: { primary: '#1c2230', accent: '#4fd1ae', accent2: '#e8965a' } };
    case 'game': return { name: '', status: 'planned', designDoc: '', notes: '' };
    case 'task': return { name: '', status: 'planned', outstanding: '' };
    case 'bug': return { title: '', status: 'open', priority: 'medium' };
    case 'version': return { version: '', date: '', notes: '' };
    case 'storybook': return { title: '', status: 'planned', checklist: { cover: false, end: false, chapter: false, inText: false, storyBook: false } };
    case 'journal': return { title: '', group: '', created: false, amazonListed: false };
    case 'conceptart': return { title: '', status: 'planned', pages: 0, notes: '' };
    case 'goal': return { text: '', targetDate: '', pillar: 'Studio', status: 'not started' };
    case 'note': return { text: '', pillar: 'Studio' };
    case 'dailycheck': return { date: '', heading: '', area: 'Studio', whatDone: '', whatNeeds: '', blockers: '' };
    case 'scheduleitem': return { date: '', text: '', pillar: 'Studio', status: 'not started' };
    case 'wfrow': return { phase: '', subPhase: '', task: '', covers: '', status: 'not started' };
    case 'pillar': return { label: '', done: false, notes: '', attachments: [] };
    case 'clip': return { title: '', status: 'planned', notes: '' };
    case 'minigame': case 'gallery': return { name: '', status: 'planned', notes: '' };
    case 'create': return { name: '', category: '', status: 'planned', notes: '' };
    case 'model3d': return { name: '', category: '', status: 'planned', notes: '' };
    case 'social': return { platform: '', handle: '', link: '', status: 'not live', workLog: '' };
    case 'merch': return { category: '', name: '', status: 'planned' };
    case 'revenue': return { name: '', live: false, actual: 0, target: 0 };
    case 'expense': case 'uexpense': return { name: '', amount: 0, currency: 'USD', cadence: 'monthly', taxable: false };
    case 'target': return { target: 0 };
    case 'giving': return defaultGiving();
    default: return {};
  }
}
const MODAL_TITLES = {
  universe: 'Universe', game: 'Game', task: 'Task', bug: 'Bug / Task', version: 'Version', storybook: 'Story Book',
  journal: 'Journal', conceptart: 'Concept Art Book', revenue: 'Revenue Stream', goal: 'Goal', note: 'Note',
  merch: 'Merch Item', expense: 'Studio Cost', uexpense: 'Universe Expense', clip: 'Animation Clip', minigame: 'Mini Game',
  gallery: 'Gallery Piece', appcontent: 'App Content Item', achievement: 'Achievement', create: 'Create Item', model3d: '3D Model', social: 'Social Channel', dailycheck: 'Daily Check', target: 'Target', giving: 'Giving Allocation',
  step: 'Workflow Task', substep: 'Workflow Sub-task', socialpost: 'Post', scheduleitem: 'Calendar Item', wfrow: 'Workflow Row', pillar: 'Sidebar Item'
};
function openModal(type, isNew, entity, key) {
  state.modal = { type, isNew, key: key || null, id: entity ? entity.id : null };
  state.draft = entity ? JSON.parse(JSON.stringify(entity)) : defaultDraft(type);
  renderModal();
  $('#modalOverlay').classList.remove('hidden');
}
function closeModal() {
  state.modal = null; state.draft = {};
  $('#modalOverlay').classList.add('hidden');
}
function fieldHtml(label, inner) { return `<label class="field">${label}${inner}</label>`; }
function textInput(id, value) { return `<input id="${id}" value="${esc(value)}">`; }
function numInput(id, value) { return `<input type="number" id="${id}" value="${value == null ? 0 : value}">`; }
function selectInput(id, opts, value) { return `<select id="${id}">${optionsHtml(opts, value)}</select>`; }
function textareaInput(id, value, rows) { return `<textarea id="${id}" rows="${rows || 3}">${esc(value)}</textarea>`; }
function colorInput(id, value) { return `<input type="color" id="${id}" value="${esc(value)}">`; }

function modalFieldsHtml() {
  const m = state.modal, d = state.draft;
  switch (m.type) {
    case 'universe': return fieldHtml('Name', textInput('f_name', d.name)) + fieldHtml('Short label', textInput('f_short', d.short)) +
      fieldHtml('Status', selectInput('f_status', UNIVERSE_STATUS, d.status)) + fieldHtml('Cycle year', numInput('f_cycleYear', d.cycleYear)) +
      fieldHtml('Age tier', selectInput('f_ageTier', AGE_TIERS, d.ageTier)) +
      fieldHtml('Tagline', textInput('f_tagline', d.tagline)) +
      fieldHtml('Skin \u2014 primary', colorInput('f_primary', d.skin.primary)) +
      fieldHtml('Skin \u2014 accent', colorInput('f_accent', d.skin.accent)) +
      fieldHtml('Skin \u2014 accent 2', colorInput('f_accent2', d.skin.accent2));
    case 'game': return fieldHtml('Name', textInput('f_name', d.name)) + fieldHtml('Status', selectInput('f_status', GAME_STATUS, d.status)) + fieldHtml('Design doc link', textInput('f_designDoc', d.designDoc)) + fieldHtml('Notes', textareaInput('f_notes', d.notes));
    case 'pillar': return fieldHtml('Name', textInput('f_label', d.label));
    case 'wfrow': return fieldHtml('Phase', textInput('f_phase', d.phase)) + fieldHtml('Sub Phase', textInput('f_subPhase', d.subPhase)) + fieldHtml('Task', textInput('f_task', d.task)) + fieldHtml('What it covers', textareaInput('f_covers', d.covers, 3)) + fieldHtml('Your status', selectInput('f_status', WF_STATUS, d.status));
    case 'step': case 'substep': return fieldHtml(m.type === 'step' ? 'Workflow task' : 'Sub-task', textInput('f_name', d.name));
    case 'socialpost': return fieldHtml('Date posted', `<input type="date" id="f_date" value="${esc(d.date)}">`) + fieldHtml('What was posted', textInput('f_what', d.what)) + fieldHtml('Notes', textareaInput('f_notes', d.notes, 4));
    case 'task': return fieldHtml('Task name', textInput('f_name', d.name)) + fieldHtml('Status', selectInput('f_status', TASK_STATUS, d.status)) + fieldHtml('Outstanding items', textInput('f_outstanding', d.outstanding));
    case 'bug': return fieldHtml('Title', textInput('f_title', d.title)) + fieldHtml('Status', selectInput('f_status', BUG_STATUS, d.status)) + fieldHtml('Priority', selectInput('f_priority', PRIORITY, d.priority));
    case 'version': return fieldHtml('Version', textInput('f_version', d.version)) + fieldHtml('Date', `<input type="date" id="f_date" value="${esc(d.date)}">`) + fieldHtml('Notes', textareaInput('f_notes', d.notes, 2));
    case 'storybook': return fieldHtml('Title', textInput('f_title', d.title)) + fieldHtml('Status', selectInput('f_status', BOOK_STATUS, d.status));
    case 'journal': return fieldHtml('Title', textInput('f_title', d.title)) + fieldHtml('Group (optional)', textInput('f_group', d.group)) +
      `<label class="checkbox-field"><input type="checkbox" id="f_created" ${d.created ? 'checked' : ''}>Created</label>` +
      `<label class="checkbox-field"><input type="checkbox" id="f_amazonListed" ${d.amazonListed ? 'checked' : ''}>Listed on Amazon</label>`;
    case 'conceptart': return fieldHtml('Title', textInput('f_title', d.title)) + fieldHtml('Status', selectInput('f_status', LEARN_STATUS, d.status)) + fieldHtml('Pages laid out', numInput('f_pages', d.pages)) + fieldHtml('Notes', textareaInput('f_notes', d.notes));
    case 'revenue': return fieldHtml('Stream', textInput('f_name', d.name)) +
      `<label class="checkbox-field"><input type="checkbox" id="f_live" ${d.live ? 'checked' : ''}>Live</label>` +
      fieldHtml('Actual ($/mo)', numInput('f_actual', d.actual)) + fieldHtml('Target ($/mo)', numInput('f_target', d.target));
    case 'goal': return fieldHtml('Goal', textInput('f_text', d.text)) + fieldHtml('Target date', `<input type="date" id="f_targetDate" value="${esc(d.targetDate)}">`) + fieldHtml('Pillar', selectInput('f_pillar', PILLARS, d.pillar)) + fieldHtml('Status', selectInput('f_status', GOAL_STATUS, d.status));
    case 'note': return fieldHtml('Note', textareaInput('f_text', d.text, 4)) + fieldHtml('Pillar', selectInput('f_pillar', PILLARS, d.pillar));
    case 'dailycheck': return fieldHtml('Date', `<input type="date" id="f_date" value="${esc(d.date)}">`) + fieldHtml('Heading', textInput('f_heading', d.heading)) + fieldHtml('Area', selectInput('f_area', PILLARS, d.area || 'Studio')) + fieldHtml('What was done', textareaInput('f_whatDone', d.whatDone, 3)) + fieldHtml('What needs to be done', textareaInput('f_whatNeeds', d.whatNeeds, 3)) + fieldHtml('Blockers', textareaInput('f_blockers', d.blockers, 2));
    case 'scheduleitem': return fieldHtml('Date', `<input type="date" id="f_date" value="${esc(d.date)}">`) + fieldHtml('Item', textInput('f_text', d.text)) + fieldHtml('Pillar', selectInput('f_pillar', PILLARS, d.pillar)) + fieldHtml('Status', selectInput('f_status', GOAL_STATUS, d.status));
    case 'clip': return fieldHtml('Clip title', textInput('f_title', d.title)) + fieldHtml('Status', selectInput('f_status', ANIMATION_STATUS, d.status)) + fieldHtml('Notes', textareaInput('f_notes', d.notes));
    case 'achievement': return fieldHtml('What was achieved', textInput('f_text', d.text)) + fieldHtml('Date', `<input type="date" id="f_date" value="${esc(d.date)}">`) + fieldHtml('Pillar', selectInput('f_pillar', PILLARS, d.pillar));
    case 'minigame': case 'gallery': case 'appcontent': return fieldHtml('Name', textInput('f_name', d.name)) + fieldHtml('Status', selectInput('f_status', MODEL_STATUS, d.status)) + fieldHtml('Notes', textareaInput('f_notes', d.notes, 2));
    case 'create': return fieldHtml('Name', textInput('f_name', d.name)) + fieldHtml('Category (optional)', textInput('f_category', d.category)) + fieldHtml('Status', selectInput('f_status', LEARN_STATUS, d.status)) + fieldHtml('Notes', textareaInput('f_notes', d.notes, 2));
    case 'model3d': return fieldHtml('Name', textInput('f_name', d.name)) + fieldHtml('Category', textInput('f_category', d.category)) + fieldHtml('Status', selectInput('f_status', MODEL_STATUS, d.status)) + fieldHtml('Notes', textareaInput('f_notes', d.notes, 2));
    case 'social': return fieldHtml('Platform', textInput('f_platform', d.platform)) + fieldHtml('Handle', textInput('f_handle', d.handle)) + fieldHtml('Link', textInput('f_link', d.link)) + fieldHtml('Status', selectInput('f_status', SOCIAL_STATUS, d.status)) + fieldHtml('Work done', textareaInput('f_workLog', d.workLog, 3));
    case 'merch': return fieldHtml('Category', textInput('f_category', d.category)) + fieldHtml('Item', textInput('f_name', d.name)) + fieldHtml('Status', selectInput('f_status', MERCH_STATUS, d.status));
    case 'expense': case 'uexpense': return fieldHtml('Name', textInput('f_name', d.name)) + fieldHtml('Amount', numInput('f_amount', d.amount)) + fieldHtml('Currency', selectInput('f_currency', CURRENCIES, d.currency)) + fieldHtml('Cadence', selectInput('f_cadence', CADENCES, d.cadence)) +
      `<label class="checkbox-field"><input type="checkbox" id="f_taxable" ${d.taxable ? 'checked' : ''}>Taxable</label>`;
    case 'target': return fieldHtml('Target count', numInput('f_target', d.target));
    case 'giving': return fieldHtml('Cause', textInput('f_cause', d.cause)) +
      fieldHtml('Allocation % (leave blank while inactive)', `<input type="number" id="f_alloc" min="0" max="100" value="${d.allocationPercent == null ? '' : d.allocationPercent}">`);
    default: return '';
  }
}
function renderModal() {
  const m = state.modal;
  $('#modalBox').innerHTML = `
    <div class="modal-title">${m.isNew ? 'Add' : 'Edit'} ${MODAL_TITLES[m.type] || ''}</div>
    ${modalFieldsHtml()}
    <div class="modal-actions">
      <button class="ghost-btn" data-action="close-modal">Cancel</button>
      <button class="btn-primary" data-action="save-modal">Save</button>
    </div>`;
}
function readModalDraft() {
  const m = state.modal, d = JSON.parse(JSON.stringify(state.draft));
  const val = id => { const el = $('#' + id); return el ? el.value : undefined; };
  const num = id => parseFloat(val(id)) || 0;
  const chk = id => { const el = $('#' + id); return el ? el.checked : undefined; };
  switch (m.type) {
    case 'universe': d.name = val('f_name'); d.short = val('f_short'); d.status = val('f_status'); d.cycleYear = num('f_cycleYear'); d.tagline = val('f_tagline'); d.ageTier = val('f_ageTier');
      d.skin = { primary: val('f_primary'), accent: val('f_accent'), accent2: val('f_accent2') }; break;
    case 'game': d.name = val('f_name'); d.status = val('f_status'); d.designDoc = val('f_designDoc'); d.notes = val('f_notes'); break;
    case 'pillar': d.label = val('f_label'); break;
    case 'wfrow': d.phase = val('f_phase'); d.subPhase = val('f_subPhase'); d.task = val('f_task'); d.covers = val('f_covers'); d.status = val('f_status'); break;
    case 'step': case 'substep': d.name = val('f_name'); break;
    case 'socialpost': d.date = val('f_date'); d.what = val('f_what'); d.notes = val('f_notes'); break;
    case 'task': d.name = val('f_name'); d.status = val('f_status'); d.outstanding = val('f_outstanding'); break;
    case 'bug': d.title = val('f_title'); d.status = val('f_status'); d.priority = val('f_priority'); break;
    case 'version': d.version = val('f_version'); d.date = val('f_date'); d.notes = val('f_notes'); break;
    case 'storybook': d.title = val('f_title'); d.status = val('f_status'); break;
    case 'journal': d.title = val('f_title'); d.group = val('f_group'); d.created = chk('f_created'); d.amazonListed = chk('f_amazonListed'); break;
    case 'conceptart': d.title = val('f_title'); d.status = val('f_status'); d.pages = num('f_pages'); d.notes = val('f_notes'); break;
    case 'revenue': d.name = val('f_name'); d.live = chk('f_live'); d.actual = num('f_actual'); d.target = num('f_target'); break;
    case 'goal': d.text = val('f_text'); d.targetDate = val('f_targetDate'); d.pillar = val('f_pillar'); d.status = val('f_status'); break;
    case 'note': d.text = val('f_text'); d.pillar = val('f_pillar'); break;
    case 'dailycheck': d.date = val('f_date'); d.heading = val('f_heading'); d.area = val('f_area'); d.whatDone = val('f_whatDone'); d.whatNeeds = val('f_whatNeeds'); d.blockers = val('f_blockers'); break;
    case 'scheduleitem': d.date = val('f_date'); d.text = val('f_text'); d.pillar = val('f_pillar'); d.status = val('f_status'); break;
    case 'clip': d.title = val('f_title'); d.status = val('f_status'); d.notes = val('f_notes'); break;
    case 'minigame': case 'gallery': case 'appcontent': d.name = val('f_name'); d.status = val('f_status'); d.notes = val('f_notes'); break;
    case 'achievement': d.text = val('f_text'); d.date = val('f_date'); d.pillar = val('f_pillar'); break;
    case 'create': case 'model3d': d.name = val('f_name'); d.category = val('f_category'); d.status = val('f_status'); d.notes = val('f_notes'); break;
    case 'social': d.platform = val('f_platform'); d.handle = val('f_handle'); d.link = val('f_link'); d.status = val('f_status'); d.workLog = val('f_workLog'); break;
    case 'merch': d.category = val('f_category'); d.name = val('f_name'); d.status = val('f_status'); break;
    case 'expense': case 'uexpense': d.name = val('f_name'); d.amount = num('f_amount'); d.currency = val('f_currency'); d.cadence = val('f_cadence'); d.taxable = chk('f_taxable'); break;
    case 'target': d.target = num('f_target'); break;
    case 'giving': { d.cause = val('f_cause'); const a = val('f_alloc'); d.allocationPercent = (a === '' || a == null) ? null : parseFloat(a); break; }
  }
  return d;
}
function saveModal() {
  const m = state.modal; if (!m) return;
  const d = readModalDraft();
  const u = U();

  if (m.type === 'universe') {
    if (m.isNew) {
      const newId = uid();
      const nu = mkUniverse(Object.assign({ id: newId }, d));
      nu.game.workflowTable = [];
      nu.navConfig = { done: {}, hidden: {}, custom: [] };
      state.universes[newId] = nu;
      state.universeOrder.push(newId);
      state.activeUniverse = newId;
      state.universeOpen = true;
      state.activeView = 'u-home';
    } else Object.assign(u, d);
    applySkin(); closeModal(); render(); return;
  }
  if (m.type === 'conceptart') { Object.assign(u.conceptArtBook, d); closeModal(); render(); return; }
  if (m.type === 'game') { Object.assign(u.game, d); closeModal(); render(); return; }
  if (m.type === 'target') { (m.key === 'journal' ? u.journal : u.storyBooks).target = d.target; closeModal(); render(); return; }

  if (m.type === 'giving') { Object.assign(u.financials.giving, d); closeModal(); render(); return; }

  if (m.type === 'step') {
    const wf = workflowOf(m.key);
    if (m.isNew) wf.push({ id: uid(), name: d.name, done: false });
    else { const s = findStep(wf, m.id); if (s) s.name = d.name; }
    closeModal(); render(); return;
  }
  if (m.type === 'substep') {
    const parts = (m.key || '').split(':');
    const s = findStep(workflowOf(parts[0]), parts[1]);
    if (s) {
      if (!s.substeps) s.substeps = [];
      if (m.isNew) s.substeps.push({ id: uid(), name: d.name, done: false });
      else { const sub = s.substeps.find(x => x.id === m.id); if (sub) sub.name = d.name; }
    }
    closeModal(); render(); return;
  }

  const c = coll(m.type, m.key);
  if (c) {
    if (m.isNew) { if (!d.id) d.id = uid(); c.push(d); }
    else { const existing = c.find(x => x.id === d.id); if (existing) Object.assign(existing, d); }
  }
  closeModal();
  render();
}

/* ---------------- Event wiring ---------------- */
function findStep(list, stepId) { return (list || []).find(w => w.id === stepId); }

function wireEvents() {
  ROOT.addEventListener('click', e => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const action = t.dataset.action;
    const id = t.dataset.id, key = t.dataset.key;

    if (action === 'nav') { navigateTo(t.dataset.view); return; }
    if (action === 'back') { goBack(); return; }
    if (action === 'set-universe') { setUniverse(t.dataset.u); return; }
    if (action === 'open-universe') { setUniverse(t.dataset.u, 'u-home'); return; }
    if (action === 'close-modal') { closeModal(); return; }
    if (action === 'save-modal') { saveModal(); return; }
    if (action.startsWith('xf-')) { handleFeatureAction(t, action); return; }
    if (action.startsWith('pf-')) { handleProfileAction(t, action); return; }
    if (t.closest('#modalBox')) return;

    switch (action) {
      case 'edit-universe': openModal('universe', false, U()); return;
      case 'edit-giving': openModal('giving', false, U().financials.giving); return;
      case 'edit-conceptart': openModal('conceptart', false, U().conceptArtBook); return;
      case 'edit-game': openModal('game', false, U().game); return;
      case 'edit-target': openModal('target', false, { target: (key === 'journal' ? U().journal : U().storyBooks).target }, key); return;

      case 'new-storybook': openModal('storybook', true, null); return;
      case 'edit-storybook': openModal('storybook', false, findIn('storybook', id)); return;
      case 'delete-storybook': removeFrom('storybook', id); return;
      case 'toggle-checklist': { const bk = findIn('storybook', id); bk.checklist[key] = !bk.checklist[key]; render(); return; }

      case 'new-journal': openModal('journal', true, null); return;
      case 'edit-journal': openModal('journal', false, findIn('journal', id)); return;
      case 'delete-journal': removeFrom('journal', id); return;

      case 'new-task': openModal('task', true, null); return;
      case 'edit-task': openModal('task', false, findIn('task', id)); return;
      case 'delete-task': removeFrom('task', id); return;

      case 'new-bug': openModal('bug', true, null, key); return;
      case 'edit-bug': openModal('bug', false, findIn('bug', id, key), key); return;
      case 'delete-bug': removeFrom('bug', id, key); return;

      case 'new-version': openModal('version', true, null, key); return;
      case 'edit-version': openModal('version', false, findIn('version', id, key), key); return;
      case 'delete-version': removeFrom('version', id, key); return;

      case 'new-appcontent': openModal('appcontent', true, null, key); return;
      case 'edit-appcontent': openModal('appcontent', false, findIn('appcontent', id, key), key); return;
      case 'delete-appcontent': removeFrom('appcontent', id, key); return;

      case 'new-achievement': openModal('achievement', true, null); return;

      case 'new-step': openModal('step', true, null, t.dataset.scope); return;
      case 'edit-step': openModal('step', false, findStep(workflowOf(t.dataset.scope), t.dataset.step), t.dataset.scope); return;
      case 'delete-step': { const wf = workflowOf(t.dataset.scope); const i = wf.findIndex(w => w.id === t.dataset.step); if (i > -1) wf.splice(i, 1); render(); return; }
      case 'new-substep': openModal('substep', true, null, t.dataset.scope + ':' + t.dataset.step); return;
      case 'delete-substep': { const s = findStep(workflowOf(t.dataset.scope), t.dataset.step); if (s && s.substeps) s.substeps = s.substeps.filter(x => x.id !== t.dataset.sub); render(); return; }

      case 'new-socialpost': openModal('socialpost', true, null, key); return;
      case 'edit-socialpost': openModal('socialpost', false, findIn('socialpost', id, key), key); return;
      case 'delete-socialpost': removeFrom('socialpost', id, key); return;

      case 'remove-attachment': { const ent = attachTarget(t); if (ent && ent.attachments) ent.attachments = ent.attachments.filter(a => a.id !== t.dataset.att); render(); return; }
      case 'edit-achievement': openModal('achievement', false, findIn('achievement', id)); return;
      case 'delete-achievement': removeFrom('achievement', id); return;

      case 'new-minigame': openModal('minigame', true, null); return;
      case 'edit-minigame': openModal('minigame', false, findIn('minigame', id)); return;
      case 'delete-minigame': removeFrom('minigame', id); return;

      case 'new-gallery': openModal('gallery', true, null); return;
      case 'edit-gallery': openModal('gallery', false, findIn('gallery', id)); return;
      case 'delete-gallery': removeFrom('gallery', id); return;

      case 'new-clip': openModal('clip', true, null); return;
      case 'edit-clip': openModal('clip', false, findIn('clip', id)); return;
      case 'delete-clip': removeFrom('clip', id); return;

      case 'new-merch': openModal('merch', true, null); return;
      case 'edit-merch': openModal('merch', false, findIn('merch', id)); return;
      case 'delete-merch': removeFrom('merch', id); return;

      case 'new-social': openModal('social', true, null); return;
      case 'edit-social': openModal('social', false, findIn('social', id)); return;
      case 'delete-social': removeFrom('social', id); return;

      case 'new-create': openModal('create', true, null, key); return;
      case 'edit-create': openModal('create', false, findIn('create', id, key), key); return;
      case 'delete-create': removeFrom('create', id, key); return;

      case 'new-model': openModal('model3d', true, null); return;
      case 'edit-model': openModal('model3d', false, findIn('model3d', id)); return;
      case 'delete-model': removeFrom('model3d', id); return;

      case 'new-revenue': openModal('revenue', true, null); return;
      case 'edit-revenue': openModal('revenue', false, findIn('revenue', id)); return;
      case 'delete-revenue': removeFrom('revenue', id); return;

      case 'new-uexpense': openModal('uexpense', true, null); return;
      case 'edit-uexpense': openModal('uexpense', false, findIn('uexpense', id)); return;
      case 'delete-uexpense': removeFrom('uexpense', id); return;

      case 'new-expense': openModal('expense', true, null); return;
      case 'edit-expense': openModal('expense', false, findIn('expense', id)); return;
      case 'delete-expense': removeFrom('expense', id); return;

      case 'new-goal': openModal('goal', true, null); return;
      case 'edit-goal': openModal('goal', false, findIn('goal', id)); return;
      case 'delete-goal': removeFrom('goal', id); return;

      case 'new-note': openModal('note', true, null); return;
      case 'edit-note': openModal('note', false, findIn('note', id)); return;
      case 'delete-note': removeFrom('note', id); return;

      case 'new-dailycheck': openModal('dailycheck', true, null); return;
      case 'new-wfrow': openModal('wfrow', true, null); return;
      case 'toggle-nav-edit': state.navEdit[t.dataset.scope] = !state.navEdit[t.dataset.scope]; render(); return;
      case 'new-navitem': openModal('pillar', true, null, t.dataset.scope); return;
      case 'delete-navitem': {
        const cfg = cfgFor(t.dataset.scope);
        cfg.custom = cfg.custom.filter(c => c.id !== t.dataset.pid);
        if (state.activeView.endsWith(t.dataset.pid)) state.activeView = 'overview';
        render(); return;
      }
      case 'toggle-nav-hidden': {
        const cfg = cfgFor(t.dataset.scope);
        cfg.hidden[t.dataset.view] = !cfg.hidden[t.dataset.view];
        render(); return;
      }
      case 'toggle-nav-done': {
        const cfg = cfgFor(t.dataset.scope);
        if (t.dataset.pid) { const c = customNavEntry(t.dataset.pid); if (c) c.done = !c.done; }
        else cfg.done[t.dataset.view] = !cfg.done[t.dataset.view];
        render(); return;
      }
      case 'new-universe': openModal('universe', true, null); return;
      case 'delete-universe': {
        const id2 = t.dataset.u;
        if (uOrder().length <= 1) return;
        state.universeOrder = state.universeOrder.filter(x => x !== id2);
        delete state.universes[id2];
        if (state.activeUniverse === id2) {
          state.activeUniverse = uOrder()[0];
          if (state.activeView.startsWith('u-')) state.activeView = 'overview';
          applySkin();
        }
        render(); return;
      }
      case 'edit-wfrow': openModal('wfrow', false, findIn('wfrow', id)); return;
      case 'delete-wfrow': removeFrom('wfrow', id); return;
      case 'new-scheduleitem': { openModal('scheduleitem', true, null); if (t.dataset.date) { state.draft.date = t.dataset.date; renderModal(); } return; }
      case 'edit-scheduleitem': openModal('scheduleitem', false, findIn('scheduleitem', id)); return;
      case 'delete-scheduleitem': removeFrom('scheduleitem', id); return;
      case 'edit-dailycheck': openModal('dailycheck', false, findIn('dailycheck', id)); return;
      case 'delete-dailycheck': removeFrom('dailycheck', id); return;

      case 'add-tracker-item': { const arr = t.dataset.section === 'master' ? state.masterTrackerItems : state.dailyTrackerItems; arr.push({ id: uid(), text: '', done: false, attachments: [] }); render(); return; }
      case 'delete-tracker-item': { const sec = t.dataset.section; if (sec === 'master') state.masterTrackerItems = state.masterTrackerItems.filter(x => x.id !== id); else state.dailyTrackerItems = state.dailyTrackerItems.filter(x => x.id !== id); render(); return; }
      case 'remove-tracker-attachment': { const arr = t.dataset.section === 'master' ? state.masterTrackerItems : state.dailyTrackerItems; const it = arr.find(x => x.id === id); it.attachments = it.attachments.filter(a => a.id !== t.dataset.att); render(); return; }
      case 'set-notes-filter': state.notesFilter = t.dataset.filter; render(); return;
      case 'set-schedule-view': state.scheduleView = t.dataset.view; render(); return;
      case 'schedule-prev': shiftAnchor(-1); return;
      case 'schedule-next': shiftAnchor(1); return;
    }
  });

  ROOT.addEventListener('input', e => {
    const t = e.target;
    if (t.dataset && t.dataset.actionInput === 'wfrow-status') {
      const row = findIn('wfrow', t.dataset.id);
      if (row) { row.status = t.value; render(); }
      return;
    }
    if (t.dataset && t.dataset.actionInput === 'rt-version') {
      const u2 = state.universes[t.dataset.u];
      if (u2) u2.rootedTalesContent.versionAdded = t.value;
      return;
    }
    if (t.dataset && t.dataset.actionInput === 'tracker-item-text') {
      const arr = t.dataset.section === 'master' ? state.masterTrackerItems : state.dailyTrackerItems;
      const it = arr.find(x => x.id === t.dataset.id);
      if (it) it.text = t.value;
    }
  });

  ROOT.addEventListener('change', e => {
    const t = e.target;
    const u = U();
    if (t.dataset.action === 'toggle-game-step') { findStep(u.game.workflow, t.dataset.step).done = t.checked; render(); return; }
    if (t.dataset.action === 'toggle-game-step-sub') { const s = findStep(u.game.workflow, t.dataset.step); s.substeps.find(x => x.id === t.dataset.sub).done = t.checked; render(); return; }
    if (t.dataset.action === 'toggle-app-step') { findStep(u.app.workflow, t.dataset.step).done = t.checked; render(); return; }
    if (t.dataset.action === 'toggle-app-step-sub') { const s = findStep(u.app.workflow, t.dataset.step); s.substeps.find(x => x.id === t.dataset.sub).done = t.checked; render(); return; }
    if (t.dataset.action === 'toggle-rt-step') { findStep(state.apps.rootedTales.workflow, t.dataset.step).done = t.checked; render(); return; }
    if (t.dataset.action === 'toggle-rt-step-sub') { const s = findStep(state.apps.rootedTales.workflow, t.dataset.step); s.substeps.find(x => x.id === t.dataset.sub).done = t.checked; render(); return; }
    if (t.dataset.action === 'toggle-rt-universe') { const u2 = state.universes[t.dataset.u]; if (u2) u2.rootedTalesContent.addedToApp = t.checked; render(); return; }
    if (t.dataset.action === 'attach-files') {
      const ent = attachTarget(t);
      if (ent) {
        if (!ent.attachments) ent.attachments = [];
        Array.from(t.files || []).forEach(file => {
          const reader = new FileReader();
          reader.onload = () => { ent.attachments.push({ id: uid(), name: file.name, dataUrl: reader.result, isImage: file.type.startsWith('image/') }); render(); };
          reader.readAsDataURL(file);
        });
      }
      t.value = '';
      return;
    }
    if (t.id === 'pillarNotes') { const c = currentCustomPillar(); if (c) c.notes = t.value; return; }
    if (t.id === 'rtBuildStatus') { state.apps.rootedTales.buildStatus = t.value; render(); return; }
    if (t.id === 'rtLiveVersion') { state.apps.rootedTales.liveVersion = t.value; return; }
    if (t.id === 'rtNotes') { state.apps.rootedTales.notes = t.value; return; }
    if (t.id === 'appBuildStatus') { u.app.buildStatus = t.value; return; }
    if (t.id === 'appNotes') { u.app.notes = t.value; return; }
    if (t.dataset.action === 'toggle-tracker-item') { const arr = t.dataset.section === 'master' ? state.masterTrackerItems : state.dailyTrackerItems; arr.find(x => x.id === t.dataset.id).done = t.checked; render(); return; }
    if (t.dataset.action === 'tracker-item-files') {
      const arr = t.dataset.section === 'master' ? state.masterTrackerItems : state.dailyTrackerItems;
      const it = arr.find(x => x.id === t.dataset.id);
      Array.from(t.files || []).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => { it.attachments.push({ id: uid(), name: file.name, dataUrl: reader.result, isImage: file.type.startsWith('image/') }); render(); };
        reader.readAsDataURL(file);
      });
      t.value = '';
    }
  });

  $('#settingsToggle').addEventListener('click', () => $('#settingsPanel').classList.toggle('hidden'));
  $('#bgColorInput').addEventListener('input', e => { state.appearance.bgColor = e.target.value; applyAppearance(); });
  $('#fontColorInput').addEventListener('input', e => { state.appearance.fontColor = e.target.value; applyAppearance(); });
  $('#headingColorInput').addEventListener('input', e => { state.appearance.headingColor = e.target.value; applyAppearance(); });
  $('#subheadingColorInput').addEventListener('input', e => { state.appearance.subheadingColor = e.target.value; applyAppearance(); });
  $('#chartStyleInput').addEventListener('change', e => { state.appearance.chartStyle = e.target.value; render(); });
  $('#glowStyleInput').addEventListener('change', e => { state.appearance.glowStyle = e.target.value; applyAppearance(); });
  $('#glowOnInput').addEventListener('change', e => { state.appearance.glowOn = e.target.checked; applyAppearance(); });
  $('#glowColorInput').addEventListener('input', e => { state.appearance.glowColor = e.target.value; applyAppearance(); });
  $('#themeInput').addEventListener('change', e => { switchTheme(e.target.value); render(); });
  $('#settingsReset').addEventListener('click', () => {
    state.appearance = Object.assign({ chartStyle: 'bar' }, themeById(curThemeId()).appearance);
    syncSettingsInputs(); applyAppearance(); render();
  });
}
function syncSettingsInputs() {
  $('#bgColorInput').value = state.appearance.bgColor;
  $('#fontColorInput').value = state.appearance.fontColor;
  $('#headingColorInput').value = state.appearance.headingColor || '#16202e';
  $('#subheadingColorInput').value = state.appearance.subheadingColor || '#5a6470';
  $('#chartStyleInput').value = state.appearance.chartStyle;
  $('#glowStyleInput').value = state.appearance.glowStyle;
  $('#glowOnInput').checked = state.appearance.glowOn !== false;
  $('#glowColorInput').value = state.appearance.glowColor || '#7aa7ff';
  if (P()) $('#themeInput').value = P().theme;
}

/* ---------------- Themes ---------------- */
const GF = 'https://fonts.googleapis.com/css2?';
const FONTS_LATIN = GF + 'family=Cinzel:wght@500;700&family=Spectral:wght@400;500;600&family=Orbitron:wght@500;700&family=Chakra+Petch:wght@400;500;600;700&family=Luckiest+Guy&family=Baloo+2:wght@400;500;600;700&display=swap';
/* CJK families are huge — previews load a tiny text subset, the full set loads only when the theme is in use. */
const FONTS_PREVIEW = GF + 'family=Shippori+Mincho:wght@700&family=Zen+Kaku+Gothic+New:wght@700&family=Mochiy+Pop+One&family=M+PLUS+Rounded+1c:wght@700&text=' + encodeURIComponent('Imagine.\u9032\u884c\u4e2d\u2726 Active') + '&display=swap';
const FONTS_FULL = {
  japanese: GF + 'family=Shippori+Mincho:wght@700&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap',
  anime: GF + 'family=Mochiy+Pop+One&family=M+PLUS+Rounded+1c:wght@400;700&display=swap'
};
function loadFontLink(id, href) {
  if (document.getElementById(id)) return;
  const l = document.createElement('link'); l.id = id; l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
}
/* Keep only the latin @font-face blocks of CJK families (the UI copy is latin) so we don't register hundreds of subsets. */
function ensureThemeFonts(id) {
  const href = FONTS_FULL[id], sid = 'xw-fonts-' + id;
  if (!href || document.getElementById(sid)) return;
  const st = document.createElement('style'); st.id = sid; document.head.appendChild(st);
  fetch(href).then(r => r.text()).then(css => {
    const keep = css.split(/(?=\/\* )/).filter(b => /^\/\* (latin|latin-ext) \*\//.test(b));
    st.textContent = keep.join('\n');
  }).catch(() => { /* offline: fall back to the stack's serif / sans-serif */ });
}
const THEMES = [
  { id: 'classic', name: 'Classic', blurb: 'The original Xenwinx look: universe-tinted rail and soft glass panels.',
    head: "'Space Grotesk', sans-serif", body: "'Work Sans', sans-serif", skin: null,
    appearance: { bgColor: '#e8f1fb', fontColor: '#213247', headingColor: '#16202e', subheadingColor: '#5a6470', glowOn: true, glowStyle: 'soft', glowColor: '#7aa7ff' },
    pv: { page: '#e8f1fb', side: '#0b1330', sideInk: '#ffffff', surface: 'rgba(255,255,255,.8)', ink: '#16202e', accent: '#4fd1ae', accentInk: '#0b1330', line: '#ffffff', radius: '12px', bw: '1px', shadow: '0 10px 18px -12px rgba(20,30,50,.5)', badgeR: '99px', badge: 'Active' } },
  { id: 'japanese', name: 'Japanese', blurb: 'Washi paper, sumi ink and an aizome indigo rail. Mincho headings, hanko-stamp badges.',
    head: "'Shippori Mincho', serif", body: "'Zen Kaku Gothic New', sans-serif",
    skin: { primary: '#1e2638', accent: '#c23b22', accent2: '#c9a227' },
    appearance: { bgColor: '#f3ede1', fontColor: '#231f1c', headingColor: '#1a1714', subheadingColor: '#6b6158', glowOn: false, glowStyle: 'soft', glowColor: '#c23b22' },
    pv: { page: '#f3ede1', side: '#1e2638', sideInk: '#f4eee3', surface: '#fbf8f2', ink: '#1a1714', accent: '#c23b22', accentInk: '#ffffff', line: '#d8cdbb', radius: '3px', bw: '1px', shadow: 'none', badgeR: '2px', badge: '進行中' } },
  { id: 'anime', name: 'Anime', blurb: 'Sakura pink and sky blue, rounded everything, sparkle badges and a pastel rail.',
    head: "'Mochiy Pop One', sans-serif", body: "'M PLUS Rounded 1c', sans-serif",
    skin: { primary: '#3b2d6b', accent: '#ff5fa2', accent2: '#6c8cff' },
    appearance: { bgColor: '#fdf3fb', fontColor: '#2a2140', headingColor: '#2a2140', subheadingColor: '#6c6288', glowOn: false, glowStyle: 'soft', glowColor: '#ff9fcb' },
    pv: { page: '#fdf3fb', side: 'linear-gradient(180deg,#ffd6ec,#d9e2ff)', sideInk: '#2a2140', surface: '#ffffff', ink: '#2a2140', accent: '#ff5fa2', accentInk: '#ffffff', line: '#ffd0e8', radius: '16px', bw: '2px', shadow: '0 8px 16px -10px rgba(255,95,162,.55)', badgeR: '99px', badge: '\u2726 Active' } },
  { id: 'steampunk', name: 'Steampunk', blurb: 'Parchment, brass and walnut leather. Riveted plates and engraved serif type.',
    head: "'Cinzel', serif", body: "'Spectral', serif",
    skin: { primary: '#2a1b10', accent: '#b8862f', accent2: '#a4512a' },
    appearance: { bgColor: '#e9dcbf', fontColor: '#2e2116', headingColor: '#24180e', subheadingColor: '#6b5640', glowOn: false, glowStyle: 'soft', glowColor: '#d9a94e' },
    pv: { page: '#e9dcbf', side: 'linear-gradient(180deg,#3b2718,#22160d)', sideInk: '#f1e3c2', surface: '#f6ecd6', ink: '#24180e', accent: '#b8862f', accentInk: '#2a1a0c', line: '#a8823c', radius: '4px', bw: '1px', shadow: 'inset 0 0 0 3px #f6ecd6, inset 0 0 0 4px rgba(168,130,60,.5)', badgeR: '2px', badge: '\u2699 ACTIVE' } },
  { id: 'gamer', name: 'Gamer', blurb: 'Dark HUD with neon green and magenta, chamfered panels and bracket badges.',
    head: "'Orbitron', sans-serif", body: "'Chakra Petch', sans-serif",
    skin: { primary: '#0a0d18', accent: '#3dffa8', accent2: '#ff3fd2' },
    appearance: { bgColor: '#0c0f17', fontColor: '#e4ecff', headingColor: '#ffffff', subheadingColor: '#8e9abb', glowOn: false, glowStyle: 'soft', glowColor: '#3dffa8' },
    pv: { page: '#0c0f17', side: '#070910', sideInk: '#e4ecff', surface: '#121726', ink: '#ffffff', accent: '#3dffa8', accentInk: '#04130c', line: 'rgba(61,255,168,.35)', radius: '0', bw: '1px', shadow: '0 0 16px -6px rgba(61,255,168,.5)', badgeR: '0', badge: '\u25b8 ACTIVE' } },
  { id: 'cartoon', name: 'Cartoon', blurb: 'Thick ink outlines, hard drop shadows and sunny flat colour. Big bouncy type.',
    head: "'Luckiest Guy', sans-serif", body: "'Baloo 2', sans-serif",
    skin: { primary: '#1b1b1b', accent: '#ff5a5f', accent2: '#ffbe0b' },
    appearance: { bgColor: '#fff4d6', fontColor: '#1b1b1b', headingColor: '#1b1b1b', subheadingColor: '#4a4a4a', glowOn: false, glowStyle: 'soft', glowColor: '#ffbe0b' },
    pv: { page: '#fff4d6', side: '#2a62d6', sideInk: '#ffffff', surface: '#ffffff', ink: '#1b1b1b', accent: '#ffbe0b', accentInk: '#1b1b1b', line: '#1b1b1b', radius: '12px', bw: '3px', shadow: '4px 4px 0 #1b1b1b', badgeR: '99px', badge: '\u2605 Active' } }
];
function themeById(id) { return THEMES.find(t => t.id === id) || THEMES[0]; }
function applyTheme(id) {
  const el = document.documentElement;
  ensureThemeFonts(id);
  THEMES.forEach(t => el.classList.remove('theme-' + t.id));
  el.classList.add('theme-' + id);
  el.classList.toggle('themed', id !== 'classic');
}
function setThemeAppearance(id) { Object.assign(state.appearance, themeById(id).appearance); }
function themeCardHtml(t, selected, act) {
  const v = t.pv;
  const bar = (w, op, bg) => `<div style="height:5px;width:${w};border-radius:3px;background:${bg || v.sideInk};opacity:${op}"></div>`;
  return `<button class="theme-card${selected ? ' sel' : ''}" ${act} data-theme="${t.id}" aria-pressed="${selected}">
    <div class="theme-pv" style="background:${v.page}">
      <div style="width:32%;background:${v.side};padding:14px 10px;display:flex;flex-direction:column;gap:7px">
        ${bar('70%', .95)}<div style="height:6px"></div>${bar('80%', .35)}${bar('64%', 1, v.accent)}${bar('76%', .35)}${bar('56%', .35)}
      </div>
      <div style="flex:1;min-width:0;padding:14px 14px 0;display:flex;flex-direction:column;gap:9px">
        <div style="font-family:${t.head.replace(/"/g, '')};font-size:21px;line-height:1;color:${v.ink};white-space:nowrap">Imagine.</div>
        <div style="background:${v.surface};border:${v.bw} solid ${v.line};border-radius:${v.radius};box-shadow:${v.shadow};padding:9px;display:flex;flex-direction:column;gap:7px">
          <div style="height:5px;width:82%;border-radius:3px;background:${v.ink};opacity:.22"></div>
          <div style="height:5px;width:58%;border-radius:3px;background:${v.ink};opacity:.14"></div>
          <span style="align-self:flex-start;font-family:${t.body.replace(/"/g, '')};font-size:10px;font-weight:700;padding:2px 8px;border-radius:${v.badgeR};background:${v.accent};color:${v.accentInk}">${v.badge}</span>
        </div>
      </div>
    </div>
    <div class="theme-meta">
      <div class="theme-name"><span>${t.name}</span>${selected ? '<span class="theme-tick">Selected</span>' : ''}</div>
      <div class="theme-blurb">${t.blurb}</div>
    </div>
  </button>`;
}
function themeGridHtml(selected, act) { return `<div class="theme-grid">${THEMES.map(t => themeCardHtml(t, t.id === selected, act)).join('')}</div>`; }

/* ---------------- Avatars (original, generated) ---------------- */
const AVATARS = [
  { id: 'kit', name: 'Kit', bg: '#ffe1c7', body: '#f08a3c', inner: '#fff3e6', top: 'fox', head: 'round', eyes: 'happy', mouth: 'cat', blush: 1, extra: 'muzzle' },
  { id: 'bolt', name: 'Bolt', bg: '#d6e4ff', body: '#8fa3c4', inner: '#ff6b6b', top: 'antenna', head: 'square', eyes: 'visor', mouth: 'grill' },
  { id: 'sprout', name: 'Sprout', bg: '#dff3d8', body: '#9ad27f', top: 'sprout', head: 'round', eyes: 'dot', mouth: 'smile', blush: 1 },
  { id: 'mochi', name: 'Mochi', bg: '#fde2ec', body: '#fffaf6', outline: '#efc9d6', top: 'none', head: 'blob', eyes: 'sleepy', mouth: 'smile', blush: 1 },
  { id: 'hoot', name: 'Hoot', bg: '#2e3360', body: '#8a74c9', inner: '#f5d36b', top: 'tufts', head: 'round', eyes: 'owl', mouth: 'beak' },
  { id: 'ember', name: 'Ember', bg: '#ffe0d1', body: '#ff6b3d', top: 'none', head: 'drop', eyes: 'dot', mouth: 'smile', blush: 1 },
  { id: 'cog', name: 'Cog', bg: '#efe2c4', body: '#c99a45', inner: '#7a5a1e', top: 'gear', head: 'round', eyes: 'monocle', mouth: 'line' },
  { id: 'pip', name: 'Pip', bg: '#1d2233', body: '#c9d2e3', inner: '#ff5a5f', top: 'plume', head: 'helmet', eyes: 'slit', mouth: 'none' },
  { id: 'koi', name: 'Koi', bg: '#d4f0f4', body: '#ff8a5b', inner: '#ffd2bf', top: 'fins', head: 'blob', eyes: 'dot', mouth: 'o', extra: 'spots' },
  { id: 'nimbus', name: 'Nimbus', bg: '#cfe6ff', body: '#ffffff', outline: '#b9d3ef', top: 'none', head: 'cloud', eyes: 'happy', mouth: 'smile', blush: 1 },
  { id: 'luna', name: 'Luna', bg: '#262a4a', body: '#f5d36b', inner: '#e9a93a', top: 'cat', head: 'round', eyes: 'happy', mouth: 'cat', extra: 'star' },
  { id: 'bun', name: 'Bun', bg: '#e7f6ff', body: '#f6f6f6', outline: '#d5e3ec', inner: '#ffb6c9', top: 'bunny', head: 'round', eyes: 'dot', mouth: 'cat', blush: 1 },
  { id: 'axo', name: 'Axo', bg: '#ffe6f2', body: '#ff9fc8', inner: '#e5609b', top: 'gills', head: 'blob', eyes: 'dot', mouth: 'smile' },
  { id: 'cap', name: 'Cap', bg: '#f3ead9', body: '#fbe9d0', inner: '#e2483d', top: 'none', head: 'round', eyes: 'dot', mouth: 'smile', blush: 1, extra: 'cap' },
  { id: 'boo', name: 'Boo', bg: '#e6e1ff', body: '#ffffff', outline: '#cfc6f2', top: 'none', head: 'ghost', eyes: 'big', mouth: 'o' },
  { id: 'rex', name: 'Rex', bg: '#e1f5e4', body: '#4fbf7a', inner: '#2f8f55', top: 'spikes', head: 'round', eyes: 'dot', mouth: 'smile', extra: 'belly' }
];
function avatarSvg(id) {
  const a = AVATARS.find(x => x.id === id) || AVATARS[0];
  const B = a.body, I = a.inner || a.body, D = '#2a2230';
  const S = `stroke="${D}" stroke-width="2.2" stroke-linecap="round" fill="none"`;
  const O = a.outline ? ` stroke="${a.outline}" stroke-width="1.6"` : '';
  const tops = {
    fox: `<path d="M13 30 L17 7 L31 21Z M51 30 L47 7 L33 21Z" fill="${B}"/><path d="M18 13 L20 22 L26 20Z M46 13 L44 22 L38 20Z" fill="${I}"/>`,
    cat: `<path d="M13 30 L16 9 L30 20Z M51 30 L48 9 L34 20Z" fill="${B}"/><path d="M17 15 L19 22 L24 20Z M47 15 L45 22 L40 20Z" fill="${I}"/>`,
    bunny: `<rect x="19" y="1" width="9" height="28" rx="4.5" fill="${B}"${O}/><rect x="36" y="1" width="9" height="28" rx="4.5" fill="${B}"${O}/><rect x="21.5" y="5" width="4" height="19" rx="2" fill="${I}"/><rect x="38.5" y="5" width="4" height="19" rx="2" fill="${I}"/>`,
    antenna: `<line x1="32" y1="18" x2="32" y2="7" stroke="${D}" stroke-width="2.2"/><circle cx="32" cy="6" r="3.4" fill="${I}"/>`,
    sprout: `<path d="M32 19 V9" stroke="#3f8a3a" stroke-width="2.4" stroke-linecap="round"/><path d="M32 11 C27 4 19 6 18 7 C21 13 28 14 32 11Z" fill="#5fb85a"/><path d="M32 11 C37 3 45 5 46 6 C43 13 36 14 32 11Z" fill="#7fd06f"/>`,
    tufts: `<path d="M14 28 L11 11 L27 20Z M50 28 L53 11 L37 20Z" fill="${B}"/>`,
    gear: Array.from({ length: 8 }, (_, i) => `<rect x="28.5" y="11" width="7" height="9" rx="1.2" fill="${I}" transform="rotate(${i * 45} 32 38)"/>`).join(''),
    plume: `<path d="M32 16 C33 6 43 2 50 5 C44 7 39 11 37 17Z" fill="${I}"/>`,
    fins: `<path d="M12 38 L3 29 L5 47Z M52 38 L61 29 L59 47Z" fill="${I}"/>`,
    gills: `<g fill="${I}"><ellipse cx="11" cy="30" rx="6.5" ry="2.6" transform="rotate(-30 11 30)"/><ellipse cx="9" cy="38" rx="6.5" ry="2.6"/><ellipse cx="11" cy="46" rx="6.5" ry="2.6" transform="rotate(30 11 46)"/><ellipse cx="53" cy="30" rx="6.5" ry="2.6" transform="rotate(30 53 30)"/><ellipse cx="55" cy="38" rx="6.5" ry="2.6"/><ellipse cx="53" cy="46" rx="6.5" ry="2.6" transform="rotate(-30 53 46)"/></g>`,
    spikes: `<path d="M20 22 L24 9 L29 19 L33 6 L37 19 L42 10 L45 23Z" fill="${I}"/>`,
    none: ''
  };
  const heads = {
    round: `<circle cx="32" cy="38" r="20" fill="${B}"${O}/>`,
    blob: `<ellipse cx="32" cy="40" rx="22" ry="18" fill="${B}"${O}/>`,
    square: `<rect x="13" y="18" width="38" height="36" rx="9" fill="${B}"/>`,
    drop: `<path d="M32 9 C40 21 52 27 52 40 A20 20 0 0 1 12 40 C12 27 24 21 32 9Z" fill="${B}"/><path d="M32 9 C34 14 38 18 38 18 C35 19 31 17 32 9Z" fill="#ffc15e"/>`,
    cloud: `<g fill="${B}"${O}><circle cx="21" cy="41" r="11"/><circle cx="33" cy="33" r="14"/><circle cx="45" cy="42" r="10"/></g><rect x="12" y="41" width="43" height="12" rx="6" fill="${B}"/>`,
    ghost: `<path d="M13 38 A19 19 0 0 1 51 38 V55 L46 51 L41 55 L36.5 51 L32 55 L27.5 51 L23 55 L18 51 L13 55Z" fill="${B}"${O}/>`,
    helmet: `<rect x="14" y="16" width="36" height="40" rx="15" fill="${B}"/><rect x="14" y="44" width="36" height="12" rx="3" fill="${B}"/>`
  };
  const ey = { blob: 41, cloud: 40, ghost: 37, helmet: 35, square: 36 }[a.head] || 38;
  const my = ey + 7;
  const eyes = {
    dot: `<circle cx="25" cy="${ey}" r="2.7" fill="${D}"/><circle cx="39" cy="${ey}" r="2.7" fill="${D}"/>`,
    happy: `<path d="M22 ${ey + 1} Q25 ${ey - 3} 28 ${ey + 1} M36 ${ey + 1} Q39 ${ey - 3} 42 ${ey + 1}" ${S}/>`,
    sleepy: `<path d="M22 ${ey} Q25 ${ey + 3} 28 ${ey} M36 ${ey} Q39 ${ey + 3} 42 ${ey}" ${S}/>`,
    big: `<ellipse cx="25" cy="${ey}" rx="3.6" ry="5" fill="${D}"/><ellipse cx="39" cy="${ey}" rx="3.6" ry="5" fill="${D}"/><circle cx="26.3" cy="${ey - 2}" r="1.3" fill="#fff"/><circle cx="40.3" cy="${ey - 2}" r="1.3" fill="#fff"/>`,
    owl: `<circle cx="24.5" cy="${ey - 1}" r="6.5" fill="${I}"/><circle cx="39.5" cy="${ey - 1}" r="6.5" fill="${I}"/><circle cx="24.5" cy="${ey - 1}" r="3" fill="${D}"/><circle cx="39.5" cy="${ey - 1}" r="3" fill="${D}"/>`,
    visor: `<rect x="19" y="${ey - 5}" width="26" height="10" rx="5" fill="${D}"/><rect x="23" y="${ey - 2}" width="5" height="4" rx="1" fill="#3dffa8"/><rect x="36" y="${ey - 2}" width="5" height="4" rx="1" fill="#3dffa8"/>`,
    monocle: `<circle cx="25" cy="${ey}" r="2.7" fill="${D}"/><circle cx="39" cy="${ey}" r="5.5" fill="#fff6dc" stroke="${I}" stroke-width="2"/><circle cx="39" cy="${ey}" r="2.4" fill="${D}"/><path d="M44 ${ey + 3} Q47 ${ey + 10} 44 ${ey + 16}" stroke="${I}" stroke-width="1.3" fill="none"/>`,
    slit: `<rect x="19" y="${ey - 3}" width="26" height="6" rx="2" fill="${D}"/><rect x="31" y="${ey - 3}" width="2" height="15" fill="${D}"/>`
  };
  const mouths = {
    smile: `<path d="M28.5 ${my} Q32 ${my + 3.5} 35.5 ${my}" ${S}/>`,
    cat: `<path d="M27.5 ${my} Q29.7 ${my + 2.6} 32 ${my} Q34.3 ${my + 2.6} 36.5 ${my}" ${S}/>`,
    o: `<ellipse cx="32" cy="${my + 1}" rx="2.2" ry="2.6" fill="${D}"/>`,
    beak: `<path d="M29 ${my - 3} L35 ${my - 3} L32 ${my + 2}Z" fill="#f2a93b"/>`,
    line: `<path d="M29 ${my} H35" ${S}/>`,
    grill: `<rect x="25" y="${my - 1}" width="14" height="5" rx="2" fill="${D}" opacity=".85"/><path d="M29 ${my - 1} V${my + 4} M32 ${my - 1} V${my + 4} M35 ${my - 1} V${my + 4}" stroke="${B}" stroke-width="1"/>`,
    none: ''
  };
  const extras = {
    muzzle: `<ellipse cx="32" cy="${my}" rx="9" ry="6.5" fill="${I}"/>`,
    star: `<path d="M32 21 l1.6 3.3 3.6.5 -2.6 2.5 .6 3.6 -3.2-1.7 -3.2 1.7 .6-3.6 -2.6-2.5 3.6-.5Z" fill="#fff6c8"/>`,
    spots: `<circle cx="22" cy="31" r="3" fill="${I}"/><circle cx="44" cy="32" r="2.2" fill="${I}"/><circle cx="41" cy="53" r="2.6" fill="${I}"/>`,
    belly: `<ellipse cx="32" cy="53" rx="10" ry="4.5" fill="#bdeccb" opacity=".75"/>`,
    cap: `<path d="M9 33 C9 12 55 12 55 33 C46 28.5 18 28.5 9 33Z" fill="${I}"/><circle cx="21" cy="24" r="3.3" fill="#fff"/><circle cx="34" cy="19" r="3.8" fill="#fff"/><circle cx="45" cy="26" r="2.8" fill="#fff"/>`
  };
  const blush = a.blush ? `<circle cx="19.5" cy="${my - 1}" r="3.2" fill="#ff7a9a" opacity=".45"/><circle cx="44.5" cy="${my - 1}" r="3.2" fill="#ff7a9a" opacity=".45"/>` : '';
  return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="64" height="64" fill="${a.bg}"/>${tops[a.top] || ''}${heads[a.head] || heads.round}${extras[a.extra] || ''}${eyes[a.eyes] || eyes.dot}${mouths[a.mouth] || ''}${blush}</svg>`;
}
function avatarHtml(p, size) {
  const sz = size ? `width:${size}px;height:${size}px;` : '';
  const inner = p && p.avatar === 'custom' && p.avatarData ? `<img src="${p.avatarData}" alt="">` : avatarSvg(p && p.avatar);
  return `<span class="avatar" style="${sz}">${inner}</span>`;
}
function avatarGalleryHtml(selected, customData, act) {
  return `<div class="av-grid">
    ${AVATARS.map(a => `<button class="av-tile${a.id === selected ? ' sel' : ''}" ${act} data-av="${a.id}" aria-pressed="${a.id === selected}">${avatarHtml({ avatar: a.id })}<span>${a.name}</span></button>`).join('')}
    ${customData ? `<button class="av-tile${selected === 'custom' ? ' sel' : ''}" ${act} data-av="custom">${avatarHtml({ avatar: 'custom', avatarData: customData })}<span>Yours</span></button>` : ''}
    <label class="av-tile av-upload"><span class="av-up-box">+</span><span>Upload</span><input type="file" accept="image/*" data-av-upload="1" style="display:none"></label>
  </div>`;
}
function readAvatarFile(file, cb) {
  const r = new FileReader();
  r.onload = () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = 160;
      const s = Math.min(img.width, img.height);
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 160, 160);
      cb(c.toDataURL('image/jpeg', 0.86));
    };
    img.src = r.result;
  };
  r.readAsDataURL(file);
}

/* ---------------- Sidebar sections (per profile) ---------------- */
const SECTION_GROUPS = [
  { label: 'Studio', items: [['overview', 'Overview', 1], ['about', 'About'], ['library', '3D Asset Library'], ['studiocosts', 'Studio Costs']] },
  { label: 'Apps', items: [['apps-rootedtales', 'Rooted Tales'], ['apps-xenwinxworlds', 'Xenwinx Worlds']] },
  { label: 'Universes', items: [['grp:universes', 'Universe switcher'], ['u-storybooks', 'Story Books'], ['u-conceptart', 'Concept Art Book'], ['u-journal', 'Journal'], ['u-game', 'Game'], ['u-worlds', 'Xenwinx Worlds Content'], ['u-animation', 'Animation'], ['u-merch', 'Merch'], ['u-social', 'Social Media'], ['u-create', 'Create'], ['u-financials', 'Financials']] },
  { label: 'Inside Create', items: CREATE_SECTIONS.map(s => ['create:' + s.key, s.label]) },
  { label: 'Planning & docs', items: [['goals', 'Goals'], ['achievements', 'Achievements'], ['schedule', 'Schedule'], ['notes', 'Notes'], ['dailycheck', 'Daily Check'], ['trackers', 'Trackers']] }
];
function sectionHidden(key) { const p = P(); return !!(p && p.hidden && p.hidden[key]); }
function sectionsHtml(hidden, act) {
  return `<div class="sec-groups">${SECTION_GROUPS.map(g => `<div>
    <div class="sec-group-label">${esc(g.label)}</div>
    <div class="sec-grid">${g.items.map(([k, l, locked]) => {
      const on = locked || !hidden[k];
      return `<button class="sec-item ${on ? 'on' : 'off'}" ${locked ? 'disabled' : `${act} data-sec="${k}"`} aria-pressed="${on}"><span class="sec-box">${on ? '\u2713' : ''}</span><span>${esc(l)}</span>${locked ? '<span class="sec-lock">always on</span>' : ''}</button>`;
    }).join('')}</div>
  </div>`).join('')}</div>`;
}

/* ---------------- Profiles ---------------- */
const REG_KEY = 'xenwinx-profiles-v1';
let REG = { profiles: [], lastId: null, legacyClaimed: false };
let ACTIVE = null;
let STATE_DEFAULTS = null;
function loadReg() {
  try { const r = JSON.parse(localStorage.getItem(REG_KEY) || 'null'); if (r && Array.isArray(r.profiles)) REG = Object.assign(REG, r); } catch (e) { /* fresh registry */ }
}
function saveReg() { try { localStorage.setItem(REG_KEY, JSON.stringify(REG)); } catch (e) { console.warn('Xenwinx: could not save profiles.', e); } }
function P() { return ACTIVE ? REG.profiles.find(p => p.id === ACTIVE) || null : null; }
function profileKey(id) { return SAVE_KEY + ':' + id; }
function legacyAvailable() { try { return !REG.legacyClaimed && !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } }
function hashPin(s) { let h = 5381; for (const c of String(s)) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return 'h' + (h >>> 0).toString(36); }
function hashAns(s) { return hashPin('rec:' + String(s).trim().toLowerCase().replace(/\s+/g, ' ')); }
const REC_QUESTIONS = ['What was the name of your first pet?', 'What city were you born in?', 'What was your childhood nickname?', 'What was the first game you ever played?', 'What is the name of the first character you created?', 'What street did you grow up on?'];
function recSelectHtml(id, cur) {
  return `<select id="${id}"><option value="">No recovery question</option>${REC_QUESTIONS.map(q => `<option${q === cur ? ' selected' : ''}>${esc(q)}</option>`).join('')}</select>`;
}
function deleteProfileData(id) {
  REG.profiles = REG.profiles.filter(x => x.id !== id);
  if (REG.lastId === id) REG.lastId = null;
  try { localStorage.removeItem(profileKey(id)); } catch (e) { /* ignore */ }
  saveReg();
}
const PF_UI = { del: false, delErr: '', recMsg: '' };
function resetState() {
  const d = JSON.parse(STATE_DEFAULTS);
  Object.keys(state).forEach(k => { delete state[k]; });
  Object.assign(state, d);
}
function curThemeId() { const p = P(); return p ? p.theme : gateThemeId(); }
function activeSkin() {
  const t = themeById(curThemeId()), p = P();
  return (!t.skin || (p && p.universeTint)) ? U().skin : t.skin;
}
function enterProfile(id, applyThemeColors) {
  const p = REG.profiles.find(x => x.id === id);
  if (!p) return;
  ACTIVE = id; p.lastOpened = Date.now(); REG.lastId = id; saveReg();
  loadState(id);
  if (applyThemeColors) setThemeAppearance(p.theme);
  state.history = []; state.modal = null;
  GATE.draft = null; GATE.pinFor = null; GATE.manage = false; GATE.notice = '';
  PF_UI.del = false; PF_UI.delErr = ''; PF_UI.recMsg = '';
  $('#gate').innerHTML = ''; $('#gate').style.display = 'none'; $('#shell').style.display = '';
  applyTheme(p.theme); syncSettingsInputs(); applyAppearance(); applySkin(); render(); saveState();
  featuresOnEnter();
}
function leaveProfile(screen) {
  featuresOnLeave();
  saveState(); clearTimeout(saveTimer);
  ACTIVE = null; resetState();
  $('#modalOverlay').classList.add('hidden'); $('#settingsPanel').classList.add('hidden');
  $('#shell').style.display = 'none'; $('#gate').style.display = '';
  GATE.screen = screen; GATE.error = ''; renderGate();
}
function switchTheme(id) {
  const p = P(); if (!p) return;
  p.theme = id; saveReg();
  setThemeAppearance(id); applyTheme(id); syncSettingsInputs(); applyAppearance(); applySkin();
}
function keepScroll(fn) { const m = $('#main'), st = m.scrollTop; fn(); m.scrollTop = st; }
function handleProfileAction(t, action) {
  const p = P(); if (!p) return;
  switch (action) {
    case 'pf-avatar': p.avatar = t.dataset.av; break;
    case 'pf-theme': switchTheme(t.dataset.theme); break;
    case 'pf-tint': p.universeTint = !p.universeTint; applySkin(); break;
    case 'pf-section': p.hidden = p.hidden || {}; if (p.hidden[t.dataset.sec]) delete p.hidden[t.dataset.sec]; else p.hidden[t.dataset.sec] = true; break;
    case 'pf-sections-all': p.hidden = {}; break;
    case 'pf-pin-clear': p.pin = ''; p.recQ = ''; p.recA = ''; break;
    case 'pf-rec-save': {
      const q = ROOT.querySelector('#pfRecQ'), a = ROOT.querySelector('#pfRecA');
      if (!q || !q.value) { PF_UI.recMsg = 'Choose a question first.'; break; }
      if (!a || !a.value.trim()) { PF_UI.recMsg = 'Type an answer you\u2019ll remember.'; break; }
      p.recQ = q.value; p.recA = hashAns(a.value); PF_UI.recMsg = 'Recovery question saved.'; break;
    }
    case 'pf-rec-clear': p.recQ = ''; p.recA = ''; PF_UI.recMsg = ''; break;
    case 'pf-delete-cancel': PF_UI.del = false; PF_UI.delErr = ''; break;
    case 'pf-switch': leaveProfile('login'); return;
    case 'pf-logout': leaveProfile('landing'); return;
    case 'pf-delete': PF_UI.del = true; PF_UI.delErr = ''; keepScroll(render); setTimeout(() => { const f = ROOT.querySelector('#pfDelName'); if (f) f.focus(); }, 30); return;
    case 'pf-delete-confirm': {
      const inp = ROOT.querySelector('#pfDelName');
      if (!inp || inp.value.trim() !== p.name) { PF_UI.delErr = 'The name doesn\u2019t match.'; keepScroll(render); return; }
      const id = p.id;
      PF_UI.del = false; PF_UI.delErr = '';
      leaveProfile('landing');
      deleteProfileData(id); renderGate(); return;
    }
    default: return;
  }
  saveReg(); keepScroll(render);
}
function onProfileChange(e) {
  const el = e.target;
  if (el.matches && el.matches('[data-av-upload]')) {
    const f = el.files && el.files[0]; if (!f) return;
    const inGate = !!el.closest('#gate');
    readAvatarFile(f, url => {
      if (inGate && GATE.draft) { GATE.draft.avatar = 'custom'; GATE.draft.avatarData = url; renderGate(); return; }
      const p = P(); if (!p) return;
      p.avatar = 'custom'; p.avatarData = url; saveReg(); keepScroll(render);
    });
    return;
  }
  const p = P(); if (!p) return;
  if (el.id === 'pfName') { const v = el.value.trim(); if (v) { p.name = v; saveReg(); renderSidebar(); } else el.value = p.name; }
  if (el.id === 'pfPin') {
    const v = el.value.trim();
    if (/^\d{4}$/.test(v)) { p.pin = hashPin(v); saveReg(); keepScroll(render); }
    else if (v) { el.value = ''; el.placeholder = 'PIN must be 4 digits'; }
  }
}
function profileChipHtml() {
  const p = P(); if (!p) return '';
  return `<div class="profile-chip">
    <button class="profile-chip-main${state.activeView === 'profile' ? ' active' : ''}" data-action="nav" data-view="profile" title="Profile &amp; settings">
      ${avatarHtml(p, 34)}
      <span class="pc-text"><b>${esc(p.name)}</b><span>${esc(themeById(p.theme).name)} theme</span></span>
    </button>
    <button class="pillar-mini" data-action="pf-switch" title="Switch profile" aria-label="Switch profile">\u21c4</button>
  </div>`;
}
function renderProfile() {
  const p = P(); if (!p) return '';
  const t = themeById(p.theme);
  return `
  <div class="view narrow">
    <h1 class="page-title">Profile &amp; settings</h1>
    <div class="page-sub">Saved to ${esc(p.name)}\u2019s profile on this device. Every profile keeps its own dashboard data, theme and sidebar.</div>
    <div class="list-col">
      <div class="card pf-head">
        ${avatarHtml(p, 88)}
        <div class="pf-fields">
          <label class="field" style="margin:0">Profile name<input id="pfName" value="${esc(p.name)}" maxlength="40"></label>
          <label class="field" style="margin:0">${p.pin ? 'PIN set. Type a new one to change it' : 'PIN (optional, 4 digits)'}<input id="pfPin" type="password" inputmode="numeric" maxlength="4" placeholder="${p.pin ? '\u2022\u2022\u2022\u2022' : 'No PIN'}"></label>
          ${p.pin ? `<div><button class="ghost-btn small" data-action="pf-pin-clear">Remove PIN</button></div>` : ''}
          ${p.pin ? `<div class="rec-box">
            <div class="pf-h" style="margin:0">PIN recovery <span>${p.recQ ? 'set' : 'not set'}</span></div>
            <div class="pf-note" style="margin:0">${p.recQ ? `If you forget your PIN, you\u2019ll answer: <b>${esc(p.recQ)}</b>` : 'Without one, a forgotten PIN can only be fixed by deleting this profile.'}</div>
            <label class="field" style="margin:0">Question${recSelectHtml('pfRecQ', p.recQ)}</label>
            <label class="field" style="margin:0"><span>${p.recQ ? 'New answer' : 'Answer'} <span class="opt">not case-sensitive</span></span><input id="pfRecA" type="password" autocomplete="off" maxlength="60"></label>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <button class="ghost-btn small" data-action="pf-rec-save">Save recovery question</button>
              ${p.recQ ? `<button class="ghost-btn small" data-action="pf-rec-clear">Remove</button>` : ''}
              ${PF_UI.recMsg ? `<span class="pf-note" style="margin:0">${esc(PF_UI.recMsg)}</span>` : ''}
            </div>
          </div>` : ''}
        </div>
      </div>
      <div class="card">
        <div class="pf-h">Avatar</div>
        ${avatarGalleryHtml(p.avatar, p.avatarData, 'data-action="pf-avatar"')}
      </div>
      <div class="card">
        <div class="pf-h">Theme <span>${esc(t.name)}</span></div>
        <div class="pf-note">Changing theme resets the Appearance colours to that theme\u2019s palette. Fine-tune them afterwards from the \u2699 panel.</div>
        ${themeGridHtml(p.theme, 'data-action="pf-theme"')}
        <label class="checkbox-field" style="margin:16px 0 0"><input type="checkbox" data-action="pf-tint" ${p.theme === 'classic' || p.universeTint ? 'checked' : ''} ${p.theme === 'classic' ? 'disabled' : ''}> Tint the dashboard with each universe\u2019s own colours${p.theme === 'classic' ? ' (always on in Classic)' : ''}</label>
      </div>
      <div class="card">
        <div class="pf-h">Sidebar sections <button class="ghost-btn small" data-action="pf-sections-all">Show all</button></div>
        <div class="pf-note">Switch off anything you don\u2019t work on. Hidden sections keep their data, so you can switch them back on any time.</div>
        ${sectionsHtml(p.hidden || {}, 'data-action="pf-section"')}
      </div>
      ${featureProfileCards(p)}
      <div class="card pf-account">
        <div><div class="pf-h" style="margin-bottom:4px">Account</div><div class="pf-note" style="margin:0">${REG.profiles.length} profile${REG.profiles.length === 1 ? '' : 's'} on this device.</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="ghost-btn" data-action="pf-switch">Switch profile</button>
          <button class="ghost-btn" data-action="pf-logout">Log out</button>
          <button class="danger-btn" data-action="pf-delete">Delete profile</button>
        </div>
        ${PF_UI.del ? `<div class="del-box">
          <div><b>Delete \u201c${esc(p.name)}\u201d permanently?</b> Its workflows, journeys, games, schedules and every other piece of dashboard data on this device will be erased. This can\u2019t be undone.</div>
          <label class="field" style="margin:0"><span>Type <b>${esc(p.name)}</b> to confirm</span><input id="pfDelName" autocomplete="off" maxlength="40"></label>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <button class="danger-btn solid" data-action="pf-delete-confirm">Delete permanently</button>
            <button class="ghost-btn" data-action="pf-delete-cancel">Cancel</button>
            ${PF_UI.delErr ? `<span class="gate-error">${esc(PF_UI.delErr)}</span>` : ''}
          </div>
        </div>` : ''}
      </div>
    </div>
  </div>`;
}

/* ---------------- Landing / log-in / create-profile gate ---------------- */
const GATE = { screen: 'landing', step: 1, draft: null, pinFor: null, error: '', lastKey: '', manage: false, delBack: 'login', notice: '' };
function newDraft() {
  return { name: '', avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)].id, avatarData: '', theme: 'classic', hidden: {}, pin: '', recQ: '', recA: '', importLegacy: legacyAvailable() };
}
function gateThemeId() {
  if (GATE.screen === 'create' && GATE.draft) return GATE.draft.theme;
  const pick = REG.profiles.find(p => p.id === (['pin', 'forgot', 'delete'].includes(GATE.screen) ? GATE.pinFor : REG.lastId));
  return pick ? pick.theme : 'classic';
}
function gateLandingHtml() {
  const last = REG.profiles.find(p => p.id === REG.lastId);
  const n = REG.profiles.length;
  const intro = !window.__xwIntroSeen; window.__xwIntroSeen = true;
  return `<div class="gate gate-forest${intro ? ' gate-intro' : ''}"><div class="gate-inner gate-landing">
    <div class="gate-copy">
      <div class="gate-brand"><img src="assets/xenwinx-logo.png" alt="" class="brand-logo"><span>Xenwinx Studio Dashboard</span></div>
      <h1 class="gate-title">Imagine. Design.<br>Inspiring minds.</h1>
      <p class="gate-sub">Universes, games, books, apps and the plans that tie them together. Pick up where you left off, or set up a new profile.</p>
      <div class="gate-actions">
        <button class="btn-primary gate-btn" data-gate="login">Log In</button>
        <button class="ghost-btn gate-btn" data-gate="create">Create Profile</button>
      </div>
      ${gateExtrasHtml()}
      ${last ? `<button class="gate-continue" data-gate="pick" data-pid="${last.id}">${avatarHtml(last, 30)}<span>Continue as <b>${esc(last.name)}</b></span><span aria-hidden="true">\u2192</span></button>`
        : `<div class="gate-note">${n ? `${n} profile${n === 1 ? '' : 's'} on this device` : 'No profiles yet. Create one to get started.'}</div>`}
    </div>
    <div class="gate-art" aria-hidden="true">${AVATARS.slice(0, 12).map((a, i) => `<span class="gate-art-tile" style="--d:${i}">${avatarHtml({ avatar: a.id })}</span>`).join('')}</div>
  </div></div>`;
}
function gateLoginHtml() {
  const list = REG.profiles.slice().sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0));
  return `<div class="gate"><div class="gate-inner gate-col">
    <div><button class="back-btn" data-gate="landing">\u2190 Back</button></div>
    <div class="login-head">
      <div>
        <h1 class="gate-title sm">${GATE.manage ? 'Manage profiles' : 'Who\u2019s in the studio today?'}</h1>
        <p class="gate-sub" style="margin-top:10px">${GATE.manage ? 'Choose a profile to delete it from this device.' : list.length ? 'Choose your profile to open your dashboard.' : 'There are no profiles on this device yet.'}</p>
      </div>
      ${list.length ? `<button class="ghost-btn gate-btn" data-gate="manage">${GATE.manage ? 'Done' : 'Manage profiles'}</button>` : ''}
    </div>
    ${GATE.notice ? `<div class="gate-notice">${esc(GATE.notice)}</div>` : ''}
    <div class="profile-grid">
      ${list.map(p => `<button class="card profile-card${GATE.manage ? ' managing' : ''}" data-gate="${GATE.manage ? 'del-pick' : 'pick'}" data-pid="${p.id}">
        ${GATE.manage ? '<span class="pc-del">Delete</span>' : ''}
        ${avatarHtml(p, 88)}
        <span class="pc-name">${esc(p.name)}</span>
        <span class="pc-meta">${esc(themeById(p.theme).name)}${p.pin ? ' \u00b7 PIN' : ''}</span>
      </button>`).join('')}
      ${GATE.manage ? '' : `<button class="profile-card add" data-gate="create"><span class="av-up-box" style="width:88px">+</span><span class="pc-name">New profile</span></button>`}
    </div>
    ${GATE.manage ? '' : gateExtrasHtml()}
  </div></div>`;
}
function gatePinHtml() {
  const p = REG.profiles.find(x => x.id === GATE.pinFor);
  if (!p) return gateLoginHtml();
  return `<div class="gate"><div class="gate-inner gate-col gate-pin">
    <div><button class="back-btn" data-gate="login">\u2190 Back</button></div>
    <div class="card pin-card">
      ${avatarHtml(p, 96)}
      <div class="pc-name" style="font-size:22px">${esc(p.name)}</div>
      <label class="field" style="width:100%;margin:0">Enter your 4-digit PIN<input id="gatePin" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label>
      ${GATE.error ? `<div class="gate-error">${esc(GATE.error)}</div>` : ''}
      <button class="btn-primary gate-btn" style="width:100%" data-gate="pin-submit">Open dashboard</button>
      <button class="gate-link" data-gate="forgot">Forgot PIN?</button>
    </div>
  </div></div>`;
}
function gateForgotHtml() {
  const p = REG.profiles.find(x => x.id === GATE.pinFor);
  if (!p) return gateLoginHtml();
  return `<div class="gate"><div class="gate-inner gate-col gate-pin">
    <div><button class="back-btn" data-gate="pin-back">\u2190 Back</button></div>
    <div class="card pin-card" style="align-items:stretch">
      <div style="display:flex;align-items:center;gap:14px">${avatarHtml(p, 56)}<div><div class="pc-name">Reset PIN</div><div class="pc-meta">${esc(p.name)}</div></div></div>
      ${p.recQ && p.recA ? `
        <label class="field" style="margin:0">${esc(p.recQ)}<input id="gateRecAns" type="password" autocomplete="off" maxlength="60"></label>
        <label class="field" style="margin:0"><span>New 4-digit PIN <span class="opt">leave empty to remove the PIN</span></span><input id="gateResetPin" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label>
        ${GATE.error ? `<div class="gate-error">${esc(GATE.error)}</div>` : ''}
        <button class="btn-primary gate-btn" style="width:100%" data-gate="reset-submit">Reset PIN and open</button>`
      : `<div class="pf-note" style="margin:0">This profile has no recovery question, and PINs are stored only on this device, so it can\u2019t be unlocked without the PIN.</div>`}
      <div class="del-box">
        <div><b>${p.recQ ? 'Can\u2019t remember the answer either?' : 'Start over'}</b> Delete this profile and create a new one. All of its dashboard data on this device will be erased.</div>
        <div><button class="danger-btn" data-gate="forgot-delete">Delete this profile\u2026</button></div>
      </div>
    </div>
  </div></div>`;
}
function gateDeleteHtml() {
  const p = REG.profiles.find(x => x.id === GATE.pinFor);
  if (!p) return gateLoginHtml();
  const needPin = p.pin && GATE.delBack !== 'forgot';
  return `<div class="gate"><div class="gate-inner gate-col gate-pin">
    <div><button class="back-btn" data-gate="del-back">\u2190 Back</button></div>
    <div class="card pin-card" style="align-items:stretch">
      <div style="display:flex;align-items:center;gap:14px">${avatarHtml(p, 56)}<div><div class="pc-name">Delete profile</div><div class="pc-meta">${esc(p.name)} \u00b7 ${esc(themeById(p.theme).name)}</div></div></div>
      <div class="pf-note" style="margin:0">Everything saved in this profile on this device is erased: workflows, journeys, games, schedules, posts and achievements. Other profiles aren\u2019t affected. This can\u2019t be undone.</div>
      <label class="field" style="margin:0"><span>Type <b>${esc(p.name)}</b> to confirm</span><input id="gateDelName" autocomplete="off" maxlength="40"></label>
      ${needPin ? `<label class="field" style="margin:0">PIN<input id="gateDelPin" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label>` : ''}
      ${GATE.error ? `<div class="gate-error">${esc(GATE.error)}</div>` : ''}
      <button class="danger-btn solid gate-btn" style="width:100%" data-gate="delete-confirm">Delete permanently</button>
      ${needPin ? `<button class="gate-link" data-gate="forgot">Forgot PIN?</button>` : ''}
    </div>
  </div></div>`;
}
function gateCreateHtml() {
  const d = GATE.draft, step = GATE.step;
  const steps = ['Profile', 'Theme', 'Sections'].map((s, i) => `<li class="${i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}">${i + 1}. ${s}</li>`).join('');
  let body = '';
  if (step === 1) {
    body = `<div><h1 class="gate-title sm">Create your profile</h1><p class="gate-sub" style="margin-top:10px">A name and an avatar. You can change both later in Profile &amp; settings.</p></div>
    <div class="wiz-body">
      <div class="card av-preview">
        ${avatarHtml({ avatar: d.avatar, avatarData: d.avatarData }, 120)}
        <label class="field" style="width:100%;margin:0">Profile name<input id="gateName" value="${esc(d.name)}" placeholder="e.g. Zernobie" maxlength="40" autocomplete="off"></label>
        <label class="field" style="width:100%;margin:0">PIN <span class="opt">optional, 4 digits</span><input id="gateNewPin" type="password" inputmode="numeric" maxlength="4" value="${esc(d.pin)}" autocomplete="off"></label>
        <label class="field" style="width:100%;margin:0"><span>Recovery question <span class="opt">used if you forget your PIN</span></span>${recSelectHtml('gateRecQ', d.recQ)}</label>
        <label class="field" style="width:100%;margin:0">Answer<input id="gateRecA" type="password" value="${esc(d.recA)}" maxlength="60" autocomplete="off"></label>
        <div class="opt" style="line-height:1.45">A PIN keeps profiles separate on a shared computer. It\u2019s stored on this device only, so add a recovery question in case you forget it.</div>
        ${legacyAvailable() ? `<label class="checkbox-field" style="margin:0"><input type="checkbox" id="gateImport" ${d.importLegacy ? 'checked' : ''}> Bring in the dashboard data already saved on this device</label>` : ''}
      </div>
      <div><div class="pf-h">Choose an avatar</div>${avatarGalleryHtml(d.avatar, d.avatarData, 'data-gate="avatar"')}</div>
    </div>`;
  } else if (step === 2) {
    body = `<div><h1 class="gate-title sm">Pick a theme</h1><p class="gate-sub" style="margin-top:10px">Colour, type, corners and badges all change together. Switch any time in Profile &amp; settings.</p></div>
    ${themeGridHtml(d.theme, 'data-gate="theme"')}`;
  } else {
    body = `<div><h1 class="gate-title sm">Choose your sidebar</h1><p class="gate-sub" style="margin-top:10px">Keep only the sections you work on. Hidden sections still keep their data, and you can bring them back later.</p></div>
    <div class="card">${sectionsHtml(d.hidden, 'data-gate="section"')}</div>`;
  }
  return `<div class="gate"><div class="gate-inner gate-col wide">
    <div class="wiz-head">
      <button class="back-btn" data-gate="${step === 1 ? 'landing' : 'step-back'}">\u2190 Back</button>
      <ol class="wiz-steps">${steps}</ol>
    </div>
    ${body}
    <div class="wiz-foot">
      ${GATE.error ? `<span class="gate-error">${esc(GATE.error)}</span>` : ''}
      ${step === 3 ? `<button class="ghost-btn gate-btn" data-gate="sections-all">Show all</button>` : ''}
      <button class="btn-primary gate-btn" data-gate="${step < 3 ? 'next' : 'finish'}">${step < 3 ? 'Next' : 'Create profile'}</button>
    </div>
  </div></div>`;
}
function renderGate() {
  const t = themeById(gateThemeId());
  applyTheme(t.id);
  const el = document.documentElement;
  el.style.setProperty('--bg-color', t.appearance.bgColor);
  el.style.setProperty('--font-color', t.appearance.fontColor);
  el.style.setProperty('--heading-color', t.appearance.headingColor);
  el.style.setProperty('--subheading-color', t.appearance.subheadingColor);
  applySkin();
  const key = GATE.screen + GATE.step;
  const old = ROOT.querySelector('#gate .gate'), st = old && key === GATE.lastKey ? old.scrollTop : 0;
  const html = GATE.screen === 'cloud' ? gateCloudHtml() : GATE.screen === 'login' ? gateLoginHtml() : GATE.screen === 'pin' ? gatePinHtml() : GATE.screen === 'forgot' ? gateForgotHtml() : GATE.screen === 'delete' ? gateDeleteHtml() : GATE.screen === 'create' ? gateCreateHtml() : gateLandingHtml();
  $('#gate').innerHTML = html;
  const nw = ROOT.querySelector('#gate .gate'); if (nw) nw.scrollTop = st;
  GATE.lastKey = key;
}
function gateFocus(id) { setTimeout(() => { const f = ROOT.querySelector('#' + id); if (f) f.focus(); }, 30); }
function submitPin() {
  const p = REG.profiles.find(x => x.id === GATE.pinFor), inp = ROOT.querySelector('#gatePin');
  if (!p || !inp) return;
  if (hashPin(inp.value.trim()) === p.pin) { enterProfile(p.id); return; }
  GATE.error = 'That PIN doesn\u2019t match. Try again.'; renderGate(); gateFocus('gatePin');
}
function submitReset() {
  const p = REG.profiles.find(x => x.id === GATE.pinFor); if (!p) return;
  const a = ROOT.querySelector('#gateRecAns'), n = ROOT.querySelector('#gateResetPin');
  if (!a || hashAns(a.value) !== p.recA) { GATE.error = 'That answer doesn\u2019t match.'; renderGate(); gateFocus('gateRecAns'); return; }
  const v = n ? n.value.trim() : '';
  if (v && !/^\d{4}$/.test(v)) { GATE.error = 'A PIN needs exactly 4 digits, or leave it empty.'; renderGate(); gateFocus('gateResetPin'); return; }
  p.pin = v ? hashPin(v) : ''; saveReg(); enterProfile(p.id);
}
function submitDelete() {
  const p = REG.profiles.find(x => x.id === GATE.pinFor); if (!p) return;
  const n = ROOT.querySelector('#gateDelName'), pin = ROOT.querySelector('#gateDelPin');
  if (!n || n.value.trim() !== p.name) { GATE.error = 'The name doesn\u2019t match.'; renderGate(); gateFocus('gateDelName'); return; }
  if (p.pin && GATE.delBack !== 'forgot' && (!pin || hashPin(pin.value.trim()) !== p.pin)) { GATE.error = 'That PIN doesn\u2019t match.'; renderGate(); gateFocus('gateDelPin'); return; }
  const name = p.name;
  deleteProfileData(p.id);
  GATE.pinFor = null; GATE.error = ''; GATE.manage = false;
  GATE.notice = `\u201c${name}\u201d was deleted.`;
  GATE.screen = REG.profiles.length ? 'login' : 'landing'; renderGate();
}
function finishCreate() {
  const d = GATE.draft;
  const p = { id: 'p' + uid(), name: d.name.trim(), avatar: d.avatar, avatarData: d.avatar === 'custom' ? d.avatarData : '', theme: d.theme,
    hidden: Object.assign({}, d.hidden), pin: d.pin ? hashPin(d.pin) : '', recQ: d.pin && d.recQ ? d.recQ : '', recA: d.pin && d.recQ ? hashAns(d.recA) : '', universeTint: false, createdAt: Date.now() };
  let imported = false;
  if (d.importLegacy && legacyAvailable()) {
    try { localStorage.setItem(profileKey(p.id), localStorage.getItem(SAVE_KEY)); REG.legacyClaimed = true; imported = true; } catch (e) { console.warn('Xenwinx: could not import existing data.', e); }
  }
  REG.profiles.push(p); saveReg();
  enterProfile(p.id, !(imported && p.theme === 'classic'));
}
function wireGate() {
  ROOT.addEventListener('click', e => {
    const t = e.target.closest('[data-gate]');
    if (!t || !t.closest('#gate')) return;
    const g = t.dataset.gate, d = GATE.draft;
    if (g !== 'manage') GATE.notice = '';
    if (g === 'landing' || g === 'login') { GATE.screen = g; GATE.error = ''; if (g === 'landing') GATE.manage = false; renderGate(); return; }
    if (g === 'manage') { GATE.manage = !GATE.manage; GATE.notice = ''; renderGate(); return; }
    if (g === 'del-pick') { GATE.pinFor = t.dataset.pid; GATE.delBack = 'login'; GATE.screen = 'delete'; GATE.error = ''; renderGate(); gateFocus('gateDelName'); return; }
    if (g === 'forgot') { GATE.forgotBack = GATE.screen === 'delete' ? 'delete' : 'pin'; GATE.screen = 'forgot'; GATE.error = ''; renderGate(); gateFocus('gateRecAns'); return; }
    if (g === 'pin-back') { GATE.screen = GATE.forgotBack || 'pin'; if (GATE.screen === 'delete') GATE.delBack = 'login'; GATE.error = ''; renderGate(); return; }
    if (g === 'forgot-delete') { GATE.delBack = 'forgot'; GATE.screen = 'delete'; GATE.error = ''; renderGate(); gateFocus('gateDelName'); return; }
    if (g === 'del-back') { GATE.screen = GATE.delBack === 'forgot' ? 'forgot' : 'login'; GATE.error = ''; renderGate(); return; }
    if (g === 'reset-submit') { submitReset(); return; }
    if (g === 'delete-confirm') { submitDelete(); return; }
    if (g === 'create') { GATE.screen = 'create'; GATE.step = 1; GATE.draft = newDraft(); GATE.error = ''; renderGate(); gateFocus('gateName'); return; }
    if (g === 'pick') {
      const p = REG.profiles.find(x => x.id === t.dataset.pid); if (!p) return;
      if (p.pin) { GATE.screen = 'pin'; GATE.pinFor = p.id; GATE.error = ''; renderGate(); gateFocus('gatePin'); }
      else enterProfile(p.id);
      return;
    }
    if (g === 'pin-submit') { submitPin(); return; }
    if (!d) return;
    if (g === 'avatar') { d.avatar = t.dataset.av; renderGate(); return; }
    if (g === 'theme') { d.theme = t.dataset.theme; renderGate(); return; }
    if (g === 'section') { const k = t.dataset.sec; if (d.hidden[k]) delete d.hidden[k]; else d.hidden[k] = true; renderGate(); return; }
    if (g === 'sections-all') { d.hidden = {}; renderGate(); return; }
    if (g === 'step-back') { GATE.step = Math.max(1, GATE.step - 1); GATE.error = ''; renderGate(); return; }
    if (g === 'next') {
      if (GATE.step === 1) {
        if (!d.name.trim()) { GATE.error = 'Give your profile a name to continue.'; renderGate(); gateFocus('gateName'); return; }
        if (d.pin && !/^\d{4}$/.test(d.pin)) { GATE.error = 'A PIN needs exactly 4 digits, or leave it empty.'; renderGate(); gateFocus('gateNewPin'); return; }
        if (d.pin && d.recQ && !d.recA.trim()) { GATE.error = 'Add an answer to your recovery question, or choose none.'; renderGate(); gateFocus('gateRecA'); return; }
      }
      GATE.step += 1; GATE.error = ''; renderGate(); return;
    }
    if (g === 'finish') finishCreate();
  });
  ROOT.addEventListener('input', e => {
    if (!GATE.draft || !e.target.closest('#gate')) return;
    if (e.target.id === 'gateName') GATE.draft.name = e.target.value;
    if (e.target.id === 'gateNewPin') { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); GATE.draft.pin = e.target.value; }
    if (e.target.id === 'gateRecA') GATE.draft.recA = e.target.value;
  });
  ROOT.addEventListener('change', e => {
    if (e.target.id === 'gateImport' && GATE.draft) GATE.draft.importLegacy = e.target.checked;
    if (e.target.id === 'gateRecQ' && GATE.draft) GATE.draft.recQ = e.target.value;
  });
  ROOT.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || !e.target.closest || !e.target.closest('#gate')) return;
    if (e.target.id === 'gatePin') submitPin();
    if (e.target.id === 'gateRecAns' || e.target.id === 'gateResetPin') submitReset();
    if (e.target.id === 'gateDelName' || e.target.id === 'gateDelPin') submitDelete();
    if (e.target.id === 'gateName' || e.target.id === 'gateNewPin') { const b = ROOT.querySelector('#gate [data-gate="next"]'); if (b) b.click(); }
  });
}

/* ================= Finance ledger · Reports · Cloud sync · Profile files ================= */
const FIN_CURRENCIES = [['ZAR', 'R'], ['USD', '$'], ['EUR', '\u20ac'], ['GBP', '\u00a3'], ['AUD', 'A$'], ['CAD', 'C$'], ['JPY', '\u00a5'], ['INR', '\u20b9']];
const FIN_DEFAULT_CATS = {
  income: ['Book sales', 'App sales / IAP', 'Game sales / IAP', 'Merch', 'Commissions', 'Grants', 'Other income'],
  expense: ['Art & assets', 'Software & subscriptions', 'Marketing & ads', 'Hardware', 'Printing & publishing', 'Hosting & domains', 'Contractors', 'Other']
};
state.ledger = { currency: 'ZAR', cats: JSON.parse(JSON.stringify(FIN_DEFAULT_CATS)), entries: [], budgets: {} };
state.reports = [];
state.ovTab = 'summary';
state.finMonth = '';

const FX = { entry: null, finMsg: '', reportDraft: null, reportOpen: null,
  cloudMsg: '', cloudBusy: false, cfgEdit: false, linkChoice: 0, hashFor: null, lastHash: null, pushTimer: null, pulling: false, lastView: null };
const IS_ELECTRON = !!window.xwNative;
const SYNC_ENABLED = true; // desktop (Electron), web and phone all sync through Supabase

/* ---------- small helpers ---------- */
function isoToday() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function finSym() { const c = FIN_CURRENCIES.find(x => x[0] === state.ledger.currency); return c ? c[1] : 'R'; }
function fmtFin(n) { n = +n || 0; return (n < 0 ? '\u2212' : '') + finSym() + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function finMonth() { return state.finMonth || isoToday().slice(0, 7); }
function monthRange(ym) { const [y, m] = ym.split('-').map(Number); return [ym + '-01', ym + '-' + String(new Date(y, m, 0).getDate()).padStart(2, '0')]; }
function shiftMonth(ym, d) { const [y, m] = ym.split('-').map(Number); const dt = new Date(y, m - 1 + d, 1); return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0'); }
function monthLabel(ym, short) { const [y, m] = ym.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString(undefined, short ? { month: 'short' } : { month: 'long', year: 'numeric' }); }
function fmtDate(iso) { if (!iso) return ''; const d = parseISO(iso); return isNaN(d) ? iso : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); }
function rangeLabel(f, t) { return f && t ? `${fmtDate(f)} \u2013 ${fmtDate(t)}` : f ? `From ${fmtDate(f)}` : t ? `Up to ${fmtDate(t)}` : 'All time'; }
function finProjects() { return ['Studio'].concat(Object.values(state.apps || {}).map(a => a.displayName), uOrder().map(id => state.universes[id].short)); }
function entriesIn(from, to) { return state.ledger.entries.filter(e => (!from || e.date >= from) && (!to || e.date <= to)); }
function sumBy(list, key) { const m = {}; list.forEach(e => { const k = e[key] || '\u2014'; m[k] = (m[k] || 0) + (+e.amount || 0); }); return m; }
function totals(list) { let i = 0, x = 0; list.forEach(e => { if (e.type === 'income') i += +e.amount || 0; else x += +e.amount || 0; }); return { income: i, expense: x, net: i - x }; }
function strHash(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h; }
function slugName(s) { return String(s || 'file').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'file'; }
function isNative() { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); }
function blobToB64(b) { return new Promise(r => { const fr = new FileReader(); fr.onload = () => r(String(fr.result).split(',')[1]); fr.readAsDataURL(b); }); }
async function saveBlob(name, blob) {
  if (isNative() && window.Capacitor.Plugins.Filesystem) {
    const pl = window.Capacitor.Plugins;
    const w = await pl.Filesystem.writeFile({ path: name, data: await blobToB64(blob), directory: 'CACHE' });
    if (pl.Share) await pl.Share.share({ title: name, url: w.uri });
    return;
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
function loadScriptOnce(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src)); document.head.appendChild(s);
  });
}

/* ---------- charts (SVG / HTML) ---------- */
const CHART_COLORS = ['var(--u-accent)', 'oklch(0.6 0.13 250)', 'oklch(0.72 0.14 75)', 'oklch(0.6 0.14 150)', 'oklch(0.63 0.17 25)', 'oklch(0.58 0.13 305)', 'oklch(0.7 0.09 195)', 'oklch(0.55 0.03 80)'];
function donutSvg(parts, size, center) {
  size = size || 150;
  const total = parts.reduce((a, p) => a + p.value, 0), r = size / 2 - 12, c = 2 * Math.PI * r, h = size / 2;
  let off = 0;
  const segs = total ? parts.map((p, i) => {
    const len = p.value / total * c;
    const s = `<circle r="${r}" cx="${h}" cy="${h}" fill="none" style="stroke:${CHART_COLORS[i % 8]}" stroke-width="18" stroke-dasharray="${len} ${c - len}" stroke-dashoffset="${-off}" transform="rotate(-90 ${h} ${h})"></circle>`;
    off += len; return s;
  }).join('') : `<circle r="${r}" cx="${h}" cy="${h}" fill="none" style="stroke:var(--t-line-3)" stroke-width="18"></circle>`;
  return `<div class="ch-donut"><svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${segs}<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" class="ch-center">${esc(center || '')}</text></svg>
    <div class="ch-legend">${parts.map((p, i) => `<div><i style="background:${CHART_COLORS[i % 8]}"></i><span>${esc(p.label)}</span><b>${esc(p.fmt != null ? p.fmt : p.value)}</b></div>`).join('')}</div></div>`;
}
function ringSvg(pct, size) {
  size = size || 84;
  const r = size / 2 - 8, c = 2 * Math.PI * r, h = size / 2, len = c * Math.max(0, Math.min(100, pct)) / 100;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle r="${r}" cx="${h}" cy="${h}" fill="none" style="stroke:var(--t-line-3)" stroke-width="8"></circle>
    <circle r="${r}" cx="${h}" cy="${h}" fill="none" style="stroke:var(--u-accent)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${len} ${c}" transform="rotate(-90 ${h} ${h})"></circle>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" class="ch-ring-txt">${Math.round(pct)}%</text></svg>`;
}
function hbarsHtml(rows) {
  const max = Math.max(1, ...rows.map(r => r.max || r.value));
  return `<div class="ch-hbars">${rows.map((r, i) => `<div class="ch-hrow"><span class="ch-hl">${esc(r.label)}</span><span class="ch-htrack"><span style="width:${Math.min(100, r.value / (r.max || max) * 100)}%;background:${r.color || CHART_COLORS[i % 8]}"></span></span><b>${esc(r.fmt != null ? r.fmt : r.value)}</b></div>`).join('')}</div>`;
}
function colsHtml(groups, series) {
  const max = Math.max(1, ...groups.flatMap(g => g.values));
  return `<div class="ch-cols">${groups.map(g => `<div class="ch-col"><div class="ch-colbars">${g.values.map((v, i) => `<span title="${esc(series[i].label)}: ${esc(fmtFin(v))}" style="height:${v / max * 100}%;background:${series[i].color}"></span>`).join('')}</div><div class="ch-cl">${esc(g.label)}</div></div>`).join('')}</div>
    <div class="ch-legend row">${series.map(s => `<div><i style="background:${s.color}"></i><span>${esc(s.label)}</span></div>`).join('')}</div>`;
}
const C_IN = 'oklch(0.58 0.13 150)', C_OUT = 'oklch(0.63 0.17 25)';

/* ---------- area progress (reports) ---------- */
const REPORT_AREAS = [['books', 'Story books'], ['journals', 'Journals'], ['games', 'Games'], ['apps', 'Apps'], ['animation', 'Animation'],
  ['modelling', '3D modelling & art'], ['merch', 'Merchandise'], ['social', 'Social media'], ['goals', 'Goals & timelines'], ['finance', 'Finance'], ['achievements', 'Achievements']];
const PROGRESS_AREAS = ['books', 'journals', 'games', 'apps', 'animation', 'modelling', 'merch', 'social', 'goals'];
function areaLabel(k) { const a = REPORT_AREAS.find(x => x[0] === k); return a ? a[1] : k; }
function doneIs(s) { return ['done', 'published', 'available', 'resolved', 'live', 'complete'].includes(String(s || '').toLowerCase()); }
function statusAgg(groups) {
  const statuses = {}; let done = 0, total = 0;
  const per = groups.map(g => {
    let d = 0; g.items.forEach(s => { s = s || 'not started'; statuses[s] = (statuses[s] || 0) + 1; if (doneIs(s)) d++; });
    done += d; total += g.items.length; return { label: g.label, done: d, total: g.items.length };
  }).filter(x => x.total);
  return { done, total, pct: total ? done / total * 100 : 0, statuses, per };
}
function flatWorkflow(steps) { return (steps || []).flatMap(s => s.substeps && s.substeps.length ? s.substeps.map(x => x.done ? 'done' : 'not started') : [s.done ? 'done' : 'not started']); }
function areaStats(key, from, to) {
  const US = uOrder().map(id => state.universes[id]);
  const per = fn => statusAgg(US.map(u => ({ label: u.short, items: fn(u) })));
  switch (key) {
    case 'books': return per(u => u.storyBooks.items.map(b => b.status === 'in-progress' ? 'in progress' : b.status));
    case 'journals': return per(u => u.journal.items.map(j => j.created ? 'done' : 'planned'));
    case 'games': return per(u => (u.game.workflowTable || []).filter(r => r.status !== 'not needed').map(r => r.status).concat((u.game.tasks || []).map(t => t.status)));
    case 'apps': {
      const apps = Object.values(state.apps).map(a => ({ label: a.displayName, a }))
        .concat(US.filter(u => u.app !== state.apps.rootedTales).map(u => ({ label: u.app.name || u.short + ' app', a: u.app })));
      return statusAgg(apps.map(x => ({ label: x.label, items: flatWorkflow(x.a.workflow).concat((x.a.bugs || []).map(b => b.status === 'resolved' ? 'done' : b.status)) })));
    }
    case 'animation': return per(u => u.animation.clips.map(c => c.status));
    case 'modelling': return per(u => ['artLearning', 'tutorials', 'modelling3D', 'environment'].flatMap(k => (u.create[k] || []).map(x => x.status)));
    case 'merch': return per(u => u.merch.items.map(m => m.status));
    case 'social': return per(u => u.socialMedia.platforms.map(p => p.status));
    case 'goals': {
      const inR = g => !g.targetDate || ((!from || g.targetDate >= from) && (!to || g.targetDate <= to));
      const by = {}; state.goals.filter(inR).forEach(g => { (by[g.pillar || 'Studio'] = by[g.pillar || 'Studio'] || []).push(g.status); });
      return statusAgg(Object.keys(by).map(k => ({ label: k, items: by[k] })));
    }
    default: return statusAgg([]);
  }
}
const PER_UNIVERSE_AREAS = ['books', 'journals', 'games', 'animation', 'modelling', 'merch', 'social'];

/* ---------- Overview tabs ---------- */
function overviewHead() {
  const tab = state.ovTab || 'summary', n = state.reports.length;
  return `<div class="ov-head">
    <div><h1 class="page-title">Studio Overview</h1><div class="page-sub" style="margin-bottom:0">Studio position, money in and out, and reports for meetings</div></div>
    <button class="btn-primary" data-action="xf-report-new">+ Create report</button>
  </div>
  <div class="ov-tabs">${[['summary', 'Summary'], ['finance', 'Finance'], ['reports', 'Reports' + (n ? ` (${n})` : '')]].map(([k, l]) => `<button class="view-btn${tab === k ? ' active' : ''}" data-action="xf-ovtab" data-key="${k}">${l}</button>`).join('')}</div>`;
}

/* ---------- Finance tab ---------- */
function newEntry(prev) { return { type: prev ? prev.type : 'expense', date: prev ? prev.date : isoToday(), amount: '', category: prev ? prev.category : '', project: prev ? prev.project : 'Studio', note: '' }; }
function readEntryForm() {
  const e = FX.entry || (FX.entry = newEntry()), g = id => ROOT.querySelector('#' + id);
  if (g('finDate')) e.date = g('finDate').value;
  if (g('finAmount')) e.amount = g('finAmount').value;
  if (g('finCat')) e.category = g('finCat').value;
  if (g('finProject')) e.project = g('finProject').value;
  if (g('finNote')) e.note = g('finNote').value;
  return e;
}
function addEntry() {
  const e = readEntryForm(), amt = parseFloat(String(e.amount).replace(',', '.'));
  if (!e.date) { FX.finMsg = 'Pick a date.'; keepScroll(render); return; }
  if (!(amt > 0)) { FX.finMsg = 'Enter an amount above zero.'; keepScroll(render); return; }
  const cats = state.ledger.cats[e.type];
  const cat = e.category && cats.includes(e.category) ? e.category : cats[0] || 'Other';
  state.ledger.entries.push({ id: uid(), type: e.type, date: e.date, amount: Math.round(amt * 100) / 100, category: cat, project: e.project || 'Studio', note: (e.note || '').trim() });
  state.finMonth = e.date.slice(0, 7);
  FX.entry = newEntry(e); FX.entry.category = cat; FX.finMsg = '';
  keepScroll(render);
}
function budRow(cat, actual, budget) {
  const over = budget && actual > budget, pct = budget ? Math.min(100, actual / budget * 100) : 0;
  return `<div class="bud-row">
    <span>${esc(cat)}</span>
    <input type="number" min="0" step="any" inputmode="decimal" placeholder="Budget" value="${budget || ''}" data-xf-budget="${esc(cat)}" aria-label="Monthly budget for ${esc(cat)}">
    <span class="ch-htrack">${budget ? `<span style="width:${pct}%;background:${over ? C_OUT : 'var(--u-accent)'}"></span>` : ''}</span>
    <b class="bud-amt" style="${over ? 'color:' + C_OUT : ''}">${fmtFin(actual)}${budget ? ` <span class="opt">/ ${fmtFin(budget)}</span>` : ''}</b>
  </div>`;
}
function renderFinanceTab() {
  const L = state.ledger, ym = finMonth(), [f, t] = monthRange(ym);
  const list = entriesIn(f, t).sort((a, b) => b.date.localeCompare(a.date)), tot = totals(list);
  const exp = list.filter(e => e.type === 'expense'), byCat = sumBy(exp, 'category');
  const budTotal = Object.values(L.budgets).reduce((a, b) => a + (+b || 0), 0);
  const e = FX.entry || (FX.entry = newEntry()), cats = L.cats[e.type] || [];
  const projects = finProjects();
  const byProj = {}; list.forEach(x => { const p = byProj[x.project || 'Studio'] = byProj[x.project || 'Studio'] || { i: 0, x: 0 }; if (x.type === 'income') p.i += x.amount; else p.x += x.amount; });
  const months = []; for (let i = 5; i >= 0; i--) months.push(shiftMonth(ym, -i));
  const stat = (label, val, sub, color) => `<div class="card"><div style="font-size:12.5px;color:var(--t-muted)">${label}</div><div class="big-stat"${color ? ` style="color:${color}"` : ''}>${val}</div>${sub ? `<div class="rp-meta" style="margin-top:4px">${sub}</div>` : ''}</div>`;
  const chips = kind => `<div class="cat-chips">${L.cats[kind].map(c => `<span class="cat-chip">${esc(c)}<button data-action="xf-cat-del" data-key="${kind}" data-name="${esc(c)}" aria-label="Remove ${esc(c)}">\u00d7</button></span>`).join('')}</div>`;
  return `<div class="view">${overviewHead()}
  <div class="fin-bar">
    <button class="ghost-btn small" data-action="xf-fin-month" data-key="-1" aria-label="Previous month">\u2190</button>
    <div class="fin-month">${monthLabel(ym)}</div>
    <button class="ghost-btn small" data-action="xf-fin-month" data-key="1" aria-label="Next month">\u2192</button>
    ${ym !== isoToday().slice(0, 7) ? `<button class="ghost-btn small" data-action="xf-fin-month" data-key="0">This month</button>` : ''}
    <span style="flex:1"></span>
    <label class="fin-cur">Currency<select id="finCurrency">${FIN_CURRENCIES.map(([c, s]) => `<option value="${c}" ${c === L.currency ? 'selected' : ''}>${c} (${s})</option>`).join('')}</select></label>
  </div>
  <div class="grid-cards small">
    ${stat('Income', fmtFin(tot.income), list.filter(x => x.type === 'income').length + ' entries')}
    ${stat('Expenses', fmtFin(tot.expense), exp.length + ' entries')}
    ${stat('Net', fmtFin(tot.net), '', tot.net >= 0 ? 'oklch(0.45 0.13 150)' : 'oklch(0.55 0.17 25)')}
    ${stat('Budget used', budTotal ? Math.round(tot.expense / budTotal * 100) + '%' : '\u2014', budTotal ? `${fmtFin(tot.expense)} of ${fmtFin(budTotal)}` : 'No budgets set yet', budTotal && tot.expense > budTotal ? C_OUT : '')}
  </div>
  <div class="fin-grid">
    <div class="card">
      <div class="pf-h">Add income or expense</div>
      <div class="fin-form">
        <div class="span2"><div class="seg">${['expense', 'income'].map(k => `<button class="${e.type === k ? 'on' : ''}" data-action="xf-fin-type" data-key="${k}">${cap(k)}</button>`).join('')}</div></div>
        <label class="field">Amount (${esc(finSym())})<input id="finAmount" type="number" min="0" step="any" inputmode="decimal" value="${esc(e.amount)}"></label>
        <label class="field">Date<input id="finDate" type="date" value="${esc(e.date)}"></label>
        <label class="field">Category<select id="finCat">${cats.map(c => `<option ${c === e.category ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
        <label class="field">Project<select id="finProject">${projects.map(c => `<option ${c === e.project ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
        <label class="field span2">Note <input id="finNote" maxlength="120" value="${esc(e.note)}" placeholder="Optional"></label>
        <div class="span2" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn-primary" data-action="xf-fin-add">Add ${e.type}</button>${FX.finMsg ? `<span class="gate-error">${esc(FX.finMsg)}</span>` : ''}</div>
      </div>
    </div>
    <div class="card">
      <div class="pf-h">Spending by category</div>
      ${exp.length ? donutSvg(Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ label: k, value: v, fmt: fmtFin(v) })), 150, fmtFin(tot.expense)) : `<div class="pf-note">No expenses in ${monthLabel(ym)}.</div>`}
    </div>
  </div>
  <div class="card" style="margin-bottom:16px">
    <div class="pf-h">Budget vs actual <span>monthly</span></div>
    <div class="pf-note">Set a monthly budget per category. The bar turns red when spending goes over.</div>
    <div class="list-col tighter">${L.cats.expense.map(c => budRow(c, byCat[c] || 0, +L.budgets[c] || 0)).join('')}</div>
  </div>
  <div class="fin-grid">
    <div class="card">
      <div class="pf-h">By project</div>
      ${Object.keys(byProj).length ? `<div class="rp-wrap"><table class="rp-table"><thead><tr><th>Project</th><th class="num">In</th><th class="num">Out</th><th class="num">Net</th></tr></thead><tbody>
        ${Object.entries(byProj).sort((a, b) => (b[1].i + b[1].x) - (a[1].i + a[1].x)).map(([k, v]) => `<tr><td>${esc(k)}</td><td class="num">${fmtFin(v.i)}</td><td class="num">${fmtFin(v.x)}</td><td class="num" style="color:${v.i - v.x >= 0 ? 'oklch(0.45 0.13 150)' : 'oklch(0.55 0.17 25)'}">${fmtFin(v.i - v.x)}</td></tr>`).join('')}
      </tbody></table></div>` : `<div class="pf-note">Link entries to a project to see where money goes.</div>`}
    </div>
    <div class="card">
      <div class="pf-h">Last 6 months</div>
      ${colsHtml(months.map(m => { const [a, b] = monthRange(m), tt = totals(entriesIn(a, b)); return { label: monthLabel(m, true), values: [tt.income, tt.expense] }; }), [{ label: 'Income', color: C_IN }, { label: 'Expenses', color: C_OUT }])}
    </div>
  </div>
  <div class="card" style="margin-bottom:16px">
    <div class="pf-h">Entries <span>${list.length}</span></div>
    ${list.length ? `<div class="list-col tighter">${list.map(x => `<div class="fin-row">
      <span class="rp-meta">${esc(fmtDate(x.date))}</span>
      <span><b style="font-weight:600">${esc(x.category)}</b> <span class="rp-meta">\u00b7 ${esc(x.project || 'Studio')}${x.note ? ' \u00b7 ' + esc(x.note) : ''}</span></span>
      <b class="fin-amt ${x.type === 'income' ? 'in' : 'out'}">${x.type === 'income' ? '+' : '\u2212'}${fmtFin(x.amount)}</b>
      <button class="pillar-mini danger" data-action="xf-fin-del" data-id="${x.id}" aria-label="Delete entry">\u00d7</button>
    </div>`).join('')}</div>` : `<div class="pf-note" style="margin:0">Nothing recorded for ${monthLabel(ym)} yet.</div>`}
  </div>
  <div class="card">
    <div class="pf-h">Categories</div>
    <div class="pf-note" style="margin:0 0 8px">Income</div>${chips('income')}
    <div class="pf-note" style="margin:14px 0 8px">Expenses</div>${chips('expense')}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
      <select id="catKind" class="xf-input"><option value="expense">Expense</option><option value="income">Income</option></select>
      <input id="catNew" class="xf-input" maxlength="40" placeholder="New category" style="flex:1;min-width:160px">
      <button class="ghost-btn" data-action="xf-cat-add">Add category</button>
    </div>
  </div>
  <div class="pf-note" style="margin-top:14px">Recurring costs in Studio Costs and each universe\u2019s Financials (USD) are kept as they are. This ledger records actual money in and out.</div>
  </div>`;
}

/* ---------- Reports ---------- */
const REPORT_BLOCKS = [['summary', 'Headline progress rings'], ['bars', 'Progress by area (bar chart)'], ['status', 'Status breakdown (pie charts)'],
  ['universes', 'Universe breakdown table'], ['finance', 'Finance: income vs expenses by month'], ['categories', 'Finance: spending by category'],
  ['budget', 'Finance: budget vs actual'], ['projects', 'Finance: by project'], ['goals', 'Goals & deadlines'], ['achievements', 'Achievements in range'],
  ['outstanding', 'Outstanding & delayed items'], ['notes', 'Meeting notes']];
function newReportDraft() {
  const t = isoToday(), f = shiftMonth(t.slice(0, 7), -2) + '-01';
  return { name: 'Studio progress \u2013 ' + monthLabel(t.slice(0, 7)), from: f, to: t, areas: { all: true }, blocks: { summary: true, bars: true, status: true, universes: true, finance: true, categories: true, goals: true, achievements: true, outstanding: true, notes: true }, notes: '' };
}
function readReportInputs() {
  const d = FX.reportDraft; if (!d) return;
  const g = id => ROOT.querySelector('#' + id);
  if (g('rpName')) d.name = g('rpName').value; if (g('rpFrom')) d.from = g('rpFrom').value; if (g('rpTo')) d.to = g('rpTo').value; if (g('rpNotes')) d.notes = g('rpNotes').value;
}
function reportKeys(cfg) { const all = REPORT_AREAS.map(a => a[0]); return cfg.areas.all ? all : all.filter(k => cfg.areas[k]); }
function monthsBetween(from, to) {
  const end = (to || isoToday()).slice(0, 7);
  let start = from ? from.slice(0, 7) : (state.ledger.entries.map(e => e.date).sort()[0] || shiftMonth(end, -5) + '-01').slice(0, 7);
  const out = []; let m = start; while (m <= end && out.length < 36) { out.push(m); m = shiftMonth(m, 1); }
  return out.slice(-12);
}
function reportDocHtml(cfg) {
  const keys = reportKeys(cfg), B = cfg.blocks, p = P() || { name: '' };
  const prog = keys.filter(k => PROGRESS_AREAS.includes(k)).map(k => Object.assign({ key: k, label: areaLabel(k) }, areaStats(k, cfg.from, cfg.to))).filter(s => s.total > 0);
  const dSum = prog.reduce((a, s) => a + s.done, 0), tSum = prog.reduce((a, s) => a + s.total, 0);
  const sec = (title, body) => `<section class="rp-sec"><h2>${esc(title)}</h2>${body}</section>`;
  let out = `<div class="rp-doc">
    <div class="rp-head">
      <div><div class="rp-brand"><img src="assets/xenwinx-logo.png" alt="">Xenwinx Studio</div><div class="rp-title">${esc(cfg.name || 'Report')}</div><div class="rp-meta">${esc(rangeLabel(cfg.from, cfg.to))}</div></div>
      <div class="rp-meta" style="text-align:right">Prepared by ${esc(p.name)}<br>${esc(new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }))}</div>
    </div>`;
  if (B.summary && prog.length) out += sec('Where things stand', `<div class="rp-rings">
      <div class="rp-ring rp-ring-main">${ringSvg(tSum ? dSum / tSum * 100 : 0, 96)}<b>Overall</b><span>${dSum} of ${tSum} items done</span></div>
      ${prog.map(s => `<div class="rp-ring">${ringSvg(s.pct)}<b>${esc(s.label)}</b><span>${s.done} of ${s.total}</span></div>`).join('')}</div>`);
  if (B.bars && prog.length) out += sec('Progress by area', hbarsHtml(prog.map(s => ({ label: s.label, value: s.pct, max: 100, fmt: `${Math.round(s.pct)}%  \u00b7  ${s.done}/${s.total}` }))));
  if (B.status && prog.length) out += sec('Status breakdown', `<div class="rp-pies">${prog.map(s => `<div class="rp-pie"><h3>${esc(s.label)}</h3>${donutSvg(Object.entries(s.statuses).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ label: cap(k), value: v })), 112, s.total + '')}</div>`).join('')}</div>`);
  const uAreas = prog.filter(s => PER_UNIVERSE_AREAS.includes(s.key));
  if (B.universes && uAreas.length) {
    const rows = uOrder().map(id => state.universes[id].short);
    out += sec('By universe', `<div class="rp-wrap"><table class="rp-table"><thead><tr><th>Universe</th>${uAreas.map(s => `<th class="num">${esc(s.label)}</th>`).join('')}</tr></thead><tbody>
      ${rows.map(u => `<tr><td>${esc(u)}</td>${uAreas.map(s => { const x = s.per.find(r => r.label === u); return `<td class="num">${x ? `${Math.round(x.done / x.total * 100)}% <span class="opt">${x.done}/${x.total}</span>` : '<span class="opt">\u2014</span>'}</td>`; }).join('')}</tr>`).join('')}
    </tbody></table></div>`);
  }
  if (keys.includes('finance') && (B.finance || B.categories || B.budget || B.projects)) {
    const list = entriesIn(cfg.from, cfg.to), tt = totals(list), exp = list.filter(e => e.type === 'expense');
    const months = monthsBetween(cfg.from, cfg.to);
    let body = `<div class="rp-stats"><div class="rp-stat"><span>Income</span><b>${fmtFin(tt.income)}</b></div><div class="rp-stat"><span>Expenses</span><b>${fmtFin(tt.expense)}</b></div><div class="rp-stat"><span>Net</span><b style="color:${tt.net >= 0 ? 'oklch(0.45 0.13 150)' : 'oklch(0.55 0.17 25)'}">${fmtFin(tt.net)}</b></div><div class="rp-stat"><span>Entries</span><b>${list.length}</b></div></div>`;
    if (B.finance) body += `<h3 class="rp-h3">Income vs expenses by month</h3>` + colsHtml(months.map(m => { const [a, b] = monthRange(m), x = totals(list.filter(e => e.date >= a && e.date <= b)); return { label: monthLabel(m, true), values: [x.income, x.expense] }; }), [{ label: 'Income', color: C_IN }, { label: 'Expenses', color: C_OUT }]);
    if (B.categories && exp.length) body += `<h3 class="rp-h3">Spending by category</h3>` + donutSvg(Object.entries(sumBy(exp, 'category')).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ label: k, value: v, fmt: fmtFin(v) })), 150, fmtFin(tt.expense));
    if (B.budget && Object.keys(state.ledger.budgets).length) {
      const n = months.length || 1, by = sumBy(exp, 'category');
      body += `<h3 class="rp-h3">Budget vs actual <span class="opt">${n} month${n === 1 ? '' : 's'}</span></h3>` + hbarsHtml(Object.entries(state.ledger.budgets).map(([c, b]) => { const a = by[c] || 0, bb = b * n; return { label: c, value: a, max: Math.max(bb, a), fmt: `${fmtFin(a)} / ${fmtFin(bb)}`, color: a > bb ? C_OUT : 'var(--u-accent)' }; }));
    }
    if (B.projects && list.length) {
      const bp = {}; list.forEach(x => { const q = bp[x.project || 'Studio'] = bp[x.project || 'Studio'] || { i: 0, x: 0 }; if (x.type === 'income') q.i += x.amount; else q.x += x.amount; });
      body += `<h3 class="rp-h3">By project</h3><div class="rp-wrap"><table class="rp-table"><thead><tr><th>Project</th><th class="num">In</th><th class="num">Out</th><th class="num">Net</th></tr></thead><tbody>${Object.entries(bp).map(([k, v]) => `<tr><td>${esc(k)}</td><td class="num">${fmtFin(v.i)}</td><td class="num">${fmtFin(v.x)}</td><td class="num">${fmtFin(v.i - v.x)}</td></tr>`).join('')}</tbody></table></div>`;
    }
    out += sec('Finance', body);
  }
  if (B.goals && keys.includes('goals')) {
    const gl = state.goals.filter(g => !g.targetDate || ((!cfg.from || g.targetDate >= cfg.from) && (!cfg.to || g.targetDate <= cfg.to))).sort((a, b) => (a.targetDate || '9').localeCompare(b.targetDate || '9'));
    if (gl.length) out += sec('Goals & deadlines', `<div class="rp-list-items">${gl.map(g => `<div class="rp-li"><span>${esc(g.text)} <span class="opt">\u00b7 ${esc(g.pillar)}</span></span><span class="rp-meta">${esc(g.targetDate ? fmtDate(g.targetDate) : 'No date')}</span>${badgeHtml(statusMeta(g.status), 'xs')}</div>`).join('')}</div>`);
  }
  if (B.achievements && keys.includes('achievements')) {
    const al = state.achievements.filter(a => (!cfg.from || (a.date || '') >= cfg.from) && (!cfg.to || (a.date || '') <= cfg.to)).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    out += sec(`Achievements (${al.length})`, al.length ? `<div class="rp-list-items">${al.map(a => `<div class="rp-li"><span>${esc(a.text)} <span class="opt">\u00b7 ${esc(a.pillar)}</span></span><span class="rp-meta">${esc(fmtDate(a.date))}</span></div>`).join('')}</div>` : `<div class="rp-meta">No wins logged in this period.</div>`);
  }
  if (B.outstanding) { const o = outstandingItems(); if (o.length) out += sec('Outstanding & delayed', `<div class="rp-list-items">${o.map(x => `<div class="rp-li"><span>${esc(x.text)}</span><span class="rp-meta">${esc(x.pillar)}</span></div>`).join('')}</div>`); }
  if (B.notes && (cfg.notes || '').trim()) out += sec('Notes', `<div class="rp-notes">${esc(cfg.notes.trim()).replace(/\n/g, '<br>')}</div>`);
  if (!prog.length && !keys.includes('finance') && !keys.includes('achievements')) out += `<div class="rp-meta">No data recorded for the chosen areas yet.</div>`;
  return out + `<div class="rp-foot">Generated by the Xenwinx Studio Dashboard \u00b7 ${esc(new Date().toLocaleString())}</div></div>`;
}
function renderReportBuilder() {
  const d = FX.reportDraft, all = !!d.areas.all;
  const chk = (on, act, key, label) => `<button class="rp-check${on ? ' on' : ''}" data-action="${act}" data-key="${key}"><span class="rp-box">${on ? '\u2713' : ''}</span>${esc(label)}</button>`;
  return `<div class="view">${overviewHead()}
  <div class="rp-builder">
    <div class="card">
      <div class="pf-h">${d.id ? 'Edit report' : 'New report'}</div>
      <label class="field">Report name<input id="rpName" maxlength="90" value="${esc(d.name)}"></label>
      <div class="fin-form">
        <label class="field">From<input id="rpFrom" type="date" value="${esc(d.from)}"></label>
        <label class="field">To<input id="rpTo" type="date" value="${esc(d.to)}"></label>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin:12px 0 14px">${[['month', 'This month'], ['q', 'Last 3 months'], ['year', 'This year'], ['all', 'All time']].map(([k, l]) => `<button class="chip" data-action="xf-rp-range" data-key="${k}">${l}</button>`).join('')}</div>
      <label class="field" style="margin:0">Meeting notes <span class="opt">optional, printed at the end</span><textarea id="rpNotes" rows="4">${esc(d.notes)}</textarea></label>
    </div>
    <div class="card">
      <div class="pf-h">Areas</div>
      <div class="rp-checks">${chk(all, 'xf-rp-area', 'all', 'Everything (studio-wide)')}${REPORT_AREAS.map(([k, l]) => chk(all || d.areas[k], 'xf-rp-area', k, l)).join('')}</div>
    </div>
  </div>
  <div class="card" style="margin-top:16px">
    <div class="pf-h">Charts &amp; sections</div>
    <div class="rp-checks">${REPORT_BLOCKS.map(([k, l]) => chk(!!d.blocks[k], 'xf-rp-block', k, l)).join('')}</div>
  </div>
  <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap"><button class="btn-primary" data-action="xf-rp-generate">${d.id ? 'Update report' : 'Generate &amp; save report'}</button><button class="ghost-btn" data-action="xf-rp-cancel">Cancel</button></div>
  </div>`;
}
function renderReportsTab() {
  if (FX.reportDraft) return renderReportBuilder();
  const r = FX.reportOpen && state.reports.find(x => x.id === FX.reportOpen);
  if (r) return `<div class="view">${overviewHead()}
    <div class="rp-toolbar">
      <button class="back-btn" data-action="xf-rp-close">\u2190 All reports</button><span style="flex:1"></span>
      <button class="ghost-btn" data-action="xf-rp-regen" data-id="${r.id}">Refresh with today\u2019s data</button>
      <button class="ghost-btn" data-action="xf-rp-edit" data-id="${r.id}">Edit</button>
      <button class="btn-primary" data-action="xf-rp-pdf" data-id="${r.id}">${FX.pdfBusy ? 'Preparing PDF\u2026' : 'Download PDF'}</button>
      <button class="danger-btn" data-action="xf-rp-delete" data-id="${r.id}">Delete</button>
    </div>
    <div class="rp-meta" style="margin-bottom:12px">Saved ${esc(new Date(r.createdAt).toLocaleString())}. The figures are a snapshot from that moment.</div>
    <div class="rp-wrap">${r.html}</div></div>`;
  return `<div class="view">${overviewHead()}
    ${state.reports.length ? `<div class="rp-list">${state.reports.map(x => `<button class="card rp-card" data-action="xf-rp-open" data-id="${x.id}">
      <span class="pf-h" style="margin:0">${esc(x.name)}</span>
      <span class="rp-meta">${esc(rangeLabel(x.from, x.to))}</span>
      <span class="rp-meta">${x.areas.all ? 'Everything' : reportKeys(x).map(areaLabel).join(', ')}</span>
      <span class="rp-meta">Saved ${esc(new Date(x.createdAt).toLocaleDateString())}</span>
    </button>`).join('')}</div>` : `<div class="card rp-empty">
      <div class="pf-h" style="justify-content:center">No reports yet</div>
      <div class="pf-note">Pick the areas, a date range and the charts you want, then download it as a PDF for your meeting.</div>
      <div><button class="btn-primary" data-action="xf-report-new">+ Create report</button></div>
    </div>`}</div>`;
}
async function exportReportPdf(r) {
  const fname = slugName(r.name) + '.pdf';
  const holder = document.createElement('div'); holder.id = 'xwPrint'; holder.innerHTML = r.html; document.body.appendChild(holder);
  const html = document.documentElement;
  try {
    if (window.xwNative && window.xwNative.savePdf) { html.classList.add('xw-print'); await window.xwNative.savePdf(fname); return; }
    if (isNative()) {
      await loadScriptOnce('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
      await loadScriptOnce('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
      holder.style.cssText = 'display:block;position:fixed;left:-10000px;top:0;width:820px';
      const doc = holder.firstElementChild;
      const canvas = await window.html2canvas(doc, { scale: 2, backgroundColor: getComputedStyle(doc).backgroundColor || '#fff', useCORS: true });
      const pdf = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
      const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight(), ih = canvas.height * pw / canvas.width;
      const img = canvas.toDataURL('image/jpeg', 0.92);
      for (let y = 0; y < ih; y += ph) { if (y > 0) pdf.addPage(); pdf.addImage(img, 'JPEG', 0, -y, pw, ih); }
      await saveBlob(fname, pdf.output('blob'));
      return;
    }
    html.classList.add('xw-print');
    await new Promise(res => setTimeout(res, 80));
    window.print();
  } catch (e) { alert('Could not create the PDF: ' + e.message); }
  finally { html.classList.remove('xw-print'); holder.remove(); }
}

/* ---------- Cloud (Supabase, per-profile email + password) ---------- */
const CLOUD_KEY = 'xenwinx-cloud';
const SYNC_UI = { activeView: 1, activeUniverse: 1, universeOpen: 1, ovTab: 1, finMonth: 1, scheduleAnchor: 1, notesFilter: 1 };
function cloudCfg() {
  const w = window.XW_CONFIG || {}; let l = {};
  try { l = JSON.parse(localStorage.getItem(CLOUD_KEY) || '{}'); } catch (e) { /* none */ }
  return { url: String(w.supabaseUrl || l.url || '').trim().replace(/\/+$/, ''), key: String(w.supabaseAnonKey || l.key || '').trim(), fixed: !!(w.supabaseUrl && w.supabaseAnonKey) };
}
async function sbFetch(path, opts, token) {
  const cfg = cloudCfg(); opts = opts || {};
  const r = await fetch(cfg.url + path, Object.assign({}, opts, { headers: Object.assign({ apikey: cfg.key, Authorization: 'Bearer ' + (token || cfg.key), 'Content-Type': 'application/json' }, opts.headers || {}) }));
  const txt = await r.text(); let j = null; try { j = txt ? JSON.parse(txt) : null; } catch (e) { /* not json */ }
  if (!r.ok) throw new Error((j && (j.msg || j.message || j.error_description || j.error)) || ('Cloud error ' + r.status));
  return j;
}
function setSession(c, j) { c.access = j.access_token; c.refresh = j.refresh_token; c.exp = Date.now() + (j.expires_in || 3600) * 1000; if (j.user) { c.userId = j.user.id; c.email = j.user.email || c.email; } }
async function sbToken(p) {
  const c = p.cloud; if (!c || !c.refresh) return null;
  if (!c.access || Date.now() > (c.exp || 0) - 60000) { setSession(c, await sbFetch('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: c.refresh }) })); saveReg(); }
  return c.access;
}
function profileMeta(p) { const o = {}; ['id', 'name', 'avatar', 'avatarData', 'theme', 'hidden', 'pin', 'recQ', 'recA', 'universeTint', 'createdAt'].forEach(k => { o[k] = p[k]; }); return o; }
function applyMeta(p, m) { ['name', 'avatar', 'avatarData', 'theme', 'hidden', 'pin', 'recQ', 'recA', 'universeTint'].forEach(k => { if (m && m[k] !== undefined) p[k] = m[k]; }); }
function contentHash() {
  const o = {}; Object.keys(state).forEach(k => { if (!NO_PERSIST[k] && !SYNC_UI[k]) o[k] = state[k]; });
  const p = P(); return strHash(JSON.stringify(o) + (p ? JSON.stringify(profileMeta(p)) : ''));
}
function cloudNoteChange() {
  const p = P(); if (!p) return;
  const h = contentHash();
  if (FX.hashFor !== p.id) { FX.hashFor = p.id; FX.lastHash = h; return; }
  if (h === FX.lastHash) return;
  FX.lastHash = h; p.updatedAt = Date.now(); saveReg(); schedulePush();
}
function linked(p) { return SYNC_ENABLED && p && p.cloud && p.cloud.refresh; }
function schedulePush() { const p = P(); if (!linked(p)) return; clearTimeout(FX.pushTimer); FX.pushTimer = setTimeout(() => { FX.pushTimer = null; cloudPush(P()); }, 3000); }
async function remoteStamp(p, tok) { const rows = await sbFetch(`/rest/v1/xw_profiles?user_id=eq.${p.cloud.userId}&select=updated_at`, {}, tok); return rows && rows[0] ? +rows[0].updated_at || 0 : 0; }
async function cloudPush(p, snap, force) {
  if (!linked(p) || !navigator.onLine) return;
  try {
    const tok = await sbToken(p);
    const remote = await remoteStamp(p, tok);
    if (!force && remote > (p.updatedAt || 0)) { if (ACTIVE === p.id) return cloudPull(); return; }
    if (!force && remote === (p.updatedAt || 0)) { p.cloud.lastSync = Date.now(); p.cloud.error = ''; saveReg(); cloudStatusRefresh(); return; }
    const data = snap ? JSON.parse(snap) : JSON.parse(stateSnapshot(false));
    await sbFetch('/rest/v1/xw_profiles?on_conflict=user_id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ user_id: p.cloud.userId, profile: profileMeta(p), data, updated_at: p.updatedAt || Date.now() }) }, tok);
    p.cloud.lastSync = Date.now(); p.cloud.error = ''; saveReg();
  } catch (e) { if (p.cloud) { p.cloud.error = e.message; saveReg(); } }
  cloudStatusRefresh();
}
async function cloudPull() {
  const p = P(); if (!linked(p) || FX.pulling || !navigator.onLine || state.modal) return;
  FX.pulling = true;
  try {
    const tok = await sbToken(p), remote = await remoteStamp(p, tok);
    if (remote > (p.updatedAt || 0)) {
      const rows = await sbFetch(`/rest/v1/xw_profiles?user_id=eq.${p.cloud.userId}&select=*`, {}, tok);
      if (rows && rows[0] && ACTIVE === p.id) applyRemote(p, rows[0]);
    } else if ((p.updatedAt || 0) > remote) { FX.pulling = false; return cloudPush(p, null, true); }
    p.cloud.lastSync = Date.now(); p.cloud.error = ''; saveReg();
  } catch (e) { if (p.cloud) { p.cloud.error = e.message; saveReg(); } }
  FX.pulling = false; cloudStatusRefresh();
}
function applyRemote(p, row) {
  clearTimeout(saveTimer);
  applyMeta(p, row.profile || {});
  try { localStorage.setItem(profileKey(p.id), JSON.stringify(row.data || {})); } catch (e) { console.warn('Xenwinx: could not store synced data.', e); }
  const view = state.activeView, uni = state.activeUniverse;
  loadState(p.id); state.activeView = view; state.activeUniverse = state.universes[uni] ? uni : state.activeUniverse; state.history = []; state.modal = null;
  p.updatedAt = +row.updated_at || Date.now(); FX.hashFor = p.id; FX.lastHash = contentHash(); saveReg();
  applyTheme(p.theme); syncSettingsInputs(); applyAppearance(); applySkin(); keepScroll(render);
}
function cloudStatusText(p) {
  const c = p.cloud; if (!c || !c.refresh) return '';
  if (c.error) return `<span class="gate-error">Sync problem: ${esc(c.error)}</span>`;
  return `Synced as <b>${esc(c.email || '')}</b>${c.lastSync ? ' \u00b7 last checked ' + esc(new Date(c.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : ''}`;
}
function cloudStatusRefresh() { const p = P(), el = ROOT && ROOT.querySelector('#cloudStatus'); if (p && el) el.innerHTML = cloudStatusText(p); }
function refreshProfilePage() { if (state.activeView === 'profile') keepScroll(render); }
async function cloudLink(signup) {
  const p = P(); if (!p) return;
  const email = (ROOT.querySelector('#cloudEmail') || {}).value || '', pw = (ROOT.querySelector('#cloudPw') || {}).value || '';
  FX.cloudEmail = email.trim();
  if (!FX.cloudEmail || pw.length < 6) { FX.cloudMsg = 'Enter an email and a password of at least 6 characters.'; refreshProfilePage(); return; }
  FX.cloudBusy = true; FX.cloudMsg = ''; refreshProfilePage();
  try {
    const path = signup ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password';
    const j = await sbFetch(path, { method: 'POST', body: JSON.stringify({ email: FX.cloudEmail, password: pw }) });
    if (!j || !j.access_token) { FX.cloudMsg = 'Account created. Open the confirmation email from Supabase, then come back and sign in.'; return; }
    const other = REG.profiles.find(x => x.id !== p.id && x.cloud && x.cloud.userId === j.user.id);
    if (other) { FX.cloudMsg = `That account is already linked to \u201c${other.name}\u201d on this device. Each profile needs its own account.`; return; }
    p.cloud = { email: FX.cloudEmail }; setSession(p.cloud, j); saveReg();
    const remote = await remoteStamp(p, p.cloud.access);
    if (remote) { FX.linkChoice = remote; }
    else { p.updatedAt = p.updatedAt || Date.now(); await cloudPush(p, null, true); FX.cloudMsg = 'Connected. Changes now sync automatically.'; }
  } catch (e) { FX.cloudMsg = e.message; }
  finally { FX.cloudBusy = false; refreshProfilePage(); }
}
async function cloudGateSignIn() {
  const email = ((ROOT.querySelector('#gateCloudEmail') || {}).value || '').trim(), pw = (ROOT.querySelector('#gateCloudPw') || {}).value || '';
  FX.cloudEmail = email;
  if (!email || !pw) { GATE.error = 'Enter your email and password.'; renderGate(); return; }
  GATE.error = ''; FX.cloudBusy = true; renderGate();
  try {
    const j = await sbFetch('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password: pw }) });
    const rows = await sbFetch(`/rest/v1/xw_profiles?user_id=eq.${j.user.id}&select=*`, {}, j.access_token);
    let p = REG.profiles.find(x => x.cloud && x.cloud.userId === j.user.id);
    if (!p) {
      if (!rows || !rows[0]) { GATE.error = 'Nothing is synced to this account yet. Create a profile, then connect it in Profile & settings.'; return; }
      const m = rows[0].profile || {};
      p = { id: 'p' + uid(), name: m.name || 'Profile', avatar: m.avatar || AVATARS[0].id, avatarData: '', theme: m.theme || 'classic', hidden: {}, pin: '', recQ: '', recA: '', universeTint: false, createdAt: m.createdAt || Date.now() };
      REG.profiles.push(p);
    }
    p.cloud = Object.assign(p.cloud || {}, { email }); setSession(p.cloud, j);
    if (rows && rows[0] && (+rows[0].updated_at || 0) >= (p.updatedAt || 0)) {
      applyMeta(p, rows[0].profile || {});
      localStorage.setItem(profileKey(p.id), JSON.stringify(rows[0].data || {}));
      p.updatedAt = +rows[0].updated_at || Date.now();
    }
    p.cloud.lastSync = Date.now(); saveReg();
    FX.cloudBusy = false; enterProfile(p.id);
  } catch (e) { GATE.error = e.message; }
  finally { FX.cloudBusy = false; if (!ACTIVE) renderGate(); }
}
function gateCloudHtml() {
  return `<div class="gate"><div class="gate-inner gate-col gate-pin">
    <div><button class="back-btn" data-gate="login">\u2190 Back</button></div>
    <div class="card pin-card" style="align-items:stretch">
      <div><div class="pc-name">Sign in with a cloud account</div><div class="pf-note" style="margin:6px 0 0">Brings a synced profile onto this device. Each profile has its own account.</div></div>
      <label class="field" style="margin:0">Email<input id="gateCloudEmail" type="email" autocomplete="username" value="${esc(FX.cloudEmail || '')}"></label>
      <label class="field" style="margin:0">Password<input id="gateCloudPw" type="password" autocomplete="current-password"></label>
      ${GATE.error ? `<div class="gate-error">${esc(GATE.error)}</div>` : ''}
      <button class="btn-primary gate-btn" style="width:100%" data-gate="cloud-submit" ${FX.cloudBusy ? 'disabled' : ''}>${FX.cloudBusy ? 'Signing in\u2026' : 'Sign in'}</button>
    </div>
  </div></div>`;
}
function gateExtrasHtml() {
  const cloud = SYNC_ENABLED && cloudCfg().url;
  return `<div class="gate-extras">${cloud ? `<button class="gate-link" data-gate="cloud">Sign in with a cloud account</button>` : ''}
    <label class="gate-link">Import profile file<input type="file" accept=".json,application/json" data-xf-import style="display:none"></label></div>`;
}

/* ---------- Profile file export / import ---------- */
async function exportProfileFile() {
  const p = P(); if (!p) return;
  saveState();
  let data = {}; try { data = JSON.parse(localStorage.getItem(profileKey(p.id)) || '{}'); } catch (e) { /* empty */ }
  const body = JSON.stringify({ format: 'xenwinx-profile', version: 1, exportedAt: new Date().toISOString(), profile: profileMeta(p), data });
  await saveBlob(`${slugName(p.name)}-${isoToday()}.xenwinx.json`, new Blob([body], { type: 'application/json' }));
}
function importProfileFile(file) {
  if (!file) return;
  const fr = new FileReader();
  fr.onload = () => {
    try {
      const j = JSON.parse(fr.result);
      if (!j || j.format !== 'xenwinx-profile' || !j.profile) throw new Error('That isn\u2019t a Xenwinx profile file.');
      const m = j.profile;
      let name = String(m.name || 'Imported profile').slice(0, 40);
      if (REG.profiles.some(x => x.name === name)) name = (name.slice(0, 30) + ' (imported)');
      const p = { id: 'p' + uid(), name, avatar: m.avatar || AVATARS[0].id, avatarData: m.avatarData || '', theme: m.theme || 'classic', hidden: m.hidden || {},
        pin: m.pin || '', recQ: m.recQ || '', recA: m.recA || '', universeTint: !!m.universeTint, createdAt: m.createdAt || Date.now(), updatedAt: Date.now() };
      localStorage.setItem(profileKey(p.id), JSON.stringify(j.data || {}));
      REG.profiles.push(p); saveReg();
      GATE.notice = `\u201c${name}\u201d was imported${p.pin ? '. It uses the same PIN as before' : ''}.`;
    } catch (e) { GATE.notice = e.name === 'QuotaExceededError' ? 'Not enough storage on this device for that profile.' : (e.message || 'Could not read that file.'); }
    GATE.screen = 'login'; GATE.manage = false; renderGate();
  };
  fr.readAsText(file);
}

/* ---------- Profile & settings cards ---------- */
function featureProfileCards(p) {
  const cfg = cloudCfg(), c = p.cloud;
  const cfgForm = `<div class="fin-form">
      <label class="field span2">Supabase project URL<input id="cloudUrl" placeholder="https://xxxx.supabase.co" value="${esc(cfg.url)}"></label>
      <label class="field span2">Anon (public) key<input id="cloudKey" value="${esc(cfg.key)}" autocomplete="off"></label>
      <div class="span2" style="display:flex;gap:8px"><button class="ghost-btn" data-action="xf-cloud-cfg">Save connection</button>${cfg.url ? `<button class="ghost-btn" data-action="xf-cloud-cfg-cancel">Cancel</button>` : ''}</div>
    </div>`;
  let conn = cfg.url && !FX.cfgEdit
    ? `<div class="pf-note" style="margin:0 0 14px">Connected to <b>${esc(cfg.url.replace(/^https?:\/\//, ''))}</b>${cfg.fixed ? '' : ` \u00b7 <button class="gate-link" style="padding:0" data-action="xf-cloud-cfg-edit">Change</button>`}</div>`
    : `<div class="pf-note">Paste the URL and anon key from your Supabase project (Settings \u2192 API). This is saved on this device for every profile.</div>${cfgForm}`;
  let sync = '';
  if (!cfg.url) sync = '';
  else if (FX.linkChoice) sync = `<div class="del-box" style="border-color:var(--t-line-2);background:var(--t-surface-2)">
      <div><b>This account already has a synced dashboard</b> (last changed ${esc(new Date(FX.linkChoice).toLocaleString())}). Which one should be kept?</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn-primary" data-action="xf-cloud-keep" data-key="local">Keep this device\u2019s data</button><button class="ghost-btn" data-action="xf-cloud-keep" data-key="cloud">Use the cloud copy</button></div></div>`;
  else if (c && c.refresh) sync = `<div class="pf-note" id="cloudStatus" style="margin:0 0 12px">${cloudStatusText(p)}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="ghost-btn" data-action="xf-cloud-sync">Sync now</button><button class="ghost-btn" data-action="xf-cloud-out">Disconnect</button></div>`;
  else sync = `<div class="pf-note">Sign in so this profile syncs live between your phone and the web app. Each profile uses its own account.</div>
      <div class="fin-form">
        <label class="field">Email<input id="cloudEmail" type="email" autocomplete="username" value="${esc(FX.cloudEmail || '')}"></label>
        <label class="field">Password<input id="cloudPw" type="password" autocomplete="current-password"></label>
        <div class="span2" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn-primary" data-action="xf-cloud-in" ${FX.cloudBusy ? 'disabled' : ''}>${FX.cloudBusy ? 'Connecting\u2026' : 'Sign in'}</button><button class="ghost-btn" data-action="xf-cloud-up" ${FX.cloudBusy ? 'disabled' : ''}>Create account</button></div>
      </div>`;
  const fileCard = `<div class="card">
      <div class="pf-h">Profile file</div>
      <div class="pf-note">Download everything in this profile as one file, to move it to another device or keep a backup. Import it from the log-in screen.${SYNC_ENABLED ? '' : ' Sync runs in the phone and web app, so use this to move a desktop profile there.'}</div>
      <button class="ghost-btn" data-action="xf-export-profile">Export profile file</button>
    </div>`;
  if (!SYNC_ENABLED) return fileCard;
  return `<div class="card">
      <div class="pf-h">Cloud sync <span>${c && c.refresh ? 'sync on' : 'sync off'}</span></div>
      ${conn}${sync}
      ${FX.cloudMsg ? `<div class="pf-note" style="margin:12px 0 0">${esc(FX.cloudMsg)}</div>` : ''}
    </div>
    ${fileCard}`;
}

/* ---------- actions & wiring ---------- */
function handleFeatureAction(t, action) {
  const id = t.dataset.id, key = t.dataset.key, app = ROOT.querySelector('.app');
  switch (action) {
    case 'xf-nav': if (app) app.classList.toggle('nav-open'); return;
    case 'xf-nav-close': if (app) app.classList.remove('nav-open'); return;
    case 'xf-ovtab': state.ovTab = key; FX.reportOpen = null; FX.reportDraft = null; render(); return;
    case 'xf-report-new': state.ovTab = 'reports'; FX.reportOpen = null; FX.reportDraft = newReportDraft(); if (state.activeView !== 'overview') navigateTo('overview'); else render(); return;
    case 'xf-fin-month': readEntryForm(); state.finMonth = key === '0' ? '' : shiftMonth(finMonth(), +key); keepScroll(render); return;
    case 'xf-fin-type': readEntryForm(); FX.entry.type = key; FX.entry.category = ''; keepScroll(render); return;
    case 'xf-fin-add': addEntry(); return;
    case 'xf-fin-del': state.ledger.entries = state.ledger.entries.filter(e => e.id !== id); keepScroll(render); return;
    case 'xf-cat-del': { const list = state.ledger.cats[key]; if (list.length <= 1) return; state.ledger.cats[key] = list.filter(c => c !== t.dataset.name); delete state.ledger.budgets[t.dataset.name]; keepScroll(render); return; }
    case 'xf-cat-add': { readEntryForm(); const k = ROOT.querySelector('#catKind').value, v = ROOT.querySelector('#catNew').value.trim(); if (v && !state.ledger.cats[k].includes(v)) state.ledger.cats[k].push(v); keepScroll(render); return; }
    case 'xf-rp-range': { readReportInputs(); const d = FX.reportDraft, td = isoToday(), ym = td.slice(0, 7); d.to = td;
      d.from = key === 'month' ? ym + '-01' : key === 'q' ? shiftMonth(ym, -2) + '-01' : key === 'year' ? td.slice(0, 4) + '-01-01' : '';
      if (key === 'all') d.to = ''; keepScroll(render); return; }
    case 'xf-rp-area': { readReportInputs(); const a = FX.reportDraft.areas;
      if (key === 'all') { FX.reportDraft.areas = a.all ? {} : { all: true }; }
      else { if (a.all) { REPORT_AREAS.forEach(([k]) => { a[k] = true; }); delete a.all; } a[key] = !a[key]; if (REPORT_AREAS.every(([k]) => a[k])) FX.reportDraft.areas = { all: true }; }
      keepScroll(render); return; }
    case 'xf-rp-block': readReportInputs(); FX.reportDraft.blocks[key] = !FX.reportDraft.blocks[key]; keepScroll(render); return;
    case 'xf-rp-cancel': FX.reportDraft = null; render(); return;
    case 'xf-rp-generate': {
      readReportInputs(); const d = FX.reportDraft;
      if (!reportKeys(d).length) { alert('Choose at least one area.'); return; }
      if (d.from && d.to && d.from > d.to) { alert('The start date is after the end date.'); return; }
      const cfg = { name: (d.name || '').trim() || 'Report', from: d.from, to: d.to, areas: d.areas, blocks: d.blocks, notes: d.notes };
      const html = reportDocHtml(cfg);
      if (d.id) { const r = state.reports.find(x => x.id === d.id); Object.assign(r, cfg, { html, createdAt: Date.now() }); FX.reportOpen = r.id; }
      else { const r = Object.assign({ id: uid(), createdAt: Date.now(), html }, cfg); state.reports.unshift(r); FX.reportOpen = r.id; }
      FX.reportDraft = null; render(); return;
    }
    case 'xf-rp-open': FX.reportOpen = id; render(); return;
    case 'xf-rp-close': FX.reportOpen = null; render(); return;
    case 'xf-rp-edit': { const r = state.reports.find(x => x.id === id); if (!r) return; FX.reportDraft = JSON.parse(JSON.stringify({ id: r.id, name: r.name, from: r.from, to: r.to, areas: r.areas, blocks: r.blocks, notes: r.notes || '' })); FX.reportOpen = null; render(); return; }
    case 'xf-rp-regen': { const r = state.reports.find(x => x.id === id); if (!r) return; r.html = reportDocHtml(r); r.createdAt = Date.now(); keepScroll(render); return; }
    case 'xf-rp-delete': { const r = state.reports.find(x => x.id === id); if (!r || !confirm(`Delete the report \u201c${r.name}\u201d?`)) return; state.reports = state.reports.filter(x => x.id !== id); FX.reportOpen = null; render(); return; }
    case 'xf-rp-pdf': { const r = state.reports.find(x => x.id === id); if (!r || FX.pdfBusy) return; FX.pdfBusy = true; keepScroll(render); exportReportPdf(r).finally(() => { FX.pdfBusy = false; keepScroll(render); }); return; }
    case 'xf-export-profile': exportProfileFile(); return;
    case 'xf-cloud-cfg': {
      const url = ROOT.querySelector('#cloudUrl').value.trim(), k = ROOT.querySelector('#cloudKey').value.trim();
      if (url && !/^https:\/\//.test(url)) { FX.cloudMsg = 'The project URL should start with https://'; refreshProfilePage(); return; }
      try { localStorage.setItem(CLOUD_KEY, JSON.stringify({ url, key: k })); } catch (e) { /* ignore */ }
      FX.cfgEdit = false; FX.cloudMsg = url ? 'Connection saved.' : ''; refreshProfilePage(); return;
    }
    case 'xf-cloud-cfg-edit': FX.cfgEdit = true; refreshProfilePage(); return;
    case 'xf-cloud-cfg-cancel': FX.cfgEdit = false; refreshProfilePage(); return;
    case 'xf-cloud-in': cloudLink(false); return;
    case 'xf-cloud-up': cloudLink(true); return;
    case 'xf-cloud-sync': { const p = P(); FX.cloudMsg = ''; cloudPull(); return; }
    case 'xf-cloud-out': { const p = P(); if (p) { delete p.cloud; saveReg(); } FX.cloudMsg = 'Disconnected. Data stays on this device and in the cloud.'; refreshProfilePage(); return; }
    case 'xf-cloud-keep': {
      const p = P(); const keepLocal = key === 'local'; FX.linkChoice = 0;
      if (keepLocal) { p.updatedAt = Date.now(); saveReg(); cloudPush(p, null, true).then(() => { FX.cloudMsg = 'Connected. This device\u2019s data is now in the cloud.'; refreshProfilePage(); }); }
      else { p.updatedAt = 0; saveReg(); cloudPull().then(() => { FX.cloudMsg = 'Connected. Loaded the cloud copy.'; refreshProfilePage(); }); }
      refreshProfilePage(); return;
    }
  }
}
function featuresAfterRender() {
  const app = ROOT.querySelector('.app');
  if (app && FX.lastView !== state.activeView) app.classList.remove('nav-open');
  FX.lastView = state.activeView;
}
function featuresOnEnter() { FX.reportOpen = null; FX.reportDraft = null; FX.entry = null; FX.cloudMsg = ''; FX.linkChoice = 0; cloudPull(); }
function featuresOnLeave() {
  const p = P();
  if (p && FX.pushTimer) { clearTimeout(FX.pushTimer); FX.pushTimer = null; cloudPush(p, stateSnapshot(false)); }
  FX.hashFor = null;
}
function wireFeatures() {
  ROOT.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'finCurrency') { readEntryForm(); state.ledger.currency = t.value; keepScroll(render); return; }
    if (t.dataset && t.dataset.xfBudget != null) { readEntryForm(); const v = parseFloat(t.value); if (!(v > 0)) delete state.ledger.budgets[t.dataset.xfBudget]; else state.ledger.budgets[t.dataset.xfBudget] = v; keepScroll(render); return; }
    if (t.matches && t.matches('[data-xf-import]')) { importProfileFile(t.files && t.files[0]); t.value = ''; }
  });
  ROOT.addEventListener('keydown', e => {
    if ((e.target.id === 'gateCloudPw' || e.target.id === 'gateCloudEmail') && e.key === 'Enter') cloudGateSignIn();
    if (e.target.id === 'catNew' && e.key === 'Enter') { const b = ROOT.querySelector('[data-action="xf-cat-add"]'); if (b) b.click(); }
    if (e.target.id === 'finAmount' && e.key === 'Enter') addEntry();
    if (e.key === 'Escape') { const app = ROOT.querySelector('.app'); if (app) app.classList.remove('nav-open'); }
  });
  ROOT.addEventListener('click', e => {
    const g = e.target.closest('[data-gate]');
    if (g && g.closest('#gate')) {
      if (g.dataset.gate === 'cloud') { GATE.screen = 'cloud'; GATE.error = ''; renderGate(); gateFocus('gateCloudEmail'); }
      else if (g.dataset.gate === 'cloud-submit') cloudGateSignIn();
    }
  });
  window.addEventListener('focus', () => cloudPull());
  window.addEventListener('online', () => cloudPull());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') cloudPull();
    else { const p = P(); if (p && FX.pushTimer) { clearTimeout(FX.pushTimer); FX.pushTimer = null; cloudPush(p); } }
  });
  setInterval(() => { if (document.visibilityState === 'visible') cloudPull(); }, 25000);
}

/* ---------------- Mount ---------------- */
function boot(rootEl) {
  ROOT = rootEl;
  STATE_DEFAULTS = JSON.stringify(state);
  loadReg();
  loadFontLink('xw-fonts-latin', FONTS_LATIN);
  loadFontLink('xw-fonts-preview', FONTS_PREVIEW);
  ROOT.innerHTML = `<div id="gate"></div><div id="shell" style="display:none;height:100%">${SHELL_HTML}</div>`;
  $('#themeInput').innerHTML = THEMES.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  wireEvents();
  wireGate();
  wireFeatures();
  ROOT.addEventListener('change', onProfileChange);
  /* Anything typed straight into a field is saved too, not just re-renders. */
  ROOT.addEventListener('input', queueSave, true);
  ROOT.addEventListener('change', queueSave, true);
  window.addEventListener('beforeunload', saveState);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveState(); });
  /* Landing page is always the first screen. */
  GATE.screen = 'landing';
  renderGate();
}

class XenwinxDashboard extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;
    this.style.display = 'block';
    this.style.height = '100%';
    boot(this);
  }
}
if (!window.customElements.get('xenwinx-dashboard')) customElements.define('xenwinx-dashboard', XenwinxDashboard);
window.XenwinxDashboard = { boot, state, profiles: () => REG.profiles, themes: THEMES };

/* Landing page: forest background. The forest shows first, then the logo and content fade in. */
(function injectForestStyles() {
  const css = `
.gate-forest { background: #1c3324 url('assets/forest-bg-wide.jpg') center / cover no-repeat fixed; }
@media (max-aspect-ratio: 1/1) { .gate-forest { background-image: url('assets/forest-bg-tall.jpg'); } }
.gate-forest::before { content: ''; position: fixed; inset: 0; pointer-events: none;
  background: linear-gradient(100deg, rgba(8,22,14,.55) 0%, rgba(8,22,14,.22) 50%, rgba(8,22,14,0) 85%); }
.gate-forest .gate-inner { position: relative; }
.gate-forest .gate-copy { background: rgba(255,255,255,.84); -webkit-backdrop-filter: blur(12px) saturate(1.2); backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid rgba(255,255,255,.6); border-radius: 22px; padding: 34px 36px; box-shadow: 0 24px 70px rgba(0,20,10,.35); }
.gate-forest .gate-art .avatar { box-shadow: 0 10px 28px rgba(0,20,10,.35); border-radius: 50%; }
.gate-intro { animation: xwForestIn 1.2s ease-out both; }
.gate-intro .gate-copy { animation: xwRise .9s cubic-bezier(.2,.7,.2,1) 1.1s both; }
.gate-intro .gate-brand .brand-logo { animation: xwLogo .8s cubic-bezier(.2,.8,.2,1.2) 1.3s both; }
.gate-intro .gate-art-tile { animation: xwPop .6s ease-out both; animation-delay: calc(1.5s + var(--d) * 60ms); }
@keyframes xwForestIn { from { filter: brightness(.25) blur(3px); } to { filter: none; } }
@keyframes xwRise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes xwLogo { from { opacity: 0; transform: scale(.4) rotate(-20deg); } to { opacity: 1; transform: none; } }
@keyframes xwPop { from { opacity: 0; scale: .6; } to { opacity: 1; scale: 1; } }
@media (max-width: 720px) {
  .gate-forest { background-attachment: scroll; background-position: center bottom; }
  .gate-forest .gate-copy { padding: 26px 22px; border-radius: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .gate-intro, .gate-intro .gate-copy, .gate-intro .brand-logo, .gate-intro .gate-art-tile { animation: none !important; }
}`;
  const s = document.createElement('style'); s.id = 'xenwinx-forest'; s.textContent = css; document.head.appendChild(s);
})();
