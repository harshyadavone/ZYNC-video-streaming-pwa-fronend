import { useVideos } from "../hooks/useVideos";
import { useInView } from "react-intersection-observer";
import { VideoCard } from "../components/VideoCard";
import { useEffect } from "react";
import SuggestionBar from "../components/SuggestionBar";
import VideoSkeleton from "../skeleton/VideoSkeleton";
import { Video } from "../types/channel";

const Home: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVideos();
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="text-center text-2xl mt-8 text-destructive">
        {(error as Error).message}
      </div>
    );
  }

  const allVideos = data?.pages.flatMap((page) => page.videos) || [];

  return (
    <div className="flex flex-col items-center w-full  mt-2 text-foreground bg-background smooth-scroll">
      <div className="w-full max-w-full">
        <SuggestionBar />
      </div>
      <div className="w-full px-4">
        {/* <h1 className="text-2xl font-bold mb-6 pl-4">Recommended</h1> */}
        {allVideos.length === 0 && isLoading ? (
          <div className="w-full">
            <VideoSkeleton grid="4" />
          </div>
        ) : allVideos.length === 0 ? (
          <p className="text-center text-xl text-muted-foreground">
            No videos available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-x-4 gap-y-8">
            {allVideos.map((video) => (
              <VideoCard key={video.id} video={video as Video} />
            ))}
          </div>
        )}
        {(hasNextPage || isFetchingNextPage) && (
          <div ref={ref} className="">
            {isFetchingNextPage ? <VideoSkeleton grid="4" /> : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
