/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  fetchFullFeed, 
  storage, 
  defaultProfile, 
  CURATED_VIDEOS,
  DEFAULT_FEED_URL 
} from './services/feedService';
import { VideoItem, UserProfile } from './types';
import { TopBar } from './components/TopBar';
import { BottomNav, NavTab } from './components/BottomNav';
import { VideoSlide } from './components/VideoSlide';
import { CommentsSheet } from './components/CommentsSheet';
import { ShareSheet } from './components/ShareSheet';
import { UploadModal } from './components/UploadModal';
import { DiscoverModal } from './components/DiscoverModal';
import { ProfileView } from './components/ProfileView';
import { LiveModal } from './components/LiveModal';
import { SettingsSheet } from './components/SettingsSheet';
import { Sparkles, ChevronUp, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [feed, setFeed] = useState<VideoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeTopTab, setActiveTopTab] = useState<'following' | 'foryou'>('foryou');
  const [currentNavTab, setCurrentNavTab] = useState<NavTab>('home');
  const [profile, setProfile] = useState<UserProfile>(
    storage.get('zf_user_profile', defaultProfile)
  );

  const [isMuted, setIsMuted] = useState<boolean>(
    storage.get('zf_sound', false)
  );
  const [autoScroll, setAutoScroll] = useState<boolean>(
    storage.get('zf_auto_next', true)
  );
  const [customFeedUrl, setCustomFeedUrl] = useState<string>(
    storage.get('zf_custom_url', DEFAULT_FEED_URL)
  );

  // Modals & Sheets
  const [commentsVideo, setCommentsVideo] = useState<VideoItem | null>(null);
  const [shareVideo, setShareVideo] = useState<VideoItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isLiveOpen, setIsLiveOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);

  const feedContainerRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number>(0);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Load feed on mount
  const loadFeed = useCallback(async (feedUrl?: string) => {
    setIsLoadingFeed(true);
    try {
      const res = await fetchFullFeed(feedUrl);
      setFeed(res.list);
      if (res.isLive) {
        showToast(`ZeroFeed live: ${res.list.length} videos load ho gayi! 🚀`);
      }
    } catch (err: any) {
      console.warn('Feed load error:', err);
      setFeed(CURATED_VIDEOS);
    } finally {
      setIsLoadingFeed(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadFeed(customFeedUrl);
  }, [loadFeed, customFeedUrl]);

  // Filter feed based on Following vs For You
  const filteredFeed = feed.filter((item) => {
    if (activeTopTab === 'following') {
      return item.isFollowing;
    }
    return true;
  });

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredFeed.length && filteredFeed.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredFeed.length, currentIndex]);

  // Scroll to current video index
  const scrollToIndex = useCallback((index: number) => {
    if (index < 0 || index >= filteredFeed.length) return;
    setCurrentIndex(index);
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTo({
        top: index * feedContainerRef.current.clientHeight,
        behavior: 'smooth',
      });
    }
  }, [filteredFeed.length]);

  // Auto-scroll next video when current ends
  const handleVideoEnd = useCallback(() => {
    if (currentIndex < filteredFeed.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      // Loop back to top
      scrollToIndex(0);
    }
  }, [currentIndex, filteredFeed.length, scrollToIndex]);

  // Touch gesture for vertical swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    // Minimum swipe threshold: 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < filteredFeed.length - 1) {
        // Swiped UP -> Next video
        scrollToIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        // Swiped DOWN -> Previous video
        scrollToIndex(currentIndex - 1);
      }
    }
  };

  // Wheel gesture for desktop
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelTimeout.current) return;
    if (Math.abs(e.deltaY) > 30) {
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 350);

      if (e.deltaY > 0 && currentIndex < filteredFeed.length - 1) {
        scrollToIndex(currentIndex + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        scrollToIndex(currentIndex - 1);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        if (currentIndex < filteredFeed.length - 1) scrollToIndex(currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        if (currentIndex > 0) scrollToIndex(currentIndex - 1);
      } else if (e.key === 'm') {
        setIsMuted((prev) => !prev);
      } else if (e.key === 'l') {
        const cur = filteredFeed[currentIndex];
        if (cur) handleLikeToggle(cur);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredFeed, scrollToIndex]);

  // Toggle Like
  const handleLikeToggle = (targetVideo: VideoItem) => {
    setFeed((prev) =>
      prev.map((v) => {
        if (v.id === targetVideo.id || v.url === targetVideo.url) {
          const newLiked = !v.isLiked;
          const likedList: string[] = storage.get('zf_liked', []);
          if (newLiked) {
            likedList.push(v.id);
            showToast('Video like ho gayi ❤️');
          } else {
            const idx = likedList.indexOf(v.id);
            if (idx > -1) likedList.splice(idx, 1);
          }
          storage.set('zf_liked', likedList);

          return {
            ...v,
            isLiked: newLiked,
            likesCount: newLiked ? v.likesCount + 1 : v.likesCount - 1,
          };
        }
        return v;
      })
    );
  };

  // Toggle Save / Favorite
  const handleSaveToggle = (targetVideo: VideoItem) => {
    setFeed((prev) =>
      prev.map((v) => {
        if (v.id === targetVideo.id || v.url === targetVideo.url) {
          const newSaved = !v.isSaved;
          const favList: string[] = storage.get('zf_fav', []);
          if (newSaved) {
            favList.push(v.id);
            showToast('Favorites me add ho gayi 🔖');
          } else {
            const idx = favList.indexOf(v.id);
            if (idx > -1) favList.splice(idx, 1);
            showToast('Favorites se hata di gayi');
          }
          storage.set('zf_fav', favList);

          return {
            ...v,
            isSaved: newSaved,
            savesCount: newSaved ? v.savesCount + 1 : v.savesCount - 1,
          };
        }
        return v;
      })
    );
  };

  // Toggle Follow
  const handleFollowToggle = (author: string) => {
    const followingList: string[] = storage.get('zf_following', []);
    const isNowFollowing = !followingList.includes(author);

    if (isNowFollowing) {
      followingList.push(author);
      showToast(`@${author} ko follow kar liya! ✨`);
    } else {
      const idx = followingList.indexOf(author);
      if (idx > -1) followingList.splice(idx, 1);
      showToast(`@${author} ko unfollow kar diya`);
    }
    storage.set('zf_following', followingList);

    setFeed((prev) =>
      prev.map((v) => (v.author === author ? { ...v, isFollowing: isNowFollowing } : v))
    );
  };

  // Handle uploaded video
  const handleUploadSuccess = (newVideo: VideoItem) => {
    const savedUploads = storage.get<VideoItem[]>('zf_user_videos', []);
    savedUploads.unshift(newVideo);
    storage.set('zf_user_videos', savedUploads);

    setFeed((prev) => [newVideo, ...prev]);
    setCurrentNavTab('home');
    setCurrentIndex(0);
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Comment count update from CommentsSheet
  const handleCommentCountChange = (videoId: string, newCount: number) => {
    setFeed((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, commentsCount: newCount } : v))
    );
  };

  // Select video from Profile or Discover
  const handleSelectVideo = (video: VideoItem) => {
    const idx = filteredFeed.findIndex((v) => v.id === video.id || v.url === video.url);
    setCurrentNavTab('home');
    if (idx !== -1) {
      scrollToIndex(idx);
    } else {
      setFeed((prev) => [video, ...prev]);
      setCurrentIndex(0);
    }
  };

  // Settings callbacks
  const handleSaveFeedUrl = (url: string) => {
    setCustomFeedUrl(url);
    storage.set('zf_custom_url', url);
    loadFeed(url);
  };

  const handleResetSeen = () => {
    storage.del('zf_seen');
  };

  const handleClearCache = () => {
    storage.del('zf_feed_cache');
    loadFeed(customFeedUrl);
  };

  return (
    <div className="relative w-screen h-dvh bg-neutral-950 text-white overflow-hidden flex items-center justify-center font-sans select-none">
      {/* Desktop side decoration / shortcut helper */}
      <aside className="hidden lg:flex flex-col justify-between p-8 text-neutral-400 max-w-xs h-full z-10 text-left">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00f2fe] to-[#fe0979] flex items-center justify-center text-black font-black">
              ZF
            </div>
            <div>
              <h1 className="text-white font-extrabold text-lg leading-tight">ZeroFeed TikTok</h1>
              <p className="text-[11px] text-emerald-400 font-semibold">Roman Urdu Edition</p>
            </div>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed mb-6">
            TikTok jaisi short video app. JazzDrive bot aur trending shorts se directly stream karein.
          </p>

          <div className="space-y-3 bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl text-xs">
            <h4 className="font-bold text-white uppercase text-[10px] tracking-wider">
              Keyboard Shortcuts:
            </h4>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Agli Video</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 text-white font-mono text-[11px]">↓ / J</kbd>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Pichli Video</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 text-white font-mono text-[11px]">↑ / K</kbd>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Video Like</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 text-white font-mono text-[11px]">L / Double Tap</kbd>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Mute / Sound</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 text-white font-mono text-[11px]">M</kbd>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-neutral-500">
          Powered by SalmanBot & JazzDrive Cloud
        </div>
      </aside>

      {/* Main TikTok Phone Stage Container */}
      <main className="relative w-full h-full sm:max-w-[440px] sm:h-[95dvh] sm:rounded-3xl sm:border sm:border-neutral-800 sm:shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden bg-black flex flex-col">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-neutral-900/90 text-white border border-white/20 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2 max-w-[85%] text-center pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-[#00f2fe] shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}

        {/* Home Feed View */}
        {currentNavTab === 'home' && (
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* Top Bar */}
            <TopBar
              activeTab={activeTopTab}
              onTabChange={setActiveTopTab}
              onOpenLive={() => setIsLiveOpen(true)}
              onOpenSearch={() => setCurrentNavTab('discover')}
              onOpenSettings={() => setIsSettingsOpen(true)}
              isMuted={isMuted}
              onToggleMute={() => {
                const next = !isMuted;
                setIsMuted(next);
                storage.set('zf_sound', next);
                showToast(next ? 'Awaz band (Muted)' : 'Awaz khul gayi (Sound ON) 🔊');
              }}
            />

            {/* Video Slides Container */}
            <div
              ref={feedContainerRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              className="relative w-full h-full overflow-hidden flex flex-col"
            >
              {filteredFeed.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-neutral-400">
                  <AlertCircle className="w-12 h-12 text-[#fe0979] mb-3 opacity-80" />
                  <h3 className="font-bold text-white text-base mb-1">
                    {activeTopTab === 'following'
                      ? 'Abhi tak kisi ko follow nahi kiya'
                      : 'Feed me videos load nahi huin'}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-5 max-w-xs leading-relaxed">
                    {activeTopTab === 'following'
                      ? 'Top creators ko follow karein ya For You tab me videos dekhein!'
                      : 'Internet connection check karein ya refresh dabayein.'}
                  </p>
                  {activeTopTab === 'following' ? (
                    <button
                      onClick={() => setActiveTopTab('foryou')}
                      className="px-5 py-2.5 bg-[#fe0979] text-white font-bold text-xs rounded-full shadow-lg"
                    >
                      For You Page Dekhein
                    </button>
                  ) : (
                    <button
                      onClick={() => loadFeed(customFeedUrl)}
                      className="px-5 py-2.5 bg-neutral-800 border border-neutral-700 text-white font-bold text-xs rounded-full flex items-center gap-2 hover:bg-neutral-700"
                    >
                      <RefreshCw className="w-4 h-4" /> Dobara Koshish
                    </button>
                  )}
                </div>
              ) : (
                filteredFeed.map((video, idx) => {
                  // Only render current, previous, and next slides for optimal performance
                  const shouldRender = Math.abs(idx - currentIndex) <= 1;
                  if (!shouldRender) {
                    return (
                      <div
                        key={video.id}
                        className="w-full h-full shrink-0 bg-black flex items-center justify-center"
                      />
                    );
                  }

                  return (
                    <div key={video.id} className="w-full h-full shrink-0 relative">
                      <VideoSlide
                        video={video}
                        isActive={idx === currentIndex}
                        isMuted={isMuted}
                        autoScroll={autoScroll}
                        onToggleMute={() => {
                          const next = !isMuted;
                          setIsMuted(next);
                          storage.set('zf_sound', next);
                        }}
                        onLikeToggle={handleLikeToggle}
                        onSaveToggle={handleSaveToggle}
                        onFollowToggle={handleFollowToggle}
                        onOpenComments={setCommentsVideo}
                        onOpenShare={setShareVideo}
                        onVideoEnd={handleVideoEnd}
                        onTagClick={(tag) => {
                          setCurrentNavTab('discover');
                        }}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Floating Up / Down Navigation Buttons for Mobile/Tablet */}
            <div className="absolute right-3 top-20 z-20 hidden sm:flex flex-col gap-1.5 pointer-events-auto">
              <button
                onClick={() => currentIndex > 0 && scrollToIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="p-2 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-white disabled:opacity-20 transition-all active:scale-90"
                title="Pichli video"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => currentIndex < filteredFeed.length - 1 && scrollToIndex(currentIndex + 1)}
                disabled={currentIndex >= filteredFeed.length - 1}
                className="p-2 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-white disabled:opacity-20 transition-all active:scale-90"
                title="Agli video"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Discover View */}
        {currentNavTab === 'discover' && (
          <DiscoverModal
            videos={feed}
            onSelectVideo={handleSelectVideo}
            onFollowToggle={handleFollowToggle}
          />
        )}

        {/* Inbox View */}
        {currentNavTab === 'inbox' && (
          <div className="w-full h-full">
            {/* Inbox Component */}
            <InboxModalTab onSelectVideo={handleSelectVideo} videos={feed} />
          </div>
        )}

        {/* Profile View */}
        {currentNavTab === 'profile' && (
          <ProfileView
            profile={profile}
            videos={feed}
            onSelectVideo={handleSelectVideo}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onUpdateBio={(bio) => {
              const updated = { ...profile, bio };
              setProfile(updated);
              storage.set('zf_user_profile', updated);
              showToast('Bio update ho gaya! ✨');
            }}
          />
        )}

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentNavTab}
          onTabSelect={(tab) => {
            if (tab === 'upload') {
              setIsUploadOpen(true);
            } else {
              setCurrentNavTab(tab);
            }
          }}
          inboxBadge={3}
        />

        {/* Modals & Bottom Sheets */}
        <CommentsSheet
          isOpen={!!commentsVideo}
          video={commentsVideo}
          onClose={() => setCommentsVideo(null)}
          onCommentCountChange={handleCommentCountChange}
        />

        <ShareSheet
          isOpen={!!shareVideo}
          video={shareVideo}
          onClose={() => setShareVideo(null)}
          onToast={showToast}
        />

        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
          onToast={showToast}
        />

        <LiveModal
          isOpen={isLiveOpen}
          onClose={() => setIsLiveOpen(false)}
          onToast={showToast}
        />

        <SettingsSheet
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          feedUrl={customFeedUrl}
          onSaveFeedUrl={handleSaveFeedUrl}
          onResetSeen={handleResetSeen}
          onResetHidden={() => {}}
          onClearCache={handleClearCache}
          autoScroll={autoScroll}
          onToggleAutoScroll={() => {
            const next = !autoScroll;
            setAutoScroll(next);
            storage.set('zf_auto_next', next);
            showToast(next ? 'Auto-scroll ON (khud agli video chalegi)' : 'Auto-scroll OFF (loop chalega)');
          }}
          isMuted={isMuted}
          onToggleMute={() => {
            const next = !isMuted;
            setIsMuted(next);
            storage.set('zf_sound', next);
          }}
          seenCount={storage.get<string[]>('zf_seen', []).length}
          totalCount={feed.length}
          onToast={showToast}
        />
      </main>

      {/* Desktop right helper */}
      <aside className="hidden lg:flex flex-col justify-center p-8 max-w-xs text-neutral-400 text-left">
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#fe0979]/20 text-[#fe0979] flex items-center justify-center font-bold">
            ❤️
          </div>
          <h3 className="font-bold text-white text-sm">Double Tap to Like</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Kisi bhi video par kahin bhi double click ya double tap karein, dil (heart) aur confetti animations chalenge!
          </p>
        </div>
      </aside>
    </div>
  );
}

// Inline tab for inbox to avoid duplicate import issues
import { InboxModal } from './components/InboxModal';
function InboxModalTab(props: { onSelectVideo: (video: VideoItem) => void; videos: VideoItem[] }) {
  return <InboxModal {...props} />;
}
