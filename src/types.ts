export interface VideoItem {
  id: string;
  url: string;             // Original link (JazzDrive or web)
  directUrl?: string;       // Direct streamable mp4 URL
  title: string;           // Caption & hashtags
  author: string;          // Creator username
  authorAvatar?: string;
  platform: string;        // 'jazzdrive', 'tiktok', 'reels', 'shorts', etc.
  added?: string | number;
  thumb?: string;          // Poster image
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  soundTitle: string;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  tags?: string[];
  isUserUploaded?: boolean;
}

export interface CommentItem {
  id: string;
  videoId: string;
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: number;
  likes: number;
  isLiked: boolean;
}

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  followersCount: number;
  followingCount: number;
  likesTotal: number;
}
