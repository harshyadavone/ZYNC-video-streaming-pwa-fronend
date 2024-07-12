export interface Video {
  category: string;
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
  channel: Channel;
}

export type Channel = {
  channelProfileImage: string;
  id: string;
  name: string;
};

export interface GetChannelVideosResponse {
  videos: Video[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}