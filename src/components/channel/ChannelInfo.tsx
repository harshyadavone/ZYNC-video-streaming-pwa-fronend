import { Bell, CheckCircle, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "../ui/tooltip";
import { Channel } from "../../hooks/my-channel/useGetMychannel";

type Props ={
    channel: Channel,
    isVerified: boolean
}


const handleShare = () => {
    // Implement share functionality
    console.log("Share channel");
  };

  const handleNotify = () => {
    // Implement notification functionality
    console.log("Toggle notifications");
  };

  const handleSubscribe = () => {
    // Implement subscribe functionality
    console.log("Subscribe to channel");
  };


const ChannelInfo = ({channel, isVerified} : Props) => {
  return (
    <div className="pt-8 sm:pt-10 px-4 pb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div>
          <h1 className="text-2xl font-medium flex items-center">
            {channel.name}
            {isVerified && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <CheckCircle className="ml-2 h-5 w-5 text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Verified Channel</p>
                </TooltipContent>
              </Tooltip>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {channel.description}
          </p>
          <p className="text-sm mt-2">
            <span>{channel._count.subscribers}</span> subscribers •{" "}
            <span>{channel._count.videos}</span> videos
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                aria-label="Share channel"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share this channel</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNotify}
                aria-label="Subscribe to notifications"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notify
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get notified about new videos</p>
            </TooltipContent>
          </Tooltip>
          <Button size="sm" onClick={handleSubscribe}>
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChannelInfo;
