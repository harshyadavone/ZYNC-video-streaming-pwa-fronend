import React, { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import { toast } from "sonner";
import {
  useAddVideoToPlaylist,
  useCreatePlaylist,
  useUpdatePlaylist,
} from "../hooks/playlistsHooks";
import { ChevronDown, Lock, Globe, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId?: number;
  playlistToUpdate?: {
    id: number;
    name: string;
    description: string;
    privacy: "PUBLIC" | "PRIVATE" | "UNLISTED";
  };
}

const privacyOptions = [
  { value: "PRIVATE", label: "Private", icon: Lock },
  { value: "PUBLIC", label: "Public", icon: Globe },
  { value: "UNLISTED", label: "Unlisted", icon: Eye },
];

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  videoId,
  playlistToUpdate,
}) => {
  const [playlistName, setPlaylistName] = useState(
    playlistToUpdate?.name || ""
  );
  const [description, setDescription] = useState(
    playlistToUpdate?.description || ""
  );
  const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE" | "UNLISTED">(
    playlistToUpdate?.privacy || "PRIVATE"
  );
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const createPlaylistMutation = useCreatePlaylist();
  const updatePlaylistMutation = useUpdatePlaylist(playlistToUpdate?.id ?? 0);
  const addVideoToPlaylistMutation = useAddVideoToPlaylist();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) {
      toast.error("Please enter a playlist name.");
      return;
    }
    try {
      if (playlistToUpdate) {
        // Update existing playlist
        await updatePlaylistMutation.mutateAsync({
          id: playlistToUpdate.id,
          name: playlistName,
          description,
          privacy,
        });
        toast.success("Playlist updated successfully");
      } else {
        // Create new playlist
        const newPlaylist = await createPlaylistMutation.mutateAsync({
          name: playlistName,
          description,
          privacy,
        });

        if (videoId) {
          await addVideoToPlaylistMutation.mutateAsync({
            playlistId: newPlaylist.id,
            videoId,
          });
          toast.success("Playlist created and video added to playlist");
        } else {
          toast.success("Playlist created successfully");
        }
      }
      onClose();
    } catch (error) {
      toast.error(
        playlistToUpdate
          ? "Failed to update playlist."
          : "Failed to create playlist or add video."
      );
    }
  };

  const selectedOption = privacyOptions.find(
    (option) => option.value === privacy
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={playlistToUpdate ? "Update Playlist" : "Create New Playlist"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            id="playlistName"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Enter playlist name"
            className="flex-grow py-2.5 w-full border focus:border-gray-800 pl-3 focus:border-l-green-600 p-2 bg-inherit rounded-xl text-secondary-foreground resize-none focus:outline-none text-sm transition-colors duration-300"
            required
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

        <div ref={selectRef} className="relative">
          <div
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className="flex-grow py-2.5 w-full border focus:border-gray-800 pl-3 pr-10 focus:border-l-green-600 p-2 bg-inherit rounded-xl text-secondary-foreground focus:outline-none text-sm transition-colors duration-300 cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center">
              {selectedOption && (
                <selectedOption.icon className="mr-2 h-4 w-4" />
              )}
              <span>{selectedOption?.label}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isSelectOpen ? "transform rotate-180" : ""
              }`}
            />
          </div>
          <AnimatePresence>
            {isSelectOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full bottom-full mb-1 bg-card border rounded-md shadow-lg max-h-40 overflow-y-auto "
              >
                {privacyOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setPrivacy(
                        option.value as "PUBLIC" | "PRIVATE" | "UNLISTED"
                      );
                      setIsSelectOpen(false);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-muted duration-200 transition-transform text-sm flex items-center"
                  >
                    <option.icon className="mr-2 h-4 w-4" />
                    {option.label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex justify-end">
          <button
            disabled={
              createPlaylistMutation.isPending ||
              updatePlaylistMutation.isPending
            }
            type="submit"
            className="max-w-[250px] bg-primary/70 rounded-lg text-white/90 font-medium p-2 px-8 hover:bg-primary/80 transition-colors duration-300"
          >
            {playlistToUpdate ? "Update Playlist" : "Create Playlist"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PlaylistModal;
