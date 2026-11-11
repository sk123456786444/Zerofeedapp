import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, Smile } from 'lucide-react';
import { CommentItem, VideoItem } from '../types';
import { getInitialComments, addComment, toggleCommentLike } from '../services/feedService';

interface CommentsSheetProps {
  isOpen: boolean;
  video: VideoItem | null;
  onClose: () => void;
  onCommentCountChange?: (videoId: string, newCount: number) => void;
}

export const CommentsSheet: React.FC<CommentsSheetProps> = ({
  isOpen,
  video,
  onClose,
  onCommentCountChange,
}) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [inputText, setInputText] = useState('');
  const commentsEndRef = useRef<HTMLDivElement | null>(null);

  const quickEmojis = ['❤️', '🔥', '😂', '👏', '🇵🇰', '😍', '💯', '✨'];

  useEffect(() => {
    if (video && isOpen) {
      const list = getInitialComments(video.id);
      setComments(list);
    }
  }, [video, isOpen]);

  if (!isOpen || !video) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newComment = addComment(video.id, inputText.trim());
    const updated = [newComment, ...comments];
    setComments(updated);
    setInputText('');

    if (onCommentCountChange) {
      onCommentCountChange(video.id, updated.length);
    }
  };

  const handleLike = (commentId: string) => {
    const updated = toggleCommentLike(video.id, commentId);
    setComments(updated);
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const timeAgoUrdu = (timestamp: number): string => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'abhi abhi';
    if (diff < 3600) return `${Math.floor(diff / 60)}m pehle`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h pehle`;
    return `${Math.floor(diff / 86400)}d pehle`;
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-900 border-t border-neutral-800 rounded-t-3xl h-[68vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up"
      >
        {/* Header */}
        <div className="relative px-4 py-3.5 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="w-6" /> {/* spacer */}
          <h3 className="font-bold text-white text-sm text-center">
            {comments.length} Comments
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-xs">
              <Smile className="w-8 h-8 mb-2 opacity-50" />
              Pehla comment aap karein!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 text-left">
                <img
                  src={comment.authorAvatar}
                  alt={comment.author}
                  className="w-9 h-9 rounded-full object-cover shrink-0 bg-neutral-800 border border-neutral-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-neutral-300">
                      @{comment.author}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {timeAgoUrdu(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-100 mt-0.5 leading-snug break-words">
                    {comment.text}
                  </p>
                  <button className="text-[11px] font-medium text-neutral-400 hover:text-white mt-1 inline-block">
                    Jawab dein (Reply)
                  </button>
                </div>

                {/* Comment Like button */}
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex flex-col items-center gap-0.5 shrink-0 pt-1 text-neutral-400 hover:text-white transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 transition-transform active:scale-125 ${
                      comment.isLiked
                        ? 'text-[#fe0979] fill-[#fe0979]'
                        : 'text-neutral-500 fill-transparent'
                    }`}
                  />
                  {comment.likes > 0 && (
                    <span className="text-[10px] font-semibold text-neutral-400">
                      {comment.likes}
                    </span>
                  )}
                </button>
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Quick Emoji Bar */}
        <div className="px-4 py-1.5 flex items-center justify-between border-t border-neutral-800/60 bg-neutral-900/90 overflow-x-auto gap-2">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleAddEmoji(emoji)}
              className="text-lg hover:scale-125 transition-transform active:scale-95 px-1"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Apna comment likhein..."
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-full bg-[#fe0979] hover:bg-[#e0086a] disabled:opacity-40 text-white font-bold transition-all active:scale-95 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
