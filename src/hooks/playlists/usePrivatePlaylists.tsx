import { useInfiniteQuery } from "@tanstack/react-query";
import { getPrivatePlaylists } from "../../lib/api";

export const PRIVATE_PLAYLIST_QUERY = "playlists";

export const usePrivatePlaylists = (initialPage = 1, limit = 2) =>
  useInfiniteQuery({
    queryKey: [PRIVATE_PLAYLIST_QUERY, limit],
    queryFn: ({ pageParam = initialPage }) =>
      getPrivatePlaylists(pageParam, limit),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,

    initialPageParam: initialPage,
  });
