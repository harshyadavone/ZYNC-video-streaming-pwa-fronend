// components/MyChannelHeader.tsx
import React from "react";
import { Channel } from "../../hooks/my-channel/useGetMychannel";
import { Button } from "../ui/button";
import { Upload04Icon } from "../ui/Icons";
import { Link } from "react-router-dom";

interface MyChannelHeaderProps {
  channel: Channel;
  onEditClick: () => void;
}

const MyChannelHeader: React.FC<MyChannelHeaderProps> = ({
  channel,
  onEditClick,
}) => (
  <div className="mb-8 text-center relative px-4">
    <div
      className="w-full h-28 md:h-60 bg-cover bg-center mb-4 rounded-lg relative"
      style={{
        backgroundImage: `url(${channel.bannerImage})`,
      }}
    ></div>
    <div className="relative inline-block">
      <img
        src={channel.channelProfileImage}
        alt={channel.name}
        className="w-32 h-32 mx-auto mb-4 rounded-full object-cover -mt-14 border-2 border-inherit"
      />
    </div>
    <h1 className="text-4xl font-bold mb-2">{channel.name}</h1>
    <p className="text-muted-foreground mb-4">{channel.description}</p>
    <div className="flex items-center justify-center">
      <Button onClick={onEditClick} className="mr-2" variant={"ghost"}>
        Update Channel
      </Button>
      <Link to={`/my-channel/${channel.id}/upload`}>
        <Button className="text-black gap-2">
          <Upload04Icon /> Upload Video
        </Button>
      </Link>
    </div>
  </div>
);

export default MyChannelHeader;
