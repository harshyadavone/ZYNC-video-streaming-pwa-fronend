import { useQuery } from "@tanstack/react-query";
import { getUser } from "../lib/api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/features/userSlice";
import { UserResponse } from "../types/user";

export const AUTH = "auth";

const useAuth = (opts = {}) => {
  const dispatch = useDispatch();

  const { data: user, ...rest } = useQuery<UserResponse>({
    queryKey: [AUTH],
    queryFn: getUser,
    staleTime: Infinity,
    ...opts,
  }) ;

  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      dispatch(setUser({ ...user, isAuthenticated }));
    }
  }, [user, dispatch]);

  return {
    user,
    isAuthenticated,
    ...rest,
  };
};

export default useAuth;
