import React from "react";
import useTrendingVideos from "../hooks/useVideos";
import { VideoCard } from "./VideoCard";
import VideoSkeleton from "../skeleton/VideoSkeleton";

const TrendingVideos: React.FC = () => {
  const { video, isLoading, isError } : any = useTrendingVideos();

  if (isLoading) {
    return <div className="px-4"><VideoSkeleton grid="3" /></div>;
  }

  if (isError || !video) {
    return <div>Error fetching trending videos</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Trending Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {video.videos.map((video: any) => (
          <VideoCard video={video} />
        ))}
      </div>
    </div>
  );
};

export default TrendingVideos;

