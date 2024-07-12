import React, { useState, useEffect } from "react";
import { Channel } from "../../hooks/my-channel/useGetMychannel";
import { TooltipProvider } from "../ui/tooltip";
import ChannelInfo from "./ChannelInfo";

type Props = {
  channel: Channel;
  isVerified?: boolean;
};

// src\assets\react.svg

const fallbackImage = "/src/assets/react.svg"; // TODO: Replace with actual path

const ChannelHeader: React.FC<Props> = ({ channel, isVerified = false }) => {
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    const bannerImg = new Image();
    bannerImg.src = channel.bannerImage;
    bannerImg.onload = () => setBannerLoaded(true);
    bannerImg.onerror = () => setBannerLoaded(true); // Load fallback on error

    const profileImg = new Image();
    profileImg.src = channel.channelProfileImage;
    profileImg.onload = () => setProfileLoaded(true);
    profileImg.onerror = () => setProfileLoaded(true); // Load fallback on error
  }, [channel.bannerImage, channel.channelProfileImage]);

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground">
        <div className="relative">
          {/* Banner Image */}
          <div className="h-40 sm:h-56 overflow-hidden bg-muted">
            {bannerLoaded ? (
              <img
                src={channel.bannerImage}
                alt=""
                className="w-full h-full object-cover"
                aria-hidden="true"
              />
            ) : (
              <div className="w-full h-full animate-pulse bg-card" />
            )}
          </div>

          {/* Profile Image */}
          <div className="absolute bottom-0 left-4 -mb-6 sm:-mb-8">
            {profileLoaded ? (
              <img
                src={channel.channelProfileImage}
                alt={`${channel.name}'s profile`}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-md"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
            ) : (
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-md animate-pulse bg-card" />
            )}
          </div>
        </div>

        {/* Channel Info */}
        <ChannelInfo channel={channel} isVerified={isVerified} />
      </div>
    </TooltipProvider>
  );
};

export default ChannelHeader;
