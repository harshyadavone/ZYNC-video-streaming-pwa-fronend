import { useState, useEffect } from "react";
import { useMySubscriptions } from "../hooks/useMySubscriptions";
import ChannelList, {
  Channel,
} from "../components/my-subscription/ChannelList";
import ChannelVideos from "../components/my-subscription/ChannelVIdeos";

const MySubscriptionsPage: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMySubscriptions(1, 8);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <div className="w-64 border-r border-border overflow-y-auto no-scrollbar">
          <h1 className="text-xl font-bold p-4">Subscriptions</h1>
          <ChannelList
            data={data}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onSelectChannel={setSelectedChannel}
            selectedChannelId={selectedChannel?.id}
            isMobile={false}
          />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {isMobile ? (
          // Mobile layout
          <div>
            <h1 className="text-xl font-bold p-4 hidden md:block">
              Subscriptions
            </h1>
            <div className="overflow-x-auto whitespace-nowrap mb-4 border-b ">
              <ChannelList
                data={data}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onSelectChannel={setSelectedChannel}
                selectedChannelId={selectedChannel?.id}
                isMobile={true}
              />
            </div>
            {selectedChannel ? (
              <ChannelVideos
                channelId={selectedChannel.id}
                channelName={selectedChannel.name}
              />
            ) : (
              <div className="p-4">
                <h2 className="text-lg font-medium mb-4">Latest videos</h2>
                {/*TODO: Add a component to show latest videos from all subscriptions */}
              </div>
            )}
          </div>
        ) : // Desktop layout
        selectedChannel ? (
          <ChannelVideos
            channelId={selectedChannel.id}
            channelName={selectedChannel.name}
          />
        ) : (
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Latest videos</h2>
            {/* TODO: Add a component to show latest videos from all subscriptions */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptionsPage;
