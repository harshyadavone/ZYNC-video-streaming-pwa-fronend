import React, { useState } from "react";
import Modal from "../Modal";
import { toast } from "sonner";
// import { useCreatePlaylist } from "../../hooks/playlistsHooks";
import { Globe, Lock } from "lucide-react";

interface CreatePrivatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (playlistData: { name: string; description: string }) => void;
  isUpdating?: boolean;
  isChannelPlaylist?: boolean;
}

const CreatePrivatePlaylistModal: React.FC<CreatePrivatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isUpdating,
  isChannelPlaylist,
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");

  //   const createPlaylistMutation = useCreatePlaylist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUpdating && !playlistName.trim()) {
      toast.error("Please enter a playlist name.");
      return;
    }
    try {
      await onSubmit({ name: playlistName, description });
      setPlaylistName("");
      setDescription("");
      onClose();
    } catch (error) {
      toast.error("Failed to create playlist.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Playlist">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            id="playlistName"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Enter playlist name"
            className="flex-grow py-2.5 w-full border focus:border-gray-800 pl-3 focus:border-l-green-600 p-2 bg-inherit rounded-xl text-secondary-foreground resize-none focus:outline-none text-sm transition-colors duration-300"
            required={!isUpdating}
          />
        </div>
        <div>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="flex-grow py-2.5 w-full border focus:border-gray-800 pl-3 focus:border-l-green-600 p-2 bg-inherit rounded-xl text-secondary-foreground resize-none focus:outline-none text-sm transition-colors duration-300"
          />
        </div>
        {isChannelPlaylist ? (
          <div className="flex items-center text-sm text-gray-400">
            <Globe className="mr-2 h-4 w-4" />
            <span>Public</span>
          </div>
        ) : (
          <div className="flex items-center text-sm text-gray-400">
            <Lock className="mr-2 h-4 w-4" />
            <span>Private</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="max-w-[250px] bg-primary/70 rounded-lg text-white/90 font-medium p-2 px-8 hover:bg-primary/80 transition-colors duration-300"
          >
            Create Playlist
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePrivatePlaylistModal;
