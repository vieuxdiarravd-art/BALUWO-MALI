import React, { useState, useRef } from 'react';
import { Video, Conversation } from '../types';
import { 
  X, Video as VideoIcon, Upload, Camera, Film, 
  Sparkles, CheckCircle, Send, Users, AlertCircle,
  Laptop, Building2, MapPin
} from 'lucide-react';

interface CreateVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishVideo: (video: Video, targetConversationId?: string) => void;
  conversations: Conversation[];
}

export const CreateVideoModal: React.FC<CreateVideoModalProps> = ({
  isOpen,
  onClose,
  onPublishVideo,
  conversations
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<Video['category']>('formations');
  const [trainingMode, setTrainingMode] = useState<'en-ligne' | 'presentiel'>('en-ligne');
  const [trainingLocation, setTrainingLocation] = useState<string>('Centre de Formation Bamako Sogoniko');
  const [isShort, setIsShort] = useState<boolean>(false);
  const [selectedConvId, setSelectedConvId] = useState<string>('');
  const [shareDirectlyToWhatsApp, setShareDirectlyToWhatsApp] = useState<boolean>(true);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [isSuccessFeedback, setIsSuccessFeedback] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleStartSimulatedRecording = () => {
    setIsRecording(true);
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setRecordedDuration(count);
      if (count >= 5) {
        clearInterval(interval);
        setIsRecording(false);
        // Use high quality sample video
        setPreviewUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
        if (!title) setTitle('Vidéo enregistrée à Bamako • Baluwo');
      }
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newVideo: Video = {
      id: `vid-user-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Vidéo partagée par la communauté Baluwo Mali.',
      videoUrl: previewUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
      duration: isShort ? '00:30' : '03:15',
      views: '1',
      likes: 1,
      commentsCount: 0,
      category,
      trainingMode: category === 'formations' ? trainingMode : undefined,
      trainingLocation: category === 'formations' ? trainingLocation : undefined,
      date: "À l'instant",
      isShort,
      channel: {
        id: 'chan-me',
        name: 'Moi (Baluwo Mali)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        subscribers: '12',
        verified: false
      }
    };

    onPublishVideo(newVideo, shareDirectlyToWhatsApp ? selectedConvId : undefined);
    setIsSuccessFeedback(true);
    setTimeout(() => {
      setIsSuccessFeedback(false);
      onClose();
      // Reset fields
      setTitle('');
      setDescription('');
      setPreviewUrl('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base">
                Publier & Partager une vidéo
              </h3>
              <p className="text-[11px] text-slate-400">Diffusion sur Baluwo TV & discussions WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Media Capture or Upload Area */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Source vidéo (Caméra ou Fichier)
            </label>

            {previewUrl ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-700">
                <video src={previewUrl} controls className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => setPreviewUrl('')}
                  className="absolute top-2 right-2 p-1.5 bg-black/80 text-white rounded-full hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/40 hover:bg-slate-800 flex flex-col items-center justify-center gap-2 text-slate-300 transition-all group"
                >
                  <Upload className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Téléverser vidéo</span>
                  <span className="text-[10px] text-slate-500">MP4, WebM ou MOV</span>
                </button>

                {/* Record Button */}
                <button
                  type="button"
                  onClick={handleStartSimulatedRecording}
                  disabled={isRecording}
                  className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/40 hover:bg-slate-800 flex flex-col items-center justify-center gap-2 text-slate-300 transition-all group"
                >
                  <Camera className={`w-6 h-6 ${isRecording ? 'text-red-500 animate-pulse' : 'text-blue-400 group-hover:scale-110'} transition-transform`} />
                  <span className="text-xs font-semibold">
                    {isRecording ? `Enregistrement... (${recordedDuration}s)` : 'Filmer maintenant'}
                  </span>
                  <span className="text-[10px] text-slate-500">Caméra smartphone</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Titre de la vidéo *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Formation certifiante en Énergie Solaire et BTP à Bamako"
              className="w-full bg-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-800 text-xs text-white px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-orange-500"
              >
                <option value="formations">🎓 Formations Professionnelles</option>
                <option value="actualites">📚 Modules Disponibles</option>
                <option value="modules-en-cours">⏳ Modules en cours</option>
                <option value="humour">🎭 Culture Malienne</option>
                <option value="tutoriels">💡 Tutoriels & Astuces</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Format
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsShort(false)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    !isShort
                      ? 'bg-orange-500 text-slate-950 border-orange-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Standard 16:9
                </button>
                <button
                  type="button"
                  onClick={() => setIsShort(true)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    isShort
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Short Vertical
                </button>
              </div>
            </div>
          </div>

          {/* Formations Professionnelles Sub-options: En ligne vs En présentiel */}
          {category === 'formations' && (
            <div className="p-3 rounded-xl bg-slate-800/80 border border-orange-500/30 space-y-2.5 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-orange-400">
                Type de formation professionnelle :
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTrainingMode('en-ligne')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    trainingMode === 'en-ligne'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white border-slate-700'
                  }`}
                >
                  <Laptop className="w-4 h-4" />
                  <span>En ligne</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTrainingMode('presentiel')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    trainingMode === 'presentiel'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white border-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>En présentiel</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  {trainingMode === 'presentiel' ? 'Lieu du centre / atelier à Bamako :' : 'Plateforme / Accès en ligne :'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={trainingLocation}
                    onChange={(e) => setTrainingLocation(e.target.value)}
                    placeholder={trainingMode === 'presentiel' ? "Ex: Centre Baluwo Bamako Sogoniko / Faladié" : "Ex: E-learning Baluwo Mali & Webinaire Mobile"}
                    className="w-full bg-slate-900 text-xs text-white placeholder-slate-500 pl-8 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expliquez brièvement le contenu de votre vidéo pour la communauté..."
              className="w-full bg-slate-800 text-xs text-white placeholder-slate-500 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Direct WhatsApp Sharing Option */}
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareDirectlyToWhatsApp}
                  onChange={(e) => setShareDirectlyToWhatsApp(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Envoyer directement dans une discussion WhatsApp</span>
              </label>
              <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded-full">
                Fonction Hybride
              </span>
            </div>

            {shareDirectlyToWhatsApp && (
              <div>
                <select
                  value={selectedConvId}
                  onChange={(e) => setSelectedConvId(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choisir un contact ou groupe WhatsApp --</option>
                  {conversations.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.isGroup ? '(Groupe)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {isSuccessFeedback && (
                <span className="text-blue-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Vidéo publiée et partagée !
                </span>
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!title.trim() || isSuccessFeedback}
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publier sur Baluwo TV</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
