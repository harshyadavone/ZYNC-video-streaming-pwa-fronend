import { useNavigate, useParams } from "react-router-dom";
import { useGetPlaylistById } from "../hooks/playlists/useGetPlaylistById";
import { Video } from "../types/channel";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Info, List, MoreVertical, Play, Trash2 } from "lucide-react";
import { timeAgo } from "../lib/formatters";
import { PlaylistVideoCard } from "../components/playlists/PlaylistCard";
import TabNavigation from "../components/my-channel/TabNavigation";
import { useDeletePlaylist } from "../hooks/playlistsHooks";
import Modal from "../components/Modal";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import PlaylistModal from "../components/createPlaylist";

type Owner = {
  avatar: string;
  id: number;
  username: string;
};

export type Playlist = {
  channelId: string;
  createdAt: string;
  description: string;
  id: number;
  name: string;
  ownerId: number;
  privacy: "PRIVATE" | "UNLISTED" | "PUBLIC";
  updatedAt: string;
  owner: Owner;
  videos: Video[];
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export interface GetPlaylistResponse {
  playlist: Playlist & {
    videos: Video[];
  };
  pagination: Pagination;
}

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { ref, inView } = useInView();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Videos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabs = ["Videos", "info"];

  const navigate = useNavigate();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetPlaylistById(1, 10, playlistId!);
  const { mutate: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    deletePlaylist(playlistId!);
    setShowDeleteModal(false);
    toast.success("Playlist Deleted");
    navigate("/playlists");
  };

  if (isDeleting) {
    toast.loading("Deleting the Playlist");
  }

  if (isLoading) {
    return <PlaylistSkeleton />;
  }

  if (!data || data.pages.length === 0) {
    return (
      <div className="text-center text-xl mt-8 text-gray-300">
        Playlist not found
      </div>
    );
  }

  const playlist = data.pages[0].playlist;
  const allVideos = data.pages.flatMap((page) => page.playlist.videos);
  const playlistThumbnail = allVideos[0]?.thumbnail || ""; // Use the first video's thumbnail

  return (
    <div className="min-h-screen text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Left Section - Playlist Info */}
          <div className="lg:w-1/3">
            <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
              <img
                src={playlistThumbnail}
                alt={playlist.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h1 className="text-2xl font-medium mb-4">{playlist.name}</h1>
              <p className="text-gray-400 mb-2">{playlist.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                {playlist.videos.length} videos
              </p>
              <div className="flex items-center mt-4">
                <img
                  src={playlist.owner.avatar}
                  alt={playlist.owner.username}
                  className="w-7 h-7 rounded-full mr-2"
                />
                <div>
                  <p className="font-medium">{playlist.owner.username}</p>
                  {/* <p className="text-sm text-gray-500">
                    {playlist.owner.id} subscribers
                  </p> */}
                </div>
              </div>
              <div className="mt-6 flex space-x-4 items-center justify-center">
                <button className="flex-1 bg-primary text-white py-2 px-4 rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors duration-200">
                  <Play className="mr-2" /> Play All
                </button>
                <button className="flex-1 bg-muted text-white py-2 px-4 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors duration-200">
                  <List className="mr-2" /> Shuffle
                </button>
                <div className="flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2  rounded-full bg-muted/50 hover:bg-muted ">
                        <MoreVertical className="w-5 h-5 text-white p-0.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56  text-white border-solid"
                    >
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Update Playlist</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={handleDelete}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Playlist</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Confirm Deletion"
              >
                <p className="mb-4">
                  Are you sure you want to delete playlist?
                </p>
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
              <PlaylistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                playlistToUpdate={{
                  id: playlist.id,
                  name: playlist.name,
                  description: playlist.description,
                  privacy: playlist.privacy,
                }}
              />
            </div>
          </div>

          {/* Right Section - Video List and Info Tabs */}
          <div className="lg:w-2/3">
            <div className="bg-card rounded-lg shadow-lg md:p-4 mb-6">
              <div className="flex border-b border-solid mb-4">
                <TabNavigation
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
              <AnimatePresence mode="wait">
                {activeTab === "Videos" ? (
                  <motion.div
                    key="videos"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-4">
                      {allVideos.map((video, index) => (
                        <PlaylistVideoCard
                          key={`${video.id}-${index}`}
                          video={video}
                          index={index}
                          playlistId={playlistId!}
                        />
                      ))}
                    </div>
                    {hasNextPage && (
                      <div ref={ref} className="text-center py-4">
                        {isFetchingNextPage ? <VideoSkeleton /> : null}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div key="info">
                    <div className="text-gray-300 p-4">
                      <p>
                        <span className="font-medium tracking-wider">
                          Created:
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {timeAgo(playlist.createdAt)}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Last Updated:</span>{" "}
                        <span className="text-muted-foreground">
                          {timeAgo(playlist.updatedAt)}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Privacy:</span>{" "}
                        <span className="text-muted-foreground">
                          {playlist.privacy}
                        </span>
                      </p>
                      <p className="mt-4 text-muted-foreground flex items-center justify-start gap-2 text-sm">
                        <Info className="inline h-3 w-3 " /> This playlist
                        contains {playlist.videos.length} videos.
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaylistSkeleton = () => (
  <div className=" min-h-screen text-gray-100">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <div className="bg-card rounded-lg shadow-lg p-6 mb-6 animate-pulse">
            <div className="h-48 bg-muted rounded-md mb-4"></div>
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6 mb-4"></div>
            <div className="flex items-center mt-4">
              <div className="w-10 h-10 bg-muted rounded-full mr-4"></div>
              <div>
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-2/3">
          <div className="bg-card rounded-lg shadow-lg p-4 mb-6">
            <div className="h-10 bg-muted rounded mb-4"></div>
            {[...Array(5)].map((_, index) => (
              <VideoSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const VideoSkeleton = () => (
  <div className="flex bg-muted/20  rounded-lg overflow-hidden mb-4 animate-pulse">
    <div className="w-40 h-24 bg-muted rounded-md"></div>
    <div className="p-4 flex-grow">
      <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2 mb-1"></div>
      <div className="h-3 bg-muted rounded w-1/4"></div>
    </div>
  </div>
);

export default PlaylistPage;
