// hooks/useVideoStats.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../config/apiClient';

interface VideoStatsResponse {
  message: string;
}

export const useLikeVideo = (videoId: number) => {
  const queryClient = useQueryClient();

  return useMutation<VideoStatsResponse, { status: number; message: string }, void>({
    mutationFn: async () => {
      return await API.post(`video/videos/${videoId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoStats', videoId] });
    },
  });
};

export const useDislikeVideo = (videoId: number) => {
  const queryClient = useQueryClient();

  return useMutation<VideoStatsResponse, { status: number; message: string }, void>({
    mutationFn: async () => {
      return await API.post(`video/videos/${videoId}/dislike`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoStats', videoId] });
    },
  });
};

export const useBookmarkVideo = (videoId: number) => {
  const queryClient = useQueryClient();

  return useMutation<VideoStatsResponse, { status: number; message: string }, { time: number }>({
    mutationFn: async ({ time }) => {
      return await API.post(`video/videos/${videoId}/bookmark`, { time });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoStats', videoId] });
    },
  });
};