import React, { useState } from 'react';
import { TabType, Video, Conversation, Message, StatusStory } from './types';
import { 
  INITIAL_VIDEOS, SHORTS_VIDEOS, INITIAL_CONVERSATIONS, INITIAL_STATUSES 
} from './data/mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { VideoFeed } from './components/VideoFeed';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { FloatingMiniPlayer } from './components/FloatingMiniPlayer';
import { ShortsViewer } from './components/ShortsViewer';
import { ChatList } from './components/ChatList';
import { ChatDetail } from './components/ChatDetail';
import { StatusTab } from './components/StatusTab';
import { StatusViewer } from './components/StatusViewer';
import { ShareToWhatsAppModal } from './components/ShareToWhatsAppModal';
import { CreateVideoModal } from './components/CreateVideoModal';
import { CallModal } from './components/CallModal';
import { Wifi, Battery, Signal, Zap, MessageSquare, Play, Video as VideoIcon } from 'lucide-react';

export default function App() {
  // Navigation & View Mode State
  const [currentTab, setCurrentTab] = useState<TabType>('videos');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data State
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [shorts, setShorts] = useState<Video[]>(SHORTS_VIDEOS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [statuses, setStatuses] = useState<StatusStory[]>(INITIAL_STATUSES);

  // Messages per conversation map
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({
    'conv-group-family': [
      {
        id: 'm1-1',
        senderId: 'user-tonton',
        senderName: 'Tonton Moussa (Kalaban)',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        text: 'Bonjour à tous la famille ! Est-ce que quelqu\'un a des informations sur les formations professionnelles certifiantes à Bamako pour les jeunes ?',
        timestamp: '11:20',
        isOutgoing: false,
        status: 'read'
      },
      {
        id: 'm1-2',
        senderId: 'me',
        senderName: 'Moi',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        text: 'Oui Tonton, voici la vidéo de formation professionnelle officielle sur Baluwo Mali, les cours en énergie solaire et BTP sont certifiés :',
        timestamp: '11:25',
        isOutgoing: true,
        status: 'read',
        mediaType: 'video',
        videoAttachment: INITIAL_VIDEOS[0]
      },
      {
        id: 'm1-3',
        senderId: 'user-tonton',
        senderName: 'Tonton Moussa (Kalaban)',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        text: 'J\'ai regardé la vidéo de formation professionnelle que tu as partagée, mon petit frère s\'est inscrit au centre à Bamako ! Merci infiniment mon fils.',
        timestamp: '11:42',
        isOutgoing: false,
        status: 'read'
      }
    ],
    'conv-group-baluwo': [
      {
        id: 'm2-1',
        senderId: 'baluwo-support',
        senderName: 'Baluwo Support Mali',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        text: 'Bienvenue dans la communauté officielle Baluwo Mali 🇲🇱 ! Retrouvez ici tous les conseils pour les formations professionnelles, les métiers d\'avenir et le soutien aux familles.',
        timestamp: 'Hier',
        isOutgoing: false,
        status: 'read'
      },
      {
        id: 'm2-2',
        senderId: 'baluwo-support',
        senderName: 'Baluwo Support Mali',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        text: 'Nouvelle vidéo de formation professionnelle disponible : Devenez installateur qualifié en énergie solaire au Mali !',
        timestamp: '10:15',
        isOutgoing: false,
        status: 'read',
        mediaType: 'video',
        videoAttachment: INITIAL_VIDEOS[0]
      }
    ],
    'conv-aminata': [
      {
        id: 'm3-1',
        senderId: 'aminata',
        senderName: 'Aminata Diallo',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        text: 'Coucou ! Tu as vu le concert d\'hier soir au stade du 26 Mars ?',
        timestamp: '09:15',
        isOutgoing: false,
        status: 'read'
      },
      {
        id: 'm3-2',
        senderId: 'aminata',
        senderName: 'Aminata',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        text: 'Regarde ce concert de Sidiki Diabaté, l\'ambiance était incroyable hier soir !',
        timestamp: '09:20',
        isOutgoing: false,
        status: 'read',
        mediaType: 'video',
        videoAttachment: INITIAL_VIDEOS[1]
      }
    ],
    'conv-oumar': [
      {
        id: 'm4-1',
        senderId: 'me',
        senderName: 'Moi',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        text: 'Je t\'ai envoyé le lien de la comédie malienne pour le groupe des potes.',
        timestamp: 'Hier',
        isOutgoing: true,
        status: 'read'
      }
    ],
    'conv-group-business': [
      {
        id: 'm5-1',
        senderId: 'ibrahim',
        senderName: 'Ibrahim Quincailler',
        senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
        text: 'Livraison de sacs de ciment et fer à béton confirmée pour le chantier de Kati.',
        timestamp: 'Hier',
        isOutgoing: false,
        status: 'delivered'
      }
    ]
  });

  // Active Selections
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-group-family');
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [pipVideo, setPipVideo] = useState<Video | null>(null);
  const [videoToShare, setVideoToShare] = useState<Video | null>(null);
  const [activeStatus, setActiveStatus] = useState<StatusStory | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [callState, setCallState] = useState<{
    isOpen: boolean;
    isVideo: boolean;
    conversation?: Conversation;
  }>({
    isOpen: false,
    isVideo: false
  });

  // Handlers
  const handleLikeVideo = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const userLiked = !v.userLiked;
          return {
            ...v,
            userLiked,
            likes: userLiked ? v.likes + 1 : Math.max(0, v.likes - 1)
          };
        }
        return v;
      })
    );
    setShorts((prev) =>
      prev.map((s) => {
        if (s.id === videoId) {
          const userLiked = !s.userLiked;
          return {
            ...s,
            userLiked,
            likes: userLiked ? s.likes + 1 : Math.max(0, s.likes - 1)
          };
        }
        return s;
      })
    );
  };

  const handleShareVideoToWhatsApp = (video: Video) => {
    setVideoToShare(video);
  };

  const handleSendToConversation = (
    conversationId: string, 
    customMessage: string, 
    video: Video
  ) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'Moi',
      senderAvatar: '/baluwo_profile_logo.jpg',
      text: customMessage,
      timestamp: 'À l\'instant',
      isOutgoing: true,
      status: 'sent',
      mediaType: 'video',
      videoAttachment: video
    };

    setMessagesMap((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: newMessage,
            unreadCount: 0
          };
        }
        return c;
      })
    );

    // Switch view to chat automatically
    setCurrentTab('chats');
    setActiveConversationId(conversationId);
  };

  const handleSendMessageInChat = (
    text: string, 
    mediaType: 'text' | 'video' | 'audio' = 'text', 
    videoAttachment?: Video
  ) => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'Moi',
      senderAvatar: '/baluwo_profile_logo.jpg',
      text,
      timestamp: 'À l\'instant',
      isOutgoing: true,
      status: 'sent',
      mediaType,
      videoAttachment
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage]
    }));

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessage: newMessage,
            unreadCount: 0
          };
        }
        return c;
      })
    );
  };

  const handleShareToStatus = (video: Video) => {
    const newStatus: StatusStory = {
      id: `stat-${Date.now()}`,
      userId: 'me',
      userName: 'Mon Statut',
      userAvatar: '/baluwo_profile_logo.jpg',
      timestamp: 'À l\'instant',
      mediaUrl: video.thumbnailUrl,
      mediaType: 'image',
      caption: `🎬 ${video.title} (Regardez sur Baluwo TV)`,
      viewed: false
    };

    setStatuses([newStatus, ...statuses]);
  };

  const handlePublishVideo = (newVideo: Video, targetConversationId?: string) => {
    if (newVideo.isShort) {
      setShorts([newVideo, ...shorts]);
      setCurrentTab('shorts');
    } else {
      setVideos([newVideo, ...videos]);
      setCurrentTab('videos');
    }

    if (targetConversationId) {
      handleSendToConversation(
        targetConversationId, 
        `J'ai publié une nouvelle vidéo : "${newVideo.title}" !`, 
        newVideo
      );
    }
  };

  const handleStartCall = (isVideo: boolean) => {
    const currentConv = conversations.find(c => c.id === activeConversationId);
    if (!currentConv) return;
    setCallState({
      isOpen: true,
      isVideo,
      conversation: currentConv
    });
  };

  const totalUnreadChats = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const currentConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-orange-500 selection:text-black">
      
      {/* Container: If isMobileFrame is true, render a smartphone device wrapper, otherwise responsive fluid layout */}
      <div className={`w-full transition-all duration-300 ${
        isMobileFrame 
          ? 'max-w-[430px] my-4 rounded-[42px] border-[8px] border-slate-800 shadow-2xl overflow-hidden bg-slate-950 flex flex-col ring-1 ring-slate-700/60'
          : 'max-w-7xl flex flex-col min-h-screen'
      }`}>
        
        {/* Smartphone Status Bar (Simulating Mali Malitel / Orange Mali Network) */}
        {isMobileFrame && (
          <div className="bg-slate-900 px-6 pt-3 pb-1 flex items-center justify-between text-[11px] text-slate-300 font-medium select-none border-b border-slate-800/60">
            <span className="font-semibold text-white tracking-tight">11:42</span>
            
            {/* Notch / Dynamic Island */}
            <div className="w-20 h-4 bg-black rounded-full" />

            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-[10px] text-orange-400 font-bold">Orange ML 4G</span>
              <Signal className="w-3 h-3 text-white" />
              <Wifi className="w-3 h-3 text-white" />
              <Battery className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        )}

        {/* Global App Header */}
        <Header
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (tab === 'create') {
              setIsCreateModalOpen(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadChatsCount={totalUnreadChats}
          unreadNotifications={2}
        />

        {/* Main Workspace Area based on Tab */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
          {/* Tab 1: YouTube Videos Feed */}
          {currentTab === 'videos' && (
            <VideoFeed
              videos={videos}
              onSelectVideo={(video) => setActiveVideo(video)}
              onShareToWhatsApp={handleShareVideoToWhatsApp}
              onLikeVideo={handleLikeVideo}
              searchQuery={searchQuery}
            />
          )}

          {/* Tab 2: WhatsApp Chats */}
          {currentTab === 'chats' && (
            <div className="flex-1 flex h-[calc(100vh-125px)] sm:h-[calc(100vh-130px)]">
              {/* Desktop / Tablet split view: Left list, right active chat */}
              <div className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${
                activeConversationId && 'hidden md:block'
              }`}>
                <ChatList
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onSelectConversation={(id) => setActiveConversationId(id)}
                  statuses={statuses}
                  onOpenStatus={(status) => setActiveStatus(status)}
                  onNewChat={() => setIsCreateModalOpen(true)}
                  searchQuery={searchQuery}
                />
              </div>

              {/* Chat Conversation Details */}
              <div className={`flex-1 h-full ${
                !activeConversationId ? 'hidden md:flex md:items-center md:justify-center bg-[#0b141a]' : 'flex flex-col'
              }`}>
                {currentConversation ? (
                  <ChatDetail
                    conversation={currentConversation}
                    messages={messagesMap[currentConversation.id] || []}
                    onBack={() => setActiveConversationId(null)}
                    onSendMessage={handleSendMessageInChat}
                    onPlayVideoInPiP={(video) => setPipVideo(video)}
                    onOpenVideoFull={(video) => setActiveVideo(video)}
                    onStartCall={handleStartCall}
                    availableVideos={videos}
                  />
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-white">Baluwo Mali Messagerie</h3>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Sélectionnez une discussion à gauche pour discuter et visionner des vidéos partagées en haute définition.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: YouTube Shorts */}
          {currentTab === 'shorts' && (
            <div className="p-2 sm:p-4 flex items-center justify-center">
              <ShortsViewer
                shorts={shorts}
                onShareToWhatsApp={handleShareVideoToWhatsApp}
                onLikeShort={handleLikeVideo}
              />
            </div>
          )}

          {/* Tab 4: WhatsApp Statuts */}
          {currentTab === 'status' && (
            <StatusTab
              statuses={statuses}
              onOpenStatus={(status) => setActiveStatus(status)}
              onAddStatus={() => setIsCreateModalOpen(true)}
            />
          )}
        </main>

        {/* Floating Mini-Player (Picture-in-Picture) */}
        {pipVideo && (
          <FloatingMiniPlayer
            video={pipVideo}
            onMaximize={() => {
              setActiveVideo(pipVideo);
              setPipVideo(null);
            }}
            onClose={() => setPipVideo(null)}
            onShareToCurrentChat={
              currentConversation 
                ? (video) => handleSendMessageInChat(`Regarde cette vidéo : ${video.title}`, 'video', video)
                : undefined
            }
            currentChatName={currentConversation?.name}
          />
        )}

        {/* Bottom Mobile Navigation Bar */}
        <Navigation
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (tab === 'create') {
              setIsCreateModalOpen(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          unreadChatsCount={totalUnreadChats}
          hasUnseenStatus={statuses.some(s => !s.viewed)}
        />
      </div>

      {/* Modals & Overlays */}
      
      {/* 1. Full YouTube Video Player Modal */}
      {activeVideo && (
        <VideoPlayerModal
          video={activeVideo}
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          onMinimizeToPiP={() => {
            setPipVideo(activeVideo);
            setActiveVideo(null);
          }}
          onShareToWhatsApp={handleShareVideoToWhatsApp}
          onLikeVideo={handleLikeVideo}
          onSelectRelatedVideo={(relVid) => setActiveVideo(relVid)}
          allVideos={videos}
        />
      )}

      {/* 2. Key Bridge Modal: Partager sur WhatsApp */}
      {videoToShare && (
        <ShareToWhatsAppModal
          video={videoToShare}
          conversations={conversations}
          isOpen={!!videoToShare}
          onClose={() => setVideoToShare(null)}
          onSendToConversation={handleSendToConversation}
          onShareToStatus={handleShareToStatus}
        />
      )}

      {/* 3. Status Viewer */}
      {activeStatus && (
        <StatusViewer
          statuses={statuses}
          initialStatusIndex={statuses.findIndex(s => s.id === activeStatus.id)}
          onClose={() => setActiveStatus(null)}
          onReply={(status, text) => {
            const userConv = conversations.find(c => c.name.toLowerCase().includes(status.userName.toLowerCase())) || conversations[0];
            handleSendToConversation(userConv.id, `En réponse à ton statut : "${text}"`, videos[0]);
          }}
        />
      )}

      {/* 4. Create / Publish Video Modal */}
      {isCreateModalOpen && (
        <CreateVideoModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onPublishVideo={handlePublishVideo}
          conversations={conversations}
        />
      )}

      {/* 5. Voice / Video Call Modal */}
      {callState.isOpen && callState.conversation && (
        <CallModal
          isOpen={callState.isOpen}
          isVideo={callState.isVideo}
          conversation={callState.conversation}
          onEndCall={() => setCallState({ isOpen: false, isVideo: false })}
        />
      )}

    </div>
  );
}
