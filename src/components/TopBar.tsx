import React from 'react';
import { Tv, Search, Volume2, VolumeX, SlidersHorizontal } from 'lucide-react';

interface TopBarProps {
  activeTab: 'following' | 'foryou';
  onTabChange: (tab: 'following' | 'foryou') => void;
  onOpenLive: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  unreadCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onOpenLive,
  onOpenSearch,
  onOpenSettings,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 pt-3 pb-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
      {/* Left: LIVE button with pulse */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenLive}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white backdrop-blur-md text-xs font-semibold tracking-wide transition-all active:scale-95 group"
          title="TikTok Live dekhein"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <Tv className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-[11px] tracking-wider text-red-100">LIVE</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-full bg-black/30 hover:bg-black/60 border border-white/10 text-white/90 backdrop-blur-md transition-all active:scale-95"
          title="ZeroFeed Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Following | For You Tabs */}
      <div className="flex items-center gap-5 text-sm font-bold tracking-wide select-none drop-shadow-md">
        <button
          onClick={() => onTabChange('following')}
          className={`relative pb-1 transition-all ${
            activeTab === 'following'
              ? 'text-white font-extrabold scale-105'
              : 'text-white/60 hover:text-white/90 font-medium'
          }`}
        >
          Following
          {activeTab === 'following' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-white rounded-full transition-all" />
          )}
        </button>

        <span className="text-white/30 text-xs">|</span>

        <button
          onClick={() => onTabChange('foryou')}
          className={`relative pb-1 transition-all ${
            activeTab === 'foryou'
              ? 'text-white font-extrabold scale-105'
              : 'text-white/60 hover:text-white/90 font-medium'
          }`}
        >
          For You
          {activeTab === 'foryou' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-white rounded-full transition-all" />
          )}
        </button>
      </div>

      {/* Right: Sound toggle & Search icon */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMute}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white backdrop-blur-md transition-all active:scale-95"
          title={isMuted ? 'Awaz kholo' : 'Mute karo'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        <button
          onClick={onOpenSearch}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white backdrop-blur-md transition-all active:scale-95"
          title="Search & Trends"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
