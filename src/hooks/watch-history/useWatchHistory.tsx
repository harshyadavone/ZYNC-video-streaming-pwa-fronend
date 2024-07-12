import { useInfiniteQuery } from "@tanstack/react-query";
import { getWatchHistory } from "../../lib/api";

export const WATCH_HISTORY = "watchHistory";

export const useWatchHistory = (
  initialPage = 1,
  limit = 2
) =>
  useInfiniteQuery({
    queryKey: [WATCH_HISTORY, limit],
    queryFn: ({ pageParam = initialPage }) => getWatchHistory(pageParam, limit),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,

    initialPageParam: initialPage,
  });
