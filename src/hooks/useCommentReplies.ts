import { useQuery, UseQueryResult } from "@tanstack/react-query";
import API from "../config/apiClient";

export const useCommentReplies = (commentId: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["replies", commentId],
    queryFn: () => API.get(`/comment/comments/${commentId}/replies`),
  })as UseQueryResult<any>;

  return {
    replies: data?.replies || [],
    isLoading,
    isError,
  };
};



