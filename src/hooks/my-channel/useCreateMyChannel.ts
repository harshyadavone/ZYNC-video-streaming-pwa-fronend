import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChannel } from "../../lib/api";
import { MYCHANNEL } from "./useGetMychannel";

export const useCreateChannelMutation = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createChannel(formData),
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
