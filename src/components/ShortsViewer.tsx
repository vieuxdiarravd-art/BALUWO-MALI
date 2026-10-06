import React, { useState, useRef } from 'react';
import { Video } from '../types';
import { 
  Play, Pause, Heart, MessageSquare, Share2, Volume2, 
  VolumeX, ChevronUp, ChevronDown, CheckCircle, Sparkles 
} from 'lucide-react';

interface ShortsViewerProps {
  shorts: Video[];
  onShareToWhatsApp: (video: Video) => void;
  onLikeShort: (videoId: string) => void;
}

export const ShortsViewer: React.FC<ShortsViewerProps> = ({
  shorts,
  onShareToWhatsApp,
  onLikeShort,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showHeartAnim, setShowHeartAnim] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentShort = shorts[currentIndex] || shorts[0];

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeShort(currentShort.id);
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-[calc(100vh-125px)] bg-black rounded-2xl overflow-hidden flex items-center justify-center select-none shadow-2xl border border-slate-800">
      {/* Background Video */}
      <video
        key={currentShort.id}
        ref={videoRef}
        src={currentShort.videoUrl}
        poster={currentShort.thumbnailUrl}
        autoPlay
        loop
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Big Heart Animation on Double tap or like */}
      {showHeartAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
          <Heart className="w-24 h-24 text-rose-500 fill-rose-500" />
        </div>
      )}

      {/* Play/Pause Center Indicator when paused */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Top Header info (Baluwo Shorts Badge & Sound) */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Baluwo Shorts Mali</span>
        </div>

        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 border border-white/10 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Vertical Navigation Chevrons */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        <button
          disabled={currentIndex === 0}
          onClick={handlePrev}
          className="p-2 rounded-full bg-black/40 text-white disabled:opacity-30 hover:bg-black/70 transition-colors backdrop-blur-xs"
          title="Short précédent"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          disabled={currentIndex === shorts.length - 1}
          onClick={handleNext}
          className="p-2 rounded-full bg-black/40 text-white disabled:opacity-30 hover:bg-black/70 transition-colors backdrop-blur-xs"
          title="Short suivant"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Right Action Column: Like, Comment, WhatsApp Share */}
      <div className="absolute right-3 bottom-16 flex flex-col items-center gap-4 z-10">
        {/* Like */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all ${
            currentShort.userLiked
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40'
              : 'bg-black/50 text-white group-hover:scale-105'
          }`}>
            <Heart className={`w-6 h-6 ${currentShort.userLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">
            {currentShort.likes}
          </span>
        </button>

        {/* Comments */}
        <button
          onClick={togglePlay}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">
            {currentShort.commentsCount}
          </span>
        </button>

        {/* 1-Click Share */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShareToWhatsApp(currentShort);
          }}
          className="flex flex-col items-center gap-1 group"
          title="Partager la vidéo"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 backdrop-blur-md border border-blue-400/40 flex items-center justify-center text-white shadow-lg shadow-blue-600/40 group-hover:scale-110 transition-transform">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-blue-300 text-xs font-bold drop-shadow">
            Partager
          </span>
        </button>
      </div>

      {/* Bottom Description & Channel details */}
      <div className="absolute bottom-4 left-4 right-16 z-10 space-y-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <img
            src={currentShort.channel.avatar}
            alt={currentShort.channel.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-white"
          />
          <div>
            <div className="flex items-center gap-1 text-white text-xs font-bold">
              <span>{currentShort.channel.name}</span>
              {currentShort.channel.verified && (
                <CheckCircle className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              )}
            </div>
            <span className="text-[10px] text-slate-300">{currentShort.channel.subscribers}</span>
          </div>
          <button className="ml-1 px-3 py-1 bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold rounded-full shadow">
            Suivre
          </button>
        </div>

        <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-snug drop-shadow-md">
          {currentShort.title}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-orange-300 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-orange-500/30">
            #BaluwoMali
          </span>
          <span className="text-[10px] text-emerald-300 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-emerald-500/30">
            #MaliVidéos
          </span>
        </div>
      </div>
    </div>
  );
};
