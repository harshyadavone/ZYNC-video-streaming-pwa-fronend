import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play, MoreVertical, Trash2 } from "lucide-react";
import { formatDuration, formatViews, timeAgo } from "../lib/formatters";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { UserIcon } from "./ui/Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { motion } from "framer-motion";
import LazyImage from "./LazyImage";
import { Video } from "../types/history";
import ChannelLink from "./channel/CannelLink";

export const VideoCard: React.FC<{
  video: Video;
  watchHistoryId?: number;
  onDelete?: (id: number) => void;
  showDeleteOption?: boolean;
}> = ({ video, watchHistoryId, onDelete, showDeleteOption = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isNewVideo = (createdAt: string) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(createdAt) > sevenDaysAgo;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    if (onDelete && watchHistoryId) {
      onDelete(watchHistoryId);
    }
  };

  return (
    <div className="flex flex-col relative" key={video.id}>
      <Link to={`/video/${video.id}`} className="block">
        <div
          className="relative aspect-video rounded-xl overflow-hidden mb-3 cursor-pointer "
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <LazyImage
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-auto"
          />
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <Play className="text-white w-12 h-12" fill="white" />
            </motion.div>
          )}
          <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        <div className="flex">
          <Avatar className="h-9 w-9 items-center justify-center mr-3 rounded-full bg-card">
            <AvatarImage src={video.channel.channelProfileImage} />
            <AvatarFallback>
              <UserIcon className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h3 className="text-base font-medium line-clamp-1 mb-1">
              {video.title}
            </h3>
            <ChannelLink
              channelName={video.channel.name}
              channelId={video.channel.id}
            />
            <div className="text-sm flex-col text-muted-foreground flex gap-1">
              <div>
                <span>{formatViews(video.views)} views</span>
                <span className="mx-1">•</span>
                <span>{timeAgo(video.createdAt)}</span>
              </div>
              <div>
                {isNewVideo(video.createdAt) && (
                  <span className="bg-card text-white text-xs px-1.5 py-1 rounded-md shadow-xl tracking-wider font-medium">
                    New
                  </span>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {showDeleteOption && (
                <button
                  className="self-start p-1 rounded-full hover:bg-muted"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem>Add to playlist</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Save</DropdownMenuItem> */}
              {showDeleteOption && (
                <DropdownMenuItem
                  className="bg-red-500/5 text-red-500 gap-2"
                  onClick={handleDelete}
                >
                  Delete History <Trash2 className="h-4 w-4" />
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>
    </div>
  );
};
