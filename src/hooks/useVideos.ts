import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { getRelatedVideos, getTrendingVideos, getVideos } from "../lib/api";
import { VideoResponseTypes } from "../types";
import { useState } from "react";

export const VIDEOS_QUERY_KEY = "videos";

export const useVideos = (initialPage = 1, limit = 8) =>
  useInfiniteQuery({
    queryKey: [VIDEOS_QUERY_KEY, limit],
    queryFn: ({ pageParam = initialPage }) => getVideos(pageParam, limit),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    initialPageParam: initialPage,
  });

interface Pagination {
  page: number;
  totalPages: number;
}

export interface VideoResponse {
  videos: VideoResponseTypes[];
  pagination: Pagination;
}

const RELATED_VIDEOS_QUERY_KEY = "relatedVideos";

export const useRelatedVideos = (
  videoId: string,
  initialPage = 1,
  limit = 10
): UseInfiniteQueryResult<InfiniteData<VideoResponse, number>, Error> =>
  useInfiniteQuery({
    queryKey: [RELATED_VIDEOS_QUERY_KEY, videoId, limit] as const,
    queryFn: async ({ pageParam = initialPage }) => {
      const response = await getRelatedVideos(
        videoId,
        pageParam as number,
        limit
      );
      return response;
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    initialPageParam: initialPage,
    enabled: !!videoId,
  });

export const TRENDING = "trending";

const useTrendingVideos = (opts = {}) => {
  const { data: video, ...rest } = useQuery({
    queryKey: [TRENDING],
    queryFn: getTrendingVideos,
    staleTime: Infinity,
    ...opts,
  }) as UseQueryResult;

  return {
    video,
    ...rest,
  };
};

export default useTrendingVideos;

// interface UploadVideoParams {
//   channelId: string;
//   formData: FormData;
// }

export const useVideoUpload = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const mutation = useMutation({
    mutationFn: async ({
      channelId,
      formData,
    }: {
      channelId: string;
      formData: FormData;
    }) => {
      setProgress(0);
      setIsComplete(false);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/video/${channelId}/video`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Unable to read response");
      }

      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        result += chunk;

        const lines = result.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.progress) {
                setProgress(data.progress);
              } else if (data.status === "success") {
                setProgress(100);
                setIsComplete(true);
                return data.video;
              } else if (data.status === "error") {
                throw new Error(data.message);
              }
            } catch (e) {
              console.error("Error parsing server message:", e);
            }
          }
        }
      }

      throw new Error("Unexpected end of response");
    },
    onSuccess: () => {
      console.log("Upload successful");
    },
    onError: (error: Error) => {
      console.error("Upload failed:", error.message);
      setIsComplete(true); // Ensure loader is removed even on error
    },
  });

  return {
    ...mutation,
    progress,
    isUploading: mutation.isPending && !isComplete,
    isComplete,
  };
};
