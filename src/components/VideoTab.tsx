import React, { useEffect } from "react";
import { timeAgo } from "../lib/formatters";
import LazyImage from "./LazyImage";
import { useChannelVideos } from "../hooks/useChannelVideos";
import { useInView } from "react-intersection-observer";
import Loader2 from "./Loader2";

const VideoTab: React.FC<{ channelId: number }> = ({ channelId }) => {
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
  } = useChannelVideos(channelId, 1, 10, sortOrder); // TODO: add sorting and fiiltering

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
    return <div>Loading...</div>;
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
          <div
            key={video.id}
            className="bg-card rounded-lg overflow-hidden shadow"
          >
            <LazyImage
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">
                {timeAgo(video.createdAt)}
              </p>
              <p className="text-muted-foreground text-sm">
                {video.views} views
              </p>
              <p className="text-muted-foreground text-sm">
                {video.likes} likes
              </p>
              <p className="text-muted-foreground text-sm">
                {video.commentsCount} comments
              </p>
               </div>
          </div>
        ))}
      </div>
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className="flex justify-center mt-8">
          {isFetchingNextPage ? <Loader2 /> : ""}
        </div>
      )}
    </div>
  );
};

export default VideoTab;
