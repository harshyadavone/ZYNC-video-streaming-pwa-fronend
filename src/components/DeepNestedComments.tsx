import React, { useState } from "react";
import {
  InvalidateQueryFilters,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import API from "../config/apiClient";
import CommentForm from "./CommentForm";
import { useCommentReaction } from "../hooks/useCommentReaction";
import {
  X,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
  Edit,
  Trash2,
} from "lucide-react";
import { timeAgo } from "../lib/formatters";
import EditCommentForm from "./EditCommentForm";
import useAuth from "../hooks/useAuth";
import Modal from "./Modal";
import { GetRepliesResponse } from "../types/comments";

interface CommentProps {
  comment: any;
  videoId: number;
  onReply: (content: string, parentId: number, replyToUsername: string) => void;
  owner: number;
  onClose?: () => void;
  level?: number;
}

const MAX_NESTED_LEVEL = 2;

const CommentComponent: React.FC<CommentProps> = ({
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
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
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

  const handleReply = (content: string) => {
    onReply(content, comment.id, comment.user.username);
    setShowReplyForm(false);
    queryClient.invalidateQueries([
      "replies",
      comment.id,
    ] as InvalidateQueryFilters);
  };

  const { reaction, like, dislike } = useCommentReaction(comment.id);

  const renderCommentContent = () => (
    <>
      <div className="flex items-center mb-2">
        <img
          src={comment.user.avatar}
          alt={comment.user.username}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="font-medium mr-2">{comment.user.username}</span>
        {owner === comment.user.id && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            Author
          </span>
        )}
        <span className="text-xs text-muted-foreground ml-2">
          {timeAgo(comment.createdAt)}
        </span>
      </div>
      {isEditing ? (
        <EditCommentForm
          initialContent={comment.content}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className="text-foreground">{comment.content}</p>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center"
        >
          <MessageSquare size={14} className="mr-1" />
          Reply
        </button>
        {comment._count?.replies > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-sm text-primary hover:underline flex items-center"
          >
            {showReplies ? (
              <ChevronUp size={14} className="mr-1" />
            ) : (
              <ChevronDown size={14} className="mr-1" />
            )}
            {showReplies ? "Hide" : "Show"} {comment._count.replies} replies
          </button>
        )}
        {/* @ts-ignore */}
        {user.id === comment.user.id && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
            >
              <Edit size={14} className="mr-1" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-destructive hover:text-destructive/80 flex items-center"
            >
              <Trash2 size={14} className="mr-1" />
              Delete
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
      </div>
    </>
  );

  return (
    <div className={`mb-4 ${level > 0 ? "ml-8" : ""}`}>
      <div className="flex items-start">
        <div className="flex flex-col items-center mr-4">
          <button
            onClick={() => like()}
            className={`p-1 rounded-lg ${
              reaction === "LIKE"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:bg-primary/5"
            }`}
          >
            <ArrowUp size={16} />
          </button>
          <span className="text-sm font-medium my-1">
            {comment.likes - comment.dislikes}
          </span>
          <button
            onClick={() => dislike()}
            className={`p-1 rounded-lg ${
              reaction === "DISLIKE"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:bg-primary/5 "
            }`}
          >
            <ArrowDown size={16} />
          </button>
        </div>
        <div className="flex-1">
          {renderCommentContent()}
          {showReplyForm && (
            <div className="mt-2">
              <CommentForm
                onSubmit={handleReply}
                placeholder={`Reply to @${comment.user.username}`}
                autoFocus
              />
            </div>
          )}
          {showReplies && level < MAX_NESTED_LEVEL && (
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
                    <CommentComponent
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
          )}
          {level >= MAX_NESTED_LEVEL && comment._count?.replies > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowDeepNested(true)}
                className="text-sm text-primary hover:underline flex items-center"
              >
                <CornerDownRight size={14} className="mr-1" />
                Continue this thread
              </button>
            </div>
          )}
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

const DeepNestedComments: React.FC<CommentProps> = (props) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card text-card-foreground rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Continued Thread</h2>
          <button
            onClick={props.onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>
        <CommentComponent {...props} level={0} />
      </div>
    </div>
  );
};

export default DeepNestedComments;
