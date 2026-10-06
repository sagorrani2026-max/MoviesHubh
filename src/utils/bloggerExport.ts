import { MovieItem, SiteSettings } from '../types';
import { RED_GRID_CATEGORIES, SPECIAL_BANNER_CATEGORIES } from '../constants';

export function generateBloggerHtmlCode(
  movies: MovieItem[],
  settings: SiteSettings,
  isBloggerXml: boolean
): string {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-hontgmwr7ehiaowj4t4gw5-588466972464.asia-east1.run.app';

  const normalizedMovies = movies.map((m) => ({
    ...m,
    realViews: m.realViews || 0,
    realLinkClicks: m.realLinkClicks || 0,
    posterUrl: String(m.posterUrl || '').startsWith('/')
      ? `${origin}${m.posterUrl}`
      : m.posterUrl,
    screenshots: (m.screenshots || []).map((s) =>
      String(s || '').startsWith('/') ? `${origin}${s}` : s
    )
  }));

  const serializedMovies = JSON.stringify(normalizedMovies, null, 2);
  const serializedSettings = JSON.stringify(
    {
      ...settings,
      admin: {
        username: settings.admin?.username || 'Sagor2026',
        password: 'gp2026',
        backupPassword: '1810908970',
        secondaryPassword: settings.admin?.secondaryPassword || '1810908970',
        subAdminUsername: settings.admin?.subAdminUsername || 'Rani2026',
        subAdminPassword: settings.admin?.subAdminPassword || 'Rani2026',
        securityQuestion: 'What Is my Wife Name?',
        securityAnswer: 'Rani'
      }
    },
    null,
    2
  );
  const serializedRedCats = JSON.stringify(RED_GRID_CATEGORIES);
  const serializedSpecialCats = JSON.stringify(SPECIAL_BANNER_CATEGORIES);

  const coreHtml = `<!DOCTYPE html>
<html lang="en" class="dark" ${isBloggerXml ? 'xmlns="http://www.w3.org/1999/xhtml" xmlns:b="http://www.google.com/2005/gml/b" xmlns:data="http://www.google.com/2005/gml/data" xmlns:expr="http://www.google.com/2005/gml/expr"' : ''}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${settings.siteName} — Free HD Movies &amp; Web Series Download Portal</title>
  <meta name="description" content="Download and stream the latest Bangla, Hindi Dubbed, Dual Audio, English, Tamil, Telugu, and Turkish HD movies and web series in 480p, 720p, 1080p &amp; 4K on ${settings.siteName}." />
  ${
    isBloggerXml
      ? `<b:skin><![CDATA[
    body { margin: 0; padding: 0; background: #050508; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; }
  ]]></b:skin>`
      : ''
  }
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
  <style id="mh-core-styles">
    body {
      background-color: #050508;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    .font-display-3d {
      font-family: 'Syne', sans-serif;
    }
    .font-mono-num {
      font-family: 'JetBrains Mono', monospace;
      font-variant-numeric: tabular-nums;
    }
    .glass-panel {
      background: linear-gradient(165deg, rgba(13, 13, 20, 0.98) 0%, rgba(6, 6, 11, 0.99) 100%);
      border: 1px solid rgba(244, 63, 94, 0.28);
      box-shadow: 0 14px 36px -10px rgba(0, 0, 0, 0.9);
      transform: translate3d(0,0,0);
    }
    .glass-card {
      background: linear-gradient(170deg, rgba(19, 15, 25, 0.98) 0%, rgba(8, 8, 13, 0.99) 100%);
      border: 1px solid rgba(255, 255, 255, 0.09);
      transform: translate3d(0,0,0);
      transition: transform 0.14s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.14s ease-out;
    }
    .glass-card:hover {
      border-color: rgba(244, 63, 94, 0.78);
      transform: translate3d(0, -3px, 0);
    }
    .red-cat-btn {
      background: linear-gradient(180deg, #e11d48 0%, #9f1239 100%);
      border: 1px solid rgba(253, 164, 175, 0.32);
      box-shadow: 0 4px 14px -3px rgba(225, 29, 72, 0.45);
      transition: transform 0.12s ease;
    }
    .red-cat-btn:hover {
      filter: brightness(1.1);
      transform: translate3d(0, -1px, 0);
    }
    .red-cat-btn.active {
      outline: 2px solid #facc15;
      background: #4c0519;
      color: #fde047;
    }
    .caution-stripe {
      background: repeating-linear-gradient(45deg, #f59e0b, #f59e0b 12px, #09090b 12px, #09090b 24px);
    }
    .crimson-stripe {
      background: repeating-linear-gradient(45deg, #dc2626, #dc2626 14px, #050203 14px, #050203 28px);
    }

    /* ==========================================================================
       240FPS HARDWARE-ACCELERATED 12-MODE 3D WORDMARK ENGINE (EXACT AI STUDIO)
       ========================================================================== */
    @keyframes gpu3DFloat {
      0%, 100% {
        transform: perspective(800px) rotateX(8deg) rotateY(-4deg) translate3d(0, 0, 0);
      }
      50% {
        transform: perspective(800px) rotateX(10deg) rotateY(4deg) translate3d(0, -2px, 8px);
      }
    }
    @keyframes gpuThunderFlash {
      0%, 76%, 82%, 90%, 100% {
        opacity: 0;
        transform: scale3d(0.7, 0.5, 1);
      }
      78%, 80%, 92% {
        opacity: 1;
        transform: scale3d(1.05, 1.08, 1);
      }
    }
    @keyframes gpuKatanaSlash {
      0% {
        transform: translate3d(-110%, 0, 0) rotate(-9deg);
        opacity: 0;
      }
      20%, 60% {
        opacity: 1;
      }
      85%, 100% {
        transform: translate3d(110%, 0, 0) rotate(-9deg);
        opacity: 0;
      }
    }
    @keyframes gpuCyberGlitch {
      0%, 82%, 88%, 100% {
        transform: perspective(800px) rotateX(8deg) translate3d(0, 0, 0) skewX(0deg);
      }
      84% {
        transform: perspective(800px) rotateX(8deg) translate3d(-4px, 1px, 0) skewX(-7deg);
      }
      86% {
        transform: perspective(800px) rotateX(8deg) translate3d(4px, -1px, 0) skewX(7deg);
      }
    }
    @keyframes gpuSpinRing {
      0% { transform: translate3d(0, 0, 0) rotate(0deg); }
      100% { transform: translate3d(0, 0, 0) rotate(360deg); }
    }
    @keyframes gpuPulseScale {
      0%, 100% { transform: scale3d(0.95, 0.95, 1); opacity: 0.75; }
      50% { transform: scale3d(1.06, 1.06, 1); opacity: 1; }
    }
    @keyframes gpuHorizontalSweep {
      0% { transform: translate3d(-100%, 0, 0); }
      100% { transform: translate3d(100%, 0, 0); }
    }

    .gpu-wordmark-stage {
      transform-style: preserve-3d;
      will-change: transform;
      animation: gpu3DFloat 4.5s ease-in-out infinite;
    }
    .gpu-cyber-stage {
      transform-style: preserve-3d;
      will-change: transform;
      animation: gpuCyberGlitch 2.2s infinite;
    }
    .gpu-thunder-bolt {
      will-change: transform, opacity;
      animation: gpuThunderFlash 2.4s infinite;
    }
    .gpu-katana-beam {
      will-change: transform, opacity;
      animation: gpuKatanaSlash 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    }
    .gpu-spin-portal {
      will-change: transform;
      animation: gpuSpinRing 4s linear infinite;
    }
    .gpu-pulse-element {
      will-change: transform, opacity;
      animation: gpuPulseScale 1.8s ease-in-out infinite;
    }
    .gpu-laser-sweep {
      will-change: transform;
      animation: gpuHorizontalSweep 1.8s linear infinite;
    }

    /* 12 Zero-Lag 3D Extruded Wordmark Palettes */
    .fx-text-thor {
      color: #ffffff;
      text-shadow: 0 1px 0 #38bdf8, 0 2px 0 #0284c7, 0 3px 0 #e50914, 0 4px 0 #991b1b, 0 5px 0 #450a0a, 0 0 22px rgba(56, 189, 248, 0.9), 0 8px 28px rgba(229, 9, 20, 0.85);
    }
    .fx-text-katana {
      color: #ff1e27;
      text-shadow: 0 1px 0 #ffffff, 0 2px 0 #dc2626, 0 3px 0 #991b1b, 0 4px 0 #66000b, 0 5px 0 #330005, 0 0 24px rgba(255, 30, 39, 0.95);
    }
    .fx-text-cyberpunk {
      color: #fcee09;
      text-shadow: -3px 0 0 #00f0ff, 3px 0 0 #ff003c, 0 2px 0 #7a001e, 0 4px 0 #29000a, 0 0 24px rgba(0, 240, 255, 0.8);
    }
    .fx-text-dragon {
      color: #ffedd5;
      text-shadow: 0 1px 0 #f97316, 0 2px 0 #ea580c, 0 3px 0 #dc2626, 0 4px 0 #991b1b, 0 5px 0 #450a0a, 0 0 26px rgba(249, 115, 22, 0.95);
    }
    .fx-text-venom {
      color: #f8fafc;
      text-shadow: 0 1px 0 #ff0022, 0 2px 0 #990014, 0 3px 0 #1e1b24, 0 4px 0 #09090d, 0 5px 0 #ff0022, 0 0 25px rgba(255, 0, 34, 0.95);
    }
    .fx-text-strange {
      color: #fef08a;
      text-shadow: 0 1px 0 #f97316, 0 2px 0 #db2777, 0 3px 0 #9333ea, 0 4px 0 #581c87, 0 5px 0 #2e1065, 0 0 25px rgba(249, 115, 22, 0.9);
    }
    .fx-text-ironman {
      color: #e0f2fe;
      text-shadow: 0 1px 0 #38bdf8, 0 2px 0 #facc15, 0 3px 0 #dc2626, 0 4px 0 #991b1b, 0 5px 0 #450a0a, 0 0 25px rgba(56, 189, 248, 0.95);
    }
    .fx-text-kgf {
      color: #fef9c3;
      text-shadow: 0 1px 0 #facc15, 0 2px 0 #eab308, 0 3px 0 #ca8a04, 0 4px 0 #854d0e, 0 5px 0 #422006, 0 0 25px rgba(250, 204, 21, 0.9);
    }
    .fx-text-oppenheimer {
      color: #ffffff;
      text-shadow: 0 1px 0 #fde047, 0 2px 0 #fb923c, 0 3px 0 #ef4444, 0 4px 0 #7f1d1d, 0 5px 0 #1c1917, 0 0 28px rgba(251, 146, 60, 0.95);
    }
    .fx-text-rrr {
      color: #ffffff;
      text-shadow: -3px 1px 0 #ef4444, 3px 1px 0 #0ea5e9, 0 3px 0 #7f1d1d, 0 5px 0 #0c4a6e, 0 0 24px rgba(239, 68, 68, 0.85);
    }
    .fx-text-eclipse {
      color: #ffe4e6;
      text-shadow: 0 1px 0 #f43f5e, 0 2px 0 #e11d48, 0 3px 0 #881337, 0 4px 0 #1f040d, 0 5px 0 #000000, 0 0 28px rgba(244, 63, 94, 0.95);
    }
    .fx-text-netflix {
      color: #ff1e27;
      text-shadow: -2px 0 0 #38bdf8, 2px 0 0 #facc15, 0 2px 0 #b80710, 0 4px 0 #660006, 0 6px 0 #2b0002, 0 0 26px rgba(229, 9, 20, 0.95);
    }
  </style>
</head>
<body class="min-h-screen bg-[#050508] text-slate-100 flex flex-col justify-between">
  ${isBloggerXml ? '<b:section id="main" showaddelement="yes"><b:widget id="HTML1" locked="false" title="MoviesHub Portal" type="HTML"><b:includable id="main">' : ''}

  <!-- MAIN PORTAL WRAPPER -->
  <div class="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-5 sm:pt-7 pb-20">
    
    <!-- CENTERED HEADER WITH AUTOMATIC MIDDLE OF TOP & BOTTOM 12-MODE 3D LOGO -->
    <header class="glass-panel rounded-2xl px-4 py-5 sm:px-6 sm:py-6 text-center select-none relative flex flex-col items-center justify-center">
      <div class="w-full flex items-center justify-center mb-1.5">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/85 border border-emerald-500/35 text-[11px] font-bold text-emerald-300">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span id="live-online-count" class="font-mono-num font-extrabold text-white">392</span>
          <span>Users Watching &amp; Downloading Now</span>
        </div>
      </div>

      <!-- AUTOMATIC MIDDLE-OF-TOP-AND-BOTTOM 12-MODE 3D LOGO ZONE (16-CLICK STEALTH TRIGGER) -->
      <div class="relative w-full flex flex-col items-center justify-center my-auto py-2.5 sm:py-3.5 mx-auto select-none border-none bg-transparent shadow-none">
        <div id="logo-glow-bloom" class="pointer-events-none absolute inset-x-0 -inset-y-6 mx-auto max-w-md transition-opacity duration-500" style="background: radial-gradient(closest-side, rgba(56, 189, 248, 0.24) 0%, rgba(0,0,0,0) 100%)"></div>
        <div id="logo-svg-fx" class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"></div>

        <button type="button" id="stealth-logo" onclick="handleLogoClick()" class="gpu-wordmark-stage relative flex flex-col items-center justify-center mx-auto my-auto cursor-pointer focus:outline-none border-none bg-transparent px-3 py-1 active:scale-95 transition-transform duration-100">
          <h1 id="logo-wordmark-text" class="font-display-3d font-extrabold tracking-tight uppercase text-center mx-auto transition-colors duration-300 fx-text-thor" style="font-size: clamp(2.1rem, 6.5vw, 3.85rem); line-height: 1.08;">${settings.siteName}</h1>
        </button>
      </div>

      <div class="w-full flex flex-col items-center justify-center mt-1">
        <p class="text-xs sm:text-sm text-emerald-400 font-medium">
          Working official link: <span class="text-amber-400 font-bold">${settings.officialDomain}</span>
        </p>
        <p class="text-[11px] sm:text-xs text-slate-300/90 mt-1 max-w-xl mx-auto leading-relaxed">
          ⚠️ ${settings.vpnNoticeText}
        </p>

        <!-- Mirror Pills -->
        <div class="flex flex-wrap items-center justify-center gap-2 mt-3">
          <button onclick="filterByCategory('ALL')" class="px-3.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold cursor-pointer">
            🏠 HOME
          </button>
          <a href="#one" class="px-3.5 py-1.5 rounded-md bg-emerald-500 text-white text-xs font-extrabold">.ONE</a>
          <a href="#work" class="px-3.5 py-1.5 rounded-md bg-blue-600 text-white text-xs font-extrabold">.WORK</a>
          <a href="#shop" class="px-3.5 py-1.5 rounded-md bg-amber-400 text-slate-950 text-xs font-extrabold">.SHOP</a>
          <a href="#tv" class="px-3.5 py-1.5 rounded-md bg-cyan-400 text-slate-950 text-xs font-extrabold">.TV</a>
        </div>

        <!-- How to Download & Share with Friends -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 mt-3">
          <button onclick="toggleHowToModal()" class="px-4 py-1.5 rounded-md bg-gradient-to-r from-amber-700 to-red-800 text-amber-100 text-xs font-extrabold inline-flex items-center gap-1.5 shadow cursor-pointer">
            🚀 ডাউনলোড করার নিয়ম
          </button>
          <button onclick="shareWebsiteLink()" id="share-site-btn" class="px-3.5 py-1.5 rounded-md bg-emerald-600/25 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-200 hover:text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow cursor-pointer">
            🔗 Share with Friends
          </button>
        </div>
      </div>
    </header>

    <!-- ADSTERRA TOP BANNER SLOT -->
    <div id="adsterra-top-slot" class="my-4"></div>

    <!-- RED CATEGORY GRID -->
    <section class="mt-4">
      <div id="red-categories-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-2"></div>
    </section>

    <!-- SEARCH BAR -->
    <section class="mt-4">
      <div class="flex items-stretch rounded-xl overflow-hidden border border-red-500/50 bg-[#0a0a0f]">
        <input
          id="search-input"
          type="text"
          oninput="currentPage=1; renderMovies();"
          placeholder="Movie বা Series-এর English নাম লিখুন..."
          class="w-full px-4 py-3.5 bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
        />
        <button onclick="currentPage=1; renderMovies();" class="px-6 red-cat-btn text-white font-extrabold text-sm flex items-center justify-center cursor-pointer">
          🔍
        </button>
      </div>
    </section>

    <!-- 6 SPECIAL COLORED BANNERS -->
    <section class="mt-4">
      <div id="special-banners-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5"></div>
    </section>

    <!-- SECTION HEADING (NO TOP PAGINATION — PAGINATION IS STRICTLY AT THE BOTTOM) -->
    <div class="mt-6 border-b border-red-500/35 pb-2.5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-1 h-5 bg-red-500 rounded-full inline-block"></span>
        <h2 id="current-category-title" class="text-sm sm:text-base font-extrabold tracking-wide uppercase text-slate-100">
          RECENTLY UPDATED
        </h2>
      </div>
      <span id="movie-count-badge" class="text-xs font-mono-num text-slate-400"></span>
    </div>

    <!-- MOVIES POSTER GRID -->
    <section class="mt-4">
      <div id="movies-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5"></div>
      <!-- BOTTOM-ONLY NUMBERED PAGINATION + NEXT PAGE BAR -->
      <div id="bottom-pagination" class="mt-8 pt-4 border-t border-red-500/25 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/55 px-4 py-3.5 rounded-2xl"></div>
    </section>

    <!-- ADSTERRA NATIVE SLOT -->
    <div id="adsterra-native-slot" class="my-6"></div>
  </div>

  <!-- CLEAN FOOTER -->
  <footer class="border-t border-red-500/20 bg-black/80 py-5 px-4 text-center text-xs text-slate-400">
    <p>© 2026 <strong class="text-white">${settings.siteName}</strong> — Official Cinema &amp; Web Series Download Portal.</p>
  </footer>

  <!-- MOVIE DETAILS & DOWNLOAD MODAL -->
  <div id="movie-modal" class="fixed inset-0 z-50 hidden bg-black/92 overflow-y-auto p-3 sm:p-6">
    <div id="movie-modal-content" class="max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden shadow-2xl my-6"></div>
  </div>

  <!-- HOW TO DOWNLOAD MODAL -->
  <div id="howto-modal" class="fixed inset-0 z-50 hidden bg-black/85 flex items-center justify-center p-4">
    <div class="glass-panel rounded-2xl max-w-md w-full p-5 space-y-3">
      <h3 class="text-base font-extrabold text-amber-400">🚀 ডাউনলোড করার নিয়ম (How to Download)</h3>
      <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">${settings.howToDownloadText}</p>
      <div class="text-right pt-2">
        <button onclick="toggleHowToModal()" class="px-5 py-2 red-cat-btn text-white text-xs font-extrabold rounded-lg cursor-pointer">Got It</button>
      </div>
    </div>
  </div>

  <!-- ROLE-BASED LOGIN INTRO POPUP:
       1) SUPERADMIN: "HIT: THE THIRD CASE" BLOODY BRUTAL MASS CHARACTER INTRO ("WELCOME BOSS • SAGOR")
       2) ADMIN: CAUTION ALERT ("SINGLE MOVIE UPLOAD ONLY") -->
  <div id="caution-login-popup" onclick="closeCautionPopup()" class="fixed inset-0 z-[100] hidden bg-black/92 flex items-center justify-center p-4 select-none overflow-hidden">
    <div id="caution-popup-inner" onclick="event.stopPropagation()" class="w-full flex items-center justify-center"></div>
  </div>

  <!-- SECRET ADMIN / SUPERADMIN MODAL -->
  <div id="admin-modal" class="fixed inset-0 z-50 hidden bg-black/95 overflow-y-auto p-3 sm:p-6">
    <div class="max-w-5xl mx-auto glass-panel border border-red-500/40 rounded-2xl p-5 my-6">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <h3 class="text-base sm:text-lg font-extrabold text-white">MOVIESHUB SECRET COMMAND CENTER</h3>
          <span id="admin-role-badge" class="hidden px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border"></span>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" id="caution-retrigger-btn" onclick="triggerCautionPopup()" class="hidden px-3 py-1.5 rounded-lg bg-red-600/25 hover:bg-red-600 border border-red-500/50 text-amber-300 hover:text-white text-xs font-extrabold cursor-pointer">
            🩸 Replay Intro
          </button>
          <button type="button" onclick="closeAdminModal()" class="px-3.5 py-1.5 bg-white/10 hover:bg-red-600 text-slate-200 hover:text-white rounded-lg text-xs font-bold cursor-pointer">Lock &amp; Exit ✕</button>
        </div>
      </div>
      <div id="admin-body"></div>
    </div>
  </div>

  <script id="mh-core-script">
    let MOVIES = JSON.parse(localStorage.getItem('mh_movies_v3')) || ${serializedMovies};
    let SETTINGS = JSON.parse(localStorage.getItem('mh_settings_v3')) || ${serializedSettings};
    if (!SETTINGS.admin) SETTINGS.admin = {};
    if (!SETTINGS.admin.username || SETTINGS.admin.username === 'Sagor2024') SETTINGS.admin.username = 'Sagor2026';
    if (!SETTINGS.admin.password) SETTINGS.admin.password = 'gp2026';
    if (!SETTINGS.admin.secondaryPassword) SETTINGS.admin.secondaryPassword = SETTINGS.admin.backupPassword || '1810908970';
    if (!SETTINGS.admin.subAdminUsername) SETTINGS.admin.subAdminUsername = 'Rani2026';
    if (!SETTINGS.admin.subAdminPassword) SETTINGS.admin.subAdminPassword = 'Rani2026';

    const RED_CATS = ${serializedRedCats};
    const SPECIAL_CATS = ${serializedSpecialCats};

    let activeCategory = 'ALL';
    let currentPage = 1;
    const itemsPerPage = 12;
    let logoClicks = 0;
    let logoTimer = null;

    // 16-Click Security Gateway State: Step 1 (Captcha) -> Step 2 (Role Select) -> Step 3 (Login)
    let isCaptchaUnlocked = false;
    let currentCaptchaCode = String(Math.floor(1000 + Math.random() * 9000));
    let selectedLoginRole = null; // 'ADMIN' or 'SUPERADMIN'
    let authenticatedRole = 'SUPERADMIN';
    let adminUploadedCount = 0;
    let isAdminLoggedIn = false;

    // ============================================================================
    // WEB AUDIO SYNTHESIZER (Touch Sound + HIT: The Third Case Brutal Mass Intro)
    // ============================================================================
    let sharedAudioCtx = null;
    function getAudioCtx() {
      if (typeof window === 'undefined') return null;
      if (!sharedAudioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) sharedAudioCtx = new AudioCtx();
      }
      if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
        sharedAudioCtx.resume().catch(() => {});
      }
      return sharedAudioCtx;
    }

    function playTouchSound() {
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.045);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.052);
      } catch (e) {}
    }

    function playHitThirdCaseIntroSound() {
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        const now = ctx.currentTime;
        // 1. Massive Sub-Bass Drop
        const sub = ctx.createOscillator();
        const sGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(135, now);
        sub.frequency.exponentialRampToValueAtTime(28, now + 0.85);
        sGain.gain.setValueAtTime(0.32, now);
        sGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
        sub.connect(sGain);
        sGain.connect(ctx.destination);
        sub.start(now);
        sub.stop(now + 1.15);

        // 2. Blade Blood-Slash
        [0.12, 0.36].forEach((offset, idx) => {
          const blade = ctx.createOscillator();
          const bGain = ctx.createGain();
          blade.type = 'sawtooth';
          blade.frequency.setValueAtTime(idx === 0 ? 420 : 520, now + offset);
          blade.frequency.exponentialRampToValueAtTime(3200, now + offset + 0.14);
          bGain.gain.setValueAtTime(0.22, now + offset);
          bGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);
          blade.connect(bGain);
          bGain.connect(ctx.destination);
          blade.start(now + offset);
          blade.stop(now + offset + 0.24);
        });

        // 3. Mass Hero Brass Chord
        [65.41, 130.81, 196.0].forEach(freq => {
          const brass = ctx.createOscillator();
          const brGain = ctx.createGain();
          brass.type = 'sawtooth';
          brass.frequency.setValueAtTime(freq, now + 0.42);
          brGain.gain.setValueAtTime(0.09, now + 0.42);
          brGain.gain.exponentialRampToValueAtTime(0.001, now + 1.85);
          brass.connect(brGain);
          brGain.connect(ctx.destination);
          brass.start(now + 0.42);
          brass.stop(now + 1.9);
        });
      } catch (e) {}
    }

    // ============================================================================
    // 12-MODE 3D BLOCKBUSTER LOGO ANIMATION ENGINE (CYCLES EVERY 2.8 SECONDS)
    // ============================================================================
    const LOGO_PRESETS = [
      { key: 'thor', textClass: 'fx-text-thor', stageClass: 'gpu-wordmark-stage', glow: 'rgba(56, 189, 248, 0.24)' },
      { key: 'katana', textClass: 'fx-text-katana', stageClass: 'gpu-wordmark-stage', glow: 'rgba(255, 30, 39, 0.28)' },
      { key: 'cyberpunk', textClass: 'fx-text-cyberpunk', stageClass: 'gpu-cyber-stage', glow: 'rgba(0, 240, 255, 0.24)' },
      { key: 'dragon', textClass: 'fx-text-dragon', stageClass: 'gpu-wordmark-stage', glow: 'rgba(249, 115, 22, 0.28)' },
      { key: 'venom_face', textClass: 'fx-text-venom', stageClass: 'gpu-wordmark-stage', glow: 'rgba(255, 0, 34, 0.28)' },
      { key: 'strange_portal', textClass: 'fx-text-strange', stageClass: 'gpu-wordmark-stage', glow: 'rgba(168, 85, 247, 0.26)' },
      { key: 'ironman_reactor', textClass: 'fx-text-ironman', stageClass: 'gpu-wordmark-stage', glow: 'rgba(56, 189, 248, 0.26)' },
      { key: 'kgf_gold', textClass: 'fx-text-kgf', stageClass: 'gpu-wordmark-stage', glow: 'rgba(250, 204, 21, 0.25)' },
      { key: 'oppenheimer_nuke', textClass: 'fx-text-oppenheimer', stageClass: 'gpu-wordmark-stage', glow: 'rgba(251, 146, 60, 0.28)' },
      { key: 'rrr_clash', textClass: 'fx-text-rrr', stageClass: 'gpu-wordmark-stage', glow: 'rgba(239, 68, 68, 0.26)' },
      { key: 'blackhole_eclipse', textClass: 'fx-text-eclipse', stageClass: 'gpu-wordmark-stage', glow: 'rgba(244, 63, 94, 0.28)' },
      { key: 'netflix_imax', textClass: 'fx-text-netflix', stageClass: 'gpu-wordmark-stage', glow: 'rgba(229, 9, 20, 0.3)' }
    ];
    let currentLogoModeIdx = 0;

    function renderLogoFX() {
      const fx = LOGO_PRESETS[currentLogoModeIdx];
      const h1 = document.getElementById('logo-wordmark-text');
      const btn = document.getElementById('stealth-logo');
      const bloom = document.getElementById('logo-glow-bloom');
      const svgBox = document.getElementById('logo-svg-fx');
      if (!h1 || !btn) return;

      h1.className = 'font-display-3d font-extrabold tracking-tight uppercase text-center mx-auto transition-colors duration-300 ' + fx.textClass;
      btn.className = fx.stageClass + ' relative flex flex-col items-center justify-center mx-auto my-auto cursor-pointer focus:outline-none border-none bg-transparent px-3 py-1 active:scale-95 transition-transform duration-100';
      if (bloom) {
        bloom.style.background = 'radial-gradient(closest-side, ' + fx.glow + ' 0%, rgba(0,0,0,0) 100%)';
      }
      if (svgBox) {
        if (fx.key === 'thor') {
          svgBox.innerHTML = '<svg class="gpu-thunder-bolt w-72 sm:w-96 h-24 overflow-visible" viewBox="0 0 400 100" fill="none"><path d="M55 2 L125 46 L95 52 L175 98" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/><path d="M345 5 L275 48 L305 52 L230 96" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round"/></svg>';
        } else if (fx.key === 'katana') {
          svgBox.innerHTML = '<div class="gpu-katana-beam w-80 sm:w-96 h-[3px] bg-gradient-to-r from-transparent via-white to-red-500"></div>';
        } else if (fx.key === 'strange_portal') {
          svgBox.innerHTML = '<svg class="gpu-spin-portal w-32 h-32 opacity-75 overflow-visible" viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" fill="none" stroke="#f97316" stroke-width="2.5" stroke-dasharray="10 6"/></svg>';
        } else {
          svgBox.innerHTML = '';
        }
      }
    }

    setInterval(() => {
      currentLogoModeIdx = (currentLogoModeIdx + 1) % LOGO_PRESETS.length;
      renderLogoFX();
    }, 2800);

    function safeCopy(text) {
      try {
        if (navigator.clipboard && document.hasFocus()) {
          navigator.clipboard.writeText(text);
          return;
        }
      } catch (e) {}
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }

    function shareWebsiteLink() {
      playTouchSound();
      safeCopy(window.location.href);
      const btn = document.getElementById('share-site-btn');
      if (btn) {
        btn.textContent = '✓ Link Copied!';
        setTimeout(() => { btn.textContent = '🔗 Share with Friends'; }, 2200);
      }
    }

    function saveLocal() {
      localStorage.setItem('mh_movies_v3', JSON.stringify(MOVIES));
      localStorage.setItem('mh_settings_v3', JSON.stringify(SETTINGS));
    }

    // 16-CLICK SECRET ADMIN / SUPERADMIN TRIGGER ON LOGO (Hidden unless clicked 16 times!)
    function handleLogoClick() {
      playTouchSound();
      logoClicks++;
      if (logoTimer) clearTimeout(logoTimer);
      logoTimer = setTimeout(() => { logoClicks = 0; }, 4000);
      if (logoClicks >= 16) {
        logoClicks = 0;
        openAdminModal();
      }
    }

    function formatViews(n) {
      return n >= 1000 ? (n / 1000).toFixed(2) + 'K' : String(n);
    }

    // Visitor-only impressive live view pulse (Never inflates realViews in Admin!)
    setInterval(() => {
      MOVIES.forEach(m => {
        m.views = (m.views || 200) + Math.floor(Math.random() * 4) + 1;
      });
      const onlineEl = document.getElementById('live-online-count');
      if (onlineEl) {
        onlineEl.textContent = String(Math.floor(Math.random() * 90) + 340);
      }
      saveLocal();
      renderMovies();
    }, 6000);

    function renderCategories() {
      const redContainer = document.getElementById('red-categories-grid');
      if (redContainer) {
        redContainer.innerHTML = RED_CATS.map(c => \`
          <button onclick="filterByCategory('\${c.id}')" class="red-cat-btn \${activeCategory === c.id ? 'active' : ''} py-2.5 px-2.5 rounded-lg text-white font-extrabold text-xs tracking-wide uppercase flex items-center justify-center gap-1.5 cursor-pointer">
            <span>\${c.icon}</span> <span class="truncate">\${c.label}</span>
          </button>
        \`).join('');
      }

      const specContainer = document.getElementById('special-banners-grid');
      if (specContainer) {
        specContainer.innerHTML = SPECIAL_CATS.map(c => \`
          <button onclick="filterByCategory('\${c.id}')" class="\${c.bannerGradient} py-2.5 px-3.5 rounded-xl text-white font-extrabold text-xs sm:text-sm uppercase flex items-center justify-between shadow-md hover:brightness-110 transition cursor-pointer">
            <span class="flex items-center gap-2 truncate"><span>\${c.icon}</span> <span class="truncate">\${c.label}</span></span>
            <span class="px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono-num tracking-wider shrink-0">\${c.badgeText}</span>
          </button>
        \`).join('');
      }
    }

    function filterByCategory(catId) {
      playTouchSound();
      activeCategory = activeCategory === catId ? 'ALL' : catId;
      currentPage = 1;
      const titleEl = document.getElementById('current-category-title');
      if (titleEl) {
        titleEl.textContent = activeCategory === 'ALL' ? 'RECENTLY UPDATED' : activeCategory + ' RELEASES';
      }
      renderCategories();
      renderMovies();
    }

    function goToPage(p) {
      playTouchSound();
      currentPage = p;
      renderMovies();
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }

    function renderMovies() {
      const searchEl = document.getElementById('search-input');
      const q = (searchEl ? searchEl.value : '').toLowerCase().trim();
      const filtered = MOVIES.filter(m => {
        const matchesCat = activeCategory === 'ALL' || (m.categories && m.categories.includes(activeCategory)) || (m.language && m.language.toUpperCase().includes(activeCategory));
        const matchesSearch = !q || m.title.toLowerCase().includes(q) || m.fullDisplayTitle.toLowerCase().includes(q) || m.language.toLowerCase().includes(q) || (m.cast || '').toLowerCase().includes(q);
        return matchesCat && matchesSearch;
      });

      filtered.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
      const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
      if (currentPage > totalPages) currentPage = totalPages;

      const badgeEl = document.getElementById('movie-count-badge');
      if (badgeEl) {
        badgeEl.textContent = 'Page ' + currentPage + ' of ' + totalPages + ' (' + filtered.length + ' Titles)';
      }

      const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      const grid = document.getElementById('movies-grid');
      if (grid) {
        grid.innerHTML = paginated.map(m => \`
          <article onclick="openMovieModal('\${m.id}')" class="glass-card rounded-xl overflow-hidden cursor-pointer group flex flex-col">
            <div class="relative aspect-[3/4] w-full bg-black overflow-hidden">
              <img src="\${m.posterUrl}" alt="\${m.title}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition duration-200" />
              \${m.isPinned ? '<span class="absolute top-2 left-2 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">PINNED</span>' : ''}
              <span class="absolute top-2 right-2 bg-black/85 border border-white/15 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">\${m.quality}</span>
              <div class="absolute bottom-8 right-2 bg-black/85 text-white text-[11px] font-mono-num px-2 py-0.5 rounded flex items-center gap-1">
                👁 \${formatViews(m.views || 0)}
              </div>
              <span class="absolute bottom-1.5 left-1.5 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">\${m.language}</span>
              <span class="absolute bottom-1.5 right-1.5 \${m.type === 'SERIES' ? 'bg-blue-600' : 'bg-red-600'} text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">\${m.type}</span>
            </div>
            <div class="p-3 text-center flex-1 flex flex-col justify-between">
              <div>
                \${m.episodeBadge ? \`<div class="mb-1"><span class="border border-emerald-500/60 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-semibold">\${m.episodeBadge}</span></div>\` : ''}
                <h3 class="text-xs sm:text-sm font-bold text-slate-100 leading-snug line-clamp-2 group-hover:text-red-400 transition">\${m.fullDisplayTitle}</h3>
              </div>
            </div>
          </article>
        \`).join('');
      }

      // Render Bottom-Only Pagination Controls
      const pagEl = document.getElementById('bottom-pagination');
      if (pagEl) {
        let pageButtons = '';
        const maxBtns = Math.min(totalPages, 5);
        let startP = Math.max(1, currentPage - 2);
        if (startP + maxBtns - 1 > totalPages) startP = Math.max(1, totalPages - maxBtns + 1);
        for (let i = 0; i < maxBtns; i++) {
          const pNum = startP + i;
          pageButtons += \`<button onclick="goToPage(\${pNum})" class="w-9 h-9 rounded-xl text-xs font-mono-num font-extrabold cursor-pointer \${currentPage === pNum ? 'red-cat-btn text-white ring-2 ring-amber-400' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">\${pNum}</button>\`;
        }

        pagEl.innerHTML = \`
          <span class="text-xs text-slate-300 font-mono-num">Showing Page <strong class="text-amber-400">\${currentPage}</strong> of <strong class="text-white">\${totalPages}</strong></span>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <button onclick="if(currentPage>1) goToPage(currentPage-1)" \${currentPage<=1?'disabled':''} class="px-3.5 h-9 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-xs font-extrabold text-white cursor-pointer">← Prev</button>
            \${pageButtons}
            <button onclick="if(currentPage<\${totalPages}) goToPage(currentPage+1)" \${currentPage>=\${totalPages}?'disabled':''} class="px-4 h-9 rounded-xl red-cat-btn disabled:opacity-40 text-xs font-extrabold text-white cursor-pointer">Next Page →</button>
          </div>
        \`;
      }
    }

    function openMovieModal(id) {
      playTouchSound();
      const m = MOVIES.find(x => x.id === id);
      if (!m) return;
      m.views = (m.views || 0) + 1;
      m.realViews = (m.realViews || 0) + 1;
      saveLocal();
      renderMovies();

      const modal = document.getElementById('movie-modal');
      const content = document.getElementById('movie-modal-content');
      const smartlink = SETTINGS.adsterra && SETTINGS.adsterra.enabled && SETTINGS.adsterra.directSmartlinkUrl ? SETTINGS.adsterra.directSmartlinkUrl : '';

      content.innerHTML = \`
        <div class="p-4 sm:p-6">
          <div class="flex justify-between items-center gap-3 border-b border-white/10 pb-4">
            <h2 class="text-sm sm:text-lg font-extrabold text-white truncate">\${m.fullDisplayTitle}</h2>
            <button onclick="closeMovieModal()" class="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer">✕ Close</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
            <img src="\${m.posterUrl}" class="w-full rounded-xl border border-white/15 object-cover aspect-[3/4]" />
            <div class="sm:col-span-2 space-y-2.5 text-xs sm:text-sm">
              <p><strong class="text-slate-400">Title:</strong> <span class="text-white font-semibold">\${m.title} (\${m.year})</span></p>
              <p><strong class="text-slate-400">Language:</strong> <span class="text-red-400 font-bold">\${m.language}</span></p>
              <p><strong class="text-slate-400">Quality:</strong> <span class="text-amber-400 font-bold">\${m.quality}</span></p>
              <p><strong class="text-slate-400">Genre:</strong> \${(m.genre || []).join(', ')}</p>
              <p><strong class="text-slate-400">Cast:</strong> \${m.cast}</p>
              <div class="pt-2">
                <strong class="text-slate-400 block mb-1">Complete Movie Description &amp; Storyline:</strong>
                <p class="text-slate-200 leading-relaxed bg-black/70 p-3.5 rounded-xl border border-white/10 whitespace-pre-line">\${m.storyline}</p>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">📸 Official Movie Screenshots</h4>
            <div class="grid grid-cols-2 gap-2.5">
              \${(m.screenshots || []).map(s => \`<img src="\${s}" class="w-full h-36 sm:h-44 object-cover rounded-lg border border-white/10" />\`).join('')}
            </div>
          </div>

          <div class="mt-6 bg-black/70 p-4 rounded-xl border border-red-500/30 text-center">
            <h4 class="text-sm font-extrabold text-amber-400 uppercase mb-3">⚡ Direct Fast Download Links</h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <a href="\${m.links.p480 || '#'}" target="_blank" onclick="trackClick('\${m.id}', '\${smartlink}')" class="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-extrabold text-xs block">⬇ Download 480P</a>
              <a href="\${m.links.p720 || '#'}" target="_blank" onclick="trackClick('\${m.id}', '\${smartlink}')" class="py-2.5 px-3 bg-red-900 hover:bg-red-800 text-white rounded-lg font-extrabold text-xs block">⬇ Download 720P</a>
              <a href="\${m.links.p1080 || '#'}" target="_blank" onclick="trackClick('\${m.id}', '\${smartlink}')" class="py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-extrabold text-xs block">⬇ Download 1080P</a>
              <a href="\${m.links.p4k || '#'}" target="_blank" onclick="trackClick('\${m.id}', '\${smartlink}')" class="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-extrabold text-xs block">⬇ Download 4K UHD</a>
            </div>
          </div>
        </div>
      \`;
      modal.classList.remove('hidden');
    }

    function trackClick(id, smartlink) {
      playTouchSound();
      const m = MOVIES.find(x => x.id === id);
      if (m) {
        m.linkClicks = (m.linkClicks || 0) + 1;
        m.realLinkClicks = (m.realLinkClicks || 0) + 1;
        saveLocal();
      }
      if (smartlink) {
        const a = document.createElement('a');
        a.href = smartlink;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }

    function closeMovieModal() { document.getElementById('movie-modal').classList.add('hidden'); }
    function toggleHowToModal() { playTouchSound(); document.getElementById('howto-modal').classList.toggle('hidden'); }
    function closeCautionPopup() { document.getElementById('caution-login-popup').classList.add('hidden'); }

    function triggerCautionPopup() {
      const popup = document.getElementById('caution-login-popup');
      const inner = document.getElementById('caution-popup-inner');
      if (!popup || !inner) return;
      playHitThirdCaseIntroSound();

      if (authenticatedRole === 'SUPERADMIN') {
        inner.innerHTML = \`
          <div class="relative max-w-2xl w-full rounded-2xl overflow-hidden border-2 border-red-600 bg-[#070204] shadow-[0_0_90px_rgba(220,38,38,0.85)]">
            <div class="h-3.5 w-full crimson-stripe"></div>
            <div class="pointer-events-none absolute inset-0" style="background: radial-gradient(circle at 50% 42%, rgba(220, 38, 38, 0.42) 0%, rgba(127, 29, 29, 0.22) 45%, rgba(5, 2, 3, 0.96) 85%)"></div>
            <svg class="pointer-events-none absolute inset-0 w-full h-full opacity-85" viewBox="0 0 800 450" preserveAspectRatio="none">
              <path d="M-40 390 L840 55" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
              <path d="M-20 85 L820 380" stroke="#991b1b" stroke-width="3.5" stroke-dasharray="18 8"/>
              <circle cx="145" cy="110" r="14" fill="#dc2626" opacity="0.65"/>
              <circle cx="660" cy="95" r="18" fill="#b91c1c" opacity="0.6"/>
              <circle cx="685" cy="325" r="12" fill="#dc2626" opacity="0.7"/>
            </svg>
            <div class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <span class="font-display-3d font-black uppercase select-none tracking-tighter" style="font-size: clamp(5.2rem, 18vw, 11.5rem); line-height: 0.9; color: rgba(255, 255, 255, 0.09); -webkit-text-stroke: 2px rgba(239, 68, 68, 0.72); text-shadow: 0 0 35px rgba(239, 68, 68, 0.95), 0 0 75px rgba(220, 38, 38, 0.85), 0 6px 0 rgba(127, 29, 29, 0.9);">SAGOR</span>
            </div>
            <div class="relative z-10 px-6 py-8 sm:px-10 sm:py-10 text-center space-y-4">
              <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-red-950/90 border border-red-500 text-red-200 text-[11px] font-black uppercase tracking-[0.22em]">
                🩸 HIT : THE THIRD CASE • BRUTAL MASS CHARACTER INTRO
              </div>
              <div class="font-display-3d font-black uppercase tracking-widest text-amber-400 text-xs sm:text-sm" style="text-shadow: 0 0 16px rgba(245, 158, 11, 0.9);">
                ★ HOMICIDE INTERVENTION TEAM • SUPREME COMMANDER ★
              </div>
              <h3 class="font-display-3d font-black uppercase tracking-tight text-white" style="font-size: clamp(2.2rem, 6vw, 3.8rem); line-height: 1.05; text-shadow: 0 2px 0 #dc2626, 0 4px 0 #7f1d1d, 0 0 32px rgba(239, 68, 68, 1);">
                WELCOME BOSS
              </h3>
              <div class="inline-block px-6 py-2 rounded-xl bg-gradient-to-r from-red-950/90 via-red-700/40 to-red-950/90 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.65)]">
                <span class="font-display-3d font-black uppercase tracking-[0.18em] text-2xl sm:text-4xl text-white" style="text-shadow: 0 0 18px #ef4444, 0 0 36px #dc2626, 0 2px 0 #fde047;">SAGOR</span>
              </div>
              <p class="text-xs sm:text-sm text-red-100/90 font-bold max-w-lg mx-auto leading-relaxed">
                Unrestricted <span class="text-amber-400 font-black">SUPER ADMIN</span> Authority Unlocked. Full Catalog Control &amp; Direct Admin Password Override are at your command, Boss.
              </p>
              <div class="pt-3 max-w-sm mx-auto">
                <button type="button" onclick="closeCautionPopup()" class="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white font-black text-xs sm:text-sm uppercase tracking-widest cursor-pointer">
                  🩸 ENTER BOSS COMMAND CENTER →
                </button>
              </div>
            </div>
          </div>
        \`;
        popup.classList.remove('hidden');
        setTimeout(() => closeCautionPopup(), 4800);
      } else {
        inner.innerHTML = \`
          <div class="max-w-md w-full rounded-2xl overflow-hidden border-2 border-amber-500 bg-[#0c0a0e] shadow-2xl">
            <div class="h-3 w-full caution-stripe"></div>
            <div class="p-6 text-center space-y-3.5">
              <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-emerald-600/25 border border-emerald-500/50 text-emerald-300 text-[11px] font-black uppercase tracking-widest">
                🎬 ADMIN ACCESS • SINGLE MOVIE UPLOAD MODE
              </div>
              <h3 class="text-xl sm:text-2xl font-black uppercase tracking-wide text-white">
                WELCOME ADMIN \${(SETTINGS.admin.subAdminUsername || 'RANI2026').toUpperCase()}
              </h3>
              <p class="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed">
                You are logged in with <strong class="text-amber-400">Standard Admin</strong> privileges. You can upload <strong class="text-white">1 Single Movie</strong> during this session.
              </p>
              <div class="pt-2">
                <button type="button" onclick="closeCautionPopup()" class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest cursor-pointer">
                  🎬 Continue to Single Movie Upload →
                </button>
              </div>
            </div>
          </div>
        \`;
        popup.classList.remove('hidden');
        setTimeout(() => closeCautionPopup(), 3200);
      }
    }

    function openAdminModal() {
      isCaptchaUnlocked = false;
      selectedLoginRole = null;
      currentCaptchaCode = String(Math.floor(1000 + Math.random() * 9000));
      document.getElementById('admin-modal').classList.remove('hidden');
      renderAdminPanel();
    }

    function closeAdminModal() {
      isAdminLoggedIn = false;
      isCaptchaUnlocked = false;
      selectedLoginRole = null;
      const btn = document.getElementById('caution-retrigger-btn');
      if (btn) btn.classList.add('hidden');
      const badge = document.getElementById('admin-role-badge');
      if (badge) badge.classList.add('hidden');
      document.getElementById('admin-modal').classList.add('hidden');
    }

    function verifyCaptchaGate() {
      const inp = (document.getElementById('captcha-inp').value || '').trim();
      if (inp === currentCaptchaCode) {
        isCaptchaUnlocked = true;
        renderAdminPanel();
      } else {
        currentCaptchaCode = String(Math.floor(1000 + Math.random() * 9000));
        renderAdminPanel('Security code did not match! Try the new code.');
      }
    }

    function chooseLoginRole(role) {
      selectedLoginRole = role;
      renderAdminPanel();
    }

    function renderAdminPanel(errMsg) {
      const container = document.getElementById('admin-body');
      const cautionBtn = document.getElementById('caution-retrigger-btn');
      const roleBadge = document.getElementById('admin-role-badge');

      if (!isAdminLoggedIn) {
        if (cautionBtn) cautionBtn.classList.add('hidden');
        if (roleBadge) roleBadge.classList.add('hidden');

        // STEP 1: CAPTCHA SECURITY LOCK
        if (!isCaptchaUnlocked) {
          container.innerHTML = \`
            <div class="max-w-md mx-auto glass-card rounded-2xl p-6 border-2 border-amber-500/50 text-center space-y-4 my-4">
              <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-widest">
                🔒 16-CLICK STEALTH SECURITY CAPTCHA LOCK
              </div>
              <h3 class="text-lg font-black text-white uppercase">Verify Human Security Lock</h3>
              <p class="text-xs text-slate-300">Enter the 4-digit security code below to unlock the <strong>Admin / SuperAdmin</strong> role selector.</p>
              <div class="py-3 px-6 rounded-xl bg-black border-2 border-dashed border-amber-400/70 inline-block font-mono-num text-2xl font-black tracking-[0.35em] text-amber-400 select-none">
                \${currentCaptchaCode}
              </div>
              \${errMsg ? \`<div class="text-xs text-red-400 font-bold">⚠️ \${errMsg}</div>\` : ''}
              <input id="captcha-inp" type="text" maxlength="4" placeholder="Enter 4-Digit Code" class="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-center font-mono-num text-base font-extrabold text-white tracking-widest" />
              <button onclick="verifyCaptchaGate()" class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest cursor-pointer">🔓 Unlock Security Gate →</button>
            </div>
          \`;
          return;
        }

        // STEP 2: 2-OPTION ROLE SELECTOR (1. ADMIN vs 2. SUPER ADMIN)
        if (!selectedLoginRole) {
          container.innerHTML = \`
            <div class="max-w-lg mx-auto space-y-4 py-4">
              <div class="text-center space-y-1">
                <span class="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase">✓ Security Captcha Verified</span>
                <h3 class="text-lg font-black text-white uppercase">Select Access Clearance Level</h3>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <button onclick="chooseLoginRole('ADMIN')" class="p-5 rounded-2xl bg-black/75 hover:bg-emerald-950/40 border-2 border-emerald-500/40 hover:border-emerald-400 text-left space-y-2 cursor-pointer">
                  <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black">1</div>
                  <div class="text-base font-black text-white uppercase">1. Admin Login</div>
                  <p class="text-[11px] text-slate-400">Can only upload <strong>1 Single Movie</strong>. Cannot delete or change settings.</p>
                  <div class="text-[11px] font-extrabold text-emerald-400 uppercase">Select Admin →</div>
                </button>
                <button onclick="chooseLoginRole('SUPERADMIN')" class="p-5 rounded-2xl bg-black/75 hover:bg-red-950/50 border-2 border-red-500/50 hover:border-amber-400 text-left space-y-2 cursor-pointer">
                  <div class="w-9 h-9 rounded-xl bg-red-600/25 border border-red-500/50 flex items-center justify-center text-amber-400 font-black">2</div>
                  <div class="text-base font-black text-white uppercase">2. Super Admin</div>
                  <p class="text-[11px] text-slate-400">Supreme Boss Control. Do everything &amp; change Admin user/pass without old password.</p>
                  <div class="text-[11px] font-extrabold text-amber-400 uppercase">Select Super Admin →</div>
                </button>
              </div>
            </div>
          \`;
          return;
        }

        // STEP 3: LOGIN FORM FOR SELECTED ROLE
        container.innerHTML = \`
          <div class="max-w-sm mx-auto space-y-3.5 py-4">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-amber-300 text-[10px] font-black uppercase">\${selectedLoginRole === 'SUPERADMIN' ? '🩸 SUPER ADMIN LOGIN' : '🎬 ADMIN (1-MOVIE UPLOAD)'}</span>
              <button onclick="selectedLoginRole=null; renderAdminPanel();" class="text-xs text-slate-400 hover:text-white cursor-pointer">← Switch Role</button>
            </div>
            <input id="adm-user" type="text" autocomplete="off" placeholder="\${selectedLoginRole === 'SUPERADMIN' ? 'SuperAdmin Username' : 'Admin Username'}" class="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded-lg text-sm text-white" />
            <input id="adm-pass" type="password" autocomplete="new-password" placeholder="\${selectedLoginRole === 'SUPERADMIN' ? 'Password or Secondary Password' : 'Admin Password'}" class="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded-lg text-sm text-white" />
            <div id="adm-err" class="text-xs text-red-400 font-bold"></div>
            <div class="flex items-center justify-between pt-1">
              \${selectedLoginRole === 'SUPERADMIN' ? '<button onclick="showForgotRecovery()" class="text-xs text-red-400 hover:underline cursor-pointer">Forgot Password?</button>' : '<span class="text-[11px] text-slate-500">Assigned by SuperAdmin</span>'}
              <button onclick="doAdminLogin()" class="px-5 py-2.5 red-cat-btn text-white font-extrabold rounded-lg text-xs uppercase cursor-pointer">Unlock Console</button>
            </div>
          </div>
        \`;
        return;
      }

      if (cautionBtn) cautionBtn.classList.remove('hidden');
      if (roleBadge) {
        roleBadge.classList.remove('hidden');
        roleBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ' + (authenticatedRole === 'SUPERADMIN' ? 'bg-red-600/30 border-red-500 text-amber-300' : 'bg-emerald-600/25 border-emerald-500/50 text-emerald-300');
        roleBadge.textContent = authenticatedRole === 'SUPERADMIN' ? '🩸 SUPER ADMIN • BOSS SAGOR' : '🎬 ADMIN • 1-MOVIE UPLOAD (' + adminUploadedCount + '/1)';
      }

      // IF STANDARD ADMIN: ONLY SHOW SINGLE MOVIE UPLOAD!
      if (authenticatedRole === 'ADMIN') {
        container.innerHTML = \`
          <div class="space-y-4">
            <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
              <strong>🎬 Standard Admin Mode:</strong> You can upload <strong>1 Single Movie</strong> per session (\${adminUploadedCount}/1 used). All other controls require SuperAdmin.
            </div>
            <div class="bg-black/60 p-4 rounded-xl border border-white/10">
              <h4 class="font-extrabold text-sm text-red-400 mb-3">+ Upload 1 Single Movie (\${adminUploadedCount}/1)</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <input id="new-title" placeholder="Movie Title *" class="p-2.5 bg-black border border-white/15 rounded-lg text-white" />
                <input id="new-year" placeholder="Year (2026)" value="2026" class="p-2.5 bg-black border border-white/15 rounded-lg text-white" />
                <input id="new-lang" placeholder="Language (BANGLA / HINDI DUB)" value="BANGLA" class="p-2.5 bg-black border border-white/15 rounded-lg text-white" />
                <input id="new-qual" placeholder="Quality (1080P WEB-DL)" value="1080P WEB-DL" class="p-2.5 bg-black border border-white/15 rounded-lg text-white" />
                <input id="new-poster" placeholder="Poster Image URL" class="p-2.5 bg-black border border-white/15 rounded-lg text-white sm:col-span-2" />
                <textarea id="new-story" rows="2" placeholder="Movie Storyline / Description" class="p-2.5 bg-black border border-white/15 rounded-lg text-white sm:col-span-2"></textarea>
                <input id="new-1080" placeholder="Direct Download Link (480p / 720p / 1080p)" class="p-2.5 bg-black border border-white/15 rounded-lg text-white sm:col-span-2" />
              </div>
              <button onclick="quickAddMovie()" class="mt-3 px-5 py-2.5 red-cat-btn text-white text-xs font-extrabold rounded-lg uppercase cursor-pointer">Publish Single Movie Now</button>
            </div>
          </div>
        \`;
        return;
      }

      // SUPERADMIN FULL WORKSPACE (Including Direct Admin Username/Password Override without old credentials!)
      const realViewsTotal = MOVIES.reduce((s, m) => s + (m.realViews || 0), 0);
      const realClicksTotal = MOVIES.reduce((s, m) => s + (m.realLinkClicks || 0), 0);

      container.innerHTML = \`
        <div class="space-y-6">
          <!-- Accurate Real Telemetry Row -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-xl bg-black/70 border border-emerald-500/40">
              <div class="text-[11px] text-slate-400 font-bold uppercase">100% Real Movie Views</div>
              <div class="text-xl font-extrabold text-emerald-400 font-mono-num mt-1">\${realViewsTotal}</div>
            </div>
            <div class="p-3.5 rounded-xl bg-black/70 border border-amber-500/40">
              <div class="text-[11px] text-slate-400 font-bold uppercase">100% Real Download Clicks</div>
              <div class="text-xl font-extrabold text-amber-300 font-mono-num mt-1">\${realClicksTotal}</div>
            </div>
            <div class="p-3.5 rounded-xl bg-black/70 border border-white/15">
              <div class="text-[11px] text-slate-400 font-bold uppercase">Total Movies in Catalog</div>
              <div class="text-xl font-extrabold text-white font-mono-num mt-1">\${MOVIES.length}</div>
            </div>
          </div>

          <!-- Upload New Movie -->
          <div class="bg-black/60 p-4 rounded-xl border border-white/10">
            <h4 class="font-extrabold text-sm text-red-400 mb-3">+ Quick Upload New Movie / Series</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <input id="new-title" placeholder="Movie Title *" class="p-2.5 bg-black border border-white/15 rounded-lg text-white" />
              <input id="new-year" placeholder="Year (2026)" value="2026" class="p-2.5 bg-black border border-white/15 rounded-lg text-white" />
              <input id="new-lang" placeholder="Language (BANGLA / HINDI DUB / DUAL AUDIO)" value="BANGLA" class="p-2.5 bg-black border border-white/15 rounded-lg text-white" />
              <input id="new-qual" placeholder="Quality (1080P WEB-DL)" value="1080P WEB-DL" class="p-2.5 bg-black border border-white/15 rounded-lg text-white" />
              <input id="new-poster" placeholder="Poster Image URL" class="p-2.5 bg-black border border-white/15 rounded-lg text-white sm:col-span-2" />
              <textarea id="new-story" rows="2" placeholder="Movie Storyline / Description" class="p-2.5 bg-black border border-white/15 rounded-lg text-white sm:col-span-2"></textarea>
              <input id="new-1080" placeholder="Direct Download Link (480p / 720p / 1080p)" class="p-2.5 bg-black border border-white/15 rounded-lg text-white sm:col-span-2" />
            </div>
            <button onclick="quickAddMovie()" class="mt-3 px-5 py-2.5 red-cat-btn text-white text-xs font-extrabold rounded-lg uppercase cursor-pointer">Publish Movie Now</button>
          </div>

          <!-- SuperAdmin Direct Admin Credential Override (No Old Password Needed!) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-black/60 p-4 rounded-xl border border-emerald-500/40 space-y-2.5">
              <h4 class="font-extrabold text-xs sm:text-sm text-emerald-400 uppercase">⚡ Change Admin (Rani2026) User &amp; Pass (No Old Pass Needed)</h4>
              <input id="sub-adm-user" value="\${SETTINGS.admin.subAdminUsername || 'Rani2026'}" placeholder="New Admin Username" class="w-full p-2.5 bg-black border border-white/15 rounded-lg text-xs text-white" />
              <input id="sub-adm-pass" value="\${SETTINGS.admin.subAdminPassword || 'Rani2026'}" placeholder="New Admin Password" class="w-full p-2.5 bg-black border border-white/15 rounded-lg text-xs text-amber-300 font-mono-num" />
              <button onclick="overrideSubAdminPass()" class="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-lg uppercase cursor-pointer">✓ Save New Admin User &amp; Pass</button>
            </div>

            <div class="bg-black/60 p-4 rounded-xl border border-red-500/40 space-y-2.5">
              <h4 class="font-extrabold text-xs sm:text-sm text-amber-400 uppercase">🩸 SuperAdmin (Sagor2026) Primary &amp; Secondary Pass</h4>
              <input id="sup-adm-user" value="\${SETTINGS.admin.username || 'Sagor2026'}" placeholder="SuperAdmin Username" class="w-full p-2.5 bg-black border border-white/15 rounded-lg text-xs text-white" />
              <input id="sup-adm-pass" value="\${SETTINGS.admin.password || 'gp2026'}" placeholder="Primary Password" class="w-full p-2.5 bg-black border border-white/15 rounded-lg text-xs text-amber-300 font-mono-num" />
              <input id="sup-adm-sec" value="\${SETTINGS.admin.secondaryPassword || '1810908970'}" placeholder="Secondary Password" class="w-full p-2.5 bg-black border border-white/15 rounded-lg text-xs text-cyan-300 font-mono-num" />
              <button onclick="saveSuperAdminCreds()" class="w-full py-2 red-cat-btn text-white text-xs font-extrabold rounded-lg uppercase cursor-pointer">✓ Save SuperAdmin Credentials</button>
            </div>
          </div>

          <!-- Manage & Delete Movies -->
          <div class="bg-black/60 p-4 rounded-xl border border-white/10">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-extrabold text-sm text-white">Manage Movies (\${MOVIES.length})</h4>
              <button onclick="if(confirm('Delete ALL movies?')){MOVIES=[];saveLocal();renderMovies();renderAdminPanel();}" class="px-3 py-1 bg-rose-600 text-white text-[11px] font-extrabold rounded cursor-pointer">Delete All Movies</button>
            </div>
            <div class="max-h-60 overflow-y-auto divide-y divide-white/10 text-xs">
              \${MOVIES.map(m => \`
                <div class="py-2 flex items-center justify-between gap-2">
                  <div class="truncate">
                    <span class="font-bold text-white">\${m.fullDisplayTitle}</span>
                    <span class="text-emerald-400 font-mono-num ml-2">[Real Views: \${m.realViews || 0} | Real Clicks: \${m.realLinkClicks || 0}]</span>
                  </div>
                  <button onclick="deleteMovieById('\${m.id}')" class="px-2.5 py-1 bg-red-600/30 hover:bg-red-600 text-white rounded text-[11px] font-bold shrink-0 cursor-pointer">Delete</button>
                </div>
              \`).join('')}
            </div>
          </div>
        </div>
      \`;
    }

    function overrideSubAdminPass() {
      const u = (document.getElementById('sub-adm-user').value || '').trim();
      const p = (document.getElementById('sub-adm-pass').value || '').trim();
      if (!u || !p) return;
      SETTINGS.admin.subAdminUsername = u;
      SETTINGS.admin.subAdminPassword = p;
      saveLocal();
      renderAdminPanel();
    }

    function saveSuperAdminCreds() {
      const u = (document.getElementById('sup-adm-user').value || '').trim();
      const p = (document.getElementById('sup-adm-pass').value || '').trim();
      const s = (document.getElementById('sup-adm-sec').value || '').trim();
      if (!u || !p) return;
      SETTINGS.admin.username = u;
      SETTINGS.admin.password = p;
      SETTINGS.admin.secondaryPassword = s || '1810908970';
      SETTINGS.admin.backupPassword = s || '1810908970';
      saveLocal();
      renderAdminPanel();
    }

    function deleteMovieById(id) {
      MOVIES = MOVIES.filter(m => m.id !== id);
      saveLocal();
      renderMovies();
      renderAdminPanel();
    }

    function showForgotRecovery() {
      const container = document.getElementById('admin-body');
      container.innerHTML = \`
        <div class="max-w-sm mx-auto space-y-3 py-4">
          <p class="text-xs text-red-400 font-bold uppercase">Security Question:</p>
          <p class="text-sm font-extrabold text-white">What Is my Wife Name?</p>
          <input id="sec-ans" type="text" autocomplete="off" placeholder="Your Answer" class="w-full px-3.5 py-2.5 bg-black border border-white/15 rounded-lg text-sm text-white" />
          <div id="rec-result" class="text-xs text-emerald-400"></div>
          <div class="flex justify-between pt-1">
            <button onclick="renderAdminPanel()" class="text-xs text-slate-400 cursor-pointer">← Back</button>
            <button onclick="verifySecurityQuestion()" class="px-4 py-2 red-cat-btn text-white text-xs font-bold rounded-lg cursor-pointer">Verify</button>
          </div>
        </div>
      \`;
    }

    function verifySecurityQuestion() {
      const ans = (document.getElementById('sec-ans').value || '').trim().toLowerCase();
      if (ans === 'rani') {
        isAdminLoggedIn = true;
        authenticatedRole = 'SUPERADMIN';
        triggerCautionPopup();
        renderAdminPanel();
      } else {
        document.getElementById('rec-result').innerHTML = '<span class="text-red-400">Incorrect answer.</span>';
      }
    }

    function doAdminLogin() {
      const u = (document.getElementById('adm-user').value || '').trim().toLowerCase();
      const p = (document.getElementById('adm-pass').value || '').trim();

      if (selectedLoginRole === 'ADMIN') {
        const subU = (SETTINGS.admin.subAdminUsername || 'Rani2026').toLowerCase();
        const subP = SETTINGS.admin.subAdminPassword || 'Rani2026';
        if ((u === subU || u === 'rani2026') && (p === subP || p === 'Rani2026')) {
          isAdminLoggedIn = true;
          authenticatedRole = 'ADMIN';
          adminUploadedCount = 0;
          triggerCautionPopup();
          renderAdminPanel();
          return;
        }
        const errEl = document.getElementById('adm-err');
        if (errEl) errEl.textContent = 'Invalid Admin Username or Password!';
        return;
      }

      // SUPERADMIN Login
      const expectedU = (SETTINGS.admin.username || 'Sagor2026').toLowerCase();
      const secP = SETTINGS.admin.secondaryPassword || SETTINGS.admin.backupPassword || '1810908970';
      if ((u === expectedU || u === 'sagor2026' || u === 'sagor2024') && (p === SETTINGS.admin.password || p === secP || p === 'gp2026' || p === '1810908970')) {
        isAdminLoggedIn = true;
        authenticatedRole = 'SUPERADMIN';
        triggerCautionPopup();
        renderAdminPanel();
      } else {
        const errEl = document.getElementById('adm-err');
        if (errEl) errEl.textContent = 'Invalid SuperAdmin Username or Password!';
      }
    }

    function quickAddMovie() {
      if (authenticatedRole === 'ADMIN' && adminUploadedCount >= 1) {
        return;
      }
      const title = document.getElementById('new-title').value.trim();
      if (!title) return;
      const year = document.getElementById('new-year').value.trim() || '2026';
      const lang = document.getElementById('new-lang').value.trim() || 'BANGLA';
      const qual = document.getElementById('new-qual').value.trim() || '1080P WEB-DL';
      const poster = document.getElementById('new-poster').value.trim() || (MOVIES[0] ? MOVIES[0].posterUrl : 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=700&q=80');
      const story = document.getElementById('new-story').value.trim() || 'Official high-speed HD release on MoviesHub.';
      const link1080 = document.getElementById('new-1080').value.trim() || '#';

      MOVIES.unshift({
        id: 'mov-' + Date.now(),
        title,
        fullDisplayTitle: title + ' (' + year + ') ' + qual.toUpperCase() + ' [' + lang.toUpperCase() + ']',
        year,
        cast: 'Official Star Cast',
        language: lang.toUpperCase(),
        quality: qual.toUpperCase(),
        genre: ['Action', 'Drama'],
        categories: [lang.toUpperCase(), 'MOVIES', 'LIVENOW'],
        type: 'MOVIE',
        storyline: story,
        posterUrl: poster,
        screenshots: [poster],
        links: { p480: link1080, p720: link1080, p1080: link1080, p4k: link1080 },
        isPinned: false,
        views: 240,
        linkClicks: 18,
        realViews: 0,
        realLinkClicks: 0
      });
      if (authenticatedRole === 'ADMIN') {
        adminUploadedCount += 1;
      }
      saveLocal();
      renderMovies();
      renderAdminPanel();
    }

    // Initialize Portal
    renderLogoFX();
    renderCategories();
    renderMovies();
  </script>
  ${isBloggerXml ? '</b:includable></b:widget></b:section>' : ''}
</body>
</html>`;

  return coreHtml;
}

/**
 * Properly splits the generated HTML into 3 clean separate files (index.html, style.css, app.js)
 * without corrupting the Tailwind CDN <script> tag in <head>!
 */
export function extractSeparateHtmlCssJs(allInOneHtml: string): {
  indexHtml: string;
  styleCss: string;
  appJs: string;
} {
  const styleMatch = allInOneHtml.match(
    /<style id="mh-core-styles">([\s\S]*?)<\/style>/i
  );
  const scriptMatch = allInOneHtml.match(
    /<script id="mh-core-script">([\s\S]*?)<\/script>/i
  );

  const styleCss = styleMatch ? styleMatch[1].trim() : '';
  const appJs = scriptMatch ? scriptMatch[1].trim() : '';

  const indexHtml = allInOneHtml
    .replace(
      /<style id="mh-core-styles">[\s\S]*?<\/style>/i,
      '<link rel="stylesheet" href="style.css" />'
    )
    .replace(
      /<script id="mh-core-script">[\s\S]*?<\/script>/i,
      '<script src="app.js"></script>'
    );

  return { indexHtml, styleCss, appJs };
}
