import React, { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import API from "../config/apiClient";
import CommentForm from "./CommentForm";
import { useCommentReaction } from "../hooks/useCommentReaction";
import {
  Check,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  CornerDownRight,
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { timeAgo } from "../lib/formatters";
import DeepNestedComments from "./DeepNestedComments";
import EditCommentForm from "./EditCommentForm";
import useAuth from "../hooks/useAuth";
import Modal from "./Modal";
import { GetRepliesResponse } from "../types/comments";
import { COMMENTS_QUERY_KEY } from "../hooks/getChannelComments";
import { UserIcon } from "./ui/Icons";

interface CommentItemProps {
  comment: any;
  videoId: number;
  onReply: (content: string, parentId: number, replyToUsername: string) => void;
  owner: number;
  level?: number;
}

const MAX_NESTED_LEVEL = 2;

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  videoId,
  onReply,
  owner,
  level = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showDeepNested, setShowDeepNested] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { reaction, like, dislike, dislikePending, likePending } =
    useCommentReaction(comment.id);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchReplies = async ({
    pageParam = 1,
  }): Promise<GetRepliesResponse> => {
    return await API.get(
      `/comment/comments/${comment.id}/replies?page=${pageParam}&limit=5`
    );
  };

  const REPLIES_QUERY_KEY = "replies";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: [REPLIES_QUERY_KEY, comment.id],
    queryFn: fetchReplies,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.currentPage < lastPage.pagination.totalPages
        ? lastPage.pagination.currentPage + 1
        : undefined,
    initialPageParam: 1,
    enabled: showReplies,
  });

  const updateCommentMutation = useMutation({
    mutationFn: (content: string) =>
      API.put(`/comment/comments/${comment.id}`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies", comment.parentId],
      });
      queryClient.invalidateQueries({
        queryKey: [COMMENTS_QUERY_KEY, videoId],
      });
      setIsEditing(false);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: () => API.delete(`/comment/comments/${comment.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies", comment.parentId],
      });
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });

  const handleReply = (content: string) => {
    onReply(content, comment.id, comment.user.username);
    setShowReplyForm(false);
  };

  const handleEdit = (content: string) => {
    updateCommentMutation.mutate(content);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteCommentMutation.mutate();
    setShowDeleteModal(false);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const renderCommentContent = () => (
    <>
      <div className="flex items-center mb-2">
        {comment.user.avatar ? (
          <img
            src={comment.user.avatar}
            alt={comment.user.username}
            className={`w-6 h-6 rounded-full mr-2 ${
              owner && owner === comment.user.id && "pulse-avatar"
            }`}
          />
        ) : (
          <UserIcon className="w-6 h-6 rounded-full mr-2 bg-card text-white p-1" />
        )}
        <span className="font-medium text-foreground mr-1">
          {comment.user.username}
        </span>
        {owner && owner === comment.user.id && (
          <Check className="h-4 w-4 bg-primary/5 font-bold text-primary rounded-full p-0.5" />
        )}
        <span className="text-xs text-muted-foreground ml-2">
          {timeAgo(comment.createdAt)}
        </span>
      </div>
      <div className="mb-2">
        {comment.replyToUsername && (
          <span className="text-primary text-sm mr-2">
            @{comment.replyToUsername}
          </span>
        )}
        {isEditing ? (
          <EditCommentForm
            initialContent={comment.content}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p className="text-foreground">{comment.content}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center"
        >
          <MessageSquare size={14} className="mr-1" />
          Reply
        </button>

        {user?.id === comment.user.id && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
            >
              <Edit size={14} className="mr-1" />
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-red-500 hover:text-destructive/80 flex items-center"
            >
              <Trash2 size={14} />
            </button>
            <Modal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              title="Confirm Deletion"
            >
              <p className="mb-4">
                Are you sure you want to delete this comment?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/80"
                >
                  Delete
                </button>
              </div>
            </Modal>
          </>
        )}
        {comment._count?.replies > 0 && (
          <button
            onClick={toggleReplies}
            className="text-sm text-primary hover:underline flex items-center"
          >
            {showReplies ? (
              <ChevronUp size={14} className="mr-1" />
            ) : (
              <ChevronDown size={14} className="mr-1" />
            )}
            {showReplies ? "Hide" : "Show"} {comment._count.replies}{" "}
            {comment._count.replies === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>
    </>
  );

  const renderNestedReplies = () => (
    <div className="mt-4">
      {isLoading && (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      )}
      {isError && (
        <div className="text-destructive">
          Error loading replies:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {/* @ts-ignore */}
          {page.replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              videoId={videoId}
              onReply={onReply}
              owner={owner}
              level={level + 1}
            />
          ))}
        </React.Fragment>
      ))}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="text-sm text-primary mt-2 hover:underline"
        >
          {isFetchingNextPage ? "Loading more..." : "Load more replies"}
        </button>
      )}
    </div>
  );

  const renderContinuedThread = () => (
    <div className="mt-4">
      <button
        onClick={() => setShowDeepNested(true)}
        className="text-sm text-primary hover:underline flex items-center"
      >
        <CornerDownRight size={14} className="mr-1" />
        Continue this thread
      </button>
    </div>
  );

  return (
    <div className="mb-1 pb-2">
      <div
        className={`flex items-start rounded-md ${
          level > 0 ? "border-l pl-4" : ""
        }`}
      >
        <div className="flex flex-col items-center mr-4">
          <button
            disabled={likePending}
            onClick={() => like()}
            className={`p-1 rounded-lg ${
              reaction === "LIKE"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:bg-primary/5"
            }`}
          >
            {likePending ? (
              <Loader2 className=" h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp size={16} />
            )}
          </button>
          <span className="text-sm font-medium my-1">
            {comment.likes - comment.dislikes}
          </span>
          <button
            disabled={dislikePending}
            onClick={() => dislike()}
            className={`p-1 rounded-lg ${
              reaction === "DISLIKE"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:bg-primary/5"
            }`}
          >
            {dislikePending ? (
              <Loader2 className=" h-4 w-4 animate-spin" />
            ) : (
              <ArrowDown size={16} />
            )}
          </button>
        </div>
        <div className="flex-1 rounded-md p-3">
          {renderCommentContent()}
          {showReplyForm && (
            <div className="mt-2">
              <CommentForm
                onSubmit={handleReply}
                placeholder={`Reply to @${
                  comment.replyToUsername || comment.user.username
                }`}
                autoFocus
              />
            </div>
          )}
          {showReplies && level < MAX_NESTED_LEVEL && renderNestedReplies()}
          {level >= MAX_NESTED_LEVEL && renderContinuedThread()}
        </div>
      </div>
      {showDeepNested && (
        <DeepNestedComments
          comment={comment}
          videoId={videoId}
          onReply={onReply}
          owner={owner}
          onClose={() => setShowDeepNested(false)}
        />
      )}
    </div>
  );
};

export default CommentItem;
