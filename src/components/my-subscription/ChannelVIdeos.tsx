import { Fragment, useEffect } from "react";
import { InView } from "react-intersection-observer";
import { useChannelVideos } from "../../hooks/useChannelVideos";
import { GetChannelVideosResponse, Video } from "../../types/channel";
import { VideoCard } from "../VideoCard";
import { useQueryClient } from "@tanstack/react-query";

interface ChannelVideosProps {
  channelId: number;
  channelName: string;
}

const ChannelVideos: React.FC<ChannelVideosProps> = ({
  channelId,
  channelName,
}) => {
  const queryClient = useQueryClient();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useChannelVideos(channelId, 1, 8, "newest");

  useEffect(() => {
    // Reset and refetch when channelId changes
    queryClient.resetQueries({ queryKey: ["channelVideos", channelId] });
    refetch();
  }, [channelId, queryClient, refetch]);

//   if (isLoading) {
//     return (
//       <div className="px-3">
//         <VideoSkeleton grid="3" />
//       </div>
//     );
//   }
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4 hidden md:block">{channelName}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.pages.map((page: GetChannelVideosResponse, i: number) => (
          <Fragment key={i}>
            {page.videos.map((video: Video) => (
              <VideoCard
                key={video.id}
                video={video}
                showDeleteOption={false}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <InView onChange={(inView) => inView && hasNextPage && fetchNextPage()}>
        {isFetchingNextPage || isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted aspect-video rounded-lg mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}
      </InView>
    </div>
  );
};

export default ChannelVideos;
