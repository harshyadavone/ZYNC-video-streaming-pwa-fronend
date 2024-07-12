import { useInfiniteQuery } from "@tanstack/react-query";
import { getPlaylistById} from "../../lib/api";

// export const PLAYLIST_BY_ID_QUERY = "playlistById";

export const useGetPlaylistById = (initialPage = 1, limit = 2, playlistId : string) =>
  useInfiniteQuery({
    queryKey: ['playlist', playlistId, { type: 'details', limit }],
    queryFn: ({ pageParam = initialPage }) =>
        getPlaylistById(playlistId, pageParam, limit, ),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,

    initialPageParam: initialPage,
  });
