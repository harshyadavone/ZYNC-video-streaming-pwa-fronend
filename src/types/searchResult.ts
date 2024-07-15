export type ChannelTypes = {
    id: number;
    name: string;
    description: string;
    slug: string;
    bannerImage: string;
    channelProfileImage: string;
    createdAt: string;
    updatedAt: string;
    ownerId: number;
  };
  
  export interface VideoTypeResult {
    id: number;
    title: string;
    videoUrl: string;
    description: string;
    thumbnail: string;
    duration: number;
    privacy: string;
    createdAt: string;
    updatedAt: string;
    views: number;
    likes: number;
    dislikes: number;
    commentsCount: number;
    category: string;
    tags: string[];
    channelId: number;
    ownerId: number;
    channel: ChannelTypes;
  }