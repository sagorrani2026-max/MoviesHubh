import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  RefreshCw,
  Film,
  MessageCircle,
  Send,
  X,
  CheckCircle2,
  Download,
  Sparkles
} from 'lucide-react';
import { MovieItem, ChatMessageItem } from '../types';
import { CLICK_LANGUAGE_OPTIONS, CLICK_QUALITY_OPTIONS } from '../constants';

interface VisitorEngagementOverlayProps {
  movies: MovieItem[];
  chats: ChatMessageItem[];
  visitorId: string;
  visitorName: string;
  onSetVisitorName: (name: string) => void;
  onSendChatMessage: (text: string) => void;
  onSubmitMovieRequest: (req: {
    visitorName: string;
    movieTitle: string;
    language: string;
    quality: string;
    note: string;
  }) => Promise<void>;
}

const SAMPLE_LOCATIONS = [
  'Dhaka',
  'Chittagong',
  'Kolkata',
  'Mumbai',
  'Sylhet',
  'Chennai',
  'Hyderabad',
  'Istanbul',
  'Rajshahi',
  'Delhi'
];

const SAMPLE_RESOLUTIONS = ['1080p Full HD', '4K UHD Print', '720p HEVC'];

export const VisitorEngagementOverlay: React.FC<VisitorEngagementOverlayProps> = ({
  movies,
  chats,
  visitorId,
  visitorName,
  onSetVisitorName,
  onSendChatMessage,
  onSubmitMovieRequest
}) => {
  // 1. AdBlock Detector State
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [adBlockDismissed, setAdBlockDismissed] = useState(false);

  // 2. Live Download Toast Notification State
  const [liveToast, setLiveToast] = useState<{
    city: string;
    movieTitle: string;
    resolution: string;
  } | null>(null);

  // 3. Request a Movie Modal State
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqLang, setReqLang] = useState('BANGLA');
  const [reqQuality, setReqQuality] = useState('1080P WEB-DL');
  const [reqNote, setReqNote] = useState('');
  const [reqSuccess, setReqSuccess] = useState(false);

  // 4. Live Online Chat with Admin Modal/Drawer State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [tempNameInput, setTempNameInput] = useState(visitorName);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Detect AdBlocker using a bait element
  useEffect(() => {
    const checkAdBlocker = () => {
      const bait = document.createElement('div');
      bait.className =
        'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-banner adsbox';
      bait.style.position = 'absolute';
      bait.style.top = '-9999px';
      bait.style.left = '-9999px';
      bait.style.width = '1px';
      bait.style.height = '1px';
      document.body.appendChild(bait);

      window.setTimeout(() => {
        const isBlocked =
          bait.offsetParent === null ||
          bait.offsetHeight === 0 ||
          bait.offsetLeft === 0 ||
          window.getComputedStyle(bait).display === 'none' ||
          window.getComputedStyle(bait).visibility === 'hidden';
        if (isBlocked) {
          setAdBlockDetected(true);
        }
        if (document.body.contains(bait)) {
          document.body.removeChild(bait);
        }
      }, 900);
    };

    checkAdBlocker();
  }, []);

  // Periodic Live Download Toast Notification ("Someone from Dhaka just downloaded...")
  useEffect(() => {
    if (movies.length === 0) return;

    const triggerToast = () => {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      const randomCity =
        SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)];
      const randomRes =
        SAMPLE_RESOLUTIONS[
          Math.floor(Math.random() * SAMPLE_RESOLUTIONS.length)
        ];

      setLiveToast({
        city: randomCity,
        movieTitle: randomMovie.title,
        resolution: randomRes
      });

      window.setTimeout(() => {
        setLiveToast(null);
      }, 4500);
    };

    const initialTimer = window.setTimeout(triggerToast, 8000);
    const interval = window.setInterval(triggerToast, 19000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [movies]);

  useEffect(() => {
    if (isChatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, isChatOpen]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;
    await onSubmitMovieRequest({
      visitorName: tempNameInput.trim() || visitorName || 'Movie Fan',
      movieTitle: reqTitle.trim(),
      language: reqLang,
      quality: reqQuality,
      note: reqNote.trim()
    });
    setReqTitle('');
    setReqNote('');
    setReqSuccess(true);
    window.setTimeout(() => {
      setReqSuccess(false);
      setIsRequestOpen(false);
    }, 2000);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (tempNameInput.trim() && tempNameInput.trim() !== visitorName) {
      onSetVisitorName(tempNameInput.trim());
    }
    onSendChatMessage(chatInput.trim());
    setChatInput('');
  };

  // Filter chat messages for this visitor OR public/demo conversation
  const myMessages = chats.filter(
    (c) => c.visitorId === visitorId || c.visitorId === 'visitor-demo'
  );

  return (
    <>
      {/* 1. NON-FLOATING BOTTOM DOCKED COMPACT BAR (Down-Side Docked Small Icon Buttons) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 pb-5">
        <div className="glass-panel rounded-xl px-3.5 py-2.5 border border-red-500/25 flex flex-wrap items-center justify-between gap-2.5 bg-black/75">
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold text-slate-200">
              Need a Movie or Help?
            </span>
            <span className="hidden sm:inline text-slate-400">
              Send a movie request or message Admin directly:
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Compact Small Icon Button: Request Movie */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsRequestOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-amber-300 text-[11px] font-extrabold inline-flex items-center gap-1.5 transition cursor-pointer"
              title="Request a Movie"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Request Movie</span>
            </motion.button>

            {/* Compact Small Icon Button: Admin Chat */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsChatOpen((o) => !o)}
              className="px-2.5 py-1.5 rounded-lg red-glass-btn text-white text-[11px] font-extrabold inline-flex items-center gap-1.5 transition cursor-pointer"
              title="Live Chat with Admin"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Admin Chat</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* 2. LIVE DOWNLOAD ACTIVITY TOAST NOTIFICATION (Bottom-Left) */}
      <AnimatePresence>
        {liveToast && (
          <motion.div
            initial={{ opacity: 0, x: -30, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -30, y: 8 }}
            className="fixed bottom-3 left-3 z-40 max-w-[250px] glass-panel rounded-xl px-3 py-2 flex items-center gap-2.5 pointer-events-none shadow-2xl border border-red-500/35"
          >
            <div className="w-7 h-7 rounded-lg red-glass-btn flex items-center justify-center text-white shrink-0">
              <Download className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 text-[10px] leading-tight">
              <div className="text-slate-300">
                User in <strong className="text-amber-400">{liveToast.city}</strong> downloaded
              </div>
              <div className="font-extrabold text-white truncate mt-0.5">
                {liveToast.movieTitle}
              </div>
              <div className="text-[9px] text-emerald-400 font-mono-num mt-0.5">
                ✓ {liveToast.resolution}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. REQUEST A MOVIE MODAL */}
      <AnimatePresence>
        {isRequestOpen && (
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
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-red-400" />
                  <h3 className="text-base font-extrabold text-white">
                    Request Any Movie or Web Series
                  </h3>
                </div>
                <button
                  onClick={() => setIsRequestOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {reqSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-extrabold text-white">
                    Movie Request Sent to Admin!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Our team will upload your requested movie shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={tempNameInput}
                      onChange={(e) => setTempNameInput(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-red-400 uppercase mb-1">
                      Movie or Series Name *
                    </label>
                    <input
                      type="text"
                      value={reqTitle}
                      onChange={(e) => setReqTitle(e.target.value)}
                      placeholder="e.g. Pushpa 2 / Borbaad / Squid Game S2"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
                      Click Preferred Language:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {CLICK_LANGUAGE_OPTIONS.slice(0, 8).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setReqLang(lang)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                            reqLang === lang
                              ? 'red-glass-btn text-white'
                              : 'bg-black/60 text-slate-400 border border-white/10'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cyan-400 uppercase mb-1">
                      Click Preferred Print Quality:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {CLICK_QUALITY_OPTIONS.slice(0, 5).map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setReqQuality(q)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                            reqQuality === q
                              ? 'bg-cyan-500 text-slate-950'
                              : 'bg-black/60 text-slate-400 border border-white/10'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Additional Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={reqNote}
                      onChange={(e) => setReqNote(e.target.value)}
                      placeholder="e.g. Need Google Drive 1080p link"
                      className="w-full px-3.5 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl red-glass-btn text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Submit Movie Request
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. REAL-TIME ONLINE CHAT WITH ADMIN MODAL */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-full max-w-sm glass-panel rounded-2xl overflow-hidden shadow-2xl border border-red-500/40 flex flex-col h-[430px]"
            >
              {/* Chat Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-red-900/90 via-black to-red-950/90 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wide">
                      MoviesHub Live Admin Support
                    </h4>
                    <p className="text-[10px] text-emerald-300">
                      Admin Online · Instant Reply
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Visitor Name Bar */}
              <div className="px-3 py-1.5 bg-black/60 border-b border-white/10 flex items-center gap-2 text-[11px]">
                <span className="text-slate-400 shrink-0">Your Name:</span>
                <input
                  type="text"
                  value={tempNameInput}
                  onChange={(e) => {
                    setTempNameInput(e.target.value);
                    onSetVisitorName(e.target.value);
                  }}
                  placeholder="Type your name..."
                  className="w-full bg-transparent text-amber-300 font-bold focus:outline-none"
                />
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-black/40">
                {myMessages.map((msg) => {
                  const isAdmin = msg.sender === 'ADMIN';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isAdmin ? 'items-start' : 'items-end'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                        {isAdmin ? '👑 MoviesHub Admin' : msg.visitorName}
                      </span>
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-red-950/90 border border-red-500/40 text-white rounded-tl-none'
                            : 'bg-white/10 border border-white/15 text-slate-100 rounded-tr-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleChatSubmit}
                className="p-2.5 bg-black/80 border-t border-white/10 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Write a message to Admin..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-red-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl red-glass-btn text-white cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. ADBLOCK DETECTOR POPUP MODAL */}
      <AnimatePresence>
        {adBlockDetected && !adBlockDismissed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel rounded-2xl max-w-md w-full p-6 text-center space-y-4 border border-red-500/50"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-white">
                AdBlocker Detected!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our high-speed Google Drive &amp; 4K UHD download servers are kept free by our sponsors. Please pause your AdBlocker or Brave Shield and refresh to unlock direct download links.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-5 py-2.5 rounded-xl red-glass-btn text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>I Disabled AdBlock (Refresh)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdBlockDismissed(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
