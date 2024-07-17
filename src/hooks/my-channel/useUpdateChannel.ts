import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChannel } from "../../lib/api";
import { MYCHANNEL } from "./useGetMychannel";

export const updateChannelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => updateChannel(formData),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [MYCHANNEL] });
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });
};


// const editProfileMutation = useMutation({
//   mutationFn: editProfile,
//   onSuccess: () => {
//     queryClient.invalidateQueries({ queryKey: ["auth"] });
//     setIsEditing(false);
//   },
//   onError: (error) => {
//     console.error("Failed to update profile:", error);
//   },
// });
