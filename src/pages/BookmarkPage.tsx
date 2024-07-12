import { useInView } from "react-intersection-observer";
import { VideoCard } from "../components/VideoCard";
import { useBookmarks } from "../hooks/useBookmarks";
import { useEffect } from "react";
import VideoSkeleton from "../skeleton/VideoSkeleton";

const BookmarkPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBookmarks(1, 8);
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

  const bookmarks = data?.pages.flatMap((page) => page.bookmarks) || [];

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <h2 className="text-2xl">Bookmarks</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
        {bookmarks.map((bookmarks) => (
          <VideoCard key={bookmarks.id} video={bookmarks.video} />
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

export default BookmarkPage;
