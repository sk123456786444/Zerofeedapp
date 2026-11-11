import React from 'react';
import { Home, Compass, Plus, MessageCircle, User } from 'lucide-react';

export type NavTab = 'home' | 'discover' | 'upload' | 'inbox' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onTabSelect: (tab: NavTab) => void;
  inboxBadge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabSelect,
  inboxBadge = 3,
}) => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-around h-14 bg-black/95 backdrop-blur-xl border-t border-white/10 px-2 select-none">
      {/* Home */}
      <button
        onClick={() => onTabSelect('home')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 ${
          currentTab === 'home' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] font-semibold mt-0.5">Home</span>
      </button>

      {/* Discover */}
      <button
        onClick={() => onTabSelect('discover')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 ${
          currentTab === 'discover' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Compass className={`w-5 h-5 ${currentTab === 'discover' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] font-semibold mt-0.5">Discover</span>
      </button>

      {/* TikTok Center Plus Button */}
      <button
        onClick={() => onTabSelect('upload')}
        className="flex items-center justify-center flex-1 py-1 group"
        title="Nayi video banayein / upload karein"
      >
        <div className="relative w-11 h-7.5 flex items-center justify-center group-active:scale-90 transition-transform">
          {/* Cyan left offset border */}
          <div className="absolute inset-0 bg-[#00f2fe] rounded-lg -translate-x-1" />
          {/* Magenta right offset border */}
          <div className="absolute inset-0 bg-[#fe0979] rounded-lg translate-x-1" />
          {/* Center white button */}
          <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center shadow-md">
            <Plus className="w-5 h-5 text-black stroke-[3]" />
          </div>
        </div>
      </button>

      {/* Inbox */}
      <button
        onClick={() => onTabSelect('inbox')}
        className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 ${
          currentTab === 'inbox' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className="relative">
          <MessageCircle className={`w-5 h-5 ${currentTab === 'inbox' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          {inboxBadge > 0 && (
            <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-[#fe0979] text-white font-bold text-[9px] rounded-full min-w-3.5 h-3.5 flex items-center justify-center">
              {inboxBadge}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold mt-0.5">Inbox</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => onTabSelect('profile')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 ${
          currentTab === 'profile' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <User className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] font-semibold mt-0.5">Profile</span>
      </button>
    </nav>
  );
};
