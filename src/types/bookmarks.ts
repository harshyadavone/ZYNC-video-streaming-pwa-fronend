import { Video } from "./channel";

export interface GetBookmarksResponse {
    bookmarks: Bookmarks[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }

  type Bookmarks  ={
    id: number,
    time: number,
    status: string,
    createdAt: string,
    updatedAt: string,
    userId: number,
    videoId: number,
    video: Video
  }
