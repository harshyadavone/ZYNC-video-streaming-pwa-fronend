import { Link, useParams } from "react-router-dom";
import { useRelatedVideos } from "../../hooks/useVideos";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import Loader from "../Loader";
import { formatViews, timeAgo } from "../../lib/formatters";
import LazyImage from "../LazyImage";
import RelatedVideoSkeleton from "../../skeleton/RelatedVideoSkeleton";

const RelatedVideos: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRelatedVideos(videoId as string);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div>
        <RelatedVideoSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive">{(error as Error).message}</div>;
  }

  const relatedVideos = data?.pages.flatMap((page) => page.videos) || [];

  const isNewVideo = (createdAt: string) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(createdAt) > sevenDaysAgo;
  };

  return (
    // max-h-screen optionally
    <div className="space-y-4 max-h-[calc(100vh-150px)]">
      <div className="space-y-2">
        {relatedVideos.map((video) => (
          <Link key={video.id} to={`/video/${video.id}`} className="block">
            <div className="flex space-x-3  p-2 rounded-md transition-all duration-300 hover:bg-secondary/10">
              <div className="w-40 h-24 bg-secondary rounded-md overflow-hidden relative">
                {/* <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                /> */}
                <LazyImage
                  alt={video.title}
                  src={video.thumbnail}
                  className="w-full h-full  object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors duration-200">
                  {video.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {video.channel.name}
                </p>
                <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    {formatViews(video.views)} views
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    {timeAgo(video.createdAt)}
                  </span>
                </div>
                {isNewVideo(video.createdAt) && (
                  <span className="bg-card text-white px-1.5 py-0.5 rounded-md text-xs font-thin mt-1 inline-block">
                    New
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className="flex justify-center mt-4">
          {isFetchingNextPage ? <Loader /> : ""}
        </div>
      )}
    </div>
  );
};

export default RelatedVideos;
