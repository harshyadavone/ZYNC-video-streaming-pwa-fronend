import React, { useState, useCallback } from "react";
import Modal from "../Modal";
import { toast } from "sonner";
import {
  useRemoveVideoFromPlaylist,
  useIsVideoInPlaylist,
  useChannelPlaylists,
  useAddVideoToChannelPlaylist,
} from "../../hooks/playlistsHooks";
import CreatePlaylistModal from "../createPlaylist";
import { Button } from "../ui/button";
import { FolderAddIcon, TaskAdd02Icon } from "../ui/Icons";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Playlists } from "../../types/playlits";

interface ChannelPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  videoId: number;
}


const ChannelPlaylistModal: React.FC<ChannelPlaylistModalProps> = ({
  isOpen,
  onClose,
  channelId,
  videoId,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    data,
    isLoading: isPlaylistLoading,
    error,
  } = useChannelPlaylists(channelId, 1, 10);

  const playlistsData = data?.pages.flatMap((page) => page.playlists) || [];




  const addVideoToChannelPlaylistMutation = useAddVideoToChannelPlaylist();
  const removeVideoFromPlaylistMutation = useRemoveVideoFromPlaylist();

  const handleTogglePlaylist = useCallback(async (
    playlistId: number,
    isInPlaylist: boolean
  ) => {
    try {
      if (isInPlaylist) {
        await removeVideoFromPlaylistMutation.mutateAsync({
          playlistId,
          videoId,
        });
        toast.success("Video removed from playlist successfully!");
      } else {
        await addVideoToChannelPlaylistMutation.mutateAsync({ playlistId, videoId , channelId });
        toast.success("Video added to playlist successfully!");
      }
    } catch (error) {
      toast.error("Failed to update playlist.");
    }
  }, [addVideoToChannelPlaylistMutation, removeVideoFromPlaylistMutation, videoId]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save to...">
      {error && <p>Error loading playlists. Please try again.</p>}
      {isPlaylistLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <PlaylistItemSkeleton key={index} />
          ))}
        </div>
      ) : playlistsData && playlistsData?.length === 0 ? (
        <EmptyPlaylistMessage onCreateNew={() => setIsCreateModalOpen(true)} />
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {playlistsData?.map((playlist) => (
            <PlaylistItem
              key={playlist.id}
    
              playlist={playlist}
              videoId={videoId}
              onToggle={handleTogglePlaylist}
            />
          ))}
        </ul>
      )}

      <CreatePlaylistButton
        onClick={() => setIsCreateModalOpen(true)}
        disabled={playlistsData?.length >= 10}
      />

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        videoId={videoId}
      />
    </Modal>
  );
};


const PlaylistItemSkeleton: React.FC = () => (
  <li className="flex justify-between items-center mt-2 p-2 bg-muted/30 rounded-lg">
    <div className="w-full max-w-3/4 flex flex-col gap-2">
      <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
    </div>
    <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
  </li>
);

const EmptyPlaylistMessage: React.FC<{ onCreateNew: () => void }> = ({ onCreateNew }) => (
  <div className="flex flex-col md:flex-row items-center justify-center gap-2">
    <p>You don't have any playlists yet.</p>
    <button
      onClick={onCreateNew}
      className="text-primary hover:underline"
    >
      Create New
    </button>
  </div>
);




const CreatePlaylistButton: React.FC<{ onClick: () => void, disabled: boolean }> = React.memo(({ onClick, disabled }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="w-full flex items-center justify-center px-4 py-2 gap-3 mt-4 border"
          variant="ghost"
          onClick={onClick}
          disabled={disabled}
        >
          Create New Playlist
          <TaskAdd02Icon />
        </Button>
      </TooltipTrigger>
      {disabled && (
        <TooltipContent>
          <p>You can only create up to 10 playlists</p>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
));

interface PlaylistItemProps {
  playlist: Playlists;
  videoId: number;
  onToggle: (playlistId: number, isInPlaylist: boolean) => Promise<void>;
}

const PlaylistItem: React.FC<PlaylistItemProps> = React.memo(({
  playlist,
  videoId,
  onToggle,
}) => {
  const { data: isInPlaylist, isLoading } = useIsVideoInPlaylist(
    playlist.id,
    videoId
  );

  const handleClick = () => {
    if (!isLoading) {
      onToggle(playlist.id, isInPlaylist || false);
    }
  };

  return (
    <motion.li
      className={`flex justify-between items-center p-3 bg-muted/40 hover:bg-muted/80 transition-colors duration-200  rounded-lg cursor-pointer ${
        isInPlaylist ? "text-primary" : ""
      }`}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      <span className="truncate">{playlist.name}</span>
      <FolderAddIcon className={isInPlaylist ? "text-primary" : ""} />
    </motion.li>
  );
});

export default ChannelPlaylistModal;

