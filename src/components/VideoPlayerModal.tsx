import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoComment } from '../types';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, 
  Share2, ThumbsUp, MessageSquare, Send, CheckCircle, 
  Users, Sparkles, ExternalLink, Bookmark, Clock,
  Laptop, Building2, MapPin
} from 'lucide-react';

interface VideoPlayerModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onMinimizeToPiP: () => void;
  onShareToWhatsApp: (video: Video) => void;
  onLikeVideo: (videoId: string) => void;
  onSelectRelatedVideo: (video: Video) => void;
  allVideos: Video[];
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  isOpen,
  onClose,
  onMinimizeToPiP,
  onShareToWhatsApp,
  onLikeVideo,
  onSelectRelatedVideo,
  allVideos
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (video) {
      setComments(video.comments || [
        {
          id: 'c-default',
          author: 'Moussa Coulibaly (Bamako)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          text: 'Superbe vidéo, très utile pour nous qui recevons l\'aide de la diaspora !',
          timestamp: 'Il y a 3 heures',
          likes: 12
        }
      ]);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  }, [video]);

  if (!isOpen || !video) return null;

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

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: VideoComment = {
      id: `comment-${Date.now()}`,
      author: 'Vous (Utilisateur Baluwo)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      text: newCommentText.trim(),
      timestamp: 'À l\'instant',
      likes: 0
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const relatedVideos = allVideos.filter(v => v.id !== video.id).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-start overflow-y-auto">
      {/* Top Bar with Back, Title, PiP and Close */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 max-w-md truncate">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs sm:text-sm font-semibold text-white truncate">
            {video.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Picture in Picture Button (allows watching while in WhatsApp chat!) */}
          <button
            onClick={onMinimizeToPiP}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
            title="Réduire en lecteur flottant pour discuter sur WhatsApp"
          >
            <Minimize2 className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Mini-lecteur (PiP)</span>
          </button>

          {/* Direct WhatsApp Share in Header */}
          <button
            onClick={() => onShareToWhatsApp(video)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Partager WhatsApp</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player & Video Info & Comments */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player Container */}
          <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              autoPlay
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
            />

            {/* Custom On-screen Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 pointer-events-none">
              <div className="flex justify-between items-center pointer-events-auto">
                <span className="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                  Baluwo HD
                </span>
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Center Play/Pause button */}
              <div className="self-center pointer-events-auto">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-1" />
                  )}
                </button>
              </div>

              {/* Bottom Scrubber & Time */}
              <div className="space-y-1 pointer-events-auto">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                  <span>{formatSeconds(currentTime)} / {video.duration}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onMinimizeToPiP}
                      className="hover:text-white"
                      title="Mini-lecteur"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Title & Actions */}
          <div className="space-y-3">
            {video.trainingMode && (
              <div className="flex items-center gap-2 flex-wrap">
                {video.trainingMode === 'en-ligne' ? (
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                    Formation Professionnelle : En ligne (E-learning & Mobile)
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    Formation Professionnelle : En présentiel ({video.trainingLocation || 'Bamako'})
                  </span>
                )}
              </div>
            )}

            <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
              {video.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              {/* Channel Info & Subscribe */}
              <div className="flex items-center gap-3">
                <img
                  src={video.channel.avatar}
                  alt={video.channel.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{video.channel.name}</span>
                    {video.channel.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{video.channel.subscribers} abonnés</span>
                </div>
                <button
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`ml-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isSubscribed
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-white hover:bg-slate-200 text-slate-950 shadow'
                  }`}
                >
                  {isSubscribed ? 'Abonné ✓' : "S'abonner"}
                </button>
              </div>

              {/* Action Buttons: Like, WhatsApp Share, Watch Together */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onLikeVideo(video.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    video.userLiked
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${video.userLiked ? 'fill-current' : ''}`} />
                  <span>{video.likes}</span>
                </button>

                {/* Primary Share Button */}
                <button
                  onClick={() => onShareToWhatsApp(video)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partager</span>
                </button>
              </div>
            </div>

            {/* Expandable Description */}
            <div 
              onClick={() => setShowDescription(!showDescription)}
              className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl cursor-pointer text-xs text-slate-300 transition-colors border border-slate-700/60"
            >
              <div className="flex items-center gap-2 font-semibold text-slate-200 mb-1">
                <span>{video.views} vues</span>
                <span>•</span>
                <span>{video.date}</span>
                <span className="text-orange-400 font-normal ml-auto">
                  {showDescription ? 'Réduire' : 'Afficher plus'}
                </span>
              </div>
              <p className={showDescription ? '' : 'line-clamp-2'}>
                {video.description}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-400" />
                <span>Commentaires ({comments.length})</span>
              </h3>
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Ajouter un commentaire public..."
                className="flex-1 bg-slate-800 text-xs text-white placeholder-slate-400 px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-slate-950 rounded-xl transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{comment.author}</span>
                      <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{comment.text}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                      <button className="flex items-center gap-1 hover:text-slate-200">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="hover:text-slate-200">Répondre</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Related Videos */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Vidéos recommandées</span>
          </h3>

          <div className="space-y-3">
            {relatedVideos.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectRelatedVideo(item)}
                className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors group border border-transparent hover:border-slate-700"
              >
                <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-slate-950 shrink-0">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded">
                    {item.duration}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.channel.name}</p>
                  <p className="text-[10px] text-slate-400">{item.views} vues</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
