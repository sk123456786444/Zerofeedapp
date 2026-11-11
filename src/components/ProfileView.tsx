import React, { useState } from 'react';
import { Settings, Edit3, Grid, Heart, Bookmark, Play, Share2 } from 'lucide-react';
import { UserProfile, VideoItem } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  onOpenSettings: () => void;
  onUpdateBio?: (newBio: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  videos,
  onSelectVideo,
  onOpenSettings,
  onUpdateBio,
}) => {
  const [activeTab, setActiveTab] = useState<'uploads' | 'liked' | 'saved'>('uploads');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(profile.bio);

  const uploadedVideos = videos.filter((v) => v.isUserUploaded || v.author === profile.username);
  const likedVideos = videos.filter((v) => v.isLiked);
  const savedVideos = videos.filter((v) => v.isSaved);

  const currentDisplayList =
    activeTab === 'uploads'
      ? uploadedVideos
      : activeTab === 'liked'
      ? likedVideos
      : savedVideos;

  const handleSaveBio = () => {
    setIsEditingBio(false);
    if (onUpdateBio) onUpdateBio(bioText);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="w-full h-full bg-neutral-950 text-white overflow-y-auto pb-20 select-none animate-fade-in text-left">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-neutral-950/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-neutral-900">
        <h2 className="font-extrabold text-base tracking-wide flex items-center gap-1.5">
          @{profile.username}
          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-black">
            ✓
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Profile Header Info */}
      <div className="px-4 pt-6 pb-4 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#00f2fe] via-[#fe0979] to-amber-400">
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-full h-full rounded-full object-cover border-2 border-neutral-950"
            />
          </div>
        </div>

        <h1 className="text-xl font-bold">{profile.displayName}</h1>
        <p className="text-xs text-neutral-400 font-medium">@{profile.username}</p>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-7 my-5">
          <div className="flex flex-col items-center">
            <span className="text-lg font-black tracking-tight">
              {formatNumber(profile.followingCount)}
            </span>
            <span className="text-[11px] text-neutral-400">Following</span>
          </div>

          <div className="h-4 w-px bg-neutral-800" />

          <div className="flex flex-col items-center">
            <span className="text-lg font-black tracking-tight">
              {formatNumber(profile.followersCount)}
            </span>
            <span className="text-[11px] text-neutral-400">Followers</span>
          </div>

          <div className="h-4 w-px bg-neutral-800" />

          <div className="flex flex-col items-center">
            <span className="text-lg font-black tracking-tight">
              {formatNumber(profile.likesTotal + likedVideos.length * 15)}
            </span>
            <span className="text-[11px] text-neutral-400">Likes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full max-w-xs mb-4">
          <button
            onClick={() => setIsEditingBio(!isEditingBio)}
            className="flex-1 py-2 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white flex items-center justify-center gap-2 border border-neutral-700 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
          <button
            onClick={onOpenSettings}
            className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white border border-neutral-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bio */}
        {isEditingBio ? (
          <div className="w-full max-w-xs space-y-2">
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-xs text-white resize-none"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditingBio(false)}
                className="px-3 py-1 text-xs text-neutral-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBio}
                className="px-3 py-1 bg-[#fe0979] text-white rounded-lg text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-neutral-300 max-w-sm px-4 leading-relaxed">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center border-t border-neutral-800">
        <button
          onClick={() => setActiveTab('uploads')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold transition-colors relative ${
            activeTab === 'uploads' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Grid className="w-4 h-4" />
          Videos ({uploadedVideos.length})
          {activeTab === 'uploads' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold transition-colors relative ${
            activeTab === 'liked' ? 'text-[#fe0979]' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Heart className="w-4 h-4" />
          Liked ({likedVideos.length})
          {activeTab === 'liked' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fe0979]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold transition-colors relative ${
            activeTab === 'saved' ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved ({savedVideos.length})
          {activeTab === 'saved' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
          )}
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {currentDisplayList.length === 0 ? (
          <div className="col-span-3 py-16 flex flex-col items-center justify-center text-neutral-500 text-xs">
            <Play className="w-8 h-8 mb-2 opacity-30" />
            Abhi yahan koi video nahi hai
          </div>
        ) : (
          currentDisplayList.map((video) => (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              className="relative aspect-[9/16] bg-neutral-900 overflow-hidden cursor-pointer group"
            >
              {video.thumb ? (
                <img
                  src={video.thumb}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-neutral-800 to-neutral-900 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white/50" />
                </div>
              )}

              {/* View count overlay */}
              <div className="absolute bottom-1.5 left-2 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow-md">
                <Play className="w-3 h-3 fill-white" />
                {formatNumber(video.likesCount * 3 + 250)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
