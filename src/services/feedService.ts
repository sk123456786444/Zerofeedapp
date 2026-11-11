import { VideoItem, CommentItem, UserProfile } from '../types';

export const DEFAULT_FEED_URL = 'https://salmanbot248.github.io/jazz-24-7-bot-tg/feed.json';
export const RAW_FEED_URL = 'https://raw.githubusercontent.com/salmanbot248/jazz-24-7-bot-tg/main/feed.json';
export const JAZZDRIVE_BASE = 'https://cloud.jazzdrive.com.pk';

const STORAGE_KEYS = {
  feed: 'zf_feed_cache',
  seen: 'zf_seen',
  fav: 'zf_fav',
  liked: 'zf_liked',
  following: 'zf_following',
  customUrl: 'zf_custom_url',
  autoNext: 'zf_auto_next',
  sound: 'zf_sound',
  uploaded: 'zf_user_videos',
  comments: 'zf_comments_map',
  profile: 'zf_user_profile',
};

export const defaultProfile: UserProfile = {
  username: 'safdar_ali',
  displayName: 'Safdar Ali',
  bio: 'Creator & TikTok enthusiast 🇵🇰 | Building cool apps with AI | Double tap for love ❤️',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  followersCount: 14200,
  followingCount: 320,
  likesTotal: 84500,
};

// Curated high quality vertical TikTok sample videos (always guaranteed to play)
export const CURATED_VIDEOS: VideoItem[] = [
  {
    id: 'curated-1',
    url: 'https://assets.mixkit.co/videos/48821/48821-720.mp4',
    directUrl: 'https://assets.mixkit.co/videos/48821/48821-720.mp4',
    title: 'Karachi sunsets hits different! 🌅 Bohot hi pyara view #karachi #sunset #pakistan #fyp #foryou #aesthetic',
    author: 'karachi_vibes',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    platform: 'tiktok',
    added: Date.now() - 3600000,
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=720&auto=format&fit=crop&q=80',
    likesCount: 34820,
    commentsCount: 1240,
    sharesCount: 3100,
    savesCount: 5410,
    soundTitle: 'Original Audio - Sunset Melodies ♫',
    tags: ['karachi', 'sunset', 'pakistan', 'fyp', 'aesthetic'],
  },
  {
    id: 'curated-2',
    url: 'https://assets.mixkit.co/videos/44426/44426-720.mp4',
    directUrl: 'https://assets.mixkit.co/videos/44426/44426-720.mp4',
    title: 'Street food vibes in Lahore Food Street! 🍲 Lazeez karahi aur garma garam naan #lahore #foodie #desi #viral #streetfood',
    author: 'desi_food_secrets',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    platform: 'tiktok',
    added: Date.now() - 7200000,
    thumb: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=720&auto=format&fit=crop&q=80',
    likesCount: 89400,
    commentsCount: 3820,
    sharesCount: 14200,
    savesCount: 11900,
    soundTitle: 'Desi Dhol Beats - DJ Mix ♫',
    tags: ['lahore', 'foodie', 'desi', 'viral', 'streetfood'],
  },
  {
    id: 'curated-3',
    url: 'https://assets.mixkit.co/videos/52163/52163-720.mp4',
    directUrl: 'https://assets.mixkit.co/videos/52163/52163-720.mp4',
    title: 'Northern Pakistan road trip through Karakoram Highway 🏔️ Khubsoorat nazaare! #skardu #hunza #mountains #travel #fyp',
    author: 'explore_pakistan',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    platform: 'reels',
    added: Date.now() - 14400000,
    thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=720&auto=format&fit=crop&q=80',
    likesCount: 125900,
    commentsCount: 4620,
    sharesCount: 18900,
    savesCount: 23100,
    soundTitle: 'Acoustic Guitar - Mountain Echo ♫',
    tags: ['skardu', 'hunza', 'mountains', 'travel', 'fyp'],
  },
  {
    id: 'curated-4',
    url: 'https://assets.mixkit.co/videos/42211/42211-720.mp4',
    directUrl: 'https://assets.mixkit.co/videos/42211/42211-720.mp4',
    title: 'Coding at 3 AM be like... 😂 Jab bug fix na ho aur chai khatam ho jaye! #tech #developer #programmer #funny #relatable',
    author: 'dev_humor_urdu',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    platform: 'shorts',
    added: Date.now() - 28800000,
    thumb: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=720&auto=format&fit=crop&q=80',
    likesCount: 42100,
    commentsCount: 1530,
    sharesCount: 6200,
    savesCount: 4120,
    soundTitle: 'Funny Meme Sound FX - Viral ♫',
    tags: ['tech', 'developer', 'programmer', 'funny', 'relatable'],
  },
  {
    id: 'curated-5',
    url: 'https://assets.mixkit.co/videos/41804/41804-720.mp4',
    directUrl: 'https://assets.mixkit.co/videos/41804/41804-720.mp4',
    title: 'Fast bowling training session! 🏏 Speed and accuracy test. Kon kon cricket lover hai comment karein! #cricket #babar #shaheen #sports',
    author: 'cricket_fever_pk',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    platform: 'tiktok',
    added: Date.now() - 86400000,
    thumb: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=720&auto=format&fit=crop&q=80',
    likesCount: 67300,
    commentsCount: 2950,
    sharesCount: 8400,
    savesCount: 7300,
    soundTitle: 'Cricket Stadium Anthem - Energy Beat ♫',
    tags: ['cricket', 'babar', 'shaheen', 'sports'],
  }
];

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const v = localStorage.getItem(key);
      return v === null ? defaultValue : JSON.parse(v);
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage set failed', e);
    }
  },
  del(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage del failed', e);
    }
  }
};

// Normalize raw JSON items into clean VideoItem format
export function normalizeFeedItems(raw: any): VideoItem[] {
  const arr = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.items) ? raw.items : []);
  const list: VideoItem[] = [];
  const seenUrls = new Set<string>();

  const SHARE_KEYS = ['url', 'share', 'share_url', 'shareUrl', 'link', 'jazz_url', 'jazzdrive', 'jazz', 'drive'];
  const pick = (x: any, keys: string[]) => {
    for (const k of keys) {
      const v = x[k];
      if (v !== undefined && v !== null && String(v).trim()) return v;
    }
    return '';
  };

  for (let idx = 0; idx < arr.length; idx++) {
    const x = arr[idx];
    if (!x || typeof x !== 'object') continue;

    let url = '';
    for (const k of SHARE_KEYS) {
      const v = x[k];
      if (typeof v === 'string' && /jazzdrive\.com\.pk\/share\//.test(v)) {
        url = v;
        break;
      }
    }
    if (!url) url = pick(x, SHARE_KEYS);
    if (!url || seenUrls.has(url)) continue;
    seenUrls.add(url);

    const title = String(pick(x, ['title', 'caption', 'desc', 'description', 'name']) || 'Viral Short Video');
    const author = String(pick(x, ['author', 'profile', 'uploader', 'user', 'username', 'channel', 'creator', 'handle']) || 'creator').replace(/^@/, '');
    const platform = String(pick(x, ['platform', 'source', 'site']) || 'jazzdrive');
    const thumb = String(pick(x, ['thumb', 'thumbnail', 'poster', 'cover']) || '');
    const direct = String(x.direct || '');

    // Extract hashtags from title
    const tagsMatch = title.match(/#[a-zA-Z0-9_]+/g);
    const tags = tagsMatch ? tagsMatch.map(t => t.slice(1).toLowerCase()) : ['fyp', 'viral'];

    list.push({
      id: `feed-${idx}-${hashFromUrl(url) || Math.random().toString(36).slice(2, 7)}`,
      url,
      directUrl: direct || undefined,
      title,
      author: author || 'creator',
      authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(author || 'user')}`,
      platform,
      added: pick(x, ['added', 'date', 'created', 'created_at', 'timestamp', 'time']) || Date.now(),
      thumb: thumb || undefined,
      likesCount: Math.floor(Math.random() * 50000) + 1200,
      commentsCount: Math.floor(Math.random() * 2000) + 80,
      sharesCount: Math.floor(Math.random() * 1500) + 40,
      savesCount: Math.floor(Math.random() * 3000) + 100,
      soundTitle: `Original Sound - @${author || 'creator'} ♫`,
      tags,
    });
  }

  return list;
}

export function hashFromUrl(u: string): string {
  const m = String(u || '').match(/\/share\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : '';
}

// Resolve JazzDrive share URL to direct playable MP4
export async function resolveJazzDriveVideo(video: VideoItem): Promise<{ url: string; poster?: string }> {
  if (video.directUrl && video.directUrl.startsWith('http')) {
    return { url: video.directUrl, poster: video.thumb };
  }

  const hash = hashFromUrl(video.url);
  if (!hash) {
    if (video.url.startsWith('http') && (video.url.includes('.mp4') || video.url.includes('.webm') || video.url.includes('mixkit'))) {
      return { url: video.url, poster: video.thumb };
    }
    throw new Error('Link is not a valid JazzDrive share link');
  }

  // 1. Try server proxy endpoint first
  try {
    const res = await fetch('/api/jazzdrive/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareUrl: video.url })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) return { url: data.url, poster: data.poster || video.thumb };
    }
  } catch (e) {
    console.warn('Backend proxy resolution failed, trying direct:', e);
  }

  // 2. Client-side attempt if proxy unavailable
  try {
    const api = `${JAZZDRIVE_BASE}/sapi/media/set?action=get&items=true&thumbnaildimensions=true&shared=true&key=${encodeURIComponent(hash)}`;
    const r = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: {} })
    });
    if (r.ok) {
      const data = await r.json();
      const findStr = (o: any, test: (s: string) => boolean): string => {
        if (typeof o === 'string') return test(o) ? o : '';
        if (o && typeof o === 'object') {
          for (const k of Object.keys(o)) {
            const res = findStr(o[k], test);
            if (res) return res;
          }
        }
        return '';
      };
      const videoUrl = findStr(data, (s) => /^https?:\/\//.test(s) && s.includes('/sapi/download/video'))
        || findStr(data, (s) => /^https?:\/\//.test(s) && s.includes('/sapi/download/') && !/thumb/i.test(s));
      const poster = findStr(data, (s) => /^https?:\/\//.test(s) && s.includes('/sapi/download/') && /thumb/i.test(s));

      if (videoUrl) return { url: videoUrl, poster: poster || video.thumb };
    }
  } catch (err) {
    // console.warn('Direct client resolve error:', err);
  }

  // 3. Fallback to an available reliable stream if share link expired
  const fallback = CURATED_VIDEOS[Math.abs(hash.charCodeAt(0)) % CURATED_VIDEOS.length];
  return { url: fallback.directUrl!, poster: video.thumb || fallback.thumb };
}

// Fetch complete feed merging remote sources, user uploads, and curated videos
export async function fetchFullFeed(customFeedUrl?: string): Promise<{ list: VideoItem[]; isLive: boolean; error?: string }> {
  const targetUrl = customFeedUrl || storage.get(STORAGE_KEYS.customUrl, '') || DEFAULT_FEED_URL;
  let remoteItems: VideoItem[] = [];
  let isLive = false;
  let fetchError: string | undefined;

  // 1. Try server proxy /api/feed
  try {
    const res = await fetch(`/api/feed?url=${encodeURIComponent(targetUrl)}`);
    if (res.ok) {
      const data = await res.json();
      remoteItems = normalizeFeedItems(data);
      isLive = remoteItems.length > 0;
    }
  } catch (e: any) {
    fetchError = e.message;
  }

  // 2. Try direct fetch if proxy failed
  if (!remoteItems.length) {
    try {
      const res = await fetch(targetUrl + (targetUrl.includes('?') ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        remoteItems = normalizeFeedItems(data);
        isLive = remoteItems.length > 0;
      }
    } catch (e: any) {
      fetchError = e.message;
    }
  }

  // Also check raw GitHub fallback
  if (!remoteItems.length && targetUrl === DEFAULT_FEED_URL) {
    try {
      const res = await fetch(RAW_FEED_URL + '?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        remoteItems = normalizeFeedItems(data);
        isLive = remoteItems.length > 0;
      }
    } catch {}
  }

  // User uploaded videos
  const userUploads = storage.get<VideoItem[]>(STORAGE_KEYS.uploaded, []);

  // Merge: User uploads first, then remote items (if any), then curated videos
  let combined: VideoItem[] = [...userUploads, ...remoteItems];
  if (combined.length === 0) {
    combined = [...userUploads, ...CURATED_VIDEOS];
  } else if (combined.length < 3) {
    combined = [...combined, ...CURATED_VIDEOS];
  }

  // Attach liked/saved/following states
  const likedSet = new Set(storage.get<string[]>(STORAGE_KEYS.liked, []));
  const savedSet = new Set(storage.get<string[]>(STORAGE_KEYS.fav, []));
  const followingSet = new Set(storage.get<string[]>(STORAGE_KEYS.following, []));

  combined = combined.map(v => ({
    ...v,
    isLiked: likedSet.has(v.id) || likedSet.has(v.url),
    isSaved: savedSet.has(v.id) || savedSet.has(v.url),
    isFollowing: followingSet.has(v.author),
  }));

  return { list: combined, isLive, error: fetchError };
}

// Sample realistic initial comments for any video
export function getInitialComments(videoId: string): CommentItem[] {
  const savedComments = storage.get<Record<string, CommentItem[]>>(STORAGE_KEYS.comments, {});
  if (savedComments[videoId]) {
    return savedComments[videoId];
  }

  const samples: CommentItem[] = [
    {
      id: `${videoId}-c1`,
      videoId,
      author: 'ali_khan_official',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      text: 'Bohot zabardast video bro! Keep it up 🔥👏',
      timestamp: Date.now() - 3600000 * 2,
      likes: 42,
      isLiked: false,
    },
    {
      id: `${videoId}-c2`,
      videoId,
      author: 'zara_vlogs',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      text: 'Background music konsa hai? Bohat pyara beat hai! 🎵❤️',
      timestamp: Date.now() - 3600000 * 5,
      likes: 19,
      isLiked: false,
    },
    {
      id: `${videoId}-c3`,
      videoId,
      author: 'bilal_ahmed_pk',
      authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
      text: 'TikTok for you page se aya hoon! Viral kardo isko 🇵🇰💯',
      timestamp: Date.now() - 3600000 * 12,
      likes: 85,
      isLiked: true,
    },
  ];

  savedComments[videoId] = samples;
  storage.set(STORAGE_KEYS.comments, savedComments);
  return samples;
}

export function addComment(videoId: string, text: string, author = 'safdar_ali'): CommentItem {
  const savedComments = storage.get<Record<string, CommentItem[]>>(STORAGE_KEYS.comments, {});
  const list = savedComments[videoId] || getInitialComments(videoId);

  const newComment: CommentItem = {
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    videoId,
    author,
    authorAvatar: defaultProfile.avatar,
    text,
    timestamp: Date.now(),
    likes: 0,
    isLiked: false,
  };

  list.unshift(newComment);
  savedComments[videoId] = list;
  storage.set(STORAGE_KEYS.comments, savedComments);
  return newComment;
}

export function toggleCommentLike(videoId: string, commentId: string): CommentItem[] {
  const savedComments = storage.get<Record<string, CommentItem[]>>(STORAGE_KEYS.comments, {});
  const list = savedComments[videoId] || [];
  const updated = list.map(c => {
    if (c.id === commentId) {
      return {
        ...c,
        isLiked: !c.isLiked,
        likes: c.isLiked ? c.likes - 1 : c.likes + 1,
      };
    }
    return c;
  });
  savedComments[videoId] = updated;
  storage.set(STORAGE_KEYS.comments, savedComments);
  return updated;
}
