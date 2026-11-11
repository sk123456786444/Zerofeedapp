import React, { useState } from 'react';
import { X, Copy, Download, Share2, ExternalLink, QrCode, Check } from 'lucide-react';
import { VideoItem } from '../types';

interface ShareSheetProps {
  isOpen: boolean;
  video: VideoItem | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({
  isOpen,
  video,
  onClose,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen || !video) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(video.url);
      setCopied(true);
      onToast('Link copy ho gaya! 📋');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast('Link copy nahi ho saka');
    }
  };

  const handleDownload = () => {
    onToast('Video download shuru ho rahi hai... ⬇️');
    const link = document.createElement('a');
    link.href = video.directUrl || video.url;
    link.download = `ZeroFeed-${video.author}-${Date.now()}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`ZeroFeed par ye zabardast video dekhein: ${video.title} - ${video.url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    onClose();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Check out @${video.author} on ZeroFeed TikTok!`,
          url: video.url,
        });
        onClose();
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleJazzDrive = () => {
    window.open(video.url, '_blank');
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-900 border-t border-neutral-800 rounded-t-3xl p-5 shadow-2xl animate-slide-up flex flex-col gap-4 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Share karein</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action icons row 1: Social & Quick Actions */}
        <div className="grid grid-cols-4 gap-3 py-2 text-center">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-13 h-13 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg group-hover:scale-105 active:scale-95 transition-all">
              <span className="text-xl font-bold">W</span>
            </div>
            <span className="text-xs text-neutral-300 font-medium">WhatsApp</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-13 h-13 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white shadow-lg group-hover:scale-105 active:scale-95 transition-all">
              {copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
            </div>
            <span className="text-xs text-neutral-300 font-medium">
              {copied ? 'Copied' : 'Copy Link'}
            </span>
          </button>

          {/* Download Video */}
          <button
            onClick={handleDownload}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-13 h-13 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 active:scale-95 transition-all">
              <Download className="w-6 h-6" />
            </div>
            <span className="text-xs text-neutral-300 font-medium">Download</span>
          </button>

          {/* More / Native */}
          <button
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-13 h-13 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white shadow-lg group-hover:scale-105 active:scale-95 transition-all">
              <Share2 className="w-6 h-6 text-[#fe0979]" />
            </div>
            <span className="text-xs text-neutral-300 font-medium">More</span>
          </button>
        </div>

        {/* Second Row: Specific Platform Links */}
        <div className="border-t border-neutral-800/80 pt-3 flex items-center justify-around text-xs">
          <button
            onClick={handleJazzDrive}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            JazzDrive Original
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 transition-colors"
          >
            <QrCode className="w-4 h-4 text-[#00f2fe]" />
            QR Code
          </button>
        </div>

        {/* QR Code display */}
        {showQr && (
          <div className="mt-2 p-4 bg-white rounded-2xl flex flex-col items-center justify-center text-black animate-scale-fade">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(video.url)}`}
              alt="QR Code"
              className="w-36 h-36"
            />
            <p className="text-[11px] font-bold text-neutral-600 mt-2">
              Mobile camera se scan karein
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
