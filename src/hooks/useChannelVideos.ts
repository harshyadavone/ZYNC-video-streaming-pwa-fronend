import { useInfiniteQuery } from "@tanstack/react-query";
import { getChannelVideos } from "../lib/api";

export const VIDEOS_QUERY_KEY = "channelVideos";

export const useChannelVideos = (
  channelId: number,
  initialPage = 1,
  limit = 2,
  sortOrder: "newest" | "oldest"
) =>
  useInfiniteQuery({
    queryKey: [VIDEOS_QUERY_KEY, limit, sortOrder],
    queryFn: ({ pageParam = initialPage }) =>
      getChannelVideos(channelId, pageParam, limit, sortOrder),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,

    initialPageParam: initialPage,
  });
