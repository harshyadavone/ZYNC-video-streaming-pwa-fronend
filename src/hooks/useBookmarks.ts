import { useInfiniteQuery } from "@tanstack/react-query";
import { getBookmarks } from "../lib/api";

export const BOOKMARK_QUERY = "bookmarks";

export const useBookmarks = (initialPage = 1, limit = 2) =>
  useInfiniteQuery({
    queryKey: [BOOKMARK_QUERY, limit],
    queryFn: ({ pageParam = initialPage }) => getBookmarks(pageParam, limit),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,

    initialPageParam: initialPage,
  });
