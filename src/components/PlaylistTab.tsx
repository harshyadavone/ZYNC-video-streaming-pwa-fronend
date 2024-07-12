import { Plus } from "lucide-react";
import { useState } from "react";
import CreatePrivatePlaylistModal from "../components/playlists/CreatePrivatePlaylistModal";
import { toast } from "sonner";
import {
  useChannelPlaylists,
  useCreatePlaylist,
} from "../hooks/playlistsHooks";
import { PlaylistCard } from "../pages/PlaylistsPage";
import useAuth from "../hooks/useAuth";

type Props = {
  channelId: string;
  // Update the types of channel (extend ownerID with Channel)
  channel?: any;
};

const PlaylistsTab = ({ channelId, channel }: Props) => {
  const { data, isLoading, hasNextPage, fetchNextPage } = useChannelPlaylists(
    channelId,
    1,
    10
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createPlaylistMutation = useCreatePlaylist();
  const { user } = useAuth();
  const isOwner = user?.id == channel.ownerId;
  const playlists = data?.pages.flatMap((page) => page.playlists) || [];
  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePlaylist = async (playlistData: any) => {
    try {
      await createPlaylistMutation.mutateAsync({
        ...playlistData,
        privacy: "PUBLIC",
        channelId,
      });
      toast.success("Playlist created successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to create playlist");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Playlists</h1>
          {isOwner && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-white px-4 py-2 rounded-md border flex items-center gap-2 hover:bg-muted transition-colors"
            >
              <Plus size={20} />
              Create Playlist
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Search playlists..."
          className="w-full p-3 mb-8 rounded-lg max-w-md focus:outline-0 bg-muted text-white placeholder-muted-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredPlaylists.length === 0 ? (
          <div className="text-center mt-8 text-gray-400 text-xl">
            No playlists found
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  channel
                  channelId={channelId}
                />
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => fetchNextPage()}
                  className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <CreatePrivatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // videoId={null} // We're not adding a video
        onSubmit={handleCreatePlaylist}
        isChannelPlaylist
      />
    </div>
  );
};

export default PlaylistsTab;
