import React, { useState, useRef } from 'react';
import { X, UploadCloud, Video, Sparkles, Check, Camera, StopCircle } from 'lucide-react';
import { VideoItem } from '../types';
import { defaultProfile } from '../services/feedService';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (video: VideoItem) => void;
  onToast: (msg: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  onToast,
}) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [soundTitle, setSoundTitle] = useState('Original Sound - @' + defaultProfile.username + ' ♫');
  const [selectedTag, setSelectedTag] = useState<string[]>(['fyp', 'pakistan']);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!isOpen) return null;

  const popularTags = ['fyp', 'foryou', 'viral', 'pakistan', 'comedy', 'dance', 'cricket', 'tech'];

  const toggleTag = (tag: string) => {
    if (selectedTag.includes(tag)) {
      setSelectedTag(selectedTag.filter((t) => t !== tag));
    } else {
      setSelectedTag([...selectedTag, tag]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      onToast('Video select ho gayi! Preview dekhein');
    }
  };

  const startCameraRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: true,
      });
      streamRef.current = stream;

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(blob);
        setVideoSrc(videoUrl);
        // stop tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      onToast('Camera open nahi ho saka: ' + (err.message || 'Permission denied'));
    }
  };

  const stopCameraRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoSrc) {
      onToast('Pehle video select ya record karein!');
      return;
    }

    const fullTitle = `${caption || 'Nayi video'} ${selectedTag.map((t) => `#${t}`).join(' ')}`.trim();

    const newVideo: VideoItem = {
      id: `user-${Date.now()}`,
      url: videoSrc,
      directUrl: videoSrc,
      title: fullTitle,
      author: defaultProfile.username,
      authorAvatar: defaultProfile.avatar,
      platform: 'tiktok',
      added: Date.now(),
      thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&auto=format&fit=crop&q=80',
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      soundTitle: soundTitle || 'Original Sound - @' + defaultProfile.username + ' ♫',
      tags: selectedTag,
      isUserUploaded: true,
      isLiked: true,
    };

    onUploadSuccess(newVideo);
    onToast('Zabardast! Aapki video publish ho gayi 🎉');
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00f2fe] to-[#fe0979] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Post Video</h3>
              <p className="text-[11px] text-neutral-400">ZeroFeed Creator Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-left">
          {/* Video Preview or Upload Box */}
          <div className="relative w-full aspect-[9/12] max-h-72 bg-neutral-950 border-2 border-dashed border-neutral-700 rounded-2xl overflow-hidden flex flex-col items-center justify-center">
            {videoSrc ? (
              <div className="relative w-full h-full">
                <video
                  src={videoSrc}
                  controls
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
                <button
                  type="button"
                  onClick={() => setVideoSrc(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : isRecording ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoPreviewRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-red-600/90 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  REC {recordingSeconds}s
                </div>
                <button
                  type="button"
                  onClick={stopCameraRecording}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-600 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-lg"
                >
                  <StopCircle className="w-4 h-4" /> Stop Recording
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <UploadCloud className="w-12 h-12 text-[#00f2fe] mb-2" />
                <p className="text-sm font-bold text-white mb-1">
                  Video File Select Karein
                </p>
                <p className="text-xs text-neutral-400 mb-4">
                  MP4, WebM format (9:16 vertical recommended)
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-neutral-700 transition-colors"
                  >
                    <Video className="w-4 h-4 text-emerald-400" />
                    Browse Files
                  </button>

                  <button
                    type="button"
                    onClick={startCameraRecording}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-neutral-700 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-[#fe0979]" />
                    Record Cam
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Caption & Details:
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Apni video ke bare me likhein... (e.g. Aaj ka vlog bohot mazedaar tha!)"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe0979] focus:ring-1 focus:ring-[#fe0979] resize-none"
            />
          </div>

          {/* Popular Hashtags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Hashtags Add Karein:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map((tag) => {
                const active = selectedTag.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#fe0979] text-white shadow-sm'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound / Music Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Sound Audio Name:
            </label>
            <input
              type="text"
              value={soundTitle}
              onChange={(e) => setSoundTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#00f2fe]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!videoSrc}
            className="w-full py-3.5 bg-gradient-to-r from-[#00f2fe] to-[#fe0979] disabled:opacity-40 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all mt-2"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            Post Karein (Publish)
          </button>
        </form>
      </div>
    </div>
  );
};
