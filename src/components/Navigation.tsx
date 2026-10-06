import React from 'react';
import { MessageSquare, PlaySquare, Film, PlusCircle, Radio } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadChatsCount: number;
  hasUnseenStatus: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  unreadChatsCount,
  hasUnseenStatus
}) => {
  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 py-1.5 px-3 z-30 sticky bottom-0">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Tab 1: Discussions (Baluwo) */}
        <button
          onClick={() => onTabChange('chats')}
          title="Discussions Baluwo"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            currentTab === 'chats'
              ? 'text-blue-400 font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${currentTab === 'chats' ? 'stroke-[2.5]' : ''}`} />
            {unreadChatsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {unreadChatsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5">Chats</span>
        </button>

        {/* Tab 2: Statuts */}
        <button
          onClick={() => onTabChange('status')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            currentTab === 'status'
              ? 'text-blue-400 font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Radio className={`w-5 h-5 ${currentTab === 'status' ? 'stroke-[2.5]' : ''}`} />
            {hasUnseenStatus && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-400 rounded-full ring-2 ring-slate-900" />
            )}
          </div>
          <span className="text-[11px] mt-0.5">Statuts</span>
        </button>

        {/* Tab 3: Publier / Créer (Bouton central proéminent) */}
        <button
          onClick={() => onTabChange('create')}
          className="flex flex-col items-center justify-center py-1 px-2.5 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:brightness-110">
            <PlusCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 text-slate-300 font-medium">Créer</span>
        </button>

        {/* Tab 4: Vidéos (YouTube Feed) */}
        <button
          onClick={() => onTabChange('videos')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'videos'
              ? 'text-rose-500 font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          <PlaySquare className={`w-5 h-5 ${currentTab === 'videos' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-0.5">Vidéos</span>
        </button>

        {/* Tab 5: Shorts */}
        <button
          onClick={() => onTabChange('shorts')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'shorts'
              ? 'text-rose-500 font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          <Film className={`w-5 h-5 ${currentTab === 'shorts' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-0.5">Shorts</span>
        </button>
      </div>
    </nav>
  );
};
