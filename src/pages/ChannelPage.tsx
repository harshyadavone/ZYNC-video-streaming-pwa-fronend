import { Outlet, useParams } from "react-router-dom";
import { useChannel } from "../hooks/channel/useChannel";
import ChannelHeader from "../components/channel/ChannelHeader";
import TabNavigation from "../components/my-channel/TabNavigation";
import { useState } from "react";
import ChannelVideoTab from "../components/channel/ChannelVideoTab";
import PlaylistsTab from "../components/PlaylistTab";

const ChannelPage = () => {
  const [activeTab, setActiveTab] = useState("Videos");

  const { channelId } = useParams();
  const tabs = ["Videos", "Playlist", "About"];

  if (!channelId) return <div>No Channel Id</div>;
  const { data: channelData, status } = useChannel(channelId);
  if (status === "pending") {
    return <div>Loading...</div>;
  }
  if (!channelData) {
    return <div>No Channel Found</div>;
  }
  return (
    <div>
      <ChannelHeader channel={channelData?.channel} />
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === "Videos" && (
        <ChannelVideoTab channelId={channelData.channel.id} />
      )}
      {activeTab === "Playlist" &&  (
        <PlaylistsTab channelId={String(channelData.channel.id)} channel={channelData.channel} />
      )}
      <Outlet />
    </div>
  );
};

export default ChannelPage;
