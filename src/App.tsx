/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Home,
  Rocket,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Film,
  Users,
  Share2,
  Check
} from 'lucide-react';
import {
  MovieItem,
  SiteSettings,
  DailyAnalyticsPoint,
  MovieRequestItem,
  ChatMessageItem
} from './types';
import {
  RED_GRID_CATEGORIES,
  SPECIAL_BANNER_CATEGORIES,
  formatViewCount,
  safeCopyToClipboard
} from './constants';
import { MovieDetailModal } from './components/MovieDetailModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AdsterraSlot } from './components/AdsterraSlot';
import { VisitorEngagementOverlay } from './components/VisitorEngagementOverlay';
import { Blockbuster3DLogo } from './components/Blockbuster3DLogo';
import { playSurroundTouchSound } from './utils/soundFX';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'MOVIESHUB',
  officialDomain: 'MoviesHub.com',
  vpnNoticeText:
    'যদি সাইট লোড না হয়, 1.1.1.1 VPN ব্যবহার করে নিচের বিকল্প ডোমেইনগুলোর যেকোনো একটি ব্যবহার করুন:',
  mirrorLinks: [
    { label: '.ONE', url: '#one', colorClass: 'bg-emerald-500 text-white' },
    { label: '.WORK', url: '#work', colorClass: 'bg-blue-600 text-white' },
    { label: '.SHOP', url: '#shop', colorClass: 'bg-amber-400 text-slate-950' },
    { label: '.TV', url: '#tv', colorClass: 'bg-cyan-400 text-slate-950' }
  ],
  howToDownloadText:
    'যেকোনো মুভি বা সিরিজ ডাউনলোড করতে পোস্টারে ক্লিক করুন। এরপর নিচে স্ক্রল করে 480p, 720p, 1080p অথবা 4K UHD বাটনে ক্লিক করলেই ১০ সেকেন্ডের মধ্যে সরাসরি হাই-স্পিড ডাউনলোড লিংক আনলক হয়ে যাবে।',
  howToDownloadVideoUrl: 'https://movieshub.example.com/guide',
  adsterra: {
    enabled: true,
    headerBannerCode: '',
    nativeBannerCode: '',
    downloadPageBannerCode: '',
    directSmartlinkUrl: '',
    popunderScriptCode: ''
  },
  admin: {
    username: 'Sagor2024',
    password: '***'
  }
};

export default function App() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [analytics, setAnalytics] = useState<DailyAnalyticsPoint[]>([]);
  const [requests, setRequests] = useState<MovieRequestItem[]>([]);
  const [chats, setChats] = useState<ChatMessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Live Users Online Counter (fluctuates realistically between 340 and 495)
  const [liveUsersOnline, setLiveUsersOnline] = useState<number>(384);

  // Persistent Visitor ID & Display Name for Live Chat with Admin
  const [visitorId] = useState<string>(() => {
    const saved = localStorage.getItem('mh_visitor_id');
    if (saved) return saved;
    const generated = `vis-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('mh_visitor_id', generated);
    return generated;
  });

  const [visitorName, setVisitorName] = useState<string>(() => {
    return localStorage.getItem('mh_visitor_name') || 'Movie Fan';
  });

  const handleSetVisitorName = (name: string) => {
    const clean = name.trim() || 'Movie Fan';
    setVisitorName(clean);
    localStorage.setItem('mh_visitor_name', clean);
  };

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Modals State
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [isHowToOpen, setIsHowToOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [copiedSiteShare, setCopiedSiteShare] = useState(false);
  const deepLinkHandledRef = useRef(false);

  // Completely Silent Stealth 12-14 Logo Click Counter
  const logoClickCountRef = useRef(0);
  const clickResetTimer = useRef<number | null>(null);

  // WebSocket Reference for Live Chat & Real-time Requests
  const wsRef = useRef<WebSocket | null>(null);

  const fetchPortalState = async (isAdminRefresh = true) => {
    try {
      const resp = await fetch(`/api/state${isAdminRefresh ? '?adminRefresh=1' : ''}`);
      if (resp.ok) {
        const data = await resp.json();
        const loadedMovies: MovieItem[] = data.movies || [];
        setMovies(loadedMovies);
        if (data.settings) setSettings(data.settings);
        if (data.analytics) setAnalytics(data.analytics);
        if (data.requests) setRequests(data.requests);
        if (data.chats) setChats(data.chats);

        // Auto-open movie modal if a friend or Google Search user clicked a ?movie=ID deep link
        if (!deepLinkHandledRef.current && loadedMovies.length > 0) {
          const params = new URLSearchParams(window.location.search);
          const movieIdParam = params.get('movie');
          if (movieIdParam) {
            const matched = loadedMovies.find((m) => m.id === movieIdParam);
            if (matched) {
              deepLinkHandledRef.current = true;
              setSelectedMovie(matched);
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch portal state:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalState(false);

    // Connect WebSocket for Real-Time Visitor <-> Admin Chat
    let reconnectTimer: number | null = null;
    const connectWs = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/chat`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (payload.type === 'init') {
              if (Array.isArray(payload.chats)) setChats(payload.chats);
              if (Array.isArray(payload.requests)) setRequests(payload.requests);
            } else if (payload.type === 'chat:message' && payload.message) {
              setChats((prev) => {
                if (prev.some((c) => c.id === payload.message.id)) return prev;
                return [...prev, payload.message];
              });
            } else if (payload.type === 'request:created' && payload.request) {
              setRequests((prev) => {
                if (prev.some((r) => r.id === payload.request.id)) return prev;
                return [payload.request, ...prev];
              });
            }
          } catch (_e) {
            // ignore malformed frame
          }
        };

        ws.onclose = () => {
          reconnectTimer = window.setTimeout(connectWs, 4000);
        };
      } catch (_err) {
        // ignore ws error
      }
    };

    connectWs();

    // Live View Count Auto-Pulse + Live Users Online + Real-Time Chat/Request Sync
    const interval = window.setInterval(async () => {
      setLiveUsersOnline((prev) => {
        const delta = Math.floor(Math.random() * 19) - 9;
        return Math.max(295, Math.min(540, prev + delta));
      });

      try {
        const resp = await fetch('/api/movies/live-pulse', { method: 'POST' });
        if (resp.ok) {
          const data = await resp.json();
          if (data.movies) setMovies(data.movies);
          if (data.analytics) setAnalytics(data.analytics);
          if (Array.isArray(data.chats)) setChats(data.chats);
          if (Array.isArray(data.requests)) setRequests(data.requests);
        }
      } catch (_err) {
        setMovies((prev) =>
          prev.map((m) => ({
            ...m,
            views: (m.views || 100) + Math.floor(Math.random() * 3) + 1
          }))
        );
      }
    }, 6000);

    // Global Passive Visitor Click Surround Sound Listener (Zero UI lag)
    const handleGlobalInteractiveClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('button, a, article, [role="button"]');
      if (interactive) {
        const isCard = interactive.tagName.toLowerCase() === 'article';
        playSurroundTouchSound(isCard ? 'card' : 'soft');
      }
    };

    window.addEventListener('click', handleGlobalInteractiveClick, { passive: true });

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('click', handleGlobalInteractiveClick);
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Send Visitor Chat Message via HTTP + WebSocket (Guaranteed Delivery)
  const handleSendVisitorChatMessage = async (text: string) => {
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const optimisticMsg: ChatMessageItem = {
      id: msgId,
      visitorId,
      visitorName,
      sender: 'VISITOR',
      text,
      createdAt: new Date().toISOString()
    };

    setChats((prev) => [...prev, optimisticMsg]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'chat:send',
          ...optimisticMsg
        })
      );
    }

    try {
      const resp = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optimisticMsg)
      });
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.chats)) setChats(data.chats);
      }
    } catch (_e) {
      // optimistic state already applied
    }
  };

  // Send Admin Chat Reply to Specific Visitor via HTTP + WebSocket (Guaranteed Delivery)
  const handleSendAdminChatReply = async (
    targetVisitorId: string,
    targetVisitorName: string,
    text: string
  ) => {
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const optimisticMsg: ChatMessageItem = {
      id: msgId,
      visitorId: targetVisitorId,
      visitorName: targetVisitorName,
      sender: 'ADMIN',
      text,
      createdAt: new Date().toISOString()
    };

    setChats((prev) => [...prev, optimisticMsg]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'chat:send',
          ...optimisticMsg
        })
      );
    }

    try {
      const resp = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optimisticMsg)
      });
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.chats)) setChats(data.chats);
      }
    } catch (_e) {
      // optimistic state already applied
    }
  };

  // Submit Movie Request from Visitor Floating Modal
  const handleSubmitMovieRequest = async (reqData: {
    visitorName: string;
    movieTitle: string;
    language: string;
    quality: string;
    note: string;
  }) => {
    const resp = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData)
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.request) {
        setRequests((prev) => {
          if (prev.some((r) => r.id === data.request.id)) return prev;
          return [data.request, ...prev];
        });
      }
    }
  };

  // Mark Movie Request as Done (Admin)
  const handleMarkRequestDone = async (id: string) => {
    const resp = await fetch(`/api/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PUBLISHED' })
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.requests) setRequests(data.requests);
    }
  };

  // Delete Movie Request (Admin)
  const handleDeleteRequest = async (id: string) => {
    const resp = await fetch(`/api/requests/${id}`, {
      method: 'DELETE'
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.requests) setRequests(data.requests);
    }
  };

  // Completely secret 16-click logo handler (zero visual counter or tooltip)
  const handleLogoStealthClick = () => {
    logoClickCountRef.current += 1;

    if (clickResetTimer.current) {
      window.clearTimeout(clickResetTimer.current);
    }

    clickResetTimer.current = window.setTimeout(() => {
      logoClickCountRef.current = 0;
    }, 4000);

    if (logoClickCountRef.current >= 16) {
      logoClickCountRef.current = 0;
      setIsAdminModalOpen(true);
    }
  };

  const handleOpenMovie = async (movie: MovieItem) => {
    setSelectedMovie(movie);
    try {
      const resp = await fetch(`/api/movies/${movie.id}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'view' })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.movie) {
          setMovies((prev) =>
            prev.map((m) => (m.id === movie.id ? data.movie : m))
          );
          setSelectedMovie(data.movie);
        }
        if (data.analytics) setAnalytics(data.analytics);
      }
    } catch (_e) {
      // ignore
    }
  };

  const handleTrackDownloadClick = async (
    movieId: string,
    _resolution: string,
    _targetUrl: string
  ) => {
    try {
      const resp = await fetch(`/api/movies/${movieId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'click' })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.movie) {
          setMovies((prev) =>
            prev.map((m) => (m.id === movieId ? data.movie : m))
          );
          setSelectedMovie(data.movie);
        }
        if (data.analytics) setAnalytics(data.analytics);
      }
    } catch (_e) {
      // ignore
    }
  };

  const handleAddMovie = async (newMovieData: Partial<MovieItem>) => {
    const resp = await fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMovieData)
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.movie) {
        setMovies((prev) => [data.movie, ...prev]);
      }
    }
  };

  const handleUpdateMovie = async (
    id: string,
    updates: Partial<MovieItem>
  ) => {
    const resp = await fetch(`/api/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.movie) {
        setMovies((prev) => prev.map((m) => (m.id === id ? data.movie : m)));
      }
    }
  };

  const handleDeleteMovie = async (id: string) => {
    const resp = await fetch(`/api/movies/${id}`, {
      method: 'DELETE'
    });
    if (resp.ok) {
      setMovies((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleUpdateSettings = async (newSettings: SiteSettings) => {
    const resp = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.settings) setSettings(data.settings);
    }
  };

  const filteredMovies = movies
    .filter((m) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        m.categories.some(
          (c) => c.toUpperCase() === selectedCategory.toUpperCase()
        ) ||
        m.language.toUpperCase().includes(selectedCategory.toUpperCase());

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.fullDisplayTitle.toLowerCase().includes(q) ||
        m.language.toLowerCase().includes(q) ||
        m.cast.toLowerCase().includes(q) ||
        m.genre.some((g) => g.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMovies.length / itemsPerPage)
  );
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative min-h-screen bg-[#050508] text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* ZERO-LAG HARDWARE-ACCELERATED AMBIENT RADIAL ATMOSPHERE (No heavy CSS blur filters) */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.16) 0%, transparent 55%), radial-gradient(circle at 10% 45%, rgba(159, 18, 57, 0.1) 0%, transparent 45%), radial-gradient(circle at 90% 85%, rgba(185, 28, 28, 0.12) 0%, transparent 45%)'
        }}
      />

      {/* Global Popunder / Social Bar Adsterra Script Injector */}
      <AdsterraSlot
        enabled={settings.adsterra.enabled}
        htmlCode={settings.adsterra.popunderScriptCode}
        isGlobalScript={true}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 pt-6 pb-20">
        {/* CENTERED GLASS HEADER BLOCK — AUTOMATIC MIDDLE OF TOP & BOTTOM LOGO ON ANY DEVICE */}
        <header className="glass-panel rounded-2xl px-4 py-5 sm:px-6 sm:py-6 text-center select-none relative flex flex-col items-center justify-center">
          {/* Top Row: Live Users Online Counter Pill */}
          <div className="w-full flex items-center justify-center mb-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/85 border border-emerald-500/35 text-[11px] font-bold text-emerald-300 shadow">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono-num font-extrabold text-white">
                {liveUsersOnline}
              </span>
              <span>Users Watching &amp; Downloading Now</span>
            </div>
          </div>

          {/* AUTOMATIC MIDDLE-OF-TOP-AND-BOTTOM LOGO ZONE FOR ALL DEVICES */}
          <div className="w-full flex flex-col items-center justify-center py-2 sm:py-3 my-auto">
            <Blockbuster3DLogo
              siteName={settings.siteName}
              onStealthClick={handleLogoStealthClick}
            />
          </div>

          {/* Bottom Row: Official Link, VPN Notice, Mirrors & Action Buttons */}
          <div className="w-full flex flex-col items-center justify-center mt-1">
            <p className="text-xs sm:text-sm text-emerald-400 font-medium">
              Working official link:{' '}
              <span className="text-amber-400 font-bold">
                {settings.officialDomain}
              </span>
            </p>

            {/* Bangla VPN Notice */}
            <p className="text-[11px] sm:text-xs text-slate-300/90 max-w-xl mx-auto mt-1 leading-relaxed">
              ⚠️ {settings.vpnNoticeText}
            </p>

            {/* Mirror Domain Row: HOME, .ONE, .WORK, .SHOP, .TV */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="px-3.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-extrabold flex items-center gap-1.5 shadow transition-transform duration-100 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Home className="w-3.5 h-3.5" />
                <span>HOME</span>
              </button>

              {settings.mirrorLinks.map((mirror) => (
                <button
                  key={mirror.label}
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-extrabold shadow hover:brightness-110 transition-transform duration-100 active:scale-95 cursor-pointer whitespace-nowrap ${mirror.colorClass}`}
                >
                  {mirror.label}
                </button>
              ))}
            </div>

            {/* How to Download & Share with Friends Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3">
              <button
                type="button"
                onClick={() => setIsHowToOpen(true)}
                className="px-4 py-1.5 rounded-md bg-gradient-to-r from-amber-700 to-red-800 hover:brightness-110 border border-amber-500/30 text-amber-100 text-xs font-extrabold inline-flex items-center gap-1.5 shadow-lg transition-transform duration-100 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Rocket className="w-3.5 h-3.5 text-amber-300" />
                <span>ডাউনলোড করার নিয়ম</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  const publicShareUrl = window.location.origin;
                  await safeCopyToClipboard(publicShareUrl);
                  setCopiedSiteShare(true);
                  setTimeout(() => setCopiedSiteShare(false), 2500);
                }}
                className="px-3.5 py-1.5 rounded-md bg-emerald-600/25 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-200 hover:text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-lg cursor-pointer whitespace-nowrap transition-transform duration-100 active:scale-95"
              >
                {copiedSiteShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Share with Friends</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* REAL ADSTERRA TOP BANNER EXECUTION */}
        <AdsterraSlot
          enabled={settings.adsterra.enabled}
          htmlCode={settings.adsterra.headerBannerCode}
          className="mt-4"
        />

        {/* RED CATEGORY BUTTONS GRID (240FPS GPU-Accelerated) */}
        <section className="mt-4" aria-label="Movie Categories">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RED_GRID_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(isActive ? 'ALL' : cat.id);
                    setCurrentPage(1);
                  }}
                  className={`py-2.5 px-2.5 rounded-lg font-extrabold text-xs sm:text-[13px] tracking-wide uppercase flex items-center justify-center gap-1.5 transition-transform duration-100 hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-red-950 text-amber-300 ring-2 ring-amber-400 shadow-lg shadow-red-600/30'
                      : 'red-glass-btn text-white'
                  }`}
                >
                  <span className="text-sm leading-none">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ZERO-LAG SEARCH BAR */}
        <section className="mt-4">
          <div className="flex items-stretch rounded-xl overflow-hidden border border-red-500/45 bg-[#0a0a0f] shadow-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Movie বা Series-এর English নাম লিখুন"
              className="w-full px-4 py-3.5 bg-transparent text-white placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setCurrentPage(1)}
              className="px-6 red-glass-btn text-white font-extrabold flex items-center justify-center transition cursor-pointer shrink-0"
              aria-label="Search movies"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
            </motion.button>
          </div>
        </section>

        {/* 6 SPECIAL COLORED FEATURE BANNERS */}
        <section className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SPECIAL_BANNER_CATEGORIES.map((banner) => {
              const isActive = selectedCategory === banner.id;
              return (
                <motion.button
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  key={banner.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(isActive ? 'ALL' : banner.id);
                    setCurrentPage(1);
                  }}
                  className={`${banner.bannerGradient} ${
                    isActive ? 'ring-2 ring-amber-300' : ''
                  } py-2.5 px-3.5 rounded-xl text-white font-extrabold text-xs sm:text-sm uppercase flex items-center justify-between shadow-lg hover:brightness-110 transition cursor-pointer border border-white/15`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-base leading-none">{banner.icon}</span>
                    <span className="tracking-wide truncate">{banner.label}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono-num font-bold tracking-wider shrink-0">
                    {banner.badgeText}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* SECTION HEADERS */}
        <div className="mt-6 border-b border-red-500/30 pb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-5 bg-red-500 rounded-full inline-block"></span>
            <h2 className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-slate-200">
              {settings.siteName} — YOUR DOWNLOAD
            </h2>
          </div>
          {selectedCategory !== 'ALL' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
            >
              Reset Filter ({selectedCategory}) ✕
            </button>
          )}
        </div>

        <div className="mt-3 border-b border-red-500/35 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-5 bg-red-500 rounded-full inline-block"></span>
            <h3 className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-slate-100">
              {selectedCategory === 'ALL'
                ? 'RECENTLY UPDATED'
                : `${selectedCategory} RELEASES`}
            </h3>
          </div>
          <span className="text-[11px] font-mono-num text-slate-400 font-bold">
            {filteredMovies.length} Releases · Page {currentPage}/{totalPages}
          </span>
        </div>

        {/* MOVIE POSTER CARDS GRID */}
        <section className="mt-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="aspect-[3/4] rounded-xl glass-card animate-pulse"
                />
              ))}
            </div>
          ) : paginatedMovies.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 sm:p-12 text-center space-y-3 border border-rose-500/25">
              <Film className="w-11 h-11 text-rose-400 mx-auto" />
              <h4 className="text-base sm:text-lg font-extrabold text-white">
                {movies.length === 0
                  ? 'Catalog is Clean & Ready for Cloning'
                  : `No Releases Found in "${selectedCategory}"`}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                {movies.length === 0
                  ? 'All pre-loaded movies have been cleaned. Open the Admin Panel to clone any single movie, single page, or full website in newest-first order.'
                  : 'Try clearing your search filter or switching to another category.'}
              </p>
              {(selectedCategory !== 'ALL' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg red-glass-btn text-white text-xs font-extrabold cursor-pointer"
                >
                  Show All Releases
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {paginatedMovies.map((movie, idx) => (
                <motion.article
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.24,
                    delay: Math.min(idx * 0.03, 0.25),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  key={movie.id}
                  onClick={() => handleOpenMovie(movie)}
                  className="glass-card rounded-2xl overflow-hidden hover:-translate-y-1.5 group cursor-pointer flex flex-col"
                >
                  {/* Poster Container with Corner Overlays */}
                  <div className="relative aspect-[3/4] w-full bg-[#07070c] overflow-hidden">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (!img.dataset.fallback) {
                          img.dataset.fallback = '1';
                          img.src =
                            'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=700&q=80';
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Subtle Bottom Gradient Scrim */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

                    {/* Top-Left: PINNED Yellow Badge or NEW Badge */}
                    {movie.isPinned ? (
                      <span className="absolute top-2 left-2 bg-[#facc15] text-slate-950 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-md">
                        PINNED
                      </span>
                    ) : idx === 0 && currentPage === 1 ? (
                      <span className="absolute top-2 left-2 bg-rose-600/95 border border-rose-300/30 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-md">
                        NEWEST
                      </span>
                    ) : null}

                    {/* Top-Right: Print Quality Badge */}
                    <span className="absolute top-2 right-2 bg-black/85 border border-amber-400/35 text-amber-300 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-md">
                      {movie.quality}
                    </span>

                    {/* Above Bottom-Right: Live Updating Eye View Counter Pill */}
                    <div className="absolute bottom-8 right-1.5 bg-black/85 border border-rose-500/35 text-white text-[11px] font-mono-num font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <Eye className="w-3 h-3 text-rose-300" />
                      <span>{formatViewCount(movie.views)}</span>
                    </div>

                    {/* Bottom-Left: Language Green Badge */}
                    <span className="absolute bottom-1.5 left-1.5 bg-emerald-700/95 border border-emerald-400/30 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-tight shadow max-w-[68%] truncate">
                      {movie.language}
                    </span>

                    {/* Bottom-Right: MOVIE (Red) or SERIES (Blue) Badge */}
                    <span
                      className={`absolute bottom-1.5 right-1.5 ${
                        movie.type === 'SERIES' ? 'bg-blue-700/95' : 'bg-rose-700/95'
                      } text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase shadow`}
                    >
                      {movie.type}
                    </span>
                  </div>

                  {/* Card Footer Info */}
                  <div className="p-3.5 text-center flex-1 flex flex-col justify-between bg-gradient-to-b from-[#0d0a14] to-[#07070b]">
                    <div className="space-y-1">
                      {movie.episodeBadge && (
                        <div className="flex items-center justify-center mb-1">
                          <span className="border border-emerald-500/60 bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                            {movie.episodeBadge}
                          </span>
                        </div>
                      )}
                      <h4 className="text-xs sm:text-[13.5px] font-extrabold text-white leading-snug line-clamp-2 group-hover:text-rose-400 transition-colors">
                        {movie.fullDisplayTitle}
                      </h4>
                      {movie.storyline && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 pt-0.5">
                          {movie.storyline}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* DOWN-SIDE ONLY: BOTTOM NUMBERED PAGE NAVIGATION BAR (1, 2, 3, 4, 5 ... NEXT PAGE) */}
          <div className="mt-8 glass-panel rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3.5 border border-rose-500/35 shadow-xl shadow-rose-950/20">
            <div className="text-xs font-mono-num text-slate-300">
              Showing Page{' '}
              <span className="text-amber-400 font-extrabold">{currentPage}</span> of{' '}
              <span className="text-white font-extrabold">{totalPages}</span>{' '}
              <span className="text-slate-400">({filteredMovies.length} Releases)</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 320, behavior: 'smooth' });
                }}
                className="px-3.5 h-9 rounded-xl bg-white/5 hover:bg-rose-600/35 border border-white/10 disabled:opacity-40 text-xs font-extrabold text-slate-200 flex items-center gap-1 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              {(() => {
                const maxVisibleButtons = Math.max(5, Math.min(totalPages, 10));
                let startP = Math.max(1, currentPage - 2);
                let endP = Math.min(totalPages, startP + maxVisibleButtons - 1);
                if (endP - startP + 1 < maxVisibleButtons) {
                  startP = Math.max(1, endP - maxVisibleButtons + 1);
                }
                const pagesToRender: number[] = [];
                for (let p = startP; p <= Math.max(endP, Math.min(5, totalPages)); p++) {
                  pagesToRender.push(p);
                }
                const displayPages =
                  totalPages >= 5
                    ? pagesToRender
                    : [1, 2, 3, 4, 5];

                return displayPages.map((pageNum) => {
                  const isCurrent = currentPage === pageNum;
                  const isAvailable = pageNum <= totalPages;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => {
                        if (!isAvailable) return;
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 320, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-xl font-mono-num text-xs font-extrabold flex items-center justify-center transition cursor-pointer ${
                        isCurrent
                          ? 'red-glass-btn text-white ring-2 ring-amber-400/80 shadow-lg shadow-rose-600/30'
                          : isAvailable
                          ? 'bg-white/5 hover:bg-rose-600/30 border border-white/15 text-slate-200 hover:text-white'
                          : 'bg-white/[0.02] border border-white/5 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                });
              })()}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 320, behavior: 'smooth' });
                }}
                className="px-4 h-9 rounded-xl red-glass-btn disabled:opacity-40 text-xs font-extrabold text-white flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-rose-600/25"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* REAL ADSTERRA NATIVE WIDGET EXECUTION */}
        <AdsterraSlot
          enabled={settings.adsterra.enabled}
          htmlCode={settings.adsterra.nativeBannerCode}
          className="mt-6"
        />
      </div>

      {/* DOWN-SIDE COMPACT DOCKED BAR: Request Movie & Admin Chat Small Icon Buttons + AdBlock Detector + Download Toasts */}
      <VisitorEngagementOverlay
        movies={movies}
        chats={chats}
        visitorId={visitorId}
        visitorName={visitorName}
        onSetVisitorName={handleSetVisitorName}
        onSendChatMessage={handleSendVisitorChatMessage}
        onSubmitMovieRequest={handleSubmitMovieRequest}
      />

      {/* ULTRA-CLEAN FOOTER — NO ADMIN HINT OR BLOGSPOT BUTTON */}
      <footer className="relative z-10 border-t border-red-500/20 bg-black/80 backdrop-blur-md py-5 px-4 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {new Date().getFullYear()}{' '}
            <strong className="text-white">{settings.siteName}</strong> — Official Cinema &amp; Series Streaming Portal.
          </p>
          <p className="text-slate-500">
            Bangla · English · Hindi · Tamil · Telugu · Turkish
          </p>
        </div>
      </footer>

      {/* MOVIE DETAILS, AUTO-WATERMARK SCREENSHOTS & 10-SECOND DOWNLOAD GENERATOR MODAL */}
      <MovieDetailModal
        movie={selectedMovie}
        adsterra={settings.adsterra}
        siteDomain={settings.officialDomain}
        onClose={() => setSelectedMovie(null)}
        onTrackClick={handleTrackDownloadClick}
      />

      {/* COMPLETELY SECRET ADMIN PANEL (Triggered silently by 12-14 clicks on logo) */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        movies={movies}
        settings={settings}
        analytics={analytics}
        requests={requests}
        chats={chats}
        onAddMovie={handleAddMovie}
        onUpdateMovie={handleUpdateMovie}
        onDeleteMovie={handleDeleteMovie}
        onUpdateSettings={handleUpdateSettings}
        onSendAdminChatReply={handleSendAdminChatReply}
        onMarkRequestDone={handleMarkRequestDone}
        onDeleteRequest={handleDeleteRequest}
        onRefreshPortalState={fetchPortalState}
      />

      {/* HOW TO DOWNLOAD MODAL */}
      <AnimatePresence>
        {isHowToOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="glass-panel rounded-2xl max-w-md w-full p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-extrabold text-amber-400 flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  <span>ডাউনলোড করার নিয়ম (How to Download)</span>
                </h3>
                <button
                  onClick={() => setIsHowToOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {settings.howToDownloadText}
              </p>
              <div className="bg-black/60 p-3.5 rounded-xl border border-white/10 text-xs text-slate-300 space-y-1.5">
                <div>• Step 1: Click on your desired movie or web series poster.</div>
                <div>• Step 2: View the 4 official watermarked print screenshots &amp; storyline.</div>
                <div>• Step 3: Click 480p, 720p, 1080p, or 4K UHD and wait 10 seconds for the high-speed download link to generate.</div>
              </div>
              <div className="text-right">
                <button
                  onClick={() => setIsHowToOpen(false)}
                  className="px-5 py-2 rounded-lg red-glass-btn text-white text-xs font-extrabold cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
