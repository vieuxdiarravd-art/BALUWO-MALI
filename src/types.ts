export interface Channel {
  id: string;
  name: string;
  avatar: string;
  subscribers: string;
  verified?: boolean;
}

export interface VideoComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  likes: number;
  userLiked?: boolean;
  commentsCount: number;
  comments?: VideoComment[];
  channel: Channel;
  category: 'formations' | 'baluwo' | 'actualites' | 'modules-en-cours' | 'humour' | 'tutoriels';
  trainingMode?: 'en-ligne' | 'presentiel';
  trainingLocation?: string;
  date: string;
  isShort?: boolean;
  embedUrl?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text?: string;
  timestamp: string;
  isOutgoing: boolean;
  status: 'sent' | 'delivered' | 'read';
  mediaType?: 'text' | 'video' | 'audio' | 'image';
  videoAttachment?: Video;
  audioDuration?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  membersCount?: number;
  lastMessage: Message;
  unreadCount: number;
  onlineStatus?: string;
  isPinned?: boolean;
  phoneOrTag?: string;
}

export interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  viewed: boolean;
}

export type TabType = 'chats' | 'videos' | 'shorts' | 'status' | 'create';
