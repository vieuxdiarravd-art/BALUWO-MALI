import React, { useState } from 'react';
import { Video, Conversation } from '../types';
import { X, Send, CheckCircle2, Users, Search, Share2, Sparkles, MessageCircle } from 'lucide-react';

interface ShareToWhatsAppModalProps {
  video: Video | null;
  conversations: Conversation[];
  isOpen: boolean;
  onClose: () => void;
  onSendToConversation: (conversationId: string, customMessage: string, video: Video) => void;
  onShareToStatus?: (video: Video) => void;
}

export const ShareToWhatsAppModal: React.FC<ShareToWhatsAppModalProps> = ({
  video,
  conversations,
  isOpen,
  onClose,
  onSendToConversation,
  onShareToStatus,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [customText, setCustomText] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [isSentFeedback, setIsSentFeedback] = useState<boolean>(false);

  if (!isOpen || !video) return null;

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!selectedConvId) return;
    const messageToSend = customText.trim() || `Regarde cette vidéo : "${video.title}"`;
    onSendToConversation(selectedConvId, messageToSend, video);
    setIsSentFeedback(true);
    setTimeout(() => {
      setIsSentFeedback(false);
      onClose();
    }, 1200);
  };

  const handleStatusShare = () => {
    if (onShareToStatus) {
      onShareToStatus(video);
      setIsSentFeedback(true);
      setTimeout(() => {
        setIsSentFeedback(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-1.5">
                Partager sur WhatsApp
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                  Baluwo Direct
                </span>
              </h3>
              <p className="text-xs text-slate-400">Envoyer instantanément avec aperçu vidéo interactif</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview Card */}
        <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center gap-3">
          <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-700">
            <img 
              src={video.thumbnailUrl} 
              alt={video.title} 
              className="w-full h-full object-cover" 
            />
            <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1 rounded font-mono font-medium">
              {video.duration}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-1">{video.title}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{video.channel.name} • {video.views} vues</p>
            <span className="inline-flex items-center gap-1 text-[10px] text-orange-400 bg-orange-950/40 border border-orange-800/50 px-1.5 py-0.2 rounded mt-1">
              <Sparkles className="w-2.5 h-2.5" />
              Lecteur in-chat compatible
            </span>
          </div>
        </div>

        {/* Quick Share to Status */}
        <div className="px-4 pt-3">
          <button
            onClick={handleStatusShare}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700/60 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-blue-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                  +
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Mon Statut Baluwo (24h)
                </p>
                <p className="text-[11px] text-slate-400">Diffuser l'extrait à tous mes contacts</p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-blue-400 bg-blue-950/40 border border-blue-800/50 px-2 py-0.5 rounded-full">
              Publier
            </span>
          </button>
        </div>

        {/* Search Contact / Group */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Chercher un contact ou groupe WhatsApp..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-slate-800 text-xs sm:text-sm text-white pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Conversation List */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {filteredConversations.map((conv) => {
              const isSelected = selectedConvId === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/80 shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      {conv.isGroup && (
                        <span className="absolute -bottom-1 -right-1 bg-slate-900 text-slate-300 p-0.5 rounded-full border border-slate-700">
                          <Users className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        {conv.name}
                        {conv.isGroup && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({conv.membersCount} m.)
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {conv.lastMessage.text}
                      </p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-600'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 fill-blue-600 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Message Field */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Message d'accompagnement (facultatif)
            </label>
            <div className="relative">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ex: Tonton, regarde ce tutoriel pour recharger notre compteur !"
                className="w-full bg-slate-800 text-xs text-white placeholder-slate-500 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isSentFeedback ? (
              <span className="text-blue-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Partagé avec succès !
              </span>
            ) : (
              '1 destinataire sélectionné'
            )}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              disabled={!selectedConvId || isSentFeedback}
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer sur WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
