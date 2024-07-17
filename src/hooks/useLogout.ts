import { useMutation } from "@tanstack/react-query";
import { logout } from "../lib/api";

const useLogout = () => {
  const { mutateAsync, ...rest } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // todo: show a toast message 
    },
  });

  return { logout: mutateAsync, ...rest };
};

export default useLogout;
