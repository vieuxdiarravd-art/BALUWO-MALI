import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Message, Video } from '../types';
import { 
  ArrowLeft, Phone, Video as VideoCallIcon, MoreVertical, 
  Send, Mic, Paperclip, Play, Pause, ExternalLink, 
  Sparkles, CheckCheck, Users, GraduationCap, Image, Film, X,
  Laptop, Building2
} from 'lucide-react';

interface ChatDetailProps {
  conversation: Conversation;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (text: string, mediaType?: 'text' | 'video' | 'audio', videoAttachment?: Video) => void;
  onPlayVideoInPiP: (video: Video) => void;
  onOpenVideoFull: (video: Video) => void;
  onStartCall: (isVideo: boolean) => void;
  availableVideos: Video[];
}

export const ChatDetail: React.FC<ChatDetailProps> = ({
  conversation,
  messages,
  onBack,
  onSendMessage,
  onPlayVideoInPiP,
  onOpenVideoFull,
  onStartCall,
  availableVideos
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false);
  const [showVideoPicker, setShowVideoPicker] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [inlinePlayingVideoId, setInlinePlayingVideoId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), 'text');
    setInputText('');
  };

  const handleSendVoiceNote = () => {
    setIsRecordingVoice(false);
    onSendMessage(`Note vocale (${recordingSeconds}s)`, 'audio');
  };

  const handleSelectVideoToSend = (video: Video) => {
    onSendMessage(`Regarde cette vidéo : ${video.title}`, 'video', video);
    setShowVideoPicker(false);
    setShowAttachMenu(false);
  };

  const handleSendFormationEnLigne = () => {
    onSendMessage(`💻 Formation Pro EN LIGNE (Baluwo Mali) :\nModule : "Comptabilité, Gestion & E-Commerce au Mali"\nLien d'accès plateforme : https://formation.baluwo.ml/cours/784\nStatut : Session ouverte 24h/24 sur mobile.`, 'text');
    setShowAttachMenu(false);
  };

  const handleSendFormationPresentiel = () => {
    onSendMessage(`🏫 Formation Pro EN PRÉSENTIEL (Baluwo Mali) :\nModule : "Installation Solaire Photovoltaïque & BTP"\nLieu : Centre Professionnel Bamako-Sogoniko\nConvocation : Inscription validée pour la prochaine session pratique.`, 'text');
    setShowAttachMenu(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b141a] text-slate-100 relative">
      {/* Chat Header */}
      <div className="bg-[#111b21] border-b border-slate-800 px-3 py-2 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            {conversation.isGroup ? (
              <span className="absolute -bottom-1 -right-1 bg-slate-900 text-slate-300 p-0.5 rounded-full border border-slate-700">
                <Users className="w-2.5 h-2.5" />
              </span>
            ) : (
              conversation.onlineStatus === 'En ligne' && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-slate-900" />
              )
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-xs">
              {conversation.name}
            </h3>
            <p className="text-[11px] text-blue-400 truncate">
              {conversation.isGroup
                ? `${conversation.membersCount} membres • Baluwo Mali`
                : conversation.onlineStatus || 'En ligne'}
            </p>
          </div>
        </div>

        {/* Call Actions */}
        <div className="flex items-center gap-1 text-slate-300">
          <button
            onClick={() => onStartCall(true)}
            className="p-2 rounded-full hover:bg-slate-800 hover:text-white transition-colors"
            title="Appel Vidéo Baluwo"
          >
            <VideoCallIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onStartCall(false)}
            className="p-2 rounded-full hover:bg-slate-800 hover:text-white transition-colors"
            title="Appel Audio Baluwo"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Timeline */}
      <div 
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      >
        {/* Encryption notice */}
        <div className="flex justify-center">
          <div className="bg-[#182229] border border-amber-900/40 text-amber-200/80 text-[10px] px-3 py-1.5 rounded-lg max-w-md text-center shadow-xs">
            🔒 Les messages et vidéos partagés dans Baluwo Mali sont chiffrés de bout en bout.
          </div>
        </div>

        {messages.map((msg) => {
          const isMe = msg.isOutgoing;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-2.5 sm:p-3 shadow-md relative ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-700/40'
                }`}
              >
                {/* Sender Name in Group */}
                {!isMe && conversation.isGroup && (
                  <p className="text-[11px] font-bold text-orange-400 mb-1">
                    {msg.senderName}
                  </p>
                )}

                {/* 1. If message contains a YouTube / Baluwo Video Card */}
                {msg.mediaType === 'video' && msg.videoAttachment && (
                  <div className="mb-2 bg-black/60 rounded-xl overflow-hidden border border-slate-700/80 shadow-inner">
                    {inlinePlayingVideoId === msg.id ? (
                      <div className="relative aspect-video w-full bg-black">
                        <video
                          src={msg.videoAttachment.videoUrl}
                          poster={msg.videoAttachment.thumbnailUrl}
                          autoPlay
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => setInlinePlayingVideoId(null)}
                          className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-white rounded-full hover:bg-black"
                          title="Fermer le lecteur"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative aspect-video w-full cursor-pointer group">
                        <img
                          src={msg.videoAttachment.thumbnailUrl}
                          alt={msg.videoAttachment.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <button
                            onClick={() => setInlinePlayingVideoId(msg.id)}
                            className="w-11 h-11 rounded-full bg-orange-500 hover:bg-orange-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                            title="Regarder dans le chat"
                          >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </button>
                        </div>
                        <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                          {msg.videoAttachment.duration}
                        </span>
                        <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Film className="w-2.5 h-2.5" /> Baluwo Video
                        </span>
                      </div>
                    )}

                    {/* Video Card Meta & Fast Actions */}
                    <div className="p-2.5 bg-slate-900/90 space-y-1.5">
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                        {msg.videoAttachment.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {msg.videoAttachment.channel.name} • {msg.videoAttachment.views} vues
                      </p>

                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => onPlayVideoInPiP(msg.videoAttachment!)}
                          className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 border border-slate-700"
                          title="Continuer de discuter en regardant la vidéo"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Mini-lecteur (PiP)</span>
                        </button>

                        <button
                          onClick={() => onOpenVideoFull(msg.videoAttachment!)}
                          className="py-1 px-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm"
                          title="Ouvrir dans le lecteur YouTube complet"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>YouTube</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Audio Note Card */}
                {msg.mediaType === 'audio' && (
                  <div className="flex items-center gap-3 py-1 pr-2">
                    <button className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden flex items-center">
                        <div className="w-1/3 h-full bg-blue-400" />
                      </div>
                      <span className="text-[10px] text-slate-300">0:14 • Note vocale</span>
                    </div>
                  </div>
                )}

                {/* Text Content */}
                {msg.text && (
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>
                )}

                {/* Message Timestamp & Blue Ticks */}
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-300/80">
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <CheckCheck className={`w-3.5 h-3.5 ${
                      msg.status === 'read' ? 'text-cyan-300' : 'text-slate-300'
                    }`} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Tray Popover */}
      {showAttachMenu && (
        <div className="p-3 bg-[#111b21] border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {/* Option 1: Share YouTube / Baluwo Video */}
          <button
            onClick={() => {
              setShowVideoPicker(true);
              setShowAttachMenu(false);
            }}
            className="p-2.5 rounded-xl bg-gradient-to-br from-rose-950/80 to-slate-900 border border-rose-500/40 flex flex-col items-center gap-1 text-center hover:brightness-110 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
              <Film className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Vidéos YouTube</span>
            <span className="text-[10px] text-rose-300">Partager un clip</span>
          </button>

          {/* Option 2: Formation En ligne */}
          <button
            onClick={handleSendFormationEnLigne}
            className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-950/80 to-slate-900 border border-cyan-500/40 flex flex-col items-center gap-1 text-center hover:brightness-110 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md">
              <Laptop className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Formation En ligne</span>
            <span className="text-[10px] text-cyan-300">E-learning & Mobile</span>
          </button>

          {/* Option 3: Formation En présentiel */}
          <button
            onClick={handleSendFormationPresentiel}
            className="p-2.5 rounded-xl bg-gradient-to-br from-amber-950/80 to-slate-900 border border-amber-500/40 flex flex-col items-center gap-1 text-center hover:brightness-110 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">En présentiel</span>
            <span className="text-[10px] text-amber-300">Centre Bamako</span>
          </button>

          {/* Option 4: Photos & Gallery */}
          <button
            onClick={() => {
              onSendMessage("📷 [Photo reçue]", "text");
              setShowAttachMenu(false);
            }}
            className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/40 flex flex-col items-center gap-1 text-center hover:brightness-110 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Image className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Galerie Photo</span>
            <span className="text-[10px] text-indigo-300">Images de Bamako</span>
          </button>
        </div>
      )}

      {/* Quick Video Selector Sheet */}
      {showVideoPicker && (
        <div className="p-3 bg-[#111b21] border-t border-slate-800 max-h-72 overflow-y-auto space-y-2 animate-in fade-in slide-in-from-bottom duration-150">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-rose-500" />
              Sélectionnez une vidéo à envoyer dans {conversation.name}
            </h4>
            <button
              onClick={() => setShowVideoPicker(false)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => handleSelectVideoToSend(vid)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 cursor-pointer flex items-center gap-2.5 transition-all group"
              >
                <div className="relative w-20 aspect-video rounded-md overflow-hidden bg-black shrink-0">
                  <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[9px] text-white px-1 rounded font-mono">
                    {vid.duration}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-semibold text-white truncate group-hover:text-orange-400">
                    {vid.title}
                  </h5>
                  <p className="text-[10px] text-slate-400">{vid.channel.name}</p>
                  <span className="text-[10px] text-blue-400 font-bold">1-Clic Envoyer →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="p-2 sm:p-3 bg-[#202c33] border-t border-slate-800 flex items-center gap-2">
        {/* Attachment Toggle */}
        <button
          onClick={() => {
            setShowAttachMenu(!showAttachMenu);
            setShowVideoPicker(false);
          }}
          className={`p-2 rounded-full transition-colors ${
            showAttachMenu ? 'bg-slate-700 text-orange-400' : 'text-slate-400 hover:text-white'
          }`}
          title="Partager vidéo ou document"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input or Voice Recording Indicator */}
        {isRecordingVoice ? (
          <div className="flex-1 flex items-center justify-between bg-red-950/60 border border-red-500/40 rounded-full px-4 py-2 text-xs text-red-200 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
              <span>Enregistrement audio en cours... ({recordingSeconds}s)</span>
            </div>
            <button
              onClick={() => setIsRecordingVoice(false)}
              className="text-slate-400 hover:text-white text-xs underline"
            >
              Annuler
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendText} className="flex-1 flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message (ou partagez une vidéo)..."
              className="w-full bg-[#2a3942] text-sm text-white placeholder-slate-400 px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </form>
        )}

        {/* Send or Voice Note Button */}
        {isRecordingVoice ? (
          <button
            onClick={handleSendVoiceNote}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            title="Envoyer la note vocale"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        ) : inputText.trim() ? (
          <button
            onClick={handleSendText}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        ) : (
          <button
            onClick={() => setIsRecordingVoice(true)}
            className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-blue-400 flex items-center justify-center transition-transform active:scale-95"
            title="Enregistrer une note vocale"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
