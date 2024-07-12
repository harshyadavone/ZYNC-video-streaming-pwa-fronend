import { useState } from "react";
import { formatViews, timeAgo } from "../../lib/formatters";

type Props = {
  views: number;
  createdAt: string;
  videoTags: string[];
  description: string;
};

const VideoDescription = ({createdAt,description,videoTags,views}: Props) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="mt-4 bg-muted/40 p-4 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between text-sm text-muted-foreground mb-2">
        <span className="mb-2 md:mb-0">{formatViews(views)} views</span>
        <span>{timeAgo(createdAt)}</span>
      </div>
      <div className="mt-2 flex flex-wrap">
        {videoTags.map((tag, index) => (
          <span key={index} className="text-sm text-primary mr-2 mb-2">
            #{tag}
          </span>
        ))}
      </div>
      <p className={`text-sm ${isDescriptionExpanded ? "" : "line-clamp-2"}`}>
        {description}
      </p>
      {description.length > 100 && (
        <button
          className="text-sm text-primary mt-2"
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        >
          {isDescriptionExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default VideoDescription;