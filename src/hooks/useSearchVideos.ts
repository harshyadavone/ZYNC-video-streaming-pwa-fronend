import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { VideoDetails } from "../types";
import debounce from 'lodash/debounce'
import { getSearchResults, getSearchTitle } from "../lib/api";
import React from "react";

const SEARCH_VIDEOS_QUERY_KEY = "searchVideos";

export const useSearchVideos = (
  query: string,
  category: string,
  sort: string,
  order: 'asc' | 'desc',
  initialPage = 1,
  limit = 1
): UseInfiniteQueryResult<InfiniteData<VideoDetails, number>, Error> =>
  useInfiniteQuery({
    queryKey: [SEARCH_VIDEOS_QUERY_KEY, query, category, sort, order, limit] as const,
    queryFn: async ({ pageParam = initialPage }) => {
      const response = await getSearchResults(
        query,
        category,
        sort,
        order,
        pageParam as number,
        limit
      );
      return response;
    },
    getNextPageParam: (lastPage) =>
      // @ts-ignore
      lastPage.pagination.page < lastPage.pagination.totalPages ? lastPage.pagination.page + 1
        : undefined,
    initialPageParam: initialPage,
      enabled: !!query,
  });


const SEARCH_TITLE_QUERY_KEY = "searchTitle";

export const useSearchTitle = (query: string) => {
  // @ts-ignore
  const debouncedSearch = debounce((searchTerm: string) => {
    refetch();
  }, 300);

  const { data: title, isLoading, refetch } = useQuery({
    queryKey: [SEARCH_TITLE_QUERY_KEY, query],
    queryFn: () => getSearchTitle(query),
    enabled: false,
  });

  React.useEffect(() => {
    if (query !== '') {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch]);

  return {
    title,
    isLoading,
  };
};
