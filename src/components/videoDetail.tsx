import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../config/apiClient";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import VideoPlayer from "./video-detail-components/videoPlayer";
import { VideoDetails } from "../types";
import VideoStats from "./video-detail-components/videoStats";
import VideoDescription from "./video-detail-components/videoDescription";
// import RelatedVideos from "./video-detail-components/relatedVideos";
import SuggestionBar from "./SuggestionBar";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { MediaPlayerInstance } from "@vidstack/react";
import useVideoView from "../hooks/useVideoView";
import { AxiosError } from "axios";
import CommentSection from "./CommentSection";
const RelatedVideos = React.lazy(
  () => import("./video-detail-components/relatedVideos")
);
import useAuth from "../hooks/useAuth";
import PollCreator from "./PollCreator";
import PollDisplay from "./PollDisplay";
import { createPoll, votePoll } from "../lib/api";
import Modal from "./Modal";
import { Button } from "./ui/button";
import { Edit3, PlusCircle, Trash2 } from "lucide-react";
import SubscribeInfo from "./video-detail-components/SubscribeInfo";
import ChannelPlaylistModal from "./playlists/ChannelPlaylistModal";
import { FolderAddIcon } from "./ui/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import RelatedVideoSkeleton from "../skeleton/RelatedVideoSkeleton";
import VideoDetailsSkeleton from "../skeleton/VideoDetailsSkeleton";
import { toast } from "sonner";

export interface Poll {
  id: number;
  options: PollOption[];
  _count: {
    votes: number;
  };
}

interface PollOption {
  id: number;
  text: string;
  order: number;
  votes: { userId: number }[];
  _count: {
    votes: number;
  };
}

export interface PollCreationData {
  question: string;
  options: { text: string; order: number }[];
}

interface MutationContext {
  previousVideo: VideoDetails | undefined;
}

const fetchVideoDetails = async (videoId: number): Promise<VideoDetails> => {
  return await API.get(`/video/videos/${videoId}`);
};

const VideoDetailspage: React.FC = () => {
  const params = useParams();
  const videoId = Number(params.videoId);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const watchHistoryMutation = useWatchHistory(videoId);
  const playerRef = useRef<MediaPlayerInstance>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [userVote, setUserVote] = useState<number | undefined>(undefined);

  const {
    data: video,
    isLoading,
    isError,
  } = useQuery<VideoDetails, AxiosError>({
    queryKey: ["video", videoId],
    queryFn: () => fetchVideoDetails(videoId),
    enabled: !!videoId,
  });

  const { handleTimeUpdate: logViewTimeUpdate } = useVideoView(videoId);

const createPollMutation = useMutation<Poll, Error, PollCreationData>({
  mutationFn: (pollData: PollCreationData) => createPoll(videoId, pollData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["video", videoId] });
    setShowPollCreator(false);
  },
});
  const votePollMutation = useMutation<
    void,
    Error,
    { pollId: number; optionId: number },
    MutationContext
  >({
    mutationFn: ({ pollId, optionId }) => votePoll(videoId, pollId, optionId),
    onMutate: async ({ pollId, optionId }) => {
      await queryClient.cancelQueries({ queryKey: ["video", videoId] });

      const previousVideo = queryClient.getQueryData<VideoDetails>([
        "video",
        videoId,
      ]);

      if (previousVideo && user) {
        const updatedVideo: VideoDetails = {
          ...previousVideo,
          polls: previousVideo.polls.map((poll: Poll) => {
            if (poll.id === pollId) {
              const updatedOptions = poll.options.map((option: PollOption) => {
                if (option.id === optionId) {
                  return {
                    ...option,
                    votes: [...option.votes, { userId: user.id }],
                    _count: {
                      ...option._count,
                      votes: option._count.votes + 1,
                    },
                  };
                }
                return option;
              });

              // Sort by the 'order' field to maintain the original order
              updatedOptions.sort((a, b) => a.order - b.order);

              return {
                ...poll,
                options: updatedOptions,
                _count: { ...poll._count, votes: poll._count.votes + 1 },
              };
            }
            return poll;
          }),
        };
        queryClient.setQueryData(["video", videoId], updatedVideo);
      }

      return { previousVideo };
    },
    // @ts-ignore
    onError: (err, newVote, context) => {
      if (context?.previousVideo) {
        queryClient.setQueryData(["video", videoId], context.previousVideo);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
    },
  });

  const handleTimeUpdate = useCallback(
    (time: number) => {
      setCurrentTime(time);
      logViewTimeUpdate(time);
    },
    [logViewTimeUpdate]
  );

  const handleCreatePoll = useCallback(
    async (pollData: { question: string; options: string[] }) => {
      try {
        const pollDataWithOrder: PollCreationData = {
          question: pollData.question,
          options: pollData.options.map((text, index) => ({ text, order: index })),
        };
        await createPollMutation.mutateAsync(pollDataWithOrder);
      } catch (error) {
        console.error("Failed to create poll:", error);
      }
    },
    [createPollMutation]
  );

  const handleVotePoll = useCallback(
    (pollId: number, optionId: number) => {
      if (user) {
        votePollMutation.mutate({ pollId, optionId });
        setUserVote(optionId);
      } else {
        // Handle case where user is not logged in
        toast.error("You must be logged in to vote.");
      }
    },
    [votePollMutation, user]
  );

  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (currentTime > 0) {
        watchHistoryMutation.mutate(currentTime);
      }
    }, 5000);

    return () => clearInterval(updateInterval);
  }, [videoId, watchHistoryMutation, currentTime]);

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const memoizedVideoPlayer = useMemo(
    () =>
      video && (
        <VideoPlayer
          ref={playerRef}
          duration={video.duration}
          autoPlay
          src={video.videoUrl}
          title={video.title}
          key={video.id}
          onTimeUpdate={handleTimeUpdate}
        />
      ),
    [video, handleTimeUpdate]
  );

  const pollSection = useMemo(() => {
    if (!video) return null;

    const poll = video.polls[0];

    if (user && user.id === video.ownerId) {
      return (
        <div className="mt-6 space-y-4">
          {!poll && (
            <Button
              onClick={() => setShowPollCreator(true)}
              className="w-full sm:w-auto"
              variant="outline"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Poll
            </Button>
          )}
          <Modal
            isOpen={showPollCreator}
            onClose={() => setShowPollCreator(false)}
            title="Create Poll"
          >
            <PollCreator
              onCreatePoll={handleCreatePoll}
              onClose={() => setShowPollCreator(false)}
            />
          </Modal>
          {poll && (
            <PollDisplay
              poll={poll}
              onVote={(optionId) => handleVotePoll(poll.id, optionId)}
              userVote={
                poll.options.find((option: PollOption) =>
                  option.votes.some((vote: any) => vote.userId === user.id)
                )?.id
              }
            />
          )}
        </div>
      );
    } else if (poll) {
      return (
        <div className="mt-6">
          <PollDisplay
            poll={poll}
            onVote={(optionId) => handleVotePoll(poll.id, optionId)}
            userVote={
              poll.options.find((option: PollOption) =>
                option.votes.some((vote: any) => vote.userId === user?.id)
              )?.id
            }
          />
        </div>
      );
    }
    return null;
  }, [
    user,
    video,
    showPollCreator,
    handleCreatePoll,
    handleVotePoll,
    userVote,
  ]);

  if (isLoading) return <VideoDetailsSkeleton />;
  if (isError) return <div>Error loading video</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-6 pb-20 md:pb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <div className="aspect-video w-full">{memoizedVideoPlayer}</div>
          <div className="bg-card/40 p-3 rounded-lg mt-4">
            <h1 className="text-lg sm:text-xl md:text-2xl tracking-wide">
              {video.title}
            </h1>
            <div className="border-b border-solid my-4" />

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <SubscribeInfo
                channelId={video.channel.id}
                channelName={video.channel.name}
                channelProfileImage={video.channel.channelProfileImage}
                subscribeCount={video.channel._count.subscribers}
                key={video.channel.id}
              />
              <VideoStats
                dislikes={video.dislikes}
                likes={video.likes}
                videoId={video.id}
              />
            </div>
          </div>
          {user && user.id === video.ownerId && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setIsPlaylistModalOpen(true)}
                className="flex-grow sm:flex-grow-0 py-2 px-4 border rounded-full hover:bg-green-400/5 text-foreground flex items-center justify-center text-sm gap-2 transition-colors duration-200"
              >
                Save to Playlist
                <FolderAddIcon className="text-green-600 h-4 w-4" />
              </button>
              <button
                onClick={() => setIsPlaylistModalOpen(true)}
                disabled
                className="flex-grow sm:flex-grow-0 py-2 px-4 border rounded-full hover:bg-red-400/5 text-foreground hover:text-red-600 flex items-center justify-center text-sm gap-2 transition-colors duration-200 disabled:cursor-not-allowed disabled:hover:bg-background disabled:text-red-800"
              >
                Delete Video
                <Trash2 className="h-4 w-4" />
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setIsPlaylistModalOpen(true)}
                      className="flex-grow sm:flex-grow-0 py-2 px-4 border rounded-full hover:bg-yellow-400/5 text-foreground hover:text-yellow-600 flex items-center justify-center disabled:cursor-not-allowed disabled:hover:bg-background disabled:text-yellow-800 text-sm gap-2 transition-colors duration-200"
                      disabled
                    >
                      Update Video
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adding this feature soon...</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {video && (
            <ChannelPlaylistModal
              isOpen={isPlaylistModalOpen}
              onClose={() => setIsPlaylistModalOpen(false)}
              channelId={video.channelId.toString()}
              videoId={video.id}
            />
          )}
          <VideoDescription
            createdAt={video.createdAt}
            description={video.description}
            videoTags={video.tags}
            views={video.views}
          />

          {pollSection}
          <CommentSection videoId={videoId} Owner={video.ownerId} />
        </div>
        <div className="w-full lg:w-1/3">
          <SuggestionBar />
          <React.Suspense fallback={<RelatedVideoSkeleton />}>
            <RelatedVideos />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailspage;
