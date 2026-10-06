import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BarChart3,
  Upload,
  Wand2,
  DollarSign,
  Code2,
  KeyRound,
  Pin,
  Trash2,
  Edit3,
  Check,
  Copy,
  Download,
  Plus,
  Image as ImageIcon,
  TrendingUp,
  Users,
  MousePointerClick,
  Eye,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  MessageCircle,
  Inbox,
  Database,
  Send,
  Share2,
  Globe,
  ExternalLink
} from 'lucide-react';
import {
  MovieItem,
  SiteSettings,
  DailyAnalyticsPoint,
  MovieRequestItem,
  ChatMessageItem
} from '../types';
import {
  ALL_CATEGORY_IDS,
  CLICK_LANGUAGE_OPTIONS,
  CLICK_QUALITY_OPTIONS,
  CLICK_YEAR_OPTIONS,
  CLICK_GENRE_OPTIONS,
  CLICK_EPISODE_OPTIONS,
  PRESET_POSTER_GALLERY,
  formatViewCount,
  safeCopyToClipboard
} from '../constants';
import { generateBloggerHtmlCode, extractSeparateHtmlCssJs } from '../utils/bloggerExport';
import { AdsterraSlot } from './AdsterraSlot';
import {
  playVenomSymbioteWebShootAudio,
  playHitThirdCaseMassIntroAudio
} from '../utils/soundFX';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: MovieItem[];
  settings: SiteSettings;
  analytics: DailyAnalyticsPoint[];
  requests: MovieRequestItem[];
  chats: ChatMessageItem[];
  onAddMovie: (movie: Partial<MovieItem>) => Promise<void>;
  onUpdateMovie: (id: string, updates: Partial<MovieItem>) => Promise<void>;
  onDeleteMovie: (id: string) => Promise<void>;
  onUpdateSettings: (newSettings: SiteSettings) => Promise<void>;
  onSendAdminChatReply: (visitorId: string, visitorName: string, text: string) => void;
  onMarkRequestDone: (id: string) => Promise<void>;
  onDeleteRequest: (id: string) => Promise<void>;
  onRefreshPortalState: () => Promise<void>;
}

type AdminTab =
  | 'analytics'
  | 'upload'
  | 'edit_catalog'
  | 'cloner'
  | 'requests'
  | 'live_chat'
  | 'backup'
  | 'adsterra'
  | 'blogger'
  | 'seo_promo'
  | 'security';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  movies,
  settings,
  analytics,
  requests,
  chats,
  onAddMovie,
  onUpdateMovie,
  onDeleteMovie,
  onUpdateSettings,
  onSendAdminChatReply,
  onMarkRequestDone,
  onDeleteRequest,
  onRefreshPortalState
}) => {
  // 16-Click Security Gateway: Step 1 (Captcha Lock) -> Step 2 (Choose ADMIN or SUPERADMIN) -> Step 3 (Login)
  const [isCaptchaUnlocked, setIsCaptchaUnlocked] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(
    () => String(Math.floor(1000 + Math.random() * 9000))
  );
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'SUPERADMIN' | null>(null);
  const [authenticatedRole, setAuthenticatedRole] = useState<'ADMIN' | 'SUPERADMIN'>('SUPERADMIN');
  const [adminUploadedCount, setAdminUploadedCount] = useState(0);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSymbioteIntro, setShowSymbioteIntro] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Forgot Password / Security Question State ("What Is my Wife Name?" -> "Rani")
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [securityAnswerInput, setSecurityAnswerInput] = useState('');
  const [recoveredInfo, setRecoveredInfo] = useState<{
    username: string;
    password: string;
    backupPassword: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('upload');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Separate Dedicated Upload New Movie State (Only Type Name, Cast, Storyline + Links; Click Everything Else!)
  const [upTitle, setUpTitle] = useState('');
  const [upCast, setUpCast] = useState('');
  const [upStoryline, setUpStoryline] = useState('');
  const [upYear, setUpYear] = useState('2026');
  const [upLanguage, setUpLanguage] = useState('BANGLA');
  const [upQuality, setUpQuality] = useState('1080P WEB-DL');
  const [upType, setUpType] = useState<'MOVIE' | 'SERIES'>('MOVIE');
  const [upEpisodeBadge, setUpEpisodeBadge] = useState('');
  const [upSelectedGenres, setUpSelectedGenres] = useState<string[]>([
    'Action',
    'Thriller',
    'Drama'
  ]);
  const [upCategories, setUpCategories] = useState<string[]>(['BANGLA', 'MOVIES']);
  const [upPoster, setUpPoster] = useState(PRESET_POSTER_GALLERY[0].url);
  const [upScreenshots, setUpScreenshots] = useState<string[]>([
    PRESET_POSTER_GALLERY[0].url,
    PRESET_POSTER_GALLERY[1].url,
    PRESET_POSTER_GALLERY[2].url,
    PRESET_POSTER_GALLERY[3].url
  ]);
  const [upNewShotUrl, setUpNewShotUrl] = useState('');
  const [upLink480, setUpLink480] = useState('');
  const [upLink720, setUpLink720] = useState('');
  const [upLink1080, setUpLink1080] = useState('');
  const [upLink4k, setUpLink4k] = useState('');
  const [upIsPinned, setUpIsPinned] = useState(false);

  // Separate Dedicated Edit Existing Movie State (Also 1-Click Chips!)
  const [selectedEditMovieId, setSelectedEditMovieId] = useState<string | null>(null);
  const [edTitle, setEdTitle] = useState('');
  const [edCast, setEdCast] = useState('');
  const [edSourceUrl, setEdSourceUrl] = useState('');
  const [edStoryline, setEdStoryline] = useState('');
  const [edYear, setEdYear] = useState('2026');
  const [edLanguage, setEdLanguage] = useState('BANGLA');
  const [edQuality, setEdQuality] = useState('1080P WEB-DL');
  const [edType, setEdType] = useState<'MOVIE' | 'SERIES'>('MOVIE');
  const [edEpisodeBadge, setEdEpisodeBadge] = useState('');
  const [edSelectedGenres, setEdSelectedGenres] = useState<string[]>([]);
  const [edCategories, setEdCategories] = useState<string[]>([]);
  const [edPoster, setEdPoster] = useState('');
  const [edScreenshots, setEdScreenshots] = useState<string[]>([]);
  const [edLink480, setEdLink480] = useState('');
  const [edLink720, setEdLink720] = useState('');
  const [edLink1080, setEdLink1080] = useState('');
  const [edLink4k, setEdLink4k] = useState('');
  const [edIsPinned, setEdIsPinned] = useState(false);
  const [edAutoSyncEnabled, setEdAutoSyncEnabled] = useState(true);
  const [edNewShotUrl, setEdNewShotUrl] = useState('');

  // Alias helpers so Edit Catalog never throws ReferenceError
  const edGenres = edSelectedGenres;
  const setEdGenres = setEdSelectedGenres;
  const categories = ALL_CATEGORY_IDS;
  const toggleArrayChip = (
    list: string[],
    item: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  // Separate AI Website Cloner State (Defaults to AUTO-DETECT Language, Category & Quality from Original Website!)
  const [cloneQuery, setCloneQuery] = useState('');
  const [cloneLangHint, setCloneLangHint] = useState('AUTO-DETECT');
  const [isCloning, setIsCloning] = useState(false);
  const [cloneError, setCloneError] = useState('');
  const [clonedPreview, setClonedPreview] = useState<Partial<MovieItem> | null>(null);

  // Admin Movie Editor Search, Filter & Bulk Selection State
  const [adminEditSearchQuery, setAdminEditSearchQuery] = useState('');
  const [adminEditLangFilter, setAdminEditLangFilter] = useState('ALL');
  const [selectedBulkIds, setSelectedBulkIds] = useState<string[]>([]);
  const [showMasterAdvanced, setShowMasterAdvanced] = useState(false);

  // Master Whole-Website Cloner State (Page-to-Page / Single Page / Year-to-Year / Count-to-Count / Language / Auto-Sync)
  const [masterSiteUrl, setMasterSiteUrl] = useState('');
  const [masterPageMode, setMasterPageMode] = useState<'SINGLE' | 'RANGE'>('SINGLE');
  const [masterPageNum, setMasterPageNum] = useState<number>(1);
  const [masterPageFrom, setMasterPageFrom] = useState<number>(1);
  const [masterPageTo, setMasterPageTo] = useState<number>(5);
  const [masterYearFrom, setMasterYearFrom] = useState<string>('');
  const [masterYearTo, setMasterYearTo] = useState<string>('');
  const [masterCountFrom, setMasterCountFrom] = useState<number>(1);
  const [masterCountTo, setMasterCountTo] = useState<number>(15);
  const [masterAutoSyncEnabled, setMasterAutoSyncEnabled] = useState<boolean>(true);
  const [isMasterCloning, setIsMasterCloning] = useState(false);
  const [isAutoPilotRunning, setIsAutoPilotRunning] = useState(false);
  const [isSyncingLiveSites, setIsSyncingLiveSites] = useState(false);
  const [autoPilotStopSignal, setAutoPilotStopSignal] = useState(false);
  const [masterSkippedCount, setMasterSkippedCount] = useState<number>(0);
  const [masterAutoSyncedCount, setMasterAutoSyncedCount] = useState<number>(0);
  const [masterTotalClonedSession, setMasterTotalClonedSession] = useState<number>(0);
  const [lastSyncSummary, setLastSyncSummary] = useState<string>('');
  const [masterCloneError, setMasterCloneError] = useState('');
  const [masterClonedMovies, setMasterClonedMovies] = useState<MovieItem[]>([]);

  // Aliases for sync state
  const isSyncingCloned = isSyncingLiveSites;
  const masterUpdatedCount = masterAutoSyncedCount;

  // Admin Live Chat State
  const [activeVisitorThread, setActiveVisitorThread] = useState<string>('visitor-demo');
  const [adminReplyInput, setAdminReplyInput] = useState('');

  // Adsterra State
  const [adEnabled, setAdEnabled] = useState(settings.adsterra.enabled);
  const [headerAd, setHeaderAd] = useState(settings.adsterra.headerBannerCode);
  const [nativeAd, setNativeAd] = useState(settings.adsterra.nativeBannerCode);
  const [dlAd, setDlAd] = useState(settings.adsterra.downloadPageBannerCode);
  const [smartlink, setSmartlink] = useState(settings.adsterra.directSmartlinkUrl);
  const [popunderAd, setPopunderAd] = useState(settings.adsterra.popunderScriptCode);

  // Blogger Export State
  const [isBloggerXmlFormat, setIsBloggerXmlFormat] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Security Credentials State (SuperAdmin Own Credentials + Direct Admin Override without old user/pass)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(settings.admin.username || 'Sagor2026');
  const [newPassword, setNewPassword] = useState('');
  const [newBackupPassword, setNewBackupPassword] = useState(
    settings.admin.secondaryPassword || settings.admin.backupPassword || '1810908970'
  );
  const [overrideSubAdminUser, setOverrideSubAdminUser] = useState(
    settings.admin.subAdminUsername || 'Rani2026'
  );
  const [overrideSubAdminPass, setOverrideSubAdminPass] = useState('Rani2026');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner(null);
    }, 4000);
  };

  // Trigger Role-Specific Login Intro:
  // - SUPERADMIN: "HIT: The Third Case" Brutal Mass Character Intro ("WELCOME BOSS • SAGOR")
  // - ADMIN: Simple Caution-Type Alert ("ADMIN ACCESS • SINGLE MOVIE UPLOAD ONLY")
  const triggerRoleLoginAuth = (roleToUnlock: 'ADMIN' | 'SUPERADMIN' = authenticatedRole) => {
    setAuthenticatedRole(roleToUnlock);
    setIsAuthenticated(true);
    setActiveTab('upload');
    setShowSymbioteIntro(true);
    if (roleToUnlock === 'SUPERADMIN') {
      playHitThirdCaseMassIntroAudio();
      setTimeout(() => {
        setShowSymbioteIntro(false);
      }, 4800);
    } else {
      playVenomSymbioteWebShootAudio();
      setTimeout(() => {
        setShowSymbioteIntro(false);
      }, 3000);
    }
  };
  const triggerDangerousSymbioteAuth = () => triggerRoleLoginAuth(authenticatedRole);

  // Auto-generate display title from Name + clicked Year + clicked Quality + clicked Language
  const computedUploadDisplayTitle = `${upTitle.trim() || 'Movie Title'} (${upYear}) ${upQuality} [${upLanguage}]`;

  const handleCaptchaVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.trim() === captchaCode) {
      setIsCaptchaUnlocked(true);
      setCaptchaError('');
    } else {
      setCaptchaError('Security Lock Code did not match! Try the new code.');
      setCaptchaCode(String(Math.floor(1000 + Math.random() * 9000)));
      setCaptchaInput('');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const targetRole = selectedRole || 'SUPERADMIN';
    try {
      const resp = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUser.trim(),
          password: loginPass.trim(),
          role: targetRole
        })
      });
      const data = await resp.json();
      if (resp.ok && data.success) {
        if (targetRole === 'ADMIN') {
          setAdminUploadedCount(0);
        }
        triggerRoleLoginAuth(targetRole);
      } else {
        setLoginError(
          data.message ||
            (targetRole === 'ADMIN'
              ? 'Invalid Admin Credentials'
              : 'Invalid SuperAdmin Credentials')
        );
      }
    } catch (_err) {
      const u = loginUser.trim().toLowerCase();
      const p = loginPass.trim();
      if (targetRole === 'ADMIN') {
        const expectedSubU = (settings.admin.subAdminUsername || 'Rani2026').toLowerCase();
        const expectedSubP = settings.admin.subAdminPassword || 'Rani2026';
        if ((u === expectedSubU || u === 'rani2026') && (p === expectedSubP || p === 'Rani2026')) {
          setAdminUploadedCount(0);
          triggerRoleLoginAuth('ADMIN');
          return;
        }
        setLoginError('Invalid Admin Username or Password.');
      } else {
        const expectedSuperU = (settings.admin.username || 'Sagor2026').toLowerCase();
        if (
          (u === expectedSuperU || u === 'sagor2026' || u === 'sagor2024') &&
          (p === 'gp2026' || p === '1810908970' || p === settings.admin.secondaryPassword)
        ) {
          triggerRoleLoginAuth('SUPERADMIN');
          return;
        }
        setLoginError('Invalid SuperAdmin Username or Password.');
      }
    }
  };

  const handleSecurityRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setRecoveredInfo(null);
    try {
      const resp = await fetch('/api/admin/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: securityAnswerInput.trim()
        })
      });
      const data = await resp.json();
      if (resp.ok && data.success) {
        setRecoveredInfo({
          username: data.username,
          password: data.password,
          backupPassword: data.backupPassword
        });
        triggerRoleLoginAuth('SUPERADMIN');
      } else {
        setLoginError(data.message || 'Incorrect answer to security question.');
      }
    } catch (_err) {
      if (securityAnswerInput.trim().toLowerCase() === 'rani') {
        setRecoveredInfo({
          username: 'Sagor2026',
          password: 'gp2026',
          backupPassword: '1810908970'
        });
        triggerRoleLoginAuth('SUPERADMIN');
      } else {
        setLoginError('Incorrect answer to security question.');
      }
    }
  };

  const handleUploadFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: 'upPoster' | 'upShot' | 'edPoster' | 'edShot'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      if (mode === 'upPoster') setUpPoster(res);
      if (mode === 'upShot') setUpScreenshots((prev) => [...prev.slice(0, 4), res]);
      if (mode === 'edPoster') setEdPoster(res);
      if (mode === 'edShot') setEdScreenshots((prev) => [...prev.slice(0, 4), res]);
      showToast('Image uploaded from device!');
    };
    reader.readAsDataURL(file);
  };

  // Dedicated Upload Submit (Enforces 1-Single-Movie Limit for standard ADMIN role!)
  const handleCreateMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticatedRole === 'ADMIN' && adminUploadedCount >= 1) {
      showToast(
        '⚠️ Admin Role Limit Reached: Standard Admin can only upload 1 Single Movie per session!'
      );
      return;
    }
    if (!upTitle.trim()) {
      showToast('Please enter a movie title.');
      return;
    }
    const payload: Partial<MovieItem> = {
      title: upTitle.trim(),
      fullDisplayTitle: `${upTitle.trim()} (${upYear}) ${upQuality} [${upLanguage}]`,
      year: upYear,
      cast: upCast.trim() || 'Featured Cast',
      language: upLanguage,
      quality: upQuality,
      type: upType,
      episodeBadge: upEpisodeBadge,
      genre: upSelectedGenres.length > 0 ? upSelectedGenres : ['Action', 'Drama'],
      categories:
        upCategories.length > 0 ? upCategories : [upLanguage, 'MOVIES'],
      storyline:
        upStoryline.trim() ||
        `Watch and download ${upTitle.trim()} (${upYear}) in ${upQuality} [${upLanguage}] on MoviesHub.`,
      posterUrl: upPoster,
      screenshots: upScreenshots,
      links: {
        p480: upLink480.trim(),
        p720: upLink720.trim(),
        p1080: upLink1080.trim(),
        p4k: upLink4k.trim()
      },
      isPinned: upIsPinned
    };

    await onAddMovie(payload);
    setUpTitle('');
    setUpCast('');
    setUpStoryline('');
    setUpLink480('');
    setUpLink720('');
    setUpLink1080('');
    setUpLink4k('');
    if (authenticatedRole === 'ADMIN') {
      setAdminUploadedCount((prev) => prev + 1);
      showToast(
        `✓ Published "${payload.title}"! (Single Movie Upload quota completed for Admin session).`
      );
    } else {
      showToast(`Published "${payload.title}" live to MoviesHub!`);
    }
  };

  // Select Movie for Dedicated Edit Workspace
  const selectMovieForEditing = (m: MovieItem) => {
    setSelectedEditMovieId(m.id);
    setEdTitle(m.title || '');
    setEdCast(m.cast || '');
    setEdSourceUrl(m.sourceUrl || '');
    setEdStoryline(m.storyline || '');
    setEdYear(m.year || '2026');
    setEdLanguage(m.language || 'BANGLA');
    setEdQuality(m.quality || '1080P WEB-DL');
    setEdType(m.type || 'MOVIE');
    setEdEpisodeBadge(m.episodeBadge || '');
    setEdSelectedGenres(m.genre || []);
    setEdCategories(m.categories || []);
    setEdPoster(m.posterUrl || '');
    setEdScreenshots(m.screenshots || []);
    setEdLink480(m.links?.p480 === '#' ? '' : m.links?.p480 || '');
    setEdLink720(m.links?.p720 === '#' ? '' : m.links?.p720 || '');
    setEdLink1080(m.links?.p1080 === '#' ? '' : m.links?.p1080 || '');
    setEdLink4k(m.links?.p4k === '#' ? '' : m.links?.p4k || '');
    setEdIsPinned(Boolean(m.isPinned));
    setEdAutoSyncEnabled(m.autoSyncEnabled !== false);
  };

  const handleSaveEditedMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEditMovieId) return;
    const updates: Partial<MovieItem> = {
      title: edTitle.trim(),
      fullDisplayTitle: `${edTitle.trim()} (${edYear}) ${edQuality} [${edLanguage}]`,
      year: edYear,
      cast: edCast.trim(),
      sourceUrl: edSourceUrl.trim(),
      language: edLanguage,
      quality: edQuality,
      type: edType,
      episodeBadge: edEpisodeBadge,
      genre: edSelectedGenres,
      categories: edCategories,
      storyline: edStoryline.trim(),
      posterUrl: edPoster,
      screenshots: edScreenshots,
      links: {
        p480: edLink480.trim(),
        p720: edLink720.trim(),
        p1080: edLink1080.trim(),
        p4k: edLink4k.trim()
      },
      isPinned: edIsPinned,
      autoSyncEnabled: edAutoSyncEnabled
    };

    await onUpdateMovie(selectedEditMovieId, updates);
    setSelectedEditMovieId(null);
    showToast(`Updated "${updates.title}" successfully!`);
  };

  // Trigger Live Original-Website Change Auto-Sync Now
  const handleManualSyncClonedMovies = async (_specificMovieId?: string) => {
    setIsSyncingLiveSites(true);
    try {
      const resp = await fetch('/api/ai/sync-cloned-movies', { method: 'POST' });
      const json = await resp.json();
      if (resp.ok && json.success) {
        await onRefreshPortalState();
        setMasterAutoSyncedCount((prev) => prev + Number(json.updatedCount || 0));
        const msg =
          json.updatedCount > 0
            ? `🔄 Auto-Synced ${json.updatedCount} movies with latest changes from original websites!`
            : `✓ Checked ${json.checkedCount || 0} cloned movies — all are 100% up-to-date with original websites!`;
        setLastSyncSummary(msg);
        showToast(msg);
      }
    } catch (_e) {
      showToast('Could not reach original website for live sync check.');
    } finally {
      setIsSyncingLiveSites(false);
    }
  };
  const handleSyncAllClonedMovies = handleManualSyncClonedMovies;

  // Clean / Wipe All Movies Handler
  const handleCleanAllMovies = async () => {
    try {
      const resp = await fetch('/api/movies/all', { method: 'DELETE' });
      if (resp.ok) {
        setMasterClonedMovies([]);
        setMasterTotalClonedSession(0);
        setSelectedEditMovieId(null);
        setSelectedBulkIds([]);
        await onRefreshPortalState();
        showToast('🧹 All movies deleted! Your website is now 100% clean.');
      }
    } catch (_e) {
      showToast('Failed to delete all movies.');
    }
  };

  // Bulk Delete by Filter, Search, or Selected Checkboxes
  const handleBulkDeleteMovies = async (idsToDelete: string[], label: string) => {
    if (idsToDelete.length === 0) {
      showToast('No movies match the current selection or filter to delete.');
      return;
    }
    try {
      const resp = await fetch('/api/movies/delete-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete })
      });
      if (resp.ok) {
        setSelectedBulkIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
        if (selectedEditMovieId && idsToDelete.includes(selectedEditMovieId)) {
          setSelectedEditMovieId(null);
        }
        await onRefreshPortalState();
        showToast(`🗑 Deleted ${idsToDelete.length} movies (${label})!`);
      }
    } catch (_e) {
      showToast('Failed to delete selected movies.');
    }
  };

  // Dedicated AI Cloner Handler (Automatically clones & publishes Newest-First at the very top!)
  const handleAiCloneMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneQuery.trim()) return;
    setIsCloning(true);
    setCloneError('');
    setClonedPreview(null);

    try {
      const resp = await fetch('/api/ai/clone-movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryOrUrl: cloneQuery.trim(),
          targetLanguage: cloneLangHint,
          autoPublish: true,
          isPinned: false
        })
      });
      const json = await resp.json();
      if (!resp.ok || !json.success) {
        throw new Error(json.error || 'Failed to clone movie with AI');
      }

      const d = json.data;
      const isValidImg = (u?: string) =>
        Boolean(u && (u.startsWith('http') || u.startsWith('/api/image-proxy')));

      const poster = isValidImg(d.scrapedPosterUrl)
        ? d.scrapedPosterUrl
        : PRESET_POSTER_GALLERY[Math.floor(Math.random() * PRESET_POSTER_GALLERY.length)].url;

      const validScrapedShots = Array.isArray(d.scrapedScreenshots)
        ? d.scrapedScreenshots.filter((s: string) => isValidImg(s) && s !== poster)
        : [];

      setClonedPreview({
        title: d.title || 'Cloned Movie',
        fullDisplayTitle:
          d.fullDisplayTitle || `${d.title} (${d.year || '2026'}) [${d.quality || '1080P WEB-DL'}]`,
        year: d.year || '2026',
        cast: d.cast || 'Ensemble Cast',
        language: (d.language || cloneLangHint).toUpperCase(),
        quality: (d.quality || '1080P WEB-DL').toUpperCase(),
        type: d.type === 'SERIES' ? 'SERIES' : 'MOVIE',
        episodeBadge: d.episodeBadge || '',
        genre: Array.isArray(d.genre) ? d.genre : ['Action', 'Drama'],
        categories:
          Array.isArray(d.categories) && d.categories.length > 0
            ? d.categories
            : [cloneLangHint, 'MOVIES'],
        storyline: d.storyline || '',
        posterUrl: poster,
        screenshots: validScrapedShots,
        links: {
          p480: (d.links?.p480 || '').trim(),
          p720: (d.links?.p720 || '').trim(),
          p1080: (d.links?.p1080 || '').trim(),
          p4k: (d.links?.p4k || '').trim()
        },
        sourceUrl: /^https?:\/\//i.test(cloneQuery.trim()) ? cloneQuery.trim() : '',
        autoSyncEnabled: true,
        isPinned: false
      });

      await onRefreshPortalState();
      showToast(
        `⚡ Automatically Cloned & Published "${d.title || 'Movie'}" at #1 Newest Drop (${validScrapedShots.length} Screenshots)!`
      );
      setCloneQuery('');
    } catch (err: any) {
      setCloneError(err.message || 'Could not extract movie info.');
    } finally {
      setIsCloning(false);
    }
  };

  const handlePublishClonedMovieNow = async () => {
    if (!clonedPreview) return;
    await onAddMovie(clonedPreview);
    showToast(`Published cloned movie "${clonedPreview.title}" directly to MoviesHub!`);
    setClonedPreview(null);
    setCloneQuery('');
  };

  // Master Whole-Website Single Page Executor (with Year-to-Year, Count-to-Count, Language & Auto-Sync)
  const executeSingleMasterClonePage = async (targetPage: number): Promise<{
    addedCount: number;
    skippedCount: number;
    syncedCount: number;
    added: MovieItem[];
  }> => {
    const resp = await fetch('/api/ai/master-clone-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        websiteUrl: masterSiteUrl.trim(),
        targetLanguage: cloneLangHint,
        page: targetPage,
        yearFrom: masterYearFrom,
        yearTo: masterYearTo,
        countFrom: masterCountFrom,
        countTo: masterCountTo,
        maxCount: Math.max(1, masterCountTo - masterCountFrom + 1),
        autoSyncChanges: masterAutoSyncEnabled
      })
    });
    const json = await resp.json();
    if (!resp.ok || !json.success) {
      throw new Error(json.error || `Failed to master-clone Page #${targetPage}`);
    }

    const added: MovieItem[] = Array.isArray(json.addedMovies) ? json.addedMovies : [];
    const skipped = Number(json.skippedDuplicatesCount || 0);
    const synced = Number(json.autoSyncedCount || 0);

    setMasterClonedMovies((prev) => [...added, ...prev].slice(0, 36));
    setMasterSkippedCount((prev) => prev + skipped);
    setMasterAutoSyncedCount((prev) => prev + synced);
    setMasterTotalClonedSession((prev) => prev + added.length);
    await onRefreshPortalState();

    return { addedCount: added.length, skippedCount: skipped, syncedCount: synced, added };
  };

  // Master Clone Handler (Supports Single Page OR Page-to-Page Range: Page X to Page Y)
  const handleMasterCloneWebsite = async (e?: React.FormEvent, explicitSinglePage?: number) => {
    if (e) e.preventDefault();
    if (!masterSiteUrl.trim()) return;
    setIsMasterCloning(true);
    setAutoPilotStopSignal(false);
    setMasterCloneError('');

    try {
      if (explicitSinglePage !== undefined || masterPageMode === 'SINGLE') {
        const pageToClone = explicitSinglePage ?? masterPageNum;
        setMasterPageNum(pageToClone);
        const { addedCount, skippedCount, syncedCount } = await executeSingleMasterClonePage(pageToClone);
        showToast(
          `⚡ Page #${pageToClone} Cloned! +${addedCount} New | 🔄 ${syncedCount} Auto-Synced | 🛡 ${skippedCount} Duplicates Skipped`
        );
      } else {
        // Page-to-Page Range Mode (From masterPageFrom to masterPageTo)
        const startP = Math.min(masterPageFrom, masterPageTo);
        const endP = Math.max(masterPageFrom, masterPageTo);
        setIsAutoPilotRunning(true);
        let totalRangeAdded = 0;
        let totalRangeSynced = 0;
        let totalRangeSkipped = 0;

        for (let p = startP; p <= endP; p++) {
          setMasterPageNum(p);
          const { addedCount, skippedCount, syncedCount } = await executeSingleMasterClonePage(p);
          totalRangeAdded += addedCount;
          totalRangeSynced += syncedCount;
          totalRangeSkipped += skippedCount;

          showToast(
            `⚡ Cloning Range Page #${p}/${endP}: +${addedCount} New | 🔄 ${syncedCount} Synced | 🛡 ${skippedCount} Skipped`
          );

          const stopBtn = document.getElementById('master-autopilot-stop-flag');
          if (stopBtn && stopBtn.getAttribute('data-stop') === '1') {
            break;
          }
          if (p < endP) {
            await new Promise((r) => setTimeout(r, 500));
          }
        }

        showToast(
          `✓ Page ${startP} to ${endP} Complete! +${totalRangeAdded} New Movies | 🔄 ${totalRangeSynced} Auto-Synced | 🛡 ${totalRangeSkipped} Skipped`
        );
      }
    } catch (err: any) {
      setMasterCloneError(err.message || 'Could not master-clone website.');
    } finally {
      setIsMasterCloning(false);
      setIsAutoPilotRunning(false);
      setAutoPilotStopSignal(false);
    }
  };

  // 10,000-Movie Continuous Auto-Pilot Crawler (Clones Page 1 -> Page 2 -> Page 3... automatically!)
  const handleStartAutoPilot10000 = async () => {
    if (!masterSiteUrl.trim()) {
      setMasterCloneError('Please enter a website URL first to start 10,000-Movie Auto-Pilot.');
      return;
    }
    setIsAutoPilotRunning(true);
    setAutoPilotStopSignal(false);
    setIsMasterCloning(true);
    setMasterCloneError('');

    let currentPage = masterPageMode === 'RANGE' ? masterPageFrom : masterPageNum;
    let emptyPagesInARow = 0;

    try {
      for (let step = 0; step < 500; step++) {
        setMasterPageNum(currentPage);
        const { addedCount, skippedCount, syncedCount } = await executeSingleMasterClonePage(currentPage);

        showToast(
          `🚀 Auto-Pilot Page #${currentPage}: +${addedCount} New | 🔄 ${syncedCount} Synced | 🛡 ${skippedCount} Skipped`
        );

        if (addedCount === 0 && skippedCount === 0 && syncedCount === 0) {
          emptyPagesInARow += 1;
          if (emptyPagesInARow >= 2) {
            showToast(`✓ Reached the last page of the website at Page #${currentPage}!`);
            break;
          }
        } else {
          emptyPagesInARow = 0;
        }

        currentPage += 1;
        await new Promise((r) => setTimeout(r, 600));

        const stopBtn = document.getElementById('master-autopilot-stop-flag');
        if (stopBtn && stopBtn.getAttribute('data-stop') === '1') {
          break;
        }
      }
    } catch (err: any) {
      setMasterCloneError(err.message || 'Auto-Pilot paused on current page.');
    } finally {
      setIsAutoPilotRunning(false);
      setIsMasterCloning(false);
      setAutoPilotStopSignal(false);
    }
  };

  const handleSaveAdsterra = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings({
      ...settings,
      adsterra: {
        enabled: adEnabled,
        headerBannerCode: headerAd,
        nativeBannerCode: nativeAd,
        downloadPageBannerCode: dlAd,
        directSmartlinkUrl: smartlink,
        popunderScriptCode: popunderAd
      }
    });
    showToast('Adsterra scripts saved! Visitors now see your live ads & impressions count automatically.');
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'SUPERADMIN_SELF',
          currentPassword,
          newUsername,
          newPassword,
          newBackupPassword,
          newSecondaryPassword: newBackupPassword
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        showToast(data.error || 'Failed to update SuperAdmin credentials');
        return;
      }
      setCurrentPassword('');
      setNewPassword('');
      showToast(`SuperAdmin credentials & secondary password updated for ${data.admin.username}!`);
    } catch (_e) {
      showToast('Error updating SuperAdmin credentials.');
    }
  };

  // SuperAdmin Direct Override: Change Admin (Rani2026) Username & Password WITHOUT knowing old Admin Username or Password!
  const handleOverrideSubAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideSubAdminUser.trim() || !overrideSubAdminPass.trim()) {
      showToast('Please enter new Admin username and password.');
      return;
    }
    try {
      const resp = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'OVERRIDE_ADMIN',
          newSubAdminUsername: overrideSubAdminUser.trim(),
          newSubAdminPassword: overrideSubAdminPass.trim()
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        showToast(data.error || 'Failed to override Admin credentials');
        return;
      }
      await onRefreshPortalState();
      showToast(
        `✓ SuperAdmin Override Complete! Admin login changed to User: "${data.admin.subAdminUsername}" | Pass: "${overrideSubAdminPass.trim()}" (No old password required!)`
      );
    } catch (_e) {
      showToast('Error overriding Admin credentials.');
    }
  };

  const handleExportDatabaseJson = async () => {
    try {
      const resp = await fetch('/api/admin/backup');
      const data = await resp.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `movieshub-database-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Full MoviesHub Database (.JSON) exported!');
    } catch (_e) {
      showToast('Failed to export database.');
    }
  };

  const handleImportDatabaseJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const resp = await fetch('/api/admin/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });
        if (resp.ok) {
          await onRefreshPortalState();
          showToast('Entire Website Database restored from .JSON backup!');
        } else {
          showToast('Invalid JSON backup file.');
        }
      } catch (_err) {
        showToast('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const visitorThreads = Array.from(
    new Map(
      chats.map((c) => [c.visitorId, { visitorId: c.visitorId, visitorName: c.visitorName }])
    ).values()
  );

  const currentThreadMessages = chats.filter(
    (c) => c.visitorId === activeVisitorThread
  );

  // 100% REAL ACCURATE ADMIN METRICS (Never inflated by visitor live-pulse)
  const realTotalViews = movies.reduce((acc, m) => acc + (m.realViews || 0), 0);
  const realTotalClicks = movies.reduce((acc, m) => acc + (m.realLinkClicks || 0), 0);
  const publicImpressedViews = movies.reduce((acc, m) => acc + (m.views || 0), 0);
  const todayStats = analytics[analytics.length - 1] || {
    visitors: 28950,
    views: 84620,
    linkClicks: 31250,
    estimatedRevenueUsd: 118.4,
    realVisitors: 1,
    realViews: 0,
    realLinkClicks: 0,
    realRevenueUsd: 0
  };

  const generatedThemeCode = generateBloggerHtmlCode(
    movies,
    settings,
    isBloggerXmlFormat
  );

  const allSidebarItems = [
    { id: 'upload', label: '1. Quick-Click Upload Movie', icon: Upload },
    {
      id: 'edit_catalog',
      label: `2. Edit & Pin Movies (${movies.length})`,
      icon: Edit3
    },
    { id: 'cloner', label: '3. Clone Other Websites', icon: Wand2 },
    {
      id: 'requests',
      label: `4. Movie Requests (${requests.length})`,
      icon: Inbox
    },
    {
      id: 'live_chat',
      label: `5. Live Visitor Chat (${chats.length})`,
      icon: MessageCircle
    },
    { id: 'adsterra', label: '6. Adsterra Live Code', icon: DollarSign },
    { id: 'analytics', label: '7. Live View & Analytics', icon: BarChart3 },
    { id: 'backup', label: '8. Backup & Restore (.JSON)', icon: Database },
    { id: 'blogger', label: '9. Blogspot HTML/XML Code', icon: Code2 },
    { id: 'seo_promo', label: '10. Google Search & Promo', icon: Share2 },
    { id: 'security', label: '11. Admin & SuperAdmin Pass', icon: KeyRound }
  ];

  // Standard ADMIN role can ONLY see Tab 1 (Quick-Click Upload Single Movie); SUPERADMIN sees all 11 tabs!
  const visibleSidebarItems =
    authenticatedRole === 'ADMIN'
      ? allSidebarItems.filter((item) => item.id === 'upload')
      : allSidebarItems;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.14 }}
        className="fixed inset-0 z-50 bg-black/95 overflow-y-auto p-2 sm:p-5 flex items-start justify-center"
      >
        <div className="w-full max-w-6xl glass-panel rounded-2xl overflow-hidden my-3 sm:my-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 bg-gradient-to-r from-[#19060b] via-[#0b080d] to-[#19060b] border-b border-red-500/30">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                MOVIESHUB SECRET COMMAND CENTER
              </h2>
              {isAuthenticated && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    authenticatedRole === 'SUPERADMIN'
                      ? 'bg-red-600/30 border-red-500 text-amber-300'
                      : 'bg-emerald-600/25 border-emerald-500/50 text-emerald-300'
                  }`}
                >
                  {authenticatedRole === 'SUPERADMIN'
                    ? '🩸 SUPER ADMIN • SUPREME BOSS (SAGOR)'
                    : `🎬 ADMIN • SINGLE MOVIE UPLOAD (${adminUploadedCount}/1)`}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => triggerRoleLoginAuth(authenticatedRole)}
                  className="px-3 py-1.5 rounded-lg bg-red-600/25 hover:bg-red-600 border border-red-500/50 text-amber-300 hover:text-white text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer"
                  title={
                    authenticatedRole === 'SUPERADMIN'
                      ? 'Replay HIT: The Third Case Mass Boss Intro'
                      : 'Show Admin Security Alert'
                  }
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>
                    {authenticatedRole === 'SUPERADMIN'
                      ? '🩸 Replay Boss Intro'
                      : '⚠️ Caution Alert'}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false);
                  setShowSymbioteIntro(false);
                  setIsCaptchaUnlocked(false);
                  setSelectedRole(null);
                  setCaptchaInput('');
                  setCaptchaCode(String(Math.floor(1000 + Math.random() * 9000)));
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-red-600 border border-white/10 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Lock &amp; Exit</span>
              </button>
            </div>
          </div>

          {/* Status Toast Banner */}
          {statusBanner && (
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white px-5 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between shadow-lg">
              <span>✓ {statusBanner}</span>
              <button
                onClick={() => setStatusBanner(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* ROLE-BASED LOGIN INTRO POPUP:
              - SUPERADMIN: "HIT: THE THIRD CASE" BRUTAL BLOODY MASS CHARACTER INTRO WITH GLOWING "SAGOR" BEHIND
              - ADMIN: SIMPLE CAUTION ALERT FOR SINGLE MOVIE UPLOAD */}
          <AnimatePresence>
            {showSymbioteIntro && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.14 }}
                onClick={() => setShowSymbioteIntro(false)}
                className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center p-4 select-none overflow-hidden"
              >
                {authenticatedRole === 'SUPERADMIN' ? (
                  /* ============================================================================
                     "HIT: THE THIRD CASE" BLOODY BRUTAL MASS CHARACTER INTRO ("WELCOME BOSS • SAGOR")
                     ============================================================================ */
                  <motion.div
                    initial={{ scale: 0.86, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.94, opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-w-2xl w-full rounded-2xl overflow-hidden border-2 border-red-600 bg-[#070204] shadow-[0_0_90px_rgba(220,38,38,0.85)]"
                  >
                    {/* Top & Bottom Brutal Crimson Cinema Letterbox Bars */}
                    <div
                      className="h-3.5 w-full"
                      style={{
                        background:
                          'repeating-linear-gradient(45deg, #dc2626, #dc2626 14px, #050203 14px, #050203 28px)'
                      }}
                    />

                    {/* Crimson Blood-Spatter Radial Atmosphere & Diagonal Katana/Axe Blood Slash Lines */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(circle at 50% 42%, rgba(220, 38, 38, 0.42) 0%, rgba(127, 29, 29, 0.22) 45%, rgba(5, 2, 3, 0.96) 85%)'
                      }}
                    />

                    {/* Brutal Diagonal Blood-Slash SVG Vector Overlay */}
                    <svg
                      className="pointer-events-none absolute inset-0 w-full h-full opacity-85"
                      viewBox="0 0 800 450"
                      preserveAspectRatio="none"
                    >
                      {/* High-velocity blood slash streaks */}
                      <path
                        d="M-40 390 L840 55"
                        stroke="#ef4444"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M-20 85 L820 380"
                        stroke="#991b1b"
                        strokeWidth="3.5"
                        strokeDasharray="18 8"
                      />
                      {/* Crimson blood splatter droplets */}
                      <circle cx="145" cy="110" r="14" fill="#dc2626" opacity="0.65" />
                      <circle cx="170" cy="130" r="6" fill="#ef4444" opacity="0.8" />
                      <circle cx="660" cy="95" r="18" fill="#b91c1c" opacity="0.6" />
                      <circle cx="635" cy="120" r="7" fill="#ef4444" opacity="0.85" />
                      <circle cx="685" cy="325" r="12" fill="#dc2626" opacity="0.7" />
                      <circle cx="120" cy="340" r="10" fill="#991b1b" opacity="0.75" />
                    </svg>

                    {/* MASSIVE GLOWING "SAGOR" WATERMARK BEHIND THE CHARACTER INTRO */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                      <span
                        className="font-display-3d font-black uppercase select-none tracking-tighter"
                        style={{
                          fontSize: 'clamp(5.2rem, 18vw, 11.5rem)',
                          lineHeight: 0.9,
                          color: 'rgba(255, 255, 255, 0.09)',
                          WebkitTextStroke: '2px rgba(239, 68, 68, 0.72)',
                          textShadow:
                            '0 0 35px rgba(239, 68, 68, 0.95), 0 0 75px rgba(220, 38, 38, 0.85), 0 6px 0 rgba(127, 29, 29, 0.9)'
                        }}
                      >
                        SAGOR
                      </span>
                    </div>

                    {/* Foreground Mass Character Intro Content */}
                    <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 text-center space-y-4">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-red-950/90 border border-red-500 text-red-200 text-[11px] font-black uppercase tracking-[0.22em] shadow-lg">
                        <span>🩸 HIT : THE THIRD CASE • BRUTAL MASS CHARACTER INTRO</span>
                      </div>

                      {/* Glowing Backlit SAGOR Emblem Badge */}
                      <div className="pt-1">
                        <div
                          className="font-display-3d font-black uppercase tracking-widest text-amber-400 text-xs sm:text-sm"
                          style={{
                            textShadow: '0 0 16px rgba(245, 158, 11, 0.9)'
                          }}
                        >
                          ★ HOMICIDE INTERVENTION TEAM • SUPREME COMMANDER ★
                        </div>
                        <h3
                          className="font-display-3d font-black uppercase tracking-tight text-white mt-1"
                          style={{
                            fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
                            lineHeight: 1.05,
                            textShadow:
                              '0 2px 0 #dc2626, 0 4px 0 #7f1d1d, 0 0 32px rgba(239, 68, 68, 1)'
                          }}
                        >
                          WELCOME BOSS
                        </h3>
                      </div>

                      {/* Intense Glowing SAGOR Nameplate */}
                      <div className="inline-block px-6 py-2 rounded-xl bg-gradient-to-r from-red-950/90 via-red-700/40 to-red-950/90 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.65)]">
                        <span
                          className="font-display-3d font-black uppercase tracking-[0.18em] text-2xl sm:text-4xl text-white"
                          style={{
                            textShadow:
                              '0 0 18px #ef4444, 0 0 36px #dc2626, 0 2px 0 #fde047'
                          }}
                        >
                          SAGOR
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-red-100/90 font-bold max-w-lg mx-auto leading-relaxed">
                        Unrestricted <span className="text-amber-400 font-black">SUPER ADMIN</span> Authority Unlocked. Full Website Cloner, Catalog Control, Live Analytics &amp; Direct Admin Password Override are at your command, Boss.
                      </p>

                      <div className="pt-3 max-w-sm mx-auto">
                        <button
                          type="button"
                          onClick={() => setShowSymbioteIntro(false)}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:brightness-110 text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(220,38,38,0.8)] transition cursor-pointer"
                        >
                          🩸 ENTER BOSS COMMAND CENTER →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* ============================================================================
                     STANDARD ADMIN (Rani2026) CAUTION ALERT POPUP
                     ============================================================================ */
                  <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.14, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-w-md w-full rounded-2xl overflow-hidden border-2 border-amber-500 bg-[#0c0a0e] shadow-2xl"
                  >
                    <div
                      className="h-3 w-full"
                      style={{
                        background:
                          'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 12px, #09090b 12px, #09090b 24px)'
                      }}
                    />
                    <div className="p-6 text-center space-y-3.5">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/15 border-2 border-amber-500 flex items-center justify-center text-amber-400">
                        <ShieldAlert className="w-8 h-8" />
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-emerald-600/25 border border-emerald-500/50 text-emerald-300 text-[11px] font-black uppercase tracking-widest">
                        <span>🎬 ADMIN ACCESS • SINGLE MOVIE UPLOAD MODE</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white">
                        WELCOME ADMIN {(loginUser || 'RANI2026').toUpperCase()}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed">
                        You are logged in with <strong className="text-amber-400">Standard Admin</strong> privileges. You can upload <strong className="text-white">1 Single Movie</strong> during this session.
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setShowSymbioteIntro(false)}
                          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest transition cursor-pointer"
                        >
                          🎬 Continue to Single Movie Upload →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!isAuthenticated ? (
            /* ============================================================================
               16-CLICK SECRET SECURITY GATEWAY:
               STEP 1: CAPTCHA SECURITY LOCK
               STEP 2: 2-OPTION ROLE SELECTOR (1. ADMIN vs 2. SUPER ADMIN)
               STEP 3: ROLE-SPECIFIC LOGIN SCREEN
               ============================================================================ */
            <div className="p-6 sm:p-10 max-w-lg mx-auto">
              {!isCaptchaUnlocked ? (
                /* STEP 1: SECURITY CAPTCHA LOCK POPUP */
                <div className="glass-card rounded-2xl p-6 sm:p-7 border-2 border-amber-500/50 space-y-5 text-center">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/15 border-2 border-amber-500 flex items-center justify-center text-amber-400">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-widest">
                    <span>🔒 16-CLICK STEALTH SECURITY CAPTCHA LOCK</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide">
                    Verify Human Security Lock
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Restricted stealth gateway triggered. Enter the 4-digit security code below to unlock the <strong>Admin / SuperAdmin</strong> role selector.
                  </p>

                  {/* Captcha Display Box */}
                  <div className="py-3.5 px-6 rounded-xl bg-black/90 border-2 border-dashed border-amber-400/70 inline-flex items-center gap-4 mx-auto">
                    <span className="font-mono-num text-2xl sm:text-3xl font-black tracking-[0.35em] text-amber-400 select-none">
                      {captchaCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCaptchaCode(String(Math.floor(1000 + Math.random() * 9000)));
                        setCaptchaError('');
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs cursor-pointer"
                      title="Generate New Code"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {captchaError && (
                    <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-300 font-bold">
                      ⚠️ {captchaError}
                    </div>
                  )}

                  <form onSubmit={handleCaptchaVerify} className="space-y-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="Enter 4-Digit Security Code"
                      className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/20 text-center font-mono-num text-lg font-extrabold text-white tracking-widest focus:border-amber-400 focus:outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest transition cursor-pointer"
                    >
                      🔓 Unlock Security Gate →
                    </button>
                  </form>
                </div>
              ) : !selectedRole ? (
                /* STEP 2: CHOOSE ROLE (OPTION 1: ADMIN vs OPTION 2: SUPER ADMIN) */
                <div className="glass-card rounded-2xl p-6 sm:p-7 border border-red-500/40 space-y-5">
                  <div className="text-center space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-widest">
                      <span>✓ Security Captcha Verified</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase">
                      Select Access Clearance Level
                    </h3>
                    <p className="text-xs text-slate-400">
                      Choose between Standard Admin (Single Movie Upload) or Supreme SuperAdmin (Full Control).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {/* Option 1: Standard Admin */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('ADMIN');
                        setLoginError('');
                        setLoginUser('');
                        setLoginPass('');
                        setIsForgotMode(false);
                      }}
                      className="p-5 rounded-2xl bg-black/75 hover:bg-emerald-950/40 border-2 border-emerald-500/40 hover:border-emerald-400 text-left space-y-2 transition group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black">
                        1
                      </div>
                      <div className="text-base font-black text-white group-hover:text-emerald-300 uppercase">
                        1. Admin Login
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Restricted to uploading <strong>1 Single Movie</strong> only. Cannot delete catalog, clone sites, or change settings.
                      </p>
                      <div className="pt-1 text-[11px] font-extrabold text-emerald-400 uppercase">
                        Select Admin →
                      </div>
                    </button>

                    {/* Option 2: Super Admin */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('SUPERADMIN');
                        setLoginError('');
                        setLoginUser('');
                        setLoginPass('');
                        setIsForgotMode(false);
                      }}
                      className="p-5 rounded-2xl bg-black/75 hover:bg-red-950/50 border-2 border-red-500/50 hover:border-amber-400 text-left space-y-2 transition group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-600/25 border border-red-500/50 flex items-center justify-center text-amber-400 font-black">
                        2
                      </div>
                      <div className="text-base font-black text-white group-hover:text-amber-300 uppercase">
                        2. Super Admin
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Supreme Boss Control. Full Cloner, Edit/Delete All, Analytics, and can change Admin username &amp; password anytime.
                      </p>
                      <div className="pt-1 text-[11px] font-extrabold text-amber-400 uppercase">
                        Select Super Admin →
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                /* STEP 3: CREDENTIAL LOGIN FORM FOR SELECTED ROLE */
                <div className="glass-card rounded-2xl p-6 sm:p-7 border border-red-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole(null);
                        setLoginError('');
                        setIsForgotMode(false);
                      }}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                    >
                      ← Switch Role ({selectedRole})
                    </button>
                  </div>

                  {!isForgotMode ? (
                    <>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-500/20 border border-red-500/40 text-amber-300 text-[10px] font-black uppercase mb-1">
                        <span>
                          {selectedRole === 'SUPERADMIN'
                            ? '🩸 SUPER ADMIN • FULL BOSS AUTHORITY'
                            : '🎬 ADMIN • SINGLE MOVIE UPLOAD ONLY'}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-white">
                        {selectedRole === 'SUPERADMIN'
                          ? 'Super Admin Login (Boss Console)'
                          : 'Standard Admin Login (1-Movie Upload)'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {selectedRole === 'SUPERADMIN'
                          ? 'Enter SuperAdmin username and primary or secondary password.'
                          : 'Enter Admin username and password assigned by SuperAdmin.'}
                      </p>

                      {loginError && (
                        <div className="mt-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{loginError}</span>
                        </div>
                      )}

                      <form
                        onSubmit={handleLoginSubmit}
                        autoComplete="off"
                        className="mt-5 space-y-4"
                      >
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                            {selectedRole === 'SUPERADMIN'
                              ? 'SuperAdmin Username'
                              : 'Admin Username'}
                          </label>
                          <input
                            type="text"
                            name="mh_admin_user_secret"
                            autoComplete="off"
                            value={loginUser}
                            onChange={(e) => setLoginUser(e.target.value)}
                            placeholder="Enter username"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-white/15 text-white text-sm focus:border-red-500 focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                            {selectedRole === 'SUPERADMIN'
                              ? 'Primary or Secondary Password'
                              : 'Admin Password'}
                          </label>
                          <input
                            type="password"
                            name="mh_admin_pass_secret"
                            autoComplete="new-password"
                            value={loginPass}
                            onChange={(e) => setLoginPass(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-white/15 text-white text-sm focus:border-red-500 focus:outline-none"
                            required
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {selectedRole === 'SUPERADMIN' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setIsForgotMode(true);
                                setLoginError('');
                                setRecoveredInfo(null);
                              }}
                              className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>Forgot Password?</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500">
                              Contact SuperAdmin to reset
                            </span>
                          )}

                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg red-glass-btn text-white text-xs font-extrabold uppercase tracking-wider transition cursor-pointer"
                          >
                            {selectedRole === 'SUPERADMIN'
                              ? 'Unlock Boss Console'
                              : 'Unlock Admin Upload'}
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    /* FORGOT PASSWORD SECURITY QUESTION RECOVERY (SUPERADMIN) */
                    <>
                      <h3 className="text-lg font-extrabold text-white">
                        SuperAdmin Identity Recovery
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Answer your personal security question to recover SuperAdmin access.
                      </p>

                      {loginError && (
                        <div className="mt-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-300 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          <span>{loginError}</span>
                        </div>
                      )}

                      <form
                        onSubmit={handleSecurityRecovery}
                        autoComplete="off"
                        className="mt-5 space-y-4"
                      >
                        <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30">
                          <span className="text-[11px] uppercase font-bold text-red-400 block mb-1">
                            Security Question:
                          </span>
                          <p className="text-sm font-extrabold text-white">
                            What Is my Wife Name?
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                            Your Answer
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            value={securityAnswerInput}
                            onChange={(e) => setSecurityAnswerInput(e.target.value)}
                            placeholder="Type your security answer"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-white/15 text-white text-sm focus:border-red-500 focus:outline-none"
                            required
                          />
                        </div>

                        {recoveredInfo && (
                          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 space-y-1.5 text-xs">
                            <div className="font-extrabold text-emerald-300 uppercase">
                              ✓ Identity Verified! Credentials Recovered:
                            </div>
                            <div className="text-slate-200">
                              SuperAdmin Username:{' '}
                              <strong className="font-mono-num text-white">
                                {recoveredInfo.username}
                              </strong>
                            </div>
                            <div className="text-slate-200">
                              Primary Password:{' '}
                              <strong className="font-mono-num text-amber-300">
                                {recoveredInfo.password}
                              </strong>
                            </div>
                            <div className="text-slate-200">
                              Secondary Password:{' '}
                              <strong className="font-mono-num text-cyan-300">
                                {recoveredInfo.backupPassword}
                              </strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => triggerRoleLoginAuth('SUPERADMIN')}
                              className="mt-2 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase text-xs cursor-pointer"
                            >
                              Enter SuperAdmin Console Now
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsForgotMode(false);
                              setLoginError('');
                            }}
                            className="text-xs text-slate-400 hover:text-white cursor-pointer"
                          >
                            ← Back to Login
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-lg red-glass-btn text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer"
                          >
                            Verify Answer
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* AUTHENTICATED ADMIN / SUPERADMIN WORKSPACE */
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-3 bg-black/60 border-b lg:border-b-0 lg:border-r border-red-500/20 p-4 space-y-1.5">
                {visibleSidebarItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                        active
                          ? 'red-glass-btn text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
                {authenticatedRole === 'ADMIN' && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
                    <strong className="block text-amber-400 uppercase mb-0.5">
                      🔒 Standard Admin Mode
                    </strong>
                    You have permission to upload <strong>1 Single Movie</strong> ({adminUploadedCount}/1 used). All other modules require <strong>SuperAdmin</strong> clearance.
                  </div>
                )}
              </aside>

              {/* Main Content Panel */}
              <main className="lg:col-span-9 p-4 sm:p-6 overflow-y-auto">
                {/* MODULE 1: 1-CLICK SELECTION UPLOAD STUDIO (ZERO TYPING FOR TAGS) */}
                {activeTab === 'upload' && (
                  <form onSubmit={handleCreateMovieSubmit} className="space-y-5">
                    <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-extrabold text-white">
                          Quick-Click Movie &amp; Series Upload Studio
                        </h3>
                        <p className="text-xs text-slate-400">
                          Just type Name, Cast &amp; Storyline — click any Year, Language, Quality, Genre &amp; Category below to select automatically!
                        </p>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-amber-300 font-mono-num">
                        Auto-Title: <strong>{computedUploadDisplayTitle}</strong>
                      </div>
                    </div>

                    {/* Text Inputs: ONLY Name, Cast, Storyline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-red-400 uppercase mb-1">
                          1. Type Movie / Series Name *
                        </label>
                        <input
                          type="text"
                          value={upTitle}
                          onChange={(e) => setUpTitle(e.target.value)}
                          placeholder="e.g. Toofan / Pushpa 2 / Kurulus Osman"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-white/15 text-white text-sm focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-red-400 uppercase mb-1">
                          2. Type Star Cast
                        </label>
                        <input
                          type="text"
                          value={upCast}
                          onChange={(e) => setUpCast(e.target.value)}
                          placeholder="e.g. Shakib Khan, Chanchal Chowdhury..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-white/15 text-white text-sm focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-extrabold text-red-400 uppercase mb-1">
                          3. Type Storyline / Synopsis
                        </label>
                        <textarea
                          rows={2}
                          value={upStoryline}
                          onChange={(e) => setUpStoryline(e.target.value)}
                          placeholder="Type short movie storyline..."
                          className="w-full px-3.5 py-2 rounded-xl bg-black/70 border border-white/15 text-white text-xs sm:text-sm focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* ONE-CLICK FORMAT TYPE & EPISODE BADGE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="glass-card rounded-xl p-3.5">
                        <label className="block text-xs font-extrabold text-amber-400 uppercase mb-2">
                          Click Format Type:
                        </label>
                        <div className="flex gap-2">
                          {(['MOVIE', 'SERIES'] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setUpType(t)}
                              className={`flex-1 py-2 rounded-lg text-xs font-extrabold uppercase transition cursor-pointer ${
                                upType === t
                                  ? 'red-glass-btn text-white ring-2 ring-amber-400'
                                  : 'bg-black/60 text-slate-400 border border-white/10 hover:text-white'
                              }`}
                            >
                              {upType === t ? '✓ ' : ''}
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="glass-card rounded-xl p-3.5">
                        <label className="block text-xs font-extrabold text-amber-400 uppercase mb-2">
                          Click Episode Badge (Optional for Series):
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {CLICK_EPISODE_OPTIONS.map((ep) => {
                            const active = upEpisodeBadge === ep;
                            return (
                              <button
                                key={ep || 'none'}
                                type="button"
                                onClick={() => setUpEpisodeBadge(ep)}
                                className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                                  active
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-black/60 text-slate-400 border border-white/10 hover:text-white'
                                }`}
                              >
                                {ep || 'None (Movie)'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* ONE-CLICK RELEASE YEAR CHIPS */}
                    <div className="glass-card rounded-xl p-3.5">
                      <label className="block text-xs font-extrabold text-amber-400 uppercase mb-2">
                        Click Release Year (Selected: <span className="text-white">{upYear}</span>):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {CLICK_YEAR_OPTIONS.map((yr) => {
                          const active = upYear === yr;
                          return (
                            <button
                              key={yr}
                              type="button"
                              onClick={() => setUpYear(yr)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono-num font-extrabold transition cursor-pointer ${
                                active
                                  ? 'red-glass-btn text-white ring-2 ring-amber-400'
                                  : 'bg-black/60 text-slate-400 border border-white/10 hover:text-white'
                              }`}
                            >
                              {active ? '✓ ' : ''}
                              {yr}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ONE-CLICK LANGUAGE CHIPS */}
                    <div className="glass-card rounded-xl p-3.5">
                      <label className="block text-xs font-extrabold text-emerald-400 uppercase mb-2">
                        Click Language (Selected: <span className="text-white">{upLanguage}</span>):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {CLICK_LANGUAGE_OPTIONS.map((lang) => {
                          const active = upLanguage === lang;
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => {
                                setUpLanguage(lang);
                                // Also auto-add matching category if not present
                                const baseCat = lang.split(' ')[0];
                                if (ALL_CATEGORY_IDS.includes(lang) && !upCategories.includes(lang)) {
                                  setUpCategories((prev) => [...prev, lang]);
                                } else if (ALL_CATEGORY_IDS.includes(baseCat) && !upCategories.includes(baseCat)) {
                                  setUpCategories((prev) => [...prev, baseCat]);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                                active
                                  ? 'bg-emerald-600 text-white ring-2 ring-amber-300'
                                  : 'bg-black/60 text-slate-400 border border-white/10 hover:text-white'
                              }`}
                            >
                              {active ? '✓ ' : ''}
                              {lang}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ONE-CLICK PRINT QUALITY CHIPS */}
                    <div className="glass-card rounded-xl p-3.5">
                      <label className="block text-xs font-extrabold text-cyan-400 uppercase mb-2">
                        Click Print Quality (Selected: <span className="text-white">{upQuality}</span>):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {CLICK_QUALITY_OPTIONS.map((qual) => {
                          const active = upQuality === qual;
                          return (
                            <button
                              key={qual}
                              type="button"
                              onClick={() => setUpQuality(qual)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                                active
                                  ? 'bg-cyan-500 text-slate-950 ring-2 ring-white'
                                  : 'bg-black/60 text-slate-400 border border-white/10 hover:text-white'
                              }`}
                            >
                              {active ? '✓ ' : ''}
                              {qual}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ONE-CLICK GENRE MULTI-SELECT CHIPS */}
                    <div className="glass-card rounded-xl p-3.5">
                      <label className="block text-xs font-extrabold text-purple-400 uppercase mb-2">
                        Click Genres (Multi-Select):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {CLICK_GENRE_OPTIONS.map((g) => {
                          const active = upSelectedGenres.includes(g);
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() =>
                                setUpSelectedGenres((prev) =>
                                  prev.includes(g)
                                    ? prev.filter((x) => x !== g)
                                    : [...prev, g]
                                )
                              }
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                active
                                  ? 'bg-purple-600 text-white border border-amber-300'
                                  : 'bg-black/60 text-slate-400 border border-white/10 hover:text-white'
                              }`}
                            >
                              {active ? '✓ ' : '+ '}
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ONE-CLICK RED CATEGORY MULTI-SELECT CHIPS */}
                    <div className="glass-card rounded-xl p-3.5">
                      <label className="block text-xs font-extrabold text-red-400 uppercase mb-2">
                        Click Website Categories (Where Movie Appears):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {ALL_CATEGORY_IDS.map((catId) => {
                          const checked = upCategories.includes(catId);
                          return (
                            <button
                              key={catId}
                              type="button"
                              onClick={() =>
                                setUpCategories((prev) =>
                                  prev.includes(catId)
                                    ? prev.filter((c) => c !== catId)
                                    : [...prev, catId]
                                )
                              }
                              className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                                checked
                                  ? 'red-glass-btn text-white'
                                  : 'bg-black/60 text-slate-400 border border-white/10 hover:text-white'
                              }`}
                            >
                              {checked ? '✓ ' : '+ '}
                              {catId}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Poster Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 glass-card rounded-xl p-4">
                      <div className="md:col-span-3">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden border border-white/15 bg-black">
                          <img
                            src={upPoster}
                            alt="Poster Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-9 space-y-3">
                        <label className="block text-xs font-extrabold text-red-400 uppercase">
                          Movie Poster (Upload Image File or Paste URL)
                        </label>
                        <input
                          type="text"
                          value={upPoster}
                          onChange={(e) => setUpPoster(e.target.value)}
                          placeholder="Paste direct poster image URL..."
                          className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white text-xs"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="px-3 py-1.5 rounded-lg red-glass-btn text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Upload Poster File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadFile(e, 'upPoster')}
                              className="hidden"
                            />
                          </label>
                          {PRESET_POSTER_GALLERY.map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setUpPoster(preset.url)}
                              className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-semibold cursor-pointer"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 4/5 Screenshots */}
                    <div className="glass-card rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-red-400 uppercase">
                          4–5 Movie Screenshots
                        </label>
                        <label className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Upload Screenshot File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadFile(e, 'upShot')}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upNewShotUrl}
                          onChange={(e) => setUpNewShotUrl(e.target.value)}
                          placeholder="Paste screenshot URL..."
                          className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!upNewShotUrl.trim()) return;
                            setUpScreenshots((p) => [...p, upNewShotUrl.trim()]);
                            setUpNewShotUrl('');
                          }}
                          className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-bold cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {upScreenshots.map((shot, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-video rounded-lg overflow-hidden border border-white/15 bg-black"
                          >
                            <img
                              src={shot}
                              alt={`Shot ${idx + 1}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setUpScreenshots((p) => p.filter((_, i) => i !== idx))
                              }
                              className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4 Resolution Links (Just Paste URLs — No Size Fields) */}
                    <div className="glass-card rounded-xl p-4 space-y-3">
                      <label className="block text-xs font-extrabold text-red-400 uppercase">
                        Paste 4 Download Links (480p / 720p / 1080p / 4K)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={upLink480}
                          onChange={(e) => setUpLink480(e.target.value)}
                          placeholder="480p Direct Link (https://...)"
                          className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white text-xs"
                        />
                        <input
                          type="text"
                          value={upLink720}
                          onChange={(e) => setUpLink720(e.target.value)}
                          placeholder="720p Direct Link (https://...)"
                          className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white text-xs"
                        />
                        <input
                          type="text"
                          value={upLink1080}
                          onChange={(e) => setUpLink1080(e.target.value)}
                          placeholder="1080p Direct Link (https://...)"
                          className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white text-xs"
                        />
                        <input
                          type="text"
                          value={upLink4k}
                          onChange={(e) => setUpLink4k(e.target.value)}
                          placeholder="4K UHD Direct Link (https://...)"
                          className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={upIsPinned}
                          onChange={(e) => setUpIsPinned(e.target.checked)}
                          className="w-4 h-4 accent-amber-400"
                        />
                        <span className="text-xs font-bold text-amber-400">
                          Pin Movie to Top
                        </span>
                      </label>
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl red-glass-btn text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
                      >
                        Publish Movie Now
                      </button>
                    </div>
                  </form>
                )}

                {/* MODULE 2: SEPARATE EDIT & PIN EXISTING MOVIES (FULL ADMIN EDITOR + AUTO-SYNC TOGGLE) */}
                {activeTab === 'edit_catalog' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-white">
                          Full Admin Movie Editor, Change Posters/Screenshots/Links &amp; Live Original-Site Sync
                        </h3>
                        <p className="text-xs text-slate-400">
                          Click any movie below to edit its Name, Storyline, Year, Language, Quality, Genres, Categories, Poster, Screenshots, Download Links, or Original Website Auto-Sync.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {movies.length > 0 && (
                          <button
                            type="button"
                            onClick={handleCleanAllMovies}
                            className="px-3.5 py-2 rounded-xl bg-red-950/90 hover:bg-red-600 border border-red-500/50 text-red-200 hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>🧹 Clean All Movies ({movies.length})</span>
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={isSyncingCloned}
                          onClick={() => handleSyncAllClonedMovies()}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:brightness-110 disabled:opacity-50 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloned ? 'animate-spin' : ''}`} />
                          <span>
                            {isSyncingCloned
                              ? 'Syncing Original Websites...'
                              : '🔄 Auto-Sync All Cloned Movies Now'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {selectedEditMovieId && (
                      <form
                        onSubmit={handleSaveEditedMovie}
                        className="glass-card rounded-2xl p-5 border border-red-500/40 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div>
                            <h4 className="text-sm font-extrabold text-amber-400">
                              Editing Movie: {edTitle} ({edYear}) {edQuality} [{edLanguage}]
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Full Admin Override — Change any field below and click Save Changes Now.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {edSourceUrl && (
                              <button
                                type="button"
                                disabled={isSyncingCloned}
                                onClick={() => handleSyncAllClonedMovies(selectedEditMovieId)}
                                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-extrabold cursor-pointer transition"
                              >
                                🔄 Sync from Original Website Now
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedEditMovieId(null)}
                              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-slate-300 hover:text-white cursor-pointer"
                            >
                              Close Editor ✕
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-400 font-bold block mb-1">
                              Movie Name
                            </label>
                            <input
                              type="text"
                              value={edTitle}
                              onChange={(e) => setEdTitle(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 font-bold block mb-1">
                              Main Cast / Stars
                            </label>
                            <input
                              type="text"
                              value={edCast}
                              onChange={(e) => setEdCast(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 font-bold block mb-1">
                              Original Source URL (For Auto-Sync)
                            </label>
                            <input
                              type="text"
                              value={edSourceUrl}
                              onChange={(e) => setEdSourceUrl(e.target.value)}
                              placeholder="https://... (Original movie post link)"
                              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-cyan-500/30 text-cyan-300 text-xs"
                            />
                          </div>
                        </div>

                        {/* Storyline / Plot */}
                        <div>
                          <label className="text-[11px] text-slate-400 font-bold block mb-1">
                            Movie Storyline / Description
                          </label>
                          <textarea
                            rows={2}
                            value={edStoryline}
                            onChange={(e) => setEdStoryline(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                          />
                        </div>

                        {/* 1-Click Content Type & Episode Badge */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-amber-400 font-bold block mb-1">
                              Type (Movie or Series):
                            </label>
                            <div className="flex gap-2">
                              {(['MOVIE', 'SERIES'] as const).map((tp) => (
                                <button
                                  key={tp}
                                  type="button"
                                  onClick={() => setEdType(tp)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${
                                    edType === tp
                                      ? 'bg-amber-400 text-slate-950'
                                      : 'bg-black/60 text-slate-400 border border-white/10'
                                  }`}
                                >
                                  {tp}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 font-bold block mb-1">
                              Episode / Season Badge (Optional)
                            </label>
                            <input
                              type="text"
                              value={edEpisodeBadge}
                              onChange={(e) => setEdEpisodeBadge(e.target.value)}
                              placeholder="e.g. S01 EP 01-10 ADDED"
                              className="w-full px-3 py-1.5 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                            />
                          </div>
                        </div>

                        {/* 1-Click Year in Edit */}
                        <div>
                          <label className="text-[11px] text-amber-400 font-bold block mb-1">
                            Click Year:
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {CLICK_YEAR_OPTIONS.map((yr) => (
                              <button
                                key={yr}
                                type="button"
                                onClick={() => setEdYear(yr)}
                                className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                                  edYear === yr
                                    ? 'red-glass-btn text-white'
                                    : 'bg-black/60 text-slate-400 border border-white/10'
                                }`}
                              >
                                {yr}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 1-Click Language in Edit */}
                        <div>
                          <label className="text-[11px] text-emerald-400 font-bold block mb-1">
                            Click Language:
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {CLICK_LANGUAGE_OPTIONS.map((lang) => (
                              <button
                                key={lang}
                                type="button"
                                onClick={() => setEdLanguage(lang)}
                                className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                                  edLanguage === lang
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-black/60 text-slate-400 border border-white/10'
                                }`}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 1-Click Quality in Edit */}
                        <div>
                          <label className="text-[11px] text-cyan-400 font-bold block mb-1">
                            Click Quality:
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {CLICK_QUALITY_OPTIONS.map((qual) => (
                              <button
                                key={qual}
                                type="button"
                                onClick={() => setEdQuality(qual)}
                                className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                                  edQuality === qual
                                    ? 'bg-cyan-500 text-slate-950'
                                    : 'bg-black/60 text-slate-400 border border-white/10'
                                }`}
                              >
                                {qual}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 1-Click Genres in Edit */}
                        <div>
                          <label className="text-[11px] text-purple-400 font-bold block mb-1">
                            Click Genres (Multi-Select):
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {CLICK_GENRE_OPTIONS.map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => toggleArrayChip(edGenres, g, setEdGenres)}
                                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                                  edGenres.includes(g)
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-black/60 text-slate-400 border border-white/10'
                                }`}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 1-Click Categories in Edit */}
                        <div>
                          <label className="text-[11px] text-pink-400 font-bold block mb-1">
                            Click Categories (Multi-Select):
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => toggleArrayChip(edCategories, cat, setEdCategories)}
                                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                                  edCategories.includes(cat)
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-black/60 text-slate-400 border border-white/10'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Poster URL + Upload */}
                        <div>
                          <label className="text-[11px] text-amber-400 font-bold block mb-1">
                            Poster Image URL (or Upload New Poster)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={edPoster}
                              onChange={(e) => setEdPoster(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                            />
                            <label className="px-3 py-2 rounded-lg red-glass-btn text-white text-xs font-bold cursor-pointer shrink-0">
                              Upload Poster
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleUploadFile(e, 'edPoster')}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Screenshots Editor in Edit Modal */}
                        <div className="bg-black/50 p-3 rounded-xl border border-white/10 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <label className="text-[11px] text-cyan-400 font-bold uppercase">
                              Movie Screenshots ({edScreenshots.length})
                            </label>
                            <label className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold cursor-pointer">
                              + Upload Screenshot File
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleUploadFile(e, 'edShot')}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={edNewShotUrl}
                              onChange={(e) => setEdNewShotUrl(e.target.value)}
                              placeholder="Paste new screenshot URL..."
                              className="flex-1 px-3 py-1.5 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!edNewShotUrl.trim()) return;
                                setEdScreenshots((prev) => [...prev, edNewShotUrl.trim()]);
                                setEdNewShotUrl('');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-extrabold cursor-pointer"
                            >
                              + Add Shot
                            </button>
                          </div>
                          {edScreenshots.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {edScreenshots.map((shot, idx) => (
                                <div
                                  key={idx}
                                  className="relative aspect-video rounded-lg overflow-hidden border border-white/15 bg-black"
                                >
                                  <img
                                    src={shot}
                                    alt={`Shot ${idx + 1}`}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEdScreenshots((prev) => prev.filter((_, i) => i !== idx))
                                    }
                                    className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 4 Resolution Download Links */}
                        <div>
                          <label className="text-[11px] text-red-400 font-bold block mb-1.5 uppercase">
                            Download Links (Leave blank if resolution is not available)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                              type="text"
                              value={edLink480}
                              onChange={(e) => setEdLink480(e.target.value)}
                              placeholder="480p Download Link (Optional)"
                              className="px-3 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                            />
                            <input
                              type="text"
                              value={edLink720}
                              onChange={(e) => setEdLink720(e.target.value)}
                              placeholder="720p Download Link (Optional)"
                              className="px-3 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                            />
                            <input
                              type="text"
                              value={edLink1080}
                              onChange={(e) => setEdLink1080(e.target.value)}
                              placeholder="1080p Download Link (Optional)"
                              className="px-3 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                            />
                            <input
                              type="text"
                              value={edLink4k}
                              onChange={(e) => setEdLink4k(e.target.value)}
                              placeholder="4K UHD Download Link (Optional)"
                              className="px-3 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={edIsPinned}
                                onChange={(e) => setEdIsPinned(e.target.checked)}
                                className="w-4 h-4 accent-amber-400"
                              />
                              <span className="text-xs font-bold text-amber-400">
                                Pinned to Top
                              </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={edAutoSyncEnabled}
                                onChange={(e) => setEdAutoSyncEnabled(e.target.checked)}
                                className="w-4 h-4 accent-cyan-400"
                              />
                              <span className="text-xs font-bold text-cyan-400">
                                Auto-Sync When Original Website Changes
                              </span>
                            </label>
                          </div>

                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase cursor-pointer"
                          >
                            Save Movie Changes Now
                          </button>
                        </div>
                      </form>
                    )}

                    {/* ADMIN MOVIE SEARCH, FILTER & BULK DELETE BAR (Delete by Filter, Search, Selected, or All!) */}
                    {(() => {
                      const adminFilteredList = movies.filter((m) => {
                        const matchLang =
                          adminEditLangFilter === 'ALL' ||
                          m.language.toUpperCase().includes(adminEditLangFilter) ||
                          m.categories.some((c) => c.toUpperCase() === adminEditLangFilter);
                        const q = adminEditSearchQuery.trim().toLowerCase();
                        const matchQ =
                          !q ||
                          m.title.toLowerCase().includes(q) ||
                          m.fullDisplayTitle.toLowerCase().includes(q) ||
                          m.language.toLowerCase().includes(q) ||
                          m.quality.toLowerCase().includes(q) ||
                          m.year.toLowerCase().includes(q) ||
                          m.cast.toLowerCase().includes(q) ||
                          m.categories.some((c) => c.toLowerCase().includes(q));
                        return matchLang && matchQ;
                      });

                      const allFilteredSelected =
                        adminFilteredList.length > 0 &&
                        adminFilteredList.every((m) => selectedBulkIds.includes(m.id));

                      return (
                        <>
                          <div className="bg-black/65 border border-rose-500/30 rounded-2xl p-4 space-y-3">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                              <div className="relative flex-1">
                                <input
                                  type="text"
                                  value={adminEditSearchQuery}
                                  onChange={(e) => setAdminEditSearchQuery(e.target.value)}
                                  placeholder="🔍 Search movies to Edit or Delete by Name, Year, Language, Quality, Cast, or Category..."
                                  className="w-full px-4 py-2.5 rounded-xl bg-black/85 border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                                />
                                {adminEditSearchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setAdminEditSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                              <span className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-num text-amber-300 font-bold text-center shrink-0">
                                Showing {adminFilteredList.length} / {movies.length} Movies
                              </span>
                            </div>

                            {/* Quick Language / Category Filter Chips */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-extrabold uppercase text-slate-400 mr-1">
                                Filter by Category / Language:
                              </span>
                              {[
                                'ALL',
                                'BANGLA',
                                'BANGLA DUB',
                                'HINDI',
                                'HINDI DUB',
                                'DUAL AUDIO',
                                'ENGLISH',
                                'TAMIL',
                                'TELUGU',
                                'TURKISH',
                                'WEB SERIES'
                              ].map((lf) => (
                                <button
                                  key={lf}
                                  type="button"
                                  onClick={() => setAdminEditLangFilter(lf)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer transition ${
                                    adminEditLangFilter === lf
                                      ? 'red-glass-btn text-white'
                                      : 'bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10'
                                  }`}
                                >
                                  {lf}
                                </button>
                              ))}
                            </div>

                            {/* BULK DELETE & PIN ACTION BAR (Delete Filtered, Delete Selected, Unpin All, Delete All) */}
                            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (allFilteredSelected) {
                                      const filteredSet = new Set(adminFilteredList.map((m) => m.id));
                                      setSelectedBulkIds((prev) =>
                                        prev.filter((id) => !filteredSet.has(id))
                                      );
                                    } else {
                                      const merged = Array.from(
                                        new Set([
                                          ...selectedBulkIds,
                                          ...adminFilteredList.map((m) => m.id)
                                        ])
                                      );
                                      setSelectedBulkIds(merged);
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                                >
                                  {allFilteredSelected
                                    ? `☑ Unselect Filtered (${adminFilteredList.length})`
                                    : `☐ Select All Filtered (${adminFilteredList.length})`}
                                </button>

                                {selectedBulkIds.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleBulkDeleteMovies(
                                        selectedBulkIds,
                                        `Selected (${selectedBulkIds.length})`
                                      )
                                    }
                                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/25"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Selected ({selectedBulkIds.length})</span>
                                  </button>
                                )}

                                {(adminEditLangFilter !== 'ALL' || adminEditSearchQuery.trim() !== '') &&
                                  adminFilteredList.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleBulkDeleteMovies(
                                          adminFilteredList.map((m) => m.id),
                                          `Filter: ${adminEditLangFilter}${
                                            adminEditSearchQuery ? ` "${adminEditSearchQuery}"` : ''
                                          }`
                                        )
                                      }
                                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>
                                        Delete Filtered &amp; Searched ({adminFilteredList.length})
                                      </span>
                                    </button>
                                  )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {movies.some((m) => m.isPinned) && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const pinnedMovies = movies.filter((m) => m.isPinned);
                                      for (const pm of pinnedMovies) {
                                        await onUpdateMovie(pm.id, { isPinned: false });
                                      }
                                      showToast(
                                        `Unpinned all ${pinnedMovies.length} movies! Now only pin the exact movies you want.`
                                      );
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-400 border border-amber-400/50 text-amber-300 hover:text-slate-950 text-xs font-extrabold cursor-pointer transition"
                                  >
                                    📌 Unpin All ({movies.filter((m) => m.isPinned).length})
                                  </button>
                                )}

                                {movies.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={handleCleanAllMovies}
                                    className="px-3.5 py-1.5 rounded-lg bg-red-950 hover:bg-red-600 border border-red-500/60 text-red-200 hover:text-white text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer transition"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete All Movies ({movies.length})</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            {adminFilteredList.map((m) => {
                              const isChecked = selectedBulkIds.includes(m.id);
                              return (
                                <div
                                  key={m.id}
                                  className={`glass-card rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                                    isChecked ? 'border-rose-500 bg-rose-950/20' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() =>
                                        setSelectedBulkIds((prev) =>
                                          prev.includes(m.id)
                                            ? prev.filter((id) => id !== m.id)
                                            : [...prev, m.id]
                                        )
                                      }
                                      className="w-4 h-4 accent-rose-500 cursor-pointer shrink-0"
                                      title="Select movie for bulk delete"
                                    />
                                    <img
                                      src={m.posterUrl}
                                      alt={m.title}
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        const img = e.currentTarget;
                                        if (!img.dataset.fallback) {
                                          img.dataset.fallback = '1';
                                          img.src =
                                            'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=700&q=80';
                                        }
                                      }}
                                      className="w-12 h-16 object-cover rounded-lg border border-white/15 shrink-0 bg-zinc-900"
                                    />
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        {m.isPinned && (
                                          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                                            PINNED
                                          </span>
                                        )}
                                        <span className="px-1.5 py-0.5 rounded bg-red-600/30 border border-red-500/40 text-red-300 text-[10px] font-bold">
                                          {m.language}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-bold">
                                          {m.quality}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                                          🖼 {(m.screenshots || []).filter(Boolean).length} Previews
                                        </span>
                                        {m.sourceUrl && m.autoSyncEnabled !== false && (
                                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[9px] font-extrabold">
                                            🔄 AUTO-SYNC
                                          </span>
                                        )}
                                      </div>
                                      <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-1">
                                        {m.fullDisplayTitle}
                                      </h4>
                                      <div className="text-[11px] text-slate-300 font-mono-num flex flex-wrap items-center gap-3 mt-0.5">
                                        <span className="text-emerald-400 font-bold" title="100% Real Accurate Views from actual user opens">
                                          👁 Real Views: {(m.realViews || 0).toLocaleString()}
                                        </span>
                                        <span className="text-amber-300 font-bold" title="100% Real Accurate Download Clicks">
                                          ⬇ Real Clicks: {(m.realLinkClicks || 0).toLocaleString()}
                                        </span>
                                        <span className="text-slate-500" title="Fake/Boosted Public Counter shown only to Visitors">
                                          (Visitor Display: {formatViewCount(m.views)})
                                        </span>
                                        <span>
                                          🔗{' '}
                                          {
                                            [
                                              m.links?.p480,
                                              m.links?.p720,
                                              m.links?.p1080,
                                              m.links?.p4k
                                            ].filter((l) => l && l !== '#').length
                                          }{' '}
                                          Links
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                    {m.sourceUrl && (
                                      <button
                                        type="button"
                                        disabled={isSyncingCloned}
                                        onClick={() => handleSyncAllClonedMovies(m.id)}
                                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold cursor-pointer transition"
                                        title="Sync Latest Changes from Original Site"
                                      >
                                        🔄 Sync
                                      </button>
                                    )}

                                    <button
                                      onClick={() =>
                                        onUpdateMovie(m.id, { isPinned: !m.isPinned }).then(() =>
                                          showToast(
                                            `${m.isPinned ? 'Unpinned' : 'Pinned'} "${m.title}"!`
                                          )
                                        )
                                      }
                                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                                        m.isPinned
                                          ? 'bg-amber-400 text-slate-950'
                                          : 'bg-white/10 text-slate-300 hover:text-white'
                                      }`}
                                    >
                                      <Pin className="w-3.5 h-3.5" />
                                      <span>{m.isPinned ? 'Pinned' : 'Pin'}</span>
                                    </button>

                                    <button
                                      onClick={() => selectMovieForEditing(m)}
                                      className="px-3 py-1.5 rounded-lg red-glass-btn text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>Edit Movie</span>
                                    </button>

                                    <button
                                      onClick={() =>
                                        onDeleteMovie(m.id).then(() =>
                                          showToast(`Deleted "${m.title}"`)
                                        )
                                      }
                                      className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white transition cursor-pointer"
                                      title="Delete Movie"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* MODULE 3: SIMPLE & EASY 1-CLICK CLONER (SINGLE MOVIE + MASTER WEBSITE CLONER) */}
                {activeTab === 'cloner' && (
                  <div className="space-y-6">
                    {/* ===================================================================== */}
                    {/* EASY OPTION 1: 1-CLICK SINGLE MOVIE CLONER (PASTE LINK OR NAME -> GO) */}
                    {/* ===================================================================== */}
                    <div className="glass-card rounded-2xl p-5 border border-red-500/40 bg-gradient-to-br from-[#19050a] via-[#0b080e] to-[#12060c]">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 text-red-400 text-xs font-extrabold uppercase tracking-wider">
                          <Wand2 className="w-4 h-4" />
                          <span>STEP 1: EASY SINGLE MOVIE CLONER (1-CLICK)</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold uppercase">
                          ✓ Auto-Detects Poster, Exact Screenshots, Language, Quality &amp; Links
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-white">
                        Paste Any Movie Page Link or Movie Name → Click &quot;Clone Movie Now&quot;
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Automatically grabs the movie&apos;s real Poster, exact number of Screenshots on that page, full Storyline, Language, Category, Quality, and Download Links — and drops it at #1 Newest!
                      </p>

                      {cloneError && (
                        <div className="mt-3 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-300">
                          {cloneError}
                        </div>
                      )}

                      <form onSubmit={handleAiCloneMovie} className="mt-4 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <input
                            type="text"
                            value={cloneQuery}
                            onChange={(e) => setCloneQuery(e.target.value)}
                            placeholder="Paste single movie URL (https://...) or type movie name..."
                            className="flex-1 px-4 py-3 rounded-xl bg-black/85 border border-red-500/40 text-white text-xs sm:text-sm focus:border-red-400 focus:outline-none"
                            required
                          />
                          <button
                            type="submit"
                            disabled={isCloning}
                            className="px-6 py-3 rounded-xl red-glass-btn disabled:opacity-50 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg shadow-red-600/30"
                          >
                            {isCloning ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Cloning Movie...</span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-4 h-4" />
                                <span>⚡ Clone Movie Now</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              Language (Auto-Detect Default):
                            </span>
                            {['AUTO-DETECT', 'BANGLA', 'BANGLA DUB', 'HINDI', 'HINDI DUB', 'DUAL AUDIO', 'ENGLISH', 'TAMIL', 'TELUGU', 'TURKISH'].map(
                              (lang) => (
                                <button
                                  key={lang}
                                  type="button"
                                  onClick={() => setCloneLangHint(lang)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold cursor-pointer ${
                                    cloneLangHint === lang
                                      ? 'bg-red-600 text-white'
                                      : 'bg-white/5 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {lang}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* ===================================================================== */}
                    {/* EASY OPTION 2: SIMPLE & CLEAN MASTER WEBSITE CLONER                   */}
                    {/* ===================================================================== */}
                    <div className="glass-card rounded-2xl p-5 border border-amber-500/45 bg-gradient-to-br from-[#190b05] via-[#0c080d] to-[#170509]">
                      <div
                        id="master-autopilot-stop-flag"
                        data-stop={autoPilotStopSignal ? '1' : '0'}
                        className="hidden"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
                          <Database className="w-4 h-4" />
                          <span>STEP 2: EASY MASTER WEBSITE CLONER (1-CLICK FULL PAGE OR WEBSITE)</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={isSyncingCloned}
                            onClick={() => handleSyncAllClonedMovies()}
                            className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-[11px] uppercase cursor-pointer transition flex items-center gap-1"
                          >
                            <RefreshCw className={`w-3 h-3 ${isSyncingCloned ? 'animate-spin' : ''}`} />
                            <span>
                              {isSyncingCloned ? 'Syncing...' : '🔄 Sync Website Changes'}
                            </span>
                          </button>
                          {movies.length > 0 && (
                            <button
                              type="button"
                              onClick={handleCleanAllMovies}
                              className="px-3 py-1 rounded-lg bg-red-600/30 hover:bg-red-600 border border-red-500/50 text-red-200 hover:text-white text-[11px] font-extrabold uppercase cursor-pointer transition"
                            >
                              🧹 Delete All ({movies.length})
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-extrabold text-white">
                        Paste Any Movie Website Link → Click &quot;Master Clone Now&quot;
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Clones movies in exact <strong>Newest-First Serial Order by Date</strong> with real Posters, exact Screenshots, full Storyline, and auto-detected Language &amp; Category. Movies are <strong>not pinned automatically</strong> — only movies you manually Pin will stay pinned!
                      </p>

                      {lastSyncSummary && (
                        <div className="mt-2.5 px-3 py-2 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-xs text-cyan-200 flex items-center justify-between">
                          <span>✓ {lastSyncSummary}</span>
                          <button
                            type="button"
                            onClick={() => setLastSyncSummary('')}
                            className="text-cyan-400 hover:text-white text-xs font-bold cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {masterCloneError && (
                        <div className="mt-3 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-300">
                          {masterCloneError}
                        </div>
                      )}

                      <form onSubmit={(e) => handleMasterCloneWebsite(e)} className="mt-4 space-y-3">
                        {/* Main Simple URL + 1-Click Clone Bar */}
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <input
                            type="text"
                            value={masterSiteUrl}
                            onChange={(e) => setMasterSiteUrl(e.target.value)}
                            placeholder="Paste Website URL (e.g. https://mlwbd.com or any movie website)"
                            className="flex-1 px-4 py-3 rounded-xl bg-black/85 border border-amber-500/45 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                            required
                          />
                          <button
                            type="submit"
                            disabled={isMasterCloning}
                            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg shadow-amber-400/25"
                          >
                            {isMasterCloning && !isAutoPilotRunning ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                                <span>
                                  {masterPageMode === 'RANGE'
                                    ? `Cloning P#${masterPageFrom}→#${masterPageTo}...`
                                    : `Cloning Page #${masterPageNum}...`}
                                </span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-4 h-4 text-slate-950" />
                                <span>
                                  {masterPageMode === 'RANGE'
                                    ? `⚡ Master Clone Pages #${masterPageFrom}→#${masterPageTo}`
                                    : `⚡ Master Clone Page #${masterPageNum} Now`}
                                </span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Simple Quick Bar: Click Page 1, 2, 3, 4, 5 + Auto-Pilot Button + Toggle Optional Filters */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-black/60 p-3 rounded-xl border border-white/10">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-extrabold text-amber-400 uppercase mr-1">
                              Quick Page Select:
                            </span>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pNum) => (
                              <button
                                key={pNum}
                                type="button"
                                onClick={() => {
                                  setMasterPageMode('SINGLE');
                                  setMasterPageNum(pNum);
                                }}
                                className={`w-7 h-7 rounded-lg text-xs font-mono-num font-black cursor-pointer transition ${
                                  masterPageMode === 'SINGLE' && masterPageNum === pNum
                                    ? 'bg-amber-400 text-slate-950 ring-2 ring-white'
                                    : 'bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10'
                                }`}
                              >
                                {pNum}
                              </button>
                            ))}
                            <button
                              type="button"
                              disabled={isMasterCloning}
                              onClick={() => {
                                const nextP = masterPageNum + 1;
                                setMasterPageMode('SINGLE');
                                setMasterPageNum(nextP);
                                if (masterSiteUrl.trim()) {
                                  handleMasterCloneWebsite(undefined, nextP);
                                }
                              }}
                              className="px-3 h-7 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white text-xs font-extrabold cursor-pointer transition"
                            >
                              Next Page (#{masterPageNum + 1}) →
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {!isAutoPilotRunning ? (
                              <button
                                type="button"
                                disabled={isMasterCloning}
                                onClick={handleStartAutoPilot10000}
                                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 disabled:opacity-50 text-slate-950 font-black text-xs uppercase cursor-pointer"
                              >
                                🚀 Auto-Clone All Pages
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setAutoPilotStopSignal(true);
                                  const stopEl = document.getElementById('master-autopilot-stop-flag');
                                  if (stopEl) stopEl.setAttribute('data-stop', '1');
                                }}
                                className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase cursor-pointer animate-pulse"
                              >
                                ⏹ Stop Auto-Pilot (P#{masterPageNum})
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setShowMasterAdvanced((prev) => !prev)}
                              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold cursor-pointer"
                            >
                              {showMasterAdvanced
                                ? '▲ Hide Filters'
                                : '⚙ Optional Filters (Page Range / Year / Count)'}
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Optional Filters (Only shown if user clicks Optional Filters) */}
                        {showMasterAdvanced && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                            {/* Page From -> To */}
                            <div className="bg-black/60 p-3 rounded-xl border border-white/10 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-extrabold text-amber-400 uppercase">
                                  Page Range Mode:
                                </span>
                                <div className="flex rounded-lg overflow-hidden border border-amber-500/40">
                                  <button
                                    type="button"
                                    onClick={() => setMasterPageMode('SINGLE')}
                                    className={`px-2 py-0.5 text-[10px] font-black cursor-pointer ${
                                      masterPageMode === 'SINGLE'
                                        ? 'bg-amber-400 text-slate-950'
                                        : 'bg-black text-slate-300'
                                    }`}
                                  >
                                    Single Page
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setMasterPageMode('RANGE')}
                                    className={`px-2 py-0.5 text-[10px] font-black cursor-pointer ${
                                      masterPageMode === 'RANGE'
                                        ? 'bg-amber-400 text-slate-950'
                                        : 'bg-black text-slate-300'
                                    }`}
                                  >
                                    Page To Page
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <span className="text-[10px] text-slate-400 block">From Page</span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={masterPageFrom}
                                    onChange={(e) => {
                                      setMasterPageMode('RANGE');
                                      setMasterPageFrom(Math.max(1, Number(e.target.value) || 1));
                                    }}
                                    className="w-full px-2 py-1 rounded-lg bg-black/90 border border-amber-400/40 text-amber-300 text-xs font-mono-num text-center"
                                  />
                                </div>
                                <span className="text-amber-400 font-black mt-3">→</span>
                                <div className="flex-1">
                                  <span className="text-[10px] text-slate-400 block">To Page</span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={masterPageTo}
                                    onChange={(e) => {
                                      setMasterPageMode('RANGE');
                                      setMasterPageTo(Math.max(1, Number(e.target.value) || 1));
                                    }}
                                    className="w-full px-2 py-1 rounded-lg bg-black/90 border border-amber-400/40 text-amber-300 text-xs font-mono-num text-center"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Year From -> To */}
                            <div className="bg-black/60 p-3 rounded-xl border border-white/10 space-y-2">
                              <span className="text-[11px] font-extrabold text-emerald-400 uppercase block">
                                Year Filter (Optional):
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <span className="text-[10px] text-slate-400 block">From Year</span>
                                  <input
                                    type="number"
                                    placeholder="All"
                                    value={masterYearFrom}
                                    onChange={(e) => setMasterYearFrom(e.target.value)}
                                    className="w-full px-2 py-1 rounded-lg bg-black/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono-num text-center"
                                  />
                                </div>
                                <span className="text-emerald-400 font-black mt-3">→</span>
                                <div className="flex-1">
                                  <span className="text-[10px] text-slate-400 block">To Year</span>
                                  <input
                                    type="number"
                                    placeholder="All"
                                    value={masterYearTo}
                                    onChange={(e) => setMasterYearTo(e.target.value)}
                                    className="w-full px-2 py-1 rounded-lg bg-black/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono-num text-center"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Movie Count From -> To */}
                            <div className="bg-black/60 p-3 rounded-xl border border-white/10 space-y-2">
                              <span className="text-[11px] font-extrabold text-cyan-400 uppercase block">
                                How Many Movies Per Page:
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <span className="text-[10px] text-slate-400 block">From #</span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={masterCountFrom}
                                    onChange={(e) =>
                                      setMasterCountFrom(Math.max(1, Number(e.target.value) || 1))
                                    }
                                    className="w-full px-2 py-1 rounded-lg bg-black/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono-num text-center"
                                  />
                                </div>
                                <span className="text-cyan-400 font-black mt-3">→</span>
                                <div className="flex-1">
                                  <span className="text-[10px] text-slate-400 block">To #</span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={masterCountTo}
                                    onChange={(e) =>
                                      setMasterCountTo(Math.max(1, Number(e.target.value) || 1))
                                    }
                                    className="w-full px-2 py-1 rounded-lg bg-black/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono-num text-center"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </form>

                      {masterClonedMovies.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-emerald-400 uppercase">
                              ✓ Recently Cloned Movies ({masterTotalClonedSession} New | {masterUpdatedCount} Synced):
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveTab('edit_catalog')}
                              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold cursor-pointer"
                            >
                              Manage / Pin / Edit in Catalog →
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                            {masterClonedMovies.slice(0, 12).map((mc) => (
                              <div
                                key={mc.id}
                                className="bg-black/70 rounded-xl p-1.5 border border-emerald-500/30 flex flex-col"
                              >
                                <img
                                  src={mc.posterUrl}
                                  alt={mc.title}
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    const img = e.currentTarget;
                                    if (!img.dataset.fallback) {
                                      img.dataset.fallback = '1';
                                      img.src =
                                        'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=700&q=80';
                                    }
                                  }}
                                  className="w-full aspect-[3/4] object-cover rounded-lg mb-1.5 bg-zinc-900"
                                />
                                <span className="text-[10px] font-bold text-white line-clamp-1">
                                  {mc.title}
                                </span>
                                <span className="text-[9px] text-emerald-400 font-mono-num">
                                  {mc.quality} · {mc.year}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {clonedPreview && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-5 border border-emerald-500/40 space-y-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div>
                            <span className="text-xs font-extrabold uppercase text-emerald-400 block">
                              ✓ Full Website Movie + Download Links + Screenshots Cloned!
                            </span>
                            <span className="text-[11px] text-slate-400">
                              You can publish immediately in 1 click, or edit any download link / poster / screenshot below first.
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setUpTitle(clonedPreview.title || '');
                                setUpYear(clonedPreview.year || '2026');
                                setUpCast(clonedPreview.cast || '');
                                setUpLanguage(clonedPreview.language || 'BANGLA');
                                setUpQuality(clonedPreview.quality || '1080P WEB-DL');
                                setUpType(clonedPreview.type || 'MOVIE');
                                setUpEpisodeBadge(clonedPreview.episodeBadge || '');
                                setUpSelectedGenres(clonedPreview.genre || ['Action']);
                                setUpCategories(clonedPreview.categories || ['BANGLA', 'MOVIES']);
                                setUpStoryline(clonedPreview.storyline || '');
                                setUpPoster(clonedPreview.posterUrl || '');
                                setUpScreenshots(clonedPreview.screenshots || []);
                                setUpLink480(clonedPreview.links?.p480 || '');
                                setUpLink720(clonedPreview.links?.p720 || '');
                                setUpLink1080(clonedPreview.links?.p1080 || '');
                                setUpLink4k(clonedPreview.links?.p4k || '');
                                setActiveTab('upload');
                                showToast('Loaded cloned movie into Full Upload Editor!');
                              }}
                              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                            >
                              Open in Full Editor
                            </button>
                            <button
                              type="button"
                              onClick={handlePublishClonedMovieNow}
                              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase cursor-pointer shadow-lg shadow-emerald-500/20"
                            >
                              + Publish Cloned Movie Now (1-Click)
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <img
                              src={clonedPreview.posterUrl}
                              alt={clonedPreview.title}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const img = e.currentTarget;
                                if (!img.dataset.fallback) {
                                  img.dataset.fallback = '1';
                                  img.src =
                                    'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=700&q=80';
                                }
                              }}
                              className="w-full aspect-[3/4] object-cover rounded-xl border border-white/15 bg-black"
                            />
                            <input
                              type="text"
                              value={clonedPreview.posterUrl || ''}
                              onChange={(e) =>
                                setClonedPreview((prev) =>
                                  prev ? { ...prev, posterUrl: e.target.value } : prev
                                )
                              }
                              placeholder="Cloned Poster URL"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/15 text-white text-[11px]"
                            />
                            <label className="w-full py-1.5 px-2.5 rounded-lg red-glass-btn text-white text-[10px] font-extrabold uppercase flex items-center justify-center gap-1 cursor-pointer">
                              <ImageIcon className="w-3 h-3" />
                              <span>Upload Custom Poster</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    const res = reader.result as string;
                                    setClonedPreview((prev) =>
                                      prev ? { ...prev, posterUrl: res } : prev
                                    );
                                  };
                                  reader.readAsDataURL(file);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div className="sm:col-span-3 space-y-3 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                  Cloned Movie Name (Editable)
                                </label>
                                <input
                                  type="text"
                                  value={clonedPreview.title || ''}
                                  onChange={(e) =>
                                    setClonedPreview((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            title: e.target.value,
                                            fullDisplayTitle: `${e.target.value} (${prev.year}) ${prev.quality} [${prev.language}]`
                                          }
                                        : prev
                                    )
                                  }
                                  className="w-full px-3 py-1.5 rounded-lg bg-black/70 border border-white/15 text-white text-xs font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                  Cloned Star Cast (Editable)
                                </label>
                                <input
                                  type="text"
                                  value={clonedPreview.cast || ''}
                                  onChange={(e) =>
                                    setClonedPreview((prev) =>
                                      prev ? { ...prev, cast: e.target.value } : prev
                                    )
                                  }
                                  className="w-full px-3 py-1.5 rounded-lg bg-black/70 border border-white/15 text-white text-xs"
                                />
                              </div>
                            </div>

                            <p className="text-slate-300">
                              <strong>Language:</strong> {clonedPreview.language} ·{' '}
                              <strong>Quality:</strong> {clonedPreview.quality} ·{' '}
                              <strong>Year:</strong> {clonedPreview.year}
                            </p>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                Cloned Storyline (Editable)
                              </label>
                              <textarea
                                rows={2}
                                value={clonedPreview.storyline || ''}
                                onChange={(e) =>
                                  setClonedPreview((prev) =>
                                    prev ? { ...prev, storyline: e.target.value } : prev
                                  )
                                }
                                className="w-full px-3 py-1.5 rounded-lg bg-black/70 border border-white/15 text-slate-200 text-xs"
                              />
                            </div>

                            {/* CLONED DOWNLOAD LINKS (480p / 720p / 1080p / 4K) — AUTO-DETECTED AVAILABILITY */}
                            <div className="bg-black/60 p-3 rounded-xl border border-red-500/30 space-y-2">
                              <label className="text-[11px] font-extrabold text-amber-400 uppercase block">
                                ⚡ Cloned Download Links (Only Available Resolutions Are Added — Missing Resolutions Stay Empty &amp; Hidden):
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {([
                                  { key: 'p480', label: '480p Download Link' },
                                  { key: 'p720', label: '720p HD Download Link' },
                                  { key: 'p1080', label: '1080p Full HD Download Link' },
                                  { key: 'p4k', label: '4K UHD Download Link' }
                                ] as const).map((resSlot) => {
                                  const val = (clonedPreview.links?.[resSlot.key] || '').trim();
                                  const isAvailable = Boolean(val);
                                  return (
                                    <div key={resSlot.key}>
                                      <div className="flex items-center justify-between mb-0.5">
                                        <span className="text-[10px] text-slate-300 font-bold">
                                          {resSlot.label}:
                                        </span>
                                        <span
                                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                                            isAvailable
                                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                              : 'bg-zinc-800 text-slate-400 border border-white/10'
                                          }`}
                                        >
                                          {isAvailable ? '✓ Available (Will Add)' : '✕ Missing (Skipped)'}
                                        </span>
                                      </div>
                                      <input
                                        type="text"
                                        value={clonedPreview.links?.[resSlot.key] || ''}
                                        placeholder={`Not found on cloned site (${resSlot.label.split(' ')[0]} button will be hidden)`}
                                        onChange={(e) =>
                                          setClonedPreview((prev) =>
                                            prev
                                              ? {
                                                  ...prev,
                                                  links: {
                                                    ...(prev.links || {
                                                      p480: '',
                                                      p720: '',
                                                      p1080: '',
                                                      p4k: ''
                                                    }),
                                                    [resSlot.key]: e.target.value
                                                  }
                                                }
                                              : prev
                                          )
                                        }
                                        className={`w-full px-2.5 py-1.5 rounded bg-black/80 border text-[11px] font-mono-num ${
                                          isAvailable
                                            ? 'border-emerald-500/45 text-emerald-300'
                                            : 'border-white/10 text-slate-400'
                                        }`}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* CLONED SCREENSHOTS PREVIEW & EDITOR */}
                            <div className="bg-black/60 p-3 rounded-xl border border-white/10 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-cyan-400 uppercase">
                                  Cloned Movie Screenshots ({(clonedPreview.screenshots || []).length}) — Editable:
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setClonedPreview((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            screenshots: [
                                              ...(prev.screenshots || []),
                                              prev.posterUrl || ''
                                            ]
                                          }
                                        : prev
                                    )
                                  }
                                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold cursor-pointer"
                                >
                                  + Add Screenshot Slot
                                </button>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {(clonedPreview.screenshots || []).map((shot, sIdx) => (
                                  <div key={sIdx} className="space-y-1">
                                    <div className="relative aspect-video w-full rounded overflow-hidden border border-white/15 bg-black">
                                      <img
                                        src={shot}
                                        alt={`Cloned shot ${sIdx + 1}`}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setClonedPreview((prev) =>
                                            prev
                                              ? {
                                                  ...prev,
                                                  screenshots: (prev.screenshots || []).filter(
                                                    (_, idx) => idx !== sIdx
                                                  )
                                                }
                                              : prev
                                          )
                                        }
                                        className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded cursor-pointer"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      value={shot}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setClonedPreview((prev) => {
                                          if (!prev) return prev;
                                          const nextShots = [...(prev.screenshots || [])];
                                          nextShots[sIdx] = val;
                                          return { ...prev, screenshots: nextShots };
                                        });
                                      }}
                                      placeholder={`Screenshot #${sIdx + 1} URL`}
                                      className="w-full px-1.5 py-1 rounded bg-black/80 border border-white/10 text-slate-200 text-[10px]"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* MODULE 4: VISITOR MOVIE REQUESTS INBOX (1-CLICK CLONE / MARK PUBLISHED / DELETE) */}
                {activeTab === 'requests' && (
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-white">
                          Visitor Movie &amp; Series Requests Inbox ({requests.length})
                        </h3>
                        <p className="text-xs text-slate-400">
                          Manage movie requests sent by visitors. Click &quot;Clone This Movie&quot; to auto-clone it, or mark as Published once uploaded.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRefreshPortalState().then(() => showToast('Refreshed Movie Requests Inbox!'))}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh Requests</span>
                      </button>
                    </div>

                    {requests.length === 0 ? (
                      <div className="glass-card rounded-2xl p-10 text-center space-y-2 border border-white/10">
                        <Inbox className="w-9 h-9 text-rose-400 mx-auto" />
                        <h4 className="text-sm font-extrabold text-white">
                          No Movie Requests Yet
                        </h4>
                        <p className="text-xs text-slate-400">
                          When visitors submit a movie request from the homepage, it will appear here in real time.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {requests.map((reqItem) => {
                          const isDone = reqItem.status === 'PUBLISHED';
                          return (
                            <div
                              key={reqItem.id}
                              className="glass-card rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-white/10"
                            >
                              <div className="space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                      isDone
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    }`}
                                  >
                                    {isDone ? '✓ PUBLISHED' : '⏳ PENDING REQUEST'}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-rose-600/25 border border-rose-500/40 text-rose-300 text-[10px] font-bold">
                                    {reqItem.language}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                                    {reqItem.quality}
                                  </span>
                                  <span className="text-[11px] text-slate-400">
                                    Requested by <strong className="text-white">{reqItem.visitorName}</strong>
                                  </span>
                                </div>
                                <h4 className="text-sm sm:text-base font-extrabold text-white">
                                  {reqItem.movieTitle}
                                </h4>
                                {reqItem.note && (
                                  <p className="text-xs text-slate-300">
                                    Note: &ldquo;{reqItem.note}&rdquo;
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCloneQuery(`${reqItem.movieTitle} ${reqItem.language} ${reqItem.quality}`);
                                    setCloneLangHint(reqItem.language || 'AUTO-DETECT');
                                    setActiveTab('cloner');
                                    showToast(`Loaded "${reqItem.movieTitle}" into AI Cloner!`);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                                >
                                  <Wand2 className="w-3.5 h-3.5" />
                                  <span>1-Click Clone</span>
                                </button>

                                {!isDone && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onMarkRequestDone(reqItem.id).then(() =>
                                        showToast(`Marked "${reqItem.movieTitle}" as Published!`)
                                      )
                                    }
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Mark Published</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    onDeleteRequest(reqItem.id).then(() =>
                                      showToast('Deleted movie request')
                                    )
                                  }
                                  className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white transition cursor-pointer"
                                  title="Delete Request"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* MODULE 5: LIVE VISITOR CHAT CONSOLE */}
                {activeTab === 'live_chat' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-white">
                          Live Visitor Support Chat ({chats.length} Messages)
                        </h3>
                        <p className="text-xs text-slate-400">
                          Select any visitor conversation on the left and reply in real time.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRefreshPortalState().then(() => showToast('Synced latest chat messages!'))}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Sync Messages</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[430px]">
                      {/* Visitor Threads List */}
                      <div className="md:col-span-4 glass-card rounded-2xl p-3 space-y-2 overflow-y-auto max-h-[450px]">
                        <div className="text-[11px] font-extrabold uppercase text-slate-400 px-2 pb-1 border-b border-white/10">
                          Active Visitor Threads ({visitorThreads.length})
                        </div>
                        {visitorThreads.length === 0 ? (
                          <p className="text-xs text-slate-400 p-3">No visitor chats yet.</p>
                        ) : (
                          visitorThreads.map((vt) => {
                            const isSelected = activeVisitorThread === vt.visitorId;
                            const threadMsgs = chats.filter((c) => c.visitorId === vt.visitorId);
                            const lastMsg = threadMsgs[threadMsgs.length - 1];
                            return (
                              <button
                                key={vt.visitorId}
                                type="button"
                                onClick={() => setActiveVisitorThread(vt.visitorId)}
                                className={`w-full text-left p-2.5 rounded-xl transition cursor-pointer flex items-center justify-between gap-2 ${
                                  isSelected
                                    ? 'red-glass-btn text-white'
                                    : 'bg-black/50 hover:bg-white/10 text-slate-200 border border-white/10'
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="text-xs font-extrabold truncate">
                                    {vt.visitorName || 'Visitor'}
                                  </div>
                                  {lastMsg && (
                                    <div className="text-[11px] text-slate-300/80 truncate mt-0.5">
                                      {lastMsg.sender === 'ADMIN' ? 'You: ' : ''}
                                      {lastMsg.text}
                                    </div>
                                  )}
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono-num font-bold shrink-0">
                                  {threadMsgs.length}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Active Chat Conversation */}
                      <div className="md:col-span-8 glass-card rounded-2xl flex flex-col overflow-hidden border border-red-500/30 h-[450px]">
                        <div className="px-4 py-3 bg-black/70 border-b border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-xs font-extrabold text-white">
                              Chatting with:{' '}
                              <span className="text-amber-300">
                                {visitorThreads.find((v) => v.visitorId === activeVisitorThread)?.visitorName ||
                                  'Movie Fan'}
                              </span>
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase">
                            Real-Time Sync Active
                          </span>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black/40">
                          {currentThreadMessages.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-12">
                              Select a visitor thread on the left to view messages and reply.
                            </p>
                          ) : (
                            currentThreadMessages.map((msg) => {
                              const isAdmin = msg.sender === 'ADMIN';
                              return (
                                <div
                                  key={msg.id}
                                  className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                                >
                                  <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                                    {isAdmin ? '👑 You (Admin)' : msg.visitorName}
                                  </span>
                                  <div
                                    className={`max-w-[82%] px-3.5 py-2 rounded-xl text-xs leading-relaxed ${
                                      isAdmin
                                        ? 'red-glass-btn text-white rounded-tr-none'
                                        : 'bg-white/10 border border-white/15 text-slate-100 rounded-tl-none'
                                    }`}
                                  >
                                    {msg.text}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!adminReplyInput.trim()) return;
                            const targetThread = visitorThreads.find(
                              (v) => v.visitorId === activeVisitorThread
                            ) || {
                              visitorId: activeVisitorThread || 'visitor-demo',
                              visitorName: 'Movie Fan'
                            };
                            onSendAdminChatReply(
                              targetThread.visitorId,
                              targetThread.visitorName,
                              adminReplyInput.trim()
                            );
                            setAdminReplyInput('');
                            showToast(`Reply sent to ${targetThread.visitorName}!`);
                          }}
                          className="p-3 bg-black/80 border-t border-white/10 flex items-center gap-2"
                        >
                          <input
                            type="text"
                            value={adminReplyInput}
                            onChange={(e) => setAdminReplyInput(e.target.value)}
                            placeholder="Type your admin reply to visitor..."
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:border-red-500 focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2.5 rounded-xl red-glass-btn text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Reply</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE 6: FULL DATABASE BACKUP & RESTORE (.JSON) */}
                {activeTab === 'backup' && (
                  <div className="space-y-5">
                    <div className="border-b border-white/10 pb-3">
                      <h3 className="text-lg font-extrabold text-white">
                        Full Website Database Backup &amp; Restore (.JSON)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Download a complete backup of all your cloned movies, settings, Adsterra codes, requests, and chats, or restore from a saved .JSON file anytime.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="glass-card rounded-2xl p-5 space-y-3 border border-emerald-500/30">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                          <Download className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-extrabold text-white">
                          Export Full Database (.JSON)
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Saves all {movies.length} movies, categories, download links, posters, and Adsterra settings to your device.
                        </p>
                        <button
                          type="button"
                          onClick={handleExportDatabaseJson}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer"
                        >
                          Download Database Backup (.JSON)
                        </button>
                      </div>

                      <div className="glass-card rounded-2xl p-5 space-y-3 border border-amber-500/30">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                          <Upload className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-extrabold text-white">
                          Restore Database from .JSON File
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Upload a previously exported MoviesHub .JSON backup file to immediately restore your entire catalog.
                        </p>
                        <label className="w-full py-2.5 rounded-xl red-glass-btn text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>Select .JSON Backup File</span>
                          <input
                            type="file"
                            accept=".json,application/json"
                            onChange={handleImportDatabaseJson}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE 7: SILENT ADSTERRA LIVE CODE INJECTOR */}
                {activeTab === 'adsterra' && (
                  <form onSubmit={handleSaveAdsterra} className="space-y-5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-white">
                          Adsterra Live Script &amp; Impression Manager
                        </h3>
                        <p className="text-xs text-slate-400">
                          Paste your Adsterra codes below and click Save. Visitors never see any admin text — only your real Adsterra banners, popunders, and Smartlinks execute so every impression counts on your Adsterra dashboard.
                        </p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer glass-card px-3.5 py-2 rounded-xl">
                        <input
                          type="checkbox"
                          checked={adEnabled}
                          onChange={(e) => setAdEnabled(e.target.checked)}
                          className="w-4 h-4 accent-emerald-500"
                        />
                        <span className="text-xs font-extrabold text-emerald-400">
                          Ads Enabled
                        </span>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                          1. Adsterra Direct Smartlink URL (Fires automatically on 480p / 720p / 1080p / 4K Clicks)
                        </label>
                        <input
                          type="text"
                          value={smartlink}
                          onChange={(e) => setSmartlink(e.target.value)}
                          placeholder="https://www.highcpmgate.com/your-smartlink-id"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-white/15 text-white text-xs font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          2. Top Header Banner Script Code (728x90 or 320x50 `&lt;script&gt;`)
                        </label>
                        <textarea
                          rows={3}
                          value={headerAd}
                          onChange={(e) => setHeaderAd(e.target.value)}
                          placeholder="Paste Adsterra <script type='text/javascript'> atOptions = ... </script> code here"
                          className="w-full px-3.5 py-2 rounded-xl bg-black/70 border border-white/15 text-emerald-300 text-xs font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          3. Native Banner Widget Script Code
                        </label>
                        <textarea
                          rows={3}
                          value={nativeAd}
                          onChange={(e) => setNativeAd(e.target.value)}
                          placeholder="Paste Adsterra Native Banner <script async='async' data-cfasync='false' src='...'></script> code here"
                          className="w-full px-3.5 py-2 rounded-xl bg-black/70 border border-white/15 text-emerald-300 text-xs font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          4. Download Modal Box Banner Code (300x250 `&lt;script&gt;`)
                        </label>
                        <textarea
                          rows={3}
                          value={dlAd}
                          onChange={(e) => setDlAd(e.target.value)}
                          placeholder="Paste Adsterra 300x250 <script> code here"
                          className="w-full px-3.5 py-2 rounded-xl bg-black/70 border border-white/15 text-emerald-300 text-xs font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          5. Global Popunder / Social Bar Script Code
                        </label>
                        <textarea
                          rows={2}
                          value={popunderAd}
                          onChange={(e) => setPopunderAd(e.target.value)}
                          placeholder="Paste Adsterra Popunder or Social Bar <script> code here"
                          className="w-full px-3.5 py-2 rounded-xl bg-black/70 border border-white/15 text-emerald-300 text-xs font-mono-num"
                        />
                      </div>
                    </div>

                    {headerAd.trim() && (
                      <div className="glass-card rounded-xl p-4 space-y-2">
                        <div className="text-xs font-bold text-slate-400 uppercase">
                          Live Script Output Preview:
                        </div>
                        <AdsterraSlot enabled={adEnabled} htmlCode={headerAd} />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl red-glass-btn text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
                    >
                      Save &amp; Run Adsterra Code Live
                    </button>
                  </form>
                )}

                {/* MODULE 7: 100% ACCURATE ADMIN ANALYTICS (Fake/Boosted Views Shown Only to Visitors!) */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase mb-1">
                          <span>✓ 100% Real Accurate Admin Telemetry (Zero Fake Inflation)</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-white">
                          Accurate Real Views, Real Download Clicks &amp; Real Visitor Analytics
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Your Admin Panel now shows <strong>100% real, uninflated numbers</strong> from actual visitors opening movies and clicking download links. Public visitors on the homepage still see impressive boosted view counters ({publicImpressedViews.toLocaleString()} public views) to build trust!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const resp = await fetch('/api/admin/reset-real-analytics', {
                            method: 'POST'
                          });
                          if (resp.ok) {
                            await onRefreshPortalState();
                            showToast('Reset all Real Admin Views & Clicks to 0 (Public Visitor impressive counters kept intact)!');
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Real Counters to 0</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      <div className="glass-card rounded-xl p-4 border border-emerald-500/35">
                        <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                          <span>Real Visitors Today</span>
                          <Users className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-xl sm:text-2xl font-extrabold text-white font-mono-num mt-2">
                          {(todayStats.realVisitors ?? 1).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono-num">
                          Public Display: {todayStats.visitors.toLocaleString()}
                        </div>
                      </div>

                      <div className="glass-card rounded-xl p-4 border border-emerald-500/35">
                        <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                          <span>Real Movie Views</span>
                          <Eye className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono-num mt-2">
                          {realTotalViews.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono-num">
                          Visitor Impressed Views: {publicImpressedViews.toLocaleString()}
                        </div>
                      </div>

                      <div className="glass-card rounded-xl p-4 border border-amber-500/35">
                        <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                          <span>Real Download Clicks</span>
                          <MousePointerClick className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono-num mt-2">
                          {realTotalClicks.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono-num">
                          100% Verified Link Clicks
                        </div>
                      </div>

                      <div className="glass-card rounded-xl p-4 border border-rose-500/35">
                        <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                          <span>Real Est. Revenue</span>
                          <TrendingUp className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="text-xl sm:text-2xl font-extrabold text-white font-mono-num mt-2">
                          ${(todayStats.realRevenueUsd ?? Number((realTotalClicks * 0.005).toFixed(2))).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono-num">
                          Based on real download clicks
                        </div>
                      </div>
                    </div>

                    {/* Per-Movie Accurate Real Views & Real Clicks Breakdown */}
                    <div className="glass-card rounded-xl overflow-hidden border border-white/10">
                      <div className="px-4 py-3 bg-black/60 border-b border-white/10 flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase text-emerald-400">
                          Per-Movie Accurate Real Performance vs. Public Visitor Display
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono-num">
                          {movies.length} Movies Tracked
                        </span>
                      </div>
                      <div className="overflow-x-auto max-h-72">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-white/10 text-slate-400 bg-black/40">
                              <th className="py-2.5 px-4">Movie Title</th>
                              <th className="py-2.5 px-4 text-right text-emerald-400">Real Views (Admin)</th>
                              <th className="py-2.5 px-4 text-right text-amber-300">Real Clicks (Admin)</th>
                              <th className="py-2.5 px-4 text-right text-slate-400">Visitor Display Views (Public)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-mono-num">
                            {movies.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="py-6 text-center text-slate-400">
                                  No movies in catalog yet.
                                </td>
                              </tr>
                            ) : (
                              movies.slice(0, 30).map((m) => (
                                <tr key={m.id} className="hover:bg-white/5">
                                  <td className="py-2 px-4 font-semibold text-white truncate max-w-xs">
                                    {m.title} <span className="text-slate-400 text-[10px]">({m.language})</span>
                                  </td>
                                  <td className="py-2 px-4 text-right text-emerald-400 font-bold">
                                    {(m.realViews || 0).toLocaleString()}
                                  </td>
                                  <td className="py-2 px-4 text-right text-amber-300 font-bold">
                                    {(m.realLinkClicks || 0).toLocaleString()}
                                  </td>
                                  <td className="py-2 px-4 text-right text-slate-400">
                                    {(m.views || 0).toLocaleString()}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Daily Telemetry History Table */}
                    <div className="glass-card rounded-xl overflow-hidden border border-white/10">
                      <div className="px-4 py-3 bg-black/60 border-b border-white/10">
                        <span className="text-xs font-extrabold uppercase text-slate-200">
                          Daily Real Accurate Log (Admin) vs. Public Impressed Counter
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-white/10 text-slate-400 bg-black/40">
                              <th className="py-2.5 px-4">Date</th>
                              <th className="py-2.5 px-4 text-right text-white">Real Visitors</th>
                              <th className="py-2.5 px-4 text-right text-emerald-400">Real Views</th>
                              <th className="py-2.5 px-4 text-right text-amber-300">Real Link Clicks</th>
                              <th className="py-2.5 px-4 text-right text-slate-400">Public Visitor Views</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-mono-num">
                            {analytics.map((row) => (
                              <tr key={row.date} className="hover:bg-white/5">
                                <td className="py-2.5 px-4 font-semibold text-slate-200">
                                  {row.date}
                                </td>
                                <td className="py-2.5 px-4 text-right text-white font-bold">
                                  {(row.realVisitors ?? 0).toLocaleString()}
                                </td>
                                <td className="py-2.5 px-4 text-right text-emerald-400 font-bold">
                                  {(row.realViews ?? 0).toLocaleString()}
                                </td>
                                <td className="py-2.5 px-4 text-right text-amber-400 font-bold">
                                  {(row.realLinkClicks ?? 0).toLocaleString()}
                                </td>
                                <td className="py-2.5 px-4 text-right text-slate-400">
                                  {row.views.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE 6: BLOGSPOT HTML/XML & FREE PUBLISHING GENERATOR */}
                {activeTab === 'blogger' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-white">
                          Free Website Publishing Hub (Netlify .ZIP, Separate HTML/CSS/JS &amp; Blogspot XML)
                        </h3>
                        <p className="text-xs text-slate-400">
                          Includes all your movies, 12 3D Logo Animations, Adsterra scripts, 16-Click Captcha Lock, Admin (`Rani2026`) &amp; SuperAdmin (`Sagor2026`) Boss Intro.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsBloggerXmlFormat(false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                            !isBloggerXmlFormat
                              ? 'red-glass-btn text-white'
                              : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          Standalone HTML5
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsBloggerXmlFormat(true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                            isBloggerXmlFormat
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          Blogspot XML Theme
                        </button>
                      </div>
                    </div>

                    {/* ALL NEEDED FILES DOWNLOAD BAR */}
                    <div className="glass-card rounded-2xl p-4 border border-cyan-500/40 bg-cyan-950/15 space-y-3">
                      <div className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                        📦 Step 1: Download Your Needed Files (Choose Any Method Below)
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href="/download/movieshub-netlify-ready.zip"
                          download="movieshub-netlify-deploy.zip"
                          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg"
                        >
                          <Download className="w-4 h-4" />
                          <span>🚀 1. Download Netlify Ready .ZIP (Recommended)</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            const blob = new Blob([generatedThemeCode], {
                              type: 'text/html;charset=utf-8'
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = isBloggerXmlFormat
                              ? 'movieshub-blogspot-theme.xml'
                              : 'index.html';
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="px-4 py-2.5 rounded-xl red-glass-btn text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>
                            2. Download All-in-One {isBloggerXmlFormat ? '.XML File' : 'index.html'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            safeCopyToClipboard(generatedThemeCode);
                            setCopiedCode(true);
                            showToast('Complete HTML/XML code copied to clipboard!');
                            setTimeout(() => setCopiedCode(false), 3000);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Copied to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy Full Code for Blogspot</span>
                            </>
                          )}
                        </button>

                        <a
                          href="/download/movieshub-full-project.zip"
                          download="movieshub-full-source-code.zip"
                          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg"
                        >
                          <Download className="w-4 h-4" />
                          <span>⬇ Download Full AI Studio Project (.ZIP)</span>
                        </a>
                      </div>
                    </div>

                    {/* Separate HTML, CSS, and JS Download Row */}
                    <div className="glass-card rounded-xl p-4 border border-amber-500/35 space-y-2.5">
                      <div className="text-xs font-extrabold text-amber-300 uppercase">
                        Separate HTML, CSS &amp; JS Files (Includes 12 3D Logo Animations, Sound FX, 16-Click Captcha &amp; Boss Intro):
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const { indexHtml } = extractSeparateHtmlCssJs(generatedThemeCode);
                            const blob = new Blob([indexHtml], { type: 'text/html;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'index.html';
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>1. Download index.html</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const { styleCss } = extractSeparateHtmlCssJs(generatedThemeCode);
                            const blob = new Blob([styleCss], { type: 'text/css;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'style.css';
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                          <span>2. Download style.css</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const { appJs } = extractSeparateHtmlCssJs(generatedThemeCode);
                            const blob = new Blob([appJs], { type: 'application/javascript;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'app.js';
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>3. Download app.js</span>
                        </button>
                      </div>
                    </div>

                    {/* STEP-BY-STEP EASY FREE PUBLISHING GUIDE */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="glass-card rounded-xl p-4 border border-cyan-500/30 space-y-2">
                        <div className="text-xs font-black text-cyan-400 uppercase">
                          Method A: Netlify Drop (30 Seconds — Easiest)
                        </div>
                        <ol className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                          <li>Click <strong>"🚀 1. Download Netlify Ready .ZIP"</strong> above.</li>
                          <li>Go to <strong>app.netlify.com/drop</strong> (sign up free with Google/Email).</li>
                          <li>Drag &amp; drop the downloaded <code>movieshub-netlify-deploy.zip</code> directly into the page.</li>
                          <li>Your website goes live immediately with a free <code>.netlify.app</code> link!</li>
                        </ol>
                      </div>

                      <div className="glass-card rounded-xl p-4 border border-amber-500/30 space-y-2">
                        <div className="text-xs font-black text-amber-400 uppercase">
                          Method B: Google Blogger / Blogspot (100% Free Forever)
                        </div>
                        <ol className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                          <li>Click <strong>"Blogspot XML Theme"</strong> button at the top right, then click <strong>"Copy Full Code"</strong>.</li>
                          <li>Go to <strong>blogger.com</strong> &rarr; create a free blog &rarr; click <strong>Theme</strong> on the left menu.</li>
                          <li>Click the arrow next to Customize &rarr; <strong>Edit HTML</strong>.</li>
                          <li>Delete everything, paste your copied code, and click <strong>Save</strong>!</li>
                        </ol>
                      </div>

                      <div className="glass-card rounded-xl p-4 border border-emerald-500/30 space-y-2">
                        <div className="text-xs font-black text-emerald-400 uppercase">
                          Method C: Tiiny.host / Cloudflare Pages (Free)
                        </div>
                        <ol className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                          <li>Download <code>movieshub-netlify-deploy.zip</code> or the 3 separate files (<code>index.html</code>, <code>style.css</code>, <code>app.js</code>).</li>
                          <li>Go to <strong>pages.cloudflare.com</strong> or <strong>tiiny.host</strong>.</li>
                          <li>Upload the <code>.zip</code> file and pick your custom subdomain name.</li>
                          <li>Click Publish — your site is live worldwide!</li>
                        </ol>
                      </div>
                    </div>

                    <textarea
                      readOnly
                      rows={12}
                      value={generatedThemeCode}
                      className="w-full p-4 rounded-xl bg-black/80 border border-white/15 text-red-300 font-mono-num text-xs leading-relaxed focus:outline-none"
                    />
                  </div>
                )}

                {/* MODULE 10: GOOGLE SEARCH INDEXING & FRIEND VIRAL PROMOTION HUB */}
                {activeTab === 'seo_promo' && (
                  <div className="space-y-6">
                    <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase mb-1">
                          <span>🚀 Live SEO Sitemap + 1-Click Friend Promotion Kit</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-white">
                          Google Search Indexing &amp; Friend Promotion Hub
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Copy your live public website URL, share directly to WhatsApp, Telegram &amp; Facebook, or submit your auto-generated <code className="text-amber-300">/sitemap.xml</code> to Google Search Console.
                        </p>
                      </div>
                    </div>

                    {/* 1. LIVE PUBLIC SHARE URL & 1-CLICK SOCIAL SHARE BUTTONS */}
                    <div className="glass-card rounded-2xl p-5 border border-emerald-500/35 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-extrabold text-emerald-400 uppercase flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <span>1. Your Public Website Link (Share with Friends &amp; Visitors)</span>
                        </h4>
                        <span className="text-[11px] font-mono-num text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                          ● Live &amp; Ready for Visitors
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        <input
                          type="text"
                          readOnly
                          value={window.location.origin}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-black/80 border border-white/15 text-amber-300 font-mono-num text-xs sm:text-sm focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            safeCopyToClipboard(window.location.origin);
                            showToast('Public Website Link copied! Send it to your friends now.');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy Website Link</span>
                        </button>
                      </div>

                      {/* Ready-Made Viral Promo Message for WhatsApp, Facebook, Messenger, Telegram */}
                      <div className="bg-black/60 rounded-xl p-4 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-amber-300 uppercase">
                            Ready-to-Send Viral Promotion Message for Friends:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const promoText = `🎬🔥 Watch & Download Latest Bangla, Hindi Dubbed, Dual Audio, South Indian & Hollywood Movies in Full HD (480p, 720p, 1080p & 4K) Free on ${settings.siteName}!\n\n👉 Visit Now: ${window.location.origin}`;
                              safeCopyToClipboard(promoText);
                              showToast('Viral Promo Message + Link copied! Paste it in WhatsApp, Messenger, Telegram, or Facebook.');
                            }}
                            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black uppercase cursor-pointer flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Promo Text + Link</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 font-mono-num bg-black/70 p-3 rounded-lg border border-white/10 whitespace-pre-line">
                          {`🎬🔥 Watch & Download Latest Bangla, Hindi Dubbed, Dual Audio, South Indian & Hollywood Movies in Full HD (480p, 720p, 1080p & 4K) Free on ${settings.siteName}!\n\n👉 Visit Now: ${window.location.origin}`}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                              `🎬🔥 Watch & Download Latest Bangla, Hindi Dubbed, Dual Audio & South Indian HD Movies (480p/720p/1080p/4K) Free on ${settings.siteName}!\n👉 ${window.location.origin}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Share on WhatsApp</span>
                          </a>

                          <a
                            href={`https://t.me/share/url?url=${encodeURIComponent(
                              window.location.origin
                            )}&text=${encodeURIComponent(
                              `🎬🔥 Download Latest Bangla, Hindi Dubbed & Dual Audio HD Movies Free on ${settings.siteName}!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Share on Telegram</span>
                          </a>

                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              window.location.origin
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Share on Facebook</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* 2. HOW TO ADD YOUR SITE TO GOOGLE SEARCH (STEP-BY-STEP + LIVE SITEMAP) */}
                    <div className="glass-card rounded-2xl p-5 border border-amber-500/35 space-y-4">
                      <h4 className="text-sm font-extrabold text-amber-400 uppercase flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>2. How to Put Your Website on Google Search (Google Search Console)</span>
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Your website already includes built-in <strong>Google Schema.org JSON-LD</strong>, <strong>OpenGraph Social Cards</strong>, <code className="text-emerald-300">/robots.txt</code>, and an auto-updating <code className="text-emerald-300">/sitemap.xml</code> containing all <strong>{movies.length} movies</strong> in your catalog.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-black/70 border border-white/10 space-y-2">
                          <div className="text-xs font-extrabold text-white">
                            Your Live Google Sitemap URL:
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={`${window.location.origin}/sitemap.xml`}
                              className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/15 text-emerald-300 font-mono-num text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                safeCopyToClipboard(`${window.location.origin}/sitemap.xml`);
                                showToast('Sitemap URL copied for Google Search Console!');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold shrink-0 cursor-pointer"
                            >
                              Copy
                            </button>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/70 border border-white/10 space-y-2">
                          <div className="text-xs font-extrabold text-white">
                            Your Live Robots.txt URL:
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={`${window.location.origin}/robots.txt`}
                              className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/15 text-cyan-300 font-mono-num text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                safeCopyToClipboard(`${window.location.origin}/robots.txt`);
                                showToast('Robots.txt URL copied!');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold shrink-0 cursor-pointer"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/60 rounded-xl p-4 border border-white/10 space-y-2 text-xs text-slate-200">
                        <div className="font-extrabold text-amber-300 uppercase mb-1">
                          3 Easy Steps to Rank on Google Search:
                        </div>
                        <div>
                          <strong>Step 1:</strong> Open{' '}
                          <a
                            href="https://search.google.com/search-console"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 underline font-bold"
                          >
                            Google Search Console
                          </a>{' '}
                          and paste your website URL (<code className="text-amber-300">{window.location.origin}</code>) under <strong>URL Prefix</strong>.
                        </div>
                        <div>
                          <strong>Step 2:</strong> Click <strong>Sitemaps</strong> in the left menu of Google Search Console, type <code className="text-emerald-300">sitemap.xml</code>, and click <strong>Submit</strong>.
                        </div>
                        <div>
                          <strong>Step 3:</strong> Or if you want a free <code className="text-amber-300">.blogspot.com</code> domain that Google indexes automatically, click tab <strong>9. Blogspot HTML/XML Code</strong> on the left and paste the XML theme into Blogger!
                        </div>
                      </div>
                    </div>

                    {/* 3. SHARE INDIVIDUAL MOVIE DIRECT LINKS WITH FRIENDS */}
                    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase">
                          3. Copy Direct Movie Links to Promote Specific Movies
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono-num">
                          Clicking a movie link opens that movie directly!
                        </span>
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-white/5 border border-white/10 rounded-xl bg-black/50">
                        {movies.slice(0, 25).map((m) => {
                          const directMovieUrl = `${window.location.origin}/?movie=${encodeURIComponent(m.id)}`;
                          return (
                            <div
                              key={m.id}
                              className="p-2.5 px-3.5 flex items-center justify-between gap-3 hover:bg-white/5"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">
                                  {m.fullDisplayTitle}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono-num truncate">
                                  {directMovieUrl}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  safeCopyToClipboard(
                                    `🎬 Watch & Download ${m.fullDisplayTitle} in HD:\n👉 ${directMovieUrl}`
                                  );
                                  showToast(`Copied promo link for "${m.title}"!`);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 border border-red-500/40 text-white text-[11px] font-extrabold shrink-0 cursor-pointer flex items-center gap-1"
                              >
                                <Share2 className="w-3 h-3" />
                                <span>Copy Movie Link</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE 11: SUPERADMIN SECURITY & DIRECT ADMIN CREDENTIAL OVERRIDE */}
                {activeTab === 'security' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* PANEL 1: SUPERADMIN DIRECT OVERRIDE FOR STANDARD ADMIN (NO OLD USER/PASS REQUIRED!) */}
                    <form
                      onSubmit={handleOverrideSubAdminCredentials}
                      autoComplete="off"
                      className="space-y-4 glass-card rounded-2xl p-5 border-2 border-emerald-500/40"
                    >
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase">
                        <span>⚡ Zero Old Password Required • SuperAdmin Override</span>
                      </div>
                      <h3 className="text-base font-extrabold text-white">
                        1. Change Standard Admin Username &amp; Password
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        As <strong className="text-amber-400">SuperAdmin</strong>, you can directly set or change the Standard Admin (Single-Movie Uploader) username and password anytime <strong>without knowing their old username or password</strong>.
                      </p>

                      <div>
                        <label className="block text-xs font-bold text-emerald-300 uppercase mb-1">
                          New Admin Username (Default: Rani2026)
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          value={overrideSubAdminUser}
                          onChange={(e) => setOverrideSubAdminUser(e.target.value)}
                          placeholder="e.g. Rani2026"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-white/15 text-white text-xs sm:text-sm font-bold focus:border-emerald-400 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-emerald-300 uppercase mb-1">
                          New Admin Password (Default: Rani2026)
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          value={overrideSubAdminPass}
                          onChange={(e) => setOverrideSubAdminPass(e.target.value)}
                          placeholder="e.g. Rani2026"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-white/15 text-amber-300 font-mono-num text-xs sm:text-sm font-bold focus:border-emerald-400 focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                      >
                        ✓ Instantly Change Admin User &amp; Pass
                      </button>
                    </form>

                    {/* PANEL 2: SUPERADMIN (SAGOR2026) PRIMARY & SECONDARY PASSWORD SETTINGS */}
                    <form
                      onSubmit={handleUpdateCredentials}
                      autoComplete="off"
                      className="space-y-4 glass-card rounded-2xl p-5 border-2 border-red-500/40"
                    >
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/25 border border-red-500/40 text-amber-300 text-[10px] font-black uppercase">
                        <span>🩸 SuperAdmin Boss Credentials (Sagor2026)</span>
                      </div>
                      <h3 className="text-base font-extrabold text-white">
                        2. SuperAdmin Username, Primary &amp; Secondary Password
                      </h3>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          Current SuperAdmin Password or Secondary Password
                        </label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter gp2026 or secondary password"
                          className="w-full px-3.5 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          SuperAdmin Username (Default: Sagor2026)
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs sm:text-sm font-bold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          New SuperAdmin Primary Password (Default: gp2026)
                        </label>
                        <input
                          type="password"
                          autoComplete="new-password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new primary password"
                          className="w-full px-3.5 py-2 rounded-lg bg-black/70 border border-white/15 text-white text-xs sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-300 uppercase mb-1">
                          SuperAdmin Secondary / Backup Password
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          value={newBackupPassword}
                          onChange={(e) => setNewBackupPassword(e.target.value)}
                          placeholder="Secondary password for SuperAdmin"
                          className="w-full px-3.5 py-2 rounded-lg bg-black/70 border border-white/15 text-cyan-300 text-xs sm:text-sm font-mono-num font-bold"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl red-glass-btn text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Save SuperAdmin Credentials
                      </button>
                    </form>
                  </div>
                )}
              </main>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
