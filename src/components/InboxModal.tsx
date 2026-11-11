import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Sparkles, Check, ArrowRight } from 'lucide-react';
import { VideoItem } from '../types';

interface InboxModalProps {
  onSelectVideo?: (video: VideoItem) => void;
  videos: VideoItem[];
}

export const InboxModal: React.FC<InboxModalProps> = ({ onSelectVideo, videos }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'likes' | 'comments' | 'followers'>('all');

  const notifications = [
    {
      id: '1',
      type: 'like',
      user: 'hassan_ali_pk',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      action: 'aapki video ko like kiya',
      time: '10 min pehle',
      videoThumb: videos[0]?.thumb,
    },
    {
      id: '2',
      type: 'comment',
      user: 'zara_lifestyle',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      action: 'ne comment kiya: "Bohot zabardast video bhai! 🔥"',
      time: '45 min pehle',
      videoThumb: videos[1]?.thumb,
    },
    {
      id: '3',
      type: 'follow',
      user: 'salman_official',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
      action: 'ne aapko follow karna shuru kiya',
      time: '2 ghante pehle',
    },
    {
      id: '4',
      type: 'like',
      user: 'ayesha_vlogs',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80',
      action: 'aur 14 aur logon ne aapki video like ki',
      time: '5 ghante pehle',
      videoThumb: videos[2]?.thumb,
    },
    {
      id: '5',
      type: 'mention',
      user: 'desi_cricket_fans',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      action: 'ne aapko comment me mention kiya',
      time: '1 din pehle',
      videoThumb: videos[0]?.thumb,
    },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'likes') return n.type === 'like';
    if (activeFilter === 'comments') return n.type === 'comment';
    if (activeFilter === 'followers') return n.type === 'follow';
    return true;
  });

  return (
    <div className="w-full h-full bg-neutral-950 text-white overflow-y-auto pb-20 select-none animate-fade-in text-left">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-neutral-950/90 backdrop-blur-md px-4 py-3 border-b border-neutral-900 flex items-center justify-between">
        <h2 className="font-extrabold text-base tracking-wide flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#00f2fe]" />
          Inbox & Notifications
        </h2>
        <span className="text-[11px] text-neutral-400">All Activity</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 py-3 border-b border-neutral-900/60 overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'All Activity' },
          { id: 'likes', label: 'Likes ❤️' },
          { id: 'comments', label: 'Comments 💬' },
          { id: 'followers', label: 'Followers 👥' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-white text-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="p-3 space-y-2">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="relative shrink-0">
                <img
                  src={notif.avatar}
                  alt={notif.user}
                  className="w-11 h-11 rounded-full object-cover border border-neutral-700"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-700">
                  {notif.type === 'like' && <Heart className="w-3 h-3 text-[#fe0979] fill-[#fe0979]" />}
                  {notif.type === 'comment' && <MessageCircle className="w-3 h-3 text-[#00f2fe]" />}
                  {notif.type === 'follow' && <UserPlus className="w-3 h-3 text-emerald-400" />}
                  {notif.type === 'mention' && <Sparkles className="w-3 h-3 text-amber-400" />}
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-white leading-tight">
                  <span className="font-bold">@{notif.user}</span> {notif.action}
                </p>
                <span className="text-[10px] text-neutral-500 mt-0.5 block">{notif.time}</span>
              </div>
            </div>

            {/* Thumbnail or Follow Back */}
            {notif.videoThumb ? (
              <div
                onClick={() => onSelectVideo && videos[0] && onSelectVideo(videos[0])}
                className="w-10 h-13 rounded-lg overflow-hidden shrink-0 border border-neutral-700 cursor-pointer"
              >
                <img src={notif.videoThumb} alt="thumb" className="w-full h-full object-cover" />
              </div>
            ) : (
              <button className="px-3 py-1 bg-[#fe0979] text-white rounded-lg text-xs font-bold shrink-0 active:scale-95">
                Follow Back
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
