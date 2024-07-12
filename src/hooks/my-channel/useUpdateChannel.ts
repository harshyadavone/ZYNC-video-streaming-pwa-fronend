import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChannel } from "../../lib/api";
import { MYCHANNEL } from "./useGetMychannel";

export const updateChannelMutation = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => updateChannel(formData),
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [MYCHANNEL] });
      }, 500); // 500ms delay 
      onSuccessCallback()
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });
};
