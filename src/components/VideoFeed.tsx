import React, { useState } from 'react';
import { Video } from '../types';
import { 
  Play, Share2, ThumbsUp, MessageSquare, CheckCircle, Sparkles, 
  GraduationCap, Flame, Radio, Laptop, Building2, MapPin, Globe
} from 'lucide-react';

interface VideoFeedProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  onShareToWhatsApp: (video: Video) => void;
  onLikeVideo: (videoId: string) => void;
  searchQuery?: string;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  videos,
  onSelectVideo,
  onShareToWhatsApp,
  onLikeVideo,
  searchQuery = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [trainingModeFilter, setTrainingModeFilter] = useState<'all' | 'en-ligne' | 'presentiel'>('all');

  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'formations', label: '🎓 Formations Professionnelles' },
    { id: 'actualites', label: '📚 Modules Disponibles' },
    { id: 'modules-en-cours', label: '⏳ Modules en cours' },
    { id: 'humour', label: '🎭 Culture Malienne' },
    { id: 'tutoriels', label: '💡 Astuces & Cuisine' }
  ];

  const filteredVideos = videos.filter(video => {
    const isFormationCategory = video.category === 'formations' || video.category === 'baluwo' || video.category === 'actualites' || video.category === 'modules-en-cours';
    
    // Category match
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'formations' && isFormationCategory) ||
      video.category === selectedCategory;

    // Sub-filter for training mode if in formations or when filter active
    const isTrainingView = selectedCategory === 'formations' || selectedCategory === 'actualites' || selectedCategory === 'modules-en-cours';
    const matchesTrainingMode = 
      !isTrainingView ||
      trainingModeFilter === 'all' ||
      video.trainingMode === trainingModeFilter;

    const matchesSearch = !searchQuery || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesTrainingMode && matchesSearch;
  });

  return (
    <div className="w-full pb-20">
      {/* Category Filter Chips Bar */}
      <div className="sticky top-[57px] md:top-[61px] z-20 bg-slate-900/95 backdrop-blur-md px-3 py-2 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              if (cat.id !== 'formations' && cat.id !== 'actualites' && cat.id !== 'modules-en-cours') {
                setTrainingModeFilter('all');
              }
            }}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Dedicated Sub-bar for Formations / Modules: En ligne vs En présentiel */}
      {(selectedCategory === 'formations' || selectedCategory === 'actualites' || selectedCategory === 'modules-en-cours') && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 px-3 py-2 border-b border-orange-500/20 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Modalité :
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTrainingModeFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                trainingModeFilter === 'all'
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Toutes les formations
            </button>

            <button
              onClick={() => setTrainingModeFilter('en-ligne')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                trainingModeFilter === 'en-ligne'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-cyan-300 hover:bg-slate-700 border border-cyan-500/30'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>En ligne</span>
            </button>

            <button
              onClick={() => setTrainingModeFilter('presentiel')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                trainingModeFilter === 'presentiel'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-800/80 text-amber-300 hover:bg-slate-700 border border-amber-500/30'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>En présentiel</span>
            </button>
          </div>
        </div>
      )}

      {/* Featured Banner / Baluwo Highlight */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="mx-3 my-3 p-3.5 rounded-2xl bg-gradient-to-r from-orange-950/60 via-slate-900 to-blue-950/50 border border-orange-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Baluwo Formations Pro Mali</span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-semibold px-2 py-0.2 rounded-full border border-blue-500/30">
                  Direct WhatsApp
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Formations Professionnelles & Métiers au Mali
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                Découvrez les filières certifiantes : Énergie solaire, BTP, Informatique et Gestion d'entreprise.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectVideo(videos[0])}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Explorer les formations</span>
          </button>
        </div>
      )}

      {/* Video Grid */}
      <div className="px-3 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col shadow-sm hover:shadow-md hover:border-slate-600"
          >
            {/* Thumbnail Box */}
            <div 
              className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer"
              onClick={() => onSelectVideo(video)}
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />
              
              {/* Duration Badge */}
              <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] font-mono font-medium px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                {video.duration}
              </span>

              {/* Play Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center shadow-xl shadow-orange-500/40 transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>

              {/* Training Mode Badge (En ligne / En présentiel) */}
              {video.trainingMode === 'en-ligne' ? (
                <span className="absolute top-2 left-2 bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                  <Laptop className="w-3 h-3" />
                  EN LIGNE
                </span>
              ) : video.trainingMode === 'presentiel' ? (
                <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  EN PRÉSENTIEL
                </span>
              ) : (video.category === 'formations' || video.category === 'baluwo') ? (
                <span className="absolute top-2 left-2 bg-orange-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
                  FORMATION PRO
                </span>
              ) : null}
            </div>

            {/* Video Meta & Actions */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div className="flex items-start gap-2.5">
                <img
                  src={video.channel.avatar}
                  alt={video.channel.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0 mt-0.5 cursor-pointer"
                  onClick={() => onSelectVideo(video)}
                />
                <div className="flex-1 min-w-0">
                  <h3 
                    onClick={() => onSelectVideo(video)}
                    className="text-sm font-bold text-white leading-snug line-clamp-2 cursor-pointer hover:text-orange-400 transition-colors"
                  >
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <span className="font-medium text-slate-300 truncate">{video.channel.name}</span>
                    {video.channel.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20 shrink-0" />
                    )}
                  </div>

                  {video.trainingLocation && (
                    <div className="flex items-center gap-1 text-[11px] text-orange-300/90 mt-0.5 font-medium truncate">
                      <MapPin className="w-3 h-3 shrink-0 text-orange-400" />
                      <span className="truncate">{video.trainingLocation}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{video.views} vues</span>
                    <span>•</span>
                    <span>{video.date}</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar: Like, Comment, and 1-Click WhatsApp Share */}
              <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onLikeVideo(video.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                      video.userLiked
                        ? 'text-orange-400 bg-orange-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${video.userLiked ? 'fill-current' : ''}`} />
                    <span>{video.likes}</span>
                  </button>

                  <button
                    onClick={() => onSelectVideo(video)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{video.commentsCount}</span>
                  </button>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => onShareToWhatsApp(video)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow shadow-blue-600/20 transition-all active:scale-95"
                  title="Partager la vidéo"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partager</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-16 px-4">
          <p className="text-slate-400 text-sm">Aucune vidéo ne correspond à votre recherche "{searchQuery}".</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-3 px-4 py-1.5 bg-slate-800 text-orange-400 text-xs rounded-xl font-medium border border-slate-700"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
