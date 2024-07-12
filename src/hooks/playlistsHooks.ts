// playlistHooks.ts
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import API from "../config/apiClient";
import { getChannelPlaylists } from "../lib/api";
import { UserPrivatePlaylistsResponseTypes } from "../components/PlaylistModal";

// Types
type Playlist = {
  id: number;
  name: string;
  description?: string;
  privacy: "PUBLIC" | "PRIVATE" | "UNLISTED";
  ownerId?: number;
  channelId?: number;
};

type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Create Playlist
export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playlistData: Omit<Playlist, "id">) : Promise<Playlist> =>
      API.post("/playlist/playlists", playlistData), 
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playlists", "userPrivatePlaylists"],
      });
    },
  });
};

// Update Playlist
export const useUpdatePlaylist = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ...data }: Partial<Playlist> & { id: string }) =>
      API.put(`playlist/playlists/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["playlists", variables.id] });
    },
  });
};

// Delete Playlist
export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => API.delete(`/playlist/playlists/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.removeQueries({ queryKey: ["playlists", id] });
    },
  });
};

// Add Video to Playlist
export const useAddVideoToPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      playlistId,
      videoId,
    }: {
      playlistId: number;
      videoId: number;
    }) => API.post(`/playlist/playlists/${playlistId}/videos`, { videoId }),
    onMutate: async ({ playlistId, videoId }) => {
      await queryClient.cancelQueries({
        queryKey: ["playlist", playlistId, "hasVideo", videoId],
      });
      const previousValue = queryClient.getQueryData([
        "playlist",
        playlistId,
        "hasVideo",
        videoId,
      ]);
      queryClient.setQueryData(
        ["playlist", playlistId, "hasVideo", videoId],
        true
      );
      return { previousValue };
    },
    onError: (_err, { playlistId, videoId }, context) => {
      queryClient.setQueryData(
        ["playlist", playlistId, "hasVideo", videoId],
        context?.previousValue
      );
    },
    onSettled: (_, __, { playlistId, videoId }) => {
      queryClient.invalidateQueries({
        queryKey: ["playlist", playlistId, "hasVideo", videoId],
      });
    },
  });
};
export const useAddVideoToChannelPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      playlistId,
      videoId,
      channelId,
    }: {
      playlistId: number;
      videoId: number;
      channelId: string;
    }) =>
      API.post(
        `playlist/playlists/${playlistId}/${channelId}/video/${videoId}`
      ),
    onMutate: async ({ playlistId, videoId }) => {
      await queryClient.cancelQueries({
        queryKey: ["playlist", playlistId, "hasVideo", videoId],
      });
      const previousValue = queryClient.getQueryData([
        "playlist",
        playlistId,
        "hasVideo",
        videoId,
      ]);
      queryClient.setQueryData(
        ["playlist", playlistId, "hasVideo", videoId],
        true
      );
      return { previousValue };
    },
    onError: (_err, { playlistId, videoId }, context) => {
      queryClient.setQueryData(
        ["playlist", playlistId, "hasVideo", videoId],
        context?.previousValue
      );
    },
    onSettled: (_, __, { playlistId, videoId }) => {
      queryClient.invalidateQueries({
        queryKey: ["playlist", playlistId, "hasVideo", videoId],
      });
    },
  });
};

export const useRemoveVideoFromPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      playlistId,
      videoId,
    }: {
      playlistId: number | string;
      videoId: number | string;
    }) => API.delete(`/playlist/playlists/${playlistId}/videos/${videoId}`),
    onMutate: async ({ playlistId, videoId }) => {
      await queryClient.cancelQueries({
        queryKey: ["playlist", playlistId, "hasVideo", videoId],
      });
      const previousValue = queryClient.getQueryData([
        "playlist",
        playlistId,
        "hasVideo",
        videoId,
      ]);
      queryClient.setQueryData(
        ["playlist", playlistId, "hasVideo", videoId],
        false
      );
      return { previousValue };
    },
    onError: (_err, { playlistId, videoId }, context) => {
      queryClient.setQueryData(
        ["playlist", playlistId, "hasVideo", videoId],
        context?.previousValue
      );
    },
    onSettled: (_, __, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
    },
  });
};
// Get Channel Playlists
// export const useChannelPlaylists = (channelId: number, page: number, limit: number) => {
//   return useQuery<PaginatedResponse<Playlist>>({
//     queryKey: ['channelPlaylists', channelId, page, limit],
//     queryFn: () => API.get(`/channels/${channelId}/playlists`, { params: { page, limit } }),
//   });
// };

export const useChannelPlaylists = (
  channelId: string,
  initialPage = 1,
  limit = 2
) =>
  useInfiniteQuery({
    queryKey: ["channelPlaylists", limit, channelId, initialPage, limit],
    queryFn: ({ pageParam = initialPage }) =>
      getChannelPlaylists(channelId, pageParam, limit),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,

    initialPageParam: initialPage,
  });

// Get User Private Playlists
export const useUserPrivatePlaylists = (page: number, limit: number) => {
  return useQuery<UserPrivatePlaylistsResponseTypes>({
    queryKey: ["userPrivatePlaylists", page, limit],
    queryFn: () =>
      API.get("/playlist/users/private-playlists", { params: { page, limit } }),
  });
};

// Get Playlist by ID
export const usePlaylistById = (id: number) => {
  return useQuery<Playlist>({
    queryKey: ["playlists", id],
    queryFn: () => API.get(`playlist/playlists/${id}`),
  });
};

// Optional: Get All Playlists (if needed)
export const useAllPlaylists = (page: number, limit: number) => {
  return useQuery<PaginatedResponse<Playlist>>({
    queryKey: ["playlists", page, limit],
    queryFn: () => API.get("/playlists", { params: { page, limit } }),
  });
};

// Check if a video is in a playlist

export const useIsVideoInPlaylist = (playlistId: number, videoId: number) => {
  return useQuery({
    queryKey: ["playlist", playlistId, "hasVideo", videoId],
    queryFn: () => API.get(`/playlist/${playlistId}/has-video/${videoId}`),
    select: (data: any) => data.isInPlaylist,
  });
};

// function to update the cache
export const updateIsVideoInPlaylistCache = (
  queryClient: QueryClient,
  playlistId: number,
  videoId: number,
  isInPlaylist: boolean
) => {
  queryClient.setQueryData(
    ["playlist", playlistId, "hasVideo", videoId],
    isInPlaylist
  );
};

// Prefetch functions (optional, for optimizing user experience)
export const prefetchPlaylist = async (
  queryClient: QueryClient,
  id: number
) => {
  await queryClient.prefetchQuery({
    queryKey: ["playlists", id],
    queryFn: () => API.get(`/playlists/${id}`),
  });
};

export const prefetchChannelPlaylists = async (
  queryClient: QueryClient,
  channelId: number,
  page: number,
  limit: number
) => {
  await queryClient.prefetchQuery({
    queryKey: ["channelPlaylists", channelId, page, limit],
    queryFn: () =>
      API.get(`/channels/${channelId}/playlists`, { params: { page, limit } }),
  });
};

// Utility function to invalidate all playlist-related queries
export const invalidatePlaylistQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["playlists"] });
  queryClient.invalidateQueries({ queryKey: ["channelPlaylists"] });
  queryClient.invalidateQueries({ queryKey: ["userPrivatePlaylists"] });
};
