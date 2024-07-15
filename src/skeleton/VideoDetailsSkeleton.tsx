const VideoDetailsSkeleton = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-6 pb-20 md:pb-6 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          {/* Video Player Skeleton */}
          <div className="aspect-video w-full bg-card rounded-lg"></div>

          {/* Title and Channel Info Skeleton */}
          <div className="bg-card/40 p-3 rounded-lg mt-4">
            <div className="h-8 bg-card rounded w-3/4 mb-4"></div>
            <div className="border-b border-solid my-4" />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-card rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-card rounded w-32"></div>
                  <div className="h-4 bg-card rounded w-24"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-20 h-8 bg-card rounded-full "></div>
                <div className="w-20 h-8 bg-card rounded-full hidden md:block"></div>
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-grow sm:flex-grow-0 h-10 bg-card rounded-full"
              ></div>
            ))}
          </div>

          {/* Video Description Skeleton */}
          <div className="mt-4 space-y-2 bg-card/40 p-3 rounded-lg">
            <div className="h-4 bg-card rounded w-1/4"></div>
            <div className="h-4 bg-card rounded w-full"></div>
            <div className="h-4 bg-card rounded w-full"></div>
            <div className="h-4 bg-card rounded w-3/4"></div>
          </div>

          {/* Comments Section Skeleton */}
          <div className="mt-6 space-y-4 bg-card/40 p-3 rounded-lg">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-10 h-10 bg-card rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-card rounded w-1/4"></div>
                  <div className="h-4 bg-card rounded w-full"></div>
                  <div className="h-4 bg-card rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Videos Skeleton */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="h-10 bg-card rounded-lg"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex space-x-2">
              <div className="w-40 h-24 bg-card rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-card rounded w-3/4"></div>
                <div className="h-4 bg-card rounded w-1/2"></div>
                <div className="h-4 bg-card rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoDetailsSkeleton;
