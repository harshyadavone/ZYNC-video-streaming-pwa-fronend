const CommentSkeleton = ({ level = 0 }) => (
  <div className="mb-4 animate-pulse">
    <div
      className={`flex items-start ${
        level > 0 ? "border-l-2 border-neutral-800 pl-4" : ""
      }`}
    >
      <div className="w-8 h-8 bg-neutral-800 rounded-full mr-3"></div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <div className="h-4 bg-neutral-800 rounded w-24 mr-2"></div>
          <div className="h-3 bg-neutral-800 rounded w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-neutral-800 rounded w-full"></div>
          <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
        </div>
        <div className="mt-2 flex space-x-2">
          <div className="w-16 h-4 bg-neutral-800 rounded"></div>
          <div className="w-16 h-4 bg-neutral-800 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export const CommentSkeletonList = ({ count = 3, level = 0 }) => (
  <>
    {Array(count)
      .fill(0)
      .map((_, index) => (
        <CommentSkeleton key={index} level={level} />
      ))}
  </>
);
