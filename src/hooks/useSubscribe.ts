import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../config/apiClient";

// Function to toggle subscription for a channel
const toggleSubscription = async (channelId: number) => {
  return await API.post(`/subscription/channels/${channelId}/toggle-subscription`);
};

// Function to get subscription status
const getSubscriptionStatus = async (channelId: number) => {
  return await API.get(`/subscription/channels/${channelId}/subscription-status`);
};

// Custom hook for toggle subscription mutation
export const useToggleSubscriptionMutation = (channelId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleSubscription(channelId),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({
        queryKey: ["subscriptionStatus", channelId],
      });
    },
  });
};

// Custom hook for subscription status
export const useSubscriptionStatus = (channelId: number) => {
  return useQuery({
    queryKey: ["subscriptionStatus", channelId],
    queryFn: () => getSubscriptionStatus(channelId),
    staleTime: 0,
    // enabled: !!channelId,
  });
};