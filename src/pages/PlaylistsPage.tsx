import { usePrivatePlaylists } from "../hooks/playlists/usePrivatePlaylists";
import { Eye, Folder, Globe, Lock, Plus } from "lucide-react";
import { useState } from "react";
import { Playlists } from "../types/playlits";
import { Link } from "react-router-dom";
import CreatePrivatePlaylistModal from "../components/playlists/CreatePrivatePlaylistModal";
import { toast } from "sonner";
import { useCreatePlaylist } from "../hooks/playlistsHooks";
import { timeAgo } from "../lib/formatters";
import Loader2 from "../components/Loader2";

type Props = {
  playlist: Playlists;
  channel?: boolean;
  channelId?: string;
};

export const PlaylistCard = ({ playlist, channel, channelId }: Props) => {
  const privacyIcons = {
    PRIVATE: <Lock className="text-red-400 h-4 w-4" />,
    UNLISTED: <Eye className="text-yellow-400 h-4 w-4" />,
    PUBLIC: <Globe className="text-green-400 h-4 w-4" />,
  };

  return (
    <Link
      to={
        channel
          ? `/channel/${channelId}/playlists/${playlist.id}`
          : `/playlist/${playlist.id}`
      }
      className="rounded-lg shadow-lg border overflow-hidden transition-all hover:shadow-xl hover:bg-card hover:cursor-pointer"
    >
      <div className="h-40 bg-gradient-to-r from-green-600 to-emerald-600 backdrop-blur-2xl flex items-center justify-center rounded-t-md">
        <Folder className="text-white w-16 h-16" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-medium mb-2 truncate text-white">
          {playlist.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {playlist.description}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>{timeAgo(playlist.createdAt)}</span>
          <span className="flex items-center gap-1">
            {privacyIcons[playlist.privacy]}
            {playlist.privacy.toLowerCase()}
          </span>
        </div>
      </div>
    </Link>
  );
};

const PlaylistsPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage } = usePrivatePlaylists(
    1,
    12
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createPlaylistMutation = useCreatePlaylist();

  const playlists = data?.pages.flatMap((page) => page.playlists) || [];
  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePlaylist = async (playlistData: any) => {
    try {
      await createPlaylistMutation.mutateAsync({
        ...playlistData,
        privacy: "PRIVATE",
      });
      toast.success("Playlist created successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to create playlist");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-screen h-screen items-center justify-center text-primary">
        <Loader2 />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium">Your Playlists</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white px-4 py-2 rounded-md border flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <Plus size={20} />
            Create Playlist
          </button>
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
                <PlaylistCard key={playlist.id} playlist={playlist} />
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
      />
    </div>
  );
};

export default PlaylistsPage;
