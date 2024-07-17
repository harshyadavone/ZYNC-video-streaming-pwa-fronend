import { useRef, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import API from "../config/apiClient";

const MIN_VIEW_DURATION = 30; // 30 seconds

const logVideoView = async (videoId: number): Promise<void> => {
  await API.post(`/video/videos/${videoId}/log-view`);
};

const useVideoView = (videoId: number) => {
  const startTimeRef = useRef<number>(Date.now());
  const viewLoggedRef = useRef<boolean>(false);
  const initialTimeSetRef = useRef<boolean>(false);

  const logViewMutation = useMutation({
    mutationFn: logVideoView,
    onSuccess: () => {
      // console.log("View logged successfully");
    },
    onError: (error) => {
      console.error("Error logging view:", error);
    },
  });

  const handleVideoView = useCallback(() => {
    const now = Date.now();
    const timePassed = (now - startTimeRef.current) / 1000;
    if (!viewLoggedRef.current && timePassed > MIN_VIEW_DURATION) {
      logViewMutation.mutate(videoId);
      viewLoggedRef.current = true;
    }
  }, [videoId, logViewMutation]);

  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      if (!initialTimeSetRef.current) {
        startTimeRef.current = Date.now() - currentTime * 1000;
        initialTimeSetRef.current = true;
      }
      handleVideoView();
    },
    [handleVideoView]
  );

  useEffect(() => {
    return () => {
      console.log("useVideoView hook cleanup for videoId:", videoId);
    };
  }, [videoId]);

  return {
    handleTimeUpdate,
    isViewLoading: logViewMutation.isPending,
    viewError: logViewMutation.error,
  };
};

export default useVideoView;
