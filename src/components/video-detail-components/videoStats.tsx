import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark02Icon,
  Playlist01Icon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "../ui/Icons";
import { RootState, AppDispatch } from "../../store/store";
import { toggleLike, selectIsVideoLiked } from "../../store/features/likeSlice";
import {
  selectIsVideoDisliked,
  toggleDislike,
} from "../../store/features/dislikesSlice";
import {
  selectIsVideoBookmarked,
  toggleBookmark,
} from "../../store/features/bookmarkSlice";
import {
  useBookmarkVideo,
  useDislikeVideo,
  useLikeVideo,
} from "../../hooks/useVideostats";
import PlaylistModal from "../PlaylistModal";
import useAuth from "../../hooks/useAuth";

type Props = {
  videoId: number;
  likes: number;
  dislikes: number;
};

const VideoStats: React.FC<Props> = ({
  videoId,
  likes: initialLikes,
  dislikes: initialDislikes,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {user} = useAuth()
  const userId = user?.id;
  if(!userId){
    return <div>Log in</div>
  }
  const isLiked = useSelector((state: RootState) =>
    selectIsVideoLiked(state, videoId, userId)
  );
  const isDisliked = useSelector((state: RootState) =>
    selectIsVideoDisliked(state, videoId, userId)
  );
  const isBookmarked = useSelector((state: RootState) =>
    selectIsVideoBookmarked(state, videoId, userId)
  );

  const [localLikes, setLocalLikes] = React.useState(initialLikes);
  const [localDislikes, setLocalDislikes] = React.useState(initialDislikes);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const likeVideoMutation = useLikeVideo(videoId);
  const dislikeVideoMutation = useDislikeVideo(videoId);
  const bookmarkVideoMutation = useBookmarkVideo(videoId);

  const handleLike = () => {
    likeVideoMutation.mutate(undefined, {
      onSuccess: (data) => {
        dispatch(toggleLike({ videoId, userId }));
        setLocalLikes((prev) => (isLiked ? prev - 1 : prev + 1));
        if (isDisliked) {
          dispatch(toggleDislike({ videoId, userId }));
          setLocalDislikes((prev) => prev - 1);
        }
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(`Failed to like video: ${error.message}`);
      },
    });
  };

  const handleDislike = () => {
    dislikeVideoMutation.mutate(undefined, {
      onSuccess: (data) => {
        dispatch(toggleDislike({ videoId, userId }));
        setLocalDislikes((prev) => (isDisliked ? prev - 1 : prev + 1));
        if (isLiked) {
          dispatch(toggleLike({ videoId, userId }));
          setLocalLikes((prev) => prev - 1);
        }
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(`Failed to dislike video: ${error.message}`);
      },
    });
  };

  const handleBookmark = () => {
    const currentTime = 0; // TODO: Replace this with the actual current time of the video
    bookmarkVideoMutation.mutate(
      { time: currentTime },
      {
        onSuccess: (data) => {
          dispatch(toggleBookmark({ videoId, userId, time: currentTime }));
          toast.success(data.message);
        },
        onError: (error) => {
          toast.error(`Failed to bookmark video: ${error.message}`);
        },
      }
    );
  };

  const handlePlaylistClick = () => {
    setIsPlaylistModalOpen(true);
  };

  return (
    <div className="flex flex-row py-1 rounded-lg w-full md:justify-end justify-evenly items-center">
      <div className="rounded-lg flex gap-3 items-center justify-center bg-none px-2 py-0.5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-evenly md:mb-0"
          onClick={handleLike}
          disabled={likeVideoMutation.isPending}
        >
          <div className="flex items-center justify-center">
            <div className="p-1.5">
              <ThumbsUpIcon
                className={`hover:text-gray-400 duration-200 ${
                  isLiked ? "text-blue-500" : ""
                } ${likeVideoMutation.isPending ? "opacity-50" : ""}`}
              />
            </div>
            <div className="w-8 text-center">
              {" "}
              {/* Fixed width container for count */}
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={localLikes}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="inline-block"
                >
                  {localLikes}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center md:mb-0"
          onClick={handleDislike}
          disabled={dislikeVideoMutation.isPending}
        >
          <div className="flex items-center justify-center">
            <div className="p-1.5">
              <ThumbsDownIcon
                className={`hover:text-gray-400 duration-200 ${
                  isDisliked ? "text-red-500" : ""
                } ${dislikeVideoMutation.isPending ? "opacity-50" : ""}`}
              />
            </div>
            <div className="w-8 text-center">
              {" "}
              {/* Fixed width container for count */}
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={localDislikes}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="inline-block"
                >
                  {localDislikes}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.button>
      </div>
      <motion.button
        // whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-lg flex gap-2 bg-none p-2 hover:bg-muted transition duration-200"
        onClick={handleBookmark}
        disabled={bookmarkVideoMutation.isPending}
      >
        <Bookmark02Icon
          height={"22"}
          width={"22"}
          className={`${isBookmarked ? "text-yellow-500" : ""} ${
            bookmarkVideoMutation.isPending ? "opacity-50" : ""
          }`}
        />
        <span className="md:hidden sm:hidden">Bookmark</span>
      </motion.button>
      <motion.button
        // whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-lg flex gap-1 items-center justify-center bg-none p-2 px-3 hover:bg-muted transition duration-200"
        onClick={handlePlaylistClick}
      >
        <Playlist01Icon className="mt-0.5 h-5 w-5" />
        <span className="text-md hidden md:block lg:hidden">Save</span>
      </motion.button>
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        videoId={videoId}
      />
    </div>
  );
};

export default VideoStats;
