import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/Loader";
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
import Loader2 from "./Loader2";
import CommentSection from "./CommentSection";
const RelatedVideos = React.lazy(
  () => import("./video-detail-components/relatedVideos")
);
import useAuth from "../hooks/useAuth"; // Assuming you have an auth hook
import PollCreator from "./PollCreator";
import PollDisplay from "./PollDisplay";
import { createPoll, votePoll } from "../lib/api";
import Modal from "./Modal";
import { Button } from "./ui/button";
import { Edit3, PlusCircle, Trash2 } from "lucide-react";
import SubscribeInfo from "./video-detail-components/SubscribeInfo";
import ChannelPlaylistModal from "./playlists/ChannelPlaylistModal";
import { FolderAddIcon } from "./ui/Icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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

  const createPollMutation = useMutation({
    mutationFn: (pollData: { question: string; options: { text: string }[] }) =>
      // @ts-ignore
    // TODO: Fix the Poll data types
      createPoll(videoId, pollData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      setShowPollCreator(false);
    },
  });

  const votePollMutation = useMutation({
    mutationFn: ({ pollId, optionId }: { pollId: number; optionId: number }) =>
      votePoll(videoId, pollId, optionId),
    onSuccess: () => {
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
    // @ts-ignore
    (pollData: { question: string; options: string[] }) => {
      // @ts-ignore
      createPollMutation.mutate(pollData);
      setShowPollCreator(false);
    },
    [createPollMutation]
  );

  const handleVotePoll = useCallback(
    (pollId: number, optionId: number) => {
      votePollMutation.mutate({ pollId, optionId });
      setUserVote(optionId);
    },
    [votePollMutation]
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
                poll.options.find((option: any) =>
                  // @ts-ignore
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
              poll.options.find((option: any) =>
                // @ts-ignore
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

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading video</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div className="max-w-[1800px] mx-auto px-4 py-6 ">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <div className="aspect-video">{memoizedVideoPlayer}</div>
          <div className="bg-card/40 p-3 rounded-lg">
            <h1 className="text-xl md:text-2xl tracking-wide mt-4">
              {video.title}
            </h1>
            <div className="border-b border-solid mt-4" />

            <div className="flex  flex-col md:flex-row justify-between items-start mt-4">
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
          <div className="flex flex-col md:flex-row md:gap-2">
            <button
              onClick={() => setIsPlaylistModalOpen(true)}
              className="w-full py-1.5 md:w-auto mt-3 border rounded-3xl underline-none hover:bg-green-400/5 text-green-600 px-4 flex gap-2 items-center justify-center"
            >
              Save video to your channe's Playlist
              <FolderAddIcon className="text-green-600 h-5 w-5" />
            </button>
            <div className="flex flex-row gap-2">
              <button
                onClick={() => setIsPlaylistModalOpen(true)}
                className="w-full py-1.5 md:w-auto mt-3 border rounded-3xl underline-none hover:bg-red-400/5 text-red-600 px-4 flex gap-2 items-center justify-center"
              >
                Delete Video
                <Trash2 className="h-4 w-4" />
              </button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setIsPlaylistModalOpen(true)}
                      className="w-full py-1.5 md:w-auto mt-3 border rounded-3xl underline-none hover:bg-yellow-400/5 text-yellow-600 px-4 flex gap-2 items-center justify-center disabled:cursor-not-allowed disabled:hover:bg-background disabled:text-yellow-800"
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
          </div>
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
          {/* TODO: previously owner was video.channel.id here now i modified it to OwnerId if i got any issues i'll look here */}
          <CommentSection videoId={videoId} Owner={video.ownerId} />
        </div>
        <div className="md:w-1/3">
          <SuggestionBar />
          <React.Suspense
            fallback={
              <div>
                <Loader2 />
              </div>
            }
          >
            <RelatedVideos />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailspage;
