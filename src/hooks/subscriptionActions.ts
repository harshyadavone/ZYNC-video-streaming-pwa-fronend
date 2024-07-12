import API from "../config/apiClient";
import { updateSubscription } from "../store/features/subscriptionSlice";
import { AppDispatch } from "../store/store";

export const fetchSubscriptions = () => async (dispatch: AppDispatch) => {
  try {
    const response = await API.get('/subscriptions/my-subscriptions');
    // @ts-ignore
    dispatch(updateSubscription(response));
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error);
  }
};

export const toggleSubscription = (channelId: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await API.post(`/subscriptions/channels/${channelId}/toggle-subscription`);
    // @ts-ignore
    dispatch(updateSubscription(response));
  } catch (error) {
    console.error('Failed to toggle subscription:', error);
  }
};