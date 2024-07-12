import { useInfiniteQuery } from "@tanstack/react-query";
import { getChannelComments } from "../lib/api";

export const COMMENTS_QUERY_KEY = "channelComments";

export const useChannelComments = (
  videoId: number,
  initialPage = 1,
) =>
  useInfiniteQuery({
    queryKey: [COMMENTS_QUERY_KEY, videoId],
    queryFn: ({ pageParam = initialPage }) =>
      getChannelComments(videoId, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.currentPage < lastPage.pagination.totalPages
        ? lastPage.pagination.currentPage + 1
        : undefined,

    initialPageParam: initialPage,
  });
