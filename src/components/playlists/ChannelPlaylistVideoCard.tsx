import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play, MoreVertical, List, Trash2Icon } from "lucide-react";
import { formatDuration, formatViews, timeAgo } from "../../lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { motion } from "framer-motion";
import LazyImage from "../LazyImage";
import { Video } from "../../types/channel";
import Modal from "../Modal";
import { toast } from "sonner";
import { useRemoveVideoFromPlaylist } from "../../hooks/playlistsHooks";

interface ChannelPlaylistVideoCardProps {
  video: Video;
  index: number;
  playlistId: string;
  isOwner: boolean;
}

export const ChannelPlaylistVideoCard: React.FC<
  ChannelPlaylistVideoCardProps
> = ({ video, index, playlistId, isOwner }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const removeVideoFromPlaylistMutation = useRemoveVideoFromPlaylist();

  const handleDelete = () => {
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    removeVideoFromPlaylistMutation.mutate({
      playlistId,
      videoId: video.id,
    });
    setShowDeleteModal(false);
    toast.success("Video Removed");
  };

  return (
    <div className="flex items-start space-x-4 p-2 rounded-lg transition-colors duration-200">
      <div className="flex-shrink-0 text-gray-400 font-medium w-2 md:w-6 text-center pt-2">
        {index + 1}
      </div>
      <div className="flex-shrink-0 w-28 md:w-40">
        <div
          className="relative aspect-video rounded-lg overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <LazyImage
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
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
      </div>
      <div className="flex-grow min-w-0">
        <Link
          to={`/video/${video.id}?playlist=${playlistId}`}
          className="block"
        >
          <h3 className="text-sm md:text-base md:font-medium  line-clamp-2 mb-1 text-white">
            {video.title}
          </h3>
        </Link>
        <p className="text-xs md:text-sm text-muted-foreground hover:text-white duration-300 truncate">
          {video.channel.name}
        </p>
        <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1  md:gap-2 flex-wrap line-clamp-1">
          <span>{formatViews(video.views)} views</span>
          <span>•</span>
          <span>{timeAgo(video.createdAt)}</span>
        </div>
      </div>
      <div className="flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1  rounded-full hover:bg-muted ">
              <MoreVertical className="w-5 h-5 text-gray-400 p-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56  text-white border-solid"
          >
            <DropdownMenuItem className="">
              <List className="mr-2 h-4 w-4" />
              <span>Add to queue</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="">
              <Play className="mr-2 h-4 w-4" />
              <span>Play next</span>
            </DropdownMenuItem>
            {isOwner && (
              <DropdownMenuItem
                className="text-red-600 hover:text-red-800 cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                <span>Remove video</span>
              </DropdownMenuItem>
            )}
            {/* Add more playlist-specific actions here */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove video"
      >
        <p className="mb-4">Are you sure you want to Remove this video?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/80"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};
