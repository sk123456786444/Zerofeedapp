import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Music, 
  Play, 
  Pause, 
  Plus, 
  Check, 
  Download,
  Flame,
  Volume2,
  VolumeX,
  FastForward,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoItem } from '../types';
import { resolveJazzDriveVideo } from '../services/feedService';

interface VideoSlideProps {
  video: VideoItem;
  isActive: boolean;
  isMuted: boolean;
  autoScroll: boolean;
  onToggleMute: () => void;
  onLikeToggle: (video: VideoItem) => void;
  onSaveToggle: (video: VideoItem) => void;
  onFollowToggle: (author: string) => void;
  onOpenComments: (video: VideoItem) => void;
  onOpenShare: (video: VideoItem) => void;
  onVideoEnd?: () => void;
  onTagClick?: (tag: string) => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  rotate: number;
}

export const VideoSlide: React.FC<VideoSlideProps> = ({
  video,
  isActive,
  isMuted,
  autoScroll,
  onToggleMute,
  onLikeToggle,
  onSaveToggle,
  onFollowToggle,
  onOpenComments,
  onOpenShare,
  onVideoEnd,
  onTagClick,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [resolvedUrl, setResolvedUrl] = useState<string | null>(video.directUrl || null);
  const [posterUrl, setPosterUrl] = useState<string | undefined>(video.thumb);
  const [isLoading, setIsLoading] = useState<boolean>(!video.directUrl);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showCenterIcon, setShowCenterIcon] = useState<boolean>(false);
  const [centerIconType, setCenterIconType] = useState<'play' | 'pause'>('play');

  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [captionExpanded, setCaptionExpanded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);

  // Click vs Double-click gesture management
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Resolve video stream
  useEffect(() => {
    let isMounted = true;

    async function loadStream() {
      if (video.directUrl) {
        setResolvedUrl(video.directUrl);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const res = await resolveJazzDriveVideo(video);
        if (isMounted) {
          setResolvedUrl(res.url);
          if (res.poster) setPosterUrl(res.poster);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Resolution issue:', err);
          // Fallback to direct url or public sample
          setResolvedUrl(video.url);
          setIsLoading(false);
        }
      }
    }

    loadStream();
    return () => {
      isMounted = false;
    };
  }, [video]);

  // Handle active slide playback
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (isActive) {
      el.muted = isMuted;
      el.playbackRate = playbackSpeed;
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Auto-play was prevented (browser policy), retry muted
            el.muted = true;
            el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          });
      }
    } else {
      el.pause();
      el.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isActive, isMuted, playbackSpeed, resolvedUrl]);

  // Video time tracking
  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    setCurrentTime(el.currentTime);
    setDuration(el.duration);
    setProgress((el.currentTime / el.duration) * 100);
  };

  const handleVideoEnded = () => {
    if (autoScroll && onVideoEnd) {
      onVideoEnd();
    } else {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  // Tap handler: single tap = play/pause, double tap = like with heart animation
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent if clicked on sidebar or buttons
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;

    const rect = containerRef.current?.getBoundingClientRect();
    const clickX = e.clientX - (rect?.left || 0);
    const clickY = e.clientY - (rect?.top || 0);

    if (clickTimeoutRef.current) {
      // Double click detected!
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;

      // Spawn heart animation at click position
      const newHeart: FloatingHeart = {
        id: Date.now() + Math.random(),
        x: clickX,
        y: clickY,
        rotate: (Math.random() - 0.5) * 45,
      };
      setFloatingHearts((prev) => [...prev, newHeart]);

      // Trigger Confetti like blast
      confetti({
        particleCount: 20,
        spread: 60,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        },
        colors: ['#ff0050', '#ff007f', '#ffffff'],
        disableForReducedMotion: true,
      });

      // Like video if not already liked
      if (!video.isLiked) {
        onLikeToggle(video);
      }

      // Remove heart from DOM after animation
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1000);
    } else {
      // Single click: toggle play / pause
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        togglePlayPause();
      }, 260);
    }
  };

  const togglePlayPause = () => {
    const el = videoRef.current;
    if (!el) return;

    if (el.paused) {
      el.play().then(() => {
        setIsPlaying(true);
        setCenterIconType('play');
        showFlashIcon();
      }).catch(() => {});
    } else {
      el.pause();
      setIsPlaying(false);
      setCenterIconType('pause');
      showFlashIcon();
    }
  };

  const showFlashIcon = () => {
    setShowCenterIcon(true);
    setTimeout(() => setShowCenterIcon(false), 550);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = videoRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    el.currentTime = pos * duration;
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative w-full h-full bg-black select-none overflow-hidden flex items-center justify-center"
    >
      {/* Background blurred poster or video */}
      {posterUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-30 pointer-events-none"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      {/* Main Video Player */}
      {resolvedUrl && (
        <video
          ref={videoRef}
          src={resolvedUrl}
          poster={posterUrl}
          playsInline
          webkit-playsinline="true"
          preload="auto"
          loop={!autoScroll}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onError={() => {
            setLoadError('Video format or network error');
          }}
          className="w-full h-full object-cover sm:object-contain relative z-10 cursor-pointer"
        />
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#00f2fe] border-r-[#fe0979] animate-spin"></div>
          <span className="text-white/80 text-xs mt-3 font-medium">Video load ho rahi hai...</span>
        </div>
      )}

      {/* Load Error Retry */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-25 bg-black/70 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
            <RotateCcw className="w-6 h-6" />
          </div>
          <p className="text-white text-sm font-semibold mb-1">Video stream load nahi ho saki</p>
          <p className="text-neutral-400 text-xs mb-4">Original JazzDrive share link ya format me issue hai.</p>
          <button
            onClick={() => {
              setLoadError(null);
              setIsLoading(true);
              resolveJazzDriveVideo(video).then(r => setResolvedUrl(r.url));
            }}
            className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-full hover:bg-neutral-200 transition-all active:scale-95"
          >
            Dobara Try Karein
          </button>
        </div>
      )}

      {/* Floating Double-Tap Hearts */}
      {floatingHearts.map((h) => (
        <div
          key={h.id}
          className="absolute z-40 pointer-events-none animate-bounce-heart"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            transform: `translate(-50%, -50%) rotate(${h.rotate}deg)`,
          }}
        >
          <Heart className="w-20 h-20 text-[#fe0979] fill-[#fe0979] drop-shadow-[0_0_20px_rgba(254,9,121,0.8)] filter" />
        </div>
      ))}

      {/* Center Play/Pause Flash Icon */}
      {showCenterIcon && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-scale-fade">
          <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white shadow-2xl border border-white/20">
            {centerIconType === 'play' ? (
              <Play className="w-10 h-10 fill-white translate-x-1" />
            ) : (
              <Pause className="w-10 h-10 fill-white" />
            )}
          </div>
        </div>
      )}

      {/* Right Action Sidebar (Icons) */}
      <div className="absolute right-2 sm:right-4 bottom-20 z-20 flex flex-col items-center gap-4.5 pointer-events-auto">
        {/* Creator Avatar with follow + button */}
        <div className="relative mb-2 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full p-0.5 border-2 border-white bg-neutral-800 overflow-hidden shadow-lg">
            <img
              src={video.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${video.author}`}
              alt={video.author}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle(video.author);
            }}
            className={`absolute -bottom-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md transition-all active:scale-75 ${
              video.isFollowing
                ? 'bg-neutral-800 text-emerald-400 border border-emerald-400'
                : 'bg-[#fe0979] hover:bg-[#e0086a]'
            }`}
            title={video.isFollowing ? 'Following' : 'Follow karein'}
          >
            {video.isFollowing ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
          </button>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(video);
          }}
          className="flex flex-col items-center group transition-transform active:scale-75"
        >
          <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
            <Heart
              className={`w-8 h-8 transition-all ${
                video.isLiked
                  ? 'text-[#fe0979] fill-[#fe0979] scale-110 drop-shadow-[0_0_8px_rgba(254,9,121,0.6)]'
                  : 'text-white fill-white/10 hover:text-rose-200'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-md">
            {formatCount(video.likesCount + (video.isLiked ? 1 : 0))}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenComments(video);
          }}
          className="flex flex-col items-center group transition-transform active:scale-75"
        >
          <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
            <MessageCircle className="w-8 h-8 text-white fill-white/10 group-hover:text-blue-200 transition-colors" />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-md">
            {formatCount(video.commentsCount)}
          </span>
        </button>

        {/* Save / Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSaveToggle(video);
          }}
          className="flex flex-col items-center group transition-transform active:scale-75"
        >
          <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
            <Bookmark
              className={`w-7.5 h-7.5 transition-all ${
                video.isSaved
                  ? 'text-amber-400 fill-amber-400 scale-110'
                  : 'text-white fill-white/10 group-hover:text-amber-200'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-md">
            {formatCount(video.savesCount + (video.isSaved ? 1 : 0))}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenShare(video);
          }}
          className="flex flex-col items-center group transition-transform active:scale-75"
        >
          <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
            <Share2 className="w-7.5 h-7.5 text-white group-hover:text-teal-200 transition-colors" />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-md">
            {formatCount(video.sharesCount)}
          </span>
        </button>

        {/* Speed button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSpeedMenu(!showSpeedMenu);
            }}
            className="w-8 h-8 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center text-[10px] font-bold hover:bg-black/60 transition-all active:scale-90"
            title="Speed Badlo"
          >
            {playbackSpeed}x
          </button>

          {showSpeedMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-10 bottom-0 bg-neutral-900 border border-neutral-700 rounded-xl p-1 shadow-2xl flex flex-col gap-1 z-50 text-xs w-20"
            >
              {[0.5, 1, 1.25, 1.5, 2].map((sp) => (
                <button
                  key={sp}
                  onClick={() => {
                    setPlaybackSpeed(sp);
                    setShowSpeedMenu(false);
                  }}
                  className={`py-1 px-2 rounded text-left font-medium ${
                    playbackSpeed === sp ? 'bg-[#fe0979] text-white font-bold' : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {sp}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spinning Vinyl Record Disc */}
        <div className="relative mt-2">
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-950 p-1 border-2 border-neutral-700 shadow-2xl flex items-center justify-center ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          >
            <div className="w-5 h-5 rounded-full overflow-hidden bg-white/20">
              <img
                src={video.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${video.author}`}
                alt="music"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Floating musical notes */}
          {isPlaying && (
            <div className="absolute -top-2 right-1 pointer-events-none">
              <span className="absolute animate-float-note-1 text-white/90 text-sm">♪</span>
              <span className="absolute animate-float-note-2 text-[#00f2fe] text-xs">♫</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Left Overlay: Creator Info, Caption, Audio Ticker */}
      <div className="absolute left-3 sm:left-5 right-18 bottom-16 z-20 flex flex-col gap-2 pointer-events-none text-left drop-shadow-lg">
        {/* Platform Badge & Author */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-md tracking-wider">
            {video.platform}
          </span>
          <span className="font-bold text-white text-base hover:underline cursor-pointer flex items-center gap-1">
            @{video.author}
            <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-black">
              ✓
            </span>
          </span>
        </div>

        {/* Caption & Hashtags */}
        <div className="text-sm text-neutral-100 font-normal leading-snug pointer-events-auto">
          <p className={captionExpanded ? '' : 'line-clamp-2'}>
            {video.title}
          </p>
          {video.title.length > 80 && (
            <button
              onClick={() => setCaptionExpanded(!captionExpanded)}
              className="text-xs font-bold text-neutral-300 hover:text-white mt-0.5 inline-block"
            >
              {captionExpanded ? 'Kam karein (less)' : '...Aur (more)'}
            </button>
          )}

          {/* Clickable Hashtags */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {video.tags.slice(0, 4).map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick && onTagClick(tag)}
                  className="text-xs font-bold text-white hover:text-[#00f2fe] transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Music Sound Ticker Tape */}
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200 mt-1 pointer-events-auto overflow-hidden max-w-xs sm:max-w-sm">
          <Music className="w-3.5 h-3.5 shrink-0 text-[#00f2fe] animate-pulse" />
          <div className="overflow-hidden whitespace-nowrap">
            <span className="inline-block animate-marquee pl-2">
              {video.soundTitle} • {video.author}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar & Scrubber */}
      <div
        onClick={handleSeek}
        className="absolute left-0 right-0 bottom-14 h-1.5 z-25 bg-white/10 hover:h-2.5 transition-all cursor-pointer group"
      >
        <div
          className="h-full bg-white group-hover:bg-[#fe0979] relative transition-all"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 shadow-md" />
        </div>
      </div>
    </div>
  );
};
