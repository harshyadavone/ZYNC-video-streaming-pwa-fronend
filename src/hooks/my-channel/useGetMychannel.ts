import { useQuery } from "@tanstack/react-query";
import API from "../../config/apiClient";

export const MYCHANNEL = "myChannel";

//  MyChannelData types

export type Channel = {
  bannerImage: string;
  channelProfileImage: string;
  createdAt: string;
  description: string;
  id: number;
  name: string;
  slug: string;
  updatedAt: string;
  _count: { videos: number; subscribers: number; playlists: number };
};

export type MyChannelData = {
  channel: Channel;
};

export const useGetMyChannel = () => {
  return useQuery<MyChannelData>({
    queryKey: [MYCHANNEL],
    queryFn: () => API.get(`/channels/my-channel`),
  });
};
