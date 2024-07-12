import React, { useEffect } from "react";
import { useChannelVideos } from "../../hooks/useChannelVideos";
import { useInView } from "react-intersection-observer";
import { VideoCard } from "../VideoCard";
import VideoSkeleton from "../../skeleton/VideoSkeleton";

const ChannelVideoTab: React.FC<{ channelId: number }> = ({ channelId }) => {
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">(
    "newest"
  );
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChannelVideos(channelId, 1, 10, sortOrder);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="px-4">
        <VideoSkeleton grid="3" />
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching videos.</div>;
  }

  const videos = data?.pages.flatMap((page) => page.videos) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-2xl">Videos</h2>
        <select
          className="bg-card p-2 rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
        >
          <option value="newest">Sort by Newest</option>
          <option value="oldest">Sort by Oldest</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {videos.map((video) => (
          <div key={video.id}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className="px-4">
          {isFetchingNextPage && <VideoSkeleton grid="3" />}
        </div>
      )}
    </div>
  );
};

export default ChannelVideoTab;
