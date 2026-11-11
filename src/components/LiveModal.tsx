import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Gift, Send, Users, Sparkles, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

interface LiveComment {
  id: string;
  user: string;
  text: string;
  color: string;
}

interface FloatingLiveHeart {
  id: number;
  x: number;
  color: string;
}

export const LiveModal: React.FC<LiveModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  const [viewerCount, setViewerCount] = useState(3420);
  const [comments, setComments] = useState<LiveComment[]>([
    { id: '1', user: 'ali_king', text: 'Salam bhai jaan! 🔥', color: '#00f2fe' },
    { id: '2', user: 'hira_official', text: 'Where are you streaming from?', color: '#fe0979' },
    { id: '3', user: 'karachi_boy', text: 'Love from Karachi! 🇵🇰❤️', color: '#ffb703' },
    { id: '4', user: 'desi_vibes', text: 'Song sunayein koi acha sa 🎵', color: '#52b788' },
  ]);
  const [myComment, setMyComment] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<FloatingLiveHeart[]>([]);

  const sampleUsers = ['hamza_786', 'usman_vlogs', 'sara_khan', 'lahori_munda', 'zainab_art', 'bilal_cricket'];
  const sampleTexts = [
    'Bohot fit live hai! 👏',
    'Follow kar liya bhai! 💖',
    'Gift bhej raha hoon! 🎁',
    'Lahore se salam! 🦁',
    'Double tap karo sab log screen pe! 🔥',
    'Keep shining ⭐',
    'Zabardast stream hai bhai! 🇵🇰',
  ];
  const heartColors = ['#fe0979', '#00f2fe', '#ffd166', '#ef476f', '#06d6a0'];

  // Fluctuate viewer count and generate incoming chat comments
  useEffect(() => {
    if (!isOpen) return;

    const viewerInterval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 11) - 5);
    }, 3000);

    const chatInterval = setInterval(() => {
      const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      const randomColor = heartColors[Math.floor(Math.random() * heartColors.length)];

      setComments((prev) => [
        ...prev.slice(-15),
        {
          id: String(Date.now()),
          user: randomUser,
          text: randomText,
          color: randomColor,
        },
      ]);
    }, 2400);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(chatInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTapScreen = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;

    const randomColor = heartColors[Math.floor(Math.random() * heartColors.length)];
    const newHeart: FloatingLiveHeart = {
      id: Date.now() + Math.random(),
      x: 80 + Math.random() * 30, // right side percentage
      color: randomColor,
    };

    setFloatingHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myComment.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        user: 'safdar_ali (Aap)',
        text: myComment.trim(),
        color: '#00f2fe',
      },
    ]);
    setMyComment('');
  };

  const sendGift = (giftName: string, icon: string) => {
    onToast(`${giftName} ${icon} Gift bhej diya gaya! Host ko points mil gaye`);
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.7 },
    });
  };

  return (
    <div
      onClick={handleTapScreen}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden animate-fade-in select-none"
    >
      {/* Live Video Simulation Background */}
      <div className="absolute inset-0 z-0">
        <video
          src="https://assets.mixkit.co/videos/52163/52163-720.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* Floating tap hearts */}
      {floatingHearts.map((h) => (
        <div
          key={h.id}
          className="absolute bottom-24 z-30 pointer-events-none animate-float-live-heart"
          style={{ right: `${100 - h.x}%` }}
        >
          <Heart className="w-8 h-8 fill-current drop-shadow-lg" style={{ color: h.color }} />
        </div>
      ))}

      {/* Top Bar */}
      <div className="relative z-20 px-4 pt-4 flex items-center justify-between">
        {/* Host Info */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80"
            alt="host"
            className="w-8 h-8 rounded-full border border-emerald-400 object-cover"
          />
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1">
              Salman Khan Live
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </h4>
            <span className="text-[10px] text-neutral-300">@salman_live</span>
          </div>
          <button
            onClick={() => onToast('Host ko follow kar liya! ❤️')}
            className="ml-1 px-3 py-1 bg-[#fe0979] text-white text-[11px] font-bold rounded-full active:scale-95"
          >
            Follow
          </button>
        </div>

        {/* Viewers & Close */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            {viewerCount.toLocaleString()}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Area: Live Chat + Controls */}
      <div className="relative z-20 p-4 flex flex-col gap-3">
        {/* Chat Messages */}
        <div className="max-h-52 overflow-y-auto space-y-2 pointer-events-auto pr-12 scrollbar-none flex flex-col justify-end text-left">
          {comments.map((c) => (
            <div
              key={c.id}
              className="inline-flex items-start gap-1.5 px-3 py-1.5 rounded-2xl bg-black/50 backdrop-blur-md text-xs text-white max-w-sm border border-white/5 animate-fade-in"
            >
              <span className="font-bold shrink-0" style={{ color: c.color }}>
                {c.user}:
              </span>
              <span className="text-neutral-200">{c.text}</span>
            </div>
          ))}
        </div>

        {/* Quick Gifts Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-[10px] text-neutral-400 font-bold shrink-0">Send Gift:</span>
          {[
            { name: 'Gulab', icon: '🌹', cost: '1 Coin' },
            { name: 'Dil', icon: '💖', cost: '5 Coins' },
            { name: 'Fire', icon: '🔥', cost: '10 Coins' },
            { name: 'Patakha', icon: '🎆', cost: '50 Coins' },
          ].map((gift) => (
            <button
              key={gift.name}
              onClick={() => sendGift(gift.name, gift.icon)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-medium active:scale-95 transition-all"
            >
              <span>{gift.icon}</span>
              <span className="text-[11px] font-bold">{gift.name}</span>
            </button>
          ))}
        </div>

        {/* Comment input */}
        <form onSubmit={handleSendComment} className="flex items-center gap-2">
          <input
            type="text"
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            placeholder="Live chat me likhein..."
            className="flex-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-4 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#fe0979]"
          />
          <button
            type="submit"
            className="p-2.5 rounded-full bg-[#fe0979] text-white font-bold active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
