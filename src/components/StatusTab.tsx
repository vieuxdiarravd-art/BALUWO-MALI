import React from 'react';
import { StatusStory } from '../types';
import { Plus, Camera, Eye, Radio, Sparkles } from 'lucide-react';

interface StatusTabProps {
  statuses: StatusStory[];
  onOpenStatus: (status: StatusStory) => void;
  onAddStatus: () => void;
}

export const StatusTab: React.FC<StatusTabProps> = ({
  statuses,
  onOpenStatus,
  onAddStatus
}) => {
  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-4 space-y-6 max-w-2xl mx-auto overflow-y-auto">
      {/* My Status */}
      <div 
        onClick={onAddStatus}
        className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 cursor-pointer transition-colors"
      >
        <div className="relative">
          <div className="w-13 h-13 rounded-full overflow-hidden bg-white p-0.5 border border-slate-700 shadow-sm">
            <img
              src="/baluwo_profile_logo.jpg"
              alt="Mon profil Baluwo"
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-contain"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm ring-2 ring-slate-900">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-white">Mon profil & statut</h4>
          <p className="text-xs text-slate-400">Baluwo Mali • Au service de toutes vos réussites</p>
        </div>

        <div className="flex items-center gap-1.5 text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-500/30 text-xs font-semibold">
          <Camera className="w-3.5 h-3.5" />
          <span>Ajouter</span>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span>Mises à jour récentes (24h)</span>
          </h3>
          <span className="text-[11px] text-slate-500">{statuses.length} statuts</span>
        </div>

        <div className="space-y-2">
          {statuses.map((status) => (
            <div
              key={status.id}
              onClick={() => onOpenStatus(status)}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 cursor-pointer transition-all group"
            >
              <div className={`relative w-13 h-13 rounded-full p-0.5 ${
                status.viewed
                  ? 'border-2 border-slate-600'
                  : 'border-2 border-blue-400 ring-2 ring-blue-500/30'
              } transition-transform group-hover:scale-105 shrink-0`}>
                <img
                  src={status.userAvatar}
                  alt={status.userName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {status.userName}
                </h4>
                <p className="text-xs text-slate-400">{status.timestamp}</p>
                {status.caption && (
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1 italic">
                    "{status.caption}"
                  </p>
                )}
              </div>

              <div className="text-slate-400 group-hover:text-white">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Baluwo Tips Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 to-slate-900 border border-orange-500/30 space-y-1.5">
        <h5 className="text-xs font-bold text-orange-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Astuce Partage Baluwo
        </h5>
        <p className="text-xs text-slate-300">
          Vous pouvez partager n'importe quelle vidéo du catalogue Baluwo YouTube directement dans votre statut WhatsApp en cliquant sur le bouton <strong>Partager</strong> sous la vidéo.
        </p>
      </div>
    </div>
  );
};
