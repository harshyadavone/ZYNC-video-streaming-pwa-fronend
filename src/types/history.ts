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

// type Videos ={
//   video: Video[]
// }

export type Channel = {
  channelProfileImage: string;
  id: string;
  name: string;
};

export interface WatchHistory {
  createdAt: string;
  id: number;
  progress: number;
  updatedAt: string;
  userId: number;
  videoId: number;
  video: Video;
}

export interface GetWatchHistoryResponse {
  watchHistory: WatchHistory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
