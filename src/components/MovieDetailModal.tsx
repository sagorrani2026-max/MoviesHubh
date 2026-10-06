import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Eye,
  Film,
  Users,
  Globe,
  Layers,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Clock,
  Share2,
  Check
} from 'lucide-react';
import { MovieItem, AdsterraConfig } from '../types';
import { formatViewCount, safeCopyToClipboard } from '../constants';
import { AdsterraSlot } from './AdsterraSlot';

interface MovieDetailModalProps {
  movie: MovieItem | null;
  adsterra: AdsterraConfig;
  siteDomain: string;
  onClose: () => void;
  onTrackClick: (movieId: string, resolution: string, targetUrl: string) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  adsterra,
  siteDomain,
  onClose,
  onTrackClick
}) => {
  const [unlockedRes, setUnlockedRes] = useState<Record<string, boolean>>({});
  const [generatingRes, setGeneratingRes] = useState<Record<string, number>>({});
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [copiedMovieShare, setCopiedMovieShare] = useState(false);

  // Reset timers when movie changes
  useEffect(() => {
    setUnlockedRes({});
    setGeneratingRes({});
    setActiveScreenshot(null);
    setCopiedMovieShare(false);
  }, [movie?.id]);

  // 10-Second Countdown Interval for any active resolution timer
  useEffect(() => {
    const activeKeys = Object.keys(generatingRes).filter(
      (k) => generatingRes[k] > 0
    );
    if (activeKeys.length === 0) return;

    const timer = window.setInterval(() => {
      setGeneratingRes((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (next[k] > 1) {
            next[k] -= 1;
          } else if (next[k] === 1) {
            next[k] = 0;
            setUnlockedRes((u) => ({ ...u, [k]: true }));
          }
        });
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [generatingRes]);

  if (!movie) return null;

  const handleStart10SecGenerator = (resKey: string, url: string) => {
    onTrackClick(movie.id, resKey, url);

    // Trigger Adsterra Smartlink on initial click if configured
    if (adsterra.enabled && adsterra.directSmartlinkUrl.trim()) {
      const smartUrl = adsterra.directSmartlinkUrl.trim();
      const a = document.createElement('a');
      a.href = smartUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // Start 10-second countdown
    setGeneratingRes((prev) => ({ ...prev, [resKey]: 10 }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className="fixed inset-0 z-50 bg-black/92 overflow-y-auto p-3 sm:p-6 flex items-start justify-center"
      >
        <div className="relative w-full max-w-4xl glass-panel rounded-2xl overflow-hidden my-4 sm:my-8">
          {/* Top Modal Header */}
          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-4 bg-gradient-to-r from-[#14070b] via-[#0b090e] to-[#14070b] border-b border-red-500/25">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2.5 py-1 rounded-md red-glass-btn text-white text-[11px] font-extrabold uppercase shrink-0">
                {movie.quality}
              </span>
              <h2 className="text-sm sm:text-lg font-extrabold text-white truncate">
                {movie.fullDisplayTitle}
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={async () => {
                  const shareUrl = `${window.location.origin}${window.location.pathname}?movie=${encodeURIComponent(movie.id)}`;
                  await safeCopyToClipboard(shareUrl);
                  setCopiedMovieShare(true);
                  setTimeout(() => setCopiedMovieShare(false), 2500);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/25 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-200 hover:text-white text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer"
                title="Share this movie link with friends"
              >
                {copiedMovieShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share Movie</span>
                  </>
                )}
              </button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-600 border border-white/10 text-slate-200 hover:text-white transition-colors shrink-0 cursor-pointer"
                aria-label="Close movie details"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Primary Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Poster Column */}
              <div className="md:col-span-4">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-red-500/30 bg-black shadow-2xl">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
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
                    className="w-full h-full object-cover"
                  />
                  {movie.isPinned && (
                    <span className="absolute top-2.5 left-2.5 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow">
                      PINNED
                    </span>
                  )}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/85 border border-red-500/40 text-white text-xs font-mono-num px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <Eye className="w-3.5 h-3.5 text-red-400" />
                    <span>{formatViewCount(movie.views)}</span>
                  </div>
                </div>
              </div>

              {/* Metadata & Storyline Column */}
              <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span className="text-red-400 font-extrabold uppercase">
                      {movie.language}
                    </span>
                    <span>·</span>
                    <span className="font-mono-num">{movie.year}</span>
                    <span>·</span>
                    <span>{movie.type}</span>
                    {movie.episodeBadge && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400 font-semibold">
                          {movie.episodeBadge}
                        </span>
                      </>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {movie.title} ({movie.year})
                  </h1>

                  {/* Structured Details Table */}
                  <div className="bg-black/55 border border-white/10 rounded-xl p-4 space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-start gap-2.5">
                      <Globe className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 font-medium">
                          Language / Audio:{' '}
                        </span>
                        <span className="text-white font-bold">
                          {movie.language}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Layers className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 font-medium">
                          Print Quality:{' '}
                        </span>
                        <span className="text-amber-300 font-bold">
                          {movie.quality}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Film className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 font-medium">
                          Genre:{' '}
                        </span>
                        <span className="text-slate-200 font-semibold">
                          {movie.genre.join(' · ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Users className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 font-medium">
                          Star Cast:{' '}
                        </span>
                        <span className="text-slate-200">{movie.cast}</span>
                      </div>
                    </div>
                  </div>

                  {/* Full Cloned Description & Storyline */}
                  <div className="bg-gradient-to-b from-black/75 to-[#0b0811]/90 border border-rose-500/25 rounded-xl p-4 sm:p-5 shadow-inner">
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-3.5 rounded-full bg-rose-500 inline-block" />
                        <span>Complete Movie Description &amp; Storyline</span>
                      </h3>
                      <span className="text-[10px] font-mono-num text-amber-300/90 font-semibold">
                        {movie.year} · {movie.quality}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-2 max-h-72 overflow-y-auto pr-1">
                      {movie.storyline}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC SCREENSHOTS PREVIEW GRID (Renders Exact Number of Previews Found on Cloned Website!) */}
            {movie.screenshots && movie.screenshots.filter(Boolean).length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <span className="w-1 h-4 bg-red-500 rounded-full inline-block"></span>
                    <span>
                      Official Print Screenshots ({movie.screenshots.filter(Boolean).length}{' '}
                      {movie.screenshots.filter(Boolean).length === 1 ? 'Preview' : 'Previews'})
                    </span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Tap any screenshot to expand
                  </span>
                </div>

                {activeScreenshot && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-xl overflow-hidden border border-red-500/50 bg-black select-none"
                  >
                    <img
                      src={activeScreenshot}
                      alt="Expanded Screenshot"
                      referrerPolicy="no-referrer"
                      className="w-full max-h-96 object-contain mx-auto pointer-events-none"
                    />
                    {/* Ultra-Small 40% Visible Auto-Watermark on Down-Left Side of Expanded Screenshot */}
                    <div className="pointer-events-none absolute bottom-1.5 left-1.5 px-1 py-0.5 rounded bg-black/30 flex items-center gap-0.5 opacity-40">
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      <span className="font-display text-[6px] font-bold tracking-wider text-white uppercase leading-none">
                        {siteDomain}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveScreenshot(null)}
                      className="absolute top-2.5 right-2.5 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-md cursor-pointer"
                    >
                      Minimize
                    </button>
                  </motion.div>
                )}

                <div
                  className={`grid gap-3 ${
                    movie.screenshots.filter(Boolean).length === 1
                      ? 'grid-cols-1 max-w-lg mx-auto'
                      : movie.screenshots.filter(Boolean).length === 2
                      ? 'grid-cols-1 sm:grid-cols-2'
                      : movie.screenshots.filter(Boolean).length === 3
                      ? 'grid-cols-1 sm:grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-4'
                  }`}
                >
                  {movie.screenshots.filter(Boolean).map((shot, idx) => (
                    <button
                      key={`${movie.id}-shot-${idx}`}
                      type="button"
                      onClick={() => setActiveScreenshot(shot)}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#0b090f] hover:border-red-500/70 transition-colors cursor-pointer select-none"
                    >
                      <img
                        src={shot}
                        alt={`${movie.title} Screenshot ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (!img.dataset.fallback) {
                            img.dataset.fallback = '1';
                            img.src =
                              movie.posterUrl ||
                              'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=80';
                          }
                        }}
                        className="w-full h-full object-cover pointer-events-none block"
                      />
                      {/* 50% SMALLER WATERMARK ON DOWN-LEFT SIDE (40% VISIBLE) */}
                      <div className="pointer-events-none absolute bottom-1 left-1 px-1 py-[1px] rounded bg-black/30 flex items-center gap-0.5 opacity-40">
                        <span className="w-[3px] h-[3px] rounded-full bg-red-500" />
                        <span className="font-display text-[5px] font-bold tracking-wider text-white uppercase leading-none">
                          {siteDomain}
                        </span>
                      </div>
                      <span className="pointer-events-none absolute bottom-1 right-1 text-white text-[5px] font-mono-num opacity-40 leading-none">
                        #{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Silent Real Adsterra Download Slot */}
            <AdsterraSlot
              enabled={adsterra.enabled}
              htmlCode={adsterra.downloadPageBannerCode}
            />

            {/* 4 Quality Download Links with 10-SECOND GENERATING DOWNLOAD LINK TIMER */}
            <div className="bg-black/60 border border-red-500/25 rounded-2xl p-4 sm:p-6">
              <div className="text-center max-w-xl mx-auto mb-5">
                <div className="inline-flex items-center gap-1.5 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>High-Speed Direct Cloud Download Servers</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Choose Print Resolution to Download
                </h3>
              </div>

              {(() => {
                const availableDownloadItems = [
                  {
                    key: '480p',
                    label: '480p Server',
                    url: (movie.links?.p480 || '').trim(),
                    btnClass:
                      'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-white'
                  },
                  {
                    key: '720p',
                    label: '720p HD Server',
                    url: (movie.links?.p720 || '').trim(),
                    btnClass:
                      'bg-red-950/90 hover:bg-red-900 border-red-500/40 text-white'
                  },
                  {
                    key: '1080p',
                    label: '1080p Full HD',
                    url: (movie.links?.p1080 || '').trim(),
                    btnClass: 'red-glass-btn text-white'
                  },
                  {
                    key: '4k',
                    label: '4K UHD Print',
                    url: (movie.links?.p4k || '').trim(),
                    btnClass:
                      'bg-gradient-to-r from-amber-500 to-red-600 hover:brightness-110 border-amber-400 text-white'
                  }
                ].filter((item) => item.url && item.url !== '#');

                if (availableDownloadItems.length === 0) {
                  return (
                    <div className="text-center py-4 text-xs text-slate-400">
                      Direct download links are being updated by Admin.
                    </div>
                  );
                }

                return (
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${
                      availableDownloadItems.length === 4
                        ? 'lg:grid-cols-4'
                        : availableDownloadItems.length === 3
                        ? 'lg:grid-cols-3'
                        : availableDownloadItems.length === 2
                        ? 'lg:grid-cols-2 max-w-2xl mx-auto'
                        : 'lg:grid-cols-1 max-w-sm mx-auto'
                    } gap-3`}
                  >
                    {availableDownloadItems.map((item) => {
                      const isUnlocked = unlockedRes[item.key];
                      const remainingSec = generatingRes[item.key] || 0;
                      const isGenerating = remainingSec > 0;

                      return (
                        <motion.div
                          whileHover={{ y: -2 }}
                          key={item.key}
                          className="bg-[#0e0b12]/90 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between gap-3"
                        >
                          <div className="text-center">
                            <div className="text-sm font-extrabold text-white">
                              {item.label}
                            </div>
                          </div>

                          {!isUnlocked && !isGenerating && (
                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              type="button"
                              onClick={() =>
                                handleStart10SecGenerator(item.key, item.url)
                              }
                              className={`w-full py-2.5 px-3 rounded-lg font-extrabold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer whitespace-nowrap ${item.btnClass}`}
                            >
                              <Download className="w-3.5 h-3.5 shrink-0" />
                              <span>Download {item.key.toUpperCase()}</span>
                            </motion.button>
                          )}

                          {isGenerating && (
                            <div className="space-y-2">
                              <div className="w-full py-2 px-3 rounded-lg bg-red-950/80 border border-red-500/50 text-amber-300 font-mono-num font-extrabold text-xs flex items-center justify-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 animate-spin text-red-400 shrink-0" />
                                <span>Generating Link... {remainingSec}s</span>
                              </div>
                              <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: '0%' }}
                                  animate={{
                                    width: `${((10 - remainingSec) / 10) * 100}%`
                                  }}
                                  className="h-full bg-gradient-to-r from-red-500 to-amber-400"
                                />
                              </div>
                            </div>
                          )}

                          {isUnlocked && (
                            <motion.a
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-3 rounded-lg font-extrabold text-xs flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition whitespace-nowrap shadow-lg shadow-emerald-500/20"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Start Download</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </motion.a>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
