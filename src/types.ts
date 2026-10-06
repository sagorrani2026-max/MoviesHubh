export interface DownloadLinks {
  p480: string;
  p720: string;
  p1080: string;
  p4k: string;
}

export interface MovieItem {
  id: string;
  title: string;
  fullDisplayTitle: string;
  year: string;
  cast: string;
  language: string;
  quality: string;
  genre: string[];
  categories: string[];
  type: 'MOVIE' | 'SERIES';
  episodeBadge?: string;
  storyline: string;
  posterUrl: string;
  screenshots: string[];
  links: DownloadLinks;
  isPinned: boolean;
  views: number;
  linkClicks: number;
  realViews?: number;
  realLinkClicks?: number;
  createdAt: string;
  sourceUrl?: string;
  sourceSiteOrigin?: string;
  lastSyncedAt?: string;
  autoSyncEnabled?: boolean;
}

export interface AdsterraConfig {
  enabled: boolean;
  headerBannerCode: string;
  nativeBannerCode: string;
  downloadPageBannerCode: string;
  directSmartlinkUrl: string;
  popunderScriptCode: string;
}

export interface DailyAnalyticsPoint {
  date: string;
  visitors: number;
  views: number;
  linkClicks: number;
  estimatedRevenueUsd: number;
  realVisitors?: number;
  realViews?: number;
  realLinkClicks?: number;
  realRevenueUsd?: number;
}

export interface AdminCredentials {
  username: string;
  password: string;
  backupPassword?: string;
  secondaryPassword?: string;
  subAdminUsername?: string;
  subAdminPassword?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

export interface SiteSettings {
  siteName: string;
  officialDomain: string;
  vpnNoticeText: string;
  mirrorLinks: { label: string; url: string; colorClass: string }[];
  howToDownloadText: string;
  howToDownloadVideoUrl: string;
  adsterra: AdsterraConfig;
  admin: AdminCredentials;
}

export interface MovieRequestItem {
  id: string;
  visitorName: string;
  movieTitle: string;
  language: string;
  quality: string;
  note: string;
  status: 'PENDING' | 'PUBLISHED';
  createdAt: string;
}

export interface ChatMessageItem {
  id: string;
  visitorId: string;
  visitorName: string;
  sender: 'VISITOR' | 'ADMIN';
  text: string;
  createdAt: string;
}

export interface AppDatabase {
  movies: MovieItem[];
  settings: SiteSettings;
  analytics: DailyAnalyticsPoint[];
  requests: MovieRequestItem[];
  chats: ChatMessageItem[];
}
