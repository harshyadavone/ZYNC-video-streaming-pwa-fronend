import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useToggleSubscriptionMutation } from "../../hooks/useSubscribe";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RootState, AppDispatch } from "../../store/store";
import {
  updateSubscription,
  removeSubscription,
} from "../../store/features/subscriptionSlice";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

interface Props {
  channelId: number;
  channelProfileImage: string;
  channelName: string;
  subscribeCount: number;
}

const SubscribeInfo: React.FC<Props> = ({
  channelId,
  channelProfileImage,
  channelName,
  subscribeCount: initialSubscribeCount,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const subscriptions = useSelector(
    (state: RootState) => state.subscription.subscriptions
  );
  const [subscribeCount, setSubscribeCount] = useState<number>(
    initialSubscribeCount
  );
  const [localSubscriptionStatus, setLocalSubscriptionStatus] =
    useState<boolean>(false);

  const toggleSubscriptionMutation = useToggleSubscriptionMutation(channelId);

  useEffect(() => {
    const subscription = subscriptions.find(
      (sub) => sub.channelId === channelId
    );
    setLocalSubscriptionStatus(!!subscription);
  }, [subscriptions, channelId]);

  const handleToggleSubscription = () => {
    const previousStatus = localSubscriptionStatus;
    const previousCount = subscribeCount;

    // Optimistically update the UI
    setLocalSubscriptionStatus(!previousStatus);
    setSubscribeCount((prev) => (previousStatus ? prev - 1 : prev + 1));

    toggleSubscriptionMutation.mutate(undefined, {
      onSuccess: (data: any) => {
        // Update with the actual data from the server
        setLocalSubscriptionStatus(data.status === "ACTIVE");
        setSubscribeCount(data.subscriberCount);
        if (data.status === "ACTIVE" && data.id !== null) {
          dispatch(
            updateSubscription({
              id: data.id,
              channelId: data.channelId,
              status: data.status,
              channelName: data.channelName,
              channelProfileImage: data.channelProfileImage,
              subscriberCount: data.subscriberCount,
            })
          );
          toast.success("Subscribed successfully");
        } else {
          dispatch(removeSubscription(channelId));
          toast.success("Unsubscribed successfully");
        }
      },
      onError: (error: Error) => {
        // Revert to the previous state if there's an error
        setLocalSubscriptionStatus(previousStatus);
        setSubscribeCount(previousCount);
        console.error("Failed to toggle subscription:", error);
        toast.error(`Failed to update subscription: ${error.message}`);
      },
      // This will cause React Query to optimistically update the cache
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["channelSubscription", channelId],
        });
      },
    });
  };

  return (
    <div className="flex flex-row w-full items-start justify-between md:justify-between lg:justify-start lg:gap-6 lg:items-start mb-4 md:mb-0">
      <div className="flex items-center w-full md:w-auto">
        <Avatar className="h-10 w-10 mr-4">
          <AvatarImage src={channelProfileImage} alt={channelName} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <div>
          <Link
            to={`/channel/${channelId}`}
            className="font-normal hover:text-primary duration-300 text-sm md:text-md line-clamp-1"
          >
            {channelName}
          </Link>
          <motion.p
            key={subscribeCount}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs md:text-sm text-muted-foreground line-clamp-1"
          >
            {subscribeCount.toLocaleString()}{" "}
            {subscribeCount === 1 ? "subscriber" : "subscribers"}
          </motion.p>
        </div>
      </div>
      <div className="pl-1 mt-2 md:mt-0 md:pl-0  md:w-auto flex justify-end items-center">
        <motion.button
          // whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleSubscription}
          disabled={toggleSubscriptionMutation.isPending}
          className={`light-beam rounded-xl border-solid border p-1.5 md:p-2 px-4 transition duration-200 w-auto
            ${
              localSubscriptionStatus
                ? "bg-muted text-muted-foreground"
                : "bg-card hover:bg-muted"
            }
            ${
              toggleSubscriptionMutation.isPending
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          `}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={localSubscriptionStatus ? "subscribed" : "subscribe"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              {localSubscriptionStatus ? "Subscribed" : "Subscribe"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default SubscribeInfo;
