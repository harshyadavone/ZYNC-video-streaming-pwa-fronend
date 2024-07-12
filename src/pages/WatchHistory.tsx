import { useEffect, useState } from "react";
import { VideoCard } from "../components/VideoCard";
import { useWatchHistory } from "../hooks/watch-history/useWatchHistory";
import { useInView } from "react-intersection-observer";
import VideoSkeleton from "../skeleton/VideoSkeleton";
import { Trash2 } from "lucide-react";
import API from "../config/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../components/Modal";
import { toast } from "sonner";

const WatchHistory = () => {
  const [deleteAllWatchHistoryOpen, setDeleteAllWatchHistoryOpen] =
    useState<boolean>(false);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWatchHistory(1, 10);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const DeleteWatchHistory = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (watchHistoryId: number) =>
        API.delete(`/history/watchHistory/${watchHistoryId}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["watchHistory"] });
      },
    });
  };

  const { mutateAsync: deleteHistoryMutation } = DeleteWatchHistory();

  const handleDeleteWatchHistory = (watchHistoryId: number) => {
    deleteHistoryMutation(watchHistoryId);
    toast.success("Video deleted from your history");
  };

  const DeleteAllWatchHistory = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: () => API.delete(`/history/watchHistory`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["watchHistory"] });
      },
    });
  };

  const { mutate: deleteAllHistoryMutation } = DeleteAllWatchHistory();
  const handleDeleteAllWatchHistory = () => {
    setDeleteAllWatchHistoryOpen(true);
  };

  const confirmDelete = () => {
    deleteAllHistoryMutation();
    setDeleteAllWatchHistoryOpen(false);
    toast.success("All of your watch history deleted");
  };
  if (isLoading) {
    return (
      <div className="px-4">
        <VideoSkeleton grid="4" />
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching videos.</div>;
  }

  const watchHistory = data?.pages.flatMap((page) => page.watchHistory) || [];
  // console.log(watchHistory.map(video=>  console.log(video.video)))

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <h2 className="text-2xl">History</h2>
        <button
          className="flex  items-center justify-center text-red-600 gap-2 hover:bg-muted/70 bg-card/70 px-3 py-1.5 rounded-lg transition-colors duration-300"
          onClick={handleDeleteAllWatchHistory}
        >
          {" "}
          <span>Delete History</span> <Trash2 className="h-4 w-4 " />
        </button>
        <Modal
          isOpen={deleteAllWatchHistoryOpen}
          onClose={() => setDeleteAllWatchHistoryOpen(false)}
          title="Delete All of Your WatchHistory"
        >
          <p className="mb-4">Are you sure you want to delete this comment?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setDeleteAllWatchHistoryOpen(false)}
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
        {watchHistory.map((watchHistory) => (
          <VideoCard
            key={watchHistory.id}
            video={watchHistory.video}
            watchHistoryId={watchHistory.id}
            onDelete={handleDeleteWatchHistory}
            showDeleteOption={true}
          />
        ))}
      </div>
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className="">
          {isFetchingNextPage && <VideoSkeleton grid="4" />}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
