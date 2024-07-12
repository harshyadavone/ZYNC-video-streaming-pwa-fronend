import React, { useState, useEffect, memo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSearchVideos } from "../hooks/useSearchVideos";
import { useInView } from "react-intersection-observer";
import { timeAgo } from "../lib/formatters";
import { UserIcon } from "./ui/Icons";
import LazyImage from "./LazyImage";

type channelTypes = {
  id: number;
  name: string;
  description: string;
  slug: string;
  bannerImage: string;
  channelProfileImage: string;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
};

interface VideoTypeResult {
  id: number;
  title: string;
  videoUrl: string;
  description: string;
  thumbnail: string;
  duration: number;
  privacy: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  dislikes: number;
  commentsCount: number;
  category: string;
  tags: string[];
  channelId: number;
  ownerId: number;
  channel: channelTypes;
}

const SearchResults: React.FC = memo(() => {
  const { query } = useParams<{ query: string }>();
  const [category] = useState<string>("");
  const [sort, setSort] = useState<string>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchVideos(query || "", category, sort, order, 1, 10);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-destructive">
        Error: {error?.message}
      </div>
    );
  }

  const videos: VideoTypeResult[] =
    data?.pages.flatMap((page: any) => page.videos) || [];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const VideoCard: React.FC<{ video: VideoTypeResult }> = ({ video }) => {
    return (
      <div key={video.id} className="flex flex-col sm:flex-row">
        <Link to={`/video/${video.id}`} className="relative flex-shrink-0">
          {/* <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full sm:w-64 h-auto sm:h-36 object-cover rounded-md"
          /> */}
          <LazyImage
            src={video.thumbnail}
            alt={video.title}
            className="w-full sm:w-64 h-auto sm:h-36 object-cover rounded-md"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white rounded-sm px-1 py-0.5 text-xs flex items-center">
            {formatDuration(video.duration)}
          </div>
        </Link>
        <div className="mt-2 sm:mt-0 sm:ml-4">
          <Link to={`/video/${video.id}`}>
            <h2 className="text-lg font-semibold text-foreground line-clamp-2">
              {video.title}
            </h2>
          </Link>
          <div className="text-sm text-muted-foreground">
            {video.views.toLocaleString()} views • {timeAgo(video.createdAt)}
          </div>
          <Link
            to={`/channel/${video.channel.slug}`}
            className="text-sm text-muted-foreground"
          >
            <div className="flex items-center mt-2 gap-2 ">
              {video.channel.channelProfileImage ? (
                <img
                  src={video.channel.channelProfileImage}
                  alt={video.channel.name}
                  className="w-6 h-6 rounded-full object-fill"
                />
              ) : (
                <div className="bg-card p-1 rounded-full">
                  <UserIcon className="h-6 w-6" />
                </div>
              )}
              <p className="  py-1 hover:text-white duration-300">
                {" "}
                {video.channel.name}
              </p>
            </div>
          </Link>
          <div className="mt-2 line-clamp-1">
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block text-emerald-500 bg-card rounded-full px-2 py-1 text-xs mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        Search Results for "{query}"
      </h1>
      <div className="flex items-center mb-6">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="mr-4 px-4 py-2 bg-card rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="createdAt">Sort by Date</option>
          <option value="views">Sort by Views</option>
          <option value="likes">Sort by Likes</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
          className="px-4 py-2 rounded-md border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
      <div className="mb-6 text-muted-foreground">
        {videos.length} results found
      </div>
      <div className="grid grid-cols-1 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      {hasNextPage && (
        <div ref={ref} className="text-center py-4">
          {isFetchingNextPage ? (
            <span className="text-muted-foreground">Loading more...</span>
          ) : (
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200">
              Load more
            </button>
          )}
        </div>
      )}
      {!hasNextPage && videos.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No more results
        </div>
      )}
    </div>
  );
});

export default SearchResults;
