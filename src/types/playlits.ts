export type Playlists = {
  channelId: string;
  createdAt: string;
  description: string;
  id: number;
  name: string;
  ownerId: number;
  privacy: "PRIVATE" | "UNLISTED" | "PUBLIC";
  updatedAt: string;
};

export interface GetPlaylistsResponse {
  playlists: Playlists[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
