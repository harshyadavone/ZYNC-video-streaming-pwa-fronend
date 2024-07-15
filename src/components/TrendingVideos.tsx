import React from "react";
import useTrendingVideos from "../hooks/useVideos";
import { VideoCard } from "./VideoCard";
import VideoSkeleton from "../skeleton/VideoSkeleton";

const TrendingVideos: React.FC = () => {
  const { video, isLoading, isError }: any = useTrendingVideos();

  if (isLoading) {
    return (
      <div className="w-full px-4">
        <VideoSkeleton grid="4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 font-medium tracking-wide mt-2">
        Error fetching trending videos
      </div>
    );
  }

  if (!video || !video.videos) {
    return (
      <div className="text-red-600 font-medium tracking-wide mt-2">
        No videos available
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full mt-2 text-foreground bg-background smooth-scroll">
      <div className="w-full max-w-full"></div>
      <div className="w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {video.videos.map((video: any) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingVideos;