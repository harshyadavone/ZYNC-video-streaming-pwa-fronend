export type Replies = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
  userId: number;
  videoId: number;
  parentId: number;
  replyToUsername: string;
  user: {
    id: 1;
    username: string;
    avatar: string;
  };
  _count: {
    replies: number;
  };
};

export interface GetRepliesResponse {
  replies: Replies[];
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
