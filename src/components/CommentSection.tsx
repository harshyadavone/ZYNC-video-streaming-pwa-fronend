import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useDragControls,
  PanInfo,
} from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../config/apiClient";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import Loader2 from "./Loader2";
import { useInView } from "react-intersection-observer";
import {
  COMMENTS_QUERY_KEY,
  useChannelComments,
} from "../hooks/getChannelComments";
import { CommentSkeletonList } from "../skeleton/CommentSkeleton";

interface CommentSectionProps {
  videoId: number;
  Owner: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ videoId, Owner }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const queryClient = useQueryClient();
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useChannelComments(videoId);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const addCommentMutation = useMutation({
    mutationFn: (content: string) =>
      API.post(`/comment/videos/${videoId}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COMMENTS_QUERY_KEY, videoId],
      });
    },
  });

  const addReplyMutation = useMutation({
    mutationFn: ({
      content,
      parentId,
      replyToUsername,
    }: {
      content: string;
      parentId: number;
      replyToUsername: string;
    }) =>
      API.post(
        `/comment/videos/${videoId}/comments`, // Remove any leading spaces here
        {
          content,
          parentId,
          replyToUsername,
        }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [COMMENTS_QUERY_KEY, videoId],
      });
      queryClient.invalidateQueries({
        queryKey: ["replies", variables.parentId],
      });
    },
  });

  const toggleComments = () => {
    setIsCommentsOpen(!isCommentsOpen);
    setIsFullScreen(false);
  };

  const handleDragEnd = (
    // @ts-ignore
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 50) {
      setIsCommentsOpen(false);
      setIsFullScreen(false);
    } else if (info.offset.y < -50) {
      setIsFullScreen(true);
    }
  };

  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden mt-4 bg-card text-card-foreground rounded-lg p-4">
        <button
          onClick={toggleComments}
          className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="flex items-center">
            <span className="mr-2">Comments</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div className="flex-1 mx-4 bg-secondary rounded-full h-8 flex items-center px-3">
            <span className="text-muted-foreground">Add a comment...</span>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            onClick={toggleComments}
            ref={constraintsRef}
          >
            <motion.div
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.1}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              initial={{ y: "100%" }}
              animate={{
                y: isFullScreen ? 0 : "20%",
                height: isFullScreen ? "100%" : "80%",
              }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 350 }}
              className="absolute bottom-0 left-0 right-0 bg-card text-card-foreground rounded-t-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-2"
                onPointerDown={(e) => dragControls.start(e)}
              />
              <div className="flex justify-between items-center px-4 py-2">
                <h2 className="text-lg font-medium">Comments</h2>
                <button
                  onClick={toggleComments}
                  className="text-muted-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto h-full pb-20 overflow-y-auto-design1">
                <div className="px-4 pt-4">
                  <CommentForm
                    onSubmit={(content) => addCommentMutation.mutate(content)}
                  />
                  {isLoading && (
                    <div className="text-muted-foreground">
                       <CommentSkeletonList />
                    </div>
                  )}
                  {isError && (
                    <div className="text-destructive">
                      Error loading comments
                    </div>
                  )}
                  {data?.pages.map((page, i) => (
                    <React.Fragment key={i}>
                      <CommentList
                        comments={page.comments}
                        videoId={videoId}
                        onReply={(content, parentId, replyToUsername) =>
                          addReplyMutation.mutate({
                            content,
                            parentId,
                            replyToUsername,
                          })
                        }
                      />
                    </React.Fragment>
                  ))}
                  {(hasNextPage || isFetchingNextPage) && (
                    <div ref={ref} className="flex justify-center mt-8">
                      {isFetchingNextPage ? <Loader2 /> : ""}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop view */}
      <div className="hidden bg-card/40 md:block mt-8 text-card-foreground rounded-lg p-6">
        <h2 className="text-xl font-medium ml-3 mb-2 text-foreground">
          Comments
        </h2>
        <CommentForm
          onSubmit={(content) => addCommentMutation.mutate(content)}
        />
        {isLoading && (
          <div className="text-muted-foreground">  <CommentSkeletonList /></div>
        )}
        {isError && (
          <div className="text-destructive">Error loading comments</div>
        )}
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            <CommentList
              comments={page.comments}
              videoId={videoId}
              owner={Owner}
              onReply={(content, parentId, replyToUsername) =>
                addReplyMutation.mutate({ content, parentId, replyToUsername })
              }
            />
          </React.Fragment>
        ))}
        {(hasNextPage || isFetchingNextPage) && (
          <div ref={ref} className="flex justify-center mt-8">
            {isFetchingNextPage ? <Loader2 /> : ""}
          </div>
        )}
      </div>
    </>
  );
};

export default CommentSection;
