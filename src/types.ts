// src/types.ts

export interface Video {
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
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface VideoResponse {
  videos: Video[];
  pagination: Pagination;
}

export type Channel = {
  id: number;
  name: string;
  description: string;
  slug: string;
  bannerImage: string;
  channelProfileImage: string;
  _count: { subscribers: number };
};

export interface VideoDetails {
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
  polls: any[]; // You might want to create a proper type for polls if needed
  channel: Channel;
}

export interface VideoResponseTypes {
  category: string;
  channel: ChannelTypes;
  channelId: number;
  commentsCount: number;
  createdAt: string;
  description: string;
  dislikes: number;
  duration: number;
  id: number;
  likes: number;
  ownerId: number;
  privacy: "PUBLIC" | "PRIVATE" | "UNLISTED";
  tags: string[];
  thumbnail: string;
  title: string;
  updatedAt: string;
  videoUrl: string;
  views: number;
}

interface ChannelTypes {
  bannerImage: string;
  channelProfileImage: string;
  createdAt: string;
  description: string;
  id: number;
  name: string;
  ownerId: number;
  slug: string;
  updatedAt: string;
}

export type UpdateChannelData = {
  name?: string;
  description?: string;
  slug?: string;
  channelProfileImage?: File;
  bannerImage?: File;
};

// export type User = {
//   id: any;
// }; // TODO: fix all the types
