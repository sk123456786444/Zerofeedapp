import React, { useState } from 'react';
import { Search, Flame, Hash, UserCheck, Play, X, TrendingUp } from 'lucide-react';
import { VideoItem } from '../types';

interface DiscoverModalProps {
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  onFollowToggle: (author: string) => void;
  initialQuery?: string;
}

export const DiscoverModal: React.FC<DiscoverModalProps> = ({
  videos,
  onSelectVideo,
  onFollowToggle,
  initialQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const trendingTags = [
    { name: 'pakistan', count: '1.4B' },
    { name: 'viral', count: '980M' },
    { name: 'fyp', count: '2.8B' },
    { name: 'cricket', count: '450M' },
    { name: 'desi', count: '310M' },
    { name: 'comedy', count: '620M' },
    { name: 'skardu', count: '180M' },
    { name: 'tech', count: '95M' },
  ];

  const featuredCreators = [
    { username: 'karachi_vibes', name: 'Karachi Vibes', followers: '840K', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
    { username: 'desi_food_secrets', name: 'Food Street Master', followers: '1.2M', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { username: 'explore_pakistan', name: 'Explore Pakistan 🏔️', followers: '2.5M', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  ];

  const filteredVideos = videos.filter((v) => {
    const matchQuery =
      searchQuery.trim() === '' ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.soundTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.tags && v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchCategory =
      activeCategory === 'all' ||
      v.platform.toLowerCase() === activeCategory ||
      (v.tags && v.tags.includes(activeCategory));

    return matchQuery && matchCategory;
  });

  return (
    <div className="w-full h-full bg-neutral-950 text-white overflow-y-auto pb-20 select-none animate-fade-in text-left">
      {/* Search Header */}
      <div className="sticky top-0 z-20 bg-neutral-950/90 backdrop-blur-md px-4 py-3 border-b border-neutral-900">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos, creators, sounds, #hashtags..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-10 pr-9 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00f2fe]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Platform Categories */}
        <div className="flex gap-2 overflow-x-auto mt-2.5 pb-0.5 scrollbar-none">
          {['all', 'tiktok', 'jazzdrive', 'reels', 'shorts'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat === 'all' ? '✨ Sab' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Trending Hashtags */}
        <div>
          <div className="flex items-center gap-1.5 mb-3 text-sm font-bold text-white">
            <TrendingUp className="w-4 h-4 text-[#fe0979]" />
            Trending Hashtags
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => setSearchQuery(tag.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
              >
                <Hash className="w-3.5 h-3.5 text-[#00f2fe]" />
                <span className="font-bold">#{tag.name}</span>
                <span className="text-[10px] text-neutral-500">{tag.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Creators to Follow */}
        <div>
          <div className="flex items-center gap-1.5 mb-3 text-sm font-bold text-white">
            <Flame className="w-4 h-4 text-amber-400" />
            Top Creators
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {featuredCreators.map((creator) => (
              <div
                key={creator.username}
                className="w-36 bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex flex-col items-center text-center shrink-0"
              >
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-12 h-12 rounded-full object-cover mb-2 border border-neutral-700"
                />
                <h4 className="text-xs font-bold truncate w-full">{creator.name}</h4>
                <p className="text-[10px] text-neutral-400 truncate w-full">@{creator.username}</p>
                <span className="text-[10px] font-semibold text-neutral-500 mt-1">
                  {creator.followers} fans
                </span>
                <button
                  onClick={() => onFollowToggle(creator.username)}
                  className="mt-2.5 w-full py-1 rounded-lg bg-[#fe0979] hover:bg-[#e0086a] text-white text-[11px] font-bold active:scale-95 transition-all"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Video Results Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">
              {searchQuery ? `"${searchQuery}" ke results` : 'Popular Videos'}
            </h3>
            <span className="text-xs text-neutral-400">
              {filteredVideos.length} videos
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video)}
                className="relative aspect-[9/15] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer group"
              >
                {video.thumb ? (
                  <img
                    src={video.thumb}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white/40" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                  <p className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                    {video.title}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-neutral-300 mt-1">
                    <span>@{video.author}</span>
                    <span className="flex items-center gap-0.5">
                      <Play className="w-2.5 h-2.5 fill-white" />
                      {(video.likesCount / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
