import React, { useState } from 'react';
import { Conversation, StatusStory } from '../types';
import { Search, Pin, Users, Check, CheckCheck, Video, Plus, Sparkles, Radio } from 'lucide-react';

interface ChatListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (convId: string) => void;
  statuses: StatusStory[];
  onOpenStatus: (status: StatusStory) => void;
  onNewChat: () => void;
  searchQuery: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  statuses,
  onOpenStatus,
  onNewChat,
  searchQuery
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups' | 'videos'>('all');

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = !searchQuery || 
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.text?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filter === 'unread') return conv.unreadCount > 0;
    if (filter === 'groups') return conv.isGroup;
    if (filter === 'videos') return conv.lastMessage.mediaType === 'video';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-r border-slate-800">
      {/* Status Bar / Stories Carousel */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3">
          {/* Add My Status */}
          <div className="flex flex-col items-center gap-1 cursor-pointer shrink-0">
            <div className="relative w-13 h-13 rounded-full border-2 border-dashed border-blue-500/80 p-0.5 flex items-center justify-center bg-white shadow-sm">
              <img
                src="/baluwo_profile_logo.jpg"
                alt="Mon profil"
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-contain bg-white"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-slate-900">
                +
              </span>
            </div>
            <span className="text-[10px] text-slate-300 font-medium">Mon Profil</span>
          </div>

          {/* Contact Statuses */}
          {statuses.map((status) => (
            <div
              key={status.id}
              onClick={() => onOpenStatus(status)}
              className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
            >
              <div className={`relative w-13 h-13 rounded-full p-0.5 ${
                status.viewed
                  ? 'border-2 border-slate-600'
                  : 'border-2 border-blue-400 ring-2 ring-blue-500/20'
              } transition-transform group-hover:scale-105`}>
                <img
                  src={status.userAvatar}
                  alt={status.userName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-[10px] text-slate-300 font-medium max-w-[64px] truncate">
                {status.userName.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs (WhatsApp style) */}
      <div className="px-3 py-2 flex items-center gap-1.5 border-b border-slate-800/80 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'unread'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          Non lues
        </button>
        <button
          onClick={() => setFilter('groups')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'groups'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          Groupes
        </button>
        <button
          onClick={() => setFilter('videos')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-colors ${
            filter === 'videos'
              ? 'bg-orange-500 text-slate-950 shadow-sm'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-3 h-3" />
          <span>Vidéos partagées</span>
        </button>
      </div>

      {/* Conversation Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredConversations.map((conv) => {
          const isActive = activeConversationId === conv.id;
          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                isActive
                  ? 'bg-slate-800/90'
                  : 'hover:bg-slate-900/80'
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700"
                />
                {conv.isGroup ? (
                  <span className="absolute -bottom-1 -right-1 bg-slate-900 text-slate-300 p-0.5 rounded-full border border-slate-700">
                    <Users className="w-3 h-3" />
                  </span>
                ) : (
                  conv.onlineStatus === 'En ligne' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-slate-950" />
                  )
                )}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {conv.name}
                    </h4>
                    {conv.isPinned && (
                      <Pin className="w-3 h-3 text-slate-400 fill-slate-400 shrink-0 rotate-45" />
                    )}
                  </div>
                  <span className={`text-[11px] shrink-0 ${
                    conv.unreadCount > 0 ? 'text-blue-400 font-semibold' : 'text-slate-400'
                  }`}>
                    {conv.lastMessage.timestamp}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-400 truncate pr-2">
                    {conv.lastMessage.isOutgoing && (
                      <CheckCheck className={`w-3.5 h-3.5 shrink-0 ${
                        conv.lastMessage.status === 'read' ? 'text-cyan-400' : 'text-slate-400'
                      }`} />
                    )}
                    {conv.lastMessage.mediaType === 'video' && (
                      <span className="flex items-center gap-1 text-orange-400 font-medium shrink-0">
                        <Video className="w-3 h-3" />
                        [Vidéo]
                      </span>
                    )}
                    <span className="truncate">
                      {conv.lastMessage.text}
                    </span>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredConversations.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            Aucune discussion trouvée.
          </div>
        )}
      </div>

      {/* Floating Action: New Chat */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80">
        <button
          onClick={onNewChat}
          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle discussion ou Groupe</span>
        </button>
      </div>
    </div>
  );
};
