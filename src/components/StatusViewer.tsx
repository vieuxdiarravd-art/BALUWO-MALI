import React, { useState, useEffect } from 'react';
import { StatusStory } from '../types';
import { X, Send, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface StatusViewerProps {
  statuses: StatusStory[];
  initialStatusIndex?: number;
  onClose: () => void;
  onReply: (status: StatusStory, replyText: string) => void;
}

export const StatusViewer: React.FC<StatusViewerProps> = ({
  statuses,
  initialStatusIndex = 0,
  onClose,
  onReply
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialStatusIndex);
  const [progress, setProgress] = useState<number>(0);
  const [replyText, setReplyText] = useState<string>('');

  const currentStatus = statuses[currentIndex] || statuses[0];

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < statuses.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, statuses.length, onClose]);

  const handleNext = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(currentStatus, replyText.trim());
    setReplyText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between max-w-md mx-auto select-none">
      {/* Top Segmented Progress Bars */}
      <div className="p-3 z-20 space-y-2">
        <div className="flex items-center gap-1.5 w-full">
          {statuses.map((_, index) => (
            <div key={index} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    index < currentIndex
                      ? '100%'
                      : index === currentIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* User Info & Close */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStatus.userAvatar}
              alt={currentStatus.userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
            />
            <div>
              <h4 className="text-white text-xs font-bold">{currentStatus.userName}</h4>
              <p className="text-[10px] text-slate-300">{currentStatus.timestamp}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Media Container with Left/Right click zones */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <img
          src={currentStatus.mediaUrl}
          alt={currentStatus.userName}
          className="w-full h-full object-contain"
        />

        {/* Click zones for navigation */}
        <div 
          onClick={handlePrev}
          className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-10" 
        />
        <div 
          onClick={handleNext}
          className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer z-10" 
        />

        {/* Status Caption */}
        {currentStatus.caption && (
          <div className="absolute bottom-6 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center z-10">
            <p className="text-white text-xs sm:text-sm font-medium leading-relaxed">
              {currentStatus.caption}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Reply Bar */}
      <div className="p-3 bg-black/80 backdrop-blur-md border-t border-white/10 z-20">
        <form onSubmit={handleSendReply} className="flex items-center gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Répondre à ${currentStatus.userName}...`}
            className="flex-1 bg-white/10 text-white placeholder-slate-400 text-xs px-4 py-2 rounded-full border border-white/20 focus:outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-full transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
