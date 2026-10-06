import React, { useState, useEffect } from 'react';

interface Blockbuster3DLogoProps {
  siteName: string;
  onStealthClick: () => void;
}

type LogoModeKey =
  | 'thor'
  | 'katana'
  | 'cyberpunk'
  | 'dragon'
  | 'venom_face'
  | 'strange_portal'
  | 'ironman_reactor'
  | 'kgf_gold'
  | 'oppenheimer_nuke'
  | 'rrr_clash'
  | 'blackhole_eclipse'
  | 'netflix_imax';

interface CinemaPreset {
  key: LogoModeKey;
  textClass: string;
  stageClass: string;
  glowColor: string;
}

/**
 * 12 Borderless, Realistic 3D Cinema Wordmark Animations (Zero boxes, zero visible borders, zero video-player bars):
 * Pure open-space 3D typography + organic lightning/katana/symbiote effects floating seamlessly in the header.
 */
const INSANE_12_PRESETS: CinemaPreset[] = [
  {
    key: 'thor',
    textClass: 'fx-text-thor',
    stageClass: 'gpu-wordmark-stage',
    glowColor: 'rgba(56, 189, 248, 0.24)'
  },
  {
    key: 'katana',
    textClass: 'fx-text-katana',
    stageClass: 'gpu-wordmark-stage',
    glowColor: 'rgba(255, 30, 39, 0.28)'
  },
  {
    key: 'cyberpunk',
    textClass: 'fx-text-cyberpunk',
    stageClass: 'gpu-cyber-stage',
    glowColor: 'rgba(0, 240, 255, 0.24)'
  },
  {
    key: 'dragon',
    textClass: 'fx-text-dragon',
    stageClass: 'gpu-wordmark-stage',
    glowColor: 'rgba(249, 115, 22, 0.28)'
  },
  {
    key: 'venom_face',
    textClass: 'fx-text-venom',
    stageClass: 'gpu-wordmark-stage',
    glowColor: 'rgba(255, 0, 34, 0.28)'
  },
  {
    key: 'strange_portal',
    textClass: 'fx-text-strange',
    stageClass: 'gpu-wordmark-stage',
    glowColor: 'rgba(168, 85, 247, 0.26)'
  },
  {
    key: 'ironman_reactor',
    textClass: 'fx-text-ironman',
    stageClass: 'gpu-wordmark-stage',
    glowColor: 'rgba(56, 189, 248, 0.26)'
  },
  {
    key: 'kgf_gold',
    textClass: 'fx-text-kgf',
    stageClass: 'gpu-wordmark-stage',
    glowColor: 'rgba(250, 204, 21, 0.25)'
  },
  {
    key: 'oppenheimer_nuke',
    textClass: 'fx-text-oppenheimer',
    stageClass: 'gpu-wordmark-stage',
    glowColor: 'rgba(251, 146, 60, 0.28)'
  },
  {
    key: 'rrr_clash',
    textClass: 'fx-text-rrr',
    stageClass: 'gpu-wordmark-stage',
    glowColor: 'rgba(239, 68, 68, 0.26)'
  },
  {
    key: 'blackhole_eclipse',
    textClass: 'fx-text-eclipse',
    stageClass: 'gpu-wordmark-stage',
    glowColor: 'rgba(244, 63, 94, 0.28)'
  },
  {
    key: 'netflix_imax',
    textClass: 'fx-text-netflix',
    stageClass: 'gpu-wordmark-stage',
    glowColor: 'rgba(229, 9, 20, 0.3)'
  }
];

export const Blockbuster3DLogo: React.FC<Blockbuster3DLogoProps> = React.memo(
  ({ siteName, onStealthClick }) => {
    const [modeIndex, setModeIndex] = useState(0);

    // Smoothly cycle through all 12 GPU-accelerated 3D wordmark animations every 2.8 seconds
    useEffect(() => {
      const timer = window.setInterval(() => {
        setModeIndex((prev) => (prev + 1) % INSANE_12_PRESETS.length);
      }, 2800);

      return () => window.clearInterval(timer);
    }, []);

    const currentFX = INSANE_12_PRESETS[modeIndex];

    return (
      <div className="relative w-full flex flex-col items-center justify-center my-auto py-2.5 sm:py-3.5 mx-auto select-none border-none bg-transparent shadow-none">
        {/* BORDERLESS SOFT RADIAL LIGHT BLOOM (Zero hard edges or boxes) */}
        <div
          className="pointer-events-none absolute inset-x-0 -inset-y-6 mx-auto max-w-md transition-opacity duration-500"
          style={{
            background: `radial-gradient(closest-side, ${currentFX.glowColor} 0%, rgba(0,0,0,0) 100%)`
          }}
        />

        {/* 1. THOR THUNDER STORM (Realistic Forked Lightning Bolts + Electric Arc, No Clipping Box) */}
        {currentFX.key === 'thor' && (
          <>
            <svg
              viewBox="0 0 80 130"
              fill="none"
              className="gpu-thunder-bolt pointer-events-none absolute -left-7 sm:-left-10 -top-3 w-8 h-14 sm:w-10 sm:h-16 z-20"
            >
              <path
                d="M42 2 L16 48 L36 48 L12 122 L62 54 L38 54 L42 2 Z"
                fill="#38bdf8"
              />
              <path
                d="M40 6 L20 46 L35 46 L18 110 L55 56 L36 56 L40 6 Z"
                fill="#ffffff"
              />
            </svg>
            <svg
              viewBox="0 0 80 130"
              fill="none"
              className="gpu-thunder-bolt pointer-events-none absolute -right-7 sm:-right-10 -top-3 w-8 h-14 sm:w-10 sm:h-16 z-20"
            >
              <path
                d="M34 4 L60 48 L38 48 L58 120 L14 56 L38 56 L34 4 Z"
                fill="#ff1e27"
              />
              <path
                d="M35 8 L56 46 L39 46 L52 108 L20 58 L39 58 L35 8 Z"
                fill="#ffffff"
              />
            </svg>
            <svg
              viewBox="0 0 400 40"
              fill="none"
              className="gpu-thunder-bolt pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 w-full h-7 z-20"
            >
              <path
                d="M12 20 L68 9 L118 26 L178 8 L228 25 L288 10 L342 24 L388 15"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}

        {/* 2. KATANA LASER BLADE (Borderless Tapered SVG Sword Gleam) */}
        {currentFX.key === 'katana' && (
          <svg
            viewBox="0 0 420 36"
            fill="none"
            className="gpu-katana-beam pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-7 z-20"
          >
            <path
              d="M0 18 Q210 14 420 18 Q210 22 0 18 Z"
              fill="url(#katanaGrad)"
            />
            <defs>
              <linearGradient id="katanaGrad" x1="0" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff1e27" stopOpacity="0" />
                <stop offset="25%" stopColor="#ff1e27" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="75%" stopColor="#facc15" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ff1e27" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* 3. CYBERPUNK 2077 HOLOGRAM GLITCH (Borderless Tapered Laser Line) */}
        {currentFX.key === 'cyberpunk' && (
          <svg
            viewBox="0 0 400 20"
            fill="none"
            className="gpu-pulse-element pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-5 z-20"
          >
            <path
              d="M20 10 L140 10 M240 6 L370 6 M90 15 L290 15"
              stroke="#00f0ff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* 4. DRAGON BREATH FIREBALL SWEEP (Organic Curved Flame Wisps SVG) */}
        {currentFX.key === 'dragon' && (
          <svg
            viewBox="0 0 400 50"
            fill="none"
            className="gpu-katana-beam pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-9 z-20"
          >
            <path
              d="M15 28 C95 6, 175 44, 265 12 C315 -2, 355 32, 390 18"
              stroke="url(#dragonGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="dragonGrad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0" />
                <stop offset="40%" stopColor="#f97316" stopOpacity="0.95" />
                <stop offset="65%" stopColor="#fef08a" stopOpacity="1" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* 5. VENOM FACE SYMBIOTE (Menacing White Venom Eyes + Symbiote Tendrils) */}
        {currentFX.key === 'venom_face' && (
          <svg
            viewBox="0 0 260 90"
            fill="none"
            className="gpu-pulse-element pointer-events-none absolute -top-5 sm:-top-6 w-48 sm:w-60 h-16 z-20"
          >
            <path
              d="M35 18 C52 8, 82 22, 112 42 C88 44, 55 36, 35 18 Z"
              fill="#ffffff"
              stroke="#ff0022"
              strokeWidth="1.2"
            />
            <path
              d="M225 18 C208 8, 178 22, 148 42 C172 44, 205 36, 225 18 Z"
              fill="#ffffff"
              stroke="#ff0022"
              strokeWidth="1.2"
            />
            <path
              d="M78 68 Q105 56 130 70 T182 68"
              stroke="#ff0022"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* 6 & 7. DOCTOR STRANGE / IRON MAN ENERGY HALO (Soft SVG Ring, No CSS Border Box) */}
        {(currentFX.key === 'strange_portal' ||
          currentFX.key === 'ironman_reactor') && (
          <svg
            viewBox="0 0 160 160"
            fill="none"
            className="gpu-spin-portal pointer-events-none absolute w-32 h-32 sm:w-40 sm:h-40 z-0 opacity-75"
          >
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke={currentFX.key === 'strange_portal' ? '#f97316' : '#38bdf8'}
              strokeWidth="2"
              strokeDasharray="10 8"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* 8. KGF 24K ROYAL GOLD FORGE (Golden Crown & Star Glints SVG) */}
        {currentFX.key === 'kgf_gold' && (
          <svg
            viewBox="0 0 300 60"
            fill="none"
            className="gpu-pulse-element pointer-events-none absolute -top-3.5 w-56 h-12 z-20"
          >
            <path
              d="M132 18 L140 5 L150 14 L160 5 L168 18 Z"
              fill="#facc15"
            />
            <path d="M45 20 L48 26 L54 28 L48 30 L45 36 L42 30 L36 28 L42 26 Z" fill="#fef08a" />
            <path d="M255 20 L258 26 L264 28 L258 30 L255 36 L252 30 L246 28 L252 26 Z" fill="#fef08a" />
          </svg>
        )}

        {/* 9 & 11. OPPENHEIMER / BLACK HOLE ECLIPSE SOLAR ARC SVG */}
        {(currentFX.key === 'oppenheimer_nuke' ||
          currentFX.key === 'blackhole_eclipse') && (
          <svg
            viewBox="0 0 360 70"
            fill="none"
            className="gpu-pulse-element pointer-events-none absolute w-60 sm:w-72 h-14 z-0 opacity-80"
          >
            <path
              d="M20 45 Q180 -10 340 45"
              stroke={currentFX.key === 'oppenheimer_nuke' ? '#fb923c' : '#f43f5e'}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* 10. RRR FIRE VS WATER ELEMENTAL CLASH WAVES */}
        {currentFX.key === 'rrr_clash' && (
          <svg
            viewBox="0 0 360 50"
            fill="none"
            className="gpu-pulse-element pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-9 z-20"
          >
            <path
              d="M15 25 Q95 6 180 25"
              stroke="#ef4444"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M180 25 Q265 44 345 25"
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* 12. NETFLIX IMAX SPECTRUM LIGHT RAYS (Soft Tapered SVG Rays, Zero Hard Box Edges) */}
        {currentFX.key === 'netflix_imax' && (
          <svg
            viewBox="0 0 320 70"
            fill="none"
            className="gpu-pulse-element pointer-events-none absolute w-64 h-14 z-0 opacity-75"
          >
            <path d="M50 5 L50 65" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M110 2 L110 68" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <path d="M160 0 L160 70" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
            <path d="M210 2 L210 68" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <path d="M270 5 L270 65" stroke="#e879f9" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}

        {/* BORDERLESS 3D WORDMARK BUTTON (Automatically centered middle of top & bottom on any device) */}
        <button
          type="button"
          onClick={onStealthClick}
          className={`${currentFX.stageClass} relative flex flex-col items-center justify-center mx-auto my-auto cursor-pointer focus:outline-none border-none bg-transparent shadow-none px-3 py-1 z-10 transition-transform duration-100 active:scale-95`}
        >
          <h1
            style={{ fontSize: 'clamp(2.1rem, 6.5vw, 3.85rem)', lineHeight: 1.08 }}
            className={`font-display font-black tracking-[-0.02em] uppercase text-center mx-auto select-none transition-colors duration-200 ${currentFX.textClass}`}
          >
            {siteName}
          </h1>

          {/* Realistic Tapered Cinema Reflection Flare (Zero border, zero video-seekbar look) */}
          <svg
            viewBox="0 0 300 6"
            fill="none"
            className="w-4/5 max-w-[260px] h-1.5 mx-auto mt-1 pointer-events-none opacity-85"
          >
            <ellipse cx="150" cy="3" rx="140" ry="2" fill="url(#cinemaFlare)" />
            <defs>
              <radialGradient id="cinemaFlare" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#ef233c" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#ef233c" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </button>
      </div>
    );
  }
);
