import React, { useState, useEffect, memo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSearchVideos } from "../hooks/useSearchVideos";
import { useInView } from "react-intersection-observer";
import { timeAgo } from "../lib/formatters";
import {
  UserIcon,
  ChevronDownIcon,
  FilterIcon,
  SortAscIcon,
  SortDescIcon,
} from "./ui/Icons";
import LazyImage from "./LazyImage";
import { VideoTypeResult, ChannelTypes } from "../types/searchResult";

const SearchResults: React.FC = memo(() => {
  const { query } = useParams<{ query: string }>();
  const [sort, setSort] = useState<string>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchVideos(query || "", "", sort, order, 1, 10);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    setIsFilterOpen(false);
  }, []);

  const handleOrderChange = useCallback(() => {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} />;

  const videos: VideoTypeResult[] =
    data?.pages.flatMap((page: any) => page.videos) || [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        Search Results for "{query}"
      </h1>
      <FilterSortControls
        sort={sort}
        order={order}
        isFilterOpen={isFilterOpen}
        onSortChange={handleSortChange}
        onOrderChange={handleOrderChange}
        toggleFilter={toggleFilter}
      />
      <div className="mb-6 text-muted-foreground">
        {videos.length} results found
      </div>
      <div className="grid grid-cols-1 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      <LoadMoreButton
        ref={ref}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
      {!hasNextPage && videos.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No more results
        </div>
      )}
    </div>
  );
});

const LoadingState: React.FC = () => (
  <div className="text-center py-8 text-muted-foreground">Loading...</div>
);

const ErrorState: React.FC<{ error: Error | null }> = ({ error }) => (
  <div className="text-center py-8 text-destructive">
    Error: {error?.message}
  </div>
);

const FilterSortControls: React.FC<{
  sort: string;
  order: "asc" | "desc";
  isFilterOpen: boolean;
  onSortChange: (newSort: string) => void;
  onOrderChange: () => void;
  toggleFilter: () => void;
}> = ({
  sort,
  order,
  isFilterOpen,
  onSortChange,
  onOrderChange,
  toggleFilter,
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between">
      <button
        onClick={toggleFilter}
        className="flex items-center space-x-2 bg-card hover:bg-card/80 text-foreground px-4 py-2 rounded-md transition-colors duration-200"
      >
        <FilterIcon className="w-5 h-5" />
        <span>Filter</span>
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform duration-200 ${
            isFilterOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <button
        onClick={onOrderChange}
        className="flex items-center space-x-2 bg-card hover:bg-card/80 text-foreground px-4 py-2 rounded-md transition-colors duration-200"
      >
        {order === "asc" ? (
          <SortAscIcon className="w-5 h-5" />
        ) : (
          <SortDescIcon className="w-5 h-5" />
        )}
        <span>{order === "asc" ? "Ascending" : "Descending"}</span>
      </button>
    </div>
    {isFilterOpen && (
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {["createdAt", "views", "likes"].map((option) => (
          <button
            key={option}
            onClick={() => onSortChange(option)}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              sort === option
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-card/80 text-foreground"
            }`}
          >
            {option === "createdAt"
              ? "Date"
              : option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    )}
  </div>
);

type LoadMoreButtonProps = {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
};

const LoadMoreButton = React.forwardRef<HTMLDivElement, LoadMoreButtonProps>(
  ({ hasNextPage, isFetchingNextPage }, ref) => {
    if (!hasNextPage) return null;
    return (
      <div ref={ref} className="text-center py-4">
        {isFetchingNextPage && (
          <span className="text-muted-foreground">Loading more...</span>
        )}
      </div>
    );
  }
);

const VideoCard: React.FC<{ video: VideoTypeResult }> = memo(({ video }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Link to={`/video/${video.id}`} className="relative flex-shrink-0">
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
          <h2 className="text-lg font-medium text-foreground line-clamp-2">
            {video.title}
          </h2>
        </Link>
        <div className="text-sm text-muted-foreground">
          {video.views.toLocaleString()} views • {timeAgo(video.createdAt)}
        </div>
        <ChannelLink channel={video.channel} />
        <TagList tags={video.tags} />
      </div>
    </div>
  );
});

const ChannelLink: React.FC<{ channel: ChannelTypes }> = ({ channel }) => (
  <Link
    to={`/channel/${channel.id}`}
    className="text-sm text-muted-foreground"
  >
    <div className="flex items-center mt-2 gap-2 ">
      {channel.channelProfileImage ? (
        <img
          src={channel.channelProfileImage}
          alt={channel.name}
          className="w-6 h-6 rounded-full object-fill"
        />
      ) : (
        <div className="bg-card p-1 rounded-full">
          <UserIcon className="h-6 w-6" />
        </div>
      )}
      <p className="py-1 hover:text-white duration-300">{channel.name}</p>
    </div>
  </Link>
);

const TagList: React.FC<{ tags: string[] }> = ({ tags }) => (
  <div className="mt-2 line-clamp-1">
    {tags.map((tag) => (
      <span
        key={tag}
        className="inline-block text-emerald-500 bg-card rounded-full px-2 py-1 text-xs mr-2 mb-2"
      >
        #{tag}
      </span>
    ))}
  </div>
);

export default SearchResults;
