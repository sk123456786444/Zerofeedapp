import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  RotateCcw, 
  Eye, 
  Trash2, 
  Sliders, 
  Volume2, 
  PlayCircle, 
  Check, 
  ShieldCheck, 
  Smartphone,
  Info
} from 'lucide-react';
import { DEFAULT_FEED_URL } from '../services/feedService';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  feedUrl: string;
  onSaveFeedUrl: (url: string) => void;
  onResetSeen: () => void;
  onResetHidden: () => void;
  onClearCache: () => void;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  seenCount: number;
  totalCount: number;
  onToast: (msg: string) => void;
}

export const SettingsSheet: React.FC<SettingsSheetProps> = ({
  isOpen,
  onClose,
  feedUrl,
  onSaveFeedUrl,
  onResetSeen,
  onResetHidden,
  onClearCache,
  autoScroll,
  onToggleAutoScroll,
  isMuted,
  onToggleMute,
  seenCount,
  totalCount,
  onToast,
}) => {
  const [customUrl, setCustomUrl] = useState(feedUrl || DEFAULT_FEED_URL);
  const [showUrlEdit, setShowUrlEdit] = useState(false);

  if (!isOpen) return null;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveFeedUrl(customUrl.trim());
    setShowUrlEdit(false);
    onToast('Feed URL update ho gaya aur videos refresh ho gayi!');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-900 border-t border-neutral-800 rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl animate-slide-up text-left text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#00f2fe]" />
            <div>
              <h3 className="font-bold text-base">Settings & ZeroFeed</h3>
              <p className="text-[11px] text-neutral-400">TikTok Edition v2.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="py-4 space-y-4">
          {/* Feed URL configuration */}
          <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-neutral-200 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#fe0979]" />
                ZeroFeed Data Source:
              </span>
              <button
                onClick={() => setShowUrlEdit(!showUrlEdit)}
                className="text-xs text-[#00f2fe] font-semibold hover:underline"
              >
                {showUrlEdit ? 'Band karein' : 'Change URL'}
              </button>
            </div>
            <p className="text-[11px] text-neutral-400 break-all font-mono">
              {feedUrl || DEFAULT_FEED_URL}
            </p>

            {showUrlEdit && (
              <form onSubmit={handleSaveUrl} className="mt-3 space-y-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://.../feed.json"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f2fe]"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#fe0979] text-white rounded-lg text-xs font-bold"
                  >
                    Save & Refresh
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomUrl(DEFAULT_FEED_URL);
                      onSaveFeedUrl(DEFAULT_FEED_URL);
                      setShowUrlEdit(false);
                      onToast('Default SalmanBot feed set ho gaya!');
                    }}
                    className="px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-lg text-xs font-semibold"
                  >
                    Reset Default
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Preferences Switches */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
              Playback & Video
            </h4>

            {/* Auto Scroll */}
            <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <PlayCircle className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold">Auto-Scroll (Agli Video)</p>
                  <p className="text-[11px] text-neutral-400">
                    Video khatam hone par khud agli video chalao
                  </p>
                </div>
              </div>
              <button
                onClick={onToggleAutoScroll}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  autoScroll ? 'bg-emerald-500' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    autoScroll ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Default Sound */}
            <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-[#00f2fe]" />
                <div>
                  <p className="text-xs font-bold">Awaz (Sound Default)</p>
                  <p className="text-[11px] text-neutral-400">
                    {isMuted ? 'Muted shuru hogi' : 'Awaz ke sath shuru hogi'}
                  </p>
                </div>
              </div>
              <button
                onClick={onToggleMute}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  !isMuted ? 'bg-[#00f2fe]' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    !isMuted ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Data & History Management */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
              History & Cache
            </h4>

            {/* Reset Seen */}
            <button
              onClick={() => {
                onResetSeen();
                onToast('Dekhi hui videos ki list saaf ho gayi!');
              }}
              className="w-full flex items-center justify-between p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-blue-400" />
                <div className="text-left">
                  <p className="text-xs font-bold">Dekhi Hui Videos Reset ({seenCount})</p>
                  <p className="text-[11px] text-neutral-400">Sabhi videos dobara feed me aayengi</p>
                </div>
              </div>
              <RotateCcw className="w-4 h-4 text-neutral-400" />
            </button>

            {/* Clear Cache */}
            <button
              onClick={() => {
                onClearCache();
                onToast('Cache clear ho gaya aur feed refresh ho gayi!');
              }}
              className="w-full flex items-center justify-between p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <div className="text-left">
                  <p className="text-xs font-bold">Cache & Refresh</p>
                  <p className="text-[11px] text-neutral-400">Naye videos dobara JazzDrive se load karein</p>
                </div>
              </div>
              <RotateCcw className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          {/* Info Card */}
          <div className="p-3 bg-neutral-950/60 border border-neutral-800/60 rounded-2xl flex items-start gap-2 text-neutral-400 text-[11px] leading-relaxed">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              ZeroFeed TikTok Edition JazzDrive Cloud aur SalmanBot se connected hai. Telegram bot ko link bhejte hi yahan feed me show ho jati hai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
