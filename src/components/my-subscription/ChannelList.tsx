import React, { Fragment } from "react";
import { InView } from "react-intersection-observer";

interface ChannelListProps {
  data: any;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  onSelectChannel: (channel: Channel) => void;
  selectedChannelId: number | undefined;
  isMobile: boolean;
}

type Subscripions = {
  id: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  subscriberId: number;
  channelId: number;
  channel: Channel;
};

export type Channel = {
  id: number;
  name: string;
  channelProfileImage: string;
  _count: {
    subscribers: number;
  };
};

const ChannelList: React.FC<ChannelListProps> = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onSelectChannel,
  selectedChannelId,
  isMobile,
}) => {
  return (
    <div className={`md:py-2 mx-4 gap-2 ${isMobile ? "flex" : ""}`}>
      {data?.pages.map((page: any, i: number) => (
        <Fragment key={i}>
          {page.subscriptions.map((subscription: Subscripions) => (
            <button
              key={subscription.id}
              className={`text-left rounded p-1.5 ${
                isMobile ? "flex-shrink-0 w-20" : "w-full"
              } ${
                selectedChannelId === subscription.channel.id
                  ? "bg-muted/50 font-medium"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => onSelectChannel(subscription.channel)}
            >
              <div
                className={`${
                  isMobile ? "flex flex-col items-center" : "flex items-center"
                }`}
              >
                <img
                  src={subscription.channel.channelProfileImage}
                  alt={subscription.channel.name}
                  className={`${
                    isMobile ? "w-12 h-12 mb-1" : "w-6 h-6 mr-4"
                  } rounded-full object-cover`}
                />
                <span
                  className={`text-sm truncate ${isMobile ? "hidden" : ""}`}
                >
                  {subscription.channel.name}
                </span>
              </div>
            </button>
          ))}
        </Fragment>
      ))}
      <InView onChange={(inView) => inView && hasNextPage && fetchNextPage()}>
        {isFetchingNextPage && (
          <div
            className={`animate-pulse p-2 ${
              isMobile ? "flex-shrink-0 w-20" : ""
            }`}
          >
            <div
              className={`${
                isMobile ? "flex flex-col items-center" : "flex items-center"
              }`}
            >
              <div
                className={`${
                  isMobile ? "w-10 h-10 mb-1" : "w-6 h-6 mr-4"
                } bg-muted rounded-full`}
              ></div>
              <div
                className={`h-3 bg-muted rounded ${
                  isMobile ? "w-16" : "w-3/4"
                }`}
              ></div>
            </div>
          </div>
        )}
      </InView>
    </div>
  );
};

export default ChannelList;
