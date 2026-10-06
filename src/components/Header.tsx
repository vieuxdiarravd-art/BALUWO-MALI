import React from 'react';
import { Smartphone, Monitor, Bell, Search, Video as VideoIcon, MessageSquare, GraduationCap } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadChatsCount: number;
  unreadNotifications: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  isMobileFrame,
  onToggleMobileFrame,
  searchQuery,
  onSearchChange,
  unreadChatsCount,
  unreadNotifications,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Brand & Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Baluwo Mali Logo & Title */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onTabChange('videos')}>
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-slate-700/80">
            <img
              src="/baluwo_profile_logo.jpg"
              alt="Baluwo Mali Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">Baluwo</span>
              <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">Mali</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher vidéos, clips, contacts, groupes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-full border border-slate-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Fast Switch Tabs (Discussions vs Videos) */}
          <div className="flex items-center bg-slate-800 p-1 rounded-full border border-slate-700/80">
            <button
              onClick={() => onTabChange('chats')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all relative ${
                currentTab === 'chats'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Discussions Baluwo"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Discussions</span>
              {unreadChatsCount > 0 && (
                <span className="w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadChatsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('videos')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'videos' || currentTab === 'shorts'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Flux Vidéos & Shorts"
            >
              <VideoIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vidéos</span>
            </button>
          </div>

          {/* Device Frame View Toggle (Mobile mockup vs Fluid) */}
          <button
            onClick={onToggleMobileFrame}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors hidden sm:flex items-center gap-1 text-xs"
            title={isMobileFrame ? "Passer en vue plein écran responsive" : "Passer en mode cadre Smartphone hybride"}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-4 h-4 text-orange-400" />
                <span className="hidden lg:inline text-[11px]">Plein écran</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span className="hidden lg:inline text-[11px]">Mode Mobile</span>
              </>
            )}
          </button>

          {/* Formations Professionnelles Direct Badge */}
          <div className="hidden xl:flex items-center gap-1.5 bg-amber-950/60 border border-amber-700/60 text-amber-300 text-xs px-2.5 py-1 rounded-lg">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">Formations Professionnelles Mali</span>
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => onTabChange('status')}
            className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border-2 border-blue-500 cursor-pointer shadow-md hover:scale-105 transition-transform shrink-0"
            title="Mon Profil Baluwo"
          >
            <img
              src="/baluwo_profile_logo.jpg"
              alt="Mon Profil"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-full"
            />
          </button>
        </div>
      </div>

      {/* Mobile Search on Small Screens */}
      <div className="md:hidden px-4 pb-2.5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher vidéos, messages ou groupes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-1.5 rounded-full border border-slate-700 focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>
      </div>
    </header>
  );
};
