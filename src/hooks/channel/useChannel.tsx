import { useQuery } from "@tanstack/react-query";
import API from "../../config/apiClient";
import { MyChannelData } from "../my-channel/useGetMychannel";

export const CHANNEL = "Channel";

//  MyChannelData types are similar to channel types

export const useChannel = (channelId: string) => {
  return useQuery<MyChannelData>({
    queryKey: [CHANNEL],
    queryFn: () => API.get(`/channels/channel/` + channelId),
  });
};
