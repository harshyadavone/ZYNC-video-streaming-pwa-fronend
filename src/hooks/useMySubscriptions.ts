import { useInfiniteQuery } from "@tanstack/react-query";
import { getMySubscriptions } from "../lib/api";

export const MYSUBSCRIPTION_QUERY = "mySubscriptions";

// /my-subscriptions
export const useMySubscriptions = (initialPage = 1, limit = 2) =>
  useInfiniteQuery({
    queryKey: [MYSUBSCRIPTION_QUERY, limit],
    queryFn: ({ pageParam = initialPage }) => getMySubscriptions(pageParam, limit),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,

    initialPageParam: initialPage,
  });
