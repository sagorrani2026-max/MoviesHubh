export interface CategoryDef {
  id: string;
  label: string;
  icon: string;
  isSpecialBanner?: boolean;
  badgeText?: string;
  bannerGradient?: string;
}

export const RED_GRID_CATEGORIES: CategoryDef[] = [
  { id: 'LIVENOW', label: 'LIVENOW', icon: '📡' },
  { id: 'BANGLA', label: 'BANGLA', icon: '🇧🇩' },
  { id: 'BANGLA DUB', label: 'BANGLA DUB', icon: '🎙️' },
  { id: 'BOLLYWOOD', label: 'BOLLYWOOD', icon: '🎬' },
  { id: 'HINDI', label: 'HINDI', icon: '🇮🇳' },
  { id: 'HINDI DUB', label: 'HINDI DUB', icon: '🎤' },
  { id: 'DUAL AUDIO', label: 'DUAL AUDIO', icon: '🎧' },
  { id: 'TAMIL', label: 'TAMIL', icon: '🔥' },
  { id: 'TELUGU', label: 'TELUGU', icon: '⚡' },
  { id: 'TURKISH', label: 'TURKISH', icon: '🇹🇷' },
  { id: 'ENGLISH', label: 'ENGLISH', icon: '🇺🇸' },
  { id: 'ACTION', label: 'ACTION', icon: '⚔️' },
  { id: 'THRILLER', label: 'THRILLER', icon: '🧩' },
  { id: 'HORROR', label: 'HORROR', icon: '👻' },
  { id: 'ROMANCE', label: 'ROMANCE', icon: '💞' },
  { id: 'WEB SERIES', label: 'WEB SERIES', icon: '📺' },
  { id: 'MOVIES', label: 'MOVIES', icon: '🎥' },
  { id: 'INDONESIAN', label: 'INDONESIAN', icon: '🇮🇩' },
  { id: 'FIFA', label: 'FIFA', icon: '🏆' },
  { id: 'WWE', label: 'WWE', icon: '🤼' }
];

export const SPECIAL_BANNER_CATEGORIES: CategoryDef[] = [
  {
    id: 'ANIME ZONE',
    label: 'ANIME ZONE',
    icon: '🍥',
    isSpecialBanner: true,
    badgeText: 'FRESH',
    bannerGradient: 'bg-gradient-to-r from-purple-700 to-indigo-600'
  },
  {
    id: '18+ ADULT',
    label: '18+ ADULT',
    icon: '🔞',
    isSpecialBanner: true,
    badgeText: 'HOT NOW',
    bannerGradient: 'bg-gradient-to-r from-rose-700 to-red-600'
  },
  {
    id: 'ONGOING SERIES',
    label: 'ONGOING SERIES',
    icon: '⏳',
    isSpecialBanner: true,
    badgeText: 'NEW',
    bannerGradient: 'bg-gradient-to-r from-amber-600 to-orange-600'
  },
  {
    id: 'K/J/C-DRAMA',
    label: 'K/J/C-DRAMA',
    icon: '🇰🇷',
    isSpecialBanner: true,
    badgeText: 'ALL DRAMA',
    bannerGradient: 'bg-gradient-to-r from-blue-600 to-cyan-600'
  },
  {
    id: 'SOUTH INDIAN',
    label: 'SOUTH INDIAN',
    icon: '🔥',
    isSpecialBanner: true,
    badgeText: 'BEST',
    bannerGradient: 'bg-gradient-to-r from-teal-700 to-emerald-600'
  },
  {
    id: 'ANIMATION',
    label: 'ANIMATION',
    icon: '🎨',
    isSpecialBanner: true,
    badgeText: 'CARTOONS',
    bannerGradient: 'bg-gradient-to-r from-fuchsia-700 to-purple-600'
  }
];

export const ALL_CATEGORY_IDS = [
  ...RED_GRID_CATEGORIES.map((c) => c.id),
  ...SPECIAL_BANNER_CATEGORIES.map((c) => c.id)
];

// One-Click Selection Presets for Admin (Zero Typing Needed)
export const CLICK_LANGUAGE_OPTIONS = [
  'BANGLA',
  'BANGLA DUB',
  'HINDI',
  'HINDI DUB',
  'ENGLISH',
  'TAMIL',
  'TELUGU',
  'TURKISH',
  'DUAL [HINDI-ENGLISH]',
  'DUAL [HINDI-BANGLA]',
  'DUAL [HINDI-MALAYALAM]',
  'MULTI AUDIO [ORG]'
];

export const CLICK_QUALITY_OPTIONS = [
  '4K WEB-DL',
  '4K UHD BluRay',
  '1080P WEB-DL',
  '1080P BluRay',
  '720P HEVC',
  'WEB-DL',
  'HDTC V2',
  'HDCAM RIP',
  'ORG PRINT'
];

export const CLICK_YEAR_OPTIONS = [
  '2026',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018'
];

export const CLICK_GENRE_OPTIONS = [
  'Action',
  'Thriller',
  'Crime',
  'Drama',
  'Romance',
  'Comedy',
  'Horror',
  'Mystery',
  'Sci-Fi',
  'Adventure',
  'Fantasy',
  'Family',
  'History',
  'Biography',
  'Animation',
  'Musical',
  'War',
  'Sports'
];

export const CLICK_EPISODE_OPTIONS = [
  '',
  'S01 | Ep 1 Added',
  'S01 | Ep 1-5 Added',
  'S01 | Complete Season',
  'S02 | All Episodes',
  'New Episode Added'
];

export const PRESET_POSTER_GALLERY = [
  {
    label: 'Crime Thriller Poster',
    url: '/src/assets/images/poster_drishyam_thriller_1791129492697.jpg'
  },
  {
    label: 'Royal Musical Stage',
    url: '/src/assets/images/poster_royal_musical_1791129511078.jpg'
  },
  {
    label: 'Romantic Hill Drama',
    url: '/src/assets/images/poster_romantic_drama_1791129526526.jpg'
  },
  {
    label: 'Culinary Comedy Splash',
    url: '/src/assets/images/poster_culinary_comedy_1791129544456.jpg'
  },
  {
    label: 'Turkish Historical Epic',
    url: '/src/assets/images/poster_turkish_epic_1791129560814.jpg'
  }
];

export function formatViewCount(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return String(num);
}

export async function safeCopyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && document.hasFocus()) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_err) {
    // Fallback to textarea execCommand below when iframe document is not focused
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(textArea);
    return copied;
  } catch (_fallbackErr) {
    return false;
  }
}

