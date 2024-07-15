import { Poll, PollCreationData } from "../components/videoDetail";
import API from "../config/apiClient";
import { WatchHistoryResponse } from "../hooks/useWatchHistory";
import { GetPlaylistResponse } from "../pages/Playlistpage";
import { Video, VideoResponse } from "../types";
import { GetBookmarksResponse } from "../types/bookmarks";
import { GetChannelVideosResponse } from "../types/channel";
import { GetWatchHistoryResponse } from "../types/history";
import { GetPlaylistsResponse } from "../types/playlits";
import { UserResponse } from "../types/user";

export interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
}

type loginInput = Pick<RegisterInput, "email" | "password">;

export const register = async (data: RegisterInput) =>
  API.post("/auth/register", data);
export const login = async (data: loginInput) => API.post("/auth/login", data);
export const logout = async () => API.get("/auth/logout");
export const verifyEmail = async (verificationCode: any) =>
  API.get(`/auth/email/verify/${verificationCode}`);
export const sendPasswordResetEmail = async (email: any) =>
  API.post("/auth/password/forgot", { email });
export const resetPassword = async ({ verificationCode, password }: any) =>
  API.post("/auth/password/reset", { verificationCode, password });

export const getUser = async (): Promise<UserResponse> => API.get("/user");
export const editProfile = async (data: any) =>
  API.post("/user/update-profile", data);
export const checkUsernameAvailability = async (username: string) => {
  return API.get(`/user/check-username/${username}`);
};
export const getSessions = async () => API.get("/sessions");
export const deleteSession = async (id: any) => API.delete(`/sessions/${id}`);

export const getVideos = async (page = 1, limit = 2): Promise<VideoResponse> =>
  API.get(`/video/videos?limit=${limit}&page=${page}`);

export const getRelatedVideos = async (
  videoId: string,
  page = 1,
  limit = 10
): Promise<VideoResponse> =>
  API.get(`/video/${videoId}/related?limit=${limit}&page=${page}`);

export const getTrendingVideos = async (): Promise<Video[]> =>
  API.get(`/video/trending`);

export const getSearchResults = async (
  query: string,
  category: string,
  sort: string,
  order: "asc" | "desc",
  page = 1,
  limit = 2
): Promise<VideoResponse[]> =>
  API.get(
    `/video/search?limit=${limit}&page=${page}&query=${query}&category=${category}&sort=${sort}&order=${order}`
  );

export const getSearchTitle = async (query: string): Promise<any[]> =>
  API.get(`/video/search/title?title=${query}`);

// channel routes
// /my-channel

export const updateChannel = async (data: FormData) => {
  API.put(`/channels/update-channel`, data);
};

export const createChannel = async (data: FormData) => {
  API.post(`/channels/create-channel`, data);
};
export const uploadVideo = async (channelId: string, formData: FormData) => {
  API.post(`/video/${channelId}/video`, formData);
};

export const createOrUpdateWatchHistory = async (
  videoId: number,
  progress: number
): Promise<WatchHistoryResponse> => {
  return API.post(`/history/videos/${videoId}/watchHistory`, { progress });
};

export const getChannelVideos = async (
  channelId: number,
  page?: number,
  limit?: number,
  sortOrder?: "newest" | "oldest"
): Promise<GetChannelVideosResponse> => {
  return API.get(
    `/video/videos/channel/${channelId}?page=${page}&limit=${limit}&sortOrder=${sortOrder}`
  );
};

export const getWatchHistory = async (
  page?: number,
  limit?: number
): Promise<GetWatchHistoryResponse> => {
  return API.get(`/history/watchHistory?page=${page}&limit=${limit}`);
};

export const getPrivatePlaylists = async (
  page?: number,
  limit?: number
): Promise<GetPlaylistsResponse> => {
  return API.get(
    `/playlist/users/private-playlists?page=${page}&limit=${limit}`
  );
};

export const getBookmarks = async (
  page?: number,
  limit?: number
): Promise<GetBookmarksResponse> => {
  return API.get(`bookmark/bookmarks?page=${page}&limit=${limit}`);
};

export const getMySubscriptions = async (
  page?: number,
  limit?: number
): Promise<any> => {
  return API.get(`subscription/my-subscriptions?page=${page}&limit=${limit}`);
};

export const getChannelPlaylists = async (
  channelId: string,
  page?: number,
  limit?: number
): Promise<GetPlaylistsResponse> => {
  return API.get(
    `/playlist//channels/${channelId}/playlists?page=${page}&limit=${limit}`
  );
};
export const getPlaylistById = async (
  playlistId: string,
  page?: number,
  limit?: number
): Promise<GetPlaylistResponse> => {
  return API.get(
    `/playlist/playlists/${playlistId}?age=${page}&limit=${limit}`
  );
};
export const getChannelComments = async (
  videoId: number,
  pageParam: number
): Promise<any> => {
  return API.get(
    `/comment/videos/${videoId}/comments?page=${pageParam}&limit=10`
  );
};

// Polls
export const createPoll = (
  videoId: number,
  pollData: PollCreationData
): Promise<Poll> => API.post(`/video/videos/${videoId}/polls`, pollData);

export const votePoll = (
  videoId: number,
  pollId: number,
  optionId: number
): Promise<void> =>
  API.post(`/video/videos/${videoId}/polls/${pollId}/vote`, { optionId });
