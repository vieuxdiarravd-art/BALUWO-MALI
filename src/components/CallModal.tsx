import React, { useState, useEffect } from 'react';
import { Conversation } from '../types';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, Shield } from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  isVideo: boolean;
  conversation: Conversation;
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  isVideo,
  conversation,
  onEndCall
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isOpen) {
      setSeconds(0);
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatCallTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 max-w-md mx-auto shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col items-center gap-1 z-10 pt-6">
        <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/30">
          <Shield className="w-3.5 h-3.5" />
          <span>Appel {isVideo ? 'Vidéo' : 'Vocal'} Baluwo</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-2">{conversation.name}</h2>
        <span className="text-xs text-slate-400 font-mono">{formatCallTime(seconds)}</span>
      </div>

      {/* Center Visual */}
      <div className="flex-1 flex flex-col items-center justify-center my-8">
        {isVideo && !isVideoDisabled ? (
          <div className="relative w-full aspect-square max-w-xs rounded-3xl overflow-hidden border-2 border-blue-500/40 shadow-2xl bg-slate-900">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-medium">
              {conversation.name}
            </div>
            {/* Self Video PIP Preview */}
            <div className="absolute top-3 right-3 w-20 h-28 bg-white rounded-xl overflow-hidden border border-white/20 shadow-lg p-1">
              <img
                src="/baluwo_profile_logo.jpg"
                alt="Moi"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500/40 p-1 shadow-2xl animate-pulse">
              <img
                src={conversation.avatar}
                alt={conversation.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              HD Audio
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-center gap-6 pb-6">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-full transition-colors ${
            isMuted ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          title={isMuted ? 'Micro coupé' : 'Couper le micro'}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {isVideo && (
          <button
            onClick={() => setIsVideoDisabled(!isVideoDisabled)}
            className={`p-4 rounded-full transition-colors ${
              isVideoDisabled ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={isVideoDisabled ? 'Activer caméra' : 'Couper caméra'}
          >
            {isVideoDisabled ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
        )}

        <button
          onClick={onEndCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/40 transition-transform active:scale-95"
          title="Raccrocher"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
