import React, { useState, useRef } from 'react';
import { Video } from '../types';
import { Play, Pause, X, Maximize2, Share2, Volume2, VolumeX } from 'lucide-react';

interface FloatingMiniPlayerProps {
  video: Video | null;
  onMaximize: () => void;
  onClose: () => void;
  onShareToCurrentChat?: (video: Video) => void;
  currentChatName?: string;
}

export const FloatingMiniPlayer: React.FC<FloatingMiniPlayerProps> = ({
  video,
  onMaximize,
  onClose,
  onShareToCurrentChat,
  currentChatName
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!video) return null;

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <div className="fixed bottom-16 right-3 sm:right-6 z-40 w-72 sm:w-80 bg-slate-900 border border-orange-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Mini Video Viewport */}
      <div 
        onClick={onMaximize}
        className="relative aspect-video bg-black cursor-pointer group"
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          autoPlay
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Overlay controls on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Top Mini Controls */}
        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            className="p-1 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            title="Agrandir en grand écran"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            title="Fermer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <span className="absolute bottom-1 left-1.5 bg-orange-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.2 rounded">
          En lecture
        </span>
      </div>

      {/* Mini Title & WhatsApp Send Shortcut */}
      <div className="p-2.5 bg-slate-900 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={onMaximize}>
          <h4 className="text-xs font-semibold text-white truncate hover:text-orange-400 transition-colors">
            {video.title}
          </h4>
          <p className="text-[10px] text-slate-400 truncate">{video.channel.name}</p>
        </div>

        {onShareToCurrentChat && currentChatName && (
          <button
            onClick={() => onShareToCurrentChat(video)}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold shrink-0 flex items-center gap-1 shadow-sm transition-all active:scale-95"
            title={`Insérer la vidéo dans le chat avec ${currentChatName}`}
          >
            <Share2 className="w-3 h-3" />
            <span>Envoyer ici</span>
          </button>
        )}
      </div>
    </div>
  );
};
