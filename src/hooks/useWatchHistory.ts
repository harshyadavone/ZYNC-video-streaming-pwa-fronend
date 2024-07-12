import { useMutation } from "@tanstack/react-query";
import { createOrUpdateWatchHistory } from "../lib/api";

export interface WatchHistoryResponse {
  // Define the structure of your response here
  id: number;
  userId: number;
  videoId: number;
  progress: number;
  // Add any other fields that are returned
}

export const useWatchHistory = (videoId: number) => {

  return useMutation({
    mutationFn: (progress: number) =>
      createOrUpdateWatchHistory(videoId, progress),

    onSuccess: () => {
      // Optionally invalidate and refetch
      //   queryClient.invalidateQueries("watchHistory");
    //   console.log("success");
    },
  });
};
