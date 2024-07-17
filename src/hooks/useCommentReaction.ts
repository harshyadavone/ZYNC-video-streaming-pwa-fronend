import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../config/apiClient";

export const useCommentReaction = (commentId: number) => {
  const queryClient = useQueryClient();

  const { data: reaction } = useQuery({
    queryKey: ["commentReaction", commentId],
    queryFn: () => API.get(`/comment/comments/${commentId}/reaction`),
  });

  const likeMutation = useMutation({
    mutationFn: () => API.post(`/comment/comments/${commentId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["channelComments"]});
      queryClient.invalidateQueries({queryKey: ["commentReaction", commentId]});
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: () => API.post(`/comment/comments/${commentId}/dislike`),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["channelComments"]});
      queryClient.invalidateQueries({queryKey: ["commentReaction", commentId]});
    },
  });

  return {
    // @ts-ignore
    reaction: reaction?.reaction,
    like: likeMutation.mutate,
    likePending : likeMutation.isPending,
    dislike: dislikeMutation.mutate,
    dislikePending: dislikeMutation.isPending,
  };
};
